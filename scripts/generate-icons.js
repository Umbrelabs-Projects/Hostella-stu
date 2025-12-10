/**
 * Script to generate PWA icons from the logo
 * 
 * Install dependencies first:
 * npm install --save-dev sharp
 * 
 * Then run: node scripts/generate-icons.js
 */

const fs = require('fs');
const path = require('path');

// Check if sharp is available
let sharp;
try {
  sharp = require('sharp');
} catch (e) {
  console.error('Error: sharp is not installed.');
  console.log('Please install it by running: npm install --save-dev sharp');
  process.exit(1);
}

const logoPath = path.join(__dirname, '../public/logo.png');
const iconsDir = path.join(__dirname, '../public/icons');

// Icon sizes needed for PWA
const iconSizes = [72, 96, 128, 144, 152, 192, 384, 512];

// Create icons directory if it doesn't exist
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

// Check if logo exists
if (!fs.existsSync(logoPath)) {
  console.error(`Error: Logo not found at ${logoPath}`);
  process.exit(1);
}

console.log('Generating PWA icons...');

// Generate icons
Promise.all(
  iconSizes.map((size) => {
    const outputPath = path.join(iconsDir, `icon-${size}x${size}.png`);
    return sharp(logoPath)
      .resize(size, size, {
        fit: 'contain',
        background: { r: 255, g: 255, b: 255, alpha: 1 }
      })
      .toFile(outputPath)
      .then(() => {
        console.log(`✓ Generated icon-${size}x${size}.png`);
      })
      .catch((err) => {
        console.error(`✗ Failed to generate icon-${size}x${size}.png:`, err.message);
      });
  })
)
  .then(() => {
    console.log('\n✅ All icons generated successfully!');
    console.log(`Icons saved to: ${iconsDir}`);
  })
  .catch((err) => {
    console.error('Error generating icons:', err);
    process.exit(1);
  });

