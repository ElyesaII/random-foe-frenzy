interface ObstacleProps {
  position: [number, number, number];
  size?: [number, number, number];
  color?: string;
}

export const Obstacle = ({ 
  position, 
  size = [2, 3, 2],
  color = '#555555'
}: ObstacleProps) => {
  return (
    <mesh position={position} castShadow receiveShadow>
      <boxGeometry args={size} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
};
