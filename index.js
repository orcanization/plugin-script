#!/usr/bin/env node
import {mkdir, writeFile} from "node:fs/promises";
import {existsSync} from "node:fs";
import path from "node:path";
import * as esbuild from "esbuild";
import packageInfo from "./package.json" with {type: "json"};

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

if (!existsSync(".dist")) await mkdir(".dist", {recursive: true});
const out = path.join(".dist", `${packageInfo.name}.js`);
await writeFile(out, code);

console.log(`✅ Plugin bundled successfully: ${out}`);