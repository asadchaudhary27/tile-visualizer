export type Material = 'ceramic' | 'marble' | 'mixed' | 'custom';
export type Finish = 'matte' | 'glossy' | 'textured';

export interface Tile {
  id: string;
  name: string;
  material: Material;
  finish: Finish;
  imageUrl: string;       // seamless square texture, 512x512 or 1024x1024
  swatchUrl?: string;     // small thumbnail for the picker grid; falls back to imageUrl
  pricePerSqFt: number;   // e.g. 4.50
}

export interface Surface {
  id: string;                    // e.g. "living-room-floor", "living-room-wall-north"
  roomId: string;
  type: 'wall' | 'floor';
  label: string;                 // "North Wall", "Floor" — shown in UI
  polygon: [number, number][];   // PERCENTAGE coords (0–100), not pixels — see Section 7
  path?: string;                 // Optional SVG path string (percentage coords) for complex shapes with holes
  areaSqFt: number;              // Physical area of the surface in square feet
  maskUrl?: string;              // Base64 PNG URL or path of the AI-generated mask
  // 3D CSS Properties
  perspective?: number;          // e.g., 1000px
  rotateX?: number;              // e.g., 60deg
  rotateY?: number;              // e.g., 0deg
  rotateZ?: number;              // e.g., 0deg
  scale?: number;                // e.g., 1
  panX?: number;                 // % offset
  panY?: number;                 // % offset
}

export interface Room {
  id: string;
  name: string;
  thumbnailUrl: string;
  imageUrl: string;
  surfaces: Surface[];
}

export type PatternType = 'checkerboard' | 'stripes' | 'accent-band' | 'random-mix' | 'diagonal';

export interface LayoutPattern {
  type: PatternType;
  tileIds: string[];   // 2 to 4 tile ids
  gridSize?: number;   // The calculated dimension of the generated NxN pattern grid
}

export type SurfaceFinish = 'glossy' | 'matte' | 'satin';

export interface SurfaceConfig {
  surfaceId: string;
  mode: 'single' | 'layout';
  tileId?: string;
  layout?: LayoutPattern;
  generatedPatternUrl?: string;
  tileSizeId?: string; // references TILE_SIZES[].id
  rotationDegree?: number; // Optional tile rotation in degrees (e.g., 0, 45, 90)
  finish?: SurfaceFinish;
  groutColor?: string;
  groutThickness?: number;
}

export interface TileSize {
  id: string;
  widthIn: number;
  heightIn: number;
  label: string;
}

export interface RoomDimensions {
  length: number; // in meters (Z-axis)
  width: number;  // in meters (X-axis)
  height: number; // in meters (Y-axis)
}

export interface PlacedObject {
  id: string;
  assetType: string;
  position: [number, number, number];
  rotation: [number, number, number];
  size?: [number, number, number];
  scale?: number;
}
