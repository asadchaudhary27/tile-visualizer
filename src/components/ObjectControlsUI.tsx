import React from 'react';
import { useDesignStore } from '../store/useDesignStore';
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight, RotateCw, RotateCcw, Trash2, X, ChevronUp, ChevronDown, Plus, Minus } from 'lucide-react';
import { clampPositionToRoom, calculateWallSnap } from '../utils/autoLayout';

export default function ObjectControlsUI() {
  const activeObjectId = useDesignStore(s => s.activeObjectId);
  const setActiveObjectId = useDesignStore(s => s.setActiveObjectId);
  const placedObjects = useDesignStore(s => s.placedObjects);
  const updateObjectTransform = useDesignStore(s => s.updateObjectTransform);
  const updateObjectScale = useDesignStore(s => s.updateObjectScale);
  const removePlacedObject = useDesignStore(s => s.removePlacedObject);
  const roomDimensions = useDesignStore(s => s.roomDimensions);
  const isFurnitureEditMode = useDesignStore(s => s.isFurnitureEditMode);

  if (!isFurnitureEditMode || !activeObjectId) return null;

  const activeObject = placedObjects.find(obj => obj.id === activeObjectId);
  if (!activeObject) return null;

  const STEP = 0.2; // 20cm step for movement
  const ROT_STEP = Math.PI / 8; // 22.5 degrees

  const handleMove = (dx: number, dz: number) => {
    let [x, y, z] = activeObject.position;
    x += dx;
    z += dz;

    let finalPos: [number, number, number] = [x, y, z];
    let finalRot = activeObject.rotation;

    if (activeObject.assetType === 'Door' || activeObject.assetType === 'Mirror') {
      const snapped = calculateWallSnap(finalPos, roomDimensions);
      finalPos = snapped.position;
      finalRot = snapped.rotation;
      finalPos = clampPositionToRoom(finalPos, roomDimensions, activeObject.size, activeObject.rotation);
    } else {
      finalPos = clampPositionToRoom(finalPos, roomDimensions, activeObject.size, activeObject.rotation);
    }

    updateObjectTransform(activeObjectId, finalPos, finalRot);
  };

  const handleRotate = (dy: number) => {
    const [rx, ry, rz] = activeObject.rotation;
    const newRot: [number, number, number] = [rx, ry + dy, rz];
    let finalPos = activeObject.position;
    
    if (activeObject.assetType === 'Door' || activeObject.assetType === 'Mirror') {
      const snapped = calculateWallSnap(finalPos, roomDimensions);
      finalPos = snapped.position;
      finalPos = clampPositionToRoom(finalPos, roomDimensions, activeObject.size, newRot);
    } else {
      finalPos = clampPositionToRoom(finalPos, roomDimensions, activeObject.size, newRot);
    }
    
    updateObjectTransform(activeObjectId, finalPos, newRot);
  };

  const handleMoveY = (dy: number) => {
    const [x, y, z] = activeObject.position;
    updateObjectTransform(activeObjectId, [x, Math.max(0, y + dy), z], activeObject.rotation);
  };

  const handleScale = (ds: number) => {
    const currentScale = activeObject.scale || 1;
    const newScale = Math.max(0.1, currentScale + ds);
    const scaleRatio = newScale / currentScale;
    
    // Estimate new size
    const newSize: [number, number, number] = activeObject.size ? [
      activeObject.size[0] * scaleRatio,
      activeObject.size[1] * scaleRatio,
      activeObject.size[2] * scaleRatio
    ] : [0, 0, 0];

    const finalPos = clampPositionToRoom(activeObject.position, roomDimensions, newSize, activeObject.rotation);
    
    updateObjectScale(activeObjectId, newScale);
    updateObjectTransform(activeObjectId, finalPos, activeObject.rotation);
  };

  return (
    <div className="flex-1 flex flex-col p-5 bg-[#0a0a0a] gap-6 overflow-y-auto">
      <div className="flex justify-between items-center w-full">
        <span id="object-name" className="text-white/80 text-sm font-bold uppercase tracking-widest" aria-live="polite">
          {activeObject.assetType.replace(/([A-Z])/g, ' $1').trim()}
        </span>
        <button 
          onClick={() => setActiveObjectId(null)}
          aria-label="Close object controls"
          className="p-1.5 bg-white/5 hover:bg-white/10 rounded-md border border-white/10 transition-colors"
        >
          <X size={16} className="text-white/60" aria-hidden="true" />
        </button>
      </div>

      {/* Movement Controls (D-Pad) */}
      <div className="flex flex-col items-center" role="group" aria-labelledby="move-controls">
        <span id="move-controls" className="text-[10px] text-white/40 uppercase tracking-widest mb-2">Move</span>
        <div className="grid grid-cols-3 gap-2">
          <div />
          <button onClick={() => handleMove(0, -STEP)} aria-label="Move Forward" className="p-4 bg-white/5 hover:bg-[#cca550]/20 hover:text-[#cca550] hover:border-[#cca550]/50 border border-white/10 rounded-xl flex items-center justify-center transition-all shadow-sm">
            <ArrowUp size={20} aria-hidden="true" />
          </button>
          <div />
          
          <button onClick={() => handleMove(-STEP, 0)} aria-label="Move Left" className="p-4 bg-white/5 hover:bg-[#cca550]/20 hover:text-[#cca550] hover:border-[#cca550]/50 border border-white/10 rounded-xl flex items-center justify-center transition-all shadow-sm">
            <ArrowLeft size={20} aria-hidden="true" />
          </button>
          <button onClick={() => handleMove(0, STEP)} aria-label="Move Backward" className="p-4 bg-white/5 hover:bg-[#cca550]/20 hover:text-[#cca550] hover:border-[#cca550]/50 border border-white/10 rounded-xl flex items-center justify-center transition-all shadow-sm">
            <ArrowDown size={20} aria-hidden="true" />
          </button>
          <button onClick={() => handleMove(STEP, 0)} aria-label="Move Right" className="p-4 bg-white/5 hover:bg-[#cca550]/20 hover:text-[#cca550] hover:border-[#cca550]/50 border border-white/10 rounded-xl flex items-center justify-center transition-all shadow-sm">
            <ArrowRight size={20} aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* Rotation Controls */}
      <div className="flex flex-col items-center mt-2" role="group" aria-labelledby="rotate-controls">
        <span id="rotate-controls" className="text-[10px] text-white/40 uppercase tracking-widest mb-2">Rotate</span>
        <div className="flex gap-4 w-full">
          <button onClick={() => handleRotate(ROT_STEP)} aria-label="Rotate Counter Clockwise" className="flex-1 py-4 bg-white/5 hover:bg-[#cca550]/20 hover:text-[#cca550] hover:border-[#cca550]/50 border border-white/10 rounded-xl flex items-center justify-center transition-all shadow-sm">
            <RotateCcw size={20} aria-hidden="true" />
          </button>
          <button onClick={() => handleRotate(-ROT_STEP)} aria-label="Rotate Clockwise" className="flex-1 py-4 bg-white/5 hover:bg-[#cca550]/20 hover:text-[#cca550] hover:border-[#cca550]/50 border border-white/10 rounded-xl flex items-center justify-center transition-all shadow-sm">
            <RotateCw size={20} aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* Elevation Controls */}
      <div className="flex flex-col items-center mt-2" role="group" aria-labelledby="elevation-controls">
        <span id="elevation-controls" className="text-[10px] text-white/40 uppercase tracking-widest mb-2">Elevation</span>
        <div className="flex gap-4 w-full">
          <button onClick={() => handleMoveY(STEP)} aria-label="Move Up" className="flex-1 py-4 bg-white/5 hover:bg-[#cca550]/20 hover:text-[#cca550] hover:border-[#cca550]/50 border border-white/10 rounded-xl flex items-center justify-center transition-all shadow-sm">
            <ChevronUp size={20} aria-hidden="true" />
          </button>
          <button onClick={() => handleMoveY(-STEP)} aria-label="Move Down" className="flex-1 py-4 bg-white/5 hover:bg-[#cca550]/20 hover:text-[#cca550] hover:border-[#cca550]/50 border border-white/10 rounded-xl flex items-center justify-center transition-all shadow-sm">
            <ChevronDown size={20} aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* Size Controls */}
      <div className="flex flex-col items-center mt-2" role="group" aria-labelledby="size-controls">
        <span id="size-controls" className="text-[10px] text-white/40 uppercase tracking-widest mb-2">Size</span>
        <div className="flex gap-4 w-full">
          <button onClick={() => handleScale(0.1)} aria-label="Increase Size" className="flex-1 py-4 bg-white/5 hover:bg-[#cca550]/20 hover:text-[#cca550] hover:border-[#cca550]/50 border border-white/10 rounded-xl flex items-center justify-center transition-all shadow-sm">
            <Plus size={20} aria-hidden="true" />
          </button>
          <button onClick={() => handleScale(-0.1)} aria-label="Decrease Size" className="flex-1 py-4 bg-white/5 hover:bg-[#cca550]/20 hover:text-[#cca550] hover:border-[#cca550]/50 border border-white/10 rounded-xl flex items-center justify-center transition-all shadow-sm">
            <Minus size={20} aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-auto pt-6 border-t border-white/5">
        <button 
          onClick={() => removePlacedObject(activeObjectId)} 
          aria-label="Remove Item"
          className="w-full py-4 bg-red-500/10 hover:bg-red-500 hover:text-white text-red-400 border border-red-500/20 rounded-xl flex items-center justify-center gap-2 transition-all font-bold uppercase tracking-widest text-xs"
        >
          <Trash2 size={16} aria-hidden="true" /> Remove Item
        </button>
      </div>
    </div>
  );
}
