import type { Tile } from '../lib/types';

function makeTileSVG(
  baseColor: string,
  groutColor: string = '#d0cbc4',
  pattern?: 'plain' | 'marble' | 'checker' | 'hex' | 'subway'
): string {
  const size = 128;

  let tileFill = '';
  if (pattern === 'marble') {
    tileFill = `
      <defs>
        <filter id="marble-noise">
          <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="4" result="noise"/>
          <feColorMatrix type="saturate" values="0" in="noise" result="grey"/>
          <feBlend in="SourceGraphic" in2="grey" mode="overlay"/>
        </filter>
      </defs>
      <rect width="${size}" height="${size}" fill="${baseColor}" filter="url(#marble-noise)" opacity="0.95"/>
    `;
  } else {
    // Return a single solid tile texture. TileSurface3D will handle the grout gap sizing.
    tileFill = `<rect width="${size}" height="${size}" fill="${baseColor}"/>`;
  }

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}">${tileFill}</svg>`;
  return `data:image/svg+xml;base64,${btoa(svg)}`;
}

export const TILES: Tile[] = [
  // ── CERAMIC MATTE ──────────────────────────────────────────
  {
    id: 't-cer-mat-grey',
    name: 'Concrete Grey',
    material: 'ceramic',
    finish: 'matte',
    imageUrl: makeTileSVG('#a8a29e', '#78716c'),
    pricePerSqFt: 3.50,
  },
  {
    id: 't-cer-mat-white',
    name: 'Chalk White',
    material: 'ceramic',
    finish: 'matte',
    imageUrl: makeTileSVG('#f5f5f4', '#d6d3d1'),
    pricePerSqFt: 3.25,
  },
  {
    id: 't-cer-mat-terracotta',
    name: 'Terracotta',
    material: 'ceramic',
    finish: 'matte',
    imageUrl: makeTileSVG('#b45309', '#92400e'),
    pricePerSqFt: 4.00,
  },
  {
    id: 't-cer-mat-sage',
    name: 'Sage Green',
    material: 'ceramic',
    finish: 'matte',
    imageUrl: makeTileSVG('#84a98c', '#6b8f71'),
    pricePerSqFt: 4.50,
  },
  {
    id: 't-cer-mat-clay',
    name: 'Clay Beige',
    material: 'ceramic',
    finish: 'matte',
    imageUrl: makeTileSVG('#d5bfa1', '#b8967e'),
    pricePerSqFt: 3.75,
  },

  // ── CERAMIC GLOSSY ─────────────────────────────────────────
  {
    id: 't-cer-glo-white',
    name: 'Glossy White',
    material: 'ceramic',
    finish: 'glossy',
    imageUrl: makeTileSVG('#f8fafc', '#e2e8f0', 'subway'),
    pricePerSqFt: 5.00,
  },
  {
    id: 't-cer-glo-teal',
    name: 'Teal Glaze',
    material: 'ceramic',
    finish: 'glossy',
    imageUrl: makeTileSVG('#0d9488', '#0f766e'),
    pricePerSqFt: 6.50,
  },
  {
    id: 't-cer-glo-navy',
    name: 'Navy Blue',
    material: 'ceramic',
    finish: 'glossy',
    imageUrl: makeTileSVG('#1e3a5f', '#162c4a'),
    pricePerSqFt: 6.50,
  },
  {
    id: 't-cer-glo-black',
    name: 'Jet Black',
    material: 'ceramic',
    finish: 'glossy',
    imageUrl: makeTileSVG('#1c1917', '#0c0a09'),
    pricePerSqFt: 5.50,
  },

  // ── MARBLE ─────────────────────────────────────────────────
  {
    id: 't-mar-white',
    name: 'Statuario White',
    material: 'marble',
    finish: 'glossy',
    imageUrl: makeTileSVG('#f8f8f6', '#e8e6e1', 'marble'),
    pricePerSqFt: 14.50,
  },
  {
    id: 't-mar-nero',
    name: 'Nero Marquina',
    material: 'marble',
    finish: 'glossy',
    imageUrl: makeTileSVG('#1a1a1a', '#2d2d2d', 'marble'),
    pricePerSqFt: 16.00,
  },
  {
    id: 't-mar-cream',
    name: 'Travertino Noce',
    material: 'marble',
    finish: 'glossy',
    imageUrl: makeTileSVG('#f0ebe1', '#d5c9b8', 'marble'),
    pricePerSqFt: 12.50,
  },
  {
    id: 't-mar-emerald',
    name: 'Emerald Green',
    material: 'marble',
    finish: 'glossy',
    imageUrl: makeTileSVG('#064e3b', '#022c22', 'marble'),
    pricePerSqFt: 18.00,
  },

  // ── MIXED / TEXTURED ───────────────────────────────────────
  {
    id: 't-mix-sand',
    name: 'Pietra Serena',
    material: 'mixed',
    finish: 'textured',
    imageUrl: makeTileSVG('#c2a87a', '#a08060'),
    pricePerSqFt: 8.50,
  },
  {
    id: 't-mix-slate',
    name: 'Ardesia Grigia',
    material: 'mixed',
    finish: 'textured',
    imageUrl: makeTileSVG('#374151', '#1f2937'),
    pricePerSqFt: 9.00,
  },
  {
    id: 't-mix-terrazzo',
    name: 'Terrazzo Milano',
    material: 'mixed',
    finish: 'textured',
    imageUrl: makeTileSVG('#e5e5e5', '#d4d4d4', 'marble'),
    pricePerSqFt: 11.00,
  },

  // ── CUSTOM IMAGES ──────────────────────────────────────────
  {
    id: 't-custom-concrete',
    name: 'Real Concrete',
    material: 'custom',
    finish: 'matte',
    imageUrl: '/tiles/concrete.png',
    pricePerSqFt: 5.00,
  },
  {
    id: 't-custom-subway',
    name: 'Real Subway',
    material: 'custom',
    finish: 'glossy',
    imageUrl: '/tiles/subway.png',
    pricePerSqFt: 6.00,
  },
  {
    id: 't-custom-t1-1',
    name: 'T1 Design 1',
    material: 'custom',
    finish: 'glossy',
    imageUrl: '/tiles/T1 (1).jpg',
    pricePerSqFt: 7.00,
  },
  {
    id: 't-custom-t1-2',
    name: 'T1 Design 2',
    material: 'custom',
    finish: 'glossy',
    imageUrl: '/tiles/T1 (2).jpg',
    pricePerSqFt: 7.00,
  },
  {
    id: 't-custom-t1-3',
    name: 'T1 Design 3',
    material: 'custom',
    finish: 'glossy',
    imageUrl: '/tiles/T1 (3).jpg',
    pricePerSqFt: 7.00,
  },
  {
    id: 't-custom-t1-4',
    name: 'T1 Design 4',
    material: 'custom',
    finish: 'glossy',
    imageUrl: '/tiles/T1 (4).jpg',
    pricePerSqFt: 7.00,
  },
  {
    id: 't-custom-t1-5',
    name: 'T1 Design 5',
    material: 'custom',
    finish: 'glossy',
    imageUrl: '/tiles/T1 (5).jpg',
    pricePerSqFt: 7.00,
  },
  {
    id: 't-custom-t1-6',
    name: 'T1 Design 6',
    material: 'custom',
    finish: 'glossy',
    imageUrl: '/tiles/T1 (6).jpg',
    pricePerSqFt: 7.00,
  },
  {
    id: 't-custom-t1-7',
    name: 'T1 Design 7',
    material: 'custom',
    finish: 'glossy',
    imageUrl: '/tiles/T1 (7).jpg',
    pricePerSqFt: 7.00,
  },
];
