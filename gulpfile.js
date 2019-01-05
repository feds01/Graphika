const size = require("gulp-size");

/* jshint strict: false */
/* globals require, console */
let gulp = require("gulp");
let exit = require("gulp-exit");

let browserify = require("browserify");
let watchify = require("watchify");
let babelify = require("babelify");

let source = require("vinyl-source-stream");
let buffer = require("vinyl-buffer");

let rename = require("gulp-rename");
let uglify = require("gulp-uglify");
let sourcemaps = require("gulp-sourcemaps");


function compile(watch) {
    let bundle = watchify(browserify("./src/graph.js", {debug: true}).transform(babelify, {
        // Use all of the ES2015 spec
        presets: ["es2015"],
        sourceMaps: true
    }));

    function reBundle() {
        return bundle
            .bundle()
            .on("error", function (err) {
                console.error(err);
                this.emit("end");
            })
            .pipe(source("build.js"))
            .pipe(buffer())
            .pipe(rename("graph.min.js"))
            .pipe(sourcemaps.init({loadMaps: true}))
            .pipe(uglify())
            .pipe(sourcemaps.write("./"))
            .pipe(gulp.dest("./dist"));
    }

    if (watch) {
        bundle.on("update", function () {
            console.log("-> bundling...");
            reBundle();
        });

        reBundle();
    } else {
        reBundle().pipe(exit());
    }
}

function watch() {
    return compile(true);
}

gulp.task("build", function () {
    return compile();
});
gulp.task("watch", function () {
    return watch();
});

gulp.task("default", ["watch"]);