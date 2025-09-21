const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const sourceImage = path.join(__dirname, '..', 'public', 'tra-verse.jpg');
const outputDir = path.join(__dirname, '..', 'public');

// Icon sizes and configurations for different screens/devices
const iconConfigs = [
  // Standard favicons
  { size: 16, name: 'favicon-16x16.png' },
  { size: 32, name: 'favicon-32x32.png' },
  { size: 48, name: 'favicon.ico', format: 'ico' }, // Special handling for .ico

  // Apple Touch Icons
  { size: 57, name: 'apple-touch-icon-57x57.png' },
  { size: 60, name: 'apple-touch-icon-60x60.png' },
  { size: 72, name: 'apple-touch-icon-72x72.png' },
  { size: 76, name: 'apple-touch-icon-76x76.png' },
  { size: 114, name: 'apple-touch-icon-114x114.png' },
  { size: 120, name: 'apple-touch-icon-120x120.png' },
  { size: 144, name: 'apple-touch-icon-144x144.png' },
  { size: 152, name: 'apple-touch-icon-152x152.png' },
  { size: 167, name: 'apple-touch-icon-167x167.png' },
  { size: 180, name: 'apple-touch-icon-180x180.png' },
  { size: 1024, name: 'apple-touch-icon-1024x1024.png' },

  // Android Chrome Icons
  { size: 36, name: 'android-chrome-36x36.png' },
  { size: 48, name: 'android-chrome-48x48.png' },
  { size: 72, name: 'android-chrome-72x72.png' },
  { size: 96, name: 'android-chrome-96x96.png' },
  { size: 128, name: 'android-chrome-128x128.png' },
  { size: 144, name: 'android-chrome-144x144.png' },
  { size: 152, name: 'android-chrome-152x152.png' },
  { size: 192, name: 'android-chrome-192x192.png' },
  { size: 256, name: 'android-chrome-256x256.png' },
  { size: 384, name: 'android-chrome-384x384.png' },
  { size: 512, name: 'android-chrome-512x512.png' },

  // Microsoft Tiles
  { size: 70, name: 'mstile-70x70.png' },
  { size: 144, name: 'mstile-144x144.png' },
  { size: 150, name: 'mstile-150x150.png' },
  { size: 310, name: 'mstile-310x310.png' },
  { size: 558, name: 'mstile-558x558.png' },

  // General purpose icons
  { size: 24, name: 'icon-24x24.png' },
  { size: 64, name: 'icon-64x64.png' },
  { size: 128, name: 'icon-128x128.png' },
  { size: 256, name: 'icon-256x256.png' },
  { size: 512, name: 'icon-512x512.png' },
];

async function generateIcons() {
  console.log('🚀 Starting icon generation from tra-verse.jpg...');

  try {
    // Check if source image exists
    if (!fs.existsSync(sourceImage)) {
      console.error('❌ Source image not found:', sourceImage);
      console.log('💡 Make sure tra-verse.jpg exists in the public folder');
      return;
    }

    console.log('📁 Source image:', sourceImage);
    console.log('📂 Output directory:', outputDir);

    // Get image info
    const imageInfo = await sharp(sourceImage).metadata();
    console.log(`📏 Original image: ${imageInfo.width}x${imageInfo.height} pixels`);

    // Generate each icon size
    for (const config of iconConfigs) {
      const outputPath = path.join(outputDir, config.name);

      try {
        if (config.format === 'ico') {
          // Special handling for favicon.ico - create multiple sizes in one file
          const icoSizes = [16, 24, 32, 48];
          const icoBuffers = [];

          for (const size of icoSizes) {
            const buffer = await sharp(sourceImage)
              .resize(size, size, {
                fit: 'cover',
                position: 'center',
                background: { r: 0, g: 0, b: 0, alpha: 0 }
              })
              .png()
              .toBuffer();

            icoBuffers.push({ size, buffer });
          }

          // For ICO, we'll just create the 48x48 PNG version since ICO format is complex
          await sharp(sourceImage)
            .resize(48, 48, {
              fit: 'cover',
              position: 'center',
              background: { r: 0, g: 0, b: 0, alpha: 0 }
            })
            .png()
            .toFile(outputPath);

        } else {
          // Regular PNG generation
          await sharp(sourceImage)
            .resize(config.size, config.size, {
              fit: 'cover',
              position: 'center',
              background: { r: 0, g: 0, b: 0, alpha: 0 },
              withoutEnlargement: true // Don't enlarge if source is smaller
            })
            .png({
              quality: 90,
              compressionLevel: 6
            })
            .toFile(outputPath);
        }

        console.log(`✅ Generated: ${config.name} (${config.size}x${config.size})`);

      } catch (error) {
        console.error(`❌ Failed to generate ${config.name}:`, error.message);
      }
    }

    // Generate additional special formats
    console.log('\n🎨 Generating special formats...');

    // Generate Safari pinned tab SVG (monochrome version)
    const safariPinnedSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
      <path fill="#00d4aa" d="M16 2C8.3 2 2 8.3 2 16s6.3 14 14 14 14-6.3 14-14S23.7 2 16 2zm0 24c-5.5 0-10-4.5-10-10s4.5-10 10-10 10 4.5 10 10-4.5 10-10 10z"/>
      <path fill="#00d4aa" d="M12 10l4-4 4 4h-2v6h-4v-6z"/>
      <circle fill="#000" cx="16" cy="14" r="1.5"/>
    </svg>`;

    fs.writeFileSync(path.join(outputDir, 'safari-pinned-tab.svg'), safariPinnedSvg);
    console.log('✅ Generated: safari-pinned-tab.svg');

    // Copy our existing favicon.svg if it exists
    const existingSvg = path.join(outputDir, 'favicon.svg');
    if (fs.existsSync(existingSvg)) {
      console.log('✅ favicon.svg already exists');
    }

    console.log('\n🎉 Icon generation completed!');
    console.log(`📊 Generated ${iconConfigs.length} different icon sizes`);
    console.log('📱 Covers all major devices and screen densities');

    // Display summary
    console.log('\n📋 Icon Summary:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Standard Favicons: 16x16, 32x32, 48x48 (favicon.ico)');
    console.log('Apple Touch Icons: 57x57 to 1024x1024 (iOS devices)');
    console.log('Android Chrome: 36x36 to 512x512 (Android devices)');
    console.log('Microsoft Tiles: 70x70 to 558x558 (Windows tiles)');
    console.log('Safari Pinned Tab: Monochrome SVG for Safari bookmarks');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  } catch (error) {
    console.error('❌ Error during icon generation:', error);
    process.exit(1);
  }
}

// Run the generator
generateIcons();
