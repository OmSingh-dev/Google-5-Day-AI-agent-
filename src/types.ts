/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface ParticleSnowflake {
  id: string;
  left: number;       // percentage 0-100
  size: number;       // diameter in px (medium size: 18px to 26px)
  opacity: number;    // random opacity for depth
  duration: number;   // fall time in seconds
  swayX: number;      // horizontal sweep
  rotateTo: number;   // rot target
  createdAt: number;  // timestamp in ms
  delay?: number;     // negative delay in seconds
  color: string;      // elegant custom blue shade
}

export interface ParticleBalloon {
  id: string;
  left: number;       // percentage 0-100
  width: number;      // base width in px
  height: number;     // base height in px
  color: string;      // elegant custom hex/color name
  duration: number;   // float time in seconds
  driftX: number;     // horizontal drift
  tiltStart: number;  // tilt variation start
  tiltEnd: number;    // tilt variation end
  createdAt: number;  // timestamp in ms
  delay?: number;     // negative delay in seconds
}

export type ActiveEffect = 'none' | 'snowflakes' | 'balloons' | 'both';
