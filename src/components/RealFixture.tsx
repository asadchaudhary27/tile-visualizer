import React, { useMemo } from 'react';
import * as THREE from 'three';
import { RoundedBox, useGLTF, Center } from '@react-three/drei';
import { SkeletonUtils } from 'three-stdlib';
import { useDesignStore } from '../store/useDesignStore';

function ModernVanityGLTF({ scaleFactor }: { scaleFactor: number }) {
  const { scene } = useGLTF('/models/VANITY/Modern_vanity_Design.glb');
  
  const clonedScene = useMemo(() => {
    const clone = scene.clone();
    
    // Fix materials first
    clone.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        
        const mesh = child as THREE.Mesh;
        if (mesh.material) {
          if (Array.isArray(mesh.material)) {
            mesh.material.forEach(m => { m.side = THREE.DoubleSide; m.needsUpdate = true; });
          } else {
            (mesh.material as THREE.Material).side = THREE.DoubleSide;
            (mesh.material as THREE.Material).needsUpdate = true;
          }
        }
      }
    });

    const wrapper = new THREE.Group();
    // Rotate to face front
    clone.rotation.y = -Math.PI / 2;
    wrapper.add(clone);
    
    // Force matrix update to compute accurate initial bounds
    wrapper.updateMatrixWorld(true);
    
    const box = new THREE.Box3().setFromObject(wrapper);
    const size = new THREE.Vector3();
    box.getSize(size);
    
    // Scale dynamically to exactly 1.2 meters wide
    if (size.x > 0.01) {
      const scale = 1.2 / size.x;
      wrapper.scale.set(scale, scale, scale);
    }
    
    // Update matrix again to calculate accurate bounds after scaling
    wrapper.updateMatrixWorld(true);
    const boxAfter = new THREE.Box3().setFromObject(wrapper);
    const centerAfter = new THREE.Vector3();
    boxAfter.getCenter(centerAfter);
    
    // Position it so its center X/Z is at 0,0, and its base is at Y=0.05 
    wrapper.position.x -= centerAfter.x;
    wrapper.position.z -= centerAfter.z;
    wrapper.position.y += (0.05 - boxAfter.min.y);

    return wrapper;
  }, [scene]);

  return (
    <group scale={[scaleFactor, scaleFactor, scaleFactor]}>
      <primitive object={clonedScene} />
    </group>
  );
}

interface Props {
  assetType: string;
}


class ModelErrorBoundary extends React.Component<{children: React.ReactNode}, {hasError: boolean}> {
  constructor(props: {children: React.ReactNode}) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError(_error: any) {
    return { hasError: true };
  }
  componentDidCatch(error: any, _errorInfo: any) {
    console.error("Model failed to load:", error);
  }
  render() {
    if (this.state.hasError) {
      return (
        <Center bottom>
          <mesh>
            <boxGeometry args={[0.5, 0.5, 0.5]} />
            <meshStandardMaterial color="red" wireframe />
          </mesh>
        </Center>
      );
    }
    return this.props.children;
  }
}

function GenericGLBModel({ url }: { url: string }) {
  const { scene } = useGLTF(url);
  const roomDimensions = useDesignStore(s => s.roomDimensions);
  
  const clonedScene = useMemo(() => {
    const clone = SkeletonUtils.clone(scene);
    clone.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        const mesh = child as THREE.Mesh;
        if (mesh.material) {
          if (Array.isArray(mesh.material)) {
            mesh.material.forEach(m => { m.side = THREE.DoubleSide; m.needsUpdate = true; });
          } else {
            (mesh.material as THREE.Material).side = THREE.DoubleSide;
            (mesh.material as THREE.Material).needsUpdate = true;
          }
        }
      }
    });

    // Calculate real-world bounds and normalize, ignoring invisible nodes/cameras/lights
    const box = new THREE.Box3();
    clone.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const meshBox = new THREE.Box3().setFromObject(child);
        box.union(meshBox);
      }
    });

    if (box.isEmpty()) {
      box.setFromObject(clone); // Fallback
    }

    const size = new THREE.Vector3();
    box.getSize(size);
    const maxDim = Math.max(size.x, size.y, size.z);
    
    // Heuristic: Normalize units to meters based on raw size
    let baseScale = 1.0;
    if (maxDim > 500) {
      baseScale = 0.001; // Probably millimeters
    } else if (maxDim > 50) {
      baseScale = 0.01; // Probably centimeters
    } else if (maxDim > 10 && maxDim < 50) {
      baseScale = 0.0254; // Probably inches
    }
    
    // Scale proportionally to room limits (e.g. shouldn't exceed 40% of the room's smaller dimension)
    const normalizedMaxDim = maxDim * baseScale;
    // Safeguard room dimensions
    const roomMinLimit = Math.max(0.1, Math.min(roomDimensions.width || 3, roomDimensions.length || 3));
    const maxAllowedSize = roomMinLimit * 0.4;
    
    let finalScale = baseScale;
    if (normalizedMaxDim > maxAllowedSize && normalizedMaxDim > 0.0001) {
      // If it's still too big for the room, scale it down mathematically to fit
      finalScale = baseScale * (maxAllowedSize / normalizedMaxDim);
    }
    
    // FATAL CRASH PREVENTION: Never allow NaN or Infinity to reach scale.set()
    if (isNaN(finalScale) || !isFinite(finalScale) || finalScale <= 0) {
      finalScale = 1.0;
    }
    
    clone.scale.set(finalScale, finalScale, finalScale);
    
    // Update matrix after scaling to calculate accurate bounds
    clone.updateMatrixWorld(true);
    
    const boxAfter = new THREE.Box3();
    clone.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const meshBox = new THREE.Box3().setFromObject(child);
        boxAfter.union(meshBox);
      }
    });
    if (boxAfter.isEmpty()) boxAfter.setFromObject(clone);
    const centerAfter = new THREE.Vector3();
    boxAfter.getCenter(centerAfter);
    
    // Center it horizontally (X and Z) and place its bottom precisely at Y=0
    clone.position.x -= centerAfter.x;
    clone.position.z -= centerAfter.z;
    clone.position.y += (0 - boxAfter.min.y);
    
    return clone;
  }, [scene, roomDimensions.width, roomDimensions.length]);

  return (
    <primitive object={clonedScene} />
  );
}

export default function RealFixture({ assetType }: Props) {
  const roomDimensions = useDesignStore(s => s.roomDimensions);
  
  // Calculate dynamic scale: if room is smaller than 4x4m (16 sq m), scale down to make objects fit better visually
  const roomArea = roomDimensions.width * roomDimensions.length;
  const scaleFactor = Math.min(1.0, Math.max(0.6, Math.sqrt(roomArea / 16.0)));

  if (assetType.startsWith('glb:')) {
    const filename = assetType.replace('glb:', '');
    const encodedUrl = encodeURI(`/models/${filename}.glb`);
    return (
      <group position={[0, 0, 0]} scale={[scaleFactor, scaleFactor, scaleFactor]}>
        <ModelErrorBoundary>
          <GenericGLBModel url={encodedUrl} />
        </ModelErrorBoundary>
      </group>
    );
  }

  // Fallback for everything else (simple styled box)
  return (
    <group position={[0, 0.5 * scaleFactor, 0]} scale={[scaleFactor, scaleFactor, scaleFactor]}>
      <RoundedBox args={[1, 1, 1]} radius={0.02} receiveShadow castShadow>
        <meshStandardMaterial color="#8B5A2B" roughness={0.8} />
      </RoundedBox>
    </group>
  );
}
