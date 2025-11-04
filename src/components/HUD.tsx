import { Button } from './ui/button';

interface HUDProps {
  score: number;
  health: number;
  gameOver: boolean;
  onRestart: () => void;
}

export const HUD = ({ score, health, gameOver, onRestart }: HUDProps) => {
  return (
    <>
      {/* Top HUD */}
      <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-start z-30 pointer-events-none">
        <div className="bg-card/80 backdrop-blur-sm border border-border rounded-lg p-4 space-y-2">
          <div className="text-sm text-muted-foreground uppercase tracking-wider">Score</div>
          <div className="text-3xl font-bold text-primary">{score}</div>
        </div>

        <div className="bg-card/80 backdrop-blur-sm border border-border rounded-lg p-4 space-y-2">
          <div className="text-sm text-muted-foreground uppercase tracking-wider">Vie</div>
          <div className="flex items-center gap-2">
            <div className="text-3xl font-bold text-destructive">{health}%</div>
            <div className="w-32 h-3 bg-secondary rounded-full overflow-hidden">
              <div 
                className="h-full bg-destructive transition-all duration-300"
                style={{ width: `${health}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Game Over Screen */}
      {gameOver && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/80 z-40">
          <div className="bg-card border-2 border-destructive rounded-lg p-8 space-y-6 text-center max-w-md">
            <h2 className="text-5xl font-bold text-destructive">GAME OVER</h2>
            <div className="space-y-2">
              <p className="text-xl text-muted-foreground">Score Final</p>
              <p className="text-4xl font-bold text-primary">{score}</p>
            </div>
            <Button 
              onClick={onRestart}
              className="w-full pointer-events-auto bg-primary hover:bg-primary/90 text-primary-foreground"
              size="lg"
            >
              Rejouer
            </Button>
          </div>
        </div>
      )}
    </>
  );
};
