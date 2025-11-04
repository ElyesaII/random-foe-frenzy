import { Canvas } from '@react-three/fiber';
import { PointerLockControls, Sky } from '@react-three/drei';
import { useState, useCallback, useRef, useEffect } from 'react';
import { Enemy } from './Enemy';
import { HUD } from './HUD';
import { Crosshair } from './Crosshair';
import { Player } from './Player';
import { Obstacle } from './Obstacle';
import * as THREE from 'three';

interface EnemyData {
  id: number;
  position: [number, number, number];
  speed: number;
}

export const Game = () => {
  const [score, setScore] = useState(0);
  const [health, setHealth] = useState(100);
  const [enemies, setEnemies] = useState<EnemyData[]>([]);
  const [gameOver, setGameOver] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const playerPosition = useRef(new THREE.Vector3(0, 1.6, 0));
  const enemyIdCounter = useRef(0);
  const spawnInterval = useRef<NodeJS.Timeout>();
  const damageInterval = useRef<NodeJS.Timeout>();

  const obstacles = [
    { position: [10, 1.5, 10] as [number, number, number], size: [3, 3, 3] as [number, number, number] },
    { position: [-10, 1.5, 10] as [number, number, number], size: [2, 3, 2] as [number, number, number] },
    { position: [10, 1.5, -10] as [number, number, number], size: [2, 3, 4] as [number, number, number] },
    { position: [-10, 1.5, -10] as [number, number, number], size: [3, 3, 2] as [number, number, number] },
    { position: [0, 1.5, 15] as [number, number, number], size: [4, 3, 2] as [number, number, number] },
    { position: [0, 1.5, -15] as [number, number, number], size: [2, 3, 4] as [number, number, number] },
    { position: [15, 1.5, 0] as [number, number, number], size: [2, 3, 3] as [number, number, number] },
    { position: [-15, 1.5, 0] as [number, number, number], size: [3, 3, 2] as [number, number, number] },
  ];

  const spawnEnemy = useCallback(() => {
    const angle = Math.random() * Math.PI * 2;
    const distance = 30 + Math.random() * 20;
    const x = Math.cos(angle) * distance;
    const z = Math.sin(angle) * distance;
    
    const newEnemy: EnemyData = {
      id: enemyIdCounter.current++,
      position: [x, 1, z],
      speed: 0.03 + Math.random() * 0.02,
    };
    
    setEnemies(prev => [...prev, newEnemy]);
  }, []);

  useEffect(() => {
    if (!gameOver && isLocked) {
      spawnInterval.current = setInterval(() => {
        spawnEnemy();
      }, 2000);

      damageInterval.current = setInterval(() => {
        setEnemies(current => {
          const closeEnemies = current.filter(enemy => {
            const dx = enemy.position[0] - playerPosition.current.x;
            const dz = enemy.position[2] - playerPosition.current.z;
            const distance = Math.sqrt(dx ** 2 + dz ** 2);
            return distance < 3;
          });
          
          if (closeEnemies.length > 0) {
            setHealth(h => {
              const newHealth = Math.max(0, h - 5);
              if (newHealth === 0) {
                setGameOver(true);
              }
              return newHealth;
            });
          }
          
          return current;
        });
      }, 500);
    }

    return () => {
      if (spawnInterval.current) clearInterval(spawnInterval.current);
      if (damageInterval.current) clearInterval(damageInterval.current);
    };
  }, [gameOver, isLocked, spawnEnemy]);

  const handleEnemyClick = useCallback((enemyId: number) => {
    setEnemies(prev => prev.filter(enemy => enemy.id !== enemyId));
    setScore(s => s + 10);
  }, []);

  const handleRestart = useCallback(() => {
    setScore(0);
    setHealth(100);
    setEnemies([]);
    setGameOver(false);
    enemyIdCounter.current = 0;
  }, []);

  const handlePointerLockChange = useCallback(() => {
    setIsLocked(document.pointerLockElement !== null);
  }, []);

  useEffect(() => {
    document.addEventListener('pointerlockchange', handlePointerLockChange);
    return () => {
      document.removeEventListener('pointerlockchange', handlePointerLockChange);
    };
  }, [handlePointerLockChange]);

  return (
    <div className="relative w-full h-screen bg-background">
      <Canvas camera={{ position: [0, 1.6, 0], fov: 75 }}>
        <Sky sunPosition={[100, 20, 100]} />
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        
        {/* Ground */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
          <planeGeometry args={[100, 100]} />
          <meshStandardMaterial color="#2a4a2a" />
        </mesh>

        {/* Grid */}
        <gridHelper args={[100, 50, '#4a6a4a', '#3a5a3a']} position={[0, 0.01, 0]} />

        {/* Obstacles */}
        {obstacles.map((obstacle, index) => (
          <Obstacle
            key={index}
            position={obstacle.position}
            size={obstacle.size}
          />
        ))}

        {/* Enemies */}
        {enemies.map(enemy => (
          <Enemy
            key={enemy.id}
            position={enemy.position}
            speed={enemy.speed}
            onClick={() => handleEnemyClick(enemy.id)}
            playerPosition={playerPosition.current}
          />
        ))}

        <Player onPositionChange={(pos) => playerPosition.current.copy(pos)} />
        <PointerLockControls />
      </Canvas>

      <HUD score={score} health={health} gameOver={gameOver} onRestart={handleRestart} />
      <Crosshair />

      {!isLocked && !gameOver && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/70 z-40">
          <div className="text-center space-y-4">
            <h2 className="text-4xl font-bold text-foreground">FPS SHOOTER</h2>
            <p className="text-muted-foreground">Cliquez pour commencer</p>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>🎯 Cliquez pour tirer sur les ennemis</p>
              <p>⬆️⬇️⬅️➡️ Flèches pour se déplacer</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
