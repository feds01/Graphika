/**
 * Module description: rollup.config.js
 *
 * Created on 07/01/19
 * @author Alexander. E. Fedotov
 * @email <alexander.fedotov.uk@gmail.com>
 */

import commonjs from '@rollup/plugin-commonjs';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';

import pkg from './package.json' with { type: "json" };

const input = "src/graphika.js";
const banner = `/*!
 * graphika.js v${pkg.version} 
 * ${pkg.homepage}
 * (c) ${new Date().getFullYear()} Alexander. E. Fedotov.
 */`;

export default [
    // UMD builds (including moment)
    // dist/graphika.min.js
    // dist/graphika.js
    {
        input: input,
        output: {
            name: "Graph",
            file: "dist/graphika.js",
            banner: banner,
            format: "umd",
            indent: false,
            sourcemap: true,
        },
        plugins: [
            nodeResolve(),
            commonjs()
        ],
    },
    {
        input: input,
        plugins: [
            nodeResolve(),
            commonjs(),
            terser({
                output: {
                    preamble: banner
                },
                compress: {
                    warnings: true,
                    keep_fnames: false,
                    keep_classnames: false,
                },
                mangle: {
                    keep_classnames: false,
                    keep_fnames: false,
                    reserved: ["Graph"]
                }
            })
        ],
        output: {
            name: "Graph",
            file: "dist/graphika.min.js",
            format: "umd",
            indent: false
        }
    }
];
