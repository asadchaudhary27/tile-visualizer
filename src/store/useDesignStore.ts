import { create } from 'zustand';
import type { SurfaceConfig, RoomDimensions, PlacedObject } from '../lib/types';
import type { UnitSystem } from '../lib/unitMath';
import { generateAutoLayoutData, clampPositionToRoom } from '../utils/autoLayout';

export type LightingMode = 'daylight' | 'warm' | 'spot';

/**
 * Main application state for managing 3D room, furniture, and tile configurations.
 */
interface DesignState {
  /** Surface configurations keyed by surfaceId (e.g., 'floor', 'left-wall') */
  configs: Record<string, SurfaceConfig>;
  /** Overall lighting style of the 3D room */
  lightingMode: LightingMode;
  /** Physical dimensions of the room (length, width, height) */
  roomDimensions: RoomDimensions;
  /** High-level preset room category */
  roomType: 'bathroom' | 'bedroom' | 'kitchen' | 'empty' | null;
  /** Whether the user has finished the initial room dimension/type setup step */
  isRoomConfigured: boolean;
  /** List of all 3D furniture/objects currently in the scene */
  placedObjects: PlacedObject[];
  activeObjectId: string | null;
  isFurnitureEditMode: boolean;
  unitSystem: UnitSystem;
  setConfig: (config: SurfaceConfig) => void;
  setLightingMode: (mode: LightingMode) => void;
  setRoomDimensions: (dimensions: RoomDimensions) => void;
  setRoomType: (type: 'bathroom' | 'bedroom' | 'kitchen' | 'empty' | null) => void;
  setIsRoomConfigured: (configured: boolean) => void;
  setUnitSystem: (sys: UnitSystem) => void;
  addPlacedObject: (obj: PlacedObject) => void;
  updateObjectTransform: (id: string, position: [number, number, number], rotation: [number, number, number]) => void;
  updateObjectSize: (id: string, size: [number, number, number]) => void;
  updateObjectScale: (id: string, scale: number) => void;
  updateObjectAssetType: (id: string, assetType: string) => void;
  removePlacedObject: (id: string) => void;
  setActiveObjectId: (id: string | null) => void;
  toggleEditMode: () => void;
  generateAutoLayout: (roomType: string) => void;
  clearConfig: (surfaceId: string) => void;
  applyToScope: (sourceSurfaceId: string, targetSurfaceIds: string[]) => void;
  toastMessage: string | null;
  setToast: (msg: string | null) => void;
  selectedCategoryId: string | null;
  setSelectedCategoryId: (id: string | null) => void;
  
  // Thumbnail Generation State
  thumbnailQueue: string[];
  thumbnails: Record<string, string>;
  queueThumbnail: (url: string) => void;
  addThumbnail: (url: string, dataUrl: string) => void;
  popThumbnailQueue: () => void;
}

