import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface EnemyProps {
  position: [number, number, number];
  speed: number;
  onClick: () => void;
}

export const Enemy = ({ position, speed, onClick }: EnemyProps) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.MeshStandardMaterial>(null);

  useFrame(() => {
    if (meshRef.current) {
      const direction = new THREE.Vector3(0, 0, 0).sub(meshRef.current.position).normalize();
      meshRef.current.position.add(direction.multiplyScalar(speed));
      
      // Make enemy look at player
      meshRef.current.lookAt(0, 1.6, 0);
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
