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
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.MeshStandardMaterial>(null);

  useFrame(() => {
    if (meshRef.current) {
      // Follow the player's position
      const direction = new THREE.Vector3(
        playerPosition.x - meshRef.current.position.x,
        0,
        playerPosition.z - meshRef.current.position.z
      ).normalize();
      
      meshRef.current.position.add(direction.multiplyScalar(speed));
      
      // Make enemy look at player
      meshRef.current.lookAt(playerPosition.x, playerPosition.y, playerPosition.z);
    }
  });

  const handleClick = (e: any) => {
    e.stopPropagation();
    
    // Flash effect
    if (materialRef.current) {
      materialRef.current.color.set('#ff0000');
      setTimeout(() => {
        if (materialRef.current) {
          materialRef.current.color.set('#ff4444');
        }
      }, 50);
    }
    
    onClick();
  };

  return (
    <group position={position}>
      {/* Body */}
      <mesh ref={meshRef} onClick={handleClick} castShadow>
        <boxGeometry args={[0.8, 1.6, 0.4]} />
        <meshStandardMaterial ref={materialRef} color="#ff4444" />
      </mesh>
      
      {/* Head */}
      <mesh position={[0, 1.2, 0]} onClick={handleClick} castShadow>
        <sphereGeometry args={[0.4, 16, 16]} />
        <meshStandardMaterial color="#ff6666" />
      </mesh>
    </group>
  );
};
