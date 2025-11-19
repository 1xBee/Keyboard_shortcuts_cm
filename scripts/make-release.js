// scripts/make-release.js
const fs = require('fs');
const path = require('path');
const archiver = require('archiver');

// Remove old release folder
const releaseDir = path.join(__dirname, '..', 'release');
if (fs.existsSync(releaseDir)) {
  fs.rmSync(releaseDir, { recursive: true, force: true });
  console.log('🗑️  Removed old release folder');
}

// Create new release folder
fs.mkdirSync(releaseDir);

// Create ZIP file
const output = fs.createWriteStream(path.join(releaseDir, 'extension.zip'));
const archive = archiver('zip', { zlib: { level: 9 } });

output.on('close', () => {
  console.log(`📦 ZIP file created: extension.zip (${archive.pointer()} bytes)`);
  console.log('🎉 Release created successfully!');
});

archive.on('error', (err) => {
  throw err;
});

archive.pipe(output);

// Add files to ZIP
const filesToZip = [
  'extension/manifest.json',
  'extension/options.html',
  'extension/src/img/nomouse.png',
  'dist/bundle.js',
  'extension/src/content/injector.js'
];

filesToZip.forEach(file => {
  const filePath = path.join(__dirname, '..', file);
  
  if (fs.existsSync(filePath)) {
    let zipPath = file;
    if (file.startsWith('extension/')) {
      zipPath = file.replace('extension/', '');
    }

    // archive.file(source, { name: destination })
    archive.file(filePath, { name: zipPath });
    
    console.log(`✅ Added ${file} -> 📂 ${zipPath}`);
  } else {
    console.error(`❌ Missing ${file}`);
  }
});

archive.finalize();