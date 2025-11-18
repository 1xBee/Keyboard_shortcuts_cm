// scripts/make-release.js
const fs = require('fs');
const path = require('path');
const crx3 = require('crx3');

// Remove old release folder
const releaseDir = path.join(__dirname, '..', 'release');
if (fs.existsSync(releaseDir)) {
  fs.rmSync(releaseDir, { recursive: true, force: true });
  console.log('🗑️  Removed old release folder');
}

// Create new release folder structure
fs.mkdirSync(releaseDir);
fs.mkdirSync(path.join(releaseDir, 'dist'));
fs.mkdirSync(path.join(releaseDir, 'src'));
fs.mkdirSync(path.join(releaseDir, 'src', 'content'));

// Copy files
const filesToCopy = [
  { from: 'manifest.json', to: 'manifest.json' },
  { from: 'options.html', to: 'options.html' },
  { from: 'nomouse.png', to: 'nomouse.png' },
  { from: 'dist/bundle.js', to: 'dist/bundle.js' },
  { from: 'src/content/injector.js', to: 'src/content/injector.js' }
];

filesToCopy.forEach(({ from, to }) => {
  const source = path.join(__dirname, '..', from);
  const dest = path.join(releaseDir, to);
  
  if (fs.existsSync(source)) {
    fs.copyFileSync(source, dest);
    console.log(`✅ Copied ${from}`);
  } else {
    console.error(`❌ Missing ${from}`);
  }
});

console.log('🎉 Release folder created successfully!');

// Create CRX file
(async () => {
  try {
    await crx3([releaseDir], {
      keyPath: path.join(__dirname, '..', 'key.pem'),
      crxPath: path.join(__dirname, '..', 'extension.crx'),
      zipPath: path.join(__dirname, '..', 'extension.zip')
    });
    
    console.log('📦 CRX file created: extension.crx');
    console.log('📦 ZIP file created: extension.zip');
  } catch (err) {
    console.error('❌ Error creating CRX:', err.message);
  }
})();