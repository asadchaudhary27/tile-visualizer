import { useState, useRef, useEffect, useCallback } from 'react';
import type { Room } from '../lib/types';
import { useDesignStore } from '../store/useDesignStore';
import { TILES } from '../data/tiles';
import { TILE_SIZES, DEFAULT_TILE_SIZE_ID } from '../data/tileSizes';
import TilePickerPanel from './TilePickerPanel';
import LuxuryFurniture from './LuxuryFurniture';
import BathroomFurniture from './BathroomFurniture';
import KitchenFurniture from './KitchenFurniture';
import { RotateCcw, Download } from 'lucide-react';

interface Props { room: Room; }

interface PSurface {
  id: string; label: string; type: 'wall' | 'floor';
  pts: [number,number][];
  centroid: { x: number; y: number };
  clipId: string;
  ptsStr: string;
  path?: string;
}

function toPixels(polygon: [number,number][], w: number, h: number, offsetX: number, offsetY: number): [number,number][] {
  return polygon.map(([px,py]) => [(px/100*w) + offsetX, (py/100*h) + offsetY]);
}
function parsePath(pathStr: string, w: number, h: number, offsetX: number, offsetY: number): string {
  // Converts "M 30 0 L 60 0..." from percentages to screen pixels
  return pathStr.replace(/([0-9.]+)\s+([0-9.]+)/g, (_, px, py) => {
    return `${((parseFloat(px) / 100) * w) + offsetX} ${((parseFloat(py) / 100) * h) + offsetY}`;
  });
}
function centroid(pts: [number,number][]): { x: number; y: number } {
  return { x: pts.reduce((s,p)=>s+p[0],0)/pts.length, y: pts.reduce((s,p)=>s+p[1],0)/pts.length };
}
function patId(id: string) { return `pat-${id.replace(/[^a-z0-9]/g,'-')}`; }

// Surface directional lighting (simulates single overhead+right light source)
function surfaceLightId(label: string): string {
  const l = label.toLowerCase();
  if (l.includes('ceil')) return 'grad-ceiling';
  if (l.includes('back')) return 'grad-backwall';
  if (l.includes('left')) return 'grad-leftwall';
  if (l.includes('right')) return 'grad-rightwall';
  return 'grad-floor';
}
function surfaceStroke(label: string): string {
  const l = label.toLowerCase();
  if (l.includes('ceil')) return '#aaa9a6';
  if (l.includes('right')) return '#c8c4be';
  return '#9a9590';
}

