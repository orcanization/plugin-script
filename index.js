#!/usr/bin/env node
import {mkdir, writeFile} from "node:fs/promises";
import {existsSync} from "node:fs";
import path from "node:path";
import * as esbuild from "esbuild";
import packageInfo from "./package.json" with {type: "json"};
import {uiToStringPlugin} from "./esbuild-plugins/plugin-ui-string.js";

const devRoot = process.cwd()

const defaultExternals = ["react", "react-dom", "next"];
const userExternals = packageInfo.pluginConfig?.external || [];

const res = await esbuild.build({
    entryPoints: ["src/index.ts"],
    bundle: true,
    format: "esm",
    platform: "node",
    external: [...new Set([...defaultExternals, ...userExternals])],
    plugins: [uiToStringPlugin],
    write: false,
});

const code = res.outputFiles[0].text;

const distFolder = path.join(devRoot, ".dist");
if (!existsSync(distFolder)) await mkdir(distFolder, { recursive: true });
const outPath = path.join(distFolder, `${packageInfo.name}.js`);
await writeFile(outPath, code);

console.log(`✅ Plugin bundled successfully: ${outPath}`);