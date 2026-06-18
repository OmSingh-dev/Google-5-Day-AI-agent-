/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ParticleSnowflake, ParticleBalloon } from '../types';

interface ParticleCanvasProps {
  snowflakes: ParticleSnowflake[];
  balloons: ParticleBalloon[];
}

export default function ParticleCanvas({ snowflakes, balloons }: ParticleCanvasProps) {
  return (
    <div id="particle-canvas-container" className="fixed inset-0 pointer-events-none z-50 overflow-hidden select-none">
      {/* Snowflakes Canvas */}
      {snowflakes.map((s) => (
        <div
          key={s.id}
          className="absolute animate-snowflake"
          style={{
            top: '-48px',
            left: `${s.left}%`,
            width: `${s.size}px`,
            height: `${s.size}px`,
            animationDuration: `${s.duration}s`,
            animationDelay: s.delay ? `${s.delay}s` : '0s',
            color: s.color,
            '--snowflake-opacity': s.opacity,
            '--sway-x': `${s.swayX}px`,
            '--rotate-to': `${s.rotateTo}deg`,
          } as React.CSSProperties}
        >
          <svg
            id={`snowflake-svg-${s.id}`}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-full h-full opacity-90 filter drop-shadow-[0_2px_4px_rgba(30,58,138,0.25)]"
          >
            <line x1="12" y1="2" x2="12" y2="22" />
            <line x1="2" y1="12" x2="22" y2="12" />
            <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
            <line x1="19.07" y1="4.93" x2="4.93" y2="19.07" />
            <polyline points="15 5 12 8 9 5" />
            <polyline points="9 19 12 16 15 19" />
            <polyline points="19 15 16 12 19 9" />
            <polyline points="5 9 8 12 5 15" />
          </svg>
        </div>
      ))}

      {/* Balloons Canvas */}
      {balloons.map((b) => (
        <div
          key={b.id}
          className="absolute animate-balloon"
          style={{
            bottom: '-120px',
            left: `${b.left}%`,
            width: `${b.width}px`,
            height: `${b.height}px`,
            animationDuration: `${b.duration}s`,
            animationDelay: b.delay ? `${b.delay}s` : '0s',
            color: b.color,
            '--drift-x': `${b.driftX}px`,
            '--tilt-start': `${b.tiltStart}deg`,
            '--tilt-end': `${b.tiltEnd}deg`,
          } as React.CSSProperties}
        >
          <svg
            id={`balloon-svg-${b.id}`}
            viewBox="0 0 60 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full filter drop-shadow-[0_10px_16px_rgba(15,23,42,0.18)]"
          >
            {/* Balloon Main Semi-translucent body */}
            <path
              d="M6 35C6 15.67 16.75 0 30 0C43.25 0 54 15.67 54 35C54 53.05 44.5 66 30 66C15.5 66 6 53.05 6 35Z"
              fill={`url(#balloon-gradient-${b.id})`}
            />

            {/* Glossy sheen curves for pleasant glossy details */}
            <path
              d="M14 20C14 12 19 7 26 7"
              stroke="white"
              strokeWidth="2.8"
              strokeLinecap="round"
              className="opacity-45"
            />
            <path
              d="M17 25C17 20 20 17 24 17"
              stroke="white"
              strokeWidth="1.4"
              strokeLinecap="round"
              className="opacity-25"
            />

            {/* Cute bottom knot with dynamic coloring */}
            <path
              d="M26 66L34 66L30 71Z"
              fill={b.color}
              className="brightness-90 opacity-95"
            />

            {/* Elegant wavy ribbon hanging down */}
            <path
              d="M30 71C31.5 77 34.5 81 31.5 87C28.5 93 29.5 97 30 100"
              stroke="#475569"
              strokeWidth="1.2"
              strokeLinecap="round"
              className="opacity-40"
            />

            <defs>
              <radialGradient
                id={`balloon-gradient-${b.id}`}
                cx="35%"
                cy="30%"
                r="65%"
                fx="35%"
                fy="30%"
              >
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.8" />
                <stop offset="25%" stopColor={b.color} stopOpacity="0.95" />
                <stop offset="100%" stopColor={adjustColorDarkness(b.color)} />
              </radialGradient>
            </defs>
          </svg>
        </div>
      ))}
    </div>
  );
}

/**
 * Generates a CSS gradient-compatible darker stop color for 3D realism
 * without requiring high weight external library calculations.
 */
function adjustColorDarkness(hex: string): string {
  const cleaned = hex.replace('#', '');
  const r = parseInt(cleaned.substring(0, 2), 16);
  const g = parseInt(cleaned.substring(2, 4), 16);
  const b = parseInt(cleaned.substring(4, 6), 16);
  
  // Decrease colors mathematically to 40% for gorgeous gradient shadows
  const dr = Math.floor(r * 0.4);
  const dg = Math.floor(g * 0.4);
  const db = Math.floor(b * 0.4);
  
  const toHex = (n: number) => {
    const s = n.toString(16);
    return s.length === 1 ? '0' + s : s;
  };
  return `#${toHex(dr)}${toHex(dg)}${toHex(db)}`;
}
