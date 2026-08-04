import type { Room } from '../lib/types';

// All rooms use the SAME perspective geometry for consistency:
//   Back wall: x=28–72%, y=10–62%  (horizon at 62%)
//   This ensures all gradients, molding, and AO overlays align perfectly.
// Furniture differs per room via separate SVG components.

export const ROOMS: Room[] = [
  {
    id: 'modern-room',
    name: 'Modern Living Room',
    thumbnailUrl: '',
    imageUrl: '',
    surfaces: [
      { id: 'floor',      roomId: 'modern-room', type: 'floor', label: 'Floor',      polygon: [[0,100],[100,100],[72,62],[28,62]], areaSqFt: 150 },
      { id: 'back-wall',  roomId: 'modern-room', type: 'wall',  label: 'Back Wall',  polygon: [[28,10],[72,10],[72,62],[28,62]], areaSqFt: 96 },
      { id: 'left-wall',  roomId: 'modern-room', type: 'wall',  label: 'Left Wall',  polygon: [[0,0],[28,10],[28,62],[0,100]], areaSqFt: 120 },
      { id: 'right-wall', roomId: 'modern-room', type: 'wall',  label: 'Right Wall', polygon: [[72,10],[100,0],[100,100],[72,62]], areaSqFt: 120 },
      { id: 'ceiling',    roomId: 'modern-room', type: 'wall',  label: 'Ceiling',    polygon: [[0,0],[100,0],[72,10],[28,10]], areaSqFt: 150 },
    ]
  },
  {
    id: 'bathroom',
    name: 'Luxury Bathroom',
    thumbnailUrl: '',
    imageUrl: '',
    surfaces: [
      { id: 'bath-floor',      roomId: 'bathroom', type: 'floor', label: 'Floor',      polygon: [[0,100],[100,100],[72,62],[28,62]], areaSqFt: 60 },
      { id: 'bath-back-wall',  roomId: 'bathroom', type: 'wall',  label: 'Back Wall',  polygon: [[28,10],[72,10],[72,62],[28,62]], areaSqFt: 48 },
      { id: 'bath-left-wall',  roomId: 'bathroom', type: 'wall',  label: 'Left Wall',  polygon: [[0,0],[28,10],[28,62],[0,100]], areaSqFt: 80 },
      { id: 'bath-right-wall', roomId: 'bathroom', type: 'wall',  label: 'Right Wall', polygon: [[72,10],[100,0],[100,100],[72,62]], areaSqFt: 80 },
      { id: 'bath-ceiling',    roomId: 'bathroom', type: 'wall',  label: 'Ceiling',    polygon: [[0,0],[100,0],[72,10],[28,10]], areaSqFt: 60 },
    ]
  },
  {
    id: 'kitchen',
    name: 'Modern Kitchen',
    thumbnailUrl: '',
    imageUrl: '',
    surfaces: [
      { id: 'kit-floor',      roomId: 'kitchen', type: 'floor', label: 'Floor',      polygon: [[0,100],[100,100],[72,62],[28,62]], areaSqFt: 120 },
      { id: 'kit-back-wall',  roomId: 'kitchen', type: 'wall',  label: 'Back Wall',  polygon: [[28,10],[72,10],[72,62],[28,62]], areaSqFt: 72 },
      { id: 'kit-left-wall',  roomId: 'kitchen', type: 'wall',  label: 'Left Wall',  polygon: [[0,0],[28,10],[28,62],[0,100]], areaSqFt: 90 },
      { id: 'kit-right-wall', roomId: 'kitchen', type: 'wall',  label: 'Right Wall', polygon: [[72,10],[100,0],[100,100],[72,62]], areaSqFt: 90 },
      { id: 'kit-ceiling',    roomId: 'kitchen', type: 'wall',  label: 'Ceiling',    polygon: [[0,0],[100,0],[72,10],[28,10]], areaSqFt: 120 },
    ]
  },
  {
    id: 'bedroom-photo',
    name: 'Realistic Bedroom',
    thumbnailUrl: '/rooms/bedroom.png',
    imageUrl: '/rooms/bedroom.png',
    surfaces: [
      {
        id: 'bedroom-floor',
        roomId: 'bedroom',
        type: 'floor',
        label: 'Wooden Floor',
        polygon: [[0, 68], [100, 68], [100, 100], [0, 100]],
        areaSqFt: 250,
        path: 'M 0 100 L 100 100 L 100 58 L 54 58 L 54 62 L 77 62 L 77 82 L 20 82 L 20 86 L 0 86 Z'
      },
      {
        id: 'bedroom-wall',
        roomId: 'bedroom',
        type: 'wall',
        label: 'North Wall',
        polygon: [[0, 10], [100, 10], [100, 68], [0, 68]],
        areaSqFt: 180,
        path: 'M 0 0 L 54 0 L 54 45 L 16 45 L 16 61 L 6 61 L 6 75 L 16 75 L 16 86 L 0 86 Z'
      }
    ]
  },
  {
    id: 'chair-room',
    name: 'Modern Chair',
    thumbnailUrl: '/rooms/chair-room.jpg',
    imageUrl: '/rooms/chair-room.jpg',
    surfaces: [
      {
        id: 'cr-wall',
        roomId: 'chair-room',
        type: 'wall',
        label: 'Back Wall',
        polygon: [[0, 0], [100, 0], [100, 81], [0, 81]],
        areaSqFt: 150,
        path: 'M 0 0 L 100 0 L 100 81 L 80 81 L 75 94 L 56 92 L 58 81 L 0 81 Z M 60 81 L 78 81 L 74 92 L 58 90 Z'
      },
      {
        id: 'cr-floor',
        roomId: 'chair-room',
        type: 'floor',
        label: 'Tiled Floor',
        polygon: [[0, 81], [100, 81], [100, 100], [0, 100]],
        areaSqFt: 200,
        path: 'M 0 0 L 100 0 L 100 81 L 80 81 L 77 64 L 77 45 L 65 43 L 62 55 L 60 64 L 58 81 L 0 81 Z M 63 56 L 74 56 L 76 62 L 61 62 Z M 62 65 L 76 65 L 78 81 L 60 81 Z'
      }
    ]
  },
  {
    id: 'blue-bed',
    name: 'Modern Blue Bedroom',
    thumbnailUrl: '/rooms/blue-bed.jpg',
    imageUrl: '/rooms/blue-bed.jpg',
    surfaces: [
      {
        id: 'bb-wall',
        roomId: 'blue-bed',
        type: 'wall',
        label: 'Feature Wall',
        polygon: [[0,0],[100,0],[100,79],[0,79]],
        path: "M 0 0 L 100 0 L 100 79 L 0 79 Z M 100 79 L 100 10 L 53 10 L 53 60 L 41 60 L 41 43 L 4 43 L 4 79 Z",
        areaSqFt: 180
      },
      {
        id: 'bb-floor',
        roomId: 'blue-bed',
        type: 'floor',
        label: 'Wooden Floor',
        polygon: [[0,79],[100,79],[100,100],[0,100]],
        path: "M 0 79 L 100 79 L 100 100 L 0 100 Z M 100 79 L 100 86 L 66 86 L 66 87 L 4 87 L 4 79 Z M 15 87 L 18 87 L 18 92 L 15 92 Z M 45 87 L 48 87 L 48 92 L 45 92 Z M 62 87 L 65 87 L 65 92 L 62 92 Z",
        areaSqFt: 220
      }
    ]
  }
];
