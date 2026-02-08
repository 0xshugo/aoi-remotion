import React, { useMemo } from 'react';
import { AbsoluteFill, random, useCurrentFrame, useVideoConfig } from 'remotion';

export const NoiseLayer: React.FC<{ opacity?: number }> = ({ opacity = 0.05 }) => {
  const { width, height } = useVideoConfig();
  const frame = useCurrentFrame();

  // Generate static noise texture once (performance optimization)
  // Replacing heavy SVG feTurbulence with lightweight Canvas noise
  const noiseDataUrl = useMemo(() => {
    if (typeof document === 'undefined') return ''; // Safety check for SSR context

    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');
    if (!ctx) return '';

    const imageData = ctx.createImageData(256, 256);
    const buffer = new Uint32Array(imageData.data.buffer);

    // Generate random noise
    for (let i = 0; i < buffer.length; i++) {
      if (Math.random() < 0.5) {
        buffer[i] = 0xffffffff; // White
      } else {
        buffer[i] = 0x00000000; // Transparent
      }
    }
    ctx.putImageData(imageData, 0, 0);
    return canvas.toDataURL(); // Convert to lightweight PNG
  }, []); // Only run once

  // Animate noise by shifting background position randomly
  const x = (random(frame) - 0.5) * 256;
  const y = (random(frame + 1) - 0.5) * 256;

  if (!noiseDataUrl) return null;

  return (
    <AbsoluteFill
      style={{
        pointerEvents: 'none',
        opacity,
        backgroundImage: `url(${noiseDataUrl})`,
        backgroundRepeat: 'repeat',
        backgroundSize: '256px 256px',
        backgroundPosition: `${x}px ${y}px`,
        mixBlendMode: 'overlay'
      }}
    />
  );
};
