import React from 'react';
import { AbsoluteFill, staticFile, Video, useCurrentFrame, interpolate, Sequence, Loop } from 'remotion';
import { NoiseLayer } from './components/NoiseLayer';

// Helper component for Ping-Pong Loop Video
const PingPongVideo: React.FC = () => {
    // Total duration: 26.56s * 30fps = 796
    const VIDEO_FRAMES = 796;
    const HALF_FRAMES = Math.floor(VIDEO_FRAMES / 2); // 398 frames (~13.2s)

    // Loop duration: Forward (Half) + Reverse (Half corresponding to Forward)
    // Reverse video: Duration 796. The part corresponding to Forward(0-398) is Reverse(398-796).
    const LOOP_DURATION = HALF_FRAMES * 2;

    return (
        <Loop durationInFrames={LOOP_DURATION}>
            {/* 1. Forward Play (0 - Half) */}
            <Sequence durationInFrames={HALF_FRAMES}>
                <Video
                    src={staticFile("assets/videos/scene2.mp4")}
                    className="w-full h-full object-cover mix-blend-difference"
                    style={{
                        filter: 'invert(1) contrast(1.5) brightness(1.2)',
                        width: '120%',
                        height: '120%',
                        marginLeft: '-10%',
                        marginTop: '-10%'
                    }}
                    muted
                    // Play first half
                    endAt={HALF_FRAMES}
                />
            </Sequence>

            {/* 2. Reverse Play (Corresponding Half to go back to start) */}
            {/* Reverse video plays backwards: 796->0. 
                We want 398->0. This corresponds to Reverse video frames 398->796.
                So we trim before 398.
            */}
            <Sequence from={HALF_FRAMES} durationInFrames={HALF_FRAMES}>
                <Video
                    src={staticFile("assets/videos/scene2_reverse.mp4")}
                    className="w-full h-full object-cover mix-blend-difference"
                    style={{
                        filter: 'invert(1) contrast(1.5) brightness(1.2)',
                        width: '120%',
                        height: '120%',
                        marginLeft: '-10%',
                        marginTop: '-10%'
                    }}
                    muted
                    trimBefore={HALF_FRAMES} // Start from middle of reverse video
                />
            </Sequence>
        </Loop>
    );
};

export const ReflectiveScene: React.FC = () => {
    const frame = useCurrentFrame();

    // Constant slow movement
    const scale = interpolate(frame, [0, 1300], [1.2, 1.5]);
    const rotate = interpolate(frame, [0, 1300], [0, 10]);
    const panY = interpolate(frame, [0, 1300], [0, 50]);

    // Delay handling: 1 beat = 25 frames. Half beat = 12.5 frames -> 13 frames.
    const DELAY = 13;

    return (
        <AbsoluteFill className="bg-black">
            <div style={{
                width: '100%',
                height: '100%',
                transform: `scale(${scale}) rotate(${rotate}deg) translateY(${panY}px)`,
                display: 'flex',
                flexDirection: 'row'
            }}>
                {/* Left Panel */}
                <div style={{ width: '50%', height: '100%', position: 'relative', overflow: 'hidden' }}>
                    <PingPongVideo />
                </div>

                {/* Right Panel (Mirrored & Delayed) */}
                <div style={{
                    width: '50%',
                    height: '100%',
                    position: 'relative',
                    overflow: 'hidden',
                    transform: 'scaleX(-1)' // Mirror horizontally
                }}>
                    <Sequence from={DELAY}>
                        <PingPongVideo />
                    </Sequence>
                </div>
            </div>

            <NoiseLayer opacity={0.15} />
        </AbsoluteFill>
    );
};
