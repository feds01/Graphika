/**
 * Module description: rollup.config.js
 *
 * Created on 07/01/19
 * @author Alexander. E. Fedotov
 * @email <alexander.fedotov.uk@gmail.com>
 */

const commonjs = require("@rollup/plugin-commonjs");
const resolve = require("rollup-plugin-node-resolve");
const {terser} = require("rollup-plugin-terser");

const pkg = require("./package.json");

const input = "src/graphika.js";
const banner = `/*!
 * graphika.js v${pkg.version} 
 * ${pkg.homepage}
 * (c) ${new Date().getFullYear()} Alexander. E. Fedotov.
 */`;

module.exports = [
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
            resolve(),
            commonjs()
        ],
    },
    {
        input: input,
        plugins: [
            resolve(),
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