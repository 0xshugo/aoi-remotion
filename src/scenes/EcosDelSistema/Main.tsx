import React from 'react';
import { AbsoluteFill, staticFile, Sequence } from 'remotion';
import { Audio } from 'remotion';
import { TransitionSeries } from '@remotion/transitions';
import { LightLeak } from '@remotion/light-leaks';

import { IntroScene } from './Intro';
import { ReflectiveScene } from './Reflective';
import { GlitchScene } from './Glitch';
import { SubspaceScene } from './Subspace';
import { NoiseLayer } from './components/NoiseLayer';
// import { SONG_CONFIG, getFrames } from './config'; // Use hardcoded values for verification

// Enhanced CI check
const isCI = () => {
    return (
        process.env.CI === 'true' ||
        process.env.NODE_ENV === 'production' ||
        typeof window === 'undefined'
    );
};

// Safe wrapper to prevent WebGL crashes in CI
const SafeLightLeak: React.FC<{
    durationInFrames?: number;
    seed?: number;
    hueShift?: number;
}> = (props) => {
    if (isCI()) return null;
    return <LightLeak {...props} />;
};

export const Main: React.FC = () => {
    // BPM 72 -> 1 beat = 25 frames, 1 bar = 100 frames
    const BAR_FRAMES = 100;

    // Total 16 bars alignment strategy
    // Since Intro is fixed at 10s (300f = 3 bars),
    // we make the next scene 13 bars to complete the 16-bar phrase.

    const introFrames = 300; // 3 bars
    const reflectiveFrames = 13 * BAR_FRAMES; // 13 bars (Total 16 bars reached)
    const glitchFrames = 16 * BAR_FRAMES; // 16 bars separate phrase
    const subspaceFrames = 16 * BAR_FRAMES; // 16 bars separate phrase

    // Transition Timings (cumulative)
    const transition1Start = introFrames; // 300
    const transition2Start = introFrames + reflectiveFrames; // 1600
    const transition3Start = transition2Start + glitchFrames; // 3200

    return (
        <AbsoluteFill className="bg-black">
            <Audio
                src={staticFile("assets/audio/new_ecos.mp3")}
                trimBefore={40 * 30}
            />

            <TransitionSeries>
                <TransitionSeries.Sequence durationInFrames={introFrames}>
                    <IntroScene />
                </TransitionSeries.Sequence>

                <TransitionSeries.Sequence durationInFrames={reflectiveFrames}>
                    <ReflectiveScene />
                </TransitionSeries.Sequence>

                <TransitionSeries.Sequence durationInFrames={glitchFrames}>
                    <GlitchScene />
                </TransitionSeries.Sequence>

                <TransitionSeries.Sequence durationInFrames={subspaceFrames}>
                    <SubspaceScene />
                </TransitionSeries.Sequence>
            </TransitionSeries>

            {/* --- Transitions Overlays (Do not affect timeline duration) --- */}

            {/* 1. Intro -> Reflective (Flash) */}
            <Sequence from={transition1Start - 15} durationInFrames={30}>
                <AbsoluteFill>
                    <SafeLightLeak durationInFrames={30} seed={10} hueShift={180} />
                    <div className="w-full h-full bg-white opacity-20 mix-blend-overlay" />
                </AbsoluteFill>
            </Sequence>

            {/* 2. Reflective -> Glitch (Hard Cut / Glitch) */}
            <Sequence from={transition2Start - 5} durationInFrames={10}>
                <AbsoluteFill className="bg-neutral-800 mix-blend-difference" />
            </Sequence>

            {/* 3. Glitch -> Subspace (Fade/Overlay) */}
            <Sequence from={transition3Start - 15} durationInFrames={30}>
                <AbsoluteFill className="bg-black opacity-50" />
            </Sequence>

            <NoiseLayer opacity={0.05} />
        </AbsoluteFill>
    );
};
