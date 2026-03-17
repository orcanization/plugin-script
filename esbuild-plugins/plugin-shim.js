import {readFileSync} from "node:fs";
import {join} from "node:path";

export const reactShimPlugin = {
    name: 'react-shim',
    setup(build) {
        // react → shim
        build.onResolve({filter: /^react$/}, () => ({
            path: 'react-shim',
            namespace: 'shim',
        }));

        // jsx-runtime → shim
        build.onResolve({filter: /^react\/jsx-runtime$/}, () => ({
            path: 'jsx-runtime-shim',
            namespace: 'shim',
        }));

        build.onLoad({filter: /.*/, namespace: 'shim'}, (args) => {
            if (args.path === 'react-shim') {
                const filePath = join(__dirname, "shims", "react-shim.js");
                return {
                    contents: readFileSync(filePath, 'utf8'),
                    loader: 'js',
                };
            }

            if (args.path === 'jsx-runtime-shim') {
                const filePath = join(__dirname, "shims", "jsx-runtime-shim.js");
                return {
                    contents: readFileSync(filePath, 'utf8'),
                    loader: 'js',
                };
            }
        });
    },
}