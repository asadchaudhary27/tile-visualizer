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
  const lastBoxMinY = useRef<number | null>(null);
  const frameCount = useRef(0);

  const isActive = activeObjectId === id && isFurnitureEditMode;
  const showHoverEffect = isHovered && isFurnitureEditMode && !isActive;

  useFrame(() => {
    if (groupRef.current) {
      // Smoothly animate scale on hover
      const targetScale = showHoverEffect ? scale * 1.05 : scale;
      groupRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.15);
    }

    if (innerGroupRef.current && groupRef.current) {
      frameCount.current++;
      // Recalculate frequently for the first few seconds (to catch loads), then less frequently, but always when active
      const shouldMeasure = isActive || frameCount.current < 120 || frameCount.current % 60 === 0;

      if (shouldMeasure) {
        // Temporarily reset shift to measure raw bounds
        innerGroupRef.current.position.y = 0;
        innerGroupRef.current.updateMatrixWorld(true);
        
        const box = new THREE.Box3().setFromObject(innerGroupRef.current);
        
        // If raw bounds changed (model loaded or scaled)
        if (lastBoxMinY.current === null || Math.abs(box.min.y - lastBoxMinY.current) > 0.005) {
          lastBoxMinY.current = box.min.y;
          
          const size = new THREE.Vector3();
          box.getSize(size);
          if (size.x > 0 && size.y > 0 && size.z > 0) {
            sizeRef.current = [size.x, size.y, size.z];
            updateObjectSize(id, sizeRef.current);
          }
        }
      }

      // Always enforce the shift based on the latest known bounds
      if (lastBoxMinY.current !== null) {
        const worldScale = groupRef.current.scale.y;
        const shiftY = (position[1] - lastBoxMinY.current) / worldScale;
        innerGroupRef.current.position.y = shiftY;
      }
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
