import { enableTailwind } from "@remotion/tailwind-v4";
import path from "path";

/**
 *  @param {import('webpack').Configuration} currentConfig
 */
export const webpackOverride = (currentConfig) => {
  const config = enableTailwind(currentConfig);
  return {
    ...config,
    resolve: {
      ...config.resolve,
      alias: {
        ...(config.resolve?.alias ?? {}),
        "@": path.join(process.cwd(), "src"),
        "@data": path.join(process.cwd(), "data"),
        "@public": path.join(process.cwd(), "public"),
      },
    },
  };
};
