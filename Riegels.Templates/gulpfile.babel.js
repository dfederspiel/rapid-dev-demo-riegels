const gulp = require('gulp'),
    pug = require('gulp-pug'), //https://www.npmjs.com/package/gulp-pug
    sourcemaps = require('gulp-sourcemaps'),
    concat = require('gulp-concat'),
    sass = require('gulp-sass'),
    fs = require("fs"),
    colors = require('colors'),
    browserify = require('browserify'),
    source = require('vinyl-source-stream'),
    buffer = require('vinyl-buffer'),
    uglify = require('gulp-uglify'),
    express = require('express'),
    bs = require('browser-sync').create(),
    reload = bs.reload,
    exec = require("child_process").exec,
    cleanCSS = require('gulp-clean-css');

const log = (o, level = 0) => {
    if (level > 2)
        return;
    for (var p in o) {
        console.log(`${colors.red('prop:')}${p}: ${o[p]}`);
        if (o[p] != null && typeof o[p] == 'object') {
            try {
                console.log("DETAILS")
                log(o[p], level + 1);
            } catch (err) {
                console.log('CANT GET INFO')
            }
        }
    }
}

let router = express.Router();
let jsonServer = require('json-server');
let server = null;

const templateDistributionLocation = "./dist";
const webDistributionLocation = "../Riegels";

var jsonData = require('./src/data/generate.js');

var packageJSON = require('./package.json');
var dependencies = Object.keys(packageJSON && packageJSON.dependencies || {});

const json = (callback) => {
    console.log(colors.cyan('[JSON] Generating a new DB'));

    delete require.cache[require.resolve('./src/data/generate.js')];
    jsonData = require('./src/data/generate.js');
    try {
        fs.writeFile("./src/data/db.json", JSON.stringify(jsonData()), 'utf8', (err) => {
            if (err) {
                console.log('[JSON] ' + colors.red(err));
                if (callback)
                    callback()
            } else{
                console.log(colors.green('[JSON] DB.json Saved'.bold));
                if (callback)
                    callback();
            }
        });
    } catch (err) {
        console.log('[JSON] ' + colors.red(err.toString()));
        if (callback)
            callback();
    }
};

const html = (callback) => {
    console.log(colors.cyan('[HTML] Transpiling PUG'));
    return gulp.src(['./src/markup/**/*.pug', '!src/markup/content/**/*.pug', '!src/markup/grids/**/*.pug', '!src/markup/mixins/**/*.pug'])
        .pipe(
            pug({
                pretty: true,
                debug: false,
                compileDebug: false,
                data: jsonData()
            }).on('error', function (err) {
                console.log('[HTML] ' + colors.bgWhite.red(err.toString()));
                console.log('[HTML] ' + colors.red(err.message));
                callback();
            })
            .on('end', function () {
                console.log(colors.green('[HTML] Transpilation complete'));
                callback();
            })
        )
        .pipe(gulp.dest(templateDistributionLocation + '/'))
        .pipe(gulp.dest(webDistributionLocation + '/'))
        .pipe(bs.stream({once: true}));
};

const img = (callback) => {
    console.log(colors.cyan('[IMAGE] Copying Images'));
    return gulp.src('./src/img/**/*.*')
        .pipe(gulp.dest(templateDistributionLocation + '/img'))
        .pipe(gulp.dest(webDistributionLocation + '/img'))
        .on('error', function (err) {
            console.log('[IMAGE] ' + colors.red(err.toString()));
            callback();
        }).on('end', function () {
            callback();
        });
};

const font = () => {
    console.log('[FONT] ' + colors.cyan('Copying Fonts'));
    return gulp.src('./src/fonts/**/*.*')
        .pipe(gulp.dest(templateDistributionLocation + '/fonts'))
        .pipe(gulp.dest(webDistributionLocation + '/fonts'));
};

const js = (callback) => {
    console.log(colors.cyan('[JS] Bundling and Babeling JS'));
    var b = browserify({
            entries: './src/js/app.js',
            debug: true
        })
        .external(dependencies)
        .transform('babelify', {
            presets: ['@babel/preset-env']
        });

    return b
        .bundle((err) => {
            if (err)
                console.log('[JS] ' + colors.red(err.toString()));

            if (callback)
                callback();
        })
        .pipe(source('app.min.js'))
        .pipe(buffer())
        .pipe(sourcemaps.init({
            loadMaps: true
        }))
        .pipe(uglify())
        .on('error', function (err) {
            console.log('[JS] ' + colors.red(err.toString()));
            callback();
        })
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(templateDistributionLocation + '/js'))
        .pipe(gulp.dest(webDistributionLocation + '/js'))
        .on('end', function () {
            callback();
        });
};

