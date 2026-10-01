const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const imgDir = path.join(__dirname, 'public', 'images');

async function convertImages() {
    const files = fs.readdirSync(imgDir);
    for (const file of files) {
        if (file.endsWith('.png') || file.endsWith('.jpg') || file.endsWith('.jpeg')) {
            const ext = path.extname(file);
            const baseName = path.basename(file, ext);
            const outPath = path.join(imgDir, `${baseName}.webp`);
            const inPath = path.join(imgDir, file);
            
            console.log(`Converting ${file} to WebP...`);
            await sharp(inPath)
                .webp({ quality: 80 })
                .toFile(outPath);
            
            console.log(`Saved ${baseName}.webp`);
            
            // Delete original file to save space? Nah we keep it or just replace usage.
            // Let's replace usage in codebase later.
        }
    }
}

convertImages().catch(console.error);
