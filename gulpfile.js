'use strict';

// GULP================================================
//
const gulp       = require('gulp'),

  // gulp plugins

  changed        = require('gulp-changed'),
  nunjucksRender = require('gulp-nunjucks-render'),
  concat         = require('gulp-concat'),
  uglify         = require('gulp-uglify'),

  // other plugins
  browsersync    = require('browser-sync'),
  del            = require('del')
;

// PATH CONFIG ========================================
//
let PATH;

PATH = {
  src  : 'src/',
  dest : 'dist/'
};

PATH.css = {
    in  : PATH.src + 'css/*.css',
    out : PATH.dest   + 'css/'
};

PATH.js = {
    in  : PATH.src + 'js/*.js',
    out : PATH.dest   + 'js/'
};

PATH.concat = {
    in  : PATH.src + 'js/modules/*.js',
    out : PATH.dest + 'js/'
}


PATH.html = {
  in  : PATH.src  + '*.html',
  out : PATH.dest + './'
};

PATH.njk = {
  njk : PATH.src + '_templates/**/*.njk',
  in : PATH.src + '_pages/**/*.njk',
  out : PATH.src
};

// OPTIONS ============================================
//
// SERVER
const SYNC_CONFIG = {
  port   : 3333,
  browser: "chrome",
  server : {
    baseDir : PATH.dest,

    //index : 'promotion-rules.html'
    index : 'index.html'
  },
  open   : true,
  notify : false
};

// NUNJUCKS options
var NUNJUCKS_DEFAULTS = {
    path: 'src/_templates/'
    // envOptions: {
    //     watch: false
    // }
};


gulp.task('css', function() {

    return gulp.src(PATH.css.in)
        .pipe(changed(PATH.css.out))
        .pipe(gulp.dest(PATH.css.out))
    ;
});

gulp.task('styles', ['css']);


// JS ================================================
//

gulp.task('concat', function() {
    return gulp.src(PATH.concat.in)
        .pipe(concat('all.js'))
        .pipe(changed(PATH.concat.out))
        .pipe(gulp.dest(PATH.concat.out))
        ;
})

gulp.task('js', function() {

    return gulp.src(PATH.js.in)

        .pipe(changed(PATH.js.out))
        .pipe(uglify())
        .pipe(gulp.dest(PATH.js.out))
        ;
});


// TEMPLATING ==========================================
//

gulp.task('nunjucks', function() {
    // console.log('******************************');
    // console.log('*** Starting NUNJUCKS task ***');
    // console.log('******************************');

    // var stream = gulp.src(PATH.tpl.in)
    return gulp.src(PATH.njk.in)
        .pipe(changed(PATH.njk.out))
        .pipe(nunjucksRender(NUNJUCKS_DEFAULTS))
        .pipe(gulp.dest(PATH.njk.out))
        ;
    // return stream;
});

// handle html
gulp.task('html', ['nunjucks'], function() {
    // console.log('**************************');
    // console.log('*** Starting HTML task ***');
    // console.log('**************************');

    return gulp.src(PATH.html.in)
        .pipe(changed(PATH.html.out))
        .pipe(gulp.dest(PATH.html.out))
        ;
});

// OTHER ===============================================
//
// BUILD
gulp.task('build',

    [   'styles',
        'js',
        'concat',
        'html'
    ],

    function() {
        console.log('***************************');
        console.log('*** Starting BUILD task ***');
        console.log('***************************');
    }
);

// CLEAN
gulp.task('clean', function() {
  del(
    [
      PATH.dest + '*'
    ]
  );
});

// Browser-sync task
gulp.task('browsersync', function() {
    browsersync(SYNC_CONFIG);
});


// default task
gulp.task('default', ['browsersync', 'build'], function() {

    // css changes
    gulp.watch(PATH.css.in,    ['css']);

    // js changes


    gulp.watch(PATH.js.in,     ['js', browsersync.reload]);


    gulp.watch(PATH.concat.in,     ['concat', browsersync.reload]);



    gulp.watch(
        [
            PATH.njk.njk,
            PATH.njk.in
        ],                     ['html', browsersync.reload]);

});
