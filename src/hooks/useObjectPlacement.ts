import { useCallback } from 'react';
import * as THREE from 'three';
import { useDesignStore } from '../store/useDesignStore';

export function useObjectPlacement(objectId: string) {
  const roomDimensions = useDesignStore(s => s.roomDimensions);
  const updateObjectTransform = useDesignStore(s => s.updateObjectTransform);

  const constrainPosition = useCallback((pos: THREE.Vector3) => {
    // We assume the room floor is from -width/2 to width/2 and -length/2 to length/2
    const minX = -roomDimensions.width / 2;
    const maxX = roomDimensions.width / 2;
    const minZ = -roomDimensions.length / 2;
    const maxZ = roomDimensions.length / 2;

    return new THREE.Vector3(
      Math.max(minX, Math.min(maxX, pos.x)),
      pos.y,
      Math.max(minZ, Math.min(maxZ, pos.z))
    );
  }, [roomDimensions]);

  const handleDrag = useCallback((localMatrix: THREE.Matrix4) => {
    const position = new THREE.Vector3();
    const quaternion = new THREE.Quaternion();
    const scale = new THREE.Vector3();

    localMatrix.decompose(position, quaternion, scale);

    const constrainedPos = constrainPosition(position);
    const euler = new THREE.Euler().setFromQuaternion(quaternion, 'YXZ');

    updateObjectTransform(
      objectId, 
      [constrainedPos.x, constrainedPos.y, constrainedPos.z], 
      [0, euler.y, 0] // Constrain rotation to Y axis only
    );
  }, [objectId, constrainPosition, updateObjectTransform]);

  return { handleDrag, constrainPosition };
}
