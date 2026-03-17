#!/usr/bin/env node
import {mkdir, writeFile} from "node:fs/promises";
import {existsSync, readFileSync} from "node:fs";
import {join} from "node:path";
import * as esbuild from "esbuild";
import {uiToStringPlugin} from "./esbuild-plugins/plugin-ui-string.js";

const devRoot = process.cwd()

const pluginPackageInfoRaw = readFileSync(join(devRoot, "package.json"), "utf8")
const pluginPackageInfo = JSON.parse(pluginPackageInfoRaw)

const defaultExternals = ["react", "react-dom", "next"];
const userExternals = pluginPackageInfo["pluginConfig"]?.external || [];

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

const distFolder = join(devRoot, ".dist");
if (!existsSync(distFolder)) await mkdir(distFolder, {recursive: true});
const outPath = join(distFolder, `${pluginPackageInfo.name}.js`);
await writeFile(outPath, code);

console.log(`✅ Plugin bundled successfully: ${outPath}`);