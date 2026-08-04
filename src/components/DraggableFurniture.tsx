import React, { useRef, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useDesignStore } from '../store/useDesignStore';
import { calculateWallSnap, clampPositionToRoom } from '../utils/autoLayout';

interface Props {
  id: string;
  assetType: string;
  position: [number, number, number];
  rotation: [number, number, number];
  scale?: number;
  children: React.ReactNode;
}

export default function DraggableFurniture({ id, assetType, position, rotation, scale = 1, children }: Props) {
  const groupRef = useRef<THREE.Group>(null);
  const innerGroupRef = useRef<THREE.Group>(null);
  const [isHovered, setIsHovered] = useState(false);
  
  const isFurnitureEditMode = useDesignStore(s => s.isFurnitureEditMode);
  const activeObjectId = useDesignStore(s => s.activeObjectId);
  const setActiveObjectId = useDesignStore(s => s.setActiveObjectId);
  const updateObjectTransform = useDesignStore(s => s.updateObjectTransform);
  const removePlacedObject = useDesignStore(s => s.removePlacedObject);
  const roomDimensions = useDesignStore(s => s.roomDimensions);

  const updateObjectSize = useDesignStore(s => s.updateObjectSize);
  const sizeRef = useRef<[number, number, number]>([0.5, 1, 0.5]);

  useEffect(() => {
    // Wait a frame for children to mount and calculate size
    setTimeout(() => {
      if (innerGroupRef.current && groupRef.current) {
        // Reset inner group position to compute accurate box
        innerGroupRef.current.position.y = 0;
        innerGroupRef.current.updateMatrixWorld(true);
        
        const box = new THREE.Box3().setFromObject(innerGroupRef.current);
        const size = new THREE.Vector3();
        box.getSize(size);
        
        if (size.x > 0 && size.y > 0 && size.z > 0) {
          sizeRef.current = [size.x, size.y, size.z];
          updateObjectSize(id, sizeRef.current);
          
          // Compute the local offset needed to align the bottom of the bounding box to y=0
          // The bounding box is in world coordinates (after groupRef's position/scale are applied)
          // But since we want to offset the innerGroup locally, we can just use a local Box3
          const localBox = new THREE.Box3().setFromObject(innerGroupRef.current);
          // Wait, setFromObject computes world box. To get local box, we temporarily detach it?
          // Actually, if we just want the offset in world space scaled back to local:
          // The bottom is box.min.y. The group is at `position[1]`.
          // We want the new absolute bottom to be `position[1]`.
          // So we shift the inner group by (position[1] - box.min.y) / worldScale
          const worldScale = groupRef.current.scale.y;
          const shiftY = (position[1] - box.min.y) / worldScale;
          innerGroupRef.current.position.y = shiftY;
        }
      }
    }, 50);
  }, [id, updateObjectSize, position, scale, rotation]);

  const isActive = activeObjectId === id && isFurnitureEditMode;
  const showHoverEffect = isHovered && isFurnitureEditMode && !isActive;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isActive && (e.key === 'Backspace' || e.key === 'Delete')) {
        removePlacedObject(id);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isActive, id, removePlacedObject]);

  useEffect(() => {
    if (isHovered && isFurnitureEditMode) {
      document.body.style.cursor = 'grab';
    } else {
      document.body.style.cursor = 'auto';
    }
    return () => { document.body.style.cursor = 'auto'; };
  }, [isHovered, isFurnitureEditMode]);

  useFrame(() => {
    if (groupRef.current) {
      // Smoothly animate scale on hover
      const targetScale = showHoverEffect ? scale * 1.05 : scale;
      groupRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.15);
    }
  });

  return (
    <group 
      onClick={(e) => {
        e.stopPropagation();
        if (isFurnitureEditMode) {
          setActiveObjectId(id);
        }
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        setIsHovered(true);
      }}
      onPointerOut={(e) => {
        e.stopPropagation();
        setIsHovered(false);
      }}
    >
      <group ref={groupRef} position={position} rotation={rotation} scale={[scale, scale, scale]}>
        <group ref={innerGroupRef}>
          {children}
        </group>
      </group>
    </group>
  );
}
