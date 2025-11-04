import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface EnemyProps {
  position: [number, number, number];
  speed: number;
  onClick: () => void;
  playerPosition: THREE.Vector3;
}

export const Enemy = ({ position, speed, onClick, playerPosition }: EnemyProps) => {
  const groupRef = useRef<THREE.Group>(null);
  const bodyMaterialRef = useRef<THREE.MeshStandardMaterial>(null);
  const headMaterialRef = useRef<THREE.MeshStandardMaterial>(null);

  useFrame(() => {
    if (groupRef.current) {
      // Follow the player's position
      const direction = new THREE.Vector3(
        playerPosition.x - groupRef.current.position.x,
        0,
        playerPosition.z - groupRef.current.position.z
      ).normalize();
      
      groupRef.current.position.add(direction.multiplyScalar(speed));
      
      // Make enemy look at player
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
