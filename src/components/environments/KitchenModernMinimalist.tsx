import React from 'react';
import { Group } from 'three';
import TileSurface3D from '../TileSurface3D';
import { useDesignStore } from '../../store/useDesignStore';

interface Props {
  activeSurfaceId: string | null;
  onSelectSurface: (id: string) => void;
}

export default function KitchenModernMinimalist({ activeSurfaceId, onSelectSurface }: Props) {
  const { width: roomWidth, length: roomDepth, height: wallHeight } = useDesignStore(s => s.roomDimensions);

  return (
    <group>
      {/* Tileable Surfaces */}
      <TileSurface3D
        surfaceId="env-mod-floor"
        label="Kitchen Floor"
        width={roomWidth + 0.04}
        height={roomDepth + 0.04}
        position={[0, 0, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        isSelected={activeSurfaceId === 'env-mod-floor'}
        onSelect={() => onSelectSurface('env-mod-floor')}
      />
      <TileSurface3D
        surfaceId="env-mod-wall-back"
        label="Backsplash"
        width={roomWidth + 0.04}
        height={wallHeight + 0.04}
        position={[0, wallHeight / 2, -roomDepth / 2]}
        rotation={[0, 0, 0]}
        isSelected={activeSurfaceId === 'env-mod-wall-back'}
        onSelect={() => onSelectSurface('env-mod-wall-back')}
      />
      <TileSurface3D
        surfaceId="env-mod-wall-left"
        label="Left Wall"
        width={roomDepth + 0.04}
        height={wallHeight + 0.04}
        position={[-roomWidth / 2, wallHeight / 2, 0]}
        rotation={[0, Math.PI / 2, 0]}
        isSelected={activeSurfaceId === 'env-mod-wall-left'}
        onSelect={() => onSelectSurface('env-mod-wall-left')}
      />

      {/* Procedural Furniture: Kitchen Island */}
      <mesh position={[0, 0.45, 0]} castShadow receiveShadow>
        <boxGeometry args={[roomWidth * 0.5, 0.9, 1]} />
        <meshStandardMaterial color="#222222" metalness={0.2} roughness={0.5} />
      </mesh>
      
      {/* Island Countertop */}
      <mesh position={[0, 0.92, 0]} castShadow receiveShadow>
        <boxGeometry args={[roomWidth * 0.5 + 0.1, 0.05, 1.2]} />
        <meshStandardMaterial color="#fdfdfd" metalness={0.1} roughness={0.1} />
      </mesh>

      {/* Back Cabinets */}
      <mesh position={[0, 0.45, -roomDepth / 2 + 0.3]} castShadow receiveShadow>
        <boxGeometry args={[roomWidth - 0.2, 0.9, 0.6]} />
        <meshStandardMaterial color="#1a1a1a" metalness={0.3} roughness={0.6} />
      </mesh>

      {/* Back Countertop */}
      <mesh position={[0, 0.92, -roomDepth / 2 + 0.3]} castShadow receiveShadow>
        <boxGeometry args={[roomWidth - 0.1, 0.05, 0.65]} />
        <meshStandardMaterial color="#fdfdfd" metalness={0.1} roughness={0.1} />
      </mesh>

      {/* Upper Cabinets */}
      <mesh position={[0, 2.2, -roomDepth / 2 + 0.2]} castShadow receiveShadow>
        <boxGeometry args={[roomWidth - 0.2, 0.8, 0.4]} />
        <meshStandardMaterial color="#1a1a1a" metalness={0.3} roughness={0.6} />
      </mesh>
    </group>
  );
}
