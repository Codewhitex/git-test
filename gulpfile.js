"use strict";

//    Load in all the Gulp plugins by including the following code in the Gulp file:
var gulp = require("gulp"),
  sass = require("gulp-sass"),
  browserSync = require("browser-sync"),
  //require del Node in the Gulp file as follows
  del = require("del"),
  //require  gulp-imagemin plugin
  imagemin = require("gulp-imagemin"),
  //require gulp-usemin and other related Gulp plugins
  uglify = require("gulp-uglify"),
  usemin = require("gulp-usemin"),
  rev = require("gulp-rev"),
  cleanCss = require("gulp-clean-css"),
  flatmap = require("gulp-flatmap"),
  htmlmin = require("gulp-htmlmin");

// add the code for the Clean task and the copyfonts task
gulp.task("clean", function () {
  return del(["dist"]);
});

gulp.task("copyfonts", function () {
  gulp
    .src("./node_modules/font-awesome/fonts/**/*.{ttf,woff,eof,svg}*")
    .pipe(gulp.dest("./dist/fonts"));
});

// create the imagemin task
gulp.task("imagemin", function () {
  return gulp
    .src("img/*.{png,jpg,gif}")
    .pipe(
      imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })
    )
    .pipe(gulp.dest("dist/img"));
});

//configure the usemin and the build task
gulp.task("usemin", function () {
  return gulp
    .src("./*.html")
    .pipe(
      flatmap(function (stream, file) {
        return stream.pipe(
          usemin({
            css: [rev()],
            html: [
              function () {
                return htmlmin({ collapseWhitespace: true });
              },
            ],
            js: [uglify(), rev()],
            inlinejs: [uglify()],
            inlinecss: [cleanCss(), "concat"],
          })
        );
      })
    )
    .pipe(gulp.dest("dist/"));
});

gulp.task("build", ["clean"], function () {
  gulp.start("copyfonts", "imagemin", "usemin");
});

//add the code for the SASS task, the Browser-Sync task and the default task as follows:
gulp.task("sass", function () {
  return gulp
    .src("./css/*.scss")
    .pipe(sass().on("error", sass.logError))
    .pipe(gulp.dest("./css"));
});

gulp.task("sass:watch", function () {
  gulp.watch("./css/*.scss", ["sass"]);
});

gulp.task("browser-sync", function () {
  var files = ["./*.html", "./css/*.css", "./img/*.{png,jpg,gif}", "./js/*.js"];

  browserSync.init(files, {
    server: {
      baseDir: "./",
    },
  });
});

// Default task
gulp.task("default", ["browser-sync"], function () {
  gulp.start("sass:watch");
});
