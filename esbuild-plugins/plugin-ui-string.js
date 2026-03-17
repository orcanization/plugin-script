import path from 'path';
import {existsSync} from 'fs';
import * as esbuild from 'esbuild';
import {reactShimPlugin} from './plugin-shim.js';

export const uiToStringPlugin = {
    name: 'ui-to-string',
    setup(build) {
        // Wir suchen gezielt nach .tsx/.jsx Importen
        build.onResolve({ filter: /.*/ }, args => {
            // Wir filtern manuell, damit wir auch Importe ohne Endung erwischen
            // Du kannst den Filter verfeinern, z.B. nur für relative Pfade: /^\./
            if (!args.path.includes('ui') && !args.path.endsWith('.tsx') && !args.path.endsWith('.jsx')) {
                return null;
            }

            let fullPath = path.resolve(args.resolveDir, args.path);

            // Falls die Datei nicht direkt existiert, Endungen prüfen
            if (!existsSync(fullPath)) {
                if (existsSync(fullPath + '.tsx')) {
                    fullPath += '.tsx';
                } else if (existsSync(fullPath + '.jsx')) {
                    fullPath += '.jsx';
                } else {
                    // Wenn keine Datei gefunden wurde, lassen wir esbuild
                    // den Standard-Resolve-Prozess fortführen
                    return null;
                }
            }

            // Nur wenn es eine UI-Komponente ist, in den ui-bundle Namespace schieben
            return {
                path: fullPath,
                namespace: 'ui-bundle'
            };
        });

        build.onLoad({ filter: /.*/, namespace: 'ui-bundle' }, async (args) => {
            // Wir bündeln die UI-Datei für den Browser
            const result = await esbuild.build({
                entryPoints: [args.path],
                bundle: true,
                write: false,
                format: 'esm',
                platform: 'browser',
                minify: false,
                external: ['react', 'react-dom', 'next', 'react/jsx-runtime'],
                plugins: [reactShimPlugin]
            });

            const bundledCode = result.outputFiles[0].text;

            console.log(bundledCode)

            // Wir geben den Code als String-Export zurück
            return {
                contents: `export default ${JSON.stringify(bundledCode)};`,
                loader: 'js'
            };
        });
    }
};