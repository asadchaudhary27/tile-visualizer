import { useState, useEffect } from 'react';
import { useDesignStore } from '../store/useDesignStore';
import { Ruler, ChevronRight, Bed, Bath, ChefHat, Box } from 'lucide-react';
import { feetToMeters, inchesToMeters } from '../lib/unitMath';
import type { UnitSystem } from '../lib/unitMath';

export default function RoomSetupModal() {
  const { setRoomDimensions, setRoomType, setIsRoomConfigured, generateAutoLayout, unitSystem: globalUnit, setUnitSystem } = useDesignStore();
  
  const [type, setType] = useState<'bathroom' | 'bedroom' | 'kitchen' | 'empty'>('empty');
  const [unit, setUnit] = useState<UnitSystem>(globalUnit);
  const [length, setLength] = useState(3);
  const [width, setWidth] = useState(3);
  const [height, setHeight] = useState(2.6);

  // Update default values when unit changes
  useEffect(() => {
    if (unit === 'meters') {
      setLength(3); setWidth(3); setHeight(2.6);
    } else if (unit === 'feet') {
      setLength(10); setWidth(10); setHeight(9);
    } else if (unit === 'inches') {
      setLength(120); setWidth(120); setHeight(108);
    }
  }, [unit]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setUnitSystem(unit);
    
    // Convert inputs to meters for the engine
    let finalLength = length;
    let finalWidth = width;
    let finalHeight = height;
    
    if (unit === 'feet') {
      finalLength = feetToMeters(length);
      finalWidth = feetToMeters(width);
      finalHeight = feetToMeters(height);
    } else if (unit === 'inches') {
      finalLength = inchesToMeters(length);
      finalWidth = inchesToMeters(width);
      finalHeight = inchesToMeters(height);
    }

    setRoomDimensions({ length: finalLength, width: finalWidth, height: finalHeight });
    setRoomType(type);
    setIsRoomConfigured(true);
    generateAutoLayout(type);
  };

  const types = [
    { id: 'empty', label: 'Empty', icon: Box },
    { id: 'bathroom', label: 'Bathroom', icon: Bath },
    { id: 'bedroom', label: 'Bedroom', icon: Bed },
    { id: 'kitchen', label: 'Kitchen', icon: ChefHat },
  ] as const;

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-[#020617]/80 backdrop-blur-md">
      <div className="w-full max-w-md p-8 rounded-3xl bg-[#0F172A]/80 border border-white/10 shadow-[0_12px_48px_rgba(0,0,0,0.6)] backdrop-blur-xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-teal-500/20 flex items-center justify-center text-teal-400 border border-teal-500/30">
            <Ruler size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-extrabold text-white tracking-tight">Room Setup</h2>
            <p className="text-sm text-white/50">Define your space dimensions</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Room Type Selection */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-white/60 uppercase tracking-widest">Select Type</label>
            <div className="grid grid-cols-2 gap-2">
              {types.map(t => {
                const Icon = t.icon;
                const isActive = type === t.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setType(t.id)}
                    className={`flex items-center gap-2 p-3.5 rounded-xl border transition-all duration-300 ${
                      isActive 
                        ? 'bg-teal-500/20 border-teal-500/50 text-teal-300 shadow-[0_0_15px_rgba(20,184,166,0.15)]' 
                        : 'bg-[#020617]/50 border-white/5 text-white/50 hover:bg-white/5 hover:border-white/10 hover:text-white/90'
                    }`}
                  >
                    <Icon size={18} />
                    <span className="text-sm font-bold tracking-wide">{t.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Dimensions */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-white/60 uppercase tracking-widest">Dimensions</label>
              <div className="flex items-center bg-[#020617]/50 border border-white/5 rounded-lg p-1">
                {(['meters', 'feet', 'inches'] as UnitSystem[]).map(u => (
                  <button
                    key={u}
                    type="button"
                    onClick={() => setUnit(u)}
                    className={`px-3 py-1.5 text-[10px] uppercase tracking-widest rounded-md transition-all font-bold ${unit === u ? 'bg-teal-500 text-white shadow-md' : 'text-white/40 hover:text-white'}`}
                  >
                    {u}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex-1 space-y-1.5">
                <label className="text-[10px] text-white/40 font-bold tracking-widest uppercase">Length</label>
                <input 
                  type="number" 
                  step="0.1"
                  min="0.5"
                  value={length}
                  onChange={e => setLength(parseFloat(e.target.value) || 0)}
                  className="w-full bg-[#020617]/60 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all font-bold"
                />
              </div>
              <div className="text-white/20 mt-5 font-bold">X</div>
              <div className="flex-1 space-y-1.5">
                <label className="text-[10px] text-white/40 font-bold tracking-widest uppercase">Width</label>
                <input 
                  type="number" 
                  step="0.1"
                  value={width}
                  onChange={e => setWidth(parseFloat(e.target.value) || 3)}
                  className="w-full bg-[#020617]/60 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all font-bold"
                />
              </div>
            </div>

            <div className="flex-1 space-y-1.5 pt-2">
              <label className="text-[10px] text-white/40 font-bold tracking-widest uppercase">Ceiling Height</label>
              <input 
                type="number" 
                step="0.1"
                min="2"
                value={height}
                onChange={e => setHeight(parseFloat(e.target.value) || 2.6)}
                className="w-full bg-[#020617]/60 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all font-bold"
              />
            </div>
          </div>

          <button 
            type="submit"
            className="w-full py-4 mt-8 rounded-xl bg-teal-500 text-white font-extrabold uppercase tracking-widest hover:bg-teal-400 shadow-[0_0_20px_rgba(20,184,166,0.3)] hover:shadow-[0_0_30px_rgba(20,184,166,0.5)] transition-all duration-300 flex items-center justify-center gap-2 group"
          >
            Start Designing
            <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </form>
      </div>
    </div>
  );
}
