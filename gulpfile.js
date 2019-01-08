let gulp = require("gulp");
let size = require("gulp-size");
let terser = require("gulp-terser");
let util = require("gulp-util");
let exec = require("child_process").exec;
let yargs = require("yargs");

let argv = yargs
    .option("verbose", {default: false})
    .argv;

let srcDir = "./src/";

if (argv.verbose) {
    util.log("Gulp running with options: " + JSON.stringify(argv, null, 2));
}

gulp.task("build", buildTask);
gulp.task("library-size", librarySizeTask);
gulp.task("module-sizes", moduleSizesTask);
gulp.task("size", gulp.parallel("library-size", "module-sizes"));
gulp.task("default", gulp.parallel("build"));

function run(bin, args, done) {
    return new Promise(function(resolve, reject) {
        let exe = "\"" + process.execPath + "\"";
        let src = require.resolve(bin);
        let ps = exec([exe, src].concat(args || []).join(" "));

        ps.stdout.pipe(process.stdout);
        ps.stderr.pipe(process.stderr);
        ps.on("close", function(error) {
            if (error) {
                reject(error);
            } else {
                resolve();
            }
        });
    });
}


function buildTask() {
    return run("rollup/bin/rollup", ["-c", "--sourcemap" , argv.watch ? "--watch" : ""]);
}



function librarySizeTask() {
    return gulp.src("dist/graph.min.js")
        .pipe(size({
            gzip: true
        }));
}

function moduleSizesTask() {
    return gulp.src(srcDir + "**/*.js")
        .pipe(terser())
        .pipe(size({
            showFiles: true,
            gzip: true
        }));
}