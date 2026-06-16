/**
 * @file ParticleOverlay.tsx
 * @description Lightweight premium ambient cosmetic effect that floatingly renders
 * drifting golden/amber embers Rising from the bottom border of the screen to the top,
 * creating an organic cosmic depth in the application's layout.
 */

import { useEffect, useState } from "react";

interface Particle {
  id: number;
  size: number; // Node diameter in px
  left: number; // Horizontal relative page alignment %
  bottom: number; // Starting height %
  duration: number; // Animation duration in seconds (speed)
  delay: number; // Negative animation delay to pre-populate elements on load
}

export function ParticleOverlay() {
  const [particles, setParticles] = useState<Particle[]>([]);

  // Generate a random stable array of drifting particles on element mount
  useEffect(() => {
    const generated: Particle[] = [];
    const count = 30;
    for (let i = 0; i < count; i++) {
      generated.push({
        id: i,
        size: Math.random() * 4 + 1, // 1px to 5px randomized
        left: Math.random() * 100, // 0% to 100% distribution
        bottom: -10, // Starts off-canvas below screen
        duration: Math.random() * 15 + 10, // 10s to 25s floating speeds
        delay: Math.random() * 20, // Pre-stagger phases
      });
    }
    setParticles(generated);
  }, []);

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden" id="particle-container">
      {particles.map((p) => (
        <span
          key={p.id}
          className="particle block"
          style={{
            position: "absolute",
            background: "rgba(255, 176, 0, 0.25)",
            borderRadius: "50%",
            width: `${p.size}px`,
            height: `${p.size}px`,
            left: `${p.left}%`,
            bottom: `${p.bottom}%`,
            animationName: "float-particle",
            animationTimingFunction: "linear",
            animationIterationCount: "infinite",
            animationDuration: `${p.duration}s`,
            animationDelay: `-${p.delay}s`,
          }}
        />
      ))}
      <style>{`
        @keyframes float-particle {
          0% {
            transform: translateY(0px) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 0.6;
          }
          90% {
            opacity: 0.6;
          }
          100% {
            transform: translateY(-110vh) rotate(360deg);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
