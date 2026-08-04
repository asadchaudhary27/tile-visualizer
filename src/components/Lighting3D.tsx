import { ContactShadows } from '@react-three/drei';
import { useDesignStore } from '../store/useDesignStore';

export default function Lighting3D() {
  const lightingMode = useDesignStore(s => s.lightingMode);

  return (
    <group>
      {lightingMode === 'daylight' && (
        <>
          <ambientLight intensity={1.5} color="#ffffff" />
          <pointLight position={[0, 4, 0]} intensity={2.0} distance={15} color="#ffffff" />
          <directionalLight 
            position={[5, 10, 5]} 
            intensity={1.2} 
            color="#ffeedd"
            castShadow 
            shadow-mapSize={[2048, 2048]} 
            shadow-bias={-0.0005}
          />
          <directionalLight position={[-5, 5, -5]} intensity={0.8} color="#dbeafe" />
        </>
      )}

      {lightingMode === 'warm' && (
        <>
          <ambientLight intensity={1.0} color="#ffedd5" />
          <pointLight position={[0, 3, 0]} intensity={2.5} distance={20} color="#fcd34d" castShadow />
          <pointLight position={[-3, 2, -3]} intensity={1.5} distance={10} color="#fbbf24" />
          <directionalLight 
            position={[4, 8, 4]} 
            intensity={0.8} 
            color="#fed7aa"
            castShadow 
            shadow-mapSize={[2048, 2048]} 
            shadow-bias={-0.0005}
          />
        </>
      )}

      {lightingMode === 'spot' && (
        <>
          <ambientLight intensity={0.2} color="#ffffff" />
          <spotLight 
            position={[0, 8, 0]} 
            angle={0.6} 
            penumbra={0.5} 
            intensity={5.0} 
            color="#ffffff" 
            castShadow 
            shadow-mapSize={[2048, 2048]}
            shadow-bias={-0.0005}
          />
          <spotLight position={[-4, 6, -4]} angle={0.4} penumbra={0.8} intensity={3.0} color="#e0f2fe" castShadow />
        </>
      )}

      {/* Contact Shadows to ground furniture and walls to the floor tiles */}
      <ContactShadows 
        position={[0, 0, 0]} 
        opacity={0.8} 
        scale={20} 
        blur={2.5} 
        far={2} 
        resolution={512}
        color="#1a1a1a"
      />
    </group>
  );
}
