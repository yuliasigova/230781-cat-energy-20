const gulp = require("gulp");
const plumber = require("gulp-plumber");
const sourcemap = require("gulp-sourcemaps");
const sass = require('gulp-sass')(require('sass'));
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const sync = require("browser-sync").create();
const csso = require("gulp-csso");
const rename = require("gulp-rename");
const imagemin = require("gulp-imagemin");
const del = require("del");

// Styles

const styles = () => {
  return gulp.src("docs/sass/style.scss")
    .pipe(plumber())
    .pipe(sourcemap.init())
    .pipe(sass())
    .pipe(postcss([
      autoprefixer()
    ]))
    .pipe(gulp.dest("./build/css"))
    .pipe(csso())
    .pipe(rename("styles.min.css"))
    .pipe(sourcemap.write("."))
    .pipe(gulp.dest("./build/css"))
    .pipe(sync.stream());
}

exports.styles = styles;

// HTML

const html = () => {
  return gulp.src("docs/*.html")
    .pipe(gulp.dest("./build"))
    .pipe(sync.stream());
}
exports.html = html;

const webp =() => {
  return gulp.src("docs/img/*.webp")
  .pipe(gulp.dest("./build/img"))
}
exports.webp = webp;

//Imagemin
const images = () => {
  return gulp.src("docs/img/**/*.{jpg,png,svg}")
    .pipe(imagemin([
      imagemin.optipng({optimizationLevel: 3}),
      imagemin.mozjpeg({progressive: true}),
      imagemin.svgo()
    ]))
    .pipe(gulp.dest("./build/img"));
}
exports.images = images;

// Copy
const copy = () => {
  return gulp.src([
    "docs/fonts/**/*.{woff,woff2}",
    "docs/js/**",
  ], {
    base: 'docs'
  })
    .pipe(gulp.dest("build"));
};
exports.copy = copy;

// Clean

const clean = () => {
  return del("build");
};
exports.clean = clean;

// Server

const server = (done) => {
  sync.init({
    server: {
      baseDir: "./build"
    },
    cors: true,
    notify: false,
    ui: false,
  });
  done();
}

exports.server = server;

// Watcher

const watcher = () => {
  gulp.watch('docs/sass/**/*.scss', gulp.series(styles));
  gulp.watch('docs/*.html', gulp.series(html));
}

// Build
const build = gulp.series(clean, copy, styles, images, webp, html);
exports.build = build;

// Start
exports.start = gulp.series(build, server, watcher);
