import { useMemo, Suspense } from 'react';
import * as THREE from 'three';
import TileSurface3D from './TileSurface3D';
import { RoundedBox, MeshReflectorMaterial, PivotControls, useTexture } from '@react-three/drei';
import { useDesignStore } from '../store/useDesignStore';
import DraggableFurniture from './DraggableFurniture';
import RealFixture from './RealFixture';
import { TextureCache } from '../utils/TextureCache';

interface Props {
  roomType: string;
  designStyle: 1 | 2 | 3 | 4;
  selectedSurface: string | null;
  onSelectSurface: (id: string) => void;
  customFurniture?: string[];
}

function CustomFurniturePiece({ url, index }: { url: string, index: number }) {
  const texture = useTexture(url);
  const aspect = texture.image ? (texture.image as any).width / (texture.image as any).height : 1;
  
  return (
    <PivotControls 
      scale={0.5} 
      anchor={[0, -1, 0]} 
      activeAxes={[true, true, true]}
      depthTest={false}
    >
      <mesh castShadow position={[index * 0.5, 0.5, 0]}>
         <planeGeometry args={[1.5 * aspect, 1.5]} />
         <meshPhysicalMaterial map={texture} transparent alphaTest={0.1} side={THREE.DoubleSide} />
      </mesh>
    </PivotControls>
  );
}

// Minimalist proxy meshes for granular catalog

