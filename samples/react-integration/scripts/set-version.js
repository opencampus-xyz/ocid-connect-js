#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.resolve(__dirname, '../.env') });

// Get the package.json path
const packageJsonPath = path.resolve(__dirname, '../package.json');

// Read the package.json file
const packageJson = require(packageJsonPath);

// Get the version from environment variable or use the default
const ocidVersion = process.env.OCID_VERSION || 'latest';

// Update the version in package.json
packageJson.devDependencies['@opencampus/ocid-connect-js'] = ocidVersion;

// Write the updated package.json back to disk
fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));

console.log(`\nSetting @opencampus/ocid-connect-js version to: ${ocidVersion}\n`); 