import React from 'react';
import TileSurface3D from '../TileSurface3D';
import { useDesignStore } from '../../store/useDesignStore';

interface Props {
  activeSurfaceId: string | null;
  onSelectSurface: (id: string) => void;
}

export default function KitchenContemporary({ activeSurfaceId, onSelectSurface }: Props) {
  const { width: roomWidth, length: roomDepth, height: wallHeight } = useDesignStore(s => s.roomDimensions);

  return (
    <group>
      <TileSurface3D
        surfaceId="env-cont-floor"
        label="Contemporary Floor"
        width={roomWidth + 0.04}
        height={roomDepth + 0.04}
        position={[0, 0, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        isSelected={activeSurfaceId === 'env-cont-floor'}
        onSelect={() => onSelectSurface('env-cont-floor')}
      />
      <TileSurface3D
        surfaceId="env-cont-wall-back"
        label="Slab Backsplash"
        width={roomWidth + 0.04}
        height={wallHeight + 0.04}
        position={[0, wallHeight / 2, -roomDepth / 2]}
        rotation={[0, 0, 0]}
        isSelected={activeSurfaceId === 'env-cont-wall-back'}
        onSelect={() => onSelectSurface('env-cont-wall-back')}
      />

      {/* Two-tone Island */}
      <mesh position={[0, 0.45, 0]} castShadow receiveShadow>
        <boxGeometry args={[roomWidth * 0.6, 0.9, 1]} />
        <meshStandardMaterial color="#1a365d" roughness={0.3} />
      </mesh>
      
      {/* Quartz Countertop */}
      <mesh position={[0, 0.92, 0]} castShadow receiveShadow>
        <boxGeometry args={[roomWidth * 0.6 + 0.1, 0.04, 1.2]} />
        <meshStandardMaterial color="#ffffff" roughness={0.1} />
      </mesh>

      {/* Back Cabinets */}
      <mesh position={[0, 0.45, -roomDepth / 2 + 0.3]} castShadow receiveShadow>
        <boxGeometry args={[roomWidth - 0.2, 0.9, 0.6]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.2} />
      </mesh>
    </group>
  );
}
