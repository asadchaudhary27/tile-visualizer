import React from 'react';
import TileSurface3D from '../TileSurface3D';
import { useDesignStore } from '../../store/useDesignStore';

interface Props {
  activeSurfaceId: string | null;
  onSelectSurface: (id: string) => void;
}

export default function KitchenIndustrial({ activeSurfaceId, onSelectSurface }: Props) {
  const { width: roomWidth, length: roomDepth, height: wallHeight } = useDesignStore(s => s.roomDimensions);

  return (
    <group>
      <TileSurface3D
        surfaceId="env-ind-floor"
        label="Industrial Floor"
        width={roomWidth + 0.04}
        height={roomDepth + 0.04}
        position={[0, 0, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        isSelected={activeSurfaceId === 'env-ind-floor'}
        onSelect={() => onSelectSurface('env-ind-floor')}
      />
      <TileSurface3D
        surfaceId="env-ind-wall-back"
        label="Brick Backsplash"
        width={roomWidth + 0.04}
        height={wallHeight + 0.04}
        position={[0, wallHeight / 2, -roomDepth / 2]}
        rotation={[0, 0, 0]}
        isSelected={activeSurfaceId === 'env-ind-wall-back'}
        onSelect={() => onSelectSurface('env-ind-wall-back')}
      />
      
      {/* Industrial Island */}
      <mesh position={[0, 0.45, 0]} castShadow receiveShadow>
        <boxGeometry args={[roomWidth * 0.5, 0.9, 1.2]} />
        <meshStandardMaterial color="#2d2d2d" metalness={0.8} roughness={0.4} />
      </mesh>
      
      {/* Concrete Countertop */}
      <mesh position={[0, 0.92, 0]} castShadow receiveShadow>
        <boxGeometry args={[roomWidth * 0.5 + 0.2, 0.08, 1.4]} />
        <meshStandardMaterial color="#888888" metalness={0.1} roughness={0.9} />
      </mesh>

      {/* Back Cabinets */}
      <mesh position={[0, 0.45, -roomDepth / 2 + 0.3]} castShadow receiveShadow>
        <boxGeometry args={[roomWidth - 0.4, 0.9, 0.6]} />
        <meshStandardMaterial color="#3a3a3a" metalness={0.6} roughness={0.5} />
      </mesh>

      {/* Back Countertop */}
      <mesh position={[0, 0.92, -roomDepth / 2 + 0.3]} castShadow receiveShadow>
        <boxGeometry args={[roomWidth - 0.3, 0.08, 0.65]} />
        <meshStandardMaterial color="#888888" metalness={0.1} roughness={0.9} />
      </mesh>
    </group>
  );
}
