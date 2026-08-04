import type { TileSize } from '../lib/types';

// Physical tile sizes (inches). Width × Height.
// Scale: assume room is 15 feet = 180 inches wide, displayed at ~96% of SVG width.
// pixelsPerInch = (svgWidth * 0.96) / 180  (computed dynamically in RoomEditorScreen)
export const TILE_SIZES: TileSize[] = [
  { id: '16x16',  widthIn: 16, heightIn: 16,  label: '16" × 16"'  },
  { id: '12x24',  widthIn: 12, heightIn: 24,  label: '12" × 24"'  },
  { id: '12x30',  widthIn: 12, heightIn: 30,  label: '12" × 30"'  },
  { id: '8x48',   widthIn:  8, heightIn: 48,  label: '8" × 48"'   },
  { id: '12x48',  widthIn: 12, heightIn: 48,  label: '12" × 48"'  },
  { id: '18x36',  widthIn: 18, heightIn: 36,  label: '18" × 36"'  },
  { id: '24x36',  widthIn: 24, heightIn: 36,  label: '24" × 36"'  },
  { id: '24x48',  widthIn: 24, heightIn: 48,  label: '24" × 48"'  },
  { id: '32x48',  widthIn: 32, heightIn: 48,  label: '32" × 48"'  },
  { id: '30x60',  widthIn: 30, heightIn: 60,  label: '30" × 60"'  },
  { id: '36x72',  widthIn: 36, heightIn: 72,  label: '36" × 72"'  },
  { id: '48x96',  widthIn: 48, heightIn: 96,  label: '48" × 96"'  },
];

export const DEFAULT_TILE_SIZE_ID = '24x48';