// Minimalist Modern Bed
function BedroomFurniture({ designStyle }: { designStyle: 1 | 2 | 3 | 4 }) {
  // Generate a dark elegant patterned fabric texture
  const darkFabricTexture = useMemo(() => TextureCache.getDarkFabric(), []);
  const plainFabricTexture = useMemo(() => TextureCache.getPlainFabric(), []);
  const lightPatternTexture = useMemo(() => TextureCache.getLightPattern(), []);
  const woodTexture = useMemo(() => TextureCache.getWood(), []);

  if (designStyle === 2) {
    return (
      <group position={[0, 0, -1.5]}>
        {/* Large Textured Rug under the bed */}
        <RoundedBox args={[3.2, 0.02, 3.5]} radius={0.01} position={[0, 0.01, 0.5]} castShadow receiveShadow>
           <meshPhysicalMaterial color="#e5e5e5" roughness={1.0} />
        </RoundedBox>

        {/* Mid-Century Modern Wooden Bed Frame */}
        <RoundedBox args={[2.3, 0.15, 2.4]} radius={0.02} position={[0, 0.4, 0]} castShadow receiveShadow>
          <meshPhysicalMaterial map={woodTexture} roughness={0.7} />
        </RoundedBox>
        {/* Angled Wooden Legs */}
        {[[-1.0, -1.0], [1.0, -1.0], [-1.0, 1.0], [1.0, 1.0]].map((pos, idx) => (
          <mesh key={`leg-${idx}`} position={[pos[0], 0.2, pos[1]]} rotation={[0, 0, pos[0] > 0 ? 0.1 : -0.1]} castShadow>
             <cylinderGeometry args={[0.03, 0.015, 0.4]} />
             <meshPhysicalMaterial map={woodTexture} roughness={0.8} />
          </mesh>
        ))}
        {/* Simple Wooden Headboard */}
        <RoundedBox args={[2.3, 0.8, 0.1]} radius={0.02} position={[0, 0.8, -1.15]} castShadow receiveShadow>
          <meshPhysicalMaterial map={woodTexture} roughness={0.7} />
        </RoundedBox>
        
        {/* Mattress & Bedding */}
        <RoundedBox args={[2.0, 0.2, 2.2]} radius={0.05} position={[0, 0.55, 0.05]} castShadow receiveShadow>
          <meshPhysicalMaterial map={plainFabricTexture} color="#ffffff" roughness={0.9} />
        </RoundedBox>
        
        {/* Professional Accent Throw Pillow (Navy/Slate) */}
        <RoundedBox args={[2.1, 0.15, 1.6]} radius={0.05} position={[0, 0.65, 0.35]} castShadow receiveShadow>
          <meshPhysicalMaterial color="#1e293b" roughness={0.9} /> {/* Elegant Navy Slate */}
        </RoundedBox>

        {/* Throw Blanket at Foot of Bed (Charcoal) */}
        <RoundedBox args={[2.1, 0.04, 0.6]} radius={0.02} position={[0, 0.75, 0.85]} castShadow receiveShadow>
          <meshPhysicalMaterial color="#334155" roughness={1.0} />
        </RoundedBox>

        {/* Retro Curved Nightstands */}
        {[[-1.5, -0.9], [1.5, -0.9]].map((pos, idx) => (
          <group key={`nightstand-${idx}`} position={[pos[0], 0, pos[1]]}>
            <RoundedBox args={[0.6, 0.3, 0.5]} radius={0.15} position={[0, 0.5, 0]} castShadow receiveShadow>
              <meshPhysicalMaterial map={woodTexture} roughness={0.7} />
            </RoundedBox>
            <mesh position={[-0.2, 0.25, -0.1]} rotation={[0, 0, 0.1]} castShadow>
               <cylinderGeometry args={[0.02, 0.01, 0.5]} />
               <meshPhysicalMaterial color="#111" />
            </mesh>
            <mesh position={[0.2, 0.25, -0.1]} rotation={[0, 0, -0.1]} castShadow>
               <cylinderGeometry args={[0.02, 0.01, 0.5]} />
               <meshPhysicalMaterial color="#111" />
            </mesh>
            <mesh position={[0, 0.25, 0.1]} rotation={[0.1, 0, 0]} castShadow>
               <cylinderGeometry args={[0.02, 0.01, 0.5]} />
               <meshPhysicalMaterial color="#111" />
            </mesh>
          </group>
        ))}

        {/* Tall Dresser (Left Wall) */}
        <group position={[-2.6, 0, 1.0]} rotation={[0, Math.PI / 2, 0]}>
          <RoundedBox args={[1.2, 1.4, 0.5]} radius={0.02} position={[0, 0.75, 0]} castShadow receiveShadow>
             <meshPhysicalMaterial map={woodTexture} roughness={0.8} />
          </RoundedBox>
          {/* Dresser Drawers */}
          {[0.3, 0.7, 1.1].map((y, idx) => (
            <group key={`drawer-${idx}`}>
              <RoundedBox args={[1.1, 0.35, 0.04]} radius={0.01} position={[0, y, 0.26]} castShadow receiveShadow>
                 <meshPhysicalMaterial color="#2d1c10" roughness={0.9} />
              </RoundedBox>
              <RoundedBox args={[0.3, 0.02, 0.02]} radius={0.01} position={[0, y, 0.29]} castShadow>
                 <meshPhysicalMaterial color="#d4af37" metalness={0.9} roughness={0.3} />
              </RoundedBox>
            </group>
          ))}
          {/* Legs */}
          {[-0.5, 0.5].map((x) => [-0.2, 0.2].map((z) => (
             <mesh key={`d-leg-${x}-${z}`} position={[x, 0.05, z]} castShadow>
                <cylinderGeometry args={[0.02, 0.01, 0.1]} />
                <meshPhysicalMaterial color="#111" />
             </mesh>
          )))}
        </group>

        {/* Big Sofa (Front Right) */}
        <group position={[2.0, 0, 2.5]} rotation={[0, -Math.PI/2, 0]}>
           {/* Sofa Seat */}
           <RoundedBox args={[1.8, 0.25, 0.7]} radius={0.05} position={[0, 0.35, 0]} castShadow receiveShadow>
              <meshPhysicalMaterial color="#57534e" roughness={0.9} />
           </RoundedBox>
           {/* Sofa Backrest */}
           <RoundedBox args={[1.8, 0.5, 0.2]} radius={0.05} position={[0, 0.65, -0.25]} castShadow receiveShadow>
              <meshPhysicalMaterial color="#57534e" roughness={0.9} />
           </RoundedBox>
           {/* Sofa Armrests */}
           <RoundedBox args={[0.15, 0.4, 0.7]} radius={0.05} position={[-0.825, 0.45, 0]} castShadow receiveShadow>
              <meshPhysicalMaterial color="#57534e" roughness={0.9} />
           </RoundedBox>
           <RoundedBox args={[0.15, 0.4, 0.7]} radius={0.05} position={[0.825, 0.45, 0]} castShadow receiveShadow>
              <meshPhysicalMaterial color="#57534e" roughness={0.9} />
           </RoundedBox>
           {/* Sofa Pillows */}
           <RoundedBox args={[0.4, 0.3, 0.12]} radius={0.05} position={[-0.5, 0.55, -0.1]} rotation={[0.1, 0.2, 0]} castShadow receiveShadow>
              <meshPhysicalMaterial color="#1e293b" roughness={0.9} /> {/* Navy Pillow */}
           </RoundedBox>
           <RoundedBox args={[0.4, 0.3, 0.12]} radius={0.05} position={[0.5, 0.55, -0.1]} rotation={[0.1, -0.2, 0]} castShadow receiveShadow>
              <meshPhysicalMaterial color="#e5e5e5" roughness={0.9} /> {/* Light Pillow */}
           </RoundedBox>
           {/* Sofa Legs */}
           {[[-0.8, -0.2], [0.8, -0.2], [-0.8, 0.2], [0.8, 0.2]].map((pos, idx) => (
             <mesh key={`sofa-leg-${idx}`} position={[pos[0], 0.1, pos[1]]} castShadow>
                <cylinderGeometry args={[0.02, 0.015, 0.2]} />
                <meshPhysicalMaterial color="#111" />
             </mesh>
           ))}
        </group>

        {/* Side Table beside the Sofa */}
        <group position={[2.0, 0, 1.3]}>
           {/* Table Top */}
           <mesh position={[0, 0.4, 0]} castShadow>
              <cylinderGeometry args={[0.3, 0.3, 0.04]} />
              <meshPhysicalMaterial color="#2d1c10" roughness={0.7} />
           </mesh>
           {/* Table Base */}
           <mesh position={[0, 0.2, 0]} castShadow>
              <cylinderGeometry args={[0.02, 0.15, 0.4]} />
              <meshPhysicalMaterial color="#d4af37" metalness={0.9} roughness={0.3} />
           </mesh>
        </group>

        {/* Tall Indoor Plant (Right Corner) */}
        <group position={[2.6, 0, -0.8]}>
           <mesh position={[0, 0.3, 0]} castShadow>
              <cylinderGeometry args={[0.25, 0.2, 0.6]} />
              <meshPhysicalMaterial color="#f8fafc" roughness={0.1} clearcoat={1} />
           </mesh>
           {/* Faux leaves */}
           {[0, 1, 2, 3, 4].map(i => (
              <mesh key={`leaf-${i}`} position={[0, 0.9 + i * 0.1, 0]} rotation={[0.3, i * 1.5, 0]} castShadow>
                 <cylinderGeometry args={[0.02, 0.02, 1.2]} />
                 <meshPhysicalMaterial color="#15803d" roughness={0.6} />
              </mesh>
           ))}
        </group>

        {/* Floor Lamp (Refined Brass) */}
        <group position={[2.6, 0, 1.8]}>
           <mesh position={[0, 0.8, 0]} castShadow>
              <cylinderGeometry args={[0.015, 0.02, 1.6]} />
              <meshPhysicalMaterial color="#b45309" metalness={0.9} roughness={0.2} /> {/* Antique brass */}
           </mesh>
           <mesh position={[0, 1.6, 0]} rotation={[Math.PI, 0, 0]} castShadow>
              <coneGeometry args={[0.25, 0.4, 32]} />
              <meshPhysicalMaterial color="#f8fafc" roughness={1.0} />
           </mesh>
           <mesh position={[0, 1.5, 0]}>
              <sphereGeometry args={[0.1]} />
              <meshBasicMaterial color="#fef08a" />
           </mesh>
           <pointLight position={[0, 1.2, 0]} intensity={0.4} color="#fef08a" distance={4} />
        </group>
      </group>
    );
  }

  if (designStyle === 3) {
    return (
      <group position={[0, 0, -1.8]}>
        {/* Luxury Hotel Oversized Tufted Headboard */}
        <group position={[0, 1.4, -1.15]}>
           <RoundedBox args={[5.8, 2.8, 0.2]} radius={0.05} position={[0, 0, 0]} castShadow receiveShadow>
             <meshPhysicalMaterial color="#1e293b" roughness={0.9} />
           </RoundedBox>
           {/* Tufted pattern simulation */}
           {[-2, -1, 0, 1, 2].map((x) => (
             [-1, 0, 1].map((y) => (
               <mesh key={`tuft-${x}-${y}`} position={[x, y * 0.8, 0.1]}>
                  <sphereGeometry args={[0.03]} />
                  <meshPhysicalMaterial color="#0f172a" />
               </mesh>
             ))
           ))}
        </group>

        {/* Box Spring / Base */}
        <RoundedBox args={[2.2, 0.4, 2.2]} radius={0.02} position={[0, 0.2, 0.0]} castShadow receiveShadow>
          <meshPhysicalMaterial color="#0f172a" roughness={0.9} />
        </RoundedBox>
        
        {/* Mattress (Visible near pillows) */}
        <RoundedBox args={[2.2, 0.25, 2.2]} radius={0.05} position={[0, 0.525, 0.0]} castShadow receiveShadow>
          <meshPhysicalMaterial color="#ffffff" roughness={0.9} />
        </RoundedBox>

        {/* Fluffy Duvet (Wraps over the mattress from the foot of the bed up to the pillows) */}
        <RoundedBox args={[2.24, 0.27, 1.6]} radius={0.05} position={[0, 0.535, 0.31]} castShadow receiveShadow>
          <meshPhysicalMaterial color="#f8fafc" roughness={0.8} />
        </RoundedBox>

        {/* Throw Blanket (Folded flat across the foot of the bed) */}
        <RoundedBox args={[2.26, 0.04, 0.6]} radius={0.02} position={[0, 0.69, 0.8]} castShadow receiveShadow>
          <meshPhysicalMaterial color="#475569" roughness={1.0} />
        </RoundedBox>

        {/* Euro Pillows (Standing up against the headboard) */}
        {[-0.6, 0, 0.6].map((x) => (
          <RoundedBox key={`euro-${x}`} args={[0.55, 0.55, 0.15]} radius={0.05} position={[x, 0.9, -0.95]} rotation={[0.1, 0, 0]} castShadow>
            <meshPhysicalMaterial color="#334155" roughness={0.9} />
          </RoundedBox>
        ))}
        {/* Sleeping Pillows (Laying flat) */}
        {[-0.4, 0.4].map((x) => (
          <RoundedBox key={`sleep-${x}`} args={[0.7, 0.15, 0.45]} radius={0.05} position={[x, 0.725, -0.65]} rotation={[0.05, 0, 0]} castShadow>
            <meshPhysicalMaterial color="#ffffff" roughness={0.9} />
          </RoundedBox>
        ))}

        {/* Elegant Suspended Pendant Lights */}
        {[-1.6, 1.6].map((x, idx) => (
          <group key={`pendant-${idx}`} position={[x, 4.5, -0.8]}>
             <mesh position={[0, -1.25, 0]}>
                <cylinderGeometry args={[0.005, 0.005, 2.5]} />
                <meshPhysicalMaterial color="#d4af37" />
             </mesh>
             <mesh position={[0, -2.5, 0]} castShadow>
                <cylinderGeometry args={[0.08, 0.08, 0.3, 32]} />
                <meshPhysicalMaterial color="#d4af37" metalness={0.9} roughness={0.2} />
             </mesh>
             <mesh position={[0, -2.7, 0]}>
                <sphereGeometry args={[0.06]} />
                <meshBasicMaterial color="#fef08a" />
             </mesh>
             {/* Nightstand Glow */}
             <pointLight position={[0, -2.8, 0]} intensity={0.5} color="#ffeacc" distance={3} />
          </group>
        ))}

        {/* Built-in Nightstand Ledges */}
        {[-1.6, 1.6].map((x, idx) => (
          <RoundedBox key={`ledge-${idx}`} args={[0.8, 0.1, 0.5]} radius={0.02} position={[x, 0.6, -0.8]} castShadow receiveShadow>
            <meshPhysicalMaterial color="#0f172a" roughness={0.7} />
          </RoundedBox>
        ))}

        {/* Decorative Vase on Left Ledge (Scandi Chic Theme) */}
        <group position={[-1.6, 0.65, -0.8]}>
           <mesh position={[0, 0.1, 0]} castShadow>
              <cylinderGeometry args={[0.03, 0.06, 0.2, 32]} />
              <meshPhysicalMaterial color="#fef08a" metalness={0.2} roughness={0.1} clearcoat={1} />
           </mesh>
           {/* Simple flower stem */}
           <mesh position={[0, 0.25, 0]} rotation={[0, 0, 0.1]} castShadow>
              <cylinderGeometry args={[0.005, 0.005, 0.2]} />
              <meshPhysicalMaterial color="#1e293b" roughness={0.8} />
           </mesh>
         </group>

        {/* Scandi Chic Dresser (Right Wall) */}
        <group position={[2.8, 0, 0]} rotation={[0, -Math.PI/2, 0]}>
           <RoundedBox args={[1.6, 0.9, 0.5]} radius={0.02} position={[0, 0.45, 0]} castShadow receiveShadow>
              <meshPhysicalMaterial color="#0f172a" roughness={0.7} />
           </RoundedBox>
           {/* Wooden Top */}
           <RoundedBox args={[1.62, 0.05, 0.52]} radius={0.01} position={[0, 0.925, 0]} castShadow>
              <meshPhysicalMaterial map={woodTexture} roughness={0.8} />
           </RoundedBox>
           {/* Drawers */}
           {[-0.4, 0.4].map(x => [0.25, 0.6].map(y => (
             <group key={`d-drawer-${x}-${y}`}>
               <RoundedBox args={[0.7, 0.3, 0.02]} radius={0.01} position={[x, y, 0.25]} castShadow>
                  <meshPhysicalMaterial color="#1e293b" roughness={0.8} />
               </RoundedBox>
               <mesh position={[x, y, 0.27]} castShadow rotation={[0, 0, Math.PI/2]}>
                  <cylinderGeometry args={[0.01, 0.01, 0.15]} />
                  <meshPhysicalMaterial color="#d4af37" metalness={0.9} roughness={0.2} />
               </mesh>
             </group>
           )))}
        </group>

        {/* Cozy Plush Rug */}
        <RoundedBox args={[4.0, 0.05, 3.5]} radius={0.02} position={[0, 0.025, 0.5]} receiveShadow>
           <meshPhysicalMaterial color="#e2e8f0" roughness={1.0} />
        </RoundedBox>

        {/* Comfortable Armchair */}
        <group position={[2.2, 0, 2.0]} rotation={[0, -Math.PI/4, 0]}>
           <RoundedBox args={[0.8, 0.4, 0.7]} radius={0.05} position={[0, 0.2, 0]} castShadow>
              <meshPhysicalMaterial color="#334155" roughness={0.9} />
           </RoundedBox>
           <RoundedBox args={[0.8, 0.6, 0.2]} radius={0.05} position={[0, 0.6, -0.25]} castShadow>
              <meshPhysicalMaterial color="#334155" roughness={0.9} />
           </RoundedBox>
        </group>

        {/* Minimalist Potted Plant */}
        <group position={[2.2, 0, -1.8]}>
           <mesh position={[0, 0.3, 0]} castShadow>
              <cylinderGeometry args={[0.2, 0.15, 0.6]} />
              <meshPhysicalMaterial color="#f8fafc" roughness={0.9} />
           </mesh>
           <mesh position={[0, 0.8, 0]} castShadow>
              <sphereGeometry args={[0.4, 16, 16]} />
              <meshPhysicalMaterial color="#4ade80" roughness={0.8} />
           </mesh>
        </group>
      </group>
    );
  }

  if (designStyle === 4) {
    return (
      <group position={[0, 0, 0]}>
        {/* Bed Group (Left Wall) */}
        <group position={[-1.85, 0, 0]} rotation={[0, Math.PI/2, 0]}>
           {/* Classic Headboard Base (Curved top removed) */}
           <RoundedBox args={[2.4, 0.8, 0.1]} radius={0.02} position={[0, 0.4, -1.15]} castShadow receiveShadow>
              <meshPhysicalMaterial map={woodTexture} roughness={0.7} />
           </RoundedBox>
           
           {/* Box Spring / Base */}
           <RoundedBox args={[2.2, 0.35, 2.2]} radius={0.02} position={[0, 0.175, 0.05]} castShadow receiveShadow>
             <meshPhysicalMaterial map={woodTexture} roughness={0.8} />
           </RoundedBox>
           
           {/* Mattress (White) */}
           <RoundedBox args={[2.1, 0.2, 2.1]} radius={0.05} position={[0, 0.45, 0.05]} castShadow receiveShadow>
             <meshPhysicalMaterial map={lightPatternTexture} color="#ffffff" roughness={0.9} />
           </RoundedBox>

           {/* Brown Throw Blanket */}
           <RoundedBox args={[2.15, 0.05, 0.7]} radius={0.02} position={[0, 0.58, 0.7]} castShadow receiveShadow>
             <meshPhysicalMaterial map={darkFabricTexture} color="#8b5a2b" roughness={0.9} />
           </RoundedBox>

           {/* White Pillows */}
           <RoundedBox args={[0.8, 0.15, 0.5]} radius={0.05} position={[-0.5, 0.6, -0.7]} rotation={[0.1, 0, 0]} castShadow>
             <meshPhysicalMaterial map={plainFabricTexture} color="#ffffff" roughness={0.9} />
           </RoundedBox>
           <RoundedBox args={[0.8, 0.15, 0.5]} radius={0.05} position={[0.5, 0.6, -0.7]} rotation={[0.1, 0, 0]} castShadow>
             <meshPhysicalMaterial map={plainFabricTexture} color="#ffffff" roughness={0.9} />
           </RoundedBox>

           {/* Brown Accent Pillows */}
           <RoundedBox args={[0.4, 0.3, 0.15]} radius={0.05} position={[-0.3, 0.65, -0.4]} rotation={[0.2, 0.1, 0]} castShadow>
             <meshPhysicalMaterial color="#8b5a2b" roughness={0.9} />
           </RoundedBox>
           <RoundedBox args={[0.4, 0.3, 0.15]} radius={0.05} position={[0.3, 0.65, -0.4]} rotation={[0.2, -0.1, 0]} castShadow>
             <meshPhysicalMaterial color="#8b5a2b" roughness={0.9} />
           </RoundedBox>

           {/* White Nightstands */}
           {[[-1.5, -0.9], [1.5, -0.9]].map((pos, idx) => (
             <group key={`nightstand-${idx}`} position={[pos[0], 0, pos[1]]}>
               <RoundedBox args={[0.6, 0.5, 0.5]} radius={0.02} position={[0, 0.25, 0]} castShadow receiveShadow>
                 <meshPhysicalMaterial map={woodTexture} roughness={0.7} />
               </RoundedBox>
               {/* Drawers */}
               {[0.15, 0.35].map(y => (
                 <group key={`drawer-${y}`}>
                   <RoundedBox args={[0.5, 0.15, 0.02]} radius={0.01} position={[0, y, 0.25]} castShadow>
                      <meshPhysicalMaterial map={woodTexture} roughness={0.8} />
                   </RoundedBox>
                   <mesh position={[0, y, 0.27]} castShadow>
                      <sphereGeometry args={[0.02]} />
                      <meshPhysicalMaterial color="#d4af37" metalness={0.9} roughness={0.2} />
                   </mesh>
                 </group>
               ))}
               {/* Classic Table Lamp */}
               <mesh position={[0, 0.5, 0]} castShadow>
                  <cylinderGeometry args={[0.02, 0.06, 0.3]} />
                  <meshPhysicalMaterial color="#d4af37" metalness={0.9} roughness={0.2} />
               </mesh>
               <mesh position={[0, 0.7, 0]} castShadow>
                  <cylinderGeometry args={[0.15, 0.2, 0.2, 32, 1, true]} />
                  {/* Glowing Lampshade */}
                  <meshPhysicalMaterial color="#ffffff" emissive="#ffeacc" emissiveIntensity={0.5} roughness={1} side={THREE.DoubleSide} />
               </mesh>
               {/* Stronger light source */}
               <pointLight position={[0, 0.7, 0]} intensity={1.5} color="#ffeacc" distance={3} decay={2} />
               <mesh position={[0, 0.6, 0]}>
                  <sphereGeometry args={[0.03]} />
                  <meshBasicMaterial color="#ffffff" />
               </mesh>
             </group>
           ))}
        </group>

        {/* Dresser (Right Wall) */}
        <group position={[2.75, 0, -0.2]} rotation={[0, -Math.PI/2, 0]}>
           <RoundedBox args={[1.4, 0.8, 0.5]} radius={0.02} position={[0, 0.4, 0]} castShadow receiveShadow>
              <meshPhysicalMaterial map={woodTexture} roughness={0.7} />
           </RoundedBox>
           {/* 6 Drawers */}
           {[-0.35, 0.35].map(x => [0.25, 0.5, 0.75].map(y => (
             <group key={`d-drawer-${x}-${y}`}>
               <RoundedBox args={[0.6, 0.2, 0.02]} radius={0.01} position={[x, y, 0.25]} castShadow>
                  <meshPhysicalMaterial map={woodTexture} roughness={0.8} />
               </RoundedBox>
               <mesh position={[x - 0.1, y, 0.27]} castShadow>
                  <sphereGeometry args={[0.02]} />
                  <meshPhysicalMaterial color="#d4af37" metalness={0.9} roughness={0.2} />
               </mesh>
               <mesh position={[x + 0.1, y, 0.27]} castShadow>
                  <sphereGeometry args={[0.02]} />
                  <meshPhysicalMaterial color="#d4af37" metalness={0.9} roughness={0.2} />
               </mesh>
             </group>
           )))}
        </group>

        {/* Vanity Table (Right Wall) */}
        <group position={[2.8, 0, 1.2]} rotation={[0, -Math.PI/2, 0]}>
           {/* Table */}
           <RoundedBox args={[1.0, 0.15, 0.4]} radius={0.02} position={[0, 0.7, 0]} castShadow receiveShadow>
              <meshPhysicalMaterial map={woodTexture} roughness={0.7} />
           </RoundedBox>
           {/* Legs */}
           {[-0.4, 0.4].map(x => [-0.1, 0.1].map(z => (
              <mesh key={`v-leg-${x}-${z}`} position={[x, 0.35, z]} castShadow>
                 <cylinderGeometry args={[0.02, 0.01, 0.7]} />
                 <meshPhysicalMaterial map={woodTexture} />
              </mesh>
           )))}
           {/* Oval Mirror */}
           <mesh position={[0, 1.15, -0.15]} rotation={[Math.PI/2, 0, 0]} castShadow>
              <cylinderGeometry args={[0.3, 0.3, 0.05, 32]} />
              <meshPhysicalMaterial color="#f8fafc" />
           </mesh>
           <mesh position={[0, 1.15, -0.12]} rotation={[Math.PI/2, 0, 0]}>
              <cylinderGeometry args={[0.27, 0.27, 0.02, 32]} />
              <MeshReflectorMaterial resolution={1024} mirror={1} mixStrength={1.5} roughness={0.02} color="#a0a0a0" />
           </mesh>
           {/* Stool */}
           <group position={[0, 0, 0.4]}>
              <mesh position={[0, 0.2, 0]} castShadow>
                 <cylinderGeometry args={[0.15, 0.15, 0.05]} />
                 <meshPhysicalMaterial color="#f8fafc" roughness={0.8} />
              </mesh>
              <mesh position={[0, 0.25, 0]} castShadow>
                 <cylinderGeometry args={[0.15, 0.15, 0.05]} />
                 <meshPhysicalMaterial color="#8b5a2b" roughness={0.9} />
              </mesh>
              {/* Stool Legs */}
              {[-0.1, 0.1].map(x => [-0.1, 0.1].map(z => (
                 <mesh key={`s-leg-${x}-${z}`} position={[x, 0.1, z]} castShadow>
                    <cylinderGeometry args={[0.015, 0.01, 0.2]} />
                    <meshPhysicalMaterial color="#d4af37" metalness={0.9} roughness={0.2} />
                 </mesh>
              )))}
           </group>
        </group>

        {/* Chandelier (Center) */}
        <group position={[0, 2.0, 0]}>
           <mesh position={[0, 0.75, 0]} castShadow>
              <cylinderGeometry args={[0.02, 0.02, 1.5]} />
              <meshPhysicalMaterial color="#d4af37" metalness={0.9} roughness={0.2} />
           </mesh>
           <mesh position={[0, 0, 0]} castShadow>
              <sphereGeometry args={[0.1]} />
              <meshPhysicalMaterial color="#d4af37" metalness={0.9} roughness={0.2} />
           </mesh>
           {/* Arms and Shades */}
           {[0, Math.PI/2, Math.PI, Math.PI*1.5].map((angle, i) => (
             <group key={`arm-${i}`} rotation={[0, angle, 0]}>
                <mesh position={[0.25, 0.1, 0]} rotation={[0, 0, -Math.PI/4]} castShadow>
                   <cylinderGeometry args={[0.01, 0.01, 0.4]} />
                   <meshPhysicalMaterial color="#d4af37" metalness={0.9} roughness={0.2} />
                </mesh>
                <mesh position={[0.4, 0.25, 0]} castShadow>
                   <cylinderGeometry args={[0.08, 0.12, 0.15, 32, 1, true]} />
                   <meshPhysicalMaterial color="#ffffff" emissive="#ffeacc" emissiveIntensity={0.2} roughness={1} side={THREE.DoubleSide} />
                </mesh>
                <pointLight position={[0.4, 0.25, 0]} intensity={0.5} color="#ffeacc" distance={3} decay={2} />
             </group>
           ))}
        </group>
      </group>
    );
  }

  // Design 1 (Original)
  return (
    <group position={[0, 0.2, -1.8]}>
      {/* Tall Elegant Headboard */}
      <RoundedBox args={[2.3, 1.4, 0.15]} radius={0.05} smoothness={4} position={[0, 0.7, -1.15]} castShadow receiveShadow>
        <meshPhysicalMaterial map={darkFabricTexture} roughness={0.9} color="#ffffff" />
      </RoundedBox>

      {/* Bed Base */}
      <RoundedBox args={[2.2, 0.35, 2.3]} radius={0.02} smoothness={4} position={[0, 0.05, 0.05]} castShadow receiveShadow>
        <meshPhysicalMaterial map={woodTexture} roughness={0.8} />
      </RoundedBox>
      
      {/* Base Mattress (Fitted Sheet) */}
      <RoundedBox args={[2.0, 0.2, 2.2]} radius={0.05} smoothness={4} position={[0, 0.3, 0.05]} castShadow receiveShadow>
        <meshPhysicalMaterial map={lightPatternTexture} color="#ffffff" roughness={0.9} />
      </RoundedBox>

      {/* Overhanging Duvet / Comforter */}
      <RoundedBox args={[2.15, 0.2, 2.2]} radius={0.08} smoothness={4} position={[0, 0.42, 0.05]} castShadow receiveShadow>
        <meshPhysicalMaterial map={darkFabricTexture} roughness={0.9} color="#ffffff" />
      </RoundedBox>

      {/* Sleeping Pillows (Leaning against headboard) */}
      <RoundedBox args={[0.9, 0.45, 0.15]} radius={0.05} smoothness={4} position={[-0.5, 0.6, -1.0]} rotation={[Math.PI / 12, 0, 0]} castShadow>
        <meshPhysicalMaterial map={lightPatternTexture} color="#ffffff" roughness={0.9} />
      </RoundedBox>
      <RoundedBox args={[0.9, 0.45, 0.15]} radius={0.05} smoothness={4} position={[0.5, 0.6, -1.0]} rotation={[Math.PI / 12, 0, 0]} castShadow>
        <meshPhysicalMaterial map={lightPatternTexture} color="#ffffff" roughness={0.9} />
      </RoundedBox>

      {/* Decorative Pillows (Patterned, Leaning against sleeping pillows) */}
      <RoundedBox args={[0.6, 0.35, 0.15]} radius={0.05} smoothness={4} position={[-0.4, 0.55, -0.85]} rotation={[Math.PI / 8, 0, Math.PI / 32]} castShadow>
        <meshPhysicalMaterial map={darkFabricTexture} roughness={0.9} color="#ffffff" />
      </RoundedBox>
      <RoundedBox args={[0.6, 0.35, 0.15]} radius={0.05} smoothness={4} position={[0.4, 0.55, -0.85]} rotation={[Math.PI / 8, 0, -Math.PI / 32]} castShadow>
        <meshPhysicalMaterial map={darkFabricTexture} roughness={0.9} color="#ffffff" />
      </RoundedBox>

      {/* Nightstands (Side Tables) - Realistic with legs */}
      {[[-1.4, -0.9], [1.4, -0.9]].map((pos, idx) => (
        <group key={idx} position={[pos[0], -0.2, pos[1]]}>
          {/* Main Body with Drawer */}
          <RoundedBox args={[0.55, 0.25, 0.5]} radius={0.02} smoothness={4} position={[0, 0.3, 0]} castShadow receiveShadow>
            <meshPhysicalMaterial map={woodTexture} roughness={0.8} />
          </RoundedBox>
          <RoundedBox args={[0.5, 0.2, 0.02]} radius={0.01} smoothness={4} position={[0, 0.3, 0.25]} castShadow>
             <meshPhysicalMaterial color="#2d1c10" roughness={0.9} />
          </RoundedBox>
          {/* Subtle metal drawer pull */}
          <RoundedBox args={[0.1, 0.02, 0.02]} radius={0.01} smoothness={4} position={[0, 0.3, 0.27]} castShadow>
             <meshPhysicalMaterial color="#d4af37" metalness={1} roughness={0.2} />
          </RoundedBox>
          {/* 4 Metal Legs */}
          {[-0.2, 0.2].map(lx => [-0.15, 0.15].map(lz => (
             <mesh key={`${lx}-${lz}`} position={[lx, 0.08, lz]} castShadow>
               <cylinderGeometry args={[0.015, 0.005, 0.16]} />
               <meshPhysicalMaterial color="#111" metalness={0.8} roughness={0.3} />
             </mesh>
          )))}
        </group>
      ))}

      {/* Bedside Lamps - High-end modern design */}
      {[[-1.4, -0.9], [1.4, -0.9]].map((pos, idx) => (
        <group key={idx} position={[pos[0], 0.225, pos[1]]}>
          {/* Base */}
          <mesh position={[0, 0.01, 0]} castShadow>
            <cylinderGeometry args={[0.08, 0.08, 0.02]} />
            <meshPhysicalMaterial color="#d4af37" metalness={1} roughness={0.2} />
          </mesh>
          {/* Stem */}
          <mesh position={[0, 0.15, 0]} castShadow>
            <cylinderGeometry args={[0.008, 0.01, 0.3]} />
            <meshPhysicalMaterial color="#d4af37" metalness={1} roughness={0.2} />
          </mesh>
          {/* Fabric Shade */}
          <mesh position={[0, 0.3, 0]} castShadow>
            <cylinderGeometry args={[0.12, 0.15, 0.18, 32, 1, true]} />
            <meshPhysicalMaterial map={plainFabricTexture} color="#ffffff" roughness={1} side={THREE.DoubleSide} />
          </mesh>
          {/* Glowing Bulb inside */}
          <mesh position={[0, 0.3, 0]}>
             <sphereGeometry args={[0.03]} />
             <meshBasicMaterial color="#FFB600" />
          </mesh>
          <pointLight position={[0, 0.3, 0]} intensity={0.5} color="#FFD700" distance={3} />
          <pointLight position={[0, -0.1, 0]} intensity={0.2} color="#FFD700" distance={1.5} />
        </group>
      ))}

      {/* Wall Switch Board */}
      <group position={[1.4, 0.9, -1.18]}>
        <RoundedBox args={[0.15, 0.25, 0.01]} radius={0.01} smoothness={2} position={[0, 0, 0]}>
          <meshPhysicalMaterial color="#f0f0f0" roughness={0.3} clearcoat={0.5} />
        </RoundedBox>
        <RoundedBox args={[0.06, 0.1, 0.005]} radius={0.005} position={[0, 0, 0.005]}>
          <meshPhysicalMaterial color="#ffffff" roughness={0.1} />
        </RoundedBox>
      </group>

      {/* Modern Bench / Sofa at foot of bed */}
      <group position={[0, 0, 1.4]}>
        <RoundedBox args={[1.8, 0.35, 0.5]} radius={0.05} smoothness={4} position={[0, 0.2, 0]} castShadow receiveShadow>
          <meshPhysicalMaterial map={darkFabricTexture} color="#ffffff" roughness={0.9} />
        </RoundedBox>
        {/* Metal Legs for Bench */}
        {[-0.8, 0.8].map((lx) => (
          <mesh key={`bench-leg-${lx}`} position={[lx, 0.05, 0]} castShadow>
             <boxGeometry args={[0.04, 0.1, 0.4]} />
             <meshPhysicalMaterial color="#111" metalness={0.8} roughness={0.3} />
          </mesh>
        ))}
      </group>

      {/* Dressing Table (Placed flush against Left Wall) */}
      <group position={[-2.75, 0.225, 1.8]} rotation={[0, Math.PI / 2, 0]}>
        {/* Main Table Body */}
        <RoundedBox args={[1.6, 0.15, 0.5]} radius={0.02} smoothness={4} position={[0, 0.35, 0]} castShadow receiveShadow>
          <meshPhysicalMaterial map={woodTexture} roughness={0.8} />
        </RoundedBox>
        {/* Legs */}
        <RoundedBox args={[0.05, 0.75, 0.45]} radius={0.01} smoothness={4} position={[-0.75, -0.05, 0]} castShadow receiveShadow>
          <meshPhysicalMaterial map={woodTexture} roughness={0.8} />
        </RoundedBox>
        <RoundedBox args={[0.05, 0.75, 0.45]} radius={0.01} smoothness={4} position={[0.75, -0.05, 0]} castShadow receiveShadow>
          <meshPhysicalMaterial map={woodTexture} roughness={0.8} />
        </RoundedBox>
        {/* Tall Modern Mirror Frame */}
        <RoundedBox args={[0.9, 1.4, 0.05]} radius={0.05} smoothness={4} position={[0, 1.2, -0.2]} castShadow receiveShadow>
          <meshPhysicalMaterial color="#1a1a1a" roughness={0.8} />
        </RoundedBox>
        {/* Stool */}
        <RoundedBox args={[0.4, 0.4, 0.4]} radius={0.05} smoothness={4} position={[0, -0.225, 0.4]} castShadow receiveShadow>
           <meshPhysicalMaterial map={woodTexture} roughness={0.8} />
        </RoundedBox>
        {/* Stool Cushion */}
        <RoundedBox args={[0.4, 0.1, 0.4]} radius={0.05} smoothness={4} position={[0, 0.025, 0.4]} castShadow receiveShadow>
           <meshPhysicalMaterial map={darkFabricTexture} roughness={0.9} color="#ffffff" />
        </RoundedBox>
      </group>

      {/* Actual Mirror Surface (Moved OUT of rotated group to fix Drei Reflector bug) */}
      <mesh position={[-2.92, 1.425, 1.8]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[0.85, 1.35]} />
        <MeshReflectorMaterial 
          resolution={2048} 
          mirror={1} 
          mixBlur={0} 
          mixStrength={1.5} 
          roughness={0} 
          color="#ffffff" 
          metalness={1} 
        />
      </mesh>
    </group>
  );
}

