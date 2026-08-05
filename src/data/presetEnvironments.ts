export interface PresetEnvironment {
  id: string;
  name: string;
  category: 'kitchen' | 'bathroom';
  dimensions: { width: number; length: number; height: number };
  defaultSurfaces: {
    id: string;
    type: 'floor' | 'wall';
    label: string;
    width: number;
    height: number;
    position: [number, number, number];
    rotation: [number, number, number];
  }[];
}

export const PRESET_ENVIRONMENTS: PresetEnvironment[] = [
  {
    id: 'kitchen-modern-minimalist',
    name: 'Modern Minimalist Kitchen',
    category: 'kitchen',
    dimensions: { width: 4, length: 5, height: 2.8 },
    defaultSurfaces: [
      { id: 'env-mod-floor', type: 'floor', label: 'Kitchen Floor', width: 4, height: 5, position: [0, 0, 0], rotation: [-Math.PI / 2, 0, 0] },
      { id: 'env-mod-wall-back', type: 'wall', label: 'Backsplash', width: 4, height: 2.8, position: [0, 1.4, -2.5], rotation: [0, 0, 0] },
      { id: 'env-mod-wall-left', type: 'wall', label: 'Left Wall', width: 5, height: 2.8, position: [-2, 1.4, 0], rotation: [0, Math.PI / 2, 0] }
    ]
  },
  {
    id: 'kitchen-industrial',
    name: 'Industrial Kitchen',
    category: 'kitchen',
    dimensions: { width: 4.5, length: 6, height: 3.5 },
    defaultSurfaces: [
      { id: 'env-ind-floor', type: 'floor', label: 'Main Floor', width: 4.5, height: 6, position: [0, 0, 0], rotation: [-Math.PI / 2, 0, 0] },
      { id: 'env-ind-wall-back', type: 'wall', label: 'Feature Wall', width: 4.5, height: 3.5, position: [0, 1.75, -3], rotation: [0, 0, 0] }
    ]
  },
  {
    id: 'kitchen-traditional',
    name: 'Classic Traditional Kitchen',
    category: 'kitchen',
    dimensions: { width: 5, length: 5, height: 2.6 },
    defaultSurfaces: [
      { id: 'env-trad-floor', type: 'floor', label: 'Floor', width: 5, height: 5, position: [0, 0, 0], rotation: [-Math.PI / 2, 0, 0] },
      { id: 'env-trad-wall-back', type: 'wall', label: 'Oven Wall', width: 5, height: 2.6, position: [0, 1.3, -2.5], rotation: [0, 0, 0] },
      { id: 'env-trad-wall-right', type: 'wall', label: 'Sink Wall', width: 5, height: 2.6, position: [2.5, 1.3, 0], rotation: [0, -Math.PI / 2, 0] }
    ]
  },
  {
    id: 'kitchen-contemporary',
    name: 'Contemporary Kitchen',
    category: 'kitchen',
    dimensions: { width: 4, length: 4.5, height: 2.8 },
    defaultSurfaces: [
      { id: 'env-cont-floor', type: 'floor', label: 'Floor', width: 4, height: 4.5, position: [0, 0, 0], rotation: [-Math.PI / 2, 0, 0] },
      { id: 'env-cont-wall-back', type: 'wall', label: 'Main Wall', width: 4, height: 2.8, position: [0, 1.4, -2.25], rotation: [0, 0, 0] }
    ]
  },
  {
    id: 'bathroom-standard',
    name: 'Standard Bathroom',
    category: 'bathroom',
    dimensions: { width: 2.5, length: 3.5, height: 2.6 },
    defaultSurfaces: [
      { id: 'env-bath-floor', type: 'floor', label: 'Bathroom Floor', width: 2.5, height: 3.5, position: [0, 0, 0], rotation: [-Math.PI / 2, 0, 0] },
      { id: 'env-bath-wall-back', type: 'wall', label: 'Vanity Wall', width: 2.5, height: 2.6, position: [0, 1.3, -1.75], rotation: [0, 0, 0] },
      { id: 'env-bath-wall-left', type: 'wall', label: 'Shower Wall', width: 3.5, height: 2.6, position: [-1.25, 1.3, 0], rotation: [0, Math.PI / 2, 0] }
    ]
  }
];
