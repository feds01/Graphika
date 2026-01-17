/**
 * Module description: rolldown.config.js
 *
 * Created on 17/01/26.
 * @author Alexander. E. Fedotov
 * @email <alexander.fedotov.uk@gmail.com>
 */

import { defineConfig } from "rolldown";
import pkg from "./package.json" with { type: "json" };

const input = "src/index.ts";
const banner = `/**
 * graphika.js v${pkg.version}
 * ${pkg.homepage}
 * (c) ${new Date().getFullYear()} Alexander. E. Fedotov.
 */`;

export default defineConfig([
    // dist/graphika.js
    {
        input: input,
        output: {
            name: "Graph",
            file: "dist/graphika.js",
            banner: banner,
            format: "umd",
            sourcemap: true,
        },
    },
    // dist/graphika.min.js
    {
        input: input,
        output: {
            name: "Graph",
            file: "dist/graphika.min.js",
            banner: banner,
            format: "umd",
            minify: true,
        },
    },
]);
