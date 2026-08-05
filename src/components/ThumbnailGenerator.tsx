import React, { useEffect, useRef } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { Environment, useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { useDesignStore } from '../store/useDesignStore';

function ModelRenderer({ url, onRendered }: { url: string, onRendered: (dataUrl: string) => void }) {
  // Always encode URL to fix paths with spaces or special characters
  const encodedUrl = encodeURI(url.replace('glb:', '/models/') + '.glb');
  const { scene } = useGLTF(encodedUrl);
  const gl = useThree(s => s.gl);
  const camera = useThree(s => s.camera) as THREE.PerspectiveCamera;
  const sceneRef = useRef<THREE.Group>(null);

  useEffect(() => {
    if (!sceneRef.current || !scene) return;

    // Wait a frame for geometry to initialize
    requestAnimationFrame(() => {
      if (!sceneRef.current) return;
      
      // Calculate world bounds of the model
      const box = new THREE.Box3().setFromObject(sceneRef.current);
      const size = box.getSize(new THREE.Vector3());
      const center = box.getCenter(new THREE.Vector3());
      
      const maxDim = Math.max(size.x, size.y, size.z);
      
      // Adjust camera to fit
      const fov = camera.fov * (Math.PI / 180);
      let cameraZ = Math.abs(maxDim / 2 / Math.tan(fov / 2));
      cameraZ *= 1.8; // zoom out slightly
      
      // Position camera slightly offset for a 3/4 isometric-ish view
      camera.position.set(center.x + cameraZ * 0.7, center.y + cameraZ * 0.6, center.z + cameraZ);
      camera.lookAt(center);
      camera.updateProjectionMatrix();

      // Force render
      gl.render(useThree.getState().scene, camera);
      
      // Grab data URI
      const dataUrl = gl.domElement.toDataURL('image/png');
      onRendered(dataUrl);
    });
  }, [scene, gl, camera, onRendered]);

  return (
    <group ref={sceneRef}>
      {/* Clone the scene so we don't accidentally mutate the cached scene graph */}
      <primitive object={scene.clone()} />
    </group>
  );
}

export default function ThumbnailGenerator() {
  const thumbnailQueue = useDesignStore(s => s.thumbnailQueue);
  const addThumbnail = useDesignStore(s => s.addThumbnail);
  const popThumbnailQueue = useDesignStore(s => s.popThumbnailQueue);
  
  const currentUrl = thumbnailQueue.length > 0 ? thumbnailQueue[0] : null;

  return (
    <div style={{ position: 'fixed', top: -9999, left: -9999, width: 256, height: 256, visibility: 'hidden', pointerEvents: 'none' }}>
      {currentUrl && (
        <Canvas gl={{ preserveDrawingBuffer: true, alpha: true }} camera={{ fov: 45 }}>
          <ambientLight intensity={1.5} />
          <directionalLight position={[5, 10, 5]} intensity={1.5} />
          <Environment preset="city" />
          <React.Suspense fallback={null}>
            <ModelRenderer 
              url={currentUrl} 
              onRendered={(data) => {
                addThumbnail(currentUrl, data);
                // Move to next in queue
                popThumbnailQueue();
              }} 
            />
          </React.Suspense>
        </Canvas>
      )}
    </div>
  );
}
