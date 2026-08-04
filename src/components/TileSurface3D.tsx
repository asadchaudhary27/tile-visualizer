import { useRef, useMemo, useEffect, useState } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { useDesignStore } from '../store/useDesignStore';
import { TILES } from '../data/tiles';
import { TILE_SIZES, DEFAULT_TILE_SIZE_ID } from '../data/tileSizes';

interface Props {
  surfaceId: string;
  label: string;
  width: number; // in meters
  height: number; // in meters
  position: [number, number, number];
  rotation: [number, number, number];
  isSelected: boolean;
  onSelect: () => void;
}

const INCH_TO_METER = 0.0254;

export default function TileSurface3D({ surfaceId, label, width, height, position, rotation, isSelected, onSelect }: Props) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  // Interaction state
  const [hovered, setHovered] = useState(false);
  
  // Global Store
  const configs = useDesignStore(s => s.configs);
  const cfg = configs[surfaceId];
  
  const handleClick = (e: any) => {
    e.stopPropagation();
    onSelect();
  };

  // Generate uniform physical UVs that start exactly at the visible bottom-left corner
  const geometry = useMemo(() => {
    const geo = new THREE.PlaneGeometry(width, height);
    const uvs = geo.attributes.uv;
    
    if (uvs) {
      for (let i = 0; i < uvs.count; i++) {
        // The 3D geometries are extended by 0.02m on all sides to prevent z-fighting at the seams.
        // To make the tiles start perfectly full at the *visible* corner, we offset the UV by -0.02.
        uvs.setX(i, uvs.getX(i) * width - 0.02);
        uvs.setY(i, uvs.getY(i) * height - 0.02);
      }
    }
    return geo;
  }, [width, height]);

  // Generate the texture
  const texture = useMemo(() => {
    if (!cfg) return null;

    const size = TILE_SIZES.find(s => s.id === (cfg.tileSizeId ?? DEFAULT_TILE_SIZE_ID)) ?? TILE_SIZES[6];
    const tileWidthM = size.widthIn * INCH_TO_METER;
    const tileHeightM = size.heightIn * INCH_TO_METER;

    if (cfg.mode === 'single' && cfg.tileId) {
      const tile = TILES.find(t => t.id === cfg.tileId);
      if (!tile) return null;
      
      // We create a CanvasTexture
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    // Physical dimensions in meters
    const tileWidthM = size.widthIn * INCH_TO_METER;
    const tileHeightM = size.heightIn * INCH_TO_METER;

    // To support staggered (brick) layout, we render a 2x2 grid of tiles on the canvas
    // Canvas resolution: higher is crisper. 512px per tile is good.
    const pxPerTileWidth = 512;
    const aspect = tileHeightM / tileWidthM;
    const pxPerTileHeight = pxPerTileWidth * aspect;
    
    canvas.width = pxPerTileWidth * 2;
    canvas.height = pxPerTileHeight * 2;

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.anisotropy = 16; // sharp angles
    tex.colorSpace = THREE.SRGBColorSpace;

    if (cfg.rotationDegree) {
      // Rotation center at the origin (0,0) ensures edge cuts remain identical at 0, 90, 180, 270 degrees
      tex.center.set(0, 0);
      tex.rotation = (cfg.rotationDegree * Math.PI) / 180;
    }

    // Load image and draw
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      ctx.fillStyle = cfg.groutColor || '#e5e7eb'; // Use customized grout color
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const groutPx = cfg.groutThickness !== undefined ? cfg.groutThickness : 4;

      // Draw 2x2 grid
      for (let row = 0; row < 2; row++) {
        for (let col = 0; col < 3; col++) { // 3 cols to handle stagger wrap
          let x = col * pxPerTileWidth;
          let y = row * pxPerTileHeight;
          
          if (cfg.layout === ('staggered' as any) && row === 1) {
             x -= pxPerTileWidth / 2; // offset second row by 50%
          }

          ctx.drawImage(
            img, 
            x + groutPx/2, 
            y + groutPx/2, 
            pxPerTileWidth - groutPx, 
            pxPerTileHeight - groutPx
          );
        }
      }
      tex.needsUpdate = true;
    };
    img.src = tile.imageUrl;

    // Calculate repeats mathematically based on physical UVs (1 unit = 1 meter)
    const patternWidthM = tileWidthM * 2;
    const patternHeightM = tileHeightM * 2;
    tex.repeat.set(1 / patternWidthM, 1 / patternHeightM);

    return tex;
    } else if (cfg.mode === 'layout' && cfg.generatedPatternUrl) {
      // Custom layouts generate a 4x4 grid base64 image
      const tex = new THREE.TextureLoader().load(cfg.generatedPatternUrl);
      tex.wrapS = THREE.RepeatWrapping;
      tex.wrapT = THREE.RepeatWrapping;
      tex.anisotropy = 16;
      tex.colorSpace = THREE.SRGBColorSpace;
      
      if (cfg.rotationDegree) {
        tex.center.set(0, 0);
        tex.rotation = (cfg.rotationDegree * Math.PI) / 180;
      }
      
      const grid = cfg.layout?.gridSize || 4;
      const patternWidthM = tileWidthM * grid;
      const patternHeightM = tileHeightM * grid;
      tex.repeat.set(1 / patternWidthM, 1 / patternHeightM);
      
      return tex;
    }
    
    return null;
  }, [cfg, width, height]);

  // Determine material physical properties based on tile finish
  const materialProps = useMemo(() => {
    if (!cfg) return { roughness: 1, metalness: 0, clearcoat: 0, clearcoatRoughness: 0, envMapIntensity: 0 };
    
    // First priority: explicit user override
    if (cfg.finish === 'glossy') {
       return { roughness: 0.1, metalness: 0.1, clearcoat: 1.0, clearcoatRoughness: 0.05, envMapIntensity: 1.5 };
    } else if (cfg.finish === 'matte') {
       return { roughness: 0.7, metalness: 0.0, clearcoat: 0.1, clearcoatRoughness: 0.8, envMapIntensity: 0.5 };
    } else if (cfg.finish === 'satin') {
       return { roughness: 0.4, metalness: 0.05, clearcoat: 0.4, clearcoatRoughness: 0.4, envMapIntensity: 0.8 };
    }

    let isGlossy = false;
    
    if (cfg.mode === 'single' && cfg.tileId) {
       const tile = TILES.find(t => t.id === cfg.tileId);
       if (tile && tile.finish === 'glossy') {
          isGlossy = true;
       }
    } else if (cfg.mode === 'layout' && cfg.layout && cfg.layout.tileIds) {
       const hasGlossy = cfg.layout.tileIds.some(id => {
          const tile = TILES.find(t => t.id === id);
          return tile && tile.finish === 'glossy';
       });
       if (hasGlossy) isGlossy = true;
    }
    
    if (isGlossy) {
       return { roughness: 0.1, metalness: 0.2, clearcoat: 1.0, clearcoatRoughness: 0.05, envMapIntensity: 1.5 };
    }
    
    // Matte / Standard real look
    return { roughness: 0.7, metalness: 0.0, clearcoat: 0.1, clearcoatRoughness: 0.8, envMapIntensity: 0.5 };
  }, [cfg]);

  return (
    <mesh 
      ref={meshRef}
      position={position} 
      rotation={rotation}
      onPointerUp={handleClick}
      onPointerOver={(e) => { e.stopPropagation(); setHovered(true); }}
      onPointerOut={() => setHovered(false)}
      receiveShadow
      castShadow
    >
      <primitive object={geometry} attach="geometry" />
      {texture ? (
        <meshPhysicalMaterial 
          map={texture}
          roughness={materialProps.roughness}
          metalness={materialProps.metalness}
          clearcoat={materialProps.clearcoat}
          clearcoatRoughness={materialProps.clearcoatRoughness}
          envMapIntensity={materialProps.envMapIntensity}
          color={hovered ? '#ffffff' : '#ffffff'}
          side={THREE.FrontSide}
          polygonOffset={true}
          polygonOffsetFactor={1}
        />
      ) : (
        <meshStandardMaterial 
          color={hovered ? '#e5e7eb' : '#d1d5db'} 
          roughness={0.8}
          side={THREE.FrontSide}
          polygonOffset={true}
          polygonOffsetFactor={1}
        />
      )}
      
      {/* Outline for debugging/selection */}
      {(hovered || isSelected) && (
        <lineSegments>
          <edgesGeometry args={[new THREE.PlaneGeometry(width, height)]} />
          <lineBasicMaterial color={isSelected ? "#14b8a6" : "#ffffff"} linewidth={isSelected ? 3 : 1} />
        </lineSegments>
      )}
    </mesh>
  );
}
