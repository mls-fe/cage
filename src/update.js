let UpdateNotifier      = require( 'update-notifier' ),
    Chalk               = require( 'chalk' ),
    Yosay               = require( 'yosay' ),
    StringLength        = require( 'string-length' ),
    pkg                 = require( '../package.json' ),
    updateCheckInterval = 1000 * 60 * 60 * 24 * 7,
    notifier            = UpdateNotifier( {
        pkg, updateCheckInterval
    } )

// from https://github.com/yeoman/yo/blob/master/lib/cli.js#L35
exports.check = () => {
    let update  = notifier.update,
        message = []

    if ( update ) {
        let newVersion = Chalk.green.bold( update.latest ),
            curVersion = Chalk.gray( ' (current: ' + update.current + ')' ),
            command    = Chalk.magenta( 'sudo npm update -g ' + pkg.name )

        message.push( `Cage 可以更新了: ${newVersion}${curVersion}` )
        message.push( `运行 ${command} 更新。` )
        console.log( Yosay( message.join( ' ' ), { maxLength: StringLength( message[ 0 ] ) } ) )
    }
}
