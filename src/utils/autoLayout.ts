import { v4 as uuidv4 } from 'uuid';
import type { RoomDimensions, PlacedObject } from '../lib/types';

const ASSET_CATALOG = {
  bedroom: [
    { type: 'glb:BED/1 (14)', group: 'bed', depth: 2.2, width: 1.6 },
    { type: 'glb:BED/1 (13)', group: 'bed', depth: 2.2, width: 1.8 },
    { type: 'glb:BED/1 (42)', group: 'bed', depth: 2.2, width: 1.8 },
    { type: 'glb:TABLE/1 (52)', group: 'storage', depth: 0.6, width: 1.2 },
    { type: 'glb:TABLE/1 (49)', group: 'accent', depth: 0.4, width: 0.5 },
  ],
  kitchen: [
    { type: 'glb:KITCHEN/1 (11)', group: 'island', depth: 1.0, width: 2.5 },
    { type: 'glb:KITCHEN/1 (15)', group: 'cabinets', depth: 0.6, width: 3.0 },
    { type: 'glb:TABLE/1 (10)', group: 'dining', depth: 1.0, width: 1.8 },
  ],
  bathroom: [
    { type: 'glb:VANITY/1 (35)', group: 'vanity', depth: 0.6, width: 1.2 },
    { type: 'glb:VANITY/1 (37)', group: 'vanity', depth: 0.6, width: 1.8 },
    { type: 'glb:ROOM/1 (28)', group: 'toilet', depth: 0.7, width: 0.4 },
  ]
};

const COMMON_ACCENTS = [
  { type: 'glb:1 (34)', depth: 0.5, width: 0.5 },
  { type: 'glb:1 (39)', depth: 0.4, width: 0.4 },
  { type: 'glb:1 (40)', depth: 0.5, width: 0.5 }
];

