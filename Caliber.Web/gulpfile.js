var webroot = './wwwroot/',
    node_modules = 'node_modules/',
    gulp = require('gulp'),
    gnf = require('gulp-npm-files'),
    concat = require('gulp-concat'),
    cssmin = require("gulp-cssmin"),
    uglify = require('gulp-uglify'),
    sourcemaps = require('gulp-sourcemaps'),
    ts = require('gulp-typescript'),
    htmlreplace = require('gulp-html-replace'),
    typescript = require('typescript'),
    del = require('del'),
    systemjsBuilder = require('systemjs-builder'),
    runSequence = require('run-sequence');

var paths = {
    systemconfig: webroot + 'js/system.config.js',
    js: webroot + 'js/**/*.js',
    minJs: webroot + 'js/**/*.min.js',
    minJsMap: webroot + 'js/**/*.min.js.map',
    app: webroot + 'app/**/*.js',
    appMap: webroot + 'app/**/*.js.map',
    css: webroot + 'css/**/*.css',
    minCss: webroot + 'css/**/*.min.css',
    appDest: webroot + 'app/',
    concatJsDest: webroot + 'bundles/site.min.js',
    concatJsMapDest: webroot + 'bundles/site.min.js.map',
    concatAppDest: webroot + 'bundles/app.min.js',
    concatAppMapDest: webroot + 'bundles/app.min.js.map',
    concatCssDest: webroot + 'bundles/site.min.css'
};

gulp.task('clean', function () {
    return del([
        webroot + 'node_modules',
        webroot + 'app',
        webroot + 'bundles']);
});

gulp.task('copyNpmDependenciesOnly', function () {
    gulp.src(gnf(), { base: './' })
        .pipe(gulp.dest(webroot));
});

gulp.task('compile:typescript', function () {
    var tsProject = ts.createProject('tsconfig.json', { inlineSourceMap: false, inlineSources: false });

    return tsProject.src()
        .pipe(tsProject())
        .pipe(gulp.dest(paths.appDest));
});

gulp.task('min:app', ['compile:typescript'], function () {
    var builder = new systemjsBuilder(".", paths.systemconfig);

    builder.loader.defaultJSExtensions = true;

    return builder.buildStatic(webroot + 'app/main.js', paths.concatAppDest, { sourceMaps: true });
});

gulp.task('min:js', ['min:app'], function () {
    return gulp.src([
        node_modules + 'core-js/client/shim.min.js',
        node_modules + 'reflect-metadata/Reflect.js',
        node_modules + 'systemjs/dist/system.src.js',
        node_modules + 'systemjs/dist/system-polyfills.js',
        node_modules + 'zone.js/dist/zone.min.js',
        node_modules + 'hammerjs/hammer.js',
        paths.js,
        paths.concatAppDest,
        '!' + paths.systemconfig,
        '!' + paths.minJs])
        .pipe(sourcemaps.init())
        .pipe(concat(paths.concatJsDest))
        .pipe(uglify())
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('.'));
});

gulp.task('min:css', function () {
    return gulp.src([
        node_modules + '@angular/material/core/theming/prebuilt/indigo-pink.css',
        paths.css,
        "!" + paths.minCss])
        .pipe(concat(paths.concatCssDest))
        .pipe(cssmin())
        .pipe(gulp.dest('.'));
});

gulp.task('replace:html', function () {
    return gulp.src(webroot + 'index.html')
        .pipe(htmlreplace({
            'js': 'bundles/site.min.js',
            'css': 'bundles/site.min.css',
            keepBlockTags: false
        }))
        .pipe(gulp.dest(webroot));
});

gulp.task('default', function (callback) {
    runSequence(
        'clean',
        'copyNpmDependenciesOnly',
        ['min:js', 'min:css'],
        'replace:html',
        callback);
});