// Ultra-Luxury Bathroom
function BathroomFurniture({ designStyle }: { designStyle: 1 | 2 | 3 | 4 }) {
  // Generate a stunning Terrazzo texture for Design 4

  const oakTexture = useMemo(() => TextureCache.getOak(), []);
  const stoneTexture = useMemo(() => TextureCache.getStone(), []);

  if (designStyle === 2) {
    return (
      <group>
        {/* Massive Built-in Tub (Back Left Corner) */}
        <group position={[-1.7, 0, -1.7]}>
           {/* Tub Walls (Dark Matte Slate) */}
           {/* Front Wall */}
           <RoundedBox args={[2.0, 0.6, 0.2]} radius={0.02} position={[0, 0.3, 0.9]} castShadow receiveShadow>
              <meshPhysicalMaterial color="#27272a" roughness={0.6} />
           </RoundedBox>
           {/* Back Wall */}
           <RoundedBox args={[2.0, 0.6, 0.2]} radius={0.02} position={[0, 0.3, -0.9]} castShadow receiveShadow>
              <meshPhysicalMaterial color="#27272a" roughness={0.6} />
           </RoundedBox>
           {/* Left Wall */}
           <RoundedBox args={[0.2, 0.6, 1.6]} radius={0.02} position={[-0.9, 0.3, 0]} castShadow receiveShadow>
              <meshPhysicalMaterial color="#27272a" roughness={0.6} />
           </RoundedBox>
           {/* Right Wall */}
           <RoundedBox args={[0.2, 0.6, 1.6]} radius={0.02} position={[0.9, 0.3, 0]} castShadow receiveShadow>
              <meshPhysicalMaterial color="#27272a" roughness={0.6} />
           </RoundedBox>
           
           {/* Tub Inner Floor (White Ceramic) */}
           <mesh position={[0, 0.05, 0]} rotation={[-Math.PI/2, 0, 0]} receiveShadow>
              <planeGeometry args={[1.6, 1.6]} />
              <meshPhysicalMaterial color="#ffffff" roughness={0.05} metalness={0.1} clearcoat={1} clearcoatRoughness={0.02} />
           </mesh>
           
           {/* Tub Inner Walls (White Ceramic) */}
           <mesh position={[0, 0.3, -0.79]} rotation={[0, 0, 0]} receiveShadow>
              <planeGeometry args={[1.6, 0.5]} />
              <meshPhysicalMaterial color="#ffffff" roughness={0.05} metalness={0.1} clearcoat={1} clearcoatRoughness={0.02} />
           </mesh>
           <mesh position={[0, 0.3, 0.79]} rotation={[0, Math.PI, 0]} receiveShadow>
              <planeGeometry args={[1.6, 0.5]} />
              <meshPhysicalMaterial color="#ffffff" roughness={0.05} metalness={0.1} clearcoat={1} clearcoatRoughness={0.02} />
           </mesh>
           <mesh position={[-0.79, 0.3, 0]} rotation={[0, Math.PI/2, 0]} receiveShadow>
              <planeGeometry args={[1.6, 0.5]} />
              <meshPhysicalMaterial color="#ffffff" roughness={0.05} metalness={0.1} clearcoat={1} clearcoatRoughness={0.02} />
           </mesh>
           <mesh position={[0.79, 0.3, 0]} rotation={[0, -Math.PI/2, 0]} receiveShadow>
              <planeGeometry args={[1.6, 0.5]} />
              <meshPhysicalMaterial color="#ffffff" roughness={0.05} metalness={0.1} clearcoat={1} clearcoatRoughness={0.02} />
           </mesh>

           {/* Water Surface */}
           <mesh position={[0, 0.45, 0]} rotation={[-Math.PI/2, 0, 0]}>
              <planeGeometry args={[1.6, 1.6]} />
              <meshPhysicalMaterial color="#38bdf8" transmission={0.9} opacity={0.7} transparent roughness={0.1} />
           </mesh>
           {/* Tub Faucet (Attached to the ledge) */}
           <group position={[0.85, 0.605, 0]}>
              {/* Vertical Base Pipe */}
              <mesh position={[0, 0.075, 0]} castShadow>
                 <cylinderGeometry args={[0.025, 0.025, 0.15]} />
                 <meshPhysicalMaterial color="#ffffff" metalness={1} roughness={0.1} />
              </mesh>
              {/* Horizontal Spout */}
              <mesh position={[-0.1, 0.13, 0]} rotation={[0, 0, Math.PI/2]} castShadow>
                 <cylinderGeometry args={[0.02, 0.02, 0.2]} />
                 <meshPhysicalMaterial color="#ffffff" metalness={1} roughness={0.1} />
              </mesh>
              {/* Hot/Cold Handles */}
              {[-0.1, 0.1].map(z => (
                 <mesh key={`handle-${z}`} position={[0, 0.05, z]} castShadow>
                    <cylinderGeometry args={[0.015, 0.015, 0.05]} />
                    <meshPhysicalMaterial color="#ffffff" metalness={1} roughness={0.1} />
                 </mesh>
              ))}
           </group>
           {/* Spa Plant (Bamboo in a White Ceramic Planter) */}
           <group position={[-0.7, 0.6, -0.7]}>
              <mesh position={[0, 0.1, 0]} castShadow>
                 <cylinderGeometry args={[0.08, 0.06, 0.2]} />
                 <meshPhysicalMaterial color="#f8fafc" roughness={0.1} clearcoat={1} />
              </mesh>
              {[0, 1, 2].map(i => (
                 <mesh key={i} position={[0, 0.3, 0]} rotation={[0.2, i * 2, 0]} castShadow>
                    <cylinderGeometry args={[0.01, 0.01, 0.5]} />
                    <meshPhysicalMaterial color="#4ade80" roughness={0.4} />
                 </mesh>
              ))}
           </group>
        </group>

        {/* Slatted Wood Floor Mat (Pale Oak) */}
        <group position={[-0.5, 0.01, -1.0]}>
           {[-0.3, -0.1, 0.1, 0.3].map((z, idx) => (
             <RoundedBox key={idx} args={[0.8, 0.02, 0.1]} radius={0.005} position={[0, 0, z]} castShadow receiveShadow>
                <meshPhysicalMaterial color="#d4b895" roughness={0.7} />
             </RoundedBox>
           ))}
        </group>

        {/* Floating Wood Slatted Vanity (Right Wall, Pale Oak) */}
        <group position={[2.75, 0, 1.5]} rotation={[0, -Math.PI/2, 0]}>
           <RoundedBox args={[2.0, 0.4, 0.5]} radius={0.02} position={[0, 0.7, 0]} castShadow receiveShadow>
              <meshPhysicalMaterial color="#d4b895" roughness={0.7} />
           </RoundedBox>
           {/* Stone Trough Sink (Warm Cream) */}
           <RoundedBox args={[1.2, 0.15, 0.4]} radius={0.02} position={[0, 0.95, 0]} castShadow receiveShadow>
              <meshPhysicalMaterial color="#fffbeb" roughness={0.2} clearcoat={0.5} />
           </RoundedBox>
           {/* Wall Faucet */}
           <mesh position={[0, 1.2, -0.2]} rotation={[Math.PI/2, 0, 0]} castShadow>
              <cylinderGeometry args={[0.015, 0.015, 0.2]} />
              <meshPhysicalMaterial color="#111" metalness={0.9} roughness={0.2} />
           </mesh>
           {/* Amber Soap Dispenser */}
           <group position={[-0.8, 0.98, -0.1]}>
              <mesh castShadow>
                 <cylinderGeometry args={[0.04, 0.04, 0.12]} />
                 <meshPhysicalMaterial color="#d97706" transparent opacity={0.8} roughness={0.1} />
              </mesh>
              <mesh position={[0, 0.08, 0]} castShadow>
                 <cylinderGeometry args={[0.01, 0.01, 0.04]} />
                 <meshPhysicalMaterial color="#111" metalness={0.8} />
              </mesh>
           </group>
           {/* Circular Backlit Mirror Frame */}
           <mesh position={[0, 1.6, -0.24]} rotation={[Math.PI/2, 0, 0]} castShadow receiveShadow>
              <cylinderGeometry args={[0.5, 0.5, 0.05, 64]} />
              <meshPhysicalMaterial color="#111" roughness={0.5} />
           </mesh>
           
           {/* Actual Mirror Surface perfectly flush to the frame */}
           <mesh position={[0, 1.6, -0.21]}>
             <circleGeometry args={[0.48, 64]} />
             <MeshReflectorMaterial resolution={1024} mirror={1} mixStrength={1.5} roughness={0.02} color="#a0a0a0" />
           </mesh>
        </group>

        {/* --- ADDITIONAL FURNISHINGS --- */}
        {/* Large Plush Cream Rug */}
        <RoundedBox args={[2.0, 0.04, 1.5]} radius={0.01} position={[0, 0.02, 0.5]} castShadow receiveShadow>
           <meshPhysicalMaterial color="#fafaf9" roughness={1.0} />
        </RoundedBox>

        {/* Teak Wood Stool Next to Tub (Pale Oak) */}
        <group position={[-0.8, 0, -0.6]} rotation={[0, Math.PI/6, 0]}>
           <RoundedBox args={[0.4, 0.05, 0.3]} radius={0.02} position={[0, 0.3, 0]} castShadow receiveShadow>
              <meshPhysicalMaterial color="#d4b895" roughness={0.7} />
           </RoundedBox>
           {[-0.15, 0.15].map(x => [-0.1, 0.1].map(z => (
              <mesh key={`leg-${x}-${z}`} position={[x, 0.15, z]} castShadow>
                 <cylinderGeometry args={[0.015, 0.01, 0.3]} />
                 <meshPhysicalMaterial color="#d4b895" roughness={0.7} />
              </mesh>
           )))}
           {/* Folded Towel on Stool */}
           <RoundedBox args={[0.2, 0.05, 0.15]} radius={0.02} position={[0.05, 0.35, 0]} castShadow>
              <meshPhysicalMaterial color="#f8fafc" roughness={0.9} />
           </RoundedBox>
           {/* Spa Candle on Stool */}
           <mesh position={[-0.1, 0.35, 0]} castShadow>
              <cylinderGeometry args={[0.04, 0.04, 0.08]} />
              <meshPhysicalMaterial color="#fef08a" roughness={0.4} />
           </mesh>
           <pointLight position={[-0.1, 0.45, 0]} intensity={0.2} color="#fca5a5" distance={1.0} />
        </group>

        {/* Sleek Freestanding Towel Rack */}
        <group position={[2.4, 0, -1.0]} rotation={[0, -Math.PI/6, 0]}>
           {[-0.2, 0.2].map(z => (
              <mesh key={`rack-leg-${z}`} position={[0, 0.5, z]} castShadow>
                 <cylinderGeometry args={[0.015, 0.015, 1.0]} />
                 <meshPhysicalMaterial color="#111" metalness={0.9} roughness={0.2} />
              </mesh>
           ))}
           <mesh position={[0, 0.02, 0]} castShadow>
              <boxGeometry args={[0.2, 0.04, 0.6]} />
              <meshPhysicalMaterial color="#111" metalness={0.9} roughness={0.2} />
           </mesh>
           {/* Horizontal Bars */}
           {[0.7, 0.9].map(y => (
              <mesh key={`bar-${y}`} position={[0, y, 0]} rotation={[Math.PI/2, 0, 0]} castShadow>
                 <cylinderGeometry args={[0.01, 0.01, 0.4]} />
                 <meshPhysicalMaterial color="#111" metalness={0.9} roughness={0.2} />
              </mesh>
           ))}
           {/* Hanging Towel */}
           <RoundedBox args={[0.05, 0.6, 0.3]} radius={0.02} position={[0, 0.6, 0]} castShadow>
              <meshPhysicalMaterial color="#d6d3d1" roughness={0.9} />
           </RoundedBox>
        </group>
         {/* Sleek Wall-Mounted Commode (Back Wall) */}
         <group position={[1.0, 0, -2.9]}>
            {/* Hidden Tank Box / Ledge */}
            <RoundedBox args={[1.0, 1.2, 0.2]} radius={0.01} position={[0, 0.6, 0.1]} castShadow receiveShadow>
               <meshPhysicalMaterial color="#27272a" roughness={0.6} /> {/* Matching tub slate walls */}
            </RoundedBox>
            {/* Flush Plate */}
            <mesh position={[0, 1.0, 0.21]} castShadow>
               <planeGeometry args={[0.2, 0.12]} />
               <meshPhysicalMaterial color="#ffffff" metalness={1.0} roughness={0.1} />
            </mesh>
            {/* Wall Hung Bowl */}
            <mesh position={[0, 0.4, 0.45]} scale={[1, 0.6, 1.4]} castShadow>
               <sphereGeometry args={[0.22, 32, 32]} />
               <meshPhysicalMaterial color="#ffffff" roughness={0.05} metalness={0.1} clearcoat={1} clearcoatRoughness={0.02} />
            </mesh>
            {/* Toilet Lid */}
            <mesh position={[0, 0.48, 0.45]} scale={[1, 0.08, 1.4]} castShadow>
               <sphereGeometry args={[0.22, 32, 32]} />
               <meshPhysicalMaterial color="#f8f8f8" roughness={0.1} clearcoat={0.5} />
            </mesh>
         </group>
      </group>
    );
  }

  if (designStyle === 3) {
    return (
      <group>
        {/* Emerald Green Wall Mounted Toilet (Flush on Back Wall) */}
        <group position={[0.0, 0, -3.0]}>
           {/* Hidden Tank Box / Ledge */}
           <RoundedBox args={[1.0, 1.2, 0.2]} radius={0.01} position={[0, 0.6, 0.1]} castShadow receiveShadow>
              <meshPhysicalMaterial map={stoneTexture} roughness={0.5} />
           </RoundedBox>
           {/* Flush Plate */}
           <mesh position={[0, 1.0, 0.21]} castShadow>
              <planeGeometry args={[0.2, 0.12]} />
              <meshPhysicalMaterial color="#d4af37" metalness={0.9} roughness={0.2} />
           </mesh>
           {/* Wall Hung Bowl (Rich Emerald Green) */}
           <mesh position={[0, 0.4, 0.45]} scale={[1, 0.6, 1.4]} castShadow>
              <sphereGeometry args={[0.22, 32, 32]} />
              <meshPhysicalMaterial color="#064e3b" roughness={0.05} metalness={0.1} clearcoat={1} clearcoatRoughness={0.02} />
           </mesh>

           {/* Floating Shelves with Towels (Rich Walnut) */}
           {[1.5, 2.0].map((y, i) => (
             <group key={`shelf-${i}`} position={[0, y, 0.15]}>
                <RoundedBox args={[0.8, 0.04, 0.3]} radius={0.01} position={[0, 0, 0.15]} castShadow>
                   <meshPhysicalMaterial color="#78350f" roughness={0.7} />
                </RoundedBox>
                {/* Folded Towel */}
                <RoundedBox args={[0.3, 0.1, 0.2]} radius={0.02} position={[0, 0.07, 0.15]} castShadow>
                   <meshPhysicalMaterial color="#f8fafc" roughness={0.9} />
                </RoundedBox>
             </group>
           ))}
        </group>

        {/* Emerald Green Pedestal Sink (Flush on Left Wall) */}
        <group position={[-2.7, 0, 0]} rotation={[0, Math.PI/2, 0]}>
           {/* Pedestal Base */}
           <mesh position={[0, 0.4, 0]} castShadow receiveShadow>
              <cylinderGeometry args={[0.1, 0.15, 0.8, 32]} />
              <meshPhysicalMaterial color="#064e3b" roughness={0.05} metalness={0.1} clearcoat={1} clearcoatRoughness={0.02} />
           </mesh>
           {/* Sink Basin */}
           <mesh position={[0, 0.85, 0]} scale={[1.5, 0.5, 1]} castShadow receiveShadow>
              <sphereGeometry args={[0.25, 32, 32, 0, Math.PI * 2, 0, Math.PI/2]} />
              <meshPhysicalMaterial color="#064e3b" roughness={0.05} metalness={0.1} clearcoat={1} clearcoatRoughness={0.02} />
           </mesh>
           <mesh position={[0, 0.85, 0]} scale={[1.4, 0.45, 0.9]} rotation={[Math.PI, 0, 0]}>
              <sphereGeometry args={[0.25, 32, 32, 0, Math.PI * 2, 0, Math.PI/2]} />
              <meshPhysicalMaterial color="#064e3b" roughness={0.05} metalness={0.1} clearcoat={1} clearcoatRoughness={0.02} side={THREE.BackSide} />
           </mesh>
           {/* Faucet (Brushed Gold) */}
           <mesh position={[0, 1.0, -0.15]} rotation={[Math.PI/4, 0, 0]} castShadow>
              <cylinderGeometry args={[0.015, 0.015, 0.15]} />
              <meshPhysicalMaterial color="#fbbf24" metalness={1.0} roughness={0.1} />
           </mesh>
           {/* Large Round Brass Mirror */}
           <mesh position={[0, 1.6, -0.28]} rotation={[Math.PI/2, 0, 0]} castShadow>
              <cylinderGeometry args={[0.5, 0.5, 0.04, 64]} />
              <meshPhysicalMaterial color="#fbbf24" metalness={1.0} roughness={0.1} />
           </mesh>
           <mesh position={[0, 1.6, -0.26]} rotation={[Math.PI/2, 0, 0]}>
              <cylinderGeometry args={[0.48, 0.48, 0.05, 64]} />
              <MeshReflectorMaterial resolution={1024} mirror={1} mixStrength={1.5} roughness={0.02} color="#a0a0a0" />
           </mesh>
        </group>

        {/* Elegant Hanging Pendant Light */}
        <group position={[-2.6, 4.5, 0.6]}>
           <mesh position={[0, -1.25, 0]}>
              <cylinderGeometry args={[0.005, 0.005, 2.5]} />
              <meshPhysicalMaterial color="#111" />
           </mesh>
           <mesh position={[0, -2.5, 0]} castShadow>
              <sphereGeometry args={[0.1]} />
              <meshPhysicalMaterial color="#d4af37" metalness={0.9} roughness={0.3} />
           </mesh>
           <mesh position={[0, -2.65, 0]}>
              <cylinderGeometry args={[0.03, 0.03, 0.05]} />
              <meshBasicMaterial color="#fef08a" />
           </mesh>
            <pointLight position={[0, -2.7, 0]} intensity={0.5} color="#ffeacc" distance={2.5} />
        </group>



        {/* Plush Bath Mat (Removed to merge area seamlessly with floor tiles) */}

        {/* Towel Ring and Hand Towel */}
        <group position={[-2.95, 1.1, -0.6]} rotation={[0, Math.PI/2, 0]}>
           {/* Wall Mount */}
           <mesh position={[0, 0, -0.02]} rotation={[Math.PI/2, 0, 0]}>
              <cylinderGeometry args={[0.02, 0.02, 0.04]} />
              <meshPhysicalMaterial color="#fbbf24" metalness={1.0} roughness={0.1} />
           </mesh>
           {/* Ring */}
           <mesh position={[0, -0.05, 0]}>
              <torusGeometry args={[0.08, 0.008, 16, 32]} />
              <meshPhysicalMaterial color="#fbbf24" metalness={1.0} roughness={0.1} />
           </mesh>
           {/* Hanging Hand Towel */}
           <RoundedBox args={[0.12, 0.3, 0.02]} radius={0.01} position={[0, -0.15, 0.02]} castShadow>
              <meshPhysicalMaterial color="#f8fafc" roughness={0.9} />
           </RoundedBox>
        </group>



        {/* --- NEW ADDITIONS FOR BATHROOM 3 --- */}


        {/* Toilet Paper Holder (Brushed Gold) */}
        <group position={[-0.7, 0.5, -2.9]} rotation={[0, Math.PI/2, 0]}>
           <mesh position={[0, 0, 0]} rotation={[Math.PI/2, 0, 0]}>
              <cylinderGeometry args={[0.015, 0.015, 0.08]} />
              <meshPhysicalMaterial color="#fbbf24" metalness={1.0} roughness={0.1} />
           </mesh>
           <mesh position={[0, 0, 0.04]}>
              <cylinderGeometry args={[0.015, 0.015, 0.15]} />
              <meshPhysicalMaterial color="#fbbf24" metalness={1.0} roughness={0.1} />
           </mesh>
           {/* Toilet Paper Roll */}
           <mesh position={[0, 0, 0.04]}>
              <cylinderGeometry args={[0.06, 0.06, 0.12]} />
              <meshPhysicalMaterial color="#ffffff" roughness={1.0} />
           </mesh>
        </group>



        {/* Glowing Wall Sconce (Next to Mirror) */}
        <group position={[-2.95, 1.8, -0.9]} rotation={[0, Math.PI/2, 0]}>
           {/* Backplate */}
           <mesh position={[0, 0, 0]} rotation={[Math.PI/2, 0, 0]}>
              <cylinderGeometry args={[0.05, 0.05, 0.01]} />
              <meshPhysicalMaterial color="#d4af37" metalness={0.9} roughness={0.2} />
           </mesh>
           {/* Arm */}
           <mesh position={[0, -0.05, 0.05]} rotation={[Math.PI/4, 0, 0]}>
              <cylinderGeometry args={[0.008, 0.008, 0.1]} />
              <meshPhysicalMaterial color="#d4af37" metalness={0.9} roughness={0.2} />
           </mesh>
           {/* Frosted Glass Globe */}
           <mesh position={[0, -0.1, 0.08]} castShadow>
              <sphereGeometry args={[0.08]} />
              <meshPhysicalMaterial color="#ffffff" transmission={0.9} opacity={1} roughness={0.2} thickness={0.02} />
           </mesh>
           {/* Inner Bulb */}
           <mesh position={[0, -0.1, 0.08]}>
              <sphereGeometry args={[0.02]} />
              <meshBasicMaterial color="#fef08a" />
           </mesh>
            <pointLight position={[0, -0.1, 0.1]} intensity={0.2} color="#fef08a" distance={1.5} />
         </group>

         {/* ─── SINGLE GLASS SHOWER AREA (Back Right Corner) ─── */}
         <group position={[2.25, 0, -2.25]}>
            {/* Shower Floor Pan (Removed for seamless zero-entry floor transition) */}
            {/* Front Glass */}
            <RoundedBox args={[1.5, 2.8, 0.02]} radius={0.005} position={[0, 1.4, 0.75]} castShadow>
               <meshPhysicalMaterial color="#ffffff" transmission={1.0} opacity={1} transparent roughness={0.0} metalness={0.0} ior={1.5} thickness={0.02} />
            </RoundedBox>
            {/* Side Glass */}
            <RoundedBox args={[0.02, 2.8, 1.5]} radius={0.005} position={[-0.75, 1.4, 0]} castShadow>
               <meshPhysicalMaterial color="#ffffff" transmission={1.0} opacity={1} transparent roughness={0.0} metalness={0.0} ior={1.5} thickness={0.02} />
            </RoundedBox>
            {/* Hardware Clips (Brushed Gold) */}
            <mesh position={[-0.75, 2.8, 0.75]}>
               <boxGeometry args={[0.06, 0.06, 0.06]}/>
               <meshPhysicalMaterial color="#fbbf24" metalness={1.0} roughness={0.1} />
            </mesh>
            
            {/* Shower Column System (Brushed Gold) */}
            <mesh position={[0, 1.2, -0.73]} castShadow>
               <cylinderGeometry args={[0.015, 0.015, 2.4]} />
               <meshPhysicalMaterial color="#fbbf24" metalness={1.0} roughness={0.1}/>
            </mesh>
            <mesh position={[0, 2.4, -0.45]} rotation={[Math.PI/2, 0, 0]} castShadow>
               <cylinderGeometry args={[0.015, 0.015, 0.6]} />
               <meshPhysicalMaterial color="#fbbf24" metalness={1.0} roughness={0.1}/>
            </mesh>
            {/* Large Rain Head (Brushed Gold) */}
            <mesh position={[0, 2.4, -0.15]} castShadow>
               <cylinderGeometry args={[0.2, 0.2, 0.02, 32]} />
               <meshPhysicalMaterial color="#fbbf24" metalness={1.0} roughness={0.1}/>
            </mesh>
            {/* Mixer Valve */}
            <RoundedBox args={[0.1, 0.2, 0.02]} radius={0.01} position={[0, 1.0, -0.74]}>
               <meshPhysicalMaterial color="#fbbf24" metalness={1.0} roughness={0.1}/>
            </RoundedBox>
            <mesh position={[0, 1.0, -0.72]} rotation={[Math.PI/2, 0, 0]}>
               <cylinderGeometry args={[0.03, 0.03, 0.05]} />
               <meshPhysicalMaterial color="#fbbf24" metalness={1.0} roughness={0.1}/>
            </mesh>
         </group>

         {/* ─── ELEGANT BOWL BATHTUB (Right Wall) ─── */}
         <group position={[1.5, 0.55, 1.0]}>
           {/* Outer Bowl (Emerald Green) */}
           <mesh scale={[1.4, 0.55, 0.85]} castShadow receiveShadow>
             <sphereGeometry args={[1, 64, 32, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2]} />
             <meshPhysicalMaterial color="#064e3b" roughness={0.05} metalness={0.1} clearcoat={1} clearcoatRoughness={0.02} />
           </mesh>
           {/* Inner Bowl (White Ceramic) */}
           <mesh scale={[1.3, 0.5, 0.75]} position={[0, 0.05, 0]} castShadow>
             <sphereGeometry args={[1, 64, 32, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2]} />
             <meshPhysicalMaterial color="#ffffff" roughness={0.05} clearcoat={1} side={THREE.BackSide} />
           </mesh>
           {/* Thick Seamless Rim (White) */}
           <mesh rotation={[Math.PI/2, 0, 0]} scale={[1.35, 0.8, 1]} castShadow>
             <torusGeometry args={[1, 0.06, 32, 128]} />
             <meshPhysicalMaterial color="#ffffff" roughness={0.05} metalness={0.1} clearcoat={1} clearcoatRoughness={0.02} />
           </mesh>
           
           {/* Tall Floor-Mounted Faucet (Brushed Gold) */}
           <group position={[-1.6, -0.55, 0]}>
              <mesh position={[0, 0.5, 0]} castShadow>
                <cylinderGeometry args={[0.02, 0.03, 1.0]} />
                <meshPhysicalMaterial color="#fbbf24" metalness={1.0} roughness={0.1} />
              </mesh>
              <mesh position={[0.2, 0.9, 0]} rotation={[0, 0, -Math.PI/2]} castShadow>
                <cylinderGeometry args={[0.015, 0.02, 0.4]} />
                <meshPhysicalMaterial color="#fbbf24" metalness={1.0} roughness={0.1} />
              </mesh>
           </group>
         </group>

      </group>
    );
  }

  if (designStyle === 4) {
    return (
      <group>
        {/* Elegant Dark Moody Luxury Spa Bathroom */}
        {/* Floating Walnut Vanity */}
        <group position={[-2.0, 0, 0]}>
           {/* Vanity Base - Dark Wood */}
           <RoundedBox args={[1.2, 0.6, 2.4]} radius={0.02} position={[0, 0.7, 0]} castShadow receiveShadow>
              <meshPhysicalMaterial map={oakTexture} color="#2a2420" roughness={0.7} />
           </RoundedBox>
           {/* Countertop - White Marble */}
           <RoundedBox args={[1.25, 0.05, 2.45]} radius={0.01} position={[0, 1.025, 0]} castShadow receiveShadow>
              <meshPhysicalMaterial color="#ffffff" roughness={0.1} clearcoat={1.0} />
           </RoundedBox>

           {/* Sinks - Elegant White Oval Vessels */}
           {[-0.6, 0.6].map((z, idx) => (
             <group key={`sink-${idx}`} position={[0, 1.05, z]}>
               <mesh position={[0, 0.1, 0]} scale={[1, 0.5, 1.4]} castShadow>
                  <sphereGeometry args={[0.25, 64, 32, 0, Math.PI*2, Math.PI/2, Math.PI/2]} />
                  <meshPhysicalMaterial color="#ffffff" roughness={0.1} clearcoat={1} side={THREE.DoubleSide} />
               </mesh>
               {/* Brushed Brass Vanity-Mounted Faucet */}
               <group position={[0, 0, -0.15]}>
                  <mesh position={[0, 0.1, 0]} castShadow>
                     <cylinderGeometry args={[0.015, 0.015, 0.2]} />
                     <meshPhysicalMaterial color="#d4af37" metalness={0.9} roughness={0.2} />
                  </mesh>
                  <mesh position={[0, 0.2, 0.05]} rotation={[Math.PI/2, 0, 0]} castShadow>
                     <cylinderGeometry args={[0.01, 0.01, 0.1]} />
                     <meshPhysicalMaterial color="#d4af37" metalness={0.9} roughness={0.2} />
                  </mesh>
               </group>
             </group>
           ))}

           {/* Sleek Frameless Rectangular Mirrors with Warm Backlight */}
           {[-0.6, 0.6].map((z, idx) => (
             <group key={`mirror-${idx}`} position={[-0.58, 1.8, z]} rotation={[0, Math.PI/2, 0]}>
               {/* Mirror */}
               <RoundedBox args={[0.8, 1.4, 0.02]} radius={0.01} position={[0, 0, 0.01]}>
                 <MeshReflectorMaterial resolution={1024} mirror={1} mixStrength={1.5} roughness={0.02} color="#a0a0a0" />
               </RoundedBox>
               {/* Backlight glow */}
               <RoundedBox args={[0.85, 1.45, 0.01]} radius={0.01} position={[0, 0, -0.01]}>
                 <meshPhysicalMaterial color="#ffffff" emissive="#fbbf24" emissiveIntensity={1} />
               </RoundedBox>
               <pointLight position={[0, 0, 0.2]} intensity={0.5} color="#fbbf24" distance={2} />
             </group>
           ))}
        </group>

        {/* Elegant Matte Black Freestanding Tub */}
        <group position={[1.5, 0.4, -1.5]}>
           {/* Wooden Platform */}
           <RoundedBox args={[2.5, 0.1, 2.5]} radius={0.02} position={[0, -0.35, 0]} castShadow receiveShadow>
              <meshPhysicalMaterial map={oakTexture} color="#4a3b32" roughness={0.8} />
           </RoundedBox>
           
           {/* Tub */}
           <mesh scale={[1.2, 0.8, 1.6]} position={[0, -0.1, 0]} castShadow receiveShadow>
              <sphereGeometry args={[0.6, 64, 32, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2]} />
              <meshPhysicalMaterial color="#ffbebb" roughness={0.4} clearcoat={0.2} side={THREE.DoubleSide} />
           </mesh>

           {/* Tub Water */}
           <mesh position={[0, -0.15, 0]} rotation={[-Math.PI/2, 0, 0]} scale={[1.2, 1.6, 1]} receiveShadow>
              <circleGeometry args={[0.58, 64]} />
              <meshPhysicalMaterial color="#bae6fd" transmission={0.9} transparent opacity={0.7} roughness={0.05} ior={1.33} thickness={0.5} />
           </mesh>

           {/* Brushed Brass Floor Faucet */}
           <group position={[-1.0, -0.3, 0]}>
              <mesh castShadow>
                 <cylinderGeometry args={[0.02, 0.02, 1.2]} />
                 <meshPhysicalMaterial color="#d4af37" metalness={0.9} roughness={0.2} />
              </mesh>
              <mesh position={[0.2, 0.5, 0]} rotation={[0, 0, -Math.PI/2]} castShadow>
                 <cylinderGeometry args={[0.015, 0.015, 0.4]} />
                 <meshPhysicalMaterial color="#d4af37" metalness={0.9} roughness={0.2} />
              </mesh>
           </group>
        </group>
      </group>
    );
  }

  // Design 1 (Original)
  return (
    <group>
      {/* ─── SINGLE GLASS SHOWER AREA (Back Right Corner) ─── */}
      <group position={[2.25, 0, -2.25]}>
         {/* Shower Floor Pan (Removed for seamless zero-entry floor transition) */}
         {/* Front Glass (Simple transparent) */}
         <RoundedBox args={[1.5, 2.8, 0.02]} radius={0.005} position={[0, 1.4, 0.75]} castShadow>
            <meshPhysicalMaterial 
              color="#ffffff" 
              transmission={1.0} 
              opacity={1} 
              transparent 
              roughness={0.0} 
              metalness={0.0}
              ior={1.5}
              thickness={0.02}
            />
         </RoundedBox>
         {/* Side Glass (Simple transparent) */}
         <RoundedBox args={[0.02, 2.8, 1.5]} radius={0.005} position={[-0.75, 1.4, 0]} castShadow>
            <meshPhysicalMaterial 
              color="#ffffff" 
              transmission={1.0} 
              opacity={1} 
              transparent 
              roughness={0.0} 
              metalness={0.0}
              ior={1.5}
              thickness={0.02}
            />
         </RoundedBox>
         {/* Hardware Clips */}
         <mesh position={[-0.75, 2.8, 0.75]}><boxGeometry args={[0.06, 0.06, 0.06]}/><meshPhysicalMaterial color="#111" metalness={0.9} roughness={0.2} /></mesh>
         
         {/* Premium Shower Column System */}
         <mesh position={[0, 1.2, -0.73]} castShadow>
            <cylinderGeometry args={[0.015, 0.015, 2.4]} />
            <meshPhysicalMaterial color="#e0e0e0" metalness={0.9} roughness={0.1}/>
         </mesh>
         <mesh position={[0, 2.4, -0.45]} rotation={[Math.PI/2, 0, 0]} castShadow>
            <cylinderGeometry args={[0.015, 0.015, 0.6]} />
            <meshPhysicalMaterial color="#e0e0e0" metalness={0.9} roughness={0.1}/>
         </mesh>
         {/* Large Rain Head */}
         <mesh position={[0, 2.4, -0.15]} castShadow>
            <cylinderGeometry args={[0.2, 0.2, 0.02, 32]} />
            <meshPhysicalMaterial color="#111" metalness={0.9} roughness={0.2}/>
         </mesh>
         {/* Mixer Valve */}
         <RoundedBox args={[0.1, 0.2, 0.02]} radius={0.01} position={[0, 1.0, -0.74]}>
            <meshPhysicalMaterial color="#111" metalness={0.9} roughness={0.2}/>
         </RoundedBox>
         <mesh position={[0, 1.0, -0.72]} rotation={[Math.PI/2, 0, 0]}>
            <cylinderGeometry args={[0.03, 0.03, 0.05]} />
            <meshPhysicalMaterial color="#e0e0e0" metalness={0.9} roughness={0.1}/>
         </mesh>
      </group>

      {/* ─── PROFESSIONAL FLOOR-STANDING COMMODE (Right Wall) ─── */}
      <group position={[2.9, 0, 0]} rotation={[0, -Math.PI/2, 0]}>
        {/* Toilet Tank */}
        <RoundedBox args={[0.45, 0.45, 0.2]} radius={0.02} position={[0, 0.65, 0]} castShadow receiveShadow>
           <meshPhysicalMaterial color="#ffffff" roughness={0.05} metalness={0.1} clearcoat={1} clearcoatRoughness={0.02} />
        </RoundedBox>
        {/* Flush Button on top of tank */}
        <mesh position={[0, 0.88, 0]}>
           <cylinderGeometry args={[0.04, 0.04, 0.01]} />
           <meshPhysicalMaterial color="#ffffff" metalness={1} roughness={0.1} />
        </mesh>
        {/* Base Pillar */}
        <mesh position={[0, 0.225, 0.1]} castShadow receiveShadow>
           <cylinderGeometry args={[0.12, 0.16, 0.45, 32]} />
           <meshPhysicalMaterial color="#ffffff" roughness={0.05} metalness={0.1} clearcoat={1} clearcoatRoughness={0.02} />
        </mesh>
        {/* Toilet Bowl (Egg shape) */}
        <mesh position={[0, 0.38, 0.3]} scale={[1, 0.6, 1.4]} castShadow>
           <sphereGeometry args={[0.22, 32, 32]} />
           <meshPhysicalMaterial color="#ffffff" roughness={0.05} metalness={0.1} clearcoat={1} clearcoatRoughness={0.02} />
        </mesh>
        {/* Toilet Lid (Flat) */}
        <mesh position={[0, 0.46, 0.3]} scale={[1, 0.08, 1.4]} castShadow>
           <sphereGeometry args={[0.22, 32, 32]} />
           <meshPhysicalMaterial color="#f8f8f8" roughness={0.1} clearcoat={0.5} />
        </mesh>
      </group>

      {/* ─── MUSLIM SHOWER / BIDET SPRAYER (Right Wall) ─── */}
      <group position={[2.95, 0, 0.4]} rotation={[0, -Math.PI/2, 0]}>
         {/* Wall Mount bracket */}
         <RoundedBox args={[0.06, 0.08, 0.02]} radius={0.005} position={[0, 0.45, -0.04]}>
            <meshPhysicalMaterial color="#e0e0e0" metalness={0.9} roughness={0.2} />
         </RoundedBox>
         {/* Sprayer Handle */}
         <mesh position={[0, 0.48, 0]} rotation={[Math.PI/6, 0, 0]} castShadow>
            <cylinderGeometry args={[0.01, 0.015, 0.12]} />
            <meshPhysicalMaterial color="#e0e0e0" metalness={0.9} roughness={0.2} />
         </mesh>
         {/* Sprayer Nozzle Head */}
         <mesh position={[0, 0.53, 0.03]} rotation={[Math.PI/2, 0, 0]} castShadow>
            <cylinderGeometry args={[0.02, 0.02, 0.04]} />
            <meshPhysicalMaterial color="#e0e0e0" metalness={0.9} roughness={0.2} />
         </mesh>
         <mesh position={[0, 0.53, 0.05]} rotation={[Math.PI/2, 0, 0]}>
            <cylinderGeometry args={[0.018, 0.018, 0.01]} />
            <meshPhysicalMaterial color="#333" />
         </mesh>
         {/* Simulated Hanging Hose */}
         <mesh position={[0, 0.36, 0.02]} rotation={[Math.PI/12, 0, 0]}>
            <cylinderGeometry args={[0.008, 0.008, 0.15]} />
            <meshPhysicalMaterial color="#666" metalness={0.5} roughness={0.5} />
         </mesh>
         <mesh position={[0, 0.28, -0.01]} rotation={[-Math.PI/8, 0, 0]}>
            <cylinderGeometry args={[0.008, 0.008, 0.08]} />
            <meshPhysicalMaterial color="#666" metalness={0.5} roughness={0.5} />
         </mesh>
      </group>

      {/* ─── ELEGANT BOWL BATHTUB (Center Left) ─── */}
      <group position={[-1.2, 0.55, -1.0]}>
        {/* Outer Bowl (Hangs below Y=0 down to the floor) */}
        <mesh scale={[1.4, 0.55, 0.85]} castShadow receiveShadow>
          <sphereGeometry args={[1, 64, 32, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2]} />
          <meshPhysicalMaterial color="#ffffff" roughness={0.05} metalness={0.1} clearcoat={1} clearcoatRoughness={0.02} />
        </mesh>
        {/* Inner Bowl (Vibrant Blue Ceramic/Water Interior) */}
        <mesh scale={[1.3, 0.5, 0.75]} position={[0, 0.05, 0]} castShadow>
          <sphereGeometry args={[1, 64, 32, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2]} />
          <meshPhysicalMaterial color="#0ea5e9" roughness={0.1} clearcoat={1} side={THREE.BackSide} />
        </mesh>
        {/* Thick Seamless Rim (Torus) */}
        <mesh rotation={[Math.PI/2, 0, 0]} scale={[1.35, 0.8, 1]} castShadow>
          <torusGeometry args={[1, 0.06, 32, 128]} />
          <meshPhysicalMaterial color="#ffffff" roughness={0.05} metalness={0.1} clearcoat={1} clearcoatRoughness={0.02} />
        </mesh>
        
        {/* Tall Floor-Mounted Faucet */}
        <group position={[-1.6, -0.55, 0]}>
           <mesh position={[0, 0.5, 0]} castShadow>
             <cylinderGeometry args={[0.02, 0.03, 1.0]} />
             <meshPhysicalMaterial color="#111" metalness={0.9} roughness={0.2} />
           </mesh>
           <mesh position={[0.2, 0.9, 0]} rotation={[0, 0, -Math.PI/2]} castShadow>
             <cylinderGeometry args={[0.015, 0.02, 0.4]} />
             <meshPhysicalMaterial color="#111" metalness={0.9} roughness={0.2} />
           </mesh>
        </group>
      </group>

      {/* FLOATING DOUBLE VANITY (Left Wall) */}
      <group position={[-2.75, 0, 1.2]} rotation={[0, Math.PI/2, 0]}>
        {/* Floating Cabinet Base */}
        <RoundedBox args={[2.2, 0.45, 0.5]} radius={0.02} smoothness={4} position={[0, 0.625, 0]} castShadow receiveShadow>
          <meshPhysicalMaterial color="#1e1b18" roughness={0.6} />
        </RoundedBox>
        {/* White Stone Countertop */}
        <RoundedBox args={[2.22, 0.06, 0.52]} radius={0.01} smoothness={4} position={[0, 0.88, 0]} castShadow receiveShadow>
          <meshPhysicalMaterial color="#fcfcfc" roughness={0.1} clearcoat={0.5} />
        </RoundedBox>
        
        {/* Under-mount style Sinks (Black inset boxes) */}
        {[-0.6, 0.6].map(x => (
          <group key={`sink-${x}`}>
            <RoundedBox args={[0.6, 0.15, 0.35]} radius={0.05} position={[x, 0.82, 0.05]}>
              <meshPhysicalMaterial color="#111" roughness={0.8} />
            </RoundedBox>
            {/* Wall-Mounted Faucet */}
            <mesh position={[x, 1.15, -0.2]} rotation={[Math.PI/2, 0, 0]} castShadow>
              <cylinderGeometry args={[0.012, 0.015, 0.2]} />
              <meshPhysicalMaterial color="#111" metalness={0.9} roughness={0.2} />
            </mesh>
            <mesh position={[x, 1.15, -0.28]} rotation={[Math.PI/2, 0, 0]} castShadow>
              <cylinderGeometry args={[0.03, 0.03, 0.02]} />
              <meshPhysicalMaterial color="#d4af37" metalness={0.9} roughness={0.2} />
            </mesh>
          </group>
        ))}

        {/* Massive LED Backlit Mirror */}
        <RoundedBox args={[2.2, 1.3, 0.05]} radius={0.02} smoothness={4} position={[0, 1.7, -0.2]} castShadow receiveShadow>
          <meshPhysicalMaterial color="#111" roughness={0.5} />
        </RoundedBox>
      </group>

      {/* Actual Mirror Surface for Vanity (Rotated to face +X from Left Wall) */}
      <mesh position={[-2.92, 1.7, 1.2]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[2.15, 1.25]} />
        <MeshReflectorMaterial 
          resolution={2048} 
          mirror={1} 
          mixBlur={0} 
          mixStrength={1.5} 
          roughness={0.02} 
          color="#a0a0a0" 
          metalness={1} 
        />
      </mesh>

      {/* Sleek Towel Rack & Towels */}
      <group position={[-2.95, 1.2, -0.5]} rotation={[0, Math.PI/2, 0]}>
         {/* Wall Brackets */}
         <mesh position={[0.25, 0, 0.025]} rotation={[Math.PI/2, 0, 0]}>
            <cylinderGeometry args={[0.005, 0.005, 0.05]} />
            <meshPhysicalMaterial color="#e0e0e0" metalness={0.9} />
         </mesh>
         <mesh position={[-0.25, 0, 0.025]} rotation={[Math.PI/2, 0, 0]}>
            <cylinderGeometry args={[0.005, 0.005, 0.05]} />
            <meshPhysicalMaterial color="#e0e0e0" metalness={0.9} />
         </mesh>
         {/* Horizontal Bar */}
         <mesh position={[0, 0, 0.05]} rotation={[0, 0, Math.PI/2]} castShadow>
            <cylinderGeometry args={[0.01, 0.01, 0.6]} />
            <meshPhysicalMaterial color="#e0e0e0" metalness={0.9} roughness={0.2} />
         </mesh>
         {/* Hanging Towel */}
         <mesh position={[0, -0.25, 0.06]} castShadow>
            <planeGeometry args={[0.4, 0.5]} />
            <meshStandardMaterial color="#f8fafc" roughness={1} side={THREE.DoubleSide} />
         </mesh>
      </group>

    </group>
  );
}

