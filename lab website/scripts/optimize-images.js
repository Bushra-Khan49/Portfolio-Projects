const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const PUBLIC_DIR = path.join(__dirname, '../public');
const EXTENSIONS = ['.png', '.jpg', '.jpeg'];

async function optimizeImages() {
    console.log('🚀 Starting Image Optimization (WebP Conversion)...');
    
    const files = fs.readdirSync(PUBLIC_DIR);
    
    for (const file of files) {
        const ext = path.extname(file).toLowerCase();
        if (EXTENSIONS.includes(ext)) {
            const inputPath = path.join(PUBLIC_DIR, file);
            const outputPath = path.join(PUBLIC_DIR, file.replace(ext, '.webp'));
            
            if (!fs.existsSync(outputPath)) {
                console.log(`📦 Converting ${file} to WebP...`);
                await sharp(inputPath)
                    .webp({ quality: 80 })
                    .toFile(outputPath);
                console.log(`✅ Optimized: ${file}`);
            }
        }
    }
    console.log('✨ Image Optimization Complete.');
}

optimizeImages().catch(err => console.error('❌ Optimization failed:', err));
