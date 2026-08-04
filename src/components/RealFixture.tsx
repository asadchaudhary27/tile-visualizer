import React, { useMemo } from 'react';
import * as THREE from 'three';
import { RoundedBox, useGLTF } from '@react-three/drei';
import { useDesignStore } from '../store/useDesignStore';

function ModernVanityGLTF({ scaleFactor }: { scaleFactor: number }) {
  const { scene } = useGLTF('/models/Modern_vanity_Design.glb');
  
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

export default function RealFixture({ assetType }: Props) {
  const roomDimensions = useDesignStore(s => s.roomDimensions);
  
  // Calculate dynamic scale: if room is smaller than 4x4m (16 sq m), scale down to make objects fit better visually
  const roomArea = roomDimensions.width * roomDimensions.length;
  const scaleFactor = Math.min(1.0, Math.max(0.6, Math.sqrt(roomArea / 16.0)));

  // Materials
  const woodMaterial = useMemo(() => new THREE.MeshStandardMaterial({ color: '#8B5A2B', roughness: 0.8 }), []);
  const ceramicMaterial = useMemo(() => new THREE.MeshStandardMaterial({ color: '#ffffff', roughness: 0.1, metalness: 0.1 }), []);
  const metalMaterial = useMemo(() => new THREE.MeshStandardMaterial({ color: '#cccccc', roughness: 0.2, metalness: 0.8 }), []);
  const fabricMaterial = useMemo(() => new THREE.MeshStandardMaterial({ color: '#64748b', roughness: 0.9 }), []);
  const glassMaterial = useMemo(() => new THREE.MeshStandardMaterial({ color: '#a8d8ea', transparent: true, opacity: 0.4, roughness: 0.1 }), []);

  if (assetType === 'BedQueen') {
    return (
      <group position={[0, 0.25 * scaleFactor, 0]} scale={[scaleFactor, scaleFactor, scaleFactor]}>
        {/* Frame */}
        <RoundedBox args={[1.5, 0.3, 2.0]} radius={0.02} material={woodMaterial} receiveShadow castShadow />
        {/* Mattress */}
        <RoundedBox args={[1.4, 0.25, 1.9]} position={[0, 0.27, 0]} radius={0.05} material={fabricMaterial} receiveShadow castShadow />
        {/* Headboard */}
        <RoundedBox args={[1.5, 0.8, 0.1]} position={[0, 0.5, -0.95]} radius={0.02} material={woodMaterial} receiveShadow castShadow />
        {/* Pillows */}
        <RoundedBox args={[0.6, 0.1, 0.3]} position={[-0.35, 0.45, -0.7]} radius={0.05} material={ceramicMaterial} receiveShadow castShadow />
        <RoundedBox args={[0.6, 0.1, 0.3]} position={[0.35, 0.45, -0.7]} radius={0.05} material={ceramicMaterial} receiveShadow castShadow />
      </group>
    );
  }

  if (assetType === 'KingBed') {
    return (
      <group position={[0, 0.25 * scaleFactor, 0]} scale={[scaleFactor, scaleFactor, scaleFactor]}>
        {/* Frame */}
        <RoundedBox args={[1.9, 0.3, 2.0]} radius={0.02} material={woodMaterial} receiveShadow castShadow />
        {/* Mattress */}
        <RoundedBox args={[1.8, 0.25, 1.9]} position={[0, 0.27, 0]} radius={0.05} material={fabricMaterial} receiveShadow castShadow />
        {/* Headboard */}
        <RoundedBox args={[1.9, 0.9, 0.1]} position={[0, 0.55, -0.95]} radius={0.02} material={woodMaterial} receiveShadow castShadow />
        {/* Pillows */}
        <RoundedBox args={[0.7, 0.1, 0.35]} position={[-0.45, 0.45, -0.7]} radius={0.05} material={ceramicMaterial} receiveShadow castShadow />
        <RoundedBox args={[0.7, 0.1, 0.35]} position={[0.45, 0.45, -0.7]} radius={0.05} material={ceramicMaterial} receiveShadow castShadow />
      </group>
    );
  }

  if (assetType === 'SingleBed') {
    return (
      <group position={[0, 0.25 * scaleFactor, 0]} scale={[scaleFactor, scaleFactor, scaleFactor]}>
        {/* Frame */}
        <RoundedBox args={[1.0, 0.3, 2.0]} radius={0.02} material={woodMaterial} receiveShadow castShadow />
        {/* Mattress */}
        <RoundedBox args={[0.9, 0.25, 1.9]} position={[0, 0.27, 0]} radius={0.05} material={fabricMaterial} receiveShadow castShadow />
        {/* Headboard */}
        <RoundedBox args={[1.0, 0.7, 0.1]} position={[0, 0.45, -0.95]} radius={0.02} material={woodMaterial} receiveShadow castShadow />
        {/* Pillow */}
        <RoundedBox args={[0.6, 0.1, 0.3]} position={[0, 0.45, -0.7]} radius={0.05} material={ceramicMaterial} receiveShadow castShadow />
      </group>
    );
  }

  if (assetType === 'BunkBed') {
    return (
      <group position={[0, 0.25 * scaleFactor, 0]} scale={[scaleFactor, scaleFactor, scaleFactor]}>
        {/* Lower Bed Frame */}
        <RoundedBox args={[1.0, 0.15, 2.0]} radius={0.02} material={woodMaterial} receiveShadow castShadow />
        <RoundedBox args={[0.9, 0.2, 1.9]} position={[0, 0.17, 0]} radius={0.05} material={fabricMaterial} receiveShadow castShadow />
        
        {/* Upper Bed Frame */}
        <RoundedBox args={[1.0, 0.15, 2.0]} position={[0, 1.2, 0]} radius={0.02} material={woodMaterial} receiveShadow castShadow />
        <RoundedBox args={[0.9, 0.2, 1.9]} position={[0, 1.37, 0]} radius={0.05} material={fabricMaterial} receiveShadow castShadow />
        
        {/* Posts */}
        {[[-0.45, -0.95], [0.45, -0.95], [-0.45, 0.95], [0.45, 0.95]].map((pos, i) => (
          <mesh key={i} position={[pos[0], 0.7, pos[1]]} castShadow>
            <cylinderGeometry args={[0.04, 0.04, 1.8]} />
            <primitive object={woodMaterial} />
          </mesh>
        ))}

        {/* Ladder */}
        <mesh position={[0.45, 0.6, 0.3]} castShadow>
          <cylinderGeometry args={[0.02, 0.02, 1.4]} />
          <primitive object={woodMaterial} />
        </mesh>
        <mesh position={[0.45, 0.6, 0.7]} castShadow>
          <cylinderGeometry args={[0.02, 0.02, 1.4]} />
          <primitive object={woodMaterial} />
        </mesh>
        {[0.2, 0.5, 0.8, 1.1].map((y, i) => (
          <mesh key={`rung-${i}`} position={[0.45, y, 0.5]} rotation={[Math.PI/2, 0, 0]} castShadow>
            <cylinderGeometry args={[0.02, 0.02, 0.4]} />
            <primitive object={woodMaterial} />
          </mesh>
        ))}

        {/* Pillows */}
        <RoundedBox args={[0.6, 0.1, 0.3]} position={[0, 0.32, -0.7]} radius={0.05} material={ceramicMaterial} receiveShadow castShadow />
        <RoundedBox args={[0.6, 0.1, 0.3]} position={[0, 1.52, -0.7]} radius={0.05} material={ceramicMaterial} receiveShadow castShadow />
      </group>
    );
  }

  if (assetType === 'Vanity') {
    return (
      <group position={[0, 0.45 * scaleFactor, 0]} scale={[scaleFactor, scaleFactor, scaleFactor]}>
        {/* Cabinet */}
        <RoundedBox args={[1.2, 0.8, 0.5]} radius={0.01} material={woodMaterial} receiveShadow castShadow />
        {/* Countertop */}
        <RoundedBox args={[1.25, 0.05, 0.55]} position={[0, 0.425, 0]} radius={0.01} material={ceramicMaterial} receiveShadow castShadow />
        {/* Sink Basin */}
        <RoundedBox args={[0.5, 0.1, 0.3]} position={[0, 0.4, 0]} radius={0.05} material={ceramicMaterial} />
        {/* Faucet */}
        <mesh position={[0, 0.55, -0.2]} castShadow>
          <cylinderGeometry args={[0.02, 0.02, 0.2]} />
          <primitive object={metalMaterial} />
        </mesh>
        {/* Mirror */}
        <mesh position={[0, 1.2, -0.24]} castShadow>
          <planeGeometry args={[1.0, 0.8]} />
          <meshStandardMaterial color="#eeeeee" metalness={0.9} roughness={0.1} />
        </mesh>
      </group>
    );
  }

  if (assetType === 'ModernVanityDesign') {
    return <ModernVanityGLTF scaleFactor={scaleFactor} />;
  }

  if (assetType === 'DoubleVanity') {
    return (
      <group position={[0, 0.45 * scaleFactor, 0]} scale={[scaleFactor, scaleFactor, scaleFactor]}>
        {/* Wide Cabinet */}
        <RoundedBox args={[2.0, 0.8, 0.5]} radius={0.01} material={woodMaterial} receiveShadow castShadow />
        {/* Countertop */}
        <RoundedBox args={[2.1, 0.05, 0.55]} position={[0, 0.425, 0]} radius={0.01} material={ceramicMaterial} receiveShadow castShadow />
        
        {/* Left Sink Basin & Faucet */}
        <RoundedBox args={[0.5, 0.1, 0.3]} position={[-0.5, 0.4, 0]} radius={0.05} material={ceramicMaterial} />
        <mesh position={[-0.5, 0.55, -0.2]} castShadow>
          <cylinderGeometry args={[0.02, 0.02, 0.2]} />
          <primitive object={metalMaterial} />
        </mesh>
        
        {/* Right Sink Basin & Faucet */}
        <RoundedBox args={[0.5, 0.1, 0.3]} position={[0.5, 0.4, 0]} radius={0.05} material={ceramicMaterial} />
        <mesh position={[0.5, 0.55, -0.2]} castShadow>
          <cylinderGeometry args={[0.02, 0.02, 0.2]} />
          <primitive object={metalMaterial} />
        </mesh>

        {/* Left Mirror */}
        <mesh position={[-0.5, 1.2, -0.24]} castShadow>
          <planeGeometry args={[0.8, 0.8]} />
          <meshStandardMaterial color="#eeeeee" metalness={0.9} roughness={0.1} />
        </mesh>
        
        {/* Right Mirror */}
        <mesh position={[0.5, 1.2, -0.24]} castShadow>
          <planeGeometry args={[0.8, 0.8]} />
          <meshStandardMaterial color="#eeeeee" metalness={0.9} roughness={0.1} />
        </mesh>
      </group>
    );
  }

  if (assetType === 'Toilet') {
    return (
      <group position={[0, 0.4 * scaleFactor, 0]} scale={[scaleFactor, scaleFactor, scaleFactor]}>
        {/* Base */}
        <RoundedBox args={[0.3, 0.4, 0.5]} position={[0, -0.2, 0.1]} radius={0.1} material={ceramicMaterial} receiveShadow castShadow />
        {/* Tank */}
        <RoundedBox args={[0.4, 0.4, 0.2]} position={[0, 0.2, -0.2]} radius={0.05} material={ceramicMaterial} receiveShadow castShadow />
        {/* Seat */}
        <RoundedBox args={[0.35, 0.05, 0.45]} position={[0, 0.025, 0.1]} radius={0.02} material={ceramicMaterial} receiveShadow castShadow />
      </group>
    );
  }

  if (assetType === 'Bathtub') {
    return (
      <group position={[0, 0.3 * scaleFactor, 0]} scale={[scaleFactor, scaleFactor, scaleFactor]}>
        {/* Tub Base */}
        <RoundedBox args={[1.7, 0.6, 0.8]} radius={0.05} material={ceramicMaterial} receiveShadow castShadow />
        {/* Tub Hollow (Visual trick with dark material inside or just a simple shape) */}
        <RoundedBox args={[1.5, 0.5, 0.6]} position={[0, 0.1, 0]} radius={0.1}>
          <meshStandardMaterial color="#e2e8f0" roughness={0.5} />
        </RoundedBox>
        {/* Faucet */}
        <mesh position={[0.7, 0.4, 0]} castShadow>
          <cylinderGeometry args={[0.02, 0.02, 0.15]} />
          <primitive object={metalMaterial} />
        </mesh>
      </group>
    );
  }

  if (assetType === 'Shower') {
    return (
      <group position={[0, 1.0 * scaleFactor, 0]} scale={[scaleFactor, scaleFactor, scaleFactor]}>
        {/* Base Tray */}
        <RoundedBox args={[1.0, 0.1, 1.0]} position={[0, -0.95, 0]} radius={0.02} material={ceramicMaterial} receiveShadow castShadow />
        {/* Glass Walls */}
        <mesh position={[0, 0, 0.5]} receiveShadow>
          <boxGeometry args={[1.0, 2.0, 0.02]} />
          <primitive object={glassMaterial} />
        </mesh>
        <mesh position={[0.5, 0, 0]} receiveShadow>
          <boxGeometry args={[0.02, 2.0, 1.0]} />
          <primitive object={glassMaterial} />
        </mesh>
        {/* Shower Head */}
        <mesh position={[0, 0.9, -0.4]} rotation={[Math.PI / 4, 0, 0]} castShadow>
          <cylinderGeometry args={[0.08, 0.05, 0.1]} />
          <primitive object={metalMaterial} />
        </mesh>
      </group>
    );
  }

  if (assetType === 'TowelRail') {
    return (
      <group position={[0, 0.8 * scaleFactor, 0]} scale={[scaleFactor, scaleFactor, scaleFactor]}>
        {/* Wall Mounts */}
        <mesh position={[-0.4, 0, -0.1]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.02, 0.02, 0.1]} />
          <primitive object={metalMaterial} />
        </mesh>
        <mesh position={[0.4, 0, -0.1]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.02, 0.02, 0.1]} />
          <primitive object={metalMaterial} />
        </mesh>
        {/* The Rail */}
        <mesh position={[0, 0, -0.05]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.015, 0.015, 0.8]} />
          <primitive object={metalMaterial} />
        </mesh>
        {/* Folded Towel */}
        <RoundedBox args={[0.4, 0.5, 0.04]} position={[0, -0.2, -0.05]} radius={0.01} material={fabricMaterial} receiveShadow castShadow />
      </group>
    );
  }

  if (assetType === 'FloorPlant') {
    return (
      <group position={[0, 0.2 * scaleFactor, 0]} scale={[scaleFactor, scaleFactor, scaleFactor]}>
        {/* Pot */}
        <mesh position={[0, -0.05, 0]} castShadow>
          <cylinderGeometry args={[0.2, 0.15, 0.3, 16]} />
          <meshStandardMaterial color="#d4a373" roughness={0.8} />
        </mesh>
        {/* Soil */}
        <mesh position={[0, 0.1, 0]}>
          <cylinderGeometry args={[0.18, 0.18, 0.02, 16]} />
          <meshStandardMaterial color="#3a2e25" roughness={0.9} />
        </mesh>
        {/* Leaves / Plant body (Abstract) */}
        <mesh position={[0, 0.4, 0]} castShadow>
          <sphereGeometry args={[0.3, 16, 16]} />
          <meshStandardMaterial color="#2d6a4f" roughness={0.7} />
        </mesh>
        <mesh position={[-0.1, 0.3, 0.1]} castShadow>
          <sphereGeometry args={[0.2, 16, 16]} />
          <meshStandardMaterial color="#40916c" roughness={0.7} />
        </mesh>
        <mesh position={[0.1, 0.45, -0.1]} castShadow>
          <sphereGeometry args={[0.25, 16, 16]} />
          <meshStandardMaterial color="#52b788" roughness={0.7} />
        </mesh>
      </group>
    );
  }

  if (assetType === 'LuxurySofa') {
    return (
      <group position={[0, 0.45 * scaleFactor, 0]} scale={[scaleFactor, scaleFactor, scaleFactor]}>
        {/* Base */}
        <RoundedBox args={[2.5, 0.35, 1.0]} position={[0, -0.2, 0]} radius={0.05} material={fabricMaterial} receiveShadow castShadow>
          <meshStandardMaterial color="#1e3245" roughness={0.8} />
        </RoundedBox>
        {/* Backrest */}
        <RoundedBox args={[2.5, 0.6, 0.3]} position={[0, 0.25, -0.35]} radius={0.05} material={fabricMaterial} receiveShadow castShadow>
          <meshStandardMaterial color="#1e3245" roughness={0.8} />
        </RoundedBox>
        {/* Armrests */}
        <RoundedBox args={[0.25, 0.45, 1.0]} position={[-1.125, 0.2, 0]} radius={0.05} material={fabricMaterial} receiveShadow castShadow>
          <meshStandardMaterial color="#2a445c" roughness={0.8} />
        </RoundedBox>
        <RoundedBox args={[0.25, 0.45, 1.0]} position={[1.125, 0.2, 0]} radius={0.05} material={fabricMaterial} receiveShadow castShadow>
          <meshStandardMaterial color="#2a445c" roughness={0.8} />
        </RoundedBox>
        {/* Throw Pillows */}
        <RoundedBox args={[0.4, 0.4, 0.1]} position={[-0.9, 0.3, -0.15]} rotation={[0.1, 0.2, 0]} radius={0.05} castShadow>
          <meshStandardMaterial color="#8b7355" roughness={0.9} />
        </RoundedBox>
        <RoundedBox args={[0.4, 0.4, 0.1]} position={[0.9, 0.3, -0.15]} rotation={[0.1, -0.2, 0]} radius={0.05} castShadow>
          <meshStandardMaterial color="#8b7355" roughness={0.9} />
        </RoundedBox>
        {/* Legs */}
        {[[-1.1, -0.35], [1.1, -0.35], [-1.1, 0.35], [1.1, 0.35]].map((pos, idx) => (
          <mesh key={`leg-${idx}`} position={[pos[0], -0.4, pos[1]]} castShadow>
            <cylinderGeometry args={[0.02, 0.015, 0.2]} />
            <meshStandardMaterial color="#2a1a0a" />
          </mesh>
        ))}
      </group>
    );
  }

  if (assetType === 'AreaRug') {
    return (
      <group position={[0, 0.02 * scaleFactor, 0]} scale={[scaleFactor, scaleFactor, scaleFactor]}>
        <RoundedBox args={[4.0, 0.02, 3.0]} position={[0, 0, 0]} radius={0.01} receiveShadow>
          <meshStandardMaterial color="#111830" roughness={1.0} />
        </RoundedBox>
        {/* Outer border visually */}
        <RoundedBox args={[3.8, 0.025, 2.8]} position={[0, 0.005, 0]} radius={0.01} receiveShadow>
          <meshStandardMaterial color="#1a2540" roughness={1.0} />
        </RoundedBox>
      </group>
    );
  }

  if (assetType === 'TVWall') {
    return (
      <group position={[0, 1.2 * scaleFactor, 0]} scale={[scaleFactor, scaleFactor, scaleFactor]}>
        {/* Floating Console */}
        <RoundedBox args={[2.5, 0.3, 0.4]} position={[0, -0.8, 0]} radius={0.02} material={woodMaterial} receiveShadow castShadow />
        {/* TV OLED Screen */}
        <RoundedBox args={[2.0, 1.2, 0.02]} position={[0, 0.2, -0.15]} radius={0.01} receiveShadow castShadow>
          <meshStandardMaterial color="#0a0f1a" roughness={0.1} metalness={0.9} />
        </RoundedBox>
        {/* TV Glow */}
        <pointLight position={[0, 0.2, 0.2]} intensity={0.5} color="#4477ff" distance={3} />
        {/* Artwork above TV */}
        <RoundedBox args={[0.8, 1.0, 0.02]} position={[0, 1.4, -0.15]} radius={0.01} receiveShadow castShadow>
          <meshStandardMaterial color="#f4efe7" />
        </RoundedBox>
        {/* Inner Art Frame */}
        <RoundedBox args={[0.7, 0.9, 0.025]} position={[0, 1.4, -0.14]} radius={0.01} receiveShadow castShadow>
          <meshStandardMaterial color="#ede8e0" />
        </RoundedBox>
      </group>
    );
  }

  if (assetType === 'FloorLamp') {
    return (
      <group position={[0, 1.2 * scaleFactor, 0]} scale={[scaleFactor, scaleFactor, scaleFactor]}>
        {/* Base */}
        <mesh position={[0, -1.15, 0]} castShadow>
          <cylinderGeometry args={[0.2, 0.2, 0.05]} />
          <primitive object={metalMaterial} />
        </mesh>
        {/* Curved Pole (Approximated with straight segments) */}
        <mesh position={[0, -0.2, 0]} castShadow>
          <cylinderGeometry args={[0.015, 0.015, 1.9]} />
          <primitive object={metalMaterial} />
        </mesh>
        <mesh position={[0.3, 0.8, 0]} rotation={[0, 0, Math.PI / 4]} castShadow>
          <cylinderGeometry args={[0.015, 0.015, 0.9]} />
          <primitive object={metalMaterial} />
        </mesh>
        {/* Shade */}
        <mesh position={[0.6, 0.5, 0]} castShadow>
          <cylinderGeometry args={[0.15, 0.2, 0.2, 32]} />
          <meshStandardMaterial color="#f5e8c0" roughness={0.8} />
        </mesh>
        {/* Light */}
        <pointLight position={[0.6, 0.4, 0]} intensity={1.5} color="#ffdd99" distance={4} />
      </group>
    );
  }

  if (assetType === 'SideTable') {
    return (
      <group position={[0, 0.3 * scaleFactor, 0]} scale={[scaleFactor, scaleFactor, scaleFactor]}>
        {/* Marble Top */}
        <mesh position={[0, 0.3, 0]} castShadow>
          <cylinderGeometry args={[0.25, 0.25, 0.03, 32]} />
          <meshStandardMaterial color="#f5f0e8" roughness={0.1} />
        </mesh>
        {/* Brass X Legs */}
        <mesh position={[0, 0, 0]} rotation={[0, 0, Math.PI / 6]} castShadow>
          <cylinderGeometry args={[0.015, 0.015, 0.7]} />
          <primitive object={metalMaterial} />
        </mesh>
        <mesh position={[0, 0, 0]} rotation={[0, 0, -Math.PI / 6]} castShadow>
          <cylinderGeometry args={[0.015, 0.015, 0.7]} />
          <primitive object={metalMaterial} />
        </mesh>
      </group>
    );
  }

  if (assetType === 'FiddleLeafFig') {
    return (
      <group position={[0, 0.5 * scaleFactor, 0]} scale={[scaleFactor, scaleFactor, scaleFactor]}>
        {/* Pot */}
        <mesh position={[0, -0.3, 0]} castShadow>
          <cylinderGeometry args={[0.2, 0.15, 0.4, 32]} />
          <meshStandardMaterial color="#e8e0d8" roughness={0.3} />
        </mesh>
        {/* Soil */}
        <mesh position={[0, -0.1, 0]}>
          <cylinderGeometry args={[0.18, 0.18, 0.02, 32]} />
          <meshStandardMaterial color="#3a2c1e" roughness={0.9} />
        </mesh>
        {/* Stem */}
        <mesh position={[0, 0.4, 0]} castShadow>
          <cylinderGeometry args={[0.015, 0.02, 1.0]} />
          <meshStandardMaterial color="#4a6a2a" roughness={0.7} />
        </mesh>
        {/* Leaves */}
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <mesh key={`leaf-${i}`} position={[Math.sin(i) * 0.1, i * 0.15 + 0.1, Math.cos(i) * 0.1]} rotation={[Math.PI / 4, i * 1.5, 0]} castShadow>
            <cylinderGeometry args={[0.15, 0.1, 0.01, 16]} />
            <meshStandardMaterial color="#2d5a20" roughness={0.6} />
          </mesh>
        ))}
      </group>
    );
  }

  if (assetType === 'CeilingLight') {
    return (
      <group position={[0, 2.8 * scaleFactor, 0]} scale={[scaleFactor, scaleFactor, scaleFactor]}>
        {/* Wire */}
        <mesh position={[0, -0.5, 0]} castShadow>
          <cylinderGeometry args={[0.005, 0.005, 1.0]} />
          <primitive object={metalMaterial} />
        </mesh>
        {/* Brass Fixture body */}
        <mesh position={[0, -1.0, 0]} castShadow>
          <cylinderGeometry args={[0.2, 0.05, 0.1, 32]} />
          <primitive object={metalMaterial} />
        </mesh>
        <mesh position={[0, -1.05, 0]} castShadow>
          <cylinderGeometry args={[0.15, 0.05, 0.05, 32]} />
          <meshStandardMaterial color="#f5e8c0" roughness={0.8} emissive="#ffdd99" emissiveIntensity={0.5} />
        </mesh>
        <pointLight position={[0, -1.1, 0]} intensity={1.0} color="#ffdd99" distance={5} />
      </group>
    );
  }

  if (assetType === 'Sofa') {
    return (
      <group position={[0, 0.4 * scaleFactor, 0]} scale={[scaleFactor, scaleFactor, scaleFactor]}>
        {/* Base */}
        <RoundedBox args={[2.2, 0.3, 0.9]} position={[0, -0.2, 0]} radius={0.05} material={fabricMaterial} receiveShadow castShadow />
        {/* Backrest */}
        <RoundedBox args={[2.2, 0.5, 0.2]} position={[0, 0.2, -0.35]} radius={0.05} material={fabricMaterial} receiveShadow castShadow />
        {/* Armrests */}
        <RoundedBox args={[0.2, 0.4, 0.9]} position={[-1.0, 0.1, 0]} radius={0.05} material={fabricMaterial} receiveShadow castShadow />
        <RoundedBox args={[0.2, 0.4, 0.9]} position={[1.0, 0.1, 0]} radius={0.05} material={fabricMaterial} receiveShadow castShadow />
      </group>
    );
  }

  if (assetType === 'Nightstand') {
    return (
      <group position={[0, 0.3 * scaleFactor, 0]} scale={[scaleFactor, scaleFactor, scaleFactor]}>
        <RoundedBox args={[0.5, 0.6, 0.4]} radius={0.02} material={woodMaterial} receiveShadow castShadow />
      </group>
    );
  }

  if (assetType === 'Wardrobe') {
    return (
      <group position={[0, 1.0 * scaleFactor, 0]} scale={[scaleFactor, scaleFactor, scaleFactor]}>
        <RoundedBox args={[1.2, 2.0, 0.6]} radius={0.02} material={woodMaterial} receiveShadow castShadow />
      </group>
    );
  }

  if (assetType === 'KitchenIsland') {
    return (
      <group position={[0, 0.45 * scaleFactor, 0]} scale={[scaleFactor, scaleFactor, scaleFactor]}>
        <RoundedBox args={[2.0, 0.85, 0.9]} radius={0.01} material={woodMaterial} receiveShadow castShadow />
        <RoundedBox args={[2.1, 0.05, 1.0]} position={[0, 0.45, 0]} radius={0.01} material={ceramicMaterial} receiveShadow castShadow />
      </group>
    );
  }

  if (assetType === 'KitchenCabinets') {
    return (
      <group position={[0, 1.0 * scaleFactor, 0]} scale={[scaleFactor, scaleFactor, scaleFactor]}>
        {/* Lower Cabinets */}
        <RoundedBox args={[3.0, 0.85, 0.6]} position={[0, -0.55, 0]} radius={0.01} material={woodMaterial} receiveShadow castShadow />
        {/* Countertop */}
        <RoundedBox args={[3.05, 0.05, 0.65]} position={[0, -0.1, 0.025]} radius={0.01} material={ceramicMaterial} receiveShadow castShadow />
        {/* Upper Cabinets */}
        <RoundedBox args={[3.0, 0.7, 0.35]} position={[0, 0.65, -0.125]} radius={0.01} material={woodMaterial} receiveShadow castShadow />
        {/* Backsplash plane */}
        <mesh position={[0, 0.25, -0.29]} receiveShadow>
          <planeGeometry args={[3.0, 0.7]} />
          <meshStandardMaterial color="#f8f8f8" roughness={0.2} metalness={0.1} />
        </mesh>
        {/* Built-in Sink (Right Side) */}
        <RoundedBox args={[0.6, 0.1, 0.4]} position={[0.8, -0.1, 0.05]} radius={0.05} material={metalMaterial} receiveShadow castShadow />
        {/* Faucet */}
        <mesh position={[0.8, 0.05, -0.1]} castShadow>
          <cylinderGeometry args={[0.02, 0.02, 0.2]} />
          <primitive object={metalMaterial} />
        </mesh>
        {/* Cooktop (Center) */}
        <RoundedBox args={[0.7, 0.02, 0.5]} position={[0, -0.07, 0.05]} radius={0.01}>
          <meshStandardMaterial color="#111" roughness={0.2} metalness={0.8} />
        </RoundedBox>
      </group>
    );
  }

  if (assetType === 'RangeHood') {
    return (
      <group position={[0, 1.6 * scaleFactor, 0]} scale={[scaleFactor, scaleFactor, scaleFactor]}>
        {/* Hood Base */}
        <RoundedBox args={[0.8, 0.15, 0.5]} position={[0, 0, 0]} radius={0.02} material={metalMaterial} receiveShadow castShadow />
        {/* Hood Duct */}
        <RoundedBox args={[0.3, 0.8, 0.3]} position={[0, 0.45, -0.1]} radius={0.01} material={metalMaterial} receiveShadow castShadow />
      </group>
    );
  }

  if (assetType === 'BarStool') {
    return (
      <group position={[0, 0.4 * scaleFactor, 0]} scale={[scaleFactor, scaleFactor, scaleFactor]}>
        {/* Post */}
        <mesh position={[0, -0.1, 0]} castShadow>
          <cylinderGeometry args={[0.03, 0.03, 0.6]} />
          <primitive object={metalMaterial} />
        </mesh>
        {/* Base */}
        <mesh position={[0, -0.4, 0]} castShadow>
          <cylinderGeometry args={[0.25, 0.25, 0.02]} />
          <primitive object={metalMaterial} />
        </mesh>
        {/* Seat Cushion */}
        <RoundedBox args={[0.4, 0.1, 0.4]} position={[0, 0.25, 0]} radius={0.05} material={fabricMaterial} receiveShadow castShadow />
      </group>
    );
  }

  if (assetType === 'PendantLight') {
    return (
      <group position={[0, 1.8 * scaleFactor, 0]} scale={[scaleFactor, scaleFactor, scaleFactor]}>
        {/* Wire */}
        <mesh position={[0, 0.3, 0]} castShadow>
          <cylinderGeometry args={[0.005, 0.005, 0.6]} />
          <primitive object={metalMaterial} />
        </mesh>
        {/* Shade */}
        <mesh position={[0, 0, 0]} castShadow>
          <cylinderGeometry args={[0.05, 0.2, 0.2, 32]} />
          <meshStandardMaterial color="#c8a86c" roughness={0.3} metalness={0.7} />
        </mesh>
      </group>
    );
  }

  if (assetType === 'DiningTable') {
    return (
      <group position={[0, 0.4 * scaleFactor, 0]} scale={[scaleFactor, scaleFactor, scaleFactor]}>
        <RoundedBox args={[1.8, 0.05, 0.9]} position={[0, 0.35, 0]} radius={0.02} material={woodMaterial} receiveShadow castShadow />
        {/* Legs */}
        <RoundedBox args={[0.08, 0.75, 0.08]} position={[-0.8, -0.05, -0.35]} radius={0.01} material={woodMaterial} receiveShadow castShadow />
        <RoundedBox args={[0.08, 0.75, 0.08]} position={[0.8, -0.05, -0.35]} radius={0.01} material={woodMaterial} receiveShadow castShadow />
        <RoundedBox args={[0.08, 0.75, 0.08]} position={[-0.8, -0.05, 0.35]} radius={0.01} material={woodMaterial} receiveShadow castShadow />
        <RoundedBox args={[0.08, 0.75, 0.08]} position={[0.8, -0.05, 0.35]} radius={0.01} material={woodMaterial} receiveShadow castShadow />
      </group>
    );
  }

  if (assetType === 'DiningChair') {
    return (
      <group position={[0, 0.25 * scaleFactor, 0]} scale={[scaleFactor, scaleFactor, scaleFactor]}>
        <RoundedBox args={[0.4, 0.05, 0.4]} position={[0, 0.2, 0]} radius={0.02} material={woodMaterial} receiveShadow castShadow />
        <RoundedBox args={[0.4, 0.4, 0.05]} position={[0, 0.4, -0.175]} radius={0.02} material={woodMaterial} receiveShadow castShadow />
        <RoundedBox args={[0.05, 0.45, 0.05]} position={[-0.15, -0.05, -0.15]} radius={0.01} material={metalMaterial} receiveShadow castShadow />
        <RoundedBox args={[0.05, 0.45, 0.05]} position={[0.15, -0.05, -0.15]} radius={0.01} material={metalMaterial} receiveShadow castShadow />
        <RoundedBox args={[0.05, 0.45, 0.05]} position={[-0.15, -0.05, 0.15]} radius={0.01} material={metalMaterial} receiveShadow castShadow />
        <RoundedBox args={[0.05, 0.45, 0.05]} position={[0.15, -0.05, 0.15]} radius={0.01} material={metalMaterial} receiveShadow castShadow />
      </group>
    );
  }

  if (assetType === 'Fridge') {
    return (
      <group position={[0, 0.9 * scaleFactor, 0]} scale={[scaleFactor, scaleFactor, scaleFactor]}>
        <RoundedBox args={[0.9, 1.8, 0.8]} radius={0.02} material={metalMaterial} receiveShadow castShadow />
        {/* Handles */}
        <RoundedBox args={[0.05, 0.5, 0.05]} position={[-0.1, 0.2, 0.42]} radius={0.01} material={ceramicMaterial} receiveShadow castShadow />
        <RoundedBox args={[0.05, 0.5, 0.05]} position={[0.1, 0.2, 0.42]} radius={0.01} material={ceramicMaterial} receiveShadow castShadow />
      </group>
    );
  }

  if (assetType === 'Stove') {
    return (
      <group position={[0, 0.45 * scaleFactor, 0]} scale={[scaleFactor, scaleFactor, scaleFactor]}>
        {/* Oven Body */}
        <RoundedBox args={[0.8, 0.9, 0.7]} radius={0.02} material={metalMaterial} receiveShadow castShadow />
        {/* Cooktop */}
        <RoundedBox args={[0.85, 0.05, 0.75]} position={[0, 0.45, 0]} radius={0.01} material={ceramicMaterial} receiveShadow castShadow />
        {/* Burners */}
        <mesh position={[-0.2, 0.48, -0.15]} rotation={[Math.PI/2, 0, 0]}><cylinderGeometry args={[0.1, 0.1, 0.02]}/><meshStandardMaterial color="#222"/></mesh>
        <mesh position={[0.2, 0.48, -0.15]} rotation={[Math.PI/2, 0, 0]}><cylinderGeometry args={[0.1, 0.1, 0.02]}/><meshStandardMaterial color="#222"/></mesh>
        <mesh position={[-0.2, 0.48, 0.15]} rotation={[Math.PI/2, 0, 0]}><cylinderGeometry args={[0.1, 0.1, 0.02]}/><meshStandardMaterial color="#222"/></mesh>
        <mesh position={[0.2, 0.48, 0.15]} rotation={[Math.PI/2, 0, 0]}><cylinderGeometry args={[0.1, 0.1, 0.02]}/><meshStandardMaterial color="#222"/></mesh>
      </group>
    );
  }


  if (assetType === 'DetailedBed') {
    return (
      <group position={[0, 0.25 * scaleFactor, 0]} scale={[scaleFactor, scaleFactor, scaleFactor]}>
        <RoundedBox args={[2.3, 1.4, 0.15]} radius={0.05} position={[0, 0.7, -1.15]} castShadow receiveShadow>
          <meshStandardMaterial color="#445566" roughness={0.9} />
        </RoundedBox>
        <RoundedBox args={[2.2, 0.35, 2.3]} radius={0.02} position={[0, 0.05, 0.05]} castShadow receiveShadow material={woodMaterial} />
        <RoundedBox args={[2.0, 0.2, 2.2]} radius={0.05} position={[0, 0.3, 0.05]} castShadow receiveShadow material={fabricMaterial} />
        <RoundedBox args={[2.15, 0.2, 2.2]} radius={0.08} position={[0, 0.42, 0.05]} castShadow receiveShadow>
          <meshStandardMaterial color="#334455" roughness={0.9} />
        </RoundedBox>
        <RoundedBox args={[0.9, 0.45, 0.15]} radius={0.05} position={[-0.5, 0.6, -1.0]} rotation={[0.26, 0, 0]} castShadow material={fabricMaterial} />
        <RoundedBox args={[0.9, 0.45, 0.15]} radius={0.05} position={[0.5, 0.6, -1.0]} rotation={[0.26, 0, 0]} castShadow material={fabricMaterial} />
      </group>
    );
  }

  if (assetType === 'BlueDetailedBed') {
    return (
      <group position={[0, 0.25 * scaleFactor, 0]} scale={[scaleFactor, scaleFactor, scaleFactor]}>
        <RoundedBox args={[2.3, 1.4, 0.15]} radius={0.05} position={[0, 0.7, -1.15]} castShadow receiveShadow>
          <meshStandardMaterial color="#1e3a8a" roughness={0.9} />
        </RoundedBox>
        <RoundedBox args={[2.2, 0.35, 2.3]} radius={0.02} position={[0, 0.05, 0.05]} castShadow receiveShadow material={woodMaterial} />
        <RoundedBox args={[2.0, 0.2, 2.2]} radius={0.05} position={[0, 0.3, 0.05]} castShadow receiveShadow material={fabricMaterial} />
        <RoundedBox args={[2.15, 0.2, 2.2]} radius={0.08} position={[0, 0.42, 0.05]} castShadow receiveShadow>
          <meshStandardMaterial color="#1d4ed8" roughness={0.9} />
        </RoundedBox>
        <RoundedBox args={[0.9, 0.45, 0.15]} radius={0.05} position={[-0.5, 0.6, -1.0]} rotation={[0.26, 0, 0]} castShadow>
          <meshStandardMaterial color="#3b82f6" roughness={0.9} />
        </RoundedBox>
        <RoundedBox args={[0.9, 0.45, 0.15]} radius={0.05} position={[0.5, 0.6, -1.0]} rotation={[0.26, 0, 0]} castShadow>
          <meshStandardMaterial color="#3b82f6" roughness={0.9} />
        </RoundedBox>
      </group>
    );
  }

  if (assetType === 'Mirror') {
    return (
      <group position={[0, 1.2 * scaleFactor, 0]} scale={[scaleFactor, scaleFactor, scaleFactor]}>
        <RoundedBox args={[1.0, 2.0, 0.05]} radius={0.02} material={woodMaterial} receiveShadow castShadow />
        <mesh position={[0, 0, 0.03]} castShadow>
          <planeGeometry args={[0.9, 1.9]} />
          <meshStandardMaterial color="#eeeeee" metalness={1.0} roughness={0.0} />
        </mesh>
      </group>
    );
  }

  if (assetType === 'DressingTable') {
    return (
      <group position={[0, 0.225 * scaleFactor, 0]} scale={[scaleFactor, scaleFactor, scaleFactor]}>
        <RoundedBox args={[1.6, 0.15, 0.5]} radius={0.02} position={[0, 0.35, 0]} castShadow receiveShadow material={woodMaterial} />
        <RoundedBox args={[0.05, 0.75, 0.45]} radius={0.01} position={[-0.75, -0.05, 0]} castShadow receiveShadow material={woodMaterial} />
        <RoundedBox args={[0.05, 0.75, 0.45]} radius={0.01} position={[0.75, -0.05, 0]} castShadow receiveShadow material={woodMaterial} />
        <RoundedBox args={[0.9, 1.4, 0.05]} radius={0.05} position={[0, 1.2, -0.2]} castShadow receiveShadow>
          <meshStandardMaterial color="#1a1a1a" roughness={0.8} />
        </RoundedBox>
        <mesh position={[0, 1.2, -0.17]}>
          <planeGeometry args={[0.85, 1.35]} />
          <meshStandardMaterial color="#a0a0a0" roughness={0.05} metalness={0.9} />
        </mesh>
      </group>
    );
  }

  if (assetType === 'DressingStool') {
    return (
      <group position={[0, 0.2 * scaleFactor, 0]} scale={[scaleFactor, scaleFactor, scaleFactor]}>
        <RoundedBox args={[0.4, 0.4, 0.4]} radius={0.05} position={[0, -0.225, 0]} castShadow receiveShadow material={woodMaterial} />
        <RoundedBox args={[0.4, 0.1, 0.4]} radius={0.05} position={[0, 0.025, 0]} castShadow receiveShadow>
           <meshStandardMaterial color="#334455" roughness={0.9} />
        </RoundedBox>
      </group>
    );
  }

  if (assetType === 'ModernBench') {
    return (
      <group position={[0, 0.2 * scaleFactor, 0]} scale={[scaleFactor, scaleFactor, scaleFactor]}>
        <RoundedBox args={[1.8, 0.35, 0.5]} radius={0.05} position={[0, 0.2, 0]} castShadow receiveShadow>
          <meshStandardMaterial color="#334455" roughness={0.9} />
        </RoundedBox>
        {[-0.8, 0.8].map((lx) => (
          <mesh key={`bench-leg-${lx}`} position={[lx, 0.05, 0]} castShadow material={metalMaterial}>
             <boxGeometry args={[0.04, 0.1, 0.4]} />
          </mesh>
        ))}
      </group>
    );
  }

  if (assetType === 'BedsideLamp') {
    return (
      <group position={[0, 0.15 * scaleFactor, 0]} scale={[scaleFactor, scaleFactor, scaleFactor]}>
        <mesh position={[0, 0.01, 0]} castShadow material={metalMaterial}><cylinderGeometry args={[0.08, 0.08, 0.02]} /></mesh>
        <mesh position={[0, 0.15, 0]} castShadow material={metalMaterial}><cylinderGeometry args={[0.008, 0.01, 0.3]} /></mesh>
        <mesh position={[0, 0.3, 0]} castShadow>
          <cylinderGeometry args={[0.12, 0.15, 0.18, 32, 1, true]} />
          <meshStandardMaterial color="#ffffff" roughness={1} side={THREE.DoubleSide} />
        </mesh>
        <pointLight position={[0, 0.3, 0]} intensity={0.5} color="#FFD700" distance={3} />
      </group>
    );
  }

  if (assetType === 'WallSwitch') {
    return (
      <group position={[0, 0.1 * scaleFactor, 0]} scale={[scaleFactor, scaleFactor, scaleFactor]}>
        <RoundedBox args={[0.15, 0.25, 0.01]} radius={0.01} position={[0, 0, 0]}>
          <meshStandardMaterial color="#f0f0f0" roughness={0.3} />
        </RoundedBox>
        <RoundedBox args={[0.06, 0.1, 0.005]} radius={0.005} position={[0, 0, 0.005]}>
          <meshStandardMaterial color="#ffffff" roughness={0.1} />
        </RoundedBox>
      </group>
    );
  }

  if (assetType === 'DetailedToilet') {
    return (
      <group position={[0, 0.5 * scaleFactor, 0]} scale={[scaleFactor, scaleFactor, scaleFactor]}>
        <RoundedBox args={[0.4, 0.9, 0.2]} radius={0.02} position={[0, 0.45, -0.2]} castShadow receiveShadow material={ceramicMaterial} />
        <mesh position={[0, 0.88, 0]} material={metalMaterial}><cylinderGeometry args={[0.04, 0.04, 0.01]} /></mesh>
        <mesh position={[0, 0.225, 0.1]} castShadow receiveShadow material={ceramicMaterial}><cylinderGeometry args={[0.12, 0.16, 0.45, 32]} /></mesh>
        <mesh position={[0, 0.38, 0.3]} scale={[1, 0.6, 1.4]} castShadow material={ceramicMaterial}><sphereGeometry args={[0.22, 32, 32]} /></mesh>
        <mesh position={[0, 0.46, 0.3]} scale={[1, 0.08, 1.4]} castShadow><sphereGeometry args={[0.22, 32, 32]} /><meshStandardMaterial color="#f8f8f8" roughness={0.1} /></mesh>
      </group>
    );
  }

  if (assetType === 'BidetSprayer') {
    return (
      <group position={[0, 0.25 * scaleFactor, 0]} scale={[scaleFactor, scaleFactor, scaleFactor]}>
         <RoundedBox args={[0.06, 0.08, 0.02]} radius={0.005} position={[0, 0.45, -0.04]} material={metalMaterial} />
         <mesh position={[0, 0.48, 0]} rotation={[0.52, 0, 0]} castShadow material={metalMaterial}><cylinderGeometry args={[0.01, 0.015, 0.12]} /></mesh>
         <mesh position={[0, 0.53, 0.03]} rotation={[1.57, 0, 0]} castShadow material={metalMaterial}><cylinderGeometry args={[0.02, 0.02, 0.04]} /></mesh>
      </group>
    );
  }

  if (assetType === 'DetailedBathtub') {
    return (
      <group position={[0, 0.55 * scaleFactor, 0]} scale={[scaleFactor, scaleFactor, scaleFactor]}>
        <mesh scale={[1.4, 0.55, 0.85]} castShadow receiveShadow material={ceramicMaterial}>
          <sphereGeometry args={[1, 64, 32, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2]} />
        </mesh>
        <mesh rotation={[Math.PI/2, 0, 0]} scale={[1.35, 0.8, 1]} castShadow material={ceramicMaterial}>
          <torusGeometry args={[1, 0.06, 32, 128]} />
        </mesh>
      </group>
    );
  }

  if (assetType === 'DetailedVanity') {
    return (
      <group position={[0, 0.45 * scaleFactor, 0]} scale={[scaleFactor, scaleFactor, scaleFactor]}>
        <RoundedBox args={[2.2, 0.45, 0.5]} radius={0.02} position={[0, 0.625, 0]} castShadow receiveShadow>
          <meshStandardMaterial color="#1e1b18" roughness={0.6} />
        </RoundedBox>
        <RoundedBox args={[2.22, 0.06, 0.52]} radius={0.01} position={[0, 0.88, 0]} castShadow receiveShadow material={ceramicMaterial} />
        {[-0.6, 0.6].map(x => (
          <group key={`sink-${x}`}>
            <RoundedBox args={[0.6, 0.15, 0.35]} radius={0.05} position={[x, 0.82, 0.05]}>
              <meshStandardMaterial color="#111" roughness={0.8} />
            </RoundedBox>
            <mesh position={[x, 1.15, -0.2]} rotation={[Math.PI/2, 0, 0]} castShadow material={metalMaterial}><cylinderGeometry args={[0.012, 0.015, 0.2]} /></mesh>
          </group>
        ))}
        <RoundedBox args={[2.2, 1.3, 0.05]} radius={0.02} position={[0, 1.7, -0.2]} castShadow receiveShadow>
          <meshStandardMaterial color="#111" roughness={0.5} />
        </RoundedBox>
      </group>
    );
  }

  if (assetType === 'DetailedTowelRack') {
    return (
      <group position={[0, 0.3 * scaleFactor, 0]} scale={[scaleFactor, scaleFactor, scaleFactor]}>
         <mesh position={[0.25, 0, 0.025]} rotation={[Math.PI/2, 0, 0]} material={metalMaterial}><cylinderGeometry args={[0.005, 0.005, 0.05]} /></mesh>
         <mesh position={[-0.25, 0, 0.025]} rotation={[Math.PI/2, 0, 0]} material={metalMaterial}><cylinderGeometry args={[0.005, 0.005, 0.05]} /></mesh>
         <mesh position={[0, 0, 0.05]} rotation={[0, 0, Math.PI/2]} castShadow material={metalMaterial}><cylinderGeometry args={[0.01, 0.01, 0.6]} /></mesh>
         <mesh position={[0, -0.25, 0.06]} castShadow material={fabricMaterial}><planeGeometry args={[0.4, 0.5]} /></mesh>
      </group>
    );
  }

  if (assetType === 'DetailedIsland') {
    return (
      <group position={[0, 0.45 * scaleFactor, 0]} scale={[scaleFactor, scaleFactor, scaleFactor]}>
        <RoundedBox args={[2.5, 0.9, 1.2]} radius={0.02} position={[0, 0.45, 0]} castShadow receiveShadow material={woodMaterial} />
        <RoundedBox args={[2.6, 0.05, 1.3]} radius={0.01} position={[0, 0.925, 0]} castShadow receiveShadow material={ceramicMaterial} />
        <RoundedBox args={[0.8, 0.02, 0.5]} radius={0.005} position={[0, 0.955, 0]} castShadow>
           <meshStandardMaterial color="#0a0a0a" roughness={0.05} />
        </RoundedBox>
      </group>
    );
  }

  if (assetType === 'DetailedFridge') {
    return (
      <group position={[0, 1.075 * scaleFactor, 0]} scale={[scaleFactor, scaleFactor, scaleFactor]}>
        <RoundedBox args={[1.0, 2.15, 0.65]} radius={0.02} position={[0, 0, 0]} castShadow receiveShadow material={metalMaterial} />
        <RoundedBox args={[0.02, 0.7, 0.04]} radius={0.01} position={[-0.05, 0.125, 0.34]} castShadow material={metalMaterial} />
        <RoundedBox args={[0.02, 0.7, 0.04]} radius={0.01} position={[0.05, 0.125, 0.34]} castShadow material={metalMaterial} />
      </group>
    );
  }

  if (assetType === 'DetailedLowerCab') {
    return (
      <group position={[0, 0.44 * scaleFactor, 0]} scale={[scaleFactor, scaleFactor, scaleFactor]}>
        <RoundedBox args={[0.58, 0.88, 0.58]} radius={0.01} position={[0, 0, 0]} castShadow receiveShadow material={woodMaterial} />
        <RoundedBox args={[0.15, 0.015, 0.02]} radius={0.005} position={[0, 0.36, 0.3]} castShadow material={metalMaterial} />
      </group>
    );
  }

  if (assetType === 'DetailedUpperCab') {
    return (
      <group position={[0, 1.9 * scaleFactor, 0]} scale={[scaleFactor, scaleFactor, scaleFactor]}>
        <RoundedBox args={[0.58, 0.8, 0.35]} radius={0.01} position={[0, 0, 0]} castShadow receiveShadow material={woodMaterial} />
        <RoundedBox args={[0.15, 0.015, 0.02]} radius={0.005} position={[0, -0.35, 0.18]} castShadow material={metalMaterial} />
      </group>
    );
  }

  if (assetType === 'DetailedOven') {
    return (
      <group position={[0, 0.45 * scaleFactor, 0]} scale={[scaleFactor, scaleFactor, scaleFactor]}>
        <RoundedBox args={[0.58, 0.9, 0.58]} radius={0.01} position={[0, 0, 0]} castShadow receiveShadow>
           <meshStandardMaterial color="#111" roughness={0.2} />
        </RoundedBox>
        <RoundedBox args={[0.45, 0.4, 0.02]} radius={0.02} position={[0, -0.03, 0.3]} castShadow>
           <meshStandardMaterial color="#000" roughness={0.05} />
        </RoundedBox>
        <RoundedBox args={[0.4, 0.02, 0.03]} radius={0.01} position={[0, 0.22, 0.31]} castShadow material={metalMaterial} />
      </group>
    );
  }

  if (assetType === 'DetailedSink') {
    return (
      <group position={[0, 0.1 * scaleFactor, 0]} scale={[scaleFactor, scaleFactor, scaleFactor]}>
        <RoundedBox args={[0.7, 0.2, 0.4]} radius={0.05} position={[0, 0, 0]}>
          <meshStandardMaterial color="#e2e8f0" roughness={0.2} />
        </RoundedBox>
        <mesh position={[0, 0.25, -0.15]} castShadow material={metalMaterial}><cylinderGeometry args={[0.015, 0.02, 0.3]} /></mesh>
        <mesh position={[0, 0.4, -0.05]} rotation={[Math.PI/2, 0, 0]} castShadow material={metalMaterial}><cylinderGeometry args={[0.015, 0.015, 0.2]} /></mesh>
      </group>
    );
  }

  // Fallback for everything else (simple styled box)
  return (
    <group position={[0, 0.5 * scaleFactor, 0]} scale={[scaleFactor, scaleFactor, scaleFactor]}>
      <RoundedBox args={[1, 1, 1]} radius={0.02} material={woodMaterial} receiveShadow castShadow />
    </group>
  );
}
