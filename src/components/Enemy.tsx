import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { ObstacleData } from './Game';

interface EnemyProps {
  position: [number, number, number];
  speed: number;
  onClick: () => void;
  playerPosition: THREE.Vector3;
  obstacles: ObstacleData[];
}

export const Enemy = ({ position, speed, onClick, playerPosition, obstacles }: EnemyProps) => {
  const groupRef = useRef<THREE.Group>(null);
  const bodyMaterialRef = useRef<THREE.MeshStandardMaterial>(null);
  const headMaterialRef = useRef<THREE.MeshStandardMaterial>(null);

  const checkCollision = (newPos: THREE.Vector3): boolean => {
    const enemyRadius = 0.5;
    
    for (const obstacle of obstacles) {
      const [ox, oy, oz] = obstacle.position;
      const [sx, sy, sz] = obstacle.size;
      
      const minX = ox - sx / 2;
      const maxX = ox + sx / 2;
      const minZ = oz - sz / 2;
      const maxZ = oz + sz / 2;
      
      if (
        newPos.x + enemyRadius > minX &&
        newPos.x - enemyRadius < maxX &&
        newPos.z + enemyRadius > minZ &&
        newPos.z - enemyRadius < maxZ
      ) {
        return true;
      }
    }
    
    return false;
  };

  useFrame(() => {
    if (groupRef.current) {
      // Direction vers le joueur
      const direction = new THREE.Vector3(
        playerPosition.x - groupRef.current.position.x,
        0,
        playerPosition.z - groupRef.current.position.z
      ).normalize();
      
      // Calcul de la nouvelle position
      const newPosition = groupRef.current.position.clone().add(direction.multiplyScalar(speed));
      
      // Vérifie la collision avant de bouger
      if (!checkCollision(newPosition)) {
        groupRef.current.position.copy(newPosition);
      }
      
      // Regarde toujours le joueur
      groupRef.current.lookAt(playerPosition.x, playerPosition.y, playerPosition.z);
    }
  });

  const handleClick = (e: any) => {
    e.stopPropagation();
    
    // Flash effect
    if (bodyMaterialRef.current) {
      bodyMaterialRef.current.color.set('#ff0000');
    }
    if (headMaterialRef.current) {
      headMaterialRef.current.color.set('#ff0000');
    }
    
    setTimeout(() => {
      if (bodyMaterialRef.current) {
        bodyMaterialRef.current.color.set('#ff4444');
      }
      if (headMaterialRef.current) {
        headMaterialRef.current.color.set('#ff6666');
      }
    }, 50);
    
    onClick();
  };

  return (
    <group ref={groupRef} position={position}>
      {/* Body */}
      <mesh onClick={handleClick} castShadow>
        <boxGeometry args={[0.8, 1.6, 0.4]} />
        <meshStandardMaterial ref={bodyMaterialRef} color="#ff4444" />
      </mesh>
      
      {/* Head */}
      <mesh position={[0, 1.2, 0]} onClick={handleClick} castShadow>
        <sphereGeometry args={[0.4, 16, 16]} />
        <meshStandardMaterial ref={headMaterialRef} color="#ff6666" />
      </mesh>
    </group>
  );
};
