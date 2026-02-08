import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';

export const MirrorFrame: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <AbsoluteFill className="flex flex-row">
            {/* Left Pane (Normal) */}
            <div className="w-1/2 h-full overflow-hidden relative border-r border-neutral-800">
                <AbsoluteFill>
                    {children}
                </AbsoluteFill>
            </div>

            {/* Right Pane (Mirrored) */}
            <div className="w-1/2 h-full overflow-hidden relative">
                <AbsoluteFill style={{ transform: 'scaleX(-1)' }}>
                    {children}
                </AbsoluteFill>
            </div>
        </AbsoluteFill>
    );
};
