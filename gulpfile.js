var gulp    = require( 'gulp' ),
    babel   = require( 'gulp-babel' ),

    paths   = {
        src   : [ 'src/*.js', 'src/*/*.js' ],
        build : 'build/',
        dist  : 'dist/'
    },

    options = {
        sourceMaps : 'inline',
        presets    : [ 'stage-0', 'es2015' ],
        plugins    : [
            [ 'transform-async-to-module-method', {
                "module" : 'bluebird',
                "method" : 'coroutine'
            } ]
        ]
    }

gulp.task( 'scripts', function () {
    gulp.src( paths.src )
        .pipe( babel( options ) )
        .pipe( gulp.dest( paths.build ) )
} )

gulp.task( 'watch', function () {
    gulp.watch( paths.src, [ 'scripts' ] )
} )

gulp.task( 'dist', function () {
    gulp.src( paths.src )
        .pipe( babel( options ) )
        .pipe( gulp.dest( paths.dist ) )
} )

gulp.task( 'default', [ 'scripts', 'watch' ] )
