const sharp = require('sharp');
const fs = require('fs');
const path = require('path');
const https = require('https');

const targetSize = 800;
const outputDir = path.join(__dirname, 'public', 'updatedcollabs');

// Create output directory if it doesn't exist
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Define images to resize
const images = [
  { source: 'public/sq/logo2.png', output: 'square_knots.png' },
  { source: 'public/optimized/serafinilogo.webp', output: 'serafini.webp' },
  { source: 'public/assets/dimensions.png', output: 'dimension.png' },
  { source: 'public/assets/quary.png', output: 'the_quarry.png' },
  { source: 'public/assets/bft.png', output: 'bft.png' },
  { source: 'public/assets/fm.png', output: 'marble.png' },
  { source: 'public/assets/casa2.png', output: 'casa.png' },
  { source: 'public/assets/arjunrathilogo2.png', output: 'arjun_rathi.png' },
];

// Function to resize image
async function resizeImage(sourcePath, outputName) {
  const inputPath = path.join(__dirname, sourcePath);
  const outputPath = path.join(outputDir, outputName);

  try {
    if (!fs.existsSync(inputPath)) {
      console.log(`❌ Source not found: ${sourcePath}`);
      return;
    }

    await sharp(inputPath)
      .resize(targetSize, targetSize, {
        fit: 'contain',
        background: { r: 0, g: 0, b: 0, alpha: 0 }, // Transparent background
      })
      .toFile(outputPath);

    console.log(`✅ Resized: ${sourcePath} -> ${outputName}`);
  } catch (error) {
    console.error(`❌ Error resizing ${sourcePath}:`, error.message);
  }
}

// Function to download and resize Top Brewer logo
async function downloadAndResizeTopBrewer() {
  const url =
    'https://www.topbrewernyc.com/wp-content/uploads/2023/06/TopBrewer-logo-white.png';
  const outputPath = path.join(outputDir, 'top_brewer.png');
  const tempPath = path.join(__dirname, 'temp_topbrewer.png');

  return new Promise((resolve, reject) => {
    https
      .get(url, (response) => {
        if (response.statusCode !== 200) {
          console.log(
            `❌ Failed to download Top Brewer logo: ${response.statusCode}`,
          );
          resolve();
          return;
        }

        const fileStream = fs.createWriteStream(tempPath);
        response.pipe(fileStream);

        fileStream.on('finish', async () => {
          fileStream.close();
          try {
            await sharp(tempPath)
              .resize(targetSize, targetSize, {
                fit: 'contain',
                background: { r: 0, g: 0, b: 0, alpha: 0 },
              })
              .toFile(outputPath);

            fs.unlinkSync(tempPath); // Clean up temp file
            console.log(`✅ Downloaded and resized: Top Brewer logo`);
            resolve();
          } catch (error) {
            console.error(
              `❌ Error processing Top Brewer logo:`,
              error.message,
            );
            resolve();
          }
        });
      })
      .on('error', (error) => {
        console.error(`❌ Error downloading Top Brewer logo:`, error.message);
        resolve();
      });
  });
}

// Main execution
async function main() {
  console.log('🎨 Starting image resize process...\n');
  console.log(`Target size: ${targetSize}x${targetSize}px`);
  console.log(`Output directory: ${outputDir}\n`);

  // Resize local images
  for (const img of images) {
    await resizeImage(img.source, img.output);
  }

  // Download and resize Top Brewer logo
  await downloadAndResizeTopBrewer();

  console.log('\n✨ All images processed successfully!');
  console.log(`📁 Check the output in: ${outputDir}`);
}

main().catch(console.error);
