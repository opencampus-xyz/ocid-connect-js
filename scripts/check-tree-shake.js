const fs = require('fs');
const os = require('os');
const path = require('path');
const { execSync } = require('child_process');
const esbuild = require('esbuild');
const AIRKIT_INPUT_PATTERN = /(^|\/)node_modules\/@mocanetwork\/airkit\//;

function run(command, cwd, silent = false) {
  const output = execSync(command, {
    cwd,
    stdio: silent ? ['ignore', 'pipe', 'pipe'] : 'inherit',
    encoding: 'utf8',
  });

  if (typeof output !== 'string') {
    return '';
  }

  return output.trim();
}

function removeIfExists(targetPath) {
  if (fs.existsSync(targetPath)) {
    fs.rmSync(targetPath, { recursive: true, force: true });
  }
}

function getAirKitInputs(metafile) {
  const inputPaths = Object.keys(metafile.inputs);
  return inputPaths.filter((inputPath) => {
    const normalizedInputPath = inputPath.replace(/\\/g, '/');
    return AIRKIT_INPUT_PATTERN.test(normalizedInputPath);
  });
}

async function bundleAndCollectAirKitInputs({ tempDir, entryFileName, entrySource, external = [] }) {
  const entryFilePath = path.join(tempDir, entryFileName);
  const outputFilePath = path.join(tempDir, `${entryFileName}.bundle.js`);
  fs.writeFileSync(entryFilePath, entrySource, 'utf8');

  const result = await esbuild.build({
    entryPoints: [entryFilePath],
    bundle: true,
    format: 'esm',
    platform: 'browser',
    outfile: outputFilePath,
    minify: true,
    metafile: true,
    write: false,
    external,
    logLevel: 'silent',
  });

  return getAirKitInputs(result.metafile);
}

async function assertNoAirKitInBundle({ tempDir, entryFileName, entrySource, label, external = [] }) {
  const airKitInputs = await bundleAndCollectAirKitInputs({
    tempDir,
    entryFileName,
    entrySource,
    external,
  });

  if (airKitInputs.length > 0) {
    console.error(`\n[tree-shake-check] FAILED: AirKit is present in ${label} bundle graph.`);
    console.error('[tree-shake-check] Matched inputs:');
    airKitInputs.forEach((inputPath) => console.error(`  - ${inputPath}`));
    process.exit(1);
  }

  console.log(`[tree-shake-check] PASS: AirKit is not present in ${label} bundle graph.`);
}

async function assertAirKitInBundle({ tempDir, entryFileName, entrySource, label, external = [] }) {
  const airKitInputs = await bundleAndCollectAirKitInputs({
    tempDir,
    entryFileName,
    entrySource,
    external,
  });

  if (airKitInputs.length === 0) {
    console.error(`\n[tree-shake-check] FAILED: AirKit is missing from ${label} bundle graph.`);
    console.error('[tree-shake-check] Expected AirKit to be included for this entrypoint.');
    process.exit(1);
  }

  console.log(`[tree-shake-check] PASS: AirKit is present in ${label} bundle graph.`);
}

async function main() {
  const repoRoot = path.resolve(__dirname, '..');

  run('npm run lib', repoRoot);

  const packedFileName = run('npm pack --silent', repoRoot, true)
    .split('\n')
    .pop();
  const packedFilePath = path.join(repoRoot, packedFileName);

  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'ocid-tree-shake-'));

  try {
    run('npm init -y', tempDir, true);
    run(`npm install --no-audit --no-fund "${packedFilePath}"`, tempDir, true);

    await assertNoAirKitInBundle({
      tempDir,
      entryFileName: 'entry-sdk.js',
      entrySource: "import { OCAuthSandbox } from '@opencampus/ocid-connect-js/sdk';\nconsole.log(OCAuthSandbox);\n",
      label: 'SDK-only',
    });

    await assertNoAirKitInBundle({
      tempDir,
      entryFileName: 'entry-react.js',
      entrySource: "import { OCConnect } from '@opencampus/ocid-connect-js/react';\nconsole.log(OCConnect);\n",
      label: 'React',
      external: ['react', 'react-dom'],
    });

    await assertAirKitInBundle({
      tempDir,
      entryFileName: 'entry-sdk-airkit.js',
      entrySource: "import '@opencampus/ocid-connect-js/sdk/airkit';\nconsole.log('airkit-enabled');\n",
      label: 'SDK AirKit opt-in',
    });
  } finally {
    removeIfExists(tempDir);
    removeIfExists(path.join(repoRoot, packedFileName));
  }
}

main().catch((error) => {
  console.error('\n[tree-shake-check] ERROR:', error.message);
  process.exit(1);
});
