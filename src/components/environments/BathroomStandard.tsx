import React, { useMemo } from 'react';
import * as THREE from 'three';
import { useGLTF } from '@react-three/drei';
import TileSurface3D from '../TileSurface3D';
import { useDesignStore } from '../../store/useDesignStore';

interface Props {
  activeSurfaceId: string | null;
  onSelectSurface: (id: string) => void;
}

export default function BathroomStandard({ activeSurfaceId, onSelectSurface }: Props) {
  const { width: roomWidth, length: roomDepth, height: wallHeight } = useDesignStore(s => s.roomDimensions);
  const { scene } = useGLTF('/models/Modern_vanity_Design.glb');
  
  const vanity = useMemo(() => {
    const clone = scene.clone(true);
    clone.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        if (mesh.material) {
          if (Array.isArray(mesh.material)) {
            mesh.material.forEach(m => { m.side = THREE.DoubleSide; });
          } else {
            mesh.material.side = THREE.DoubleSide;
          }
        }
      }
    });

    const box = new THREE.Box3().setFromObject(clone);
    const size = new THREE.Vector3();
    box.getSize(size);
    const maxDim = Math.max(size.x, size.y, size.z);
    
    // Scale vanity to be ~1.2m wide
    const targetSize = 1.2;
    const scale = targetSize / maxDim;
    clone.scale.set(scale, scale, scale);
    
    const center = new THREE.Vector3();
    box.getCenter(center);
    clone.position.set(-center.x * scale, -box.min.y * scale, -center.z * scale);
    
    return clone;
  }, [scene]);

  return (
    <group>
      <TileSurface3D
        surfaceId="env-bath-floor"
        label="Bathroom Floor"
        width={roomWidth + 0.04}
        height={roomDepth + 0.04}
        position={[0, 0, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        isSelected={activeSurfaceId === 'env-bath-floor'}
        onSelect={() => onSelectSurface('env-bath-floor')}
      />
      <TileSurface3D
        surfaceId="env-bath-wall-back"
        label="Vanity Wall"
        width={roomWidth + 0.04}
        height={wallHeight + 0.04}
        position={[0, wallHeight / 2, -roomDepth / 2]}
        rotation={[0, 0, 0]}
        isSelected={activeSurfaceId === 'env-bath-wall-back'}
        onSelect={() => onSelectSurface('env-bath-wall-back')}
      />
      <TileSurface3D
        surfaceId="env-bath-wall-left"
        label="Shower Wall"
        width={roomDepth + 0.04}
        height={wallHeight + 0.04}
        position={[-roomWidth / 2, wallHeight / 2, 0]}
        rotation={[0, Math.PI / 2, 0]}
        isSelected={activeSurfaceId === 'env-bath-wall-left'}
        onSelect={() => onSelectSurface('env-bath-wall-left')}
      />

      {/* Dynamic Vanity placement */}
      <group position={[0, 0, -roomDepth / 2 + 0.3]}>
         <primitive object={vanity} />
      </group>

      {/* Mirror */}
      <mesh position={[0, 1.5, -roomDepth / 2 + 0.05]} castShadow>
        <boxGeometry args={[1.0, 1.0, 0.05]} />
        <meshStandardMaterial color="#ffffff" metalness={1.0} roughness={0.0} />
      </mesh>
    </group>
  );
}
