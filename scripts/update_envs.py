import os

envs = {
    "KitchenModernMinimalist.tsx": """import React from 'react';
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
""",

    "KitchenIndustrial.tsx": """import React from 'react';
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
""",

    "KitchenTraditional.tsx": """import React from 'react';
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
""",

    "KitchenContemporary.tsx": """import React from 'react';
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
""",

    "BathroomStandard.tsx": """import React, { useMemo } from 'react';
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
"""
}

base_dir = "src/components/environments"
for filename, content in envs.items():
    filepath = os.path.join(base_dir, filename)
    with open(filepath, "w", encoding="utf-8") as f:
        f.write(content)
    print(f"Updated {filename}")
