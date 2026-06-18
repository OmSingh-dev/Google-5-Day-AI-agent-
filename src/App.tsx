/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useCallback } from 'react';
import { Snowflake as SnowflakeIcon, Sparkles, XCircle, Info } from 'lucide-react';
import { ParticleSnowflake, ParticleBalloon, ActiveEffect } from './types';
import ParticleCanvas from './components/ParticleCanvas';
import StatsGrid from './components/StatsGrid';

export default function App() {
  const [activeEffect, setActiveEffect] = useState<ActiveEffect>('none');
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [snowflakes, setSnowflakes] = useState<ParticleSnowflake[]>([]);
  const [balloons, setBalloons] = useState<ParticleBalloon[]>([]);

  // Cleanup effect: runs constantly to sweep away expired particles
  useEffect(() => {
    if (activeEffect === 'none') {
      const cleanupInterval = setInterval(() => {
        const now = Date.now();
        setSnowflakes((prev) => prev.filter((s) => now - s.createdAt < s.duration * 1000));
        setBalloons((prev) => prev.filter((b) => now - b.createdAt < b.duration * 1000));
      }, 200);
      return () => clearInterval(cleanupInterval);
    }

    // Active Simulation Countdown & State Driver
    const mainInterval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0.1) {
          setActiveEffect('none');
          return 0;
        }
        return parseFloat((prev - 0.1).toFixed(1));
      });

      const now = Date.now();
      setSnowflakes((prev) => prev.filter((s) => now - s.createdAt < s.duration * 1000));
      setBalloons((prev) => prev.filter((b) => now - b.createdAt < b.duration * 1000));
    }, 100);

    return () => clearInterval(mainInterval);
  }, [activeEffect]);

  // Periodic Spawner Effect (Active while countdown > 0)
  useEffect(() => {
    if (activeEffect === 'none' || timeLeft <= 0) return;

    // Palette of majestic royal, dark sapphire, cobalt, and steel blues
    const snowflakeBlues = [
      '#1E3A8A', // Baltic Royal Navy
      '#1D4ED8', // Deep Sapphire Blue
      '#2563EB', // Cobalt Royal Blue
      '#1E40AF', // Midnight Navy
      '#3B82F6', // Luminous Azure
      '#172554', // Ultra Dark Navy
      '#1e3a8a', // Dark Steel Blue
      '#4338CA', // Deep Blue Indigo
      '#0369A1', // Deep Sky Cerulean
    ];

    const spawnSnowflake = () => {
      const now = Date.now();
      const randomBlue = snowflakeBlues[Math.floor(Math.random() * snowflakeBlues.length)];
      const newSnowflake: ParticleSnowflake = {
        id: `snow-${Math.random().toString(36).substring(2, 9)}`,
        left: Math.random() * 100,
        size: Math.random() * 18 + 26,        // 26px to 44px (Big and visible)
        opacity: Math.random() * 0.4 + 0.55,  // Rich premium depth
        duration: Math.random() * 4 + 7.0,    // 7s to 11s (Extremely pleasant, slow-falling drift)
        swayX: Math.random() * 120 - 60,      // -60px to 60px
        rotateTo: Math.random() * 360 + 180,
        createdAt: now,
        color: randomBlue,
      };
      setSnowflakes((prev) => [...prev, newSnowflake]);
    };

    const spawnBalloon = () => {
      const now = Date.now();
      const elegantColors = [
        '#0f172a', // Midnight Slate
        '#1E3A8A', // Baltic Royal Navy
        '#881337', // Bordeaux Merlot
        '#047857', // Sage Forest
        '#6366f1', // Indigo Satin
        '#475569', // Steel Slate
        '#DB2777', // Satin Rose Plum
        '#D4AF37', // Champagne Gold
        '#10B981', // Vivid Jade Emerald
        '#EF4444', // Red Gloss
      ];
      const randomColor = elegantColors[Math.floor(Math.random() * elegantColors.length)];

      const newBalloon: ParticleBalloon = {
        id: `bal-${Math.random().toString(36).substring(2, 9)}`,
        left: Math.random() * 88 + 6,
        width: Math.random() * 8 + 38,        // Plump, cute proportions
        height: Math.random() * 12 + 48,
        color: randomColor,
        duration: Math.random() * 4 + 8.0,    // 8s to 12s (Beautiful, slow levitation climb)
        driftX: Math.random() * 140 - 70,
        tiltStart: Math.random() * 20 - 10,
        tiltEnd: Math.random() * 26 - 13,
        createdAt: now,
      };
      setBalloons((prev) => [...prev, newBalloon]);
    };

    let snowTimer: NodeJS.Timeout | null = null;
    let balloonTimer: NodeJS.Timeout | null = null;

    if (activeEffect === 'snowflakes' || activeEffect === 'both') {
      snowTimer = setInterval(spawnSnowflake, 140);
    }
    if (activeEffect === 'balloons' || activeEffect === 'both') {
      balloonTimer = setInterval(spawnBalloon, 320);
    }

    return () => {
      if (snowTimer) clearInterval(snowTimer);
      if (balloonTimer) clearInterval(balloonTimer);
    };
  }, [activeEffect, timeLeft]);

  // Triggers the Snowflake Simulation
  const triggerSnowflakes = useCallback(() => {
    setBalloons([]);
    setActiveEffect('snowflakes');
    setTimeLeft(30.0); // Increased duration to 30 seconds for longer visual experience

    const now = Date.now();
    const snowflakeBlues = ['#1E3A8A', '#1D4ED8', '#2563EB', '#1E40AF', '#3B82F6', '#172554', '#4338CA', '#0369A1'];
    
    const preWarmingSnowflakes: ParticleSnowflake[] = Array.from({ length: 22 }).map((_, i) => {
      const duration = Math.random() * 4 + 7.0;
      const delay = Math.random() * -duration;
      return {
        id: `snow-init-${i}-${Math.random().toString(36).substring(2, 6)}`,
        left: Math.random() * 100,
        size: Math.random() * 18 + 26,
        opacity: Math.random() * 0.4 + 0.55,
        duration: duration,
        swayX: Math.random() * 120 - 60,
        rotateTo: Math.random() * 360 + 180,
        createdAt: now,
        delay: delay,
        color: snowflakeBlues[i % snowflakeBlues.length],
      };
    });
    setSnowflakes(preWarmingSnowflakes);
  }, []);

  // Triggers the Balloon Simulation
  const triggerBalloons = useCallback(() => {
    setSnowflakes([]);
    setActiveEffect('balloons');
    setTimeLeft(30.0); // Increased duration to 30 seconds for longer visual experience

    const now = Date.now();
    const elegantColors = ['#0f172a', '#1E3A8A', '#881337', '#047857', '#6366f1', '#DB2777', '#475569', '#D4AF37', '#10B981', '#EF4444'];

    const preWarmingBalloons: ParticleBalloon[] = Array.from({ length: 14 }).map((_, i) => {
      const duration = Math.random() * 4 + 8.0;
      const delay = Math.random() * -duration;
      return {
        id: `bal-init-${i}-${Math.random().toString(36).substring(2, 6)}`,
        left: Math.random() * 86 + 7,
        width: Math.random() * 8 + 38,
        height: Math.random() * 12 + 48,
        color: elegantColors[i % elegantColors.length],
        duration: duration,
        driftX: Math.random() * 140 - 70,
        tiltStart: Math.random() * 20 - 10,
        tiltEnd: Math.random() * 26 - 13,
        createdAt: now,
        delay: delay,
      };
    });
    setBalloons(preWarmingBalloons);
  }, []);

  // Triggers Both simulations simultaneously
  const triggerBoth = useCallback(() => {
    setActiveEffect('both');
    setTimeLeft(30.0); // 30 seconds simulation

    const now = Date.now();
    const snowflakeBlues = ['#1E3A8A', '#1D4ED8', '#2563EB', '#1E40AF', '#3B82F6', '#4338CA', '#0369A1'];
    const elegantColors = ['#0f172a', '#1E3A8A', '#881337', '#047857', '#6366f1', '#DB2777', '#475569', '#D4AF37', '#10B981', '#EF4444'];

    // Pre-warm snowflakes (18 items)
    const preWarmingSnowflakes: ParticleSnowflake[] = Array.from({ length: 18 }).map((_, i) => {
      const duration = Math.random() * 4 + 7.0;
      const delay = Math.random() * -duration;
      return {
        id: `snow-both-${i}-${Math.random().toString(36).substring(2, 6)}`,
        left: Math.random() * 100,
        size: Math.random() * 18 + 26,
        opacity: Math.random() * 0.4 + 0.55,
        duration: duration,
        swayX: Math.random() * 120 - 60,
        rotateTo: Math.random() * 360 + 180,
        createdAt: now,
        delay: delay,
        color: snowflakeBlues[i % snowflakeBlues.length],
      };
    });

    // Pre-warm balloons (12 items)
    const preWarmingBalloons: ParticleBalloon[] = Array.from({ length: 12 }).map((_, i) => {
      const duration = Math.random() * 4 + 8.0;
      const delay = Math.random() * -duration;
      return {
        id: `bal-both-${i}-${Math.random().toString(36).substring(2, 6)}`,
        left: Math.random() * 86 + 7,
        width: Math.random() * 8 + 38,
        height: Math.random() * 12 + 48,
        color: elegantColors[i % elegantColors.length],
        duration: duration,
        driftX: Math.random() * 140 - 70,
        tiltStart: Math.random() * 20 - 10,
        tiltEnd: Math.random() * 26 - 13,
        createdAt: now,
        delay: delay,
      };
    });

    setSnowflakes(preWarmingSnowflakes);
    setBalloons(preWarmingBalloons);
  }, []);

  // Reset/kill simulations instantly
  const resetSimulation = useCallback(() => {
    setActiveEffect('none');
    setTimeLeft(0);
    setSnowflakes([]);
    setBalloons([]);
  }, []);

  const totalActiveParticles = snowflakes.length + balloons.length;

  return (
    <main id="app-root-layout" className="relative flex flex-col items-center justify-center min-h-screen px-4 py-12 bg-slate-50 overflow-hidden font-sans select-none">
      {/* Background decoration: clean micro-grid pattern for a professional engineer look */}
      <div id="grid-bg-overlay" className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-40 pointer-events-none" />

      {/* Embedded Ambient Canvas */}
      <ParticleCanvas snowflakes={snowflakes} balloons={balloons} />

      {/* Main Content Card Container */}
      <div id="simulation-master-deck" className="relative z-10 w-full max-w-2xl p-8 bg-white/70 backdrop-blur-xl rounded-2xl border border-slate-200 shadow-xl shadow-slate-100 flex flex-col items-center text-center transition-all">
        
        {/* Sleek Badge Header */}
        <div id="console-context-badge" className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 border border-slate-200 rounded-full mb-6">
          <span className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-pulse" />
          <span className="text-[10px] font-mono font-medium tracking-widest text-slate-500 uppercase">Interactive Atmospheric Deck</span>
        </div>

        {/* Display Title */}
        <h1 id="simulation-title" className="text-3xl md:text-4xl font-sans font-bold tracking-tight text-slate-800">
          Visual Effects Console
        </h1>
        <p id="simulation-subtitle" className="mt-2 text-sm text-slate-500 max-w-md">
          Execute thirty-second mathematical particle simulations. Real-time canvas rendering maps physics vectors for big-scale elements.
        </p>

        {/* Display Status Monitor */}
        <div id="simulation-status-bar" className="w-full mt-8 p-4 bg-slate-50/80 rounded-xl border border-slate-150 flex flex-col items-center justify-center">
          <div className="flex items-center justify-between w-full max-w-xs text-xs font-mono">
            <span className="text-slate-400 uppercase">ACTIVE FIELD</span>
            <span className={`font-semibold ${
              activeEffect === 'snowflakes' ? 'text-blue-800' : activeEffect === 'balloons' ? 'text-indigo-950' : activeEffect === 'both' ? 'text-violet-700' : 'text-slate-500'
            }`}>
              {activeEffect === 'none' && '● STANDBY'}
              {activeEffect === 'snowflakes' && '❄ PRECIPITATION'}
              {activeEffect === 'balloons' && '🎈 LEVITATION'}
              {activeEffect === 'both' && '🌀 CONCURRENT'}
            </span>
          </div>

          {/* Time Countdown Progress Bar */}
          <div id="simulation-timer-progress-container" className="w-full max-w-xs h-1 px-0.5 bg-slate-200 rounded-full mt-3 overflow-hidden">
            <div
              id="simulation-timer-progress-fill"
              className={`h-full rounded-full transition-all duration-100 ease-linear ${
                activeEffect === 'snowflakes' ? 'bg-blue-800' : activeEffect === 'balloons' ? 'bg-indigo-950' : activeEffect === 'both' ? 'bg-violet-600' : 'bg-transparent'
              }`}
              style={{ width: `${(timeLeft / 30.0) * 100}%` }}
            />
          </div>

          {timeLeft > 0 && (
            <span id="simulation-timer-text" className="text-[11px] font-mono text-slate-400 mt-2">
              Time Remaining: {timeLeft.toFixed(1)}s
            </span>
          )}
        </div>

        {/* Buttons Action Grid */}
        <div id="simulation-actions-grid" className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full mt-6">
          {/* Snowflakes Simulation Trigger */}
          <button
            id="btn-trigger-snowflakes"
            onClick={triggerSnowflakes}
            className={`group h-13 px-4 py-3 rounded-xl border font-semibold flex items-center justify-center gap-2.5 transition-all outline-none focus:ring-2 focus:ring-blue-100 select-none cursor-pointer ${
              activeEffect === 'snowflakes'
                ? 'bg-blue-50/80 border-blue-200 text-blue-800 shadow-sm'
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 hover:text-slate-800 shadow-xs'
            }`}
          >
            <SnowflakeIcon className={`w-4.5 h-4.5 text-blue-800 transition-transform ${
              activeEffect === 'snowflakes' ? 'animate-spin' : 'group-hover:scale-110'
            }`} style={{ animationDuration: '6s' }} />
            <span className="tracking-tight text-sm">Snowflakes</span>
          </button>

          {/* Balloons Simulation Trigger */}
          <button
            id="btn-trigger-balloons"
            onClick={triggerBalloons}
            className={`group h-13 px-4 py-3 rounded-xl border font-semibold flex items-center justify-center gap-2.5 transition-all outline-none focus:ring-2 focus:ring-slate-200 select-none cursor-pointer ${
              activeEffect === 'balloons'
                ? 'bg-indigo-50/80 border-slate-300 text-indigo-950 shadow-sm'
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 hover:text-slate-800 shadow-xs'
            }`}
          >
            <Sparkles className={`w-4.5 h-4.5 transition-transform ${
              activeEffect === 'balloons' ? 'rotate-12 scale-110 text-indigo-950' : 'group-hover:scale-110'
            }`} />
            <span className="tracking-tight text-sm">Balloons</span>
          </button>

          {/* Concurrent Both Stimulation Trigger */}
          <button
            id="btn-trigger-both"
            onClick={triggerBoth}
            className={`group h-13 px-4 py-3 rounded-xl border font-semibold flex items-center justify-center gap-2.5 transition-all outline-none focus:ring-2 focus:ring-violet-100 select-none cursor-pointer ${
              activeEffect === 'both'
                ? 'bg-violet-50/80 border-violet-200 text-violet-800 shadow-sm'
                : 'bg-gradient-to-r from-violet-50/10 to-indigo-50/10 bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 hover:text-slate-800 shadow-xs'
            }`}
          >
            <div className="flex items-center gap-0.5">
              <SnowflakeIcon className="w-3.5 h-3.5 text-blue-700 animate-pulse" />
              <Sparkles className="w-3.5 h-3.5 text-indigo-800" />
            </div>
            <span className="tracking-tight text-sm">Both</span>
          </button>
        </div>

        {/* Stop Button */}
        {activeEffect !== 'none' && (
          <button
            id="btn-trigger-stop"
            onClick={resetSimulation}
            className="mt-4 px-4 py-1.5 text-xs text-rose-600 hover:text-rose-700 bg-rose-50/50 hover:bg-rose-50 border border-rose-100/60 rounded-lg flex items-center gap-1.5 transition-all inline-flex cursor-pointer shadow-2xs"
          >
            <XCircle className="w-3.5 h-3.5" />
            <span>Terminate Simulation</span>
          </button>
        )}

        {/* Real-time Statistics Display */}
        <StatsGrid
          activeEffect={activeEffect}
          timeLeft={timeLeft}
          particleCount={totalActiveParticles}
        />

        {/* Brief Physics Instruction Detail */}
        <div id="simulation-physics-footer" className="mt-8 flex items-center gap-2 max-w-md text-left px-4 py-3 bg-slate-50/40 rounded-xl border border-slate-100">
          <Info className="w-4.5 h-4.5 text-slate-400 shrink-0" />
          <p className="text-[11px] text-slate-500 leading-normal">
            <strong>System Calibration:</strong> Snowflake physics employ mathematical cosine sways mimicking high-altitude drift. Balloons drift upward based on virtual environmental helium buoyancy differentials.
          </p>
        </div>
      </div>
      
      {/* Outer Page Footer */}
      <div id="app-system-footer" className="absolute bottom-4 left-0 right-0 text-center pointer-events-none z-10">
        <p className="text-[10px] font-mono tracking-widest text-slate-400">
          SYSTEM COMPLIANT • RENDERING VIA HARDWARE ACCELL
        </p>
      </div>
    </main>
  );
}
