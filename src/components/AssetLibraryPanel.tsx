import React from 'react';
import { useDesignStore } from '../store/useDesignStore';
import { Box, Trash2, ChevronLeft, ChevronRight, ChevronUp, ChevronDown, RotateCcw, RotateCw } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { ASSET_CATEGORIES } from '../lib/assetCatalog';
import { findEmptySpawnPosition } from '../utils/autoLayout';

function AssetThumbnail({ asset, category }: { asset: any, category: any }) {
  const thumbnails = useDesignStore(s => s.thumbnails);
  const queueThumbnail = useDesignStore(s => s.queueThumbnail);
  const dataUrl = thumbnails[asset.type];

  React.useEffect(() => {
    if (!dataUrl && asset.type.startsWith('glb:')) {
      queueThumbnail(asset.type);
    }
  }, [dataUrl, asset.type, queueThumbnail]);

  if (dataUrl) {
    return (
      <img 
        src={dataUrl} 
        alt={asset.label} 
        className="w-16 h-16 object-contain drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)] opacity-70 group-hover:opacity-100 group-hover:scale-110 group-hover:-translate-y-1 transition-all duration-500 relative z-10" 
      />
    );
  }

  return <asset.icon size={32} className={`relative z-10 text-white/40 group-hover:${category.color} transition-colors duration-300 group-hover:scale-110`} strokeWidth={1.5} />;
}

interface Props {
  roomType: string;
}