const jsv = (callback) => {
    console.log(colors.cyan('[JS V] Bundling and Babeling Vendor JS'));
    var b = browserify({
        debug: true
    }).transform('babelify', {
        presets: ['@babel/preset-env']
    });

    dependencies.forEach(lib => {
        b.require(lib);
    });

    return b
        .bundle((err) => {
            if (err)
                console.log('[JS V] ' + colors.red(err.toString()));

            if (callback)
                callback();
        })
        .pipe(source('vendors.min.js'))
        .pipe(buffer())
        .pipe(sourcemaps.init({
            loadMaps: true
        }))
        .pipe(uglify())
        .on('error', function (err) {
            console.log('[JS V] ' + colors.red(err.toString()));
            callback();
        })
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(templateDistributionLocation + '/js'))
        .pipe(gulp.dest(webDistributionLocation + '/js'));
};

const scss = (callback) => {
    console.log(colors.cyan('[SCSS] Transpiling Sass to Css'));
    var postcss = require('gulp-postcss');
    var autoprefixer = require('autoprefixer');

    return bundle([
        './src/styles/global.scss'
    ], 'bundle.min.css');

    function bundle(source, dest) {
        return gulp.src(source)
            .pipe(sourcemaps.init())
            .pipe(sass().on('error', sass.logError))
            .pipe(concat(dest))
            .pipe(postcss([autoprefixer()]))
            .pipe(cleanCSS({
                compatibility: 'ie8'
            }))
            .pipe(sourcemaps.write('.'))
            .on('end', callback)
            .on('error', function (err) {
                console.log(colors.red('[SCSS] ' + err.toString()));
                callback();
            })
            .pipe(gulp.dest(templateDistributionLocation + '/css'))
            .pipe(gulp.dest(webDistributionLocation + '/css'))
            .pipe(bs.stream());

    }
};

const serve = (callback) => {
    console.log(colors.cyan('[SERVE] Says: standing up your server'));
    build_routes();
    bs.init({
        open: false,
        notify: true,
        logPrefix: 'Server Says:',
        server: {
            baseDir: "./dist/",
            index: "index.html"
        },
        middleware: [function (req, res, next) {
            router(req, res, next)
        }]
    }, function (err, bs) {
        console.log(colors.cyan('[SERVE] Says: hello'));
        callback();
    });
};

const build_routes = (cb) => {
    console.log(colors.cyan('[ROUTE] Rebuilding routes'));
    router = express.Router();
    server = jsonServer.create({
        verbosity: {
            level: "info",
            urlTracing: false
        }
    });
    server.use(jsonServer.defaults());
    server.use(jsonServer.router(jsonData()));
    router.use('/api', server)
    if(cb) cb();
};

const watch = (done) => {

    console.log(colors.cyan('[WATCH] Watching...'));

    gulp.watch(['./src/markup/**/*.pug'], function Transpiling_Pug(done){
        bs.notify("Recompiling HTML", 1000);
        html(done);
    })

    gulp.watch(['./src/styles/**/*.scss'], function Transpiling_Sass(done){
        bs.notify("Recompiling SASS", 1000);
        scss(done);
    })

    gulp.watch(['./src/js/**/*.js'], function JavaScript_Bundler(done){
        bs.notify("Recompiling JavaScript", 1000);
        js(()=>{
            reload();
            done();
        });
    })

    gulp.watch(['./src/data/generate.js'], function Data_Generator (done) {
        bs.notify("Regenerating Data", 1000);
        json(() =>{
            build_routes(() => {
                reload();
                done();
            })
        });
    })

    gulp.watch(['./src/img/**/*'], function Transfer_Images(done){
        bs.notify("Transferring Images", 1000);
        img(()=>{
            reload();
            done();
        });
    });

    gulp.watch('./src/**/*')
    .on('all', function (event, path, stats) {
        console.log(colors.yellow('File ' + path + ' ' + event));
    });

    done();
};

gulp.task('build', gulp.series(gulp.parallel(html, scss, js, jsv, img, font)))
gulp.task('default', gulp.series(json, gulp.parallel(html, scss, js, jsv, img, font), gulp.parallel(serve, watch)));