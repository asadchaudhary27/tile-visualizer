import React from 'react';
import TileSurface3D from '../TileSurface3D';
import { useDesignStore } from '../../store/useDesignStore';

interface Props {
  activeSurfaceId: string | null;
  onSelectSurface: (id: string) => void;
}

export default function KitchenTraditional({ activeSurfaceId, onSelectSurface }: Props) {
  const { width: roomWidth, length: roomDepth, height: wallHeight } = useDesignStore(s => s.roomDimensions);

  return (
    <group>
      <TileSurface3D
        surfaceId="env-trad-floor"
        label="Traditional Floor"
        width={roomWidth + 0.04}
        height={roomDepth + 0.04}
        position={[0, 0, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        isSelected={activeSurfaceId === 'env-trad-floor'}
        onSelect={() => onSelectSurface('env-trad-floor')}
      />
      <TileSurface3D
        surfaceId="env-trad-wall-back"
        label="Mosaic Backsplash"
        width={roomWidth + 0.04}
        height={wallHeight + 0.04}
        position={[0, wallHeight / 2, -roomDepth / 2]}
        rotation={[0, 0, 0]}
        isSelected={activeSurfaceId === 'env-trad-wall-back'}
        onSelect={() => onSelectSurface('env-trad-wall-back')}
      />

      {/* Wood Island */}
      <mesh position={[0, 0.45, 0]} castShadow receiveShadow>
        <boxGeometry args={[roomWidth * 0.4, 0.9, 1.2]} />
        <meshStandardMaterial color="#5c4033" roughness={0.8} />
      </mesh>
      
      {/* Marble Countertop */}
      <mesh position={[0, 0.92, 0]} castShadow receiveShadow>
        <boxGeometry args={[roomWidth * 0.4 + 0.2, 0.06, 1.4]} />
        <meshStandardMaterial color="#e8e8e8" roughness={0.2} />
      </mesh>

      {/* Back Cabinets */}
      <mesh position={[0, 0.45, -roomDepth / 2 + 0.3]} castShadow receiveShadow>
        <boxGeometry args={[roomWidth - 0.4, 0.9, 0.6]} />
        <meshStandardMaterial color="#f0f0f0" roughness={0.6} />
      </mesh>
    </group>
  );
}
