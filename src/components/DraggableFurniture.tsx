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
  const hasCentered = useRef(false);

  const isActive = activeObjectId === id && isFurnitureEditMode;
  const showHoverEffect = isHovered && isFurnitureEditMode && !isActive;

  useFrame(() => {
    if (groupRef.current) {
      // Smoothly animate scale on hover
      const targetScale = showHoverEffect ? scale * 1.05 : scale;
      groupRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.15);
    }

    if (!hasCentered.current && groupRef.current && innerGroupRef.current) {
      // Temporarily reset group to identity to measure raw local bounds
      const oldPos = groupRef.current.position.clone();
      const oldRot = groupRef.current.rotation.clone();
      const oldScale = groupRef.current.scale.clone();
      
      groupRef.current.position.set(0,0,0);
      groupRef.current.rotation.set(0,0,0);
      groupRef.current.scale.set(1,1,1);
      groupRef.current.updateMatrixWorld(true);
      
      innerGroupRef.current.position.set(0,0,0);
      innerGroupRef.current.updateMatrixWorld(true);
      
      const box = new THREE.Box3().setFromObject(innerGroupRef.current);
      const size = new THREE.Vector3();
      box.getSize(size);
      
      if (size.x > 0 && size.y > 0 && size.z > 0) {
        const center = new THREE.Vector3();
        box.getCenter(center);
        
        // Offset inner geometry so its center is exactly (0,0,0) locally, and rests on Y=0
        innerGroupRef.current.position.set(-center.x, -box.min.y, -center.z);
        
        // Report the RAW LOCAL size to the store (unscaled, unrotated)
        updateObjectSize(id, [size.x, size.y, size.z]);
        hasCentered.current = true;
      }
      
      // Restore previous transforms
      groupRef.current.position.copy(oldPos);
      groupRef.current.rotation.copy(oldRot);
      groupRef.current.scale.copy(oldScale);
      groupRef.current.updateMatrixWorld(true);
    }
  });

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
      onPointerDown={(e) => {
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
