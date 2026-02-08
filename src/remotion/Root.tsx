import { Composition } from "remotion";
import { Main } from "./MyComp/Main";
import { Main as EcosMain } from "../scenes/EcosDelSistema/Main";
import {
  COMP_NAME,
  defaultMyCompProps,
  DURATION_IN_FRAMES,
  VIDEO_FPS,
  VIDEO_HEIGHT,
  VIDEO_WIDTH,
} from "../../types/constants";
import { NextLogo } from "./MyComp/NextLogo";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* <Composition
        id={COMP_NAME}
        component={Main}
        durationInFrames={DURATION_IN_FRAMES}
        fps={VIDEO_FPS}
        width={VIDEO_WIDTH}
        height={VIDEO_HEIGHT}
        defaultProps={defaultMyCompProps}
      /> */}
      <Composition
        id="EcosDelSistema"
        component={EcosMain}
        // Lower resolution for stability (1280x720)
        // High Quality Full HD
        durationInFrames={4800}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="NextLogo"
        component={NextLogo}
        durationInFrames={300}
        fps={30}
        width={140}
        height={140}
        defaultProps={{
          outProgress: 0,
        }}
      />
    </>
  );
};
