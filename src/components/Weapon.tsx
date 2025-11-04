import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import * as THREE from 'three';

export const Weapon = () => {
  const weaponRef = useRef<THREE.Group>(null);

  useFrame(({ camera }) => {
    if (weaponRef.current) {
      // Position the weapon relative to the camera
      const offset = new THREE.Vector3(0.3, -0.4, -0.8);
      offset.applyQuaternion(camera.quaternion);
      weaponRef.current.position.copy(camera.position).add(offset);
      weaponRef.current.quaternion.copy(camera.quaternion);
    }
  });

  return (
    <group ref={weaponRef}>
      {/* Gun body */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[0.08, 0.12, 0.4]} />
        <meshStandardMaterial color="#333333" metalness={0.8} roughness={0.2} />
      </mesh>
      
      {/* Gun barrel */}
      <mesh position={[0, 0.03, -0.3]}>
        <cylinderGeometry args={[0.02, 0.02, 0.2, 8]} />
        <meshStandardMaterial color="#222222" metalness={0.9} roughness={0.1} />
      </mesh>
      
      {/* Gun handle */}
      <mesh position={[0, -0.08, 0.05]} rotation={[0.3, 0, 0]}>
        <boxGeometry args={[0.06, 0.15, 0.06]} />
        <meshStandardMaterial color="#444444" />
      </mesh>
      
      {/* Gun sight */}
      <mesh position={[0, 0.08, -0.05]}>
        <boxGeometry args={[0.03, 0.02, 0.03]} />
        <meshStandardMaterial color="#ff4444" emissive="#ff0000" emissiveIntensity={0.5} />
      </mesh>
    </group>
  );
};
