// See all configuration options: https://remotion.dev/docs/config
// Each option also is available as a CLI flag: https://remotion.dev/docs/cli

// Note: When using the Node.JS APIs, the config file doesn't apply. Instead, pass options directly to the APIs

import { Config } from "@remotion/cli/config";
import { webpackOverride } from "./src/remotion/webpack-override.mjs";

Config.setVideoImageFormat("jpeg");

// Optimized Chromium options for CI environment
if (process.env.CI === 'true') {
    // @ts-ignore
    Config.setChromiumOptions({
        headless: true,
        gl: 'swangle', // Force swangle at config level
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-gpu',
            '--disable-dev-shm-usage',
            '--disable-extensions',
            '--disable-plugins',
            '--disable-web-security',
        ],
    });
}

Config.overrideWebpackConfig(webpackOverride);