// Hyper-Realistic Kitchen
function KitchenFurniture({ designStyle }: { designStyle: 1 | 2 | 3 | 4 }) {
  const woodTexture = useMemo(() => TextureCache.getDarkWood(), []);
  const goldMarbleTexture = useMemo(() => TextureCache.getGoldMarble(), []);
  const marbleTexture = useMemo(() => TextureCache.getKitchenMarble(), []);

  // Subway tile backsplash
  const backsplashTexture = useMemo(() => TextureCache.getBacksplash(), []);

  if (designStyle === 2) {
    return (
      <group>
        {/* Industrial Loft Kitchen */}
        {/* L-Shaped Counter (Back and Left) */}
        <group position={[0, 0, -2.4]}>
           {/* Cabinet Base (Segmented Doors) */}
           {[-2.85, -2.55, -2.25, -1.95, -1.65, -1.35, -1.05, -0.75, 0.75, 1.05, 1.35, 1.65].map((x, idx) => (
             <group key={`base-back-${x}`} position={[x, 0.425, 0]}>
                <RoundedBox args={[0.28, 0.85, 1.2]} radius={0.01} castShadow receiveShadow>
                   <meshPhysicalMaterial map={woodTexture} color="#fdf8f5" roughness={0.7} />
                </RoundedBox>
                {/* Handle on front face */}
                <mesh position={[idx % 2 === 0 ? 0.1 : -0.1, 0.25, 0.6]} castShadow>
                   <cylinderGeometry args={[0.01, 0.01, 0.15]} />
                   <meshPhysicalMaterial color="#d4af37" metalness={0.9} roughness={0.2} />
                </mesh>
             </group>
           ))}
           {/* Countertop */}
           <RoundedBox args={[4.8, 0.05, 1.3]} radius={0.01} position={[-0.6, 0.875, 0]} castShadow receiveShadow>
              <meshPhysicalMaterial map={marbleTexture} color="#ffffff" roughness={0.1} clearcoat={1} />
           </RoundedBox>
        </group>
        <group position={[-2.4, 0, 0]}>
           {/* Cabinet Base (Segmented Doors) */}
           {[-1.65, -1.35, -1.05, -0.75, -0.45, -0.15, 0.15, 0.45, 0.75, 1.05, 1.35, 1.65].map((z, idx) => (
             <group key={`base-left-${z}`} position={[0, 0.425, z]}>
                <RoundedBox args={[1.2, 0.85, 0.28]} radius={0.01} castShadow receiveShadow>
                   <meshPhysicalMaterial map={woodTexture} color="#fdf8f5" roughness={0.7} />
                </RoundedBox>
                {/* Handle on front face */}
                <mesh position={[0.6, 0.25, idx % 2 === 0 ? 0.1 : -0.1]} castShadow>
                   <cylinderGeometry args={[0.01, 0.01, 0.15]} />
                   <meshPhysicalMaterial color="#d4af37" metalness={0.9} roughness={0.2} />
                </mesh>
             </group>
           ))}
           {/* Countertop */}
           <RoundedBox args={[1.3, 0.05, 3.7]} radius={0.01} position={[0, 0.875, 0]} castShadow receiveShadow>
              <meshPhysicalMaterial map={marbleTexture} color="#ffffff" roughness={0.1} clearcoat={1} />
           </RoundedBox>
        </group>

        {/* Upper Cabinets (Left Wall Segmented Doors) */}
        <group position={[-2.7, 2.0, 0]}>
           {[-1.65, -1.35, -1.05, -0.75, -0.45, -0.15, 0.15, 0.45, 0.75, 1.05, 1.35, 1.65].map((z, idx) => (
             <group key={`upper-left-${z}`} position={[0, 0.6, z]}>
                <RoundedBox args={[0.6, 1.2, 0.28]} radius={0.01} castShadow receiveShadow>
                   <meshPhysicalMaterial map={woodTexture} color="#fdf8f5" roughness={0.7} />
                </RoundedBox>
                {/* Handle on front face */}
                <mesh position={[0.3, -0.4, idx % 2 === 0 ? 0.1 : -0.1]} castShadow>
                   <cylinderGeometry args={[0.01, 0.01, 0.15]} />
                   <meshPhysicalMaterial color="#d4af37" metalness={0.9} roughness={0.2} />
                </mesh>
             </group>
           ))}
        </group>

        {/* Professional Gas Range */}
        <group position={[0, 0, -2.1]}>
           {/* Main Body */}
           <RoundedBox args={[0.9, 0.95, 0.8]} radius={0.02} position={[0, 0.475, 0]} castShadow receiveShadow>
              <meshPhysicalMaterial color="#0f172a" roughness={0.2} clearcoat={0.5} />
           </RoundedBox>
           {/* Oven Window */}
           <mesh position={[0, 0.4, 0.41]}>
              <planeGeometry args={[0.7, 0.4]} />
              <meshPhysicalMaterial color="#1f2937" roughness={0.1} metalness={0.6} clearcoat={1} />
           </mesh>
           {/* Oven Handle */}
           <mesh position={[0, 0.7, 0.43]} castShadow rotation={[0, 0, Math.PI/2]}>
              <cylinderGeometry args={[0.015, 0.015, 0.8]} />
              <meshPhysicalMaterial color="#d4af37" metalness={0.9} roughness={0.2} />
           </mesh>
           {/* Burner Knobs */}
           {[-0.3, -0.15, 0, 0.15, 0.3].map((x) => (
              <mesh key={`knob-${x}`} position={[x, 0.85, 0.42]} rotation={[Math.PI/2, 0, 0]} castShadow>
                 <cylinderGeometry args={[0.02, 0.02, 0.04]} />
                 <meshPhysicalMaterial color="#d4af37" metalness={0.9} roughness={0.2} />
              </mesh>
           ))}
           {/* Cooktop Surface */}
           <mesh position={[0, 0.95, 0]}>
              <boxGeometry args={[0.9, 0.05, 0.8]} />
              <meshPhysicalMaterial color="#111" roughness={0.8} />
           </mesh>
           {/* Wall-Mounted Range Hood Canopy */}
           <mesh position={[0, 2.7, -0.3]} castShadow>
              <boxGeometry args={[1.0, 0.4, 1.2]} />
              <meshPhysicalMaterial color="#0f172a" roughness={0.2} clearcoat={0.5} />
           </mesh>
           {/* Pipe extending exactly to the ceiling, flush against wall */}
           <mesh position={[0, 3.8, -0.75]} castShadow>
              <boxGeometry args={[0.4, 1.8, 0.3]} />
              <meshPhysicalMaterial color="#0f172a" roughness={0.2} clearcoat={0.5} />
           </mesh>
           {/* Gold Hood Trim */}
           <mesh position={[0, 2.52, -0.3]} castShadow>
              <boxGeometry args={[1.02, 0.05, 1.22]} />
              <meshPhysicalMaterial color="#d4af37" metalness={0.9} roughness={0.2} />
           </mesh>
        </group>

        {/* Beautiful Midnight Blue Smart Fridge */}
        <group position={[2.4, 0, -2.2]}>
           <RoundedBox args={[1.1, 2.1, 0.9]} radius={0.03} position={[0, 1.05, 0]} castShadow receiveShadow>
              <meshPhysicalMaterial color="#0f172a" roughness={0.2} clearcoat={0.5} />
           </RoundedBox>
           {/* Fridge Handles */}
           {[-0.1, 0.1].map(x => (
             <mesh key={`handle-${x}`} position={[x, 1.05, 0.46]} castShadow>
                <cylinderGeometry args={[0.015, 0.015, 0.6]} />
                <meshPhysicalMaterial color="#d4af37" metalness={0.9} roughness={0.2} />
             </mesh>
           ))}
        </group>

        {/* Minimalist Metallic Stools */}
        {[-1.0, 0, 1.0].map((z, idx) => (
           <group key={`stool-${idx}`} position={[-1.6, 0, z]}>
              <mesh position={[0, 0.65, 0]} castShadow>
                 <cylinderGeometry args={[0.18, 0.18, 0.05, 32]} />
                 <meshPhysicalMaterial map={woodTexture} roughness={0.8} />
              </mesh>
              <mesh position={[0, 0.325, 0]} castShadow>
                 <cylinderGeometry args={[0.02, 0.02, 0.65]} />
                 <meshPhysicalMaterial color="#111" metalness={0.9} roughness={0.2} />
              </mesh>
           </group>
        ))}
      </group>
    );
  }

  if (designStyle === 3) {
    return (
      <group>
        {/* Classic Elegance Kitchen */}
        {/* U-Shaped Counter Layout */}
        <group position={[0, 0, -2.4]}>
           {/* Back Counter */}
           <RoundedBox args={[6.0, 0.9, 1.2]} radius={0.02} position={[0, 0.45, 0]} castShadow receiveShadow>
              <meshPhysicalMaterial color="#f0f0f0" roughness={0.6} />
           </RoundedBox>
           <RoundedBox args={[6.2, 0.05, 1.3]} radius={0.01} position={[0, 0.925, 0]} castShadow receiveShadow>
              <meshPhysicalMaterial map={marbleTexture} roughness={0.1} />
           </RoundedBox>
        </group>
        {/* Side Counters */}
        {[-2.4, 2.4].map((x, idx) => (
          <group key={`side-${idx}`} position={[x, 0, 0]}>
             <RoundedBox args={[1.2, 0.9, 3.6]} radius={0.02} position={[0, 0.45, 0]} castShadow receiveShadow>
                <meshPhysicalMaterial color="#f0f0f0" roughness={0.6} />
             </RoundedBox>
             <RoundedBox args={[1.3, 0.05, 3.8]} radius={0.01} position={[0, 0.925, 0]} castShadow receiveShadow>
                <meshPhysicalMaterial map={marbleTexture} roughness={0.1} />
             </RoundedBox>
          </group>
        ))}

        {/* Farmhouse Sink */}
        <group position={[0, 0, -2.2]}>
           <RoundedBox args={[1.0, 0.3, 0.6]} radius={0.02} position={[0, 0.75, 0]} castShadow receiveShadow>
              <meshPhysicalMaterial color="#fff" roughness={0.1} clearcoat={1} />
           </RoundedBox>
           <mesh position={[0, 0.9, 0]}>
              <boxGeometry args={[0.9, 0.2, 0.5]} />
              <meshPhysicalMaterial color="#111" />
           </mesh>
           <mesh position={[0, 1.2, -0.2]} rotation={[Math.PI/4, 0, 0]} castShadow>
              <cylinderGeometry args={[0.015, 0.015, 0.2]} />
              <meshPhysicalMaterial color="#d4af37" metalness={0.9} roughness={0.2} />
           </mesh>
        </group>

        {/* Decorative Bowl of Apples on Counter (Classic Elegance Theme) */}
        <group position={[2.0, 0.95, 0]}>
           <mesh position={[0, 0.05, 0]} rotation={[Math.PI, 0, 0]} castShadow>
              <sphereGeometry args={[0.15, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
              <meshPhysicalMaterial color="#d4af37" roughness={0.2} metalness={0.8} side={THREE.DoubleSide} />
           </mesh>
           {[[-0.05, 0.05, -0.05], [0.05, 0.05, -0.02], [0, 0.05, 0.06], [0, 0.1, 0]].map((pos, i) => (
              <mesh key={`apple-${i}`} position={pos as [number, number, number]} castShadow>
                 <sphereGeometry args={[0.04]} />
                 <meshPhysicalMaterial color="#84cc16" roughness={0.3} clearcoat={0.5} />
              </mesh>
           ))}
        </group>

        {/* Elegant Chandelier (Attached to roof, matching image) */}
        <group position={[0, 4.8, 0]}>
           {/* Central Pole (long enough to clip into ceiling) */}
           <mesh position={[0, -0.8, 0]} castShadow>
              <cylinderGeometry args={[0.02, 0.02, 2.0]} />
              <meshPhysicalMaterial color="#d4af37" metalness={0.9} roughness={0.2} />
           </mesh>
           {/* Central Gold Sphere Hub */}
           <mesh position={[0, -1.8, 0]} castShadow>
              <sphereGeometry args={[0.1, 32, 32]} />
              <meshPhysicalMaterial color="#d4af37" metalness={0.9} roughness={0.2} />
           </mesh>
           {/* 4 Slanted Arms and Lamp Shades */}
           {[0, Math.PI/2, Math.PI, Math.PI*1.5].map((angle, idx) => (
             <group key={`light-${idx}`} position={[0, -1.8, 0]} rotation={[0, angle, 0]}>
                {/* Slanted arm */}
                <mesh position={[0.15, 0.15, 0]} rotation={[0, 0, -Math.PI/4]} castShadow>
                   <cylinderGeometry args={[0.015, 0.015, 0.45]} />
                   <meshPhysicalMaterial color="#d4af37" metalness={0.9} roughness={0.2} />
                </mesh>
                {/* Lamp Shade (White Cone) */}
                <mesh position={[0.3, 0.35, 0]} castShadow>
                   <cylinderGeometry args={[0.06, 0.12, 0.2, 32]} />
                   <meshPhysicalMaterial color="#ffffff" roughness={0.9} clearcoat={0.1} side={THREE.DoubleSide} />
                </mesh>
                <pointLight position={[0.3, 0.35, 0]} intensity={0.8} color="#ffeacc" distance={3} />
             </group>
           ))}
        </group>

        {/* Classic Double-Door Fridge */}
        <group position={[2.4, 0, 2.2]}>
           <RoundedBox args={[1.0, 2.2, 0.8]} radius={0.02} position={[0, 1.1, 0]} castShadow receiveShadow>
              <meshPhysicalMaterial color="#f8fafc" roughness={0.1} clearcoat={1} />
           </RoundedBox>
           {/* Gold Handles */}
           {[-0.05, 0.05].map(x => (
             <mesh key={`fridge-handle-${x}`} position={[x, 1.2, -0.42]} castShadow>
                <cylinderGeometry args={[0.015, 0.015, 0.8]} />
                <meshPhysicalMaterial color="#d4af37" metalness={0.9} roughness={0.2} />
             </mesh>
           ))}
        </group>

        {/* Classic Range / Stove */}
        <group position={[-1.2, 0, -2.2]}>
           <RoundedBox args={[0.9, 0.9, 0.8]} radius={0.02} position={[0, 0.45, 0]} castShadow receiveShadow>
              <meshPhysicalMaterial color="#f8fafc" roughness={0.1} clearcoat={1} />
           </RoundedBox>
           <mesh position={[0, 0.9, 0]}>
              <boxGeometry args={[0.8, 0.05, 0.7]} />
              <meshPhysicalMaterial color="#111" />
           </mesh>
           {/* Range Hood */}
           <mesh position={[0, 2.5, -0.2]} castShadow>
              <boxGeometry args={[1.0, 0.5, 0.6]} />
              <meshPhysicalMaterial color="#f8fafc" roughness={0.1} clearcoat={1} />
           </mesh>
           {/* Gold Hood Trim */}
           <mesh position={[0, 2.25, -0.2]} castShadow>
              <boxGeometry args={[1.02, 0.05, 0.62]} />
              <meshPhysicalMaterial color="#d4af37" metalness={0.9} roughness={0.2} />
           </mesh>
        </group>

        {/* Elegant Runner Rug */}
        <RoundedBox args={[2.5, 0.02, 4.0]} radius={0.01} position={[0, 0.01, 0]} receiveShadow>
           <meshPhysicalMaterial color="#334155" roughness={0.9} />
        </RoundedBox>

        {/* Classic High-Back Stools */}
        {[[-1.8, 0.5], [-1.8, 1.5]].map((pos, idx) => (
           <group key={`stool-${idx}`} position={[pos[0], 0, pos[1]]}>
              <mesh position={[0, 0.35, 0]} castShadow>
                 <cylinderGeometry args={[0.02, 0.02, 0.7]} />
                 <meshPhysicalMaterial color="#d4af37" metalness={0.9} roughness={0.2} />
              </mesh>
              <RoundedBox args={[0.4, 0.05, 0.4]} radius={0.02} position={[0, 0.7, 0]} castShadow>
                 <meshPhysicalMaterial color="#f8fafc" roughness={0.9} />
              </RoundedBox>
           </group>
        ))}
      </group>
    );
  }

  if (designStyle === 4) {
    return (
      <group>
        {/* Neo-Deco Midnight Emerald Kitchen */}
        {/* Pill-shaped Island */}
        <group position={[0, 0, 0]}>
           {/* Base - Pill Shape using Scaled Cylinder */}
           <mesh position={[0, 0.45, 0]} scale={[2.5, 1, 1]} castShadow receiveShadow>
              <cylinderGeometry args={[0.6, 0.6, 0.9, 64]} />
              <meshPhysicalMaterial color="#064e3b" roughness={0.4} clearcoat={0.5} />
           </mesh>
           {/* Gold Marble Countertop - Pill Shape */}
           <mesh position={[0, 0.925, 0]} scale={[3.2 / 1.4, 1, 1]} castShadow receiveShadow>
              <cylinderGeometry args={[0.7, 0.7, 0.05, 64]} />
              <meshPhysicalMaterial map={goldMarbleTexture} roughness={0.1} metalness={0.2} clearcoat={1} />
           </mesh>
           {/* Brass Fluting details (cylinders along the edge) */}
           {Array.from({length: 40}).map((_, i) => (
              <mesh key={`flute-${i}`} position={[1.5 * Math.cos(i/40 * Math.PI * 2), 0.45, 0.6 * Math.sin(i/40 * Math.PI * 2)]} castShadow>
                 <cylinderGeometry args={[0.02, 0.02, 0.88]} />
                 <meshPhysicalMaterial color="#d4af37" metalness={0.9} roughness={0.2} />
              </mesh>
           ))}
        </group>

        {/* Back Wall: Cabinets, Stove, Fridge */}
        <group position={[0, 0, -2.6]}>
           {/* Lower Cabinets (Stops before Fridge) */}
           <RoundedBox args={[4.4, 0.9, 0.8]} radius={0.02} position={[-0.8, 0.45, 0]} castShadow receiveShadow>
              <meshPhysicalMaterial color="#064e3b" roughness={0.4} clearcoat={0.5} />
           </RoundedBox>
           {/* Countertop */}
           <RoundedBox args={[4.4, 0.05, 0.85]} radius={0.02} position={[-0.8, 0.925, 0]} castShadow receiveShadow>
              <meshPhysicalMaterial map={goldMarbleTexture} roughness={0.1} metalness={0.2} clearcoat={1} />
           </RoundedBox>
           
           {/* Professional Stove (Centered on Cabinets) */}
           <group position={[-0.8, 0.95, 0]}>
              <RoundedBox args={[1.2, 0.05, 0.8]} radius={0.01} position={[0, 0.025, 0]} castShadow>
                 <meshPhysicalMaterial color="#111" metalness={0.8} roughness={0.2} />
              </RoundedBox>
              {/* Burners */}
              {[[-0.3, -0.2], [0.3, -0.2], [-0.3, 0.2], [0.3, 0.2], [0, 0]].map((pos, i) => (
                 <mesh key={`burner-${i}`} position={[pos[0], 0.05, pos[1]]} rotation={[Math.PI/2, 0, 0]}>
                    <torusGeometry args={[0.1, 0.01, 16, 32]} />
                    <meshPhysicalMaterial color="#333" metalness={0.9} roughness={0.5} />
                 </mesh>
              ))}
           </group>
           
           {/* Minimalist Range Hood */}
           <group position={[-0.8, 3.5, 0]}>
              <mesh position={[0, -0.2, 0]} castShadow>
                 <boxGeometry args={[1.2, 0.4, 0.8]} />
                 <meshPhysicalMaterial color="#111" metalness={0.8} roughness={0.2} />
              </mesh>
              <mesh position={[0, 0.5, -0.2]} castShadow>
                 <boxGeometry args={[0.4, 1.0, 0.4]} />
                 <meshPhysicalMaterial color="#111" metalness={0.8} roughness={0.2} />
              </mesh>
           </group>

           {/* Integrated Fridge (Right Side) */}
           <group position={[2.2, 0, 0]}>
              <RoundedBox args={[1.2, 2.4, 0.8]} radius={0.02} position={[0, 1.2, 0]} castShadow receiveShadow>
                 <meshPhysicalMaterial color="#064e3b" roughness={0.4} clearcoat={0.5} />
              </RoundedBox>
              {/* Handles */}
              {[-0.1, 0.1].map(x => (
                 <mesh key={`fridge-handle-${x}`} position={[x, 1.2, 0.42]} castShadow>
                    <cylinderGeometry args={[0.015, 0.015, 0.8]} />
                    <meshPhysicalMaterial color="#d4af37" metalness={0.9} roughness={0.2} />
                 </mesh>
              ))}
           </group>

           {/* Floating Brass Shelves (Left Side) */}
           <group position={[-2.2, 0, 0]}>
              {[1.5, 2.0].map(y => (
                 <RoundedBox key={`shelf-${y}`} args={[1.6, 0.05, 0.4]} radius={0.01} position={[0, y, -0.2]} castShadow>
                    <meshPhysicalMaterial color="#d4af37" metalness={0.9} roughness={0.2} />
                 </RoundedBox>
              ))}
           </group>
        </group>

        {/* Abstract Neon Light Fixture */}
        <group position={[0, 3.5, 0]}>
           <mesh rotation={[Math.PI/2, 0, 0]}>
              <torusGeometry args={[1.2, 0.02, 16, 100]} />
              <meshPhysicalMaterial color="#ffffff" emissive="#fbbf24" emissiveIntensity={2} />
           </mesh>
           <mesh rotation={[Math.PI/2, Math.PI/4, 0]}>
              <torusGeometry args={[0.8, 0.02, 16, 100]} />
              <meshPhysicalMaterial color="#ffffff" emissive="#fbbf24" emissiveIntensity={2} />
           </mesh>
           <pointLight intensity={1.5} color="#fef08a" distance={4} />
           <mesh position={[0, 0.5, 0]}>
              <cylinderGeometry args={[0.01, 0.01, 1]} />
              <meshPhysicalMaterial color="#111" />
           </mesh>
        </group>

        {/* Graphic Art Stools */}
        {[[-0.8, 1.0], [0, 1.0], [0.8, 1.0]].map((pos, i) => (
           <group key={`stool-${i}`} position={[pos[0], 0, pos[1]]}>
              <mesh position={[0, 0.35, 0]} castShadow>
                 <cylinderGeometry args={[0.05, 0.15, 0.7]} />
                 <meshPhysicalMaterial color="#111" roughness={0.8} />
              </mesh>
              <mesh position={[0, 0.725, 0]} castShadow>
                 <cylinderGeometry args={[0.2, 0.2, 0.05, 32]} />
                 <meshPhysicalMaterial color="#d4af37" roughness={0.3} /> {/* Golden cushions */}
              </mesh>
           </group>
        ))}
      </group>
    );
  }

  // Design 1 (Original)
  return (
    <group>
      {/* ─── KITCHEN ISLAND ─── */}
      <group position={[0, 0, 0]}>
        {/* Island Base */}
        <RoundedBox args={[2.5, 0.9, 1.2]} radius={0.02} smoothness={4} position={[0, 0.45, 0]} castShadow receiveShadow>
          <meshPhysicalMaterial map={woodTexture} roughness={0.7} />
        </RoundedBox>
        {/* Island Marble Countertop */}
        <RoundedBox args={[2.6, 0.05, 1.3]} radius={0.01} smoothness={4} position={[0, 0.925, 0]} castShadow receiveShadow>
          <meshPhysicalMaterial map={marbleTexture} roughness={0.1} metalness={0.1} clearcoat={1} />
        </RoundedBox>
        
        {/* Induction Cooktop on Island */}
        <RoundedBox args={[0.8, 0.02, 0.5]} radius={0.005} smoothness={2} position={[0, 0.955, 0]} castShadow>
           <meshPhysicalMaterial color="#0a0a0a" roughness={0.05} metalness={0.5} clearcoat={1} />
        </RoundedBox>
        {/* Glowing Cooktop Rings */}
        {[-0.2, 0.2].map(x => [-0.1, 0.1].map(z => (
           <mesh key={`${x}-${z}`} position={[x, 0.966, z]} rotation={[-Math.PI/2, 0, 0]}>
             <ringGeometry args={[0.06, 0.07, 32]} />
             <meshBasicMaterial color="#ef4444" opacity={0.6} transparent />
           </mesh>
        )))}

        {/* Bar Stools */}
        {[[-0.8, 0.8], [0, 0.8], [0.8, 0.8]].map((pos, i) => (
          <group key={i} position={[pos[0], 0, pos[1]]}>
            <mesh position={[0, 0.35, 0]} castShadow>
              <cylinderGeometry args={[0.02, 0.15, 0.7]} />
              <meshPhysicalMaterial color="#222" metalness={0.8} roughness={0.2} />
            </mesh>
            <RoundedBox args={[0.4, 0.05, 0.35]} radius={0.02} smoothness={4} position={[0, 0.7, 0]} castShadow>
              <meshPhysicalMaterial color="#8b5a2b" roughness={0.6} />
            </RoundedBox>
          </group>
        ))}

        {/* Hanging Pendant Lights (Attached to Roof) */}
        {[-0.8, 0, 0.8].map((x, i) => (
          <group key={`pendant-${i}`} position={[x, 4.5, 0]}>
             <mesh position={[0, -1.25, 0]}>
                <cylinderGeometry args={[0.005, 0.005, 2.5]} />
                <meshPhysicalMaterial color="#111" />
             </mesh>
             <mesh position={[0, -2.5, 0]} castShadow>
                <coneGeometry args={[0.15, 0.2, 32]} />
                <meshPhysicalMaterial color="#18181b" roughness={0.2} metalness={0.8} />
             </mesh>
             <mesh position={[0, -2.55, 0]}>
                <sphereGeometry args={[0.04]} />
                <meshBasicMaterial color="#fef08a" />
             </mesh>
          </group>
        ))}


      </group>

      {/* ─── BACK WALL CABINETS & APPLIANCES ─── */}
      <group position={[0, 0, 0]}>
        {/* Tall Stainless Steel Fridge */}
        <RoundedBox args={[1.0, 2.15, 0.65]} radius={0.02} smoothness={4} position={[1.5, 1.075, -2.65]} castShadow receiveShadow>
          <meshPhysicalMaterial color="#d4d4d8" metalness={0.7} roughness={0.3} clearcoat={0.2} />
        </RoundedBox>
        {/* Fridge Handles */}
        <RoundedBox args={[0.02, 0.7, 0.04]} radius={0.01} position={[1.45, 1.2, -2.31]} castShadow>
          <meshPhysicalMaterial color="#f1f5f9" metalness={0.9} roughness={0.1} />
        </RoundedBox>
        <RoundedBox args={[0.02, 0.7, 0.04]} radius={0.01} position={[1.55, 1.2, -2.31]} castShadow>
          <meshPhysicalMaterial color="#f1f5f9" metalness={0.9} roughness={0.1} />
        </RoundedBox>

        {/* Lower Cabinets */}
        {[-1.7, -1.1, 0.1, 0.7].map(x => (
          <group key={`low-${x}`}>
            <RoundedBox args={[0.58, 0.88, 0.58]} radius={0.01} smoothness={4} position={[x, 0.44, -2.7]} castShadow receiveShadow>
              <meshPhysicalMaterial map={woodTexture} roughness={0.7} />
            </RoundedBox>
            {/* Gold Handle */}
            <RoundedBox args={[0.15, 0.015, 0.02]} radius={0.005} position={[x, 0.8, -2.4]} castShadow>
              <meshPhysicalMaterial color="#d4af37" metalness={1} roughness={0.2} />
            </RoundedBox>
          </group>
        ))}

        {/* Built-in Oven (Center Lower) */}
        <RoundedBox args={[0.58, 0.9, 0.58]} radius={0.01} smoothness={4} position={[-0.5, 0.45, -2.7]} castShadow receiveShadow>
           <meshPhysicalMaterial color="#111" metalness={0.8} roughness={0.2} />
        </RoundedBox>
        {/* Oven Window */}
        <RoundedBox args={[0.45, 0.4, 0.02]} radius={0.02} position={[-0.5, 0.42, -2.4]} castShadow>
           <meshPhysicalMaterial color="#000" metalness={0.9} roughness={0.05} clearcoat={1} />
        </RoundedBox>
        {/* Oven Handle */}
        <RoundedBox args={[0.4, 0.02, 0.03]} radius={0.01} position={[-0.5, 0.67, -2.39]} castShadow>
           <meshPhysicalMaterial color="#d4d4d8" metalness={0.8} roughness={0.2} />
        </RoundedBox>

        {/* Back Countertop */}
        <RoundedBox args={[3.0, 0.05, 0.6]} radius={0.01} smoothness={4} position={[-0.5, 0.925, -2.7]} castShadow receiveShadow>
          <meshPhysicalMaterial map={marbleTexture} roughness={0.1} metalness={0.1} clearcoat={1} />
        </RoundedBox>

        {/* Sink & Faucet */}
        <RoundedBox args={[0.7, 0.2, 0.4]} radius={0.05} position={[-1.4, 0.85, -2.7]}>
          <meshPhysicalMaterial color="#e2e8f0" metalness={0.8} roughness={0.2} />
        </RoundedBox>
        <mesh position={[-1.4, 1.1, -2.85]} castShadow>
          <cylinderGeometry args={[0.015, 0.02, 0.3]} />
          <meshPhysicalMaterial color="#d4af37" metalness={1} roughness={0.2} />
        </mesh>
        <mesh position={[-1.4, 1.25, -2.75]} rotation={[Math.PI/2, 0, 0]} castShadow>
          <cylinderGeometry args={[0.015, 0.015, 0.2]} />
          <meshPhysicalMaterial color="#d4af37" metalness={1} roughness={0.2} />
        </mesh>

        {/* Paint Safe Area / Backsplash */}
        <mesh position={[-0.5, 1.4, -2.99]} receiveShadow>
          <planeGeometry args={[3.0, 0.9]} />
          <meshPhysicalMaterial map={backsplashTexture} roughness={0.2} clearcoat={0.5} />
        </mesh>

        {/* Upper Cabinets */}
        {[-1.7, -1.1, 0.1, 0.7].map(x => (
          <group key={`up-${x}`}>
            <RoundedBox args={[0.58, 0.8, 0.35]} radius={0.01} smoothness={4} position={[x, 1.9, -2.825]} castShadow receiveShadow>
              <meshPhysicalMaterial map={woodTexture} roughness={0.7} />
            </RoundedBox>
            {/* Gold Handle */}
            <RoundedBox args={[0.15, 0.015, 0.02]} radius={0.005} position={[x, 1.55, -2.64]} castShadow>
              <meshPhysicalMaterial color="#d4af37" metalness={1} roughness={0.2} />
            </RoundedBox>
          </group>
        ))}

        {/* Stainless Range Hood (Above Oven) */}
        <group position={[-0.5, 2.0, -2.8]}>
           {/* Hood Base */}
           <RoundedBox args={[0.6, 0.15, 0.4]} radius={0.02} castShadow>
             <meshPhysicalMaterial color="#d4d4d8" metalness={0.8} roughness={0.2} />
           </RoundedBox>
           {/* Exhaust Pipe (to Ceiling) */}
           <mesh position={[0, 1.25, 0]} castShadow>
             <cylinderGeometry args={[0.15, 0.15, 2.5]} />
             <meshPhysicalMaterial color="#d4d4d8" metalness={0.8} roughness={0.2} />
           </mesh>
        </group>

      </group>
    </group>
  );
}

// Modern Interior Door
function Door3D() {
  const doorWidth = 0.9;
  const doorHeight = 2.1;
  const frameThickness = 0.08;

  return (
    <group>
      {/* Door Frame (Darker Slate to match bedsheet accent) */}
      <mesh position={[doorWidth/2 + frameThickness/2, doorHeight/2, 0]}>
         <planeGeometry args={[frameThickness, doorHeight + frameThickness]} />
         <meshStandardMaterial color="#0f172a" roughness={0.9} side={THREE.FrontSide} />
      </mesh>
      <mesh position={[-doorWidth/2 - frameThickness/2, doorHeight/2, 0]}>
         <planeGeometry args={[frameThickness, doorHeight + frameThickness]} />
         <meshStandardMaterial color="#0f172a" roughness={0.9} side={THREE.FrontSide} />
      </mesh>
      <mesh position={[0, doorHeight + frameThickness/2, 0]}>
         <planeGeometry args={[doorWidth, frameThickness]} />
         <meshStandardMaterial color="#0f172a" roughness={0.9} side={THREE.FrontSide} />
      </mesh>
      
      {/* Door Panel (Slate Blue/Black to match bedsheet base) */}
      <mesh position={[0, doorHeight/2, -0.01]}>
         <planeGeometry args={[doorWidth, doorHeight]} />
         <meshStandardMaterial color="#1e293b" roughness={0.8} side={THREE.FrontSide} />
      </mesh>

      {/* Modern Metallic Door Handle (Bronze to match bedsheet accents) */}
      <mesh position={[-0.35, 1.05, 0.03]} rotation={[Math.PI/2, 0, 0]}>
         <cylinderGeometry args={[0.015, 0.015, 0.12]} />
         <meshPhysicalMaterial color="#8B6508" metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh position={[-0.35, 1.05, 0.01]} rotation={[0, 0, 0]}>
         <cylinderGeometry args={[0.01, 0.01, 0.04]} />
         <meshPhysicalMaterial color="#8B6508" metalness={0.8} roughness={0.2} />
      </mesh>
    </group>
  );
}

// Minimalist Wall Mirror
function Mirror3D() {
  return (
    <group>
      {/* Frame */}
      <mesh position={[0, 0, 0.02]}>
        <boxGeometry args={[0.8, 1.2, 0.04]} />
        <meshStandardMaterial color="#8B6508" metalness={0.8} roughness={0.2} />
      </mesh>
      {/* Glass */}
      <mesh position={[0, 0, 0.045]}>
        <planeGeometry args={[0.76, 1.16]} />
        <meshPhysicalMaterial color="#ffffff" metalness={1} roughness={0} clearcoat={1} />
      </mesh>
    </group>
  );
}

export default function Room3D({ designStyle, selectedSurface, onSelectSurface, customFurniture = [] }: Props) {
  const roomDimensions = useDesignStore(s => s.roomDimensions);
  const placedObjects = useDesignStore(s => s.placedObjects);
  
  const roomWidth = roomDimensions.width;
  const roomDepth = roomDimensions.length;
  const wallHeight = roomDimensions.height;


  // Generate a modern 2026 aesthetic ceiling texture (Acoustic Wood Slats + Linear LEDs)
  const modern2026CeilingTexture = useMemo(() => TextureCache.getModernCeiling(), []);

  return (
    <group>
      {/* Floor */}
      <TileSurface3D 
        surfaceId="floor"
        label="Floor"
        width={roomWidth + 0.04}
        height={roomDepth + 0.04}
        position={[0, 0, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        isSelected={selectedSurface === 'floor'}
        onSelect={() => onSelectSurface('floor')}
      />



      {/* Back Wall */}
      <group position={[0, 0, -roomDepth / 2]}>
        <TileSurface3D 
          surfaceId="back-wall"
          label="Back Wall"
          width={roomWidth + 0.04}
          height={wallHeight + 0.04}
          position={[0, wallHeight / 2, 0]}
          rotation={[0, 0, 0]}
          isSelected={selectedSurface === 'back-wall'}
          onSelect={() => onSelectSurface('back-wall')}
        />
      </group>

      {/* Left Wall */}
      <group position={[-roomWidth / 2, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
        <TileSurface3D 
          surfaceId="left-wall"
          label="Left Wall"
          width={roomDepth + 0.04}
          height={wallHeight + 0.04}
          position={[0, wallHeight / 2, 0]}
          rotation={[0, 0, 0]}
          isSelected={selectedSurface === 'left-wall'}
          onSelect={() => onSelectSurface('left-wall')}
        />
      </group>

      {/* Right Wall */}
      <group position={[roomWidth / 2, 0, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <TileSurface3D 
          surfaceId="right-wall"
          label="Right Wall"
          width={roomDepth + 0.04}
          height={wallHeight + 0.04}
          position={[0, wallHeight / 2, 0]}
          rotation={[0, 0, 0]}
          isSelected={selectedSurface === 'right-wall'}
          onSelect={() => onSelectSurface('right-wall')}
        />
      </group>

      {/* ─── 2026 ULTRA-MODERN CEILING ─── */}
      <group position={[0, wallHeight, 0]}>
         {/* Main Flat Ceiling (Recessed) - Modern 2026 Slatted Wood */}
         {/* REMOVED THREE.DoubleSide so the ceiling is INVISIBLE from above, letting you see into the room! */}
         <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
            <planeGeometry args={[roomWidth, roomDepth]} />
            <meshStandardMaterial map={modern2026CeilingTexture} roughness={0.8} />
         </mesh>

         {/* Dropped Border (Tray Rim) - Sleek Matte Black architectural trim */}
         <RoundedBox args={[0.6, 0.15, roomDepth]} radius={0.01} position={[-roomWidth/2 + 0.3, -0.075, 0]}>
            <meshStandardMaterial color="#18181b" roughness={0.9} />
         </RoundedBox>
         <RoundedBox args={[0.6, 0.15, roomDepth]} radius={0.01} position={[roomWidth/2 - 0.3, -0.075, 0]}>
            <meshStandardMaterial color="#18181b" roughness={0.9} />
         </RoundedBox>
         <RoundedBox args={[roomWidth - 1.2, 0.15, 0.6]} radius={0.01} position={[0, -0.075, -roomDepth/2 + 0.3]}>
            <meshStandardMaterial color="#18181b" roughness={0.9} />
         </RoundedBox>
         <RoundedBox args={[roomWidth - 1.2, 0.15, 0.6]} radius={0.01} position={[0, -0.075, roomDepth/2 - 0.3]}>
            <meshStandardMaterial color="#18181b" roughness={0.9} />
         </RoundedBox>

         {/* LED Cove Lighting - Cool modern white glow */}
         <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, -0.02, 0]}>
            <planeGeometry args={[roomWidth - 1.15, roomDepth - 1.15]} />
            <meshBasicMaterial color="#e0f2fe" transparent opacity={0.15} />
         </mesh>
      </group>

      {/* Front Wall */}
      <group position={[0, 0, roomDepth / 2]} rotation={[0, Math.PI, 0]}>
        <TileSurface3D 
          surfaceId="front-wall"
          label="Front Wall"
          width={roomWidth + 0.04}
          height={wallHeight + 0.04}
          position={[0, wallHeight / 2, 0]}
          rotation={[0, 0, 0]}
          isSelected={selectedSurface === 'front-wall'}
          onSelect={() => onSelectSurface('front-wall')}
        />
      </group>

      {/* Furniture handled by Placed Interactive Furniture */}

      {/* AI Furniture Cutouts */}
      <Suspense fallback={null}>
         {customFurniture.map((url, idx) => (
            <CustomFurniturePiece key={url} url={url} index={idx} />
         ))}
      </Suspense>

      {/* Placed Interactive Furniture */}
      {placedObjects.map(obj => (
        <DraggableFurniture 
          key={obj.id} 
          id={obj.id} 
          assetType={obj.assetType}
          position={obj.position} 
          rotation={obj.rotation}
          scale={obj.scale}
        >
          {obj.assetType === 'BedroomFurniture' && <BedroomFurniture designStyle={designStyle} />}
          {obj.assetType === 'KitchenFurniture' && <KitchenFurniture designStyle={designStyle} />}
          {obj.assetType === 'BathroomFurniture' && <BathroomFurniture designStyle={designStyle} />}
          {obj.assetType === 'Door' && <Door3D />}
          {obj.assetType === 'Mirror' && <Mirror3D />}
          
          {/* Individual Granular Assets and Uploaded GLB Models */}
          {obj.assetType.startsWith('glb:') && (
            <Suspense fallback={
              <mesh>
                <boxGeometry args={[0.5, 0.5, 0.5]} />
                <meshStandardMaterial color="#14b8a6" wireframe />
              </mesh>
            }>
              <RealFixture assetType={obj.assetType} />
            </Suspense>
          )}
        </DraggableFurniture>
      ))}
    </group>
  );
}
