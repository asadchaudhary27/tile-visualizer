import { useState, useEffect } from 'react';
import type { PatternType } from '../lib/types';
import { TILES } from '../data/tiles';
import { buildCombinedPattern, getGridSize } from '../lib/patternGenerator';

interface Props {
  onApply: (layout: { type: PatternType, tileIds: string[], gridSize?: number }, patternUrl: string) => void;
}

export default function CustomLayoutBuilder({ onApply }: Props) {
  const [numTiles, setNumTiles] = useState<2 | 3 | 4>(2);
  const [patternType, setPatternType] = useState<PatternType>('checkerboard');
  const [selectedTileIds, setSelectedTileIds] = useState<string[]>([]);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);

  // Initialize selected tiles when numTiles changes
  useEffect(() => {
    const defaultTile = TILES[0]?.id || '';
    const newTiles = Array(numTiles).fill(defaultTile);
    // keep existing choices if possible
    for (let i = 0; i < Math.min(selectedTileIds.length, numTiles); i++) {
      newTiles[i] = selectedTileIds[i];
    }
    setSelectedTileIds(newTiles);
  }, [numTiles]);

  // Generate pattern preview
  useEffect(() => {
    if (selectedTileIds.length !== numTiles) return;
    
    let isMounted = true;
    const generate = async () => {
      setIsGenerating(true);
      try {
        const imageUrls = selectedTileIds.map(id => TILES.find(t => t.id === id)?.imageUrl || '');
        const url = await buildCombinedPattern({ type: patternType, tileIds: selectedTileIds }, imageUrls);
        if (isMounted) setPreviewUrl(url);
      } finally {
        if (isMounted) setIsGenerating(false);
      }
    };
    generate();
    return () => { isMounted = false; };
  }, [numTiles, patternType, selectedTileIds]);

  const handleApply = () => {
    if (previewUrl) {
      onApply({ type: patternType, tileIds: selectedTileIds, gridSize: getGridSize(patternType, selectedTileIds.length) }, previewUrl);
    }
  };

  return (
    <div className="flex flex-col h-full bg-transparent">
      <div className="p-5 space-y-6 flex-1 overflow-y-auto custom-scrollbar">
        
        {/* Tile Count Selection */}
        <div>
          <label className="text-[10px] font-extrabold text-white/30 uppercase tracking-widest mb-3 block">Number of Tiles</label>
          <div className="flex gap-2">
            {[2, 3, 4].map(n => (
              <button 
                key={n}
                onClick={() => setNumTiles(n as any)}
                className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all duration-300 ${numTiles === n ? 'bg-teal-500/20 ring-1 ring-teal-500/60 text-teal-300 shadow-[0_0_12px_rgba(20,184,166,0.15)]' : 'bg-white/5 ring-1 ring-white/10 text-white/50 hover:ring-white/30 hover:text-white/90 hover:bg-white/10'}`}
              >
                {n}
              </button>
            ))}
          </div>
        </div>

        {/* Pattern Type Selection */}
        <div>
          <label className="text-[10px] font-extrabold text-white/30 uppercase tracking-widest mb-3 block">Pattern Type</label>
          <div className="grid grid-cols-2 gap-2">
            {['checkerboard', 'stripes', 'accent-band', 'random-mix', 'diagonal'].map(p => {
              return (
                <button 
                  key={p}
                  onClick={() => setPatternType(p as PatternType)}
                  className={`py-2 px-2 text-[10px] font-bold uppercase tracking-wider rounded-lg transition-all duration-300 ${
                    patternType === p ? 'bg-teal-500/20 ring-1 ring-teal-500/60 text-teal-300 shadow-[0_0_12px_rgba(20,184,166,0.15)]' : 'bg-white/5 ring-1 ring-white/10 text-white/50 hover:ring-white/30 hover:text-white/90 hover:bg-white/10'
                  }`}
                >
                  {p.replace('-', ' ')}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tile Assignments */}
        <div>
          <label className="text-[10px] font-extrabold text-white/30 uppercase tracking-widest mb-3 block">Assign Tiles</label>
          <div className="space-y-3">
            {selectedTileIds.map((tileId, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-teal-500/20 ring-1 ring-teal-500/50 flex items-center justify-center flex-shrink-0">
                   <span className="text-[10px] font-extrabold text-teal-400">{index + 1}</span>
                </div>
                <select 
                  value={tileId}
                  onChange={(e) => {
                    const newIds = [...selectedTileIds];
                    newIds[index] = e.target.value;
                    setSelectedTileIds(newIds);
                  }}
                  className="flex-1 text-xs font-medium border-0 ring-1 ring-white/10 rounded-lg focus:ring-2 focus:ring-teal-500 bg-black/40 text-white/90 p-2.5 outline-none transition-all hover:ring-white/20"
                >
                  {TILES.map(t => (
                    <option key={t.id} value={t.id} className="bg-gray-900 text-white">{t.name}</option>
                  ))}
                </select>
              </div>
            ))}
          </div>
        </div>

        {/* Live Preview */}
        <div className="pt-4 border-t border-white/10">
          <label className="text-[10px] font-extrabold text-white/30 uppercase tracking-widest mb-3 block">Pattern Preview</label>
          <div className="aspect-square w-full rounded-xl ring-1 ring-white/10 overflow-hidden relative bg-black/40 shadow-inner">
            {isGenerating ? (
              <div className="absolute inset-0 flex items-center justify-center text-teal-400 font-semibold tracking-wider text-xs uppercase animate-pulse bg-black/40">Generating...</div>
            ) : previewUrl ? (
              <img src={previewUrl} className="w-full h-full object-cover transition-transform duration-700 hover:scale-105" alt="Pattern preview" />
            ) : null}
          </div>
        </div>

      </div>
      
      <div className="p-5 border-t border-white/10 bg-black/40 backdrop-blur-md">
        <button 
          onClick={handleApply}
          disabled={isGenerating || !previewUrl}
          className="w-full py-3 bg-teal-600 hover:bg-teal-500 text-white rounded-lg text-xs tracking-wider uppercase font-extrabold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_15px_rgba(20,184,166,0.2)] hover:shadow-[0_0_25px_rgba(20,184,166,0.4)]"
        >
          Apply Custom Layout
        </button>
      </div>
    </div>
  );
}
