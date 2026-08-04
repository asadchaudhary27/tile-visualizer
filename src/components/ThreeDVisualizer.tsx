import { useRef, useState, useEffect } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, Environment, Lightformer } from '@react-three/drei';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import Room3D from './Room3D';
import Lighting3D from './Lighting3D';
import TilePickerPanel from './TilePickerPanel';
import CustomRoomInput from './CustomRoomInput';
import AssetLibraryPanel from './AssetLibraryPanel';
import ObjectControlsUI from './ObjectControlsUI';
import RoomSetupModal from './RoomSetupModal';
import type { Room } from '../lib/types';
import { X, Bed, Bath, ChefHat, RotateCw, Box, Layers, Camera, ChevronUp, ChevronDown, ZoomIn, ZoomOut, Lightbulb, LightbulbOff } from 'lucide-react';
import { useDesignStore } from '../store/useDesignStore';
import { TILES } from '../data/tiles';
import { TILE_SIZES } from '../data/tileSizes';
import { ROOMS } from '../data/rooms';
import { ErrorBoundary } from './ErrorBoundary';

interface Props {
  onClose: () => void;
}

const room3D: Room = {
  id: '3d-room',
  name: '3D Studio Room',
  thumbnailUrl: '',
  imageUrl: '',
  surfaces: [
    { id: 'floor', roomId: '3d-room', label: 'Floor', type: 'floor', polygon: [], areaSqFt: 100 },
    { id: 'left-wall', roomId: '3d-room', label: 'Left Wall', type: 'wall', polygon: [], areaSqFt: 100 },
    { id: 'back-wall', roomId: '3d-room', label: 'Back Wall', type: 'wall', polygon: [], areaSqFt: 100 },
    { id: 'right-wall', roomId: '3d-room', label: 'Right Wall', type: 'wall', polygon: [], areaSqFt: 100 },
    { id: 'front-wall', roomId: '3d-room', label: 'Front Wall', type: 'wall', polygon: [], areaSqFt: 100 },
  ]
};

function CameraController({ mode, controlsRef }: { mode: 'dollhouse' | 'free', controlsRef: React.RefObject<OrbitControlsImpl> }) {
  const { camera } = useThree();
  const roomDimensions = useDesignStore(s => s.roomDimensions);
  
  useEffect(() => {
    if (!controlsRef.current) return;
    
    const maxDim = Math.max(roomDimensions.width, roomDimensions.length, 5); // Minimum 5
    const midHeight = roomDimensions.height / 2; // Middle of floor and roof
    
    if (mode === 'free') {
      // Move camera to center of room, eye level
      camera.position.set(0, 1.5, 0.1);
      controlsRef.current.target.set(0, 1.5, 0);
      controlsRef.current.maxDistance = maxDim * 3;
    } else {
      // Dollhouse - adjust height and distance based on room size
      // Set camera angle far away but pointed exactly at the middle of the room
      camera.position.set(0, maxDim * 0.9, maxDim * 1.6);
      controlsRef.current.target.set(0, midHeight, 0);
      controlsRef.current.maxDistance = maxDim * 4;
    }
    controlsRef.current.update();
  }, [mode, camera, controlsRef, roomDimensions]);
  
  return null;
}

