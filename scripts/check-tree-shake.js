const fs = require('fs');
const os = require('os');
const path = require('path');
const { execSync } = require('child_process');
const esbuild = require('esbuild');

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

    const entryFilePath = path.join(tempDir, 'entry-sdk.js');
    fs.writeFileSync(
      entryFilePath,
      "import { OCAuthSandbox } from '@opencampus/ocid-connect-js/sdk';\nconsole.log(OCAuthSandbox);\n",
      'utf8'
    );

    const result = await esbuild.build({
      entryPoints: [entryFilePath],
      bundle: true,
      format: 'esm',
      platform: 'browser',
      minify: true,
      metafile: true,
      write: false,
      logLevel: 'silent',
    });

    const inputPaths = Object.keys(result.metafile.inputs);
    const airKitInputs = inputPaths.filter((inputPath) =>
      inputPath.includes(`${path.sep}@mocanetwork${path.sep}airkit${path.sep}`)
    );

    if (airKitInputs.length > 0) {
      console.error('\n[tree-shake-check] FAILED: AirKit is present in SDK-only bundle graph.');
      console.error('[tree-shake-check] Matched inputs:');
      airKitInputs.forEach((inputPath) => console.error(`  - ${inputPath}`));
      process.exit(1);
    }

    console.log('[tree-shake-check] PASS: AirKit is not present in SDK-only bundle graph.');
  } finally {
    removeIfExists(tempDir);
    removeIfExists(path.join(repoRoot, packedFileName));
  }
}

main().catch((error) => {
  console.error('\n[tree-shake-check] ERROR:', error.message);
  process.exit(1);
});
