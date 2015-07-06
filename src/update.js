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
    let update = notifier.update

    if ( update ) {
        let newVersion = Chalk.green.bold( update.latest ),
            curVersion = Chalk.gray( ' (current: ' + update.current + ')' ),
            command    = Chalk.magenta( 'sudo npm install -g ' + pkg.name )

        message.push( `Cage 可以更新了: ${newVersion}${curVersion}` )
        message.push( `运行 ${command} to update.` )
        console.log( Yosay( message.join( ' ' ), { maxLength: StringLength( message[ 0 ] ) } ) )
    }
}
