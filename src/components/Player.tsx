import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface PlayerProps {
  onPositionChange: (position: THREE.Vector3) => void;
}

export const Player = ({ onPositionChange }: PlayerProps) => {
  const position = useRef(new THREE.Vector3(0, 1.6, 0));
  const velocity = useRef(new THREE.Vector3());
  const keys = useRef({
    forward: false,
    backward: false,
    left: false,
    right: false,
  });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
        case 'z':
        case 'Z':
          keys.current.forward = true;
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          keys.current.backward = true;
          break;
        case 'ArrowLeft':
        case 'q':
        case 'Q':
          keys.current.left = true;
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          keys.current.right = true;
          break;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
        case 'z':
        case 'Z':
          keys.current.forward = false;
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          keys.current.backward = false;
          break;
        case 'ArrowLeft':
        case 'q':
        case 'Q':
          keys.current.left = false;
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          keys.current.right = false;
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  useFrame((state) => {
    const speed = 0.1;
    const direction = new THREE.Vector3();

    // Get camera direction
    const cameraDirection = new THREE.Vector3();
    state.camera.getWorldDirection(cameraDirection);
    cameraDirection.y = 0;
    cameraDirection.normalize();

    // Get camera right direction
    const cameraRight = new THREE.Vector3();
    cameraRight.crossVectors(cameraDirection, new THREE.Vector3(0, 1, 0));

    // Calculate movement based on camera direction
    if (keys.current.forward) {
      direction.add(cameraDirection);
    }
    if (keys.current.backward) {
      direction.sub(cameraDirection);
    }
    if (keys.current.left) {
      direction.sub(cameraRight);
    }
    if (keys.current.right) {
      direction.add(cameraRight);
    }

    if (direction.length() > 0) {
      direction.normalize();
      velocity.current.lerp(direction.multiplyScalar(speed), 0.3);
    } else {
      velocity.current.lerp(new THREE.Vector3(), 0.3);
    }

    // Update position with boundaries
    position.current.add(velocity.current);
    position.current.x = Math.max(-45, Math.min(45, position.current.x));
    position.current.z = Math.max(-45, Math.min(45, position.current.z));

    // Update camera position
    state.camera.position.x = position.current.x;
    state.camera.position.z = position.current.z;

    onPositionChange(position.current);
  });

  return null;
};
