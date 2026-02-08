---
name: motion-design
description: Creating dynamic motion and visual interest in Music Videos (MV) with Remotion
metadata:
  tags: mv, motion, dynamic, loop, ping-pong, mirror, glitch, pacing
---

# Motion Design & MV Production Tips

When creating Music Videos with Remotion, static or simple looping visuals can quickly become monotonous. Use these techniques to add life and variation to your scenes.

## 1. Always Keep Moving (The "Alive" Principle)

Even for a "static" scene, apply subtle, continuous transformations. Never let a frame be completely still.

```tsx
const frame = useCurrentFrame();

// Good: Subtle zoom and rotation over time
const scale = interpolate(frame, [0, 600], [1.0, 1.2]);
const rotate = interpolate(frame, [0, 600], [0, 5]); // Slow rotation (5 degrees)

return (
  <div style={{ transform: `scale(${scale}) rotate(${rotate}deg)` }}>
    {/* Content */}
  </div>
);
```

## 2. Looping Strategies for Stock Footage

Simple loops of short clips (e.g., 5-10s) can be obvious and boring if the scene is long (e.g., 30s+).

### A. Ping-Pong Loop (Forward <-> Reverse)
Doubles the loop cycle and hides the "jump" at the end.

```tsx
const VIDEO_FRAMES = 300; // Duration of your clip
const LOOP_DURATION = VIDEO_FRAMES * 2; 

<Loop durationInFrames={LOOP_DURATION}>
  {/* Forward */}
  <Sequence durationInFrames={VIDEO_FRAMES}>
     <Video src={src} />
  </Sequence>
  {/* Reverse */}
  <Sequence from={VIDEO_FRAMES} durationInFrames={VIDEO_FRAMES}>
      {/* Use a pre-reversed video file or specific playback technique */}
      <Video src={reversedSrc} /> 
      {/* OR for simple reversing if supported (not native in <Video>): */}
      {/* Pre-processing with ffmpeg is recommended for reverse playback */}
  </Sequence>
</Loop>
```

### B. Offset Loop (Split Screen)
Use the same footage but offset the start time or speed to create complexity.

```tsx
<div style={{ display: 'flex' }}>
  <Video src={src} /> {/* Normal */}
  
  {/* Delayed by 1/2 beat (e.g. 12 frames) and mirrored */}
  <Sequence from={12}>
     <div style={{ transform: 'scaleX(-1)' }}>
        <Video src={src} />
     </div>
  </Sequence>
</div>
```

## 3. Visual Variation Techniques

### Invert & High Contrast
Change the mood instantly by inverting colors. Great for transitions between "Dark" and "Light" sections.

```tsx
<Video 
  style={{ filter: 'invert(1) contrast(1.5) brightness(1.2)' }}
/>
```

### Glitch & Time-Displacement
Break the linearity by jumping frames or overlaying noise.

## 4. Audio Synchronization

- **Trim, Don't StartFrom**: To play an audio file from the middle, use `trimBefore`. `startFrom` is for timeline positioning.
  ```tsx
  <Audio src={src} trimBefore={30 * 40} /> // Start from 40s mark
  ```
- **Sync to BPM**: Calculate exact frame counts for bars.
  - BPM 72 -> 1 beat = 25 frames (at 30fps).
  - Sync cuts and scene changes to these grid points (e.g., every 4 bars = 100 frames).

## 5. Composition Structure

- **Intro**: Keep it short (e.g., 4-8 bars).
- **Build-up**: Increase motion speed or complexity.
- **Drop/Main**: Use the most dynamic visual techniques (inverts, fast cuts).
- **Outro**: Fade out motion, return to simple loops.
