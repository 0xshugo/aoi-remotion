export const SONG_CONFIG = {
    BPM: 72,
    // 1拍の長さ(秒) = 60 / BPM
    // 1拍のフレーム数(@30FPS) = (60 / 72) * 30 = 25 frames
    BEAT_FRAMES: 25,
    ONE_BAR_FRAMES: 25 * 4, // 100 frames

    // Section Durations (in bars)
    INTRO_BARS: 10,
    REFLECTIVE_BARS: 16,
    GLITCH_BARS: 12,
    STATIC_BARS: 8,
    OUTRO_BARS: 10,

    // Colors
    COLOR_PALETTE: {
        bgC: "#050505", // Almost black
        fg: "#e0e0e0", // Post-industrial grey
        accent: "#ff3333", // Glitch red (rare)
        grid: "#1a1a1a", // Structure line
    }
};

export const getFrames = (bars: number) => Math.floor(bars * SONG_CONFIG.ONE_BAR_FRAMES);
