import React, { useEffect, useRef } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { Environment, useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { useDesignStore } from '../store/useDesignStore';

class ThumbnailErrorBoundary extends React.Component<{children: React.ReactNode, onError: () => void}, {hasError: boolean}> {
  constructor(props: {children: React.ReactNode, onError: () => void}) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error: any) {
    console.error("Thumbnail generation failed:", error);
    this.props.onError(); // skip this model
  }
  render() {
    if (this.state.hasError) {
      return null;
    }
    return this.props.children;
  }
}

function ModelRenderer({ url, onRendered }: { url: string, onRendered: (dataUrl: string) => void }) {
  const encodedUrl = encodeURI(url.replace('glb:', '/models/') + '.glb');
  const { scene } = useGLTF(encodedUrl);
  const gl = useThree(s => s.gl);
  const camera = useThree(s => s.camera) as THREE.PerspectiveCamera;
  const sceneRoot = useThree(s => s.scene);
  const sceneRef = useRef<THREE.Group>(null);
  
  // Keep the latest onRendered callback in a ref to avoid infinite loops in useEffect
  const onRenderedRef = useRef(onRendered);
  useEffect(() => {
    onRenderedRef.current = onRendered;
  }, [onRendered]);

  useEffect(() => {
    if (!sceneRef.current || !scene) return;

    const timer = setTimeout(() => {
      requestAnimationFrame(() => {
        if (!sceneRef.current) return;
        
        const box = new THREE.Box3().setFromObject(sceneRef.current);
        const size = box.getSize(new THREE.Vector3());
        const center = box.getCenter(new THREE.Vector3());
        
        const maxDim = Math.max(size.x, size.y, size.z);
        const fov = camera.fov * (Math.PI / 180);
        let cameraZ = Math.abs(maxDim / 2 / Math.tan(fov / 2));
        cameraZ *= 1.8;
        
        camera.position.set(center.x + cameraZ * 0.7, center.y + cameraZ * 0.6, center.z + cameraZ);
        camera.lookAt(center);
        camera.updateProjectionMatrix();

        gl.render(sceneRoot, camera);
        
        const dataUrl = gl.domElement.toDataURL('image/png');
        onRenderedRef.current(dataUrl);
      });
    }, 150); // Small throttle to prevent freezing UI

    return () => clearTimeout(timer);
  }, [scene, gl, camera, sceneRoot]); // Remove onRendered from deps!

  return (
    <group ref={sceneRef}>
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
      <Canvas gl={{ preserveDrawingBuffer: true, alpha: true }} camera={{ fov: 45 }}>
        <ambientLight intensity={1.5} />
        <directionalLight position={[5, 10, 5]} intensity={1.5} />
        <Environment preset="city" />
        
        {currentUrl && (
          <ThumbnailErrorBoundary key={currentUrl} onError={() => popThumbnailQueue()}>
            <React.Suspense fallback={null}>
              <ModelRenderer 
                url={currentUrl} 
                onRendered={(data) => {
                  addThumbnail(currentUrl, data);
                  popThumbnailQueue();
                }} 
              />
            </React.Suspense>
          </ThumbnailErrorBoundary>
        )}
      </Canvas>
    </div>
  );
}
