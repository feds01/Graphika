/**
 * Module description:   gulpfile.js
 *
 * Project Gulpfile containing build, watch and size tasks.
 *
 * Created on 08/04/2020
 * @author Alexander. E. Fedotov
 * @email <alexander.fedotov.uk@gmail.com>
 */

let gulp = require("gulp");
let size = require("gulp-size");
let terser = require("gulp-terser");
let exec = require("child_process").exec;
let argumentParser = require("yargs");

console.log(process.argv[3]);
const argv = argumentParser.option("verbose", {default: false}).argv;
const src = "./src/";

gulp.task("build", buildTask);
gulp.task("library-size", librarySizeTask);
gulp.task("module-sizes", moduleSizesTask);
gulp.task("size", gulp.parallel("library-size", "module-sizes"));
gulp.task("default", gulp.parallel("build"));

function run(bin, args) {
    return new Promise((resolve, reject) => {
        let exe =  `"${process.execPath}"`;
        let src = require.resolve(bin);
        let ps = exec([exe, src].concat(args || []).join(" "));

        ps.stdout.pipe(process.stdout);
        ps.stderr.pipe(process.stderr);
        ps.on("close", (error) => {
            if (error) {
                reject(error);
            } else {
                resolve();
            }
        });
    });
}


function buildTask() {
    return run("rollup/dist/bin/rollup", ["-c", "--sourcemap" , argv.watch ? "--watch" : ""]);
}

function librarySizeTask() {
    return gulp.src("dist/graph.min.js")
        .pipe(size({
            gzip: true
        }));
}

function moduleSizesTask() {
    return gulp.src(src + "**/*.js")
        .pipe(terser())
        .pipe(size({
            showFiles: true,
            gzip: true
        }));
}
