var fs      = require( 'fs' ),
    gulp    = require( 'gulp' ),
    to5     = require( 'gulp-babel' ),

    paths   = {
        src: [ 'src/*.js', 'src/*/*.js' ],

        build: 'build/',

        dist: 'dist/'
    },

    options = {
        sourceMaps: 'inline',
        stage: 0,
        // 兼容 node.js
        // io.js 已经默认支持以下特性
        //blacklist: [ 'es6.classes', 'es6.constants', 'es6.templateLiterals', 'es6.spec.symbols' ],
        optional: [ 'bluebirdCoroutines' ]
    }

gulp.task( 'scripts', function() {
    gulp.src( paths.src )
        .pipe( to5( options ) )
        .pipe( gulp.dest( paths.build ) )
} )

gulp.task( 'watch', function() {
    gulp.watch( paths.src, [ 'scripts' ] )
} )

gulp.task( 'dist', function() {
    gulp.src( paths.src )
        .pipe( to5( options ) )
        .pipe( gulp.dest( paths.dist ) )
} )

gulp.task( 'default', [ 'scripts', 'watch' ] )
