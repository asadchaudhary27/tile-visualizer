import { pipeline, env } from '@xenova/transformers';
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

// Disable local models to fetch from huggingface
env.allowLocalModels = false;
env.useBrowserCache = false;

async function extractMask(result, targetLabel) {
  // result is an array of { label, mask: RawImage }
  const match = result.find(r => r.label === targetLabel);
  if (!match) return null;

  const { width, height, data } = match.mask;
  const numPixels = width * height;
  const pngData = new Uint8ClampedArray(numPixels * 4);

  // The mask data is a 1-channel Grayscale array (0-255). We convert to RGBA.
  for (let i = 0; i < numPixels; i++) {
    const val = data[i];
    pngData[i * 4 + 0] = val; // R
    pngData[i * 4 + 1] = val; // G
    pngData[i * 4 + 2] = val; // B
    pngData[i * 4 + 3] = val; // A
  }

  return { width, height, buffer: Buffer.from(pngData) };
}

async function main() {
  const roomId = process.argv[2];
  if (!roomId) {
    console.error("Usage: node scripts/trace.js <roomId>");
    process.exit(1);
  }

  let imagePath = path.join(process.cwd(), 'public', 'rooms', `${roomId}.jpg`);
  if (!fs.existsSync(imagePath)) {
    const pngPath = path.join(process.cwd(), 'public', 'rooms', `${roomId}.png`);
    if (!fs.existsSync(pngPath)) {
        console.error(`Image not found for room: ${roomId}`);
        process.exit(1);
    } else {
        imagePath = pngPath;
    }
  }

  console.log(`Loading Segmenter model...`);
  const segmenter = await pipeline('image-segmentation', 'Xenova/segformer-b0-finetuned-ade-512-512');

  console.log(`Analyzing image: ${imagePath}`);
  const result = await segmenter(imagePath);

  const outDir = path.join(process.cwd(), 'public', 'rooms', 'masks');
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  for (const target of ['floor', 'wall']) {
    console.log(`Extracting mask for: ${target}`);
    const maskInfo = await extractMask(result, target);
    
    if (maskInfo) {
      const outPath = path.join(outDir, `${roomId}-${target}.png`);
      await sharp(maskInfo.buffer, { raw: { width: maskInfo.width, height: maskInfo.height, channels: 4 } })
        .png()
        .toFile(outPath);
      console.log(`Saved mask: /rooms/masks/${roomId}-${target}.png`);
    } else {
      console.log(`Label '${target}' not found in image.`);
    }
  }
}

main();
