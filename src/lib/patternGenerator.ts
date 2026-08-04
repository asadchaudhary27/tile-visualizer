import type { LayoutPattern, PatternType } from './types';

function pickTileIndexForCell(type: PatternType, numTiles: number, row: number, col: number): number {
  switch (type) {
    case 'checkerboard':
      if (numTiles === 2) return (row + col) % 2;
      if (numTiles === 3) return (row % 2 === 0) ? (col % 2 === 0 ? 0 : 1) : (col % 2 === 0 ? 2 : 0);
      if (numTiles === 4) return (row % 2 === 0) ? (col % 2 === 0 ? 0 : 1) : (col % 2 === 0 ? 2 : 3);
      return 0;
    case 'stripes':
      return col % numTiles; // Supports 2-4 tiles
    case 'accent-band':
      if (numTiles === 2) return row % 4 === 0 ? 1 : 0;
      if (numTiles === 3) return row % 4 === 0 ? 1 : (row % 4 === 2 ? 2 : 0);
      if (numTiles === 4) return row % 4 === 0 ? 1 : (row % 4 === 1 ? 2 : (row % 4 === 2 ? 3 : 0));
      return 0;
    case 'random-mix':
      // To ensure seamless tiling, the pseudo-random seed must be periodic over the grid size (12x12).
      // We can use a simple hash of (row % 12) and (col % 12).
      const r = row % 12;
      const c = col % 12;
      const hash = Math.sin(r * 12.9898 + c * 78.233) * 43758.5453;
      return Math.floor((hash - Math.floor(hash)) * numTiles);
    case 'diagonal':
      // Beautiful diagonal stripes supporting 2, 3, or 4 tiles seamlessly!
      return (row + col) % numTiles;
    default:
      return 0;
  }
}

export function getGridSize(type: PatternType, numTiles: number): number {
  if (type === 'checkerboard') return 2;
  if (type === 'stripes') return numTiles; // 2, 3, or 4
  if (type === 'accent-band') return 4;
  if (type === 'random-mix') return 12; // Large enough to look random, but loops seamlessly
  if (type === 'diagonal') return numTiles;
  return 4;
}

export async function buildCombinedPattern(pattern: LayoutPattern, tileImageUrls: string[]): Promise<string> {
  const cell = 256;   // px per cell
  
  // Calculate the perfect grid size for seamless looping
  let grid = getGridSize(pattern.type, pattern.tileIds.length);

  // Load all images first
  const images = await Promise.all(tileImageUrls.map(url => {
    return new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = url;
    });
  }));

  const canvas = document.createElement('canvas');
  canvas.width = cell * grid;
  canvas.height = cell * grid;
  const ctx = canvas.getContext('2d');
  
  if (!ctx) return '';

  for (let row = 0; row < grid; row++) {
    for (let col = 0; col < grid; col++) {
      const tileIndex = pickTileIndexForCell(pattern.type, pattern.tileIds.length, row, col);
      // Fallback to first tile if out of bounds somehow
      const img = images[tileIndex] || images[0];
      if (img) {
        ctx.drawImage(img, col * cell, row * cell, cell, cell);
      }
    }
  }

  return canvas.toDataURL('image/jpeg', 0.9);
}
