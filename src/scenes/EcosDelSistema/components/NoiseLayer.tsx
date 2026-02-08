import { AbsoluteFill, random, useCurrentFrame, useVideoConfig } from "remotion";
import React from "react";

export const NoiseLayer: React.FC<{ opacity?: number }> = ({ opacity = 0.1 }) => {
  const { width, height } = useVideoConfig();
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill style={{ mixBlendMode: 'overlay', pointerEvents: 'none', opacity }}>
      <svg width={width} height={height}>
        <filter id="noiseFilter">
          <feTurbulence 
            type="fractalNoise" 
            baseFrequency="0.6" 
            stitchTiles="stitch" 
            numOctaves="1" 
            seed={random(frame) * 100} // Frame-based seed for animation
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        
        <rect 
            width={width} 
            height={height} 
            filter="url(#noiseFilter)" 
            opacity={0.5} // Base opacity of the noise itself
        />
      </svg>
    </AbsoluteFill>
  );
};