export default function ThreeDVisualizer({ onClose }: Props) {
  const [designStyle, setDesignStyle] = useState<1 | 2 | 3 | 4>(1);
  const [selectedSurfaceId, setSelectedSurfaceId] = useState<string | null>(null);
  const [autoRotate, setAutoRotate] = useState(false);
  const [cameraMode, setCameraMode] = useState<'dollhouse' | 'free'>('dollhouse');
  const [lightsOn, setLightsOn] = useState(true);
  const controlsRef = useRef<OrbitControlsImpl>(null);
  
  const handleCameraPan = (dy: number) => {
    if (controlsRef.current) {
      controlsRef.current.target.y += dy;
      controlsRef.current.object.position.y += dy;
      controlsRef.current.update();
    }
  };

  const handleCameraZoom = (factor: number) => {
    if (controlsRef.current) {
      const camera = controlsRef.current.object;
      const target = controlsRef.current.target;
      
      // Calculate direction vector from target to camera
      const dirX = camera.position.x - target.x;
      const dirY = camera.position.y - target.y;
      const dirZ = camera.position.z - target.z;
      
      // Apply zoom factor
      camera.position.set(
        target.x + dirX * factor,
        target.y + dirY * factor,
        target.z + dirZ * factor
      );
      
      controlsRef.current.update();
    }
  };

  // Sidebar Pipeline State
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);

  const configs = useDesignStore(s => s.configs);
  const isFurnitureEditMode = useDesignStore(s => s.isFurnitureEditMode);
  const activeObjectId = useDesignStore(s => s.activeObjectId);
  const toggleEditMode = useDesignStore(s => s.toggleEditMode);
  const generateAutoLayout = useDesignStore(s => s.generateAutoLayout);
  const placedObjects = useDesignStore(s => s.placedObjects);
  const roomDimensions = useDesignStore(s => s.roomDimensions);
  const roomType = useDesignStore(s => s.roomType);
  const setRoomType = useDesignStore(s => s.setRoomType);
  const isRoomConfigured = useDesignStore(s => s.isRoomConfigured);
  const loadPresetRoom = useDesignStore(s => s.loadPresetRoom);
  const toastMessage = useDesignStore(s => s.toastMessage);
  const setToast = useDesignStore(s => s.setToast);

  // Sync furniture edit mode with step 3
  useEffect(() => {
    if (currentStep === 3 && !isFurnitureEditMode) {
      toggleEditMode();
    } else if (currentStep !== 3 && isFurnitureEditMode) {
      toggleEditMode();
    }
  }, [currentStep]);

  useEffect(() => {
    // We start empty, so we don't need to auto-layout on mount unless it's a preset
  }, []);

  // Clear toast after 3 seconds
  useEffect(() => {
    if (toastMessage) {
      const t = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(t);
    }
  }, [toastMessage, setToast]);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-[#020617] font-sans">
      
      {!isRoomConfigured && <RoomSetupModal />}
      
      {/* 🌟🌟 3D Viewport (Full Screen) 🌟🌟 */}
      <div className="absolute inset-0 z-0">
        
        {/* Toast Notification */}
        {toastMessage && (
          <div className="absolute top-6 left-1/2 -translate-x-1/2 z-50 bg-teal-500/90 backdrop-blur-md border border-teal-400 text-white px-6 py-3 rounded-2xl shadow-[0_10px_40px_rgba(20,184,166,0.3)] text-sm font-bold animate-in fade-in slide-in-from-top-8">
            {toastMessage}
          </div>
        )}
        {/* Floating Controls (Left) */}
        <div className="absolute top-6 left-6 z-10 flex flex-col gap-4">
          
          <button onClick={onClose} className="w-12 h-12 bg-red-500/80 backdrop-blur-xl hover:bg-red-500 border border-red-400/50 text-white rounded-2xl flex items-center justify-center shadow-2xl transition-all duration-300 hover:scale-105">
            <X size={24} />
          </button>

          {/* Camera Toggle Button */}
          <button 
            onClick={() => setCameraMode(prev => prev === 'dollhouse' ? 'free' : 'dollhouse')} 
            className="w-12 h-12 bg-[#0F172A]/80 backdrop-blur-xl border border-white/10 hover:bg-white/10 hover:border-white/20 text-white rounded-2xl flex items-center justify-center shadow-2xl transition-all duration-300 hover:scale-105"
            title={cameraMode === 'free' ? 'Switch to Dollhouse View' : 'Switch to Free Camera'}
          >
            <Camera size={20} className={cameraMode === 'free' ? 'text-teal-400 drop-shadow-[0_0_8px_rgba(45,212,191,0.8)]' : 'text-white/70'} />
          </button>

          {/* Light Toggle Button */}
          <button 
            onClick={() => setLightsOn(!lightsOn)} 
            className="w-12 h-12 bg-[#0F172A]/80 backdrop-blur-xl border border-white/10 hover:bg-white/10 hover:border-white/20 text-white rounded-2xl flex items-center justify-center shadow-2xl transition-all duration-300 hover:scale-105"
            title={lightsOn ? 'Turn Lights Off' : 'Turn Lights On'}
          >
            {lightsOn ? <Lightbulb size={20} className="text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.8)]" /> : <LightbulbOff size={20} className="text-white/40" />}
          </button>

          {/* Camera Vertical Pan Controls */}
          <div className="flex flex-col gap-2 bg-[#0F172A]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-1 shadow-2xl">
            <button 
              onClick={() => handleCameraPan(0.5)}
              className="w-10 h-10 hover:bg-white/10 text-white/70 hover:text-white rounded-xl flex items-center justify-center transition-all duration-200"
              title="Move Camera Up"
            >
              <ChevronUp size={20} />
            </button>
            <div className="w-6 h-[1px] bg-white/10 mx-auto" />
            <button 
              onClick={() => handleCameraPan(-0.5)}
              className="w-10 h-10 hover:bg-white/10 text-white/70 hover:text-white rounded-xl flex items-center justify-center transition-all duration-200"
              title="Move Camera Down"
            >
              <ChevronDown size={20} />
            </button>
          </div>

          {/* Camera Zoom Controls */}
          <div className="flex flex-col gap-2 bg-[#0F172A]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-1 shadow-2xl">
            <button 
              onClick={() => handleCameraZoom(0.8)} // Zoom IN (closer)
              className="w-10 h-10 hover:bg-white/10 text-white/70 hover:text-white rounded-xl flex items-center justify-center transition-all duration-200"
              title="Zoom In"
            >
              <ZoomIn size={18} />
            </button>
            <div className="w-6 h-[1px] bg-white/10 mx-auto" />
            <button 
              onClick={() => handleCameraZoom(1.2)} // Zoom OUT (further)
              className="w-10 h-10 hover:bg-white/10 text-white/70 hover:text-white rounded-xl flex items-center justify-center transition-all duration-200"
              title="Zoom Out"
            >
              <ZoomOut size={18} />
            </button>
          </div>
        </div>

        {/* 3D Canvas */}
        <ErrorBoundary fallbackMessage="The 3D engine crashed. This could be due to a corrupted 3D model asset or exhausted GPU memory.">
          <Canvas shadows camera={{ position: [-8, 8, 15], fov: 75 }}>
          <CameraController mode={cameraMode} controlsRef={controlsRef} />
          <color attach="background" args={['#0e0e0e']} />
          
          {/* Base ambient lighting */}
          <ambientLight intensity={lightsOn ? 0.7 : 0.1} />
          {/* Realistic hemisphere light to spread evenly from ceiling to floor */}
          {lightsOn && <hemisphereLight args={['#ffffff', '#777777', 0.8]} />}
          
          {/* Main directional light for shadows */}
          {lightsOn && <directionalLight 
            castShadow 
            position={[5, 12, 5]} 
            intensity={0.8} 
            shadow-mapSize={[2048, 2048]} 
            shadow-camera-left={-10}
            shadow-camera-right={10}
            shadow-camera-top={10}
            shadow-camera-bottom={-10}
            shadow-bias={-0.0005}
          />}
          
          {/* Soft central light to eliminate dark corners */}
          {lightsOn && <pointLight position={[0, roomDimensions.height - 0.2, 0]} intensity={2.5} distance={50} decay={0} color="#ffffff" />}
          
          {/* Physical Ceiling Light Mesh */}
          <group position={[0, roomDimensions.height - 0.05, 0]}>
            {/* Base/Fixture */}
            <mesh>
              <cylinderGeometry args={[0.8, 0.8, 0.1, 32]} />
              <meshStandardMaterial color="#333333" metalness={0.8} roughness={0.2} />
            </mesh>
            {/* Glowing Bulb/Panel */}
            <mesh position={[0, -0.05, 0]}>
              <cylinderGeometry args={[0.75, 0.75, 0.05, 32]} />
              <meshStandardMaterial 
                color={lightsOn ? "#ffffff" : "#222222"} 
                emissive={lightsOn ? "#ffffff" : "#000000"} 
                emissiveIntensity={lightsOn ? 2 : 0} 
                toneMapped={false} 
              />
            </mesh>
          </group>
          
          {/* Custom Environment using Lightformer provides clean, generic glossy reflections 
              without any weird shapes, windows, or umbrella artifacts from HDRI presets. */}
          {lightsOn && (
            <Environment resolution={256} environmentIntensity={0.5}>
              <Lightformer 
                form="rect" 
                intensity={1} 
                color="white" 
                scale={[20, 20]} 
                position={[0, 10, 0]} 
                rotation={[-Math.PI / 2, 0, 0]} 
              />
            </Environment>
          )}
          
          <group position={[0, 0, 0]}>
            {roomDimensions.length > 0 && roomDimensions.width > 0 && (
              <Room3D 
                roomType={roomType} 
                designStyle={designStyle}
                selectedSurface={selectedSurfaceId} 
                onSelectSurface={(id) => {
                  setSelectedSurfaceId(id);
                  setCurrentStep(2);
                }}
              />
            )}
          </group>

          <OrbitControls 
            ref={controlsRef}
            target={[0, 0, 0]} 
            maxPolarAngle={Math.PI / 2 - 0.05} 
            minDistance={0.5} 
            maxDistance={30} 
            enableDamping
            dampingFactor={0.05}
            autoRotate={autoRotate}
            autoRotateSpeed={0.5}
            rotateSpeed={2.0}
            makeDefault
          />
        </Canvas>
        </ErrorBoundary>
      </div>

      {/* 🌟🌟 Floating Glass Sidebar 🌟🌟 */}
      <div className="absolute top-6 right-6 bottom-6 w-[420px] bg-[#0F172A]/70 backdrop-blur-2xl border border-white/10 rounded-3xl flex flex-col z-20 shadow-[0_12px_48px_rgba(0,0,0,0.6)] overflow-hidden">
        
        {/* Header & Steps */}
        <div className="p-5 border-b border-white/5 bg-white/5">
          <h2 className="text-white font-extrabold text-xl mb-5 tracking-tight flex items-center gap-2">
            <Layers className="text-teal-400" size={20} /> Design Studio
          </h2>
          <div className="flex bg-[#020617]/60 p-1.5 rounded-xl border border-white/5">
            <button 
              onClick={() => { setCurrentStep(1); setSelectedSurfaceId(null); }}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-[11px] uppercase tracking-wider font-bold transition-all duration-300 ${currentStep === 1 ? 'bg-teal-500 text-white shadow-[0_0_15px_rgba(20,184,166,0.3)]' : 'text-white/40 hover:text-white/80 hover:bg-white/5'}`}
            >
              <LayoutDashboardIcon /> Setup
            </button>
            <button 
              onClick={() => setCurrentStep(2)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-[11px] uppercase tracking-wider font-bold transition-all duration-300 ${currentStep === 2 ? 'bg-teal-500 text-white shadow-[0_0_15px_rgba(20,184,166,0.3)]' : 'text-white/40 hover:text-white/80 hover:bg-white/5'}`}
            >
              <Layers size={14} /> Surfaces
            </button>
            <button 
              onClick={() => { setCurrentStep(3); setSelectedSurfaceId(null); }}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-[11px] uppercase tracking-wider font-bold transition-all duration-300 ${currentStep === 3 ? 'bg-teal-500 text-white shadow-[0_0_15px_rgba(20,184,166,0.3)]' : 'text-white/40 hover:text-white/80 hover:bg-white/5'}`}
            >
              <Box size={14} /> Furnish
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden">
          
          {/* STEP 1: ROOM SETUP */}
          {currentStep === 1 && (
            <div className="p-6 space-y-8">
              
              {/* Room Type */}
              <div className="space-y-3">
                <label className="text-[10px] text-white/40 font-bold uppercase tracking-widest">Preset Room Type</label>
                <div className="grid grid-cols-2 gap-3">
                  <button onClick={() => { setRoomType('empty'); generateAutoLayout('empty'); }} className={`flex flex-col items-center justify-center gap-2 p-4 rounded-2xl border transition-all duration-300 ${roomType === 'empty' ? 'bg-teal-500/20 border-teal-500/50 text-teal-300 shadow-[0_0_15px_rgba(20,184,166,0.15)]' : 'bg-[#020617]/50 border-white/5 text-white/50 hover:bg-white/5 hover:border-white/10 hover:text-white/80'}`}>
                    <Box size={24} /> <span className="text-[11px] font-bold tracking-wide">Empty</span>
                  </button>
                  <button onClick={() => { setRoomType('bedroom'); generateAutoLayout('bedroom'); }} className={`flex flex-col items-center justify-center gap-2 p-4 rounded-2xl border transition-all duration-300 ${roomType === 'bedroom' ? 'bg-teal-500/20 border-teal-500/50 text-teal-300 shadow-[0_0_15px_rgba(20,184,166,0.15)]' : 'bg-[#020617]/50 border-white/5 text-white/50 hover:bg-white/5 hover:border-white/10 hover:text-white/80'}`}>
                    <Bed size={24} /> <span className="text-[11px] font-bold tracking-wide">Bedroom</span>
                  </button>
                  <button onClick={() => { setRoomType('kitchen'); generateAutoLayout('kitchen'); }} className={`flex flex-col items-center justify-center gap-2 p-4 rounded-2xl border transition-all duration-300 ${roomType === 'kitchen' ? 'bg-teal-500/20 border-teal-500/50 text-teal-300 shadow-[0_0_15px_rgba(20,184,166,0.15)]' : 'bg-[#020617]/50 border-white/5 text-white/50 hover:bg-white/5 hover:border-white/10 hover:text-white/80'}`}>
                    <ChefHat size={24} /> <span className="text-[11px] font-bold tracking-wide">Kitchen</span>
                  </button>
                  <button onClick={() => { setRoomType('bathroom'); generateAutoLayout('bathroom'); }} className={`flex flex-col items-center justify-center gap-2 p-4 rounded-2xl border transition-all duration-300 ${roomType === 'bathroom' ? 'bg-teal-500/20 border-teal-500/50 text-teal-300 shadow-[0_0_15px_rgba(20,184,166,0.15)]' : 'bg-[#020617]/50 border-white/5 text-white/50 hover:bg-white/5 hover:border-white/10 hover:text-white/80'}`}>
                    <Bath size={24} /> <span className="text-[11px] font-bold tracking-wide">Bathroom</span>
                  </button>
                </div>
              </div>

              {/* Saved Presets */}
              <div className="space-y-3">
                <label className="text-[10px] text-white/40 font-bold uppercase tracking-widest">Saved Presets</label>
                <div className="grid grid-cols-2 gap-3">
                  {ROOMS.map(preset => {
                     // Determine a reasonable roomType and dimension based on the preset name/id
                     let pType: 'bedroom' | 'kitchen' | 'bathroom' | 'empty' = 'bedroom';
                     let pDim = { length: 6, width: 6, height: 2.8 }; // generic 6x6 room
                     if (preset.id.includes('kitchen')) { pType = 'kitchen'; pDim = { length: 8, width: 6, height: 2.8 }; }
                     else if (preset.id.includes('bath')) { pType = 'bathroom'; pDim = { length: 4, width: 4, height: 2.6 }; }
                     else if (preset.id === 'modern-room') { pType = 'bedroom'; pDim = { length: 7, width: 7, height: 3.0 }; } // mapping to living room roughly
                     
                     return (
                        <button 
                           key={preset.id}
                           onClick={() => loadPresetRoom(pType, pDim, preset.id)} 
                           className="flex flex-col items-center justify-center gap-2 p-3 rounded-2xl border bg-[#020617]/50 border-white/5 text-white/70 hover:bg-white/5 hover:border-teal-500/50 hover:text-teal-300 transition-all duration-300"
                        >
                           <span className="text-[11px] font-bold tracking-wide text-center">{preset.name}</span>
                        </button>
                     );
                  })}
                </div>
              </div>

              {/* Dimensions */}
              <div className="space-y-3">
                <label className="text-[10px] text-white/40 font-bold uppercase tracking-widest">Room Dimensions</label>
                <div className="bg-[#020617]/50 border border-white/5 p-4 rounded-2xl">
                  <CustomRoomInput />
                </div>
              </div>

              {/* Extras */}
              <div className="space-y-3">
                <label className="text-[10px] text-white/40 font-bold uppercase tracking-widest">Display Settings</label>
                <button 
                  onClick={() => setAutoRotate(!autoRotate)} 
                  className={`w-full flex items-center justify-center gap-3 px-4 py-4 rounded-2xl border transition-all duration-300 ${autoRotate ? 'bg-teal-500/20 border-teal-500/50 text-teal-300 shadow-[0_0_15px_rgba(20,184,166,0.15)]' : 'bg-[#020617]/50 border-white/5 text-white/50 hover:bg-white/5 hover:border-white/10 hover:text-white/80'}`}
                >
                  <RotateCw size={18} className={autoRotate ? 'animate-spin' : ''} style={{ animationDuration: '4s' }} /> 
                  <span className="text-[11px] font-bold tracking-wide">Auto-Rotate Camera</span>
                </button>
              </div>

            </div>
          )}

          {/* STEP 2: SURFACE DESIGN */}
          {currentStep === 2 && (
            <div className="h-full flex flex-col">
              {selectedSurfaceId ? (
                <div className="flex-1 h-full overflow-y-auto">
                  <TilePickerPanel
                    room={room3D}
                    surface={room3D.surfaces.find(s => s.id === selectedSurfaceId)!}
                    onClose={() => setSelectedSurfaceId(null)}
                    pixelsPerInch={8}
                  />
                </div>
              ) : (
                <div className="p-6 space-y-3">
                  <div className="mb-6 bg-white/5 p-4 rounded-xl border border-white/5">
                    <p className="text-white/70 text-sm leading-relaxed">Select a surface below or click directly in the 3D room to apply tiles.</p>
                  </div>
                  {room3D.surfaces.map(s => {
                    const cfg = configs[s.id];
                    const tileLabel = cfg?.mode === 'single' ? TILES.find(t => t.id === cfg.tileId)?.name : cfg?.mode === 'layout' ? 'Custom Layout' : null;
                    const sizeLabel = cfg?.tileSizeId ? TILE_SIZES.find(t => t.id === cfg.tileSizeId)?.label : null;
                    return (
                      <button key={s.id} onClick={() => setSelectedSurfaceId(s.id)}
                        className={`w-full flex items-center gap-4 px-4 py-4 rounded-2xl text-left transition-all duration-300 border ${
                          cfg ? 'bg-teal-500/10 border-teal-500/50 hover:bg-teal-500/20 shadow-[0_4px_20px_rgba(20,184,166,0.1)]'
                              : 'bg-[#020617]/50 border-white/5 hover:bg-white/5 hover:border-white/10'
                        }`}
                      >
                        <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 transition-all ${cfg ? 'bg-teal-400 shadow-[0_0_12px_rgba(45,212,191,1)]' : 'bg-white/20'}`}/>
                        <div className="flex-1 min-w-0">
                          <p className={`text-[13px] font-bold tracking-wide truncate ${cfg ? 'text-teal-300' : 'text-white/80'}`}>{s.label}</p>
                          {tileLabel && <p className="text-[10px] text-white/50 truncate mt-1 uppercase tracking-widest font-medium">{tileLabel}{sizeLabel ? ` A ${sizeLabel}` : ''}</p>}
                        </div>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-white/30 flex-shrink-0 transition-transform group-hover:translate-x-1">
                          <path d="M9 18l6-6-6-6"/>
                        </svg>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* STEP 3: FURNISHING & STYLING */}
          {currentStep === 3 && (
            <div className="h-full flex flex-col">
               {isFurnitureEditMode && activeObjectId ? (
                 <ObjectControlsUI />
               ) : (
                 <AssetLibraryPanel roomType={roomType} />
               )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

function LayoutDashboardIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
      <line x1="3" y1="9" x2="21" y2="9"></line>
      <line x1="9" y1="21" x2="9" y2="9"></line>
    </svg>
  );
}
