import React from 'react';
import RoomSelectorScreen from './components/RoomSelectorScreen';
import RoomEditorScreen from './components/RoomEditorScreen';
import ThreeDVisualizer from './components/ThreeDVisualizer';
import TileCalculatorScreen from './components/TileCalculatorScreen';
import ConsultationScreen from './components/ConsultationScreen';
import { Logo } from './components/Logo';
import type { Room } from './lib/types';
import { ChevronLeft } from 'lucide-react';
import { useState } from 'react';

function App() {
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [is3DMode, setIs3DMode] = useState(false);
  const [isCalculatorMode, setIsCalculatorMode] = useState(false);
  const [isConsultationMode, setIsConsultationMode] = useState(false);

  const isHome = !selectedRoom && !is3DMode && !isCalculatorMode && !isConsultationMode;

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-[#050505]">
      {/* Top nav - 2026 Ultra Luxury Floating Pill */}
      <header className={`fixed z-50 transition-all duration-700 ${isHome ? 'top-4 md:top-8 left-4 right-4 md:left-1/2 md:right-auto md:-translate-x-1/2 md:w-fit gap-4 md:gap-12 rounded-2xl md:rounded-full bg-[#0a0a0a]/80 md:bg-[#0a0a0a]/40 backdrop-blur-[24px] border border-white/10 shadow-[0_30px_60px_rgba(0,0,0,0.5)] p-4 md:p-3 md:pl-10 flex flex-col md:flex-row items-center pointer-events-auto' : 'top-0 left-0 right-0 px-4 md:px-8 py-4 md:py-6 bg-transparent flex items-center justify-between pointer-events-none z-50'}`}>
        
        {(!isHome) && (
          <button
            onClick={() => { setSelectedRoom(null); setIs3DMode(false); setIsCalculatorMode(false); setIsConsultationMode(false); }}
            className="flex items-center gap-2 text-white/70 hover:text-white text-[10px] font-medium uppercase tracking-widest transition-colors pointer-events-auto bg-black/40 px-4 py-2 rounded-full backdrop-blur-md border border-white/10 hover:bg-black/60"
          >
            <ChevronLeft size={14} />
            Back
          </button>
        )}

        {isHome ? (
          <>
            {/* Top Row on Mobile / Left on Desktop */}
            <div className="flex w-full md:w-auto items-center justify-between md:justify-start">
              {/* Logo */}
              <div className="flex items-center flex-shrink-0 cursor-pointer">
                <Logo className="h-6 md:h-10 w-auto hover:opacity-80 transition-opacity" />
              </div>
            </div>

            <div className="hidden md:block w-px h-4 bg-white/20 mx-2"></div>

            {/* Bottom Row on Mobile / Right on Desktop */}
            <div className="flex w-full md:w-auto items-center justify-between md:justify-start flex-shrink-0 gap-2 md:gap-4">
              <button 
                onClick={() => {
                  setIsConsultationMode(!isConsultationMode);
                  setIsCalculatorMode(false);
                  setIs3DMode(false);
                  setSelectedRoom(null);
                }}
                className={`flex-1 md:flex-none px-3 md:px-6 py-2.5 md:py-3.5 rounded-full bg-transparent border border-[#cca550] text-[9px] md:text-xs font-bold tracking-widest uppercase transition-all whitespace-nowrap text-center ${isConsultationMode ? 'bg-[#cca550] text-black shadow-[0_0_20px_rgba(204,165,80,0.4)]' : 'text-[#cca550] hover:bg-[#cca550] hover:text-black hover:shadow-[0_0_20px_rgba(204,165,80,0.4)]'}`}
              >
                Get Quote
              </button>
              <button 
                onClick={() => setIsCalculatorMode(true)}
                className="flex-1 md:flex-none px-3 md:px-6 py-2.5 md:py-3.5 rounded-full bg-[#106135] hover:bg-[#15803d] text-white text-[9px] md:text-xs font-bold tracking-widest uppercase shadow-[0_0_20px_rgba(16,97,53,0.4)] transition-all md:hover:scale-105 md:hover:shadow-[0_0_30px_rgba(16,97,53,0.6)] whitespace-nowrap text-center"
              >
                Calculator
              </button>
              <button 
                onClick={() => setIs3DMode(true)}
                className="flex-1 md:flex-none px-3 md:px-6 py-2.5 md:py-3.5 rounded-full bg-[#106135] hover:bg-[#15803d] text-white text-[9px] md:text-xs font-bold tracking-widest uppercase shadow-[0_0_20px_rgba(16,97,53,0.4)] transition-all md:hover:scale-105 md:hover:shadow-[0_0_30px_rgba(16,97,53,0.6)] whitespace-nowrap text-center"
              >
                Visualizer
              </button>
            </div>
          </>
        ) : (
          <h1 className="text-white font-bold text-[9px] md:text-[10px] tracking-[0.2em] pointer-events-auto uppercase bg-black/40 px-3 md:px-4 py-2 rounded-full backdrop-blur-md border border-white/10 text-right truncate max-w-[150px] md:max-w-none">
            {isConsultationMode ? 'Consultation' : isCalculatorMode ? 'Tile Calculator' : is3DMode ? '3D Studio' : selectedRoom ? selectedRoom.name : ''}
          </h1>
        )}
      </header>

      <main className="flex-1 flex overflow-hidden">
        {isConsultationMode ? (
          <ConsultationScreen />
        ) : isCalculatorMode ? (
          <TileCalculatorScreen />
        ) : is3DMode ? (
          <ThreeDVisualizer onClose={() => setIs3DMode(false)} />
        ) : selectedRoom ? (
          <RoomEditorScreen room={selectedRoom} />
        ) : (
          <RoomSelectorScreen 
            onSelect={setSelectedRoom} 
            onOpen3D={() => setIs3DMode(true)}
            onOpenCalculator={() => setIsCalculatorMode(true)}
          />
        )}
      </main>
    </div>
  );
}

export default App;
