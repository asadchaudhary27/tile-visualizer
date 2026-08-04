import { v4 as uuidv4 } from 'uuid';
import type { RoomDimensions, PlacedObject } from '../lib/types';
import * as THREE from 'three';

export function generateAutoLayoutData(dimensions: RoomDimensions, roomType: string, presetId?: string): PlacedObject[] {
  const objects: PlacedObject[] = [];

  // 1. Always place a door centered on the front wall
  objects.push({
    id: uuidv4(),
    assetType: 'Door',
    position: [0, 0, dimensions.length / 2],
    rotation: [0, Math.PI, 0] // Facing inwards
  });

  if (presetId) {
    if (presetId === 'modern-room') {
      objects.push(
        { id: uuidv4(), assetType: 'TVWall', position: [0, 0, -dimensions.length / 2 + 0.1], rotation: [0, 0, 0] },
        { id: uuidv4(), assetType: 'AreaRug', position: [0, 0, -0.5], rotation: [0, 0, 0] },
        { id: uuidv4(), assetType: 'LuxurySofa', position: [0, 0, -0.5], rotation: [0, Math.PI, 0] }, // Facing TV
        { id: uuidv4(), assetType: 'SideTable', position: [-1.7, 0, -0.5], rotation: [0, 0, 0] },
        { id: uuidv4(), assetType: 'FloorLamp', position: [-2.0, 0, -0.5], rotation: [0, 0, 0] },
        { id: uuidv4(), assetType: 'FloorPlant', position: [2.5, 0, -dimensions.length / 2 + 0.5], rotation: [0, 0, 0] },
        { id: uuidv4(), assetType: 'FloorPlant', position: [-2.5, 0, dimensions.length / 2 - 0.5], rotation: [0, 0, 0] },
        { id: uuidv4(), assetType: 'ModernBench', position: [0, 0, 1.5], rotation: [0, 0, 0] }
      );
    } else if (presetId === 'bathroom') {
      objects.push(
        { id: uuidv4(), assetType: 'DoubleVanity', position: [0, 0, -dimensions.length / 2 + 0.5], rotation: [0, 0, 0] },
        { id: uuidv4(), assetType: 'DetailedBathtub', position: [-dimensions.width / 2 + 0.8, 0, 0], rotation: [0, Math.PI/2, 0] },
        { id: uuidv4(), assetType: 'DetailedToilet', position: [dimensions.width / 2 - 0.5, 0, -dimensions.length / 2 + 0.5], rotation: [0, 0, 0] },
        { id: uuidv4(), assetType: 'Shower', position: [dimensions.width / 2 - 1.0, 0, dimensions.length / 2 - 1.0], rotation: [0, Math.PI, 0] },
        { id: uuidv4(), assetType: 'DetailedTowelRack', position: [-dimensions.width / 2 + 0.1, 1.0, -dimensions.length / 2 + 1.5], rotation: [0, Math.PI/2, 0] },
        { id: uuidv4(), assetType: 'FloorPlant', position: [dimensions.width / 2 - 0.5, 0, 0.5], rotation: [0, 0, 0] }
      );
    } else if (presetId === 'kitchen') {
      objects.push(
        { id: uuidv4(), assetType: 'KitchenCabinets', position: [0, 0, -dimensions.length / 2 + 0.5], rotation: [0, 0, 0] },
        { id: uuidv4(), assetType: 'DetailedIsland', position: [0, 0, -1.5], rotation: [0, 0, 0] },
        { id: uuidv4(), assetType: 'DetailedFridge', position: [dimensions.width / 2 - 0.8, 0, -dimensions.length / 2 + 0.5], rotation: [0, 0, 0] },
        { id: uuidv4(), assetType: 'RangeHood', position: [0, 1.8, -dimensions.length / 2 + 0.4], rotation: [0, 0, 0] },
        { id: uuidv4(), assetType: 'BarStool', position: [-0.6, 0, -0.6], rotation: [0, Math.PI, 0] },
        { id: uuidv4(), assetType: 'BarStool', position: [0.6, 0, -0.6], rotation: [0, Math.PI, 0] },
        // Dining area on the left
        { id: uuidv4(), assetType: 'DiningTable', position: [-dimensions.width / 2 + 1.8, 0, 1.5], rotation: [0, 0, 0] },
        { id: uuidv4(), assetType: 'DiningChair', position: [-dimensions.width / 2 + 1.8, 0, 0.8], rotation: [0, 0, 0] },
        { id: uuidv4(), assetType: 'DiningChair', position: [-dimensions.width / 2 + 1.8, 0, 2.2], rotation: [0, Math.PI, 0] },
        { id: uuidv4(), assetType: 'FloorPlant', position: [dimensions.width / 2 - 0.5, 0, dimensions.length / 2 - 0.5], rotation: [0, 0, 0] }
      );
    } else if (presetId === 'bedroom-photo') {
      objects.push(
        { id: uuidv4(), assetType: 'DetailedBed', position: [0, 0, -dimensions.length / 2 + 1.2], rotation: [0, 0, 0] },
        { id: uuidv4(), assetType: 'Nightstand', position: [-1.4, 0, -dimensions.length / 2 + 0.4], rotation: [0, 0, 0] },
        { id: uuidv4(), assetType: 'Nightstand', position: [1.4, 0, -dimensions.length / 2 + 0.4], rotation: [0, 0, 0] },
        { id: uuidv4(), assetType: 'BedsideLamp', position: [-1.4, 0.65, -dimensions.length / 2 + 0.4], rotation: [0, 0, 0] },
        { id: uuidv4(), assetType: 'BedsideLamp', position: [1.4, 0.65, -dimensions.length / 2 + 0.4], rotation: [0, 0, 0] },
        { id: uuidv4(), assetType: 'Wardrobe', position: [-dimensions.width / 2 + 0.6, 0, 1.5], rotation: [0, Math.PI/2, 0] },
        { id: uuidv4(), assetType: 'AreaRug', position: [0, 0, 0], rotation: [0, 0, 0] },
        { id: uuidv4(), assetType: 'ModernBench', position: [0, 0, -dimensions.length / 2 + 2.5], rotation: [0, 0, 0] },
        { id: uuidv4(), assetType: 'FloorPlant', position: [dimensions.width / 2 - 0.5, 0, -dimensions.length / 2 + 0.5], rotation: [0, 0, 0] }
      );
    } else if (presetId === 'chair-room') {
      objects.push(
        { id: uuidv4(), assetType: 'LuxurySofa', position: [0, 0, 0], rotation: [0, 0, 0] },
        { id: uuidv4(), assetType: 'AreaRug', position: [0, 0, 0], rotation: [0, 0, 0] },
        { id: uuidv4(), assetType: 'SideTable', position: [-1.6, 0, 0], rotation: [0, 0, 0] },
        { id: uuidv4(), assetType: 'FloorLamp', position: [-2.0, 0, 0], rotation: [0, 0, 0] },
        { id: uuidv4(), assetType: 'FloorPlant', position: [2.5, 0, -2.5], rotation: [0, 0, 0] },
        { id: uuidv4(), assetType: 'FloorPlant', position: [-2.5, 0, 2.5], rotation: [0, 0, 0] }
      );
    } else if (presetId === 'blue-bed') {
      objects.push(
        { id: uuidv4(), assetType: 'BlueDetailedBed', position: [0, 0, -dimensions.length / 2 + 1.2], rotation: [0, 0, 0] },
        { id: uuidv4(), assetType: 'DressingTable', position: [-dimensions.width / 2 + 0.5, 0, -1.0], rotation: [0, Math.PI/2, 0] },
        { id: uuidv4(), assetType: 'DressingStool', position: [-dimensions.width / 2 + 1.2, 0, -1.0], rotation: [0, -Math.PI/2, 0] },
        { id: uuidv4(), assetType: 'Nightstand', position: [1.4, 0, -dimensions.length / 2 + 0.4], rotation: [0, 0, 0] },
        { id: uuidv4(), assetType: 'BedsideLamp', position: [1.4, 0.65, -dimensions.length / 2 + 0.4], rotation: [0, 0, 0] },
        { id: uuidv4(), assetType: 'Wardrobe', position: [dimensions.width / 2 - 0.6, 0, 1.5], rotation: [0, -Math.PI/2, 0] },
        { id: uuidv4(), assetType: 'AreaRug', position: [0, 0, 0], rotation: [0, 0, 0] },
        { id: uuidv4(), assetType: 'FloorPlant', position: [-dimensions.width / 2 + 0.5, 0, dimensions.length / 2 - 0.5], rotation: [0, 0, 0] }
      );
    }
  } else {
    // 2. Place core furniture based on room type
    if (roomType === 'bedroom') {
      // Bed against the back wall, centered
      objects.push({
        id: uuidv4(),
        assetType: 'BedQueen',
        position: [0, 0, -dimensions.length / 2 + 1.0 + 2.0], // approximate offset for bed center
        rotation: [0, 0, 0]
      });
      objects.push({
        id: uuidv4(),
        assetType: 'Wardrobe',
        position: [-dimensions.width / 2 + 0.6, 0, 2.0],
        rotation: [0, Math.PI / 2, 0]
      });
    } else if (roomType === 'kitchen') {
      // Kitchen cabinets/island against back wall
      objects.push({
        id: uuidv4(),
        assetType: 'KitchenIsland',
        position: [0, 0, -dimensions.length / 2 + 0.5 + 2.0],
        rotation: [0, 0, 0]
      });
      objects.push({
        id: uuidv4(),
        assetType: 'Fridge',
        position: [dimensions.width / 2 - 0.5, 0, -dimensions.length / 2 + 0.5 + 2.0],
        rotation: [0, 0, 0]
      });
    } else if (roomType === 'bathroom') {
      // Bathroom fixtures against back wall
      objects.push({
        id: uuidv4(),
        assetType: 'Vanity',
        position: [0, 0, -dimensions.length / 2 + 0.5 + 2.0],
        rotation: [0, 0, 0]
      });
      objects.push({
        id: uuidv4(),
        assetType: 'Toilet',
        position: [dimensions.width / 2 - 0.5, 0, -dimensions.length / 2 + 0.5 + 2.0],
        rotation: [0, 0, 0]
      });
      objects.push({
        id: uuidv4(),
        assetType: 'Shower',
        position: [-dimensions.width / 2 + 0.5, 0, -dimensions.length / 2 + 0.5 + 2.0],
        rotation: [0, 0, 0]
      });
    }
  }

  // Optionally place a mirror on the left wall
  objects.push({
    id: uuidv4(),
    assetType: 'Mirror',
    position: [-dimensions.width / 2, 1.5, 0],
    rotation: [0, Math.PI / 2, 0] // Facing right
  });

  return objects;
}

