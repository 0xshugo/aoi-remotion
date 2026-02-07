import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { z } from 'zod';

// 引数スキーマ
const ArgsSchema = z.object({
    project: z.string().min(1, "Project name is required"),
    composition: z.string().default("Main"),
    date: z.string().default(() => {
        const now = new Date();
        const y = now.getFullYear();
        const m = String(now.getMonth() + 1).padStart(2, '0');
        const d = String(now.getDate()).padStart(2, '0');
        return `${y}${m}${d}`;
    }),
});

const parseArgs = () => {
    const args = process.argv.slice(2);
    const parsed: Record<string, string> = {};

    args.forEach(arg => {
        if (arg.startsWith('--')) {
            const [key, value] = arg.slice(2).split('=');
            if (key && value) {
                parsed[key] = value;
            }
        }
    });

    return parsed;
};

const main = () => {
    try {
        const rawArgs = parseArgs();

        // 簡易的なヘルプ
        if (process.argv.includes('--help')) {
            console.log(`
Usage: npx tsx scripts/render_manager.ts --project=<name> [--composition=<id>]

Options:
  --project      Project name (Required)
  --composition  Composition ID (Default: Main)
      `);
            process.exit(0);
        }

        const args = ArgsSchema.parse({
            project: rawArgs.project,
            composition: rawArgs.composition,
        });

        const outputDir = path.join(process.cwd(), 'out', 'archives');
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
        }

        const filename = `${args.date}_${args.project}_${args.composition}.mp4`;
        const outputPath = path.join(outputDir, filename);

        console.log(`🎬 Starting render for ${args.project} (${args.composition})...`);
        console.log(`📂 Output: ${outputPath}`);

        // Remotion Render Command
        // src/remotion/index.ts is the entry point
        const command = `npx remotion render src/remotion/index.ts ${args.composition} "${outputPath}"`;

        execSync(command, { stdio: 'inherit' });

        console.log(`✅ Render completed successfully!`);
        console.log(`👉 ${outputPath}`);

    } catch (error) {
        if (error instanceof z.ZodError) {
            console.error("❌ Validation Error:", error.errors.map(e => e.message).join(", "));
        } else {
            console.error("❌ Error:", error);
        }
        process.exit(1);
    }
};

main();