function getRandomItem(arr: any[]) {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function generateAutoLayoutData(dimensions: RoomDimensions, roomType: string): PlacedObject[] {
  const objects: PlacedObject[] = [];
  const r = Math.random;

  // 1. Always place a door centered on the front wall
  objects.push({
    id: uuidv4(),
    assetType: 'Door',
    position: [0, 0, dimensions.length / 2],
    rotation: [0, Math.PI, 0]
  });

  const w2 = dimensions.width / 2;
  const d2 = dimensions.length / 2;

  const type = roomType || 'empty';
  
  if (type === 'bedroom') {
    const bed = getRandomItem(ASSET_CATALOG.bedroom.filter(i => i.group === 'bed'));
    const storage = getRandomItem(ASSET_CATALOG.bedroom.filter(i => i.group === 'storage'));
    
    // Bed against back wall
    objects.push({
      id: uuidv4(),
      assetType: bed.type,
      position: [0, 0, -d2 + bed.depth / 2 + 0.1],
      rotation: [0, 0, 0]
    });

    // Nightstands
    if (r() > 0.3 && dimensions.width > bed.width + 1.2) {
      objects.push({
        id: uuidv4(),
        assetType: 'Nightstand',
        position: [-bed.width / 2 - 0.3, 0, -d2 + 0.2],
        rotation: [0, 0, 0]
      });
      objects.push({
        id: uuidv4(),
        assetType: 'Nightstand',
        position: [bed.width / 2 + 0.3, 0, -d2 + 0.2],
        rotation: [0, 0, 0]
      });
    }

    // Wardrobe on left or right wall
    const side = r() > 0.5 ? 1 : -1;
    objects.push({
      id: uuidv4(),
      assetType: storage.type,
      position: [side * (w2 - storage.depth / 2 - 0.1), 0, r() * (d2 - 1)],
      rotation: [0, side > 0 ? -Math.PI / 2 : Math.PI / 2, 0]
    });

  } else if (type === 'kitchen') {
    const island = getRandomItem(ASSET_CATALOG.kitchen.filter(i => i.group === 'island'));
    const cabs = getRandomItem(ASSET_CATALOG.kitchen.filter(i => i.group === 'cabinets'));
    
    // Cabinets against back wall
    objects.push({
      id: uuidv4(),
      assetType: cabs.type,
      position: [0, 0, -d2 + cabs.depth / 2 + 0.1],
      rotation: [0, 0, 0]
    });

    // Island in middle
    if (dimensions.length > 4) {
      objects.push({
        id: uuidv4(),
        assetType: island.type,
        position: [0, 0, -d2 + cabs.depth + 1.2],
        rotation: [0, 0, 0]
      });
    }

  } else if (type === 'bathroom') {
    const vanity = getRandomItem(ASSET_CATALOG.bathroom.filter(i => i.group === 'vanity'));
    const toilet = getRandomItem(ASSET_CATALOG.bathroom.filter(i => i.group === 'toilet'));
    
    // Vanity against back wall
    objects.push({
      id: uuidv4(),
      assetType: vanity.type,
      position: [0, 0, -d2 + vanity.depth / 2 + 0.1],
      rotation: [0, 0, 0]
    });

    // Toilet next to vanity
    objects.push({
      id: uuidv4(),
      assetType: toilet.type,
      position: [vanity.width / 2 + 0.6, 0, -d2 + toilet.depth / 2 + 0.1],
      rotation: [0, 0, 0]
    });
  }

  // Common Accents (Randomly scatter 1-3 plants/lamps)
  if (type !== 'empty') {
    const numAccents = Math.floor(r() * 3) + 1;
    for (let i=0; i<numAccents; i++) {
      const accent = getRandomItem(COMMON_ACCENTS);
      objects.push({
        id: uuidv4(),
        assetType: accent.type,
        position: [(r() * 2 - 1) * (w2 - 0.5), 0, (r() * 2 - 1) * (d2 - 1)],
        rotation: [0, r() * Math.PI, 0]
      });
    }
  }

  return objects;
}

/* replaced clamp */ function oldClamp(
  position: [number, number, number], 
  dimensions: RoomDimensions, 
  size?: [number, number, number]
): [number, number, number] {
  const [x, y, z] = position;
  
  const w2 = dimensions.width / 2;
  const d2 = dimensions.length / 2;
  
  const hw = size ? size[0] / 2 : 0;
  const hd = size ? size[2] / 2 : 0;
  
  const minX = -w2 + hw;
  const maxX = w2 - hw;
  const minZ = -d2 + hd;
  const maxZ = d2 - hd;
  
  return [
    Math.max(minX, Math.min(maxX, x)),
    Math.max(0, y),
    Math.max(minZ, Math.min(maxZ, z))
  ];
}


export function clampPositionToRoom(
  position: [number, number, number], 
  dimensions: RoomDimensions, 
  objectSize: [number, number, number] = [0, 0, 0],
  rotation: [number, number, number] = [0, 0, 0],
  scale: number = 1
): [number, number, number] {
  // objectSize is the LOCAL unscaled size of the mesh perfectly centered.
  // We apply rotation and scale mathematically to find its World AABB dimensions.
  const angle = rotation[1];
  const cos = Math.abs(Math.cos(angle));
  const sin = Math.abs(Math.sin(angle));
  
  const scaledWidth = objectSize[0] * scale;
  const scaledDepth = objectSize[2] * scale;

  const effWidth = scaledWidth * cos + scaledDepth * sin;
  const effDepth = scaledWidth * sin + scaledDepth * cos;

  const minX = -dimensions.width / 2 + effWidth / 2;
  const maxX = dimensions.width / 2 - effWidth / 2;
  const minZ = -dimensions.length / 2 + effDepth / 2;
  const maxZ = dimensions.length / 2 - effDepth / 2;

  const effMinX = Math.min(minX, maxX);
  const effMaxX = Math.max(minX, maxX);
  const effMinZ = Math.min(minZ, maxZ);
  const effMaxZ = Math.max(minZ, maxZ);

  const clampedX = Math.max(effMinX, Math.min(effMaxX, position[0]));
  const clampedZ = Math.max(effMinZ, Math.min(effMaxZ, position[2]));

  return [clampedX, Math.max(0, position[1]), clampedZ];
}

export function calculateWallSnap(
  position: [number, number, number], 
  dimensions: RoomDimensions,
  objectSize: [number, number, number] = [0, 0, 0]
): { position: [number, number, number], rotation: [number, number, number] } {
  const minX = -dimensions.width / 2 + objectSize[0] / 2;
  const maxX = dimensions.width / 2 - objectSize[0] / 2;
  const minZ = -dimensions.length / 2 + objectSize[2] / 2;
  const maxZ = dimensions.length / 2 - objectSize[2] / 2;

  const distToLeft = Math.abs(position[0] - minX);
  const distToRight = Math.abs(position[0] - maxX);
  const distToFront = Math.abs(position[2] - maxZ);
  const distToBack = Math.abs(position[2] - minZ);

  const minDist = Math.min(distToLeft, distToRight, distToFront, distToBack);

  let newPos: [number, number, number] = [...position];
  let newRot: [number, number, number] = [0, 0, 0];

  if (minDist === distToLeft) {
    newPos[0] = minX;
    newRot = [0, Math.PI / 2, 0];
  } else if (minDist === distToRight) {
    newPos[0] = maxX;
    newRot = [0, -Math.PI / 2, 0];
  } else if (minDist === distToFront) {
    newPos[2] = maxZ;
    newRot = [0, Math.PI, 0];
  } else {
    newPos[2] = minZ;
    newRot = [0, 0, 0];
  }

  if (minDist === distToLeft || minDist === distToRight) {
    newPos[2] = Math.max(minZ, Math.min(maxZ, newPos[2]));
  } else {
    newPos[0] = Math.max(minX, Math.min(maxX, newPos[0]));
  }

  return { position: newPos, rotation: newRot };
}

export function checkCollision(
  posA: [number, number, number], sizeA: [number, number, number], rotA: [number, number, number],
  posB: [number, number, number], sizeB: [number, number, number], rotB: [number, number, number]
): boolean {
  // Simplified AABB collision check based on effective width/depth after rotation
  const getEffectiveSize = (s: [number, number, number], r: [number, number, number]) => {
    const cos = Math.abs(Math.cos(r[1]));
    const sin = Math.abs(Math.sin(r[1]));
    return [
      s[0] * cos + s[2] * sin,
      s[1],
      s[0] * sin + s[2] * cos
    ];
  };

  const effA = getEffectiveSize(sizeA, rotA);
  const effB = getEffectiveSize(sizeB, rotB);

  const minXA = posA[0] - effA[0] / 2;
  const maxXA = posA[0] + effA[0] / 2;
  const minZA = posA[2] - effA[2] / 2;
  const maxZA = posA[2] + effA[2] / 2;

  const minXB = posB[0] - effB[0] / 2;
  const maxXB = posB[0] + effB[0] / 2;
  const minZB = posB[2] - effB[2] / 2;
  const maxZB = posB[2] + effB[2] / 2;

  return !(maxXA <= minXB || minXA >= maxXB || maxZA <= minZB || minZA >= maxZB);
}

export function findEmptySpawnPosition(
  placedObjects: PlacedObject[],
  dimensions: RoomDimensions,
  defaultSize: [number, number, number] = [1, 1, 1]
): [number, number, number] {
  const step = 0.5; // half meter steps
  const maxSteps = 10;
  
  // Spiral pattern search for an empty spot
  for (let s = 0; s < maxSteps; s++) {
    for (let dx = -s; dx <= s; dx++) {
      for (let dz = -s; dz <= s; dz++) {
        // Only process the outer ring of the current spiral step
        if (Math.abs(dx) !== s && Math.abs(dz) !== s) continue; 
        
        let testPos: [number, number, number] = [dx * step, 0, dz * step];
        
        // Ensure it's inside the room bounds
        testPos = clampPositionToRoom(testPos, dimensions, defaultSize, [0, 0, 0]);
        
        let hasCollision = false;
        for (const obj of placedObjects) {
          const objSize = obj.size || [1, 1, 1];
          if (checkCollision(testPos, defaultSize, [0, 0, 0], obj.position, objSize, obj.rotation)) {
            hasCollision = true;
            break;
          }
        }
        
        if (!hasCollision) {
          return testPos;
        }
      }
    }
  }
  
  // Fallback to center if room is completely full
  return [0, 0, 0]; 
}