export default function RoomEditorScreen({ room }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [sz, setSz] = useState({ w: 0, h: 0 });
  const [sel, setSel] = useState<string|null>(null);
  const [hov, setHov] = useState<string|null>(null);

  const configs = useDesignStore(s => s.configs);
  const clearConfig = useDesignStore(s => s.clearConfig);

  const measure = useCallback(() => {
    if (ref.current) setSz({ w: ref.current.clientWidth, h: ref.current.clientHeight });
  }, []);
  useEffect(() => {
    measure();
    const ro = new ResizeObserver(measure);
    if (ref.current) ro.observe(ref.current);
    return () => ro.disconnect();
  }, [measure]);

  const W = sz.w, H = sz.h;
  const PPI = W > 0 ? (W * 0.96) / 180 : 4; // pixels per inch (room = 15ft = 180in)

  const isPhoto = Boolean(room.imageUrl);

  // Compute actual image bounds to handle object-fit: cover / xMidYMid slice cropping
  let imgW = W, imgH = H, offsetX = 0, offsetY = 0;
  if (isPhoto && W > 0 && H > 0) {
    const imgRatio = 16 / 9; // Assuming standard 16:9 photos
    const containerRatio = W / H;
    if (containerRatio > imgRatio) {
      // Container is wider than image -> image is constrained by width, crops top/bottom
      imgW = W;
      imgH = W / imgRatio;
      offsetY = (H - imgH) / 2;
    } else {
      // Container is taller than image -> image is constrained by height, crops sides
      imgH = H;
      imgW = H * imgRatio;
      offsetX = (W - imgW) / 2;
    }
  }

  const surfaces: (PSurface & { maskUrl?: string })[] = room.surfaces.map(s => {
    const pts = toPixels(s.polygon, imgW, imgH, offsetX, offsetY);
    return {
      id: s.id, label: s.label, type: s.type,
      pts, centroid: pts.length > 0 ? centroid(pts) : { x: W/2, y: H/2 },
      clipId: `clip-${s.id.replace(/[^a-z0-9]/g,'-')}`,
      ptsStr: pts.map(p => p.join(',')).join(' '),
      path: s.path ? parsePath(s.path, imgW, imgH, offsetX, offsetY) : undefined,
      maskUrl: (s as any).maskUrl,
      perspective: (s as any).perspective,
      rotateX: (s as any).rotateX,
      rotateY: (s as any).rotateY,
      rotateZ: (s as any).rotateZ,
      scale: (s as any).scale,
      panX: (s as any).panX,
      panY: (s as any).panY
    };
  });

  function getPW(id: string) {
    const cfg = configs[id];
    const sz2 = TILE_SIZES.find(s => s.id === (cfg?.tileSizeId ?? DEFAULT_TILE_SIZE_ID)) ?? TILE_SIZES[6];
    return { pw: sz2.widthIn * PPI, ph: sz2.heightIn * PPI };
  }

  return (
    <div className="flex-1 flex h-full overflow-hidden bg-[#0e0e0e]">

      {/* Canvas */}
      <div className="flex-1 relative overflow-hidden flex flex-col">

        {/* Thin top bar */}
        <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-5 py-2.5 bg-gradient-to-b from-black/60 to-transparent pointer-events-none">
          <div className="pointer-events-auto">
            <span className="text-white/80 text-xs font-medium tracking-wide">{room.name}</span>
            <span className="text-white/30 text-xs ml-3">
              {room.surfaces.filter(s=>configs[s.id]).length}/{room.surfaces.length} surfaces tiled
            </span>
          </div>
          <div className="pointer-events-auto flex items-center gap-4">
            <button
              onClick={() => {
                if (!ref.current) return;
                const svg = ref.current.querySelector('svg');
                if (!svg) return;
                
                // Extremely simple download method for native SVGs
                // 1. Serialize SVG to string
                const serializer = new XMLSerializer();
                let source = serializer.serializeToString(svg);
                if (!source.match(/^<svg[^>]+xmlns="http:\/\/www\.w3\.org\/2000\/svg"/)) {
                    source = source.replace(/^<svg/, '<svg xmlns="http://www.w3.org/2000/svg"');
                }
                
                // Since our image URLs are absolute local paths (e.g. /rooms/bedroom.png),
                // we need to resolve them to full URLs for the canvas to draw them.
                const origin = window.location.origin;
                source = source.replace(/href="(\/[^"]+)"/g, `href="${origin}$1"`);

                const url = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(source);
                
                // Draw to canvas to get a PNG (this avoids downloading an SVG file that users can't easily share)
                const img = new Image();
                img.crossOrigin = 'anonymous'; // required to not taint canvas
                img.onload = () => {
                  const canvas = document.createElement('canvas');
                  canvas.width = W;
                  canvas.height = H;
                  const ctx = canvas.getContext('2d');
                  if (ctx) {
                    // Draw background color since SVG background style isn't preserved
                    ctx.fillStyle = '#0a0a0a';
                    ctx.fillRect(0,0,W,H);
                    ctx.drawImage(img, 0, 0);
                    const a = document.createElement('a');
                    a.download = `${room.name.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase()}-render.png`;
                    a.href = canvas.toDataURL('image/png');
                    a.click();
                  }
                };
                img.src = url;
              }}
              className="flex items-center gap-1.5 text-[11px] text-teal-400 hover:text-teal-300 transition-colors"
            >
              <Download size={11}/> Save Image
            </button>
            <button
              onClick={() => room.surfaces.forEach(s => clearConfig(s.id))}
              className="flex items-center gap-1.5 text-[11px] text-white/35 hover:text-white/70 transition-colors"
            >
              <RotateCcw size={11}/> Reset
            </button>
          </div>
        </div>

        {/* SVG room */}
        <div ref={ref} className="flex-1 relative">
          {W > 0 && (
            <svg width={W} height={H} className="absolute inset-0 block" style={{ background: '#0a0a0a' }}>
              <defs>
                {/* ── Surface directional gradients ── */}
                {/* Floor: dark near viewer, lighter toward back */}
                <linearGradient id="grad-floor" x1={W*0.5} y1={H} x2={W*0.5} y2={H*0.62} gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#786450"/>
                  <stop offset="60%" stopColor="#a08870"/>
                  <stop offset="100%" stopColor="#c0a888"/>
                </linearGradient>
                {/* Back wall: warm bright, slightly lighter center */}
                <radialGradient id="grad-backwall" cx={W*0.5} cy={H*0.36} r={W*0.25} gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#eae7e2"/>
                  <stop offset="100%" stopColor="#d4d0cb"/>
                </radialGradient>
                {/* Left wall: darker shadow side */}
                <linearGradient id="grad-leftwall" x1={0} y1={H*0.5} x2={W*0.28} y2={H*0.5} gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#9e9a96"/>
                  <stop offset="100%" stopColor="#bab6b2"/>
                </linearGradient>
                {/* Right wall: bright lit side (implied window) */}
                <linearGradient id="grad-rightwall" x1={W*0.72} y1={H*0.5} x2={W} y2={H*0.5} gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#c8c4be"/>
                  <stop offset="60%" stopColor="#e0ddd8"/>
                  <stop offset="100%" stopColor="#f0ede8"/>
                </linearGradient>
                {/* Ceiling: radial warm white */}
                <radialGradient id="grad-ceiling" cx={W*0.5} cy={H*0.05} r={W*0.55} gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#f4f0ea"/>
                  <stop offset="100%" stopColor="#d8d5d0"/>
                </radialGradient>

                {/* Ambient occlusion gradients in room corners */}
                <radialGradient id="ao-bl" cx={0} cy={H} r={W*0.2} gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="rgba(0,0,0,0.4)"/>
                  <stop offset="100%" stopColor="rgba(0,0,0,0)"/>
                </radialGradient>
                <radialGradient id="ao-br" cx={W} cy={H} r={W*0.2} gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="rgba(0,0,0,0.3)"/>
                  <stop offset="100%" stopColor="rgba(0,0,0,0)"/>
                </radialGradient>
                <radialGradient id="ao-tl" cx={0} cy={0} r={W*0.18} gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="rgba(0,0,0,0.25)"/>
                  <stop offset="100%" stopColor="rgba(0,0,0,0)"/>
                </radialGradient>
                <radialGradient id="ao-tr" cx={W} cy={0} r={W*0.18} gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="rgba(0,0,0,0.2)"/>
                  <stop offset="100%" stopColor="rgba(0,0,0,0)"/>
                </radialGradient>

                {/* Clip paths & Masks */}
                {surfaces.map(s => {
                  const clipId = `clip-${s.id}`;
                  const maskId = `mask-${s.id}`;
                  
                  return (
                    <g key={`defs-${s.id}`}>
                      <clipPath id={clipId}>
                        {s.path ? (
                          <path d={s.path} clipRule="evenodd" />
                        ) : (
                          <polygon points={s.ptsStr} />
                        )}
                      </clipPath>
                      {s.maskUrl && (
                        <mask id={maskId}>
                          <image href={s.maskUrl} x={offsetX} y={offsetY} width={imgW} height={imgH} preserveAspectRatio="none" />
                        </mask>
                      )}
                    </g>
                  );
                })}

                {/* Tile patterns */}
                {surfaces.map(s => {
                  const cfg = configs[s.id];
                  if (!cfg) return null;
                  const pid = patId(s.id);
                  const { pw, ph } = getPW(s.id);
                  if (cfg.mode === 'single' && cfg.tileId) {
                    const tile = TILES.find(t => t.id === cfg.tileId);
                    if (!tile) return null;
                    return (
                      <pattern key={pid} id={pid} x={0} y={0} width={pw} height={ph} patternUnits="userSpaceOnUse">
                        <image href={tile.imageUrl} x={0} y={0} width={pw} height={ph} preserveAspectRatio="xMidYMid slice"/>
                        {/* Grout lines */}
                        <rect x={0} y={0} width={pw} height={ph} fill="none" stroke="rgba(235,230,220,0.7)" strokeWidth={pw > 80 ? 2.5 : 1.5}/>
                      </pattern>
                    );
                  }
                  if (cfg.mode === 'layout' && cfg.generatedPatternUrl) {
                    const grid = cfg.layout?.gridSize || 4;
                    return (
                      <pattern key={pid} id={pid} x={0} y={0} width={pw*grid} height={ph*grid} patternUnits="userSpaceOnUse">
                        <image href={cfg.generatedPatternUrl} x={0} y={0} width={pw*grid} height={ph*grid}/>
                      </pattern>
                    );
                  }
                  return null;
                })}
              </defs>

              {/* ── Layer 0: Background Photo (if photo-based) ── */}
              {isPhoto && (
                <image href={room.imageUrl} x={0} y={0} width={W} height={H} preserveAspectRatio="xMidYMid slice" />
              )}
            </svg>
          )}

          {/* ── CSS 3D Layers (For new Zero-Click AI Rooms) ── */}
          {W > 0 && surfaces.map(s => {
            const cfg = configs[s.id];
            if (!cfg || (s as any).perspective === undefined || !s.maskUrl) return null;
            
            let tileUrl = '';
            const { pw, ph } = getPW(s.id);
            if (cfg.mode === 'single' && cfg.tileId) {
               const tile = TILES.find(t => t.id === cfg.tileId);
               if (tile) tileUrl = tile.imageUrl;
            } else if (cfg.mode === 'layout' && cfg.generatedPatternUrl) {
               tileUrl = cfg.generatedPatternUrl;
            }
            if (!tileUrl) return null;

            return (
              <div key={`css3d-${s.id}`} 
                className="absolute"
                style={{
                  left: offsetX, top: offsetY, width: imgW, height: imgH,
                  WebkitMaskImage: `url(${s.maskUrl})`,
                  WebkitMaskSize: '100% 100%',
                  WebkitMaskRepeat: 'no-repeat',
                  pointerEvents: 'none',
                  zIndex: 10
                }}
              >
                <div className="absolute inset-0" style={{ perspective: `${(s as any).perspective}px` }}>
                  <div className="absolute" style={{
                    // Make the tile plane much larger so it doesn't clip when panning/rotating
                    left: '-50%', top: '-50%', width: '200%', height: '200%',
                    transform: `rotateX(${(s as any).rotateX || 0}deg) rotateY(${(s as any).rotateY || 0}deg) rotateZ(${(s as any).rotateZ || 0}deg) scale(${(s as any).scale || 1}) translateX(${(s as any).panX || 0}%) translateY(${(s as any).panY || 0}%)`,
                    transformOrigin: 'center center',
                    backgroundImage: `url(${tileUrl})`,
                    backgroundSize: `${pw}px ${ph}px`,
                    backgroundRepeat: 'repeat'
                  }} />
                </div>
                {/* Lighting overlay */}
                <div className="absolute inset-0" style={{
                   background: s.type === 'floor' 
                     ? 'linear-gradient(to top, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.6) 100%)'
                     : 'linear-gradient(to bottom, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.4) 100%)',
                   mixBlendMode: 'multiply'
                }} />
              </div>
            );
          })}

          {/* SVG Overlay for legacy elements & highlights */}
          {W > 0 && (
            <svg width={W} height={H} className="absolute inset-0 block pointer-events-none" style={{ zIndex: 20 }}>

              {/* ── Layer 1: Surface base with directional gradients ── */}
              {!isPhoto && surfaces.map(s => (
                <polygon key={`base-${s.id}`}
                  points={s.ptsStr}
                  fill={`url(#${surfaceLightId(s.label)})`}
                  stroke={surfaceStroke(s.label)}
                  strokeWidth={0.6}
                />
              ))}

              {/* ── Layer 2: Tile pattern fills (Opaque to hide old wallpaper) ── */}
              {surfaces.map(s => {
                const cfg = configs[s.id];
                if (!cfg) return null;
                // Skip CSS 3D surfaces in SVG renderer
                if ((s as any).perspective !== undefined) return null;
                
                const clipId = `url(#clip-${s.id})`;
                const maskId = s.maskUrl ? `url(#mask-${s.id})` : undefined;

                if (s.path) {
                  return (
                    <path key={`tile-${s.id}`}
                      d={s.path}
                      fillRule="evenodd"
                      fill={`url(#${patId(s.id)})`}
                      clipPath={clipId}
                      mask={maskId}
                    />
                  );
                } else {
                  return (
                    <polygon key={`tile-${s.id}`}
                      points={s.ptsStr}
                      fill={`url(#${patId(s.id)})`}
                      clipPath={clipId}
                      mask={maskId}
                    />
                  );
                }
              })}

              {/* ── Layer 2.5: Photorealistic lighting overlays (for tiled photo surfaces) ── */}
              {isPhoto && surfaces.map(s => {
                if (!configs[s.id]) return null;
                // Skip CSS 3D surfaces in SVG renderer
                if ((s as any).perspective !== undefined) return null;
                const clipId = `url(#clip-${s.id})`;
                const maskId = s.maskUrl ? `url(#mask-${s.id})` : undefined;

                if (s.path) {
                  return (
                    <path key={`light-${s.id}`}
                      d={s.path}
                      fillRule="evenodd"
                      fill={`url(#${surfaceLightId(s.label)})`}
                      clipPath={clipId}
                      mask={maskId}
                      style={{ mixBlendMode: 'multiply', pointerEvents: 'none' }}
                    />
                  );
                } else {
                  return (
                    <polygon key={`light-${s.id}`}
                      points={s.ptsStr}
                      fill={`url(#${surfaceLightId(s.label)})`}
                      clipPath={clipId}
                      mask={maskId}
                      style={{ mixBlendMode: 'multiply', pointerEvents: 'none' }}
                    />
                  );
                }
              })}

              {/* ── Layer 3: Ambient Occlusion overlays ── */}
              {!isPhoto && (
                <>
                  <rect x={0} y={0} width={W} height={H} fill="url(#ao-tl)" style={{pointerEvents:'none'}}/>
                  <rect x={0} y={0} width={W} height={H} fill="url(#ao-tr)" style={{pointerEvents:'none'}}/>
                  <rect x={0} y={0} width={W} height={H} fill="url(#ao-bl)" style={{pointerEvents:'none'}}/>
                  <rect x={0} y={0} width={W} height={H} fill="url(#ao-br)" style={{pointerEvents:'none'}}/>
                </>
              )}

              {/* ── Layer 4: Architectural edge lines ── */}
              {!isPhoto && (
                <>
                  {/* Baseboard at wall/floor junctions */}
                  <line x1={0} y1={H} x2={W*0.28} y2={H*0.62} stroke="rgba(255,255,255,0.25)" strokeWidth={2}/>
                  <line x1={W*0.28} y1={H*0.62} x2={W*0.72} y2={H*0.62} stroke="rgba(255,255,255,0.2)" strokeWidth={2}/>
                  <line x1={W*0.72} y1={H*0.62} x2={W} y2={H} stroke="rgba(255,255,255,0.22)" strokeWidth={2}/>
                  <line x1={0} y1={H*0.998} x2={W*0.28} y2={H*0.622} stroke="rgba(0,0,0,0.15)" strokeWidth={1.5}/>
                  <line x1={W*0.28} y1={H*0.622} x2={W*0.72} y2={H*0.622} stroke="rgba(0,0,0,0.12)" strokeWidth={1.5}/>
                  <line x1={W*0.72} y1={H*0.622} x2={W} y2={H*0.998} stroke="rgba(0,0,0,0.15)" strokeWidth={1.5}/>
                  <line x1={0} y1={H*0.002} x2={W*0.28} y2={H*0.1} stroke="rgba(255,255,255,0.3)" strokeWidth={2}/>
                  <line x1={W*0.28} y1={H*0.1} x2={W*0.72} y2={H*0.1} stroke="rgba(255,255,255,0.28)" strokeWidth={2}/>
                  <line x1={W*0.72} y1={H*0.1} x2={W} y2={H*0.002} stroke="rgba(255,255,255,0.3)" strokeWidth={2}/>
                  <line x1={W*0.28} y1={H*0.1} x2={W*0.28} y2={H*0.62} stroke="rgba(0,0,0,0.18)" strokeWidth={2.5}/>
                  <line x1={W*0.72} y1={H*0.1} x2={W*0.72} y2={H*0.62} stroke="rgba(0,0,0,0.12)" strokeWidth={1.5}/>
                  
                  {/* ── Layer 5: Window ambient glow ── */}
                  <polygon
                    points={`${W*0.78},${H*0.52} ${W},${H*0.45} ${W},${H} ${W*0.72},${H*0.62}`}
                    fill="rgba(220,235,255,0.035)"
                    style={{pointerEvents:'none'}}
                  />
                </>
              )}

              {/* ── Layer 6: Room-specific furniture ── */}
              {!isPhoto && room.id === 'modern-room'   && <LuxuryFurniture W={W} H={H}/>}
              {!isPhoto && room.id === 'bathroom'      && <BathroomFurniture W={W} H={H}/>}
              {!isPhoto && room.id === 'kitchen'       && <KitchenFurniture W={W} H={H}/>}

              {/* ── Layer 7: Hover + selected highlights ── */}
              {surfaces.map(s => {
                const isSel = sel === s.id;
                const isHov = hov === s.id && !isSel;
                if (!isSel && !isHov) return null;
                
                const clipId = `url(#clip-${s.id})`;
                const maskId = s.maskUrl ? `url(#mask-${s.id})` : undefined;

                if (s.path) {
                  return (
                    <path key={`hl-${s.id}`}
                      d={s.path}
                      fillRule="evenodd"
                      fill={isSel ? 'rgba(20,184,166,0.10)' : 'rgba(255,255,255,0.05)'}
                      stroke={isSel ? '#14b8a6' : isPhoto ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.4)'}
                      strokeWidth={isSel ? 2 : 1.2}
                      strokeDasharray={!isSel ? '6 3' : undefined}
                      clipPath={clipId}
                      mask={maskId}
                      style={{pointerEvents:'none', mixBlendMode: isPhoto ? 'overlay' : 'normal'}}
                    />
                  );
                } else {
                  return (
                    <polygon key={`hl-${s.id}`}
                      points={s.ptsStr}
                      fill={isSel ? 'rgba(20,184,166,0.10)' : 'rgba(255,255,255,0.05)'}
                      stroke={isSel ? '#14b8a6' : 'rgba(255,255,255,0.4)'}
                      strokeWidth={isSel ? 2 : 1.2}
                      strokeDasharray={!isSel ? '6 3' : undefined}
                      clipPath={clipId}
                      mask={maskId}
                      style={{pointerEvents:'none', mixBlendMode: isPhoto ? 'overlay' : 'normal'}}
                    />
                  );
                }
              })}

              {/* ── Layer 8: Invisible click targets ── */}
              {surfaces.map(s => {
                if (s.pts.length === 0) return null;

                return s.path ? (
                  <path key={`hit-${s.id}`}
                    d={s.path}
                    fillRule="evenodd"
                    fill="transparent" stroke="none"
                    style={{ cursor: 'pointer', pointerEvents: 'auto' }}
                    onClick={() => setSel(s.id)}
                    onMouseEnter={() => setHov(s.id)}
                    onMouseLeave={() => setHov(null)}
                  />
                ) : (
                  <polygon key={`hit-${s.id}`}
                    points={s.ptsStr}
                    fill="transparent" stroke="none"
                    style={{ cursor: 'pointer', pointerEvents: 'auto' }}
                    onClick={() => setSel(s.id)}
                    onMouseEnter={() => setHov(s.id)}
                    onMouseLeave={() => setHov(null)}
                  />
                );
              })}

              {/* ── Layer 9: Surface labels — always rendered, opacity reflects state ── */}
              {surfaces.map(s => {
                // If it's an AI mask without a centroid, default the label to center
                const cx = s.pts.length > 0 ? s.centroid.x : W * 0.5;
                const cy = s.pts.length > 0 ? s.centroid.y : (s.type === 'floor' ? H * 0.8 : H * 0.4);
                
                const isSel = sel === s.id;
                const isHov = hov === s.id;
                const cfg = configs[s.id];
                // Always render — use opacity to show/hide gracefully
                const opacity = isSel || isHov || cfg ? 1 : (s.maskUrl ? 1 : 0); // Always show labels for AI masks to help them select
                const ptrEvents = isSel || isHov || cfg || s.maskUrl ? 'auto' : 'none';
                return (
                  <g key={`lbl-${s.id}`} style={{ opacity, transition: 'opacity 0.15s' }}>
                    <foreignObject
                      x={cx - 42} y={cy - 22}
                      width={84} height={44}
                      style={{ overflow: 'visible' }}
                    >
                      <div
                        onClick={() => setSel(s.id)}
                        onMouseEnter={() => setHov(s.id)}
                        onMouseLeave={() => setHov(null)}
                        style={{
                          display:'flex', flexDirection:'column', alignItems:'center',
                          gap:'3px', cursor:'pointer', pointerEvents: ptrEvents
                        }}
                      >
                        <div style={{
                          width:30, height:30, borderRadius:'50%',
                          background: isSel ? '#14b8a6' : cfg ? 'rgba(20,184,166,0.2)' : 'rgba(255,255,255,0.92)',
                          color: isSel ? '#fff' : cfg ? '#14b8a6' : '#374151',
                          display:'flex', alignItems:'center', justifyContent:'center',
                          boxShadow:'0 2px 12px rgba(0,0,0,0.5)',
                          border: isSel ? '2px solid #0f766e' : cfg ? '1.5px solid #14b8a6' : '1.5px solid rgba(255,255,255,0.8)',
                          transition:'all 0.15s',
                        }}>
                          {cfg ? (
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
                              <polyline points="20 6 9 17 4 12"/>
                            </svg>
                          ) : (
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                              <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/>
                            </svg>
                          )}
                        </div>
                        <span style={{
                          fontSize:'8px', fontWeight:700, letterSpacing:'0.07em',
                          textTransform:'uppercase', whiteSpace:'nowrap',
                          color: isSel ? '#14b8a6' : cfg ? '#5eead4' : 'rgba(255,255,255,0.95)',
                          textShadow:'0 1px 4px rgba(0,0,0,0.9)',
                        }}>
                          {s.label}
                        </span>
                      </div>
                    </foreignObject>
                  </g>
                );
              })}
            </svg>
          )}
        </div>
      </div>

      {/* ── Side Panel ── */}
      {sel ? (
        <TilePickerPanel
          room={room}
          surface={room.surfaces.find(s => s.id === sel)!}
          onClose={() => setSel(null)}
          pixelsPerInch={PPI}
        />
      ) : (
        <div className="w-72 bg-[#141414] border-l border-white/6 flex flex-col z-20 h-full">
          <div className="p-5 border-b border-white/6">
            <p className="text-white text-sm font-semibold">Design Studio</p>
            <p className="text-white/35 text-xs mt-0.5">Select any surface to tile</p>
          </div>

          <div className="p-4 space-y-1.5">
            {room.surfaces.map(s => {
              const cfg = configs[s.id];
              const tileLabel = cfg?.mode === 'single' ? TILES.find(t => t.id === cfg.tileId)?.name : cfg?.mode === 'layout' ? 'Custom Layout' : null;
              const sizeLabel = cfg?.tileSizeId ? TILE_SIZES.find(t => t.id === cfg.tileSizeId)?.label : null;
              return (
                <button key={s.id} onClick={() => setSel(s.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all border ${
                    cfg ? 'bg-teal-950/40 border-teal-500/25 hover:border-teal-500/50'
                        : 'bg-white/4 border-white/6 hover:bg-white/7 hover:border-white/12'
                  }`}
                >
                  <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${cfg ? 'bg-teal-400' : 'bg-white/20'}`}/>
                  <div className="flex-1 min-w-0">
                    <p className={`text-xs font-semibold truncate ${cfg ? 'text-teal-300' : 'text-white/60'}`}>{s.label}</p>
                    {tileLabel && <p className="text-[10px] text-white/30 truncate mt-0.5">{tileLabel}{sizeLabel ? ` · ${sizeLabel}` : ''}</p>}
                  </div>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-white/20 flex-shrink-0">
                    <path d="M9 18l6-6-6-6"/>
                  </svg>
                </button>
              );
            })}
          </div>

          <div className="flex-1 flex items-center justify-center p-6">
            <p className="text-white/20 text-xs text-center leading-relaxed">
              Click on a surface in the room<br/>or select one above
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
