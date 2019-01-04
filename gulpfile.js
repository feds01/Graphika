const gulp = require("gulp"),
    browserify = require("browserify"),
    buffer = require("vinyl-buffer"),
    uglifyjs = require("uglify-es"),
    composer = require("gulp-uglify/composer"),
    size = require("gulp-size"),
    source = require("vinyl-source-stream");

let minify = composer(uglifyjs, console);

gulp.task("js", () => {
    return browserify("src/graph.js", {standalone: "Graph"})
        .bundle()
        .on("error", function (err) {
            console.log("Error : " + err.message);
            this.emit("end");
        })
        .pipe(source("graph.min.js"))
        .pipe(buffer())
        .pipe(minify())
        .pipe(size({"gzip": true}))
        .pipe(gulp.dest("./dist"));
});


gulp.task("watch", () => {
    gulp.watch("src/**/*.js", gulp.series(["js"]));
});


gulp.task("default", gulp.series(["js", "watch"]));