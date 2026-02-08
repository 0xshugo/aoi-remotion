import React from 'react';
import { AbsoluteFill, useVideoConfig, useCurrentFrame, interpolate, spring } from 'remotion';
import { SONG_CONFIG } from './config';
import { NoiseLayer } from './components/NoiseLayer';

export const IntroScene: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const opacity = interpolate(frame, [0, 60], [0, 1], { extrapolateRight: 'clamp' });

    // Title Animation: "Typewriter" effect with glitch
    const text = "Ecos del sistema";
    const subText = "— el espejo sin nombre";

    // Slow blinking cursor
    const cursorVisible = Math.floor(frame / 15) % 2 === 0;

    // Glitch shift for text
    const glitchX = interpolate(frame, [50, 52, 54, 56], [0, 10, -10, 0], { extrapolateRight: 'clamp' });

    return (
        <AbsoluteFill className="bg-neutral-950 flex justify-center items-center">
            <NoiseLayer opacity={0.15} />

            <div className="text-center z-10" style={{ opacity }}>
                <h1
                    className="text-6xl font-black tracking-tighter text-neutral-100 mb-4"
                    style={{ transform: `translateX(${glitchX}px)` }}
                >
                    {text}
                </h1>
                <p className="text-xl font-light tracking-[0.5em] text-neutral-400">
                    {subText}
                    {cursorVisible && <span className="ml-2 text-red-500">_</span>}
                </p>
            </div>


        </AbsoluteFill>
    );
};
