import {readFileSync} from "node:fs";

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
                return {
                    contents: readFileSync('scripts/react-shim.js', 'utf8'),
                    loader: 'js',
                };
            }

            if (args.path === 'jsx-runtime-shim') {
                return {
                    contents: readFileSync('scripts/jsx-runtime-shim.js', 'utf8'),
                    loader: 'js',
                };
            }
        });
    },
}