export function clampPositionToRoom(
  position: [number, number, number], 
  dimensions: RoomDimensions, 
  objectSize: [number, number, number] = [0, 0, 0]
): [number, number, number] {
  const minX = -dimensions.width / 2 + objectSize[0] / 2;
  const maxX = dimensions.width / 2 - objectSize[0] / 2;
  const minZ = -dimensions.length / 2 + objectSize[2] / 2;
  const maxZ = dimensions.length / 2 - objectSize[2] / 2;

  // Ensure min <= max just in case object is larger than room
  const effMinX = Math.min(minX, maxX);
  const effMaxX = Math.max(minX, maxX);
  const effMinZ = Math.min(minZ, maxZ);
  const effMaxZ = Math.max(minZ, maxZ);

  const clampedX = Math.max(effMinX, Math.min(effMaxX, position[0]));
  const clampedZ = Math.max(effMinZ, Math.min(effMaxZ, position[2]));

  return [clampedX, position[1], clampedZ];
}


export function calculateWallSnap(
  position: [number, number, number], 
  dimensions: RoomDimensions,
  objectSize: [number, number, number] = [0, 0, 0]
): { position: [number, number, number], rotation: [number, number, number] } {
  // Finds the nearest wall and snaps position & rotation
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

  // Constrain the other axis
  if (minDist === distToLeft || minDist === distToRight) {
    newPos[2] = Math.max(minZ, Math.min(maxZ, newPos[2]));
  } else {
    newPos[0] = Math.max(minX, Math.min(maxX, newPos[0]));
  }

  return { position: newPos, rotation: newRot };
}