export const useDesignStore = create<DesignState>((set) => ({
  configs: {},
  lightingMode: 'daylight',
  roomDimensions: { length: 3, width: 3, height: 2.6 }, // Default 3x3x2.6m room
  roomType: null,
  isRoomConfigured: false,
  placedObjects: [],
  activeObjectId: null,
  isFurnitureEditMode: false,
  unitSystem: 'meters',
  setLightingMode: (mode) => set({ lightingMode: mode }),
  setRoomType: (type) => set({ roomType: type }),
  setIsRoomConfigured: (configured) => set({ isRoomConfigured: configured }),
  setRoomDimensions: (dimensions) => set((state) => {
    let wasClamped = false;
    const newPlacedObjects = state.placedObjects.map(obj => {
      const newPos = clampPositionToRoom(obj.position, dimensions, obj.size);
      if (newPos[0] !== obj.position[0] || newPos[1] !== obj.position[1] || newPos[2] !== obj.position[2]) {
        wasClamped = true;
        return { ...obj, position: newPos };
      }
      return obj;
    });
    
    return { 
      roomDimensions: dimensions,
      placedObjects: newPlacedObjects,
      toastMessage: wasClamped ? "Furniture was repositioned to fit the new room dimensions." : state.toastMessage
    };
  }),
  setUnitSystem: (sys) => set({ unitSystem: sys }),
  addPlacedObject: (obj) => set((state) => {
    // Defensive check to ensure valid position
    if (!obj.position || !obj.position.every(Number.isFinite)) {
      console.warn("Invalid position for placed object", obj);
      return state;
    }
    return { placedObjects: [...state.placedObjects, obj] };
  }),
  updateObjectTransform: (id, position, rotation) => set((state) => {
    // Defensive check to prevent NaN corruption in 3D scene
    if (!position.every(Number.isFinite) || !rotation.every(Number.isFinite)) {
       console.warn("Attempted to set invalid transform", position, rotation);
       return state;
    }
    
    // Clamp to room bounds to prevent objects flying out of the room
    const objectToUpdate = state.placedObjects.find(o => o.id === id);
    if (!objectToUpdate) return state;
    
    const clampedPos = clampPositionToRoom(position, state.roomDimensions, objectToUpdate.size);
    
    return {
      placedObjects: state.placedObjects.map(obj => 
        obj.id === id ? { ...obj, position: clampedPos, rotation } : obj
      )
    };
  }),
  updateObjectSize: (id, size) => set((state) => ({
    placedObjects: state.placedObjects.map(obj =>
      obj.id === id ? { ...obj, size } : obj
    )
  })),
  updateObjectScale: (id, scale) => set((state) => ({
    placedObjects: state.placedObjects.map(obj =>
      obj.id === id ? { ...obj, scale } : obj
    )
  })),
  updateObjectAssetType: (id, assetType) => set((state) => ({
    placedObjects: state.placedObjects.map(obj =>
      obj.id === id ? { ...obj, assetType } : obj
    )
  })),
  removePlacedObject: (id) => set((state) => ({
    placedObjects: state.placedObjects.filter(obj => obj.id !== id),
    activeObjectId: state.activeObjectId === id ? null : state.activeObjectId
  })),
  setActiveObjectId: (id) => set({ activeObjectId: id }),
  toggleEditMode: () => set((state) => {
    // If turning off edit mode, deselect active object
    const newMode = !state.isFurnitureEditMode;
    return { 
      isFurnitureEditMode: newMode,
      activeObjectId: newMode ? state.activeObjectId : null 
    };
  }),
  generateAutoLayout: (roomType) => set((state) => {
    // If empty room, no objects
    if (roomType === 'empty') {
      return { placedObjects: [], activeObjectId: null };
    }
    
    // Scale room dimensions based on standard sizes for that room type
    let newDims = { ...state.roomDimensions };
    if (roomType === 'bathroom') newDims = { length: 3, width: 2.5, height: 2.8 };
    if (roomType === 'kitchen') newDims = { length: 4, width: 3.5, height: 2.8 };
    if (roomType === 'bedroom') newDims = { length: 4.5, width: 4, height: 2.8 };

    return {
      roomDimensions: newDims,
      placedObjects: generateAutoLayoutData(newDims, roomType),
      activeObjectId: null
    };
  }),
  setConfig: (config) => set((state) => ({
    configs: {
      ...state.configs,
      [config.surfaceId]: config
    }
  })),
  clearConfig: (surfaceId) => set((state) => {
    const newConfigs = { ...state.configs };
    delete newConfigs[surfaceId];
    return { configs: newConfigs };
  }),
  applyToScope: (sourceSurfaceId, targetSurfaceIds) => set((state) => {
    const sourceConfig = state.configs[sourceSurfaceId];
    if (!sourceConfig) return state;

    const newConfigs = { ...state.configs };
    for (const targetId of targetSurfaceIds) {
      newConfigs[targetId] = { ...sourceConfig, surfaceId: targetId };
    }
    return { configs: newConfigs };
  }),
  toastMessage: null,
  setToast: (msg) => set({ toastMessage: msg }),
  selectedCategoryId: null,
  setSelectedCategoryId: (id) => set({ selectedCategoryId: id }),
  
  thumbnailQueue: [],
  thumbnails: {},
  queueThumbnail: (url) => set((state) => {
    if (!state.thumbnails[url] && !state.thumbnailQueue.includes(url)) {
      return { thumbnailQueue: [...state.thumbnailQueue, url] };
    }
    return state;
  }),
  addThumbnail: (url, dataUrl) => set((state) => ({
    thumbnails: { ...state.thumbnails, [url]: dataUrl }
  })),
  popThumbnailQueue: () => set((state) => ({
    thumbnailQueue: state.thumbnailQueue.slice(1)
  })),
}));
