let Chalk  = require( 'chalk' ),
    colors = {
        info: Chalk.white,
        debug: Chalk.gray,
        error: Chalk.red.bold,
        warn: Chalk.yellow.bold,
        success: Chalk.green
    }

global.log = ( content, type = 'info' ) => {
    console.log( colors[ type ]( content ) )
}
