import React, { useState, useEffect } from 'react';
import { useDesignStore } from '../store/useDesignStore';
import { Ruler } from 'lucide-react';
import { metersToFeet, feetToMeters } from '../lib/unitMath';

export default function CustomRoomInput() {
  const roomDimensions = useDesignStore(s => s.roomDimensions);
  const setRoomDimensions = useDesignStore(s => s.setRoomDimensions);
  const unitSystem = useDesignStore(s => s.unitSystem);
  const setUnitSystem = useDesignStore(s => s.setUnitSystem);

  const formatDisplayValue = (meters: number) => {
    if (meters === 0) return '';
    if (unitSystem === 'feet') {
      return metersToFeet(meters).toFixed(2);
    }
    if (unitSystem === 'inches') {
      return (meters * 39.3701).toFixed(2);
    }
    return meters.toFixed(2);
  };

  const [length, setLength] = useState(formatDisplayValue(roomDimensions.length));
  const [width, setWidth] = useState(formatDisplayValue(roomDimensions.width));
  const [height, setHeight] = useState(formatDisplayValue(roomDimensions.height));

  // Sync state if it changes externally or unit changes
  useEffect(() => {
    setLength(formatDisplayValue(roomDimensions.length));
    setWidth(formatDisplayValue(roomDimensions.width));
    setHeight(formatDisplayValue(roomDimensions.height));
  }, [roomDimensions, unitSystem]);

  const handleUpdate = () => {
    const parse = (val: string) => {
      const num = parseFloat(val);
      if (isNaN(num)) return null;
      if (unitSystem === 'feet') return feetToMeters(num);
      if (unitSystem === 'inches') return (num / 39.3701);
      return num;
    };

    const l = parse(length);
    const w = parse(width);
    const h = parse(height);

    if (l !== null && l > 0 && w !== null && w > 0 && h !== null && h > 0) {
      setRoomDimensions({ length: l, width: w, height: h });
    } else {
      // Revert on invalid input
      setLength(formatDisplayValue(roomDimensions.length));
      setWidth(formatDisplayValue(roomDimensions.width));
      setHeight(formatDisplayValue(roomDimensions.height));
    }
  };

  return (
    <div className="flex bg-[#141414]/90 backdrop-blur border border-white/10 rounded-lg p-2 shadow-2xl mt-2 flex-col gap-2 pointer-events-auto">
      <div className="flex items-center justify-between px-2 text-white/60 border-b border-white/10 pb-2">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest">
          <Ruler size={14} className="text-[#cca550]" /> Custom Dimensions
        </div>
        <div className="flex bg-black/40 rounded p-0.5 ring-1 ring-white/10">
          <button 
            onClick={() => setUnitSystem('meters')}
            className={`px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider rounded-sm transition-all ${unitSystem === 'meters' ? 'bg-[#cca550] text-black' : 'text-white/40 hover:text-white/80'}`}
          >
            M
          </button>
          <button 
            onClick={() => setUnitSystem('feet')}
            className={`px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider rounded-sm transition-all ${unitSystem === 'feet' ? 'bg-[#cca550] text-black' : 'text-white/40 hover:text-white/80'}`}
          >
            FT
          </button>
          <button 
            onClick={() => setUnitSystem('inches')}
            className={`px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider rounded-sm transition-all ${unitSystem === 'inches' ? 'bg-[#cca550] text-black' : 'text-white/40 hover:text-white/80'}`}
          >
            IN
          </button>
        </div>
      </div>
      <div className="flex gap-2 items-center">
        <label className="text-[10px] text-white/40 font-bold uppercase">L</label>
        <input 
          type="number" 
          value={length} 
          onChange={e => setLength(e.target.value)}
          onBlur={handleUpdate}
          onKeyDown={e => e.key === 'Enter' && handleUpdate()}
          className="w-14 bg-black/50 border border-white/10 rounded px-1 py-1 text-white text-xs outline-none focus:border-[#cca550] transition-colors"
          step="0.01"
          min="0.1"
        />
        <label className="text-[10px] text-white/40 font-bold uppercase">W</label>
        <input 
          type="number" 
          value={width} 
          onChange={e => setWidth(e.target.value)}
          onBlur={handleUpdate}
          onKeyDown={e => e.key === 'Enter' && handleUpdate()}
          className="w-14 bg-black/50 border border-white/10 rounded px-1 py-1 text-white text-xs outline-none focus:border-[#cca550] transition-colors"
          step="0.01"
          min="0.1"
        />
        <label className="text-[10px] text-white/40 font-bold uppercase">H</label>
        <input 
          type="number" 
          value={height} 
          onChange={e => setHeight(e.target.value)}
          onBlur={handleUpdate}
          onKeyDown={e => e.key === 'Enter' && handleUpdate()}
          className="w-14 bg-black/50 border border-white/10 rounded px-1 py-1 text-white text-xs outline-none focus:border-[#cca550] transition-colors"
          step="0.01"
          min="0.1"
        />
      </div>
    </div>
  );
}
