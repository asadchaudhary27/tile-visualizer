import { useState } from 'react';
import { TILES } from '../data/tiles';
import { TILE_SIZES, DEFAULT_TILE_SIZE_ID } from '../data/tileSizes';
import type { Material, Finish, Surface, Room } from '../lib/types';
import { useDesignStore } from '../store/useDesignStore';
import { Check, X, Search } from 'lucide-react';
import CustomLayoutBuilder from './CustomLayoutBuilder';

interface Props {
  room: Room; surface: Surface; onClose: () => void; pixelsPerInch?: number;
}

const MATERIALS: { value: Material | 'all'; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'ceramic', label: 'Ceramic' },
  { value: 'marble', label: 'Marble' },
  { value: 'mixed', label: 'Mixed' },
  { value: 'custom', label: 'Custom Images' },
];
const FINISHES: { value: Finish | 'all'; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'matte', label: 'Matte' },
  { value: 'glossy', label: 'Glossy' },
  { value: 'textured', label: 'Textured' },
];

export default function TilePickerPanel({ room, surface, onClose, pixelsPerInch = 4 }: Props) {
  const [mat, setMat] = useState<Material | 'all'>('all');
  const [fin, setFin] = useState<Finish | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [mode, setMode] = useState<'single' | 'layout'>('single');
  const [hovTile, setHovTile] = useState<string | null>(null);

  const { configs, setConfig, clearConfig, applyToScope, lightingMode, setLightingMode } = useDesignStore();
  const cfg = configs[surface.id];
  const sizeId = cfg?.tileSizeId ?? DEFAULT_TILE_SIZE_ID;
  const selectedSize = TILE_SIZES.find(s => s.id === sizeId) ?? TILE_SIZES[6];

  const tiles = TILES.filter(t => {
    if (mat !== 'all' && t.material !== mat) return false;
    if (fin !== 'all' && t.finish !== fin) return false;
    if (searchQuery && !t.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const applyTile = (tileId: string) =>
    setConfig({ ...(cfg ?? {}), surfaceId: surface.id, mode: 'single', tileId, tileSizeId: sizeId });

  const applySize = (newSizeId: string) => {
    if (cfg) setConfig({ ...cfg, tileSizeId: newSizeId });
  };

  const applyRotation = (degree: number) => {
    if (cfg) setConfig({ ...cfg, rotationDegree: degree });
  };

  const applyFinish = (finish: 'glossy' | 'matte' | 'satin') => {
    if (cfg) setConfig({ ...cfg, finish });
  };

  const applyGroutColor = (color: string) => {
    if (cfg) setConfig({ ...cfg, groutColor: color });
  };

  const applyGroutThickness = (thickness: number) => {
    if (cfg) setConfig({ ...cfg, groutThickness: thickness });
  };

  const currentRotation = cfg?.rotationDegree ?? 0;
  const currentFinish = cfg?.finish ?? 'matte';
  const currentGroutColor = cfg?.groutColor ?? '#d0cbc4';
  const currentGroutThickness = cfg?.groutThickness ?? 4;

  const applyScope = (scope: 'walls' | 'floor' | 'room') => {
    const targets = room.surfaces.filter(s =>
      s.id !== surface.id &&
      (scope === 'room' ? true : scope === 'walls' ? s.type === 'wall' : s.type === 'floor')
    ).map(s => s.id);
    applyToScope(surface.id, targets);
  };

  const currentTile = cfg?.mode === 'single' ? TILES.find(t => t.id === cfg.tileId) : null;
  const aspect = selectedSize.heightIn / selectedSize.widthIn;

  return (
    <div className="w-full flex-shrink-0 bg-transparent flex flex-col h-full z-20 transition-all duration-300">

      {/* ── Header ── */}
      <div className="px-6 py-6 flex items-start justify-between border-b border-white/10 bg-gradient-to-b from-white/[0.05] to-transparent shrink-0">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest ${
              surface.type === 'wall' ? 'bg-blue-500/20 text-blue-300 ring-1 ring-blue-500/30' : 'bg-amber-500/20 text-amber-300 ring-1 ring-amber-500/30'
            }`}>
              {surface.type} Surface
            </span>
            <span className="text-white/30 text-[10px] font-bold uppercase tracking-wider">
              {room.name}
            </span>
          </div>
          <h2 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-white/70 tracking-tight">
            {surface.label}
          </h2>
        </div>
        <button onClick={onClose}
          className="w-8 h-8 rounded-full flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all duration-300 flex-shrink-0 mt-1 bg-black/20 ring-1 ring-white/5"
        >
          <X size={16}/>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto overflow-x-hidden">

      {/* ── Mode toggle ── */}
      <div className="px-5 py-4 border-b border-white/10">
        <div className="flex rounded-lg bg-black/40 p-1 ring-1 ring-white/10 shadow-inner">
          {(['single', 'layout'] as const).map(m => (
            <button key={m} onClick={() => setMode(m)}
              className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded-md transition-all duration-300 ${
                mode === m ? 'bg-white/15 text-white shadow-md ring-1 ring-white/20' : 'text-white/40 hover:text-white/80 hover:bg-white/5'
              }`}
            >
              {m === 'single' ? 'Single Tile' : 'Custom Layout'}
            </button>
          ))}
        </div>
      </div>

      {mode === 'single' && (
        <>
          {/* ── Tile size ── */}
          <div className="px-5 pt-5 pb-4 border-b border-white/10">
            <p className="text-[10px] font-extrabold text-white/30 uppercase tracking-widest mb-3">Tile Size</p>
            <div className="relative">
              <select
                value={sizeId}
                onChange={(e) => applySize(e.target.value)}
                className="w-full bg-black/40 border border-white/10 text-white font-semibold tracking-wide text-xs px-3 py-2.5 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-500 appearance-none cursor-pointer hover:bg-black/60 transition-colors"
              >
                {TILE_SIZES.map(sz => (
                  <option key={sz.id} value={sz.id} className="bg-gray-900 text-white">
                    {sz.label}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-white/40">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
              </div>
            </div>
          </div>

          {/* ── Tile Rotation ── */}
          <div className="px-5 pt-5 pb-4 border-b border-white/10">
            <p className="text-[10px] font-extrabold text-white/30 uppercase tracking-widest mb-3">Tile Rotation</p>
            <div className="flex flex-wrap gap-2">
              {[0, 45, 90, 135, 180].map(deg => (
                <button key={`rot-${deg}`} onClick={() => applyRotation(deg)}
                  className={`text-[10px] px-3 py-1.5 rounded-full font-bold uppercase tracking-wider transition-all duration-300 ${
                    currentRotation === deg
                      ? 'bg-teal-500/20 ring-1 ring-teal-500/60 text-teal-300 shadow-[0_0_12px_rgba(20,184,166,0.15)]'
                      : 'bg-white/5 ring-1 ring-white/10 text-white/50 hover:ring-white/30 hover:text-white/90 hover:bg-white/10'
                  }`}
                >
                  {deg}°
                </button>
              ))}
            </div>
          </div>

          {/* ── Filters ── */}
          <div className="px-5 py-4 border-b border-white/10 space-y-4">
            <div className="flex items-start gap-3">
              <span className="text-[10px] font-extrabold text-white/30 uppercase tracking-widest w-14 flex-shrink-0 pt-1.5">Finish</span>
              <div className="flex gap-2 flex-wrap">
                {FINISHES.map(f => (
                  <button key={f.value} onClick={() => setFin(f.value)}
                    className={`text-[10px] px-3 py-1.5 rounded-full transition-all duration-300 font-bold uppercase tracking-wider ${
                      fin === f.value ? 'bg-teal-500/20 ring-1 ring-teal-500/60 text-teal-300 shadow-[0_0_12px_rgba(20,184,166,0.15)]' : 'bg-white/5 ring-1 ring-white/10 text-white/50 hover:ring-white/30 hover:text-white/90 hover:bg-white/10'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* ── Search Bar ── */}
          <div className="px-5 py-3 border-b border-white/10 bg-black/20">
             <div className="relative group">
                <input 
                  type="text" 
                  placeholder="Search by tile name..." 
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 text-white text-xs px-3 py-2.5 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-500 placeholder-white/30 pl-9 transition-colors group-hover:border-white/20"
                />
                <div className="absolute left-3 top-2.5 text-white/30 group-hover:text-white/50 transition-colors">
                   <Search size={14} />
                </div>
                {searchQuery && (
                  <button onClick={() => setSearchQuery('')} className="absolute right-3 top-2.5 text-white/30 hover:text-white/80">
                    <X size={14} />
                  </button>
                )}
             </div>
          </div>

          {/* ── Tile grid ── */}
          <div className="flex-1 overflow-y-auto p-5 custom-scrollbar">
            {tiles.length === 0 ? (
              <div className="text-center py-12 text-white/30 text-xs font-semibold tracking-wide">No tiles match filters</div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                {tiles.map(tile => {
                  const isSel = cfg?.mode === 'single' && cfg.tileId === tile.id;
                  const isHov = hovTile === tile.id;
                  return (
                    <div key={tile.id} onClick={() => applyTile(tile.id)}
                      onMouseEnter={() => setHovTile(tile.id)}
                      onMouseLeave={() => setHovTile(null)}
                      className={`relative cursor-pointer rounded-xl overflow-hidden transition-all duration-300 group ${
                        isSel ? 'ring-2 ring-teal-500 shadow-[0_0_20px_rgba(20,184,166,0.3)]'
                               : 'ring-1 ring-white/10 hover:ring-white/30 hover:shadow-xl hover:-translate-y-1'
                      }`}
                    >
                      {/* Tile preview at correct aspect ratio */}
                      <div className="w-full bg-black/40 overflow-hidden" style={{ aspectRatio: `1 / ${Math.min(aspect, 2.5)}` }}>
                        <img src={tile.imageUrl} alt={tile.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-90 group-hover:opacity-100"/>
                        {/* Inner shadow overlay */}
                        <div className="absolute inset-0 shadow-[inset_0_-20px_30px_rgba(0,0,0,0.6)] pointer-events-none" />
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 p-3 pt-6 bg-gradient-to-t from-black/90 to-transparent">
                        <p className="text-[11px] font-bold text-white truncate leading-tight drop-shadow-md">{tile.name}</p>
                        <p className="text-[9px] text-white/60 uppercase tracking-wider mt-1 drop-shadow-sm">{tile.material} · {tile.finish}</p>
                      </div>
                      {isSel && (
                        <div className="absolute top-2 right-2 w-6 h-6 bg-teal-500 rounded-full flex items-center justify-center shadow-lg ring-2 ring-white/20">
                          <Check size={12} className="text-white"/>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </>
      )}

      {mode === 'layout' && (
        <div className="p-5">
          <CustomLayoutBuilder onApply={(layout, patternUrl) => {
            setConfig({ surfaceId: surface.id, mode: 'layout', layout, generatedPatternUrl: patternUrl, tileSizeId: sizeId });
          }}/>
        </div>
      )}
      </div>

      {/* ── Apply to scope + clear ── */}
      <div className="border-t border-white/10 p-5 space-y-4 bg-black/40 backdrop-blur-md shrink-0">
        {cfg && (
          <div>
            <p className="text-[10px] font-extrabold text-white/30 uppercase tracking-widest mb-3">Apply this design to</p>
            <div className="grid grid-cols-3 gap-2">
              {([
                ['walls', 'All Walls'],
                ['floor', 'Floor'],
                ['room', 'Entire Room'],
              ] as const).map(([scope, label]) => (
                <button key={scope} onClick={() => applyScope(scope)}
                  className="py-2.5 text-[10px] uppercase tracking-wider font-bold rounded-lg transition-all duration-300 bg-white/5 hover:bg-teal-500/20 text-white/60 hover:text-teal-300 ring-1 ring-white/10 hover:ring-teal-500/40 hover:shadow-[0_0_15px_rgba(20,184,166,0.15)]"
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        )}
        <button onClick={() => clearConfig(surface.id)}
          className="w-full py-3 text-[11px] uppercase tracking-wider font-extrabold rounded-lg transition-all duration-300 text-red-400/80 hover:text-white bg-red-500/10 hover:bg-red-500 ring-1 ring-red-500/30 hover:ring-red-500 shadow-md hover:shadow-[0_0_20px_rgba(239,68,68,0.4)]"
        >
          Clear Surface
        </button>
      </div>
    </div>
  );
}
