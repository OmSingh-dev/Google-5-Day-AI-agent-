/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Activity, Wind, Eye, Compass } from 'lucide-react';
import { ActiveEffect } from '../types';

interface StatsGridProps {
  activeEffect: ActiveEffect;
  timeLeft: number;
  particleCount: number;
}

export default function StatsGrid({ activeEffect, timeLeft, particleCount }: StatsGridProps) {
  // Determine physics preset based on active effect
  const getPhysicsLabel = () => {
    if (activeEffect === 'snowflakes') return 'Sinusoidal Sway';
    if (activeEffect === 'balloons') return 'Buoyancy Wind Drift';
    return 'Calibrated Equilibrium';
  };

  const getConstantLabel = () => {
    if (activeEffect === 'snowflakes') return 'Gravity: 1.25 m/s²';
    if (activeEffect === 'balloons') return 'Lift Force: -2.30 m/s²';
    return 'State: Standby';
  };

  return (
    <div id="stats-grid-container" className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 w-full max-w-2xl text-left">
      {/* 1. Controller State Card */}
      <div id="stat-card-state" className="p-4 bg-white/60 backdrop-blur-md rounded-xl border border-slate-200/80 shadow-sm flex flex-col justify-between transition-all hover:bg-white/80">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-mono tracking-wider text-slate-400 uppercase">System Status</span>
          <Activity className={`w-3.5 h-3.5 ${activeEffect !== 'none' ? 'text-emerald-500 animate-pulse' : 'text-slate-400'}`} />
        </div>
        <div className="mt-2.5">
          <span className="text-sm font-semibold text-slate-800 leading-none">
            {activeEffect === 'none' ? 'Ready' : activeEffect === 'snowflakes' ? 'Precipitation' : 'Levitation'}
          </span>
          <p className="text-[11px] font-mono text-slate-400 mt-1">
            {activeEffect !== 'none' ? `${timeLeft.toFixed(1)}s Remaining` : 'IDLE'}
          </p>
        </div>
      </div>

      {/* 2. Particle Density Card */}
      <div id="stat-card-density" className="p-4 bg-white/60 backdrop-blur-md rounded-xl border border-slate-200/80 shadow-sm flex flex-col justify-between transition-all hover:bg-white/80">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-mono tracking-wider text-slate-400 uppercase">Active Mass</span>
          <Eye className="w-3.5 h-3.5 text-slate-400" />
        </div>
        <div className="mt-2.5">
          <span className="text-xl font-mono font-semibold text-slate-800 leading-none">
            {particleCount}
          </span>
          <p className="text-[11px] font-mono text-slate-400 mt-1">
            {activeEffect !== 'none' ? 'Spawning active' : '0 entities active'}
          </p>
        </div>
      </div>

      {/* 3. Physics Model Card */}
      <div id="stat-card-physics" className="p-4 bg-white/60 backdrop-blur-md rounded-xl border border-slate-200/80 shadow-sm flex flex-col justify-between transition-all hover:bg-white/80">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-mono tracking-wider text-slate-400 uppercase">Kinetic Profile</span>
          <Wind className="w-3.5 h-3.5 text-slate-400" />
        </div>
        <div className="mt-2.5">
          <span className="text-xs font-semibold text-slate-800 tracking-tight block truncate">
            {getPhysicsLabel()}
          </span>
          <p className="text-[11px] font-mono text-slate-400 mt-1">
            Vectorized drift
          </p>
        </div>
      </div>

      {/* 4. Thermal constant Card */}
      <div id="stat-card-thermals" className="p-4 bg-white/60 backdrop-blur-md rounded-xl border border-slate-200/80 shadow-sm flex flex-col justify-between transition-all hover:bg-white/80">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-mono tracking-wider text-slate-400 uppercase">Acceleration</span>
          <Compass className="w-3.5 h-3.5 text-slate-400" />
        </div>
        <div className="mt-2.5">
          <span className="text-xs font-semibold text-slate-800 tracking-tight block">
            {getConstantLabel()}
          </span>
          <p className="text-[11px] font-mono text-slate-400 mt-1">
            Fluid simulation
          </p>
        </div>
      </div>
    </div>
  );
}
