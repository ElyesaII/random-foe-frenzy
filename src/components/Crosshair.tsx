export const Crosshair = () => {
  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none">
      <div className="relative w-8 h-8">
        {/* Center dot */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-1 bg-game-crosshair rounded-full" />
        
        {/* Top line */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-0.5 h-2 bg-game-crosshair" />
        
        {/* Bottom line */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0.5 h-2 bg-game-crosshair" />
        
        {/* Left line */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-2 h-0.5 bg-game-crosshair" />
        
        {/* Right line */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-0.5 bg-game-crosshair" />
      </div>
    </div>
  );
};
