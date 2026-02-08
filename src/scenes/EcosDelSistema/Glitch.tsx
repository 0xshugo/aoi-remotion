import React, { useMemo } from 'react';
import { AbsoluteFill, useVideoConfig, useCurrentFrame, random, interpolate, Video, staticFile, Sequence, Loop } from 'remotion';
import { GlitchEffect } from './components/GlitchEffect';
import { NoiseLayer } from './components/NoiseLayer';

export const GlitchScene: React.FC = () => {
    const frame = useCurrentFrame();
    const { width, height } = useVideoConfig();

    // 1. Dynamic Jitter (Shake)
    const shakeX = (random(frame) - 0.5) * 20;
    const shakeY = (random(frame + 1) - 0.5) * 20;

    // 2. Color Shift (Red/Cyan tinting over time)
    const hueRotate = interpolate(frame % 60, [0, 30, 60], [0, 90, 0]);
    const saturate = interpolate(frame % 100, [0, 50, 100], [0, 2, 0]);

    // 3. Zoom Pulse (BPM sync-ish)
    const scale = interpolate(frame % 25, [0, 12, 25], [1.1, 1.2, 1.1]);

    // Reuse video asset for background texture
    const bgVideo = (
        <Video
            src={staticFile("assets/videos/scene2.mp4")}
            className="w-full h-full object-cover opacity-50 mix-blend-screen"
            muted
            loop
        />
    );

    // Data fragments
    const dataFragments = useMemo(() => {
        return new Array(20).fill(0).map((_, i) => {
            const seed = i * 123;
            return {
                x: random(seed) * 100,
                y: random(seed + 1) * 100,
                text: Math.random().toString(36).substring(2, 7),
                speed: 0.1 + random(seed + 2) * 0.5
            };
        });
    }, []);

    // Glitch Intensity Modulator
    const intensity = interpolate(frame % 40, [0, 5, 30, 40], [0, 0.5, 0.1, 0]);

    return (
        <AbsoluteFill className="bg-black overflow-hidden">
            {/* Base Layer: Deep Red Gradient */}
            <AbsoluteFill style={{ background: 'linear-gradient(45deg, #200 0%, #000 100%)' }} />

            {/* Video Texture Layer (Transformed) */}
            <AbsoluteFill style={{
                transform: `translate(${shakeX}px, ${shakeY}px) scale(${scale})`,
                filter: `hue-rotate(${hueRotate}deg) saturate(${saturate}) contrast(2)`
            }}>
                {bgVideo}
            </AbsoluteFill>

            {/* Glitch Effect Container */}
            <GlitchEffect intensity={intensity}>
                <AbsoluteFill className="flex justify-center items-center">
                    <div className="text-red-500 font-mono text-xl opacity-70 relative w-full h-full">
                        {dataFragments.map((frag, i) => (
                            <div
                                key={i}
                                className="absolute text-xs"
                                style={{
                                    left: `${frag.x}%`,
                                    top: `${(frag.y + frame * frag.speed) % 100}%`, // Falling/Rising text
                                    color: i % 2 === 0 ? '#ff3333' : '#00ffff', // Red/Cyan split
                                    opacity: random(frame + i) > 0.7 ? 1 : 0,
                                    textShadow: '0 0 5px currentColor'
                                }}
                            >
                                {frag.text.toUpperCase()}
                            </div>
                        ))}
                    </div>

                    {/* Crosshairs / UI Overlay */}
                    <div className="w-[90%] h-[1px] bg-red-500 absolute top-1/2 left-[5%] opacity-30" />
                    <div className="w-[1px] h-[90%] bg-red-500 absolute left-1/2 top-[5%] opacity-30" />

                    {/* Circle Pulse */}
                    <div
                        className="absolute border border-red-500 rounded-full opacity-30"
                        style={{
                            width: '40vmin',
                            height: '40vmin',
                            transform: `scale(${interpolate(frame % 50, [0, 50], [0.8, 1.5])})`,
                            borderWidth: '1px'
                        }}
                    />
                </AbsoluteFill>
            </GlitchEffect>

            <NoiseLayer opacity={0.2} />
        </AbsoluteFill>
    );
};
