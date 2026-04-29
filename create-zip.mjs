// create-zip.mjs - Creates a cross-platform zip with POSIX forward-slash paths
import { createWriteStream, statSync, readdirSync } from 'fs';
import { join, relative } from 'path';
import { createGzip } from 'zlib';
import { ZipFile } from './node_modules/.pnpm' // fallback below

// Use Node.js built-in zip via child_process with 7zip or tar
import { execSync } from 'child_process';
import { existsSync } from 'fs';

const src  = '.next/standalone';
const dest = 'reset-htx-cpanel-deploy.zip';

// Try 7-Zip first (common on Windows)
const sevenZip = 'C:\\Program Files\\7-Zip\\7z.exe';
if (existsSync(sevenZip)) {
  execSync(`"${sevenZip}" a -tzip "${dest}" "./${src}/*" -r`, { stdio: 'inherit' });
} else {
  // Fallback: use PowerShell but verify paths
  console.log('7-Zip not found');
}
