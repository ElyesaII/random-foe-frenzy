import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { ObstacleData } from './Game';

interface PlayerProps {
  onPositionChange: (position: THREE.Vector3) => void;
  obstacles: ObstacleData[];
}

export const Player = ({ onPositionChange, obstacles }: PlayerProps) => {
  const checkCollision = (newPos: THREE.Vector3): boolean => {
    const playerRadius = 0.5;
    
    for (const obstacle of obstacles) {
      const [ox, oy, oz] = obstacle.position;
      const [sx, sy, sz] = obstacle.size;
      
      // Vérification de collision avec boîte englobante
      const minX = ox - sx / 2;
      const maxX = ox + sx / 2;
      const minZ = oz - sz / 2;
      const maxZ = oz + sz / 2;
      
      if (
        newPos.x + playerRadius > minX &&
        newPos.x - playerRadius < maxX &&
        newPos.z + playerRadius > minZ &&
        newPos.z - playerRadius < maxZ
      ) {
        return true; // Collision détectée
      }
    }
    
    return false; // Pas de collision
  };
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

    // Calcul de la nouvelle position
    const newPosition = position.current.clone().add(velocity.current);
    newPosition.x = Math.max(-45, Math.min(45, newPosition.x));
    newPosition.z = Math.max(-45, Math.min(45, newPosition.z));

    // Vérification des collisions avant de bouger
    if (!checkCollision(newPosition)) {
      position.current.copy(newPosition);
    } else {
      // Essaie de glisser le long de l'obstacle
      const slideX = position.current.clone();
      slideX.x = newPosition.x;
      if (!checkCollision(slideX)) {
        position.current.x = slideX.x;
      }
      
      const slideZ = position.current.clone();
      slideZ.z = newPosition.z;
      if (!checkCollision(slideZ)) {
        position.current.z = slideZ.z;
      }
    }

    // Update camera position
    state.camera.position.x = position.current.x;
    state.camera.position.z = position.current.z;

    onPositionChange(position.current);
  });

  return null;
};
