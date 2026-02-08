import React, { useMemo } from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, random } from 'remotion';
import { NoiseLayer } from './components/NoiseLayer';

export const SubspaceScene: React.FC = () => {
    const frame = useCurrentFrame();
    // const { width, height } = useVideoConfig(); // Unused

    // 1. Exponential Zoom (Infinite Tunnel Effect)
    // Start slow, end fast
    const zoom = Math.pow(1.002, frame);

    // 2. Strobe Light (Flickers randomly)
    const strobe = useMemo(() => {
        return random(frame * 0.1) > 0.95 ? 0.3 : 0; // 5% chance of light flash
    }, [frame]);

    // 3. Streaming Particles (Starfield)
    const particles = useMemo(() => {
        return new Array(50).fill(0).map((_, i) => {
            const seed = i * 999;
            const angle = random(seed) * Math.PI * 2;
            const dist = 10 + random(seed + 1) * 40; // Base distance from center
            return {
                angle,
                dist,
                size: 2 + random(seed + 2) * 3,
                speed: 1 + random(seed + 3) * 2,
                color: random(seed + 4) > 0.5 ? '#fff' : '#aaf'
            };
        });
    }, []);

    // Rotation of the tunnel
    const rotation = frame * 0.2;

    return (
        <AbsoluteFill className="bg-black overflow-hidden">
            {/* Deep Background Gradient with Strobe */}
            <AbsoluteFill
                style={{
                    background: `radial-gradient(circle at 50% 50%, rgba(20, 20, 50, ${1 - strobe}) 0%, #000000 100%)`,
                }}
            >
                {/* Flash Overlay */}
                <div className="absolute inset-0 bg-white mix-blend-overlay" style={{ opacity: strobe }} />
            </AbsoluteFill>

            {/* Tunnel Content Container */}
            <AbsoluteFill style={{
                transform: `rotate(${rotation}deg)` // Rotate the whole universe
            }}>
                {/* Drifting Particles radiating from center */}
                {particles.map((p, i) => {
                    // Calculate position based on Zoom factor
                    // As zoom increases, particles move away from center exponentially
                    // const currentDist = p.dist * zoom; // Unused

                    // If too far, wrap around or fade out?
                    // Let's fade out if too far, and maybe spawn new ones (simple loop logic tough here)
                    // Instead, use modulo to keep them coming?
                    // Let's use simple modulo on zoom to loop the tunnel visually
                    const loopZoom = (zoom % 5) + 0.1; // Loop zoom factor 0.1 -> 5.1
                    const d = p.dist * loopZoom;

                    const x = 50 + Math.cos(p.angle) * d;
                    const y = 50 + Math.sin(p.angle) * d;

                    const opacity = interpolate(d, [0, 40, 60], [0, 1, 0]); // Fade in, then fade out at edges

                    return (
                        <div
                            key={i}
                            className="absolute rounded-full blur-[1px]"
                            style={{
                                left: `${x}%`,
                                top: `${y}%`,
                                width: p.size * loopZoom, // Particles get bigger as they approach
                                height: p.size * loopZoom,
                                backgroundColor: p.color,
                                opacity: opacity,
                                boxShadow: `0 0 ${p.size * 2}px ${p.color}`
                            }}
                        />
                    );
                })}
            </AbsoluteFill>

            {/* Central Singularity */}
            <div className="absolute inset-0 flex items-center justify-center">
                <div
                    className="w-4 h-4 bg-white rounded-full shadow-[0_0_20px_white]"
                    style={{
                        opacity: 0.8 + Math.sin(frame * 0.2) * 0.2, // Pulsate
                        transform: `scale(${1 + Math.sin(frame * 0.1) * 0.5})`
                    }}
                />
                <div
                    className="w-[60vmin] h-[60vmin] border border-white/10 rounded-full absolute"
                    style={{ transform: `scale(${zoom % 2})`, opacity: 1 - ((zoom % 2) - 1) }}
                />
            </div>

            <NoiseLayer opacity={0.1 + strobe * 0.5} />
        </AbsoluteFill>
    );
};