export default function AssetLibraryPanel({ roomType }: Props) {
  const addPlacedObject = useDesignStore(s => s.addPlacedObject);
  const activeObjectId = useDesignStore(s => s.activeObjectId);
  const removePlacedObject = useDesignStore(s => s.removePlacedObject);
  const placedObjects = useDesignStore(s => s.placedObjects);
  const generateAutoLayout = useDesignStore(s => s.generateAutoLayout);
  const updateObjectAssetType = useDesignStore(s => s.updateObjectAssetType);
  const updateObjectTransform = useDesignStore(s => s.updateObjectTransform);
  const roomDimensions = useDesignStore(s => s.roomDimensions);
  const setActiveObjectId = useDesignStore(s => s.setActiveObjectId);
  const selectedCategoryId = useDesignStore(s => s.selectedCategoryId);
  const setSelectedCategoryId = useDesignStore(s => s.setSelectedCategoryId);

  const handleMove = (obj: any, axis: 'x'|'y'|'z', delta: number) => {
    const newPos = [...obj.position] as [number, number, number];
    if (axis === 'x') newPos[0] += delta;
    if (axis === 'y') newPos[1] += delta;
    if (axis === 'z') newPos[2] += delta;
    updateObjectTransform(obj.id, newPos, obj.rotation);
  };

  const handleRotate = (obj: any, delta: number) => {
    const newRot = [...obj.rotation] as [number, number, number];
    newRot[1] += delta;
    updateObjectTransform(obj.id, obj.position, newRot);
  };

  const handleAddObject = (assetType: string) => {
    if (activeObjectId) {
      updateObjectAssetType(activeObjectId, assetType);
    } else {
      const spawnPos = findEmptySpawnPosition(placedObjects, roomDimensions);
      const newId = uuidv4();
      addPlacedObject({
        id: newId,
        assetType,
        position: spawnPos,
        rotation: [0, 0, 0]
      });
      // Automatically select the newly added object so the control UI appears immediately
      setActiveObjectId(newId);
    }
  };

  const renderCategories = () => (
    <div className="flex flex-col gap-3 p-6">
      {ASSET_CATEGORIES.map(category => (
        <button
          key={category.id}
          onClick={() => setSelectedCategoryId(category.id)}
          aria-label={`Open ${category.label} category`}
          aria-expanded={selectedCategoryId === category.id}
          className={`group flex items-center gap-4 p-4 rounded-2xl border transition-all duration-300 bg-[#020617]/50 hover:bg-white/5 ${category.border} hover:shadow-[0_4px_20px_rgba(255,255,255,0.05)]`}
        >
          <div className={`p-3 rounded-xl ${category.bg} border ${category.border} group-hover:scale-110 transition-transform duration-300`}>
            <category.icon size={22} className={category.color} />
          </div>
          <div className="flex flex-col items-start text-left">
            <span className="text-sm font-extrabold text-white tracking-wide">{category.label}</span>
            <span className="text-[10px] text-white/50 uppercase tracking-widest mt-1 font-bold">{category.subcategories.reduce((acc, sub) => acc + sub.assets.length, 0)} items</span>
          </div>
          <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
            <ChevronLeft size={16} className={`rotate-180 ${category.color}`} />
          </div>
        </button>
      ))}
    </div>
  );

  const renderItems = () => {
    const category = ASSET_CATEGORIES.find(c => c.id === selectedCategoryId);
    if (!category) return null;

    return (
      <div className="flex flex-col">
        <div className="p-6 border-b border-white/5 sticky top-0 bg-[#020617]/50 backdrop-blur-xl z-50 flex items-center gap-4 shrink-0">
          <button 
            onClick={() => setSelectedCategoryId(null)}
            aria-label="Back to categories"
            className="p-2 bg-white/5 hover:bg-white/10 rounded-lg border border-white/5 transition-colors group"
          >
            <ChevronLeft size={18} className="text-white/70 group-hover:text-white group-hover:-translate-x-0.5 transition-all" aria-hidden="true" />
          </button>
          <div className={`p-2 rounded-xl ${category.bg} border ${category.border}`}>
            <category.icon size={18} className={category.color} />
          </div>
          <h2 className="text-white text-sm font-extrabold uppercase tracking-widest">
            {category.label}
          </h2>
        </div>

        <div className="p-6 flex flex-col gap-6">
          {category.subcategories.map(sub => (
            <div key={sub.id}>
              <h3 className="text-white/40 text-[10px] font-bold uppercase tracking-wider mb-3 ml-1">{sub.label}</h3>
              <div className="grid grid-cols-2 gap-4">
                {sub.assets.map(asset => (
                  <button
                    key={asset.id}
                    onClick={() => handleAddObject(asset.type)}
                    aria-label={`Add ${asset.label} to room`}
                    className="group relative flex flex-col items-center justify-center gap-4 p-5 bg-[#020617]/50 hover:bg-white/5 border border-white/5 hover:border-white/20 rounded-2xl transition-all duration-300 overflow-hidden hover:shadow-[0_8px_30px_rgba(255,255,255,0.08)] hover:-translate-y-1"
                  >
                    <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${category.bg} blur-2xl`} />
                    <AssetThumbnail asset={asset} category={category} />
                    <span className="relative z-10 text-white/80 text-[11px] font-bold text-center leading-tight tracking-wide group-hover:text-white transition-colors">
                      {asset.label}
                    </span>
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-all duration-300 scale-75 group-hover:scale-100">
                      <div className={`w-5 h-5 rounded-full ${category.bg} ${category.color} flex items-center justify-center border ${category.border} shadow-lg`}>
                        <span className="text-sm font-bold leading-none">+</span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="h-full bg-transparent flex flex-col custom-scrollbar">
      {!selectedCategoryId && (
        <div className="p-6 border-b border-white/5 sticky top-0 bg-[#020617]/50 backdrop-blur-xl z-10 flex justify-between items-center shrink-0">
          <h2 className="text-white text-sm font-extrabold uppercase tracking-widest flex items-center gap-2">
            <Box size={16} className="text-teal-400" /> Catalog
          </h2>
          <button 
            onClick={() => generateAutoLayout(roomType)}
            aria-label="Auto Layout Room"
            className="px-3 py-1.5 bg-teal-500/20 text-teal-300 border border-teal-500/30 hover:bg-teal-500/40 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-colors shadow-[0_0_15px_rgba(20,184,166,0.15)]"
          >
            Auto Layout
          </button>
        </div>
      )}

      {selectedCategoryId ? renderItems() : renderCategories()}

      {placedObjects.length > 0 && (
        <div className="p-5 border-t border-white/10">
          <h3 className="text-white/40 text-[10px] font-bold uppercase tracking-wider mb-4 flex items-center gap-2">
            <Box size={14} /> Placed Objects ({placedObjects.length})
          </h3>
          <div className="flex flex-col gap-2">
            {placedObjects.map(obj => (
              <div key={obj.id} className={`flex flex-col rounded-lg border transition-all ${activeObjectId === obj.id ? 'bg-[#cca550]/10 border-[#cca550]/50 shadow-[0_0_15px_rgba(204,165,80,0.15)]' : 'bg-black/30 border-white/5 hover:bg-white/5'}`}>
                <div 
                  className="flex items-center justify-between px-3 py-2.5 cursor-pointer"
                  onClick={() => setActiveObjectId(activeObjectId === obj.id ? null : obj.id)}
                >
                  <span className={`text-xs font-semibold ${activeObjectId === obj.id ? 'text-[#cca550]' : 'text-white/70'}`}>
                    {obj.assetType}
                  </span>
                  <button 
                    onClick={(e) => { e.stopPropagation(); removePlacedObject(obj.id); }}
                    aria-label={`Remove ${obj.assetType}`}
                    className="p-1.5 text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded-md transition-colors"
                    title="Remove item"
                  >
                    <Trash2 size={12} aria-hidden="true" />
                  </button>
                </div>
                
                {activeObjectId === obj.id && (
                  <div className="px-3 pb-3 flex flex-col gap-2 border-t border-white/5 pt-2 mt-1">
                    <div className="text-[10px] text-white/40 uppercase font-bold text-center">Move & Rotate</div>
                    <div className="flex items-center justify-center gap-2" role="group" aria-label="Position Controls">
                      <button onClick={() => handleMove(obj, 'x', -0.1)} aria-label="Move Left" className="p-1.5 bg-white/5 hover:bg-white/10 rounded-md text-white/70 hover:text-white" title="Move Left"><ChevronLeft size={14}/></button>
                      <div className="flex flex-col gap-1">
                        <button onClick={() => handleMove(obj, 'z', -0.1)} aria-label="Move Forward" className="p-1.5 bg-white/5 hover:bg-white/10 rounded-md text-white/70 hover:text-white" title="Move Forward"><ChevronUp size={14}/></button>
                        <button onClick={() => handleMove(obj, 'z', 0.1)} aria-label="Move Backward" className="p-1.5 bg-white/5 hover:bg-white/10 rounded-md text-white/70 hover:text-white" title="Move Backward"><ChevronDown size={14}/></button>
                      </div>
                      <button onClick={() => handleMove(obj, 'x', 0.1)} aria-label="Move Right" className="p-1.5 bg-white/5 hover:bg-white/10 rounded-md text-white/70 hover:text-white" title="Move Right"><ChevronRight size={14}/></button>
                    </div>
                    <div className="flex items-center justify-center gap-4 mt-1" role="group" aria-label="Rotation Controls">
                      <button onClick={() => handleRotate(obj, -Math.PI/12)} aria-label="Rotate Left" className="p-1.5 bg-white/5 hover:bg-white/10 rounded-md text-white/70 hover:text-white" title="Rotate Left"><RotateCcw size={14}/></button>
                      <button onClick={() => handleRotate(obj, Math.PI/12)} aria-label="Rotate Right" className="p-1.5 bg-white/5 hover:bg-white/10 rounded-md text-white/70 hover:text-white" title="Rotate Right"><RotateCw size={14}/></button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
