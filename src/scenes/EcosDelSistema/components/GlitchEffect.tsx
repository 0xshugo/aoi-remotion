import React, { useMemo } from 'react';
import { AbsoluteFill, random, useCurrentFrame, useVideoConfig } from 'remotion';

export const GlitchEffect: React.FC<{ children: React.ReactNode; intensity?: number }> = ({ children, intensity = 0.5 }) => {
    const frame = useCurrentFrame();
    const { width, height } = useVideoConfig();

    // Draw random glitch bars
    const glitchBars = useMemo(() => {
        return new Array(10).fill(0).map((_, i) => {
            const seed = random(`glitch-bar-${frame}-${i}`);
            if (seed > intensity) return null; // Probability check

            const barHeight = 10 + Math.floor(random(seed * 2) * 50);
            const top = Math.floor(random(seed * 3) * height);
            const shift = (random(seed * 4) - 0.5) * 40 * intensity; // X shift

            return (
                <div
                    key={i}
                    className="absolute w-full bg-inherit"
                    style={{
                        height: barHeight,
                        top: top,
                        transform: `translateX(${shift}px)`,
                        overflow: 'hidden',
                        clipPath: `inset(${top}px 0 ${height - top - barHeight}px 0)`
                    }}
                >
                    <div style={{ transform: `translateX(${-shift}px)` }}>
                        {children}
                    </div>
                </div>
            );
        });
    }, [frame, height, intensity, children]);

    // Main RGB Shift
    const shiftX = (random(frame) - 0.5) * 10 * intensity;

    return (
        <AbsoluteFill className="bg-black">
            {/* Base Layer */}
            <AbsoluteFill>{children}</AbsoluteFill>

            {/* RGB Shift Layers (Simple) - in real production, use mix-blend-mode */}
            {intensity > 0.3 && (
                <>
                    <AbsoluteFill style={{ transform: `translateX(${shiftX}px)`, mixBlendMode: 'screen', opacity: 0.5, filter: 'sepia(1) hue-rotate(90deg)' }}>
                        {children}
                    </AbsoluteFill>
                    <AbsoluteFill style={{ transform: `translateX(${-shiftX}px)`, mixBlendMode: 'screen', opacity: 0.5, filter: 'sepia(1) hue-rotate(-90deg)' }}>
                        {children}
                    </AbsoluteFill>
                </>
            )}

            {/* Slice Glitch Overlay */}
            {/* <AbsoluteFill>{glitchBars}</AbsoluteFill> */}
            {/* (Note: Real slice glitch requires duplicating content which is heavy. Using CSS filters instead for now) */}

            <AbsoluteFill
                style={{
                    filter: intensity > 0.6 ? `contrast(1.5) brightness(1.2)` : 'none',
                    transform: intensity > 0.8 ? `scale(${1 + random(frame) * 0.05})` : 'none'
                }}
            />
        </AbsoluteFill>
    );
};
