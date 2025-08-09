import { useEffect, useState } from "react";

export function AnimatedBackground() {
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; delay: number }>>([]);

  useEffect(() => {
    const newParticles = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 4,
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Animated Gradient Blobs */}
      <div className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full blur-3xl animate-float"></div>
      <div 
        className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-bl from-accent/20 to-primary/20 rounded-full blur-3xl animate-float" 
        style={{animationDelay: '2s'}}
      ></div>
      <div 
        className="absolute top-1/2 left-1/3 w-64 h-64 bg-gradient-to-r from-primary/10 to-accent/10 rounded-full blur-2xl animate-float" 
        style={{animationDelay: '4s'}}
      ></div>

      {/* Floating Task Icons */}
      <div className="absolute inset-0">
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="absolute animate-float opacity-10 dark:opacity-20"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              animationDelay: `${particle.delay}s`,
              animationDuration: `${6 + Math.random() * 4}s`,
            }}
          >
            {particle.id % 5 === 0 && (
              <div className="w-8 h-8 bg-primary/30 rounded-lg flex items-center justify-center text-xs font-bold rotate-12">
                ✓
              </div>
            )}
            {particle.id % 5 === 1 && (
              <div className="w-6 h-6 bg-accent/30 rounded-full flex items-center justify-center text-xs">
                📋
              </div>
            )}
            {particle.id % 5 === 2 && (
              <div className="w-10 h-2 bg-gradient-to-r from-primary/30 to-accent/30 rounded-full"></div>
            )}
            {particle.id % 5 === 3 && (
              <div className="w-7 h-7 bg-gradient-to-br from-primary/20 to-accent/20 rounded-md flex items-center justify-center text-xs rotate-45">
                ⚡
              </div>
            )}
            {particle.id % 5 === 4 && (
              <div className="w-5 h-5 border-2 border-primary/30 rounded-full"></div>
            )}
          </div>
        ))}
      </div>

      {/* Geometric Patterns */}
      <div className="absolute top-10 right-10 opacity-5 dark:opacity-10">
        <svg width="200" height="200" viewBox="0 0 200 200" className="animate-spin" style={{animationDuration: '60s'}}>
          <defs>
            <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" className="stop-primary" />
              <stop offset="100%" className="stop-accent" />
            </linearGradient>
          </defs>
          <circle cx="100" cy="100" r="80" fill="none" stroke="url(#grad1)" strokeWidth="2" strokeDasharray="10,5" />
          <circle cx="100" cy="100" r="60" fill="none" stroke="url(#grad1)" strokeWidth="1" strokeDasharray="5,5" />
          <circle cx="100" cy="100" r="40" fill="none" stroke="url(#grad1)" strokeWidth="1" strokeDasharray="3,3" />
        </svg>
      </div>

      <div className="absolute bottom-10 left-10 opacity-5 dark:opacity-10">
        <svg width="150" height="150" viewBox="0 0 150 150" className="animate-pulse">
          <defs>
            <linearGradient id="grad2" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" className="stop-accent" />
              <stop offset="100%" className="stop-primary" />
            </linearGradient>
          </defs>
          <rect x="25" y="25" width="100" height="100" fill="none" stroke="url(#grad2)" strokeWidth="2" rx="20" />
          <rect x="40" y="40" width="70" height="70" fill="none" stroke="url(#grad2)" strokeWidth="1" rx="15" />
          <rect x="55" y="55" width="40" height="40" fill="none" stroke="url(#grad2)" strokeWidth="1" rx="10" />
        </svg>
      </div>

      {/* Grid Pattern */}
      <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.05]">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>
    </div>
  );
}