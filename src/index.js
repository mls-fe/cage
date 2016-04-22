require( 'babel-polyfill' )
require( './log' )
require( './profile' )

let Commander          = require( 'commander' ),
    Exec               = require( 'child_process' ).exec,
    ConfigCLI          = require( './cli/config' ),
    Config             = require( './core/config' ),
    SetupCLI           = require( './cli/setup' ),
    WorkSpaceCLI       = require( './cli/workspace' ),
    WorkSpace          = require( './core/workspace' ),
    Util               = require( './util' ),
    pkg                = require( '../package.json' ),
    logValues          = { 's' : 1, 'js' : 1 },

    findValidWorkspace = async( dir ) => {
        let isValid = await WorkSpace.isValidWorkSpace( dir )

        if ( !isValid ) {
            dir     = WorkSpace.current()
            isValid = await WorkSpace.isValidWorkSpace( dir )
        }

        if ( isValid ) {
            return { isValid, dir }
        } else {
            log( '无法找到可运行的工作空间', 'error' )
            throw new Error
        }
    }

Commander
    .version( pkg.version, '-v, --version' )

Commander
    .command( 'setup [dir] [url]' )
    .action( ( dir, url ) => new SetupCLI( dir || '', url || '' ) )

Commander
    .command( 'config [dir]' )
    .alias( 'c' )
    .action( ( dir = process.cwd() ) => new ConfigCLI( dir ) )

Commander
    .command( 'run' )
    .alias( 'r' )
    .action( async() => {
        let result = await findValidWorkspace( process.cwd() )
        new WorkSpace( result.dir ).start()
    } )

Commander
    .command( 'stop [isAll]' )
    .alias( 's' )
    .action( async( isAll = false ) => {
        let result = await findValidWorkspace( process.cwd() )
        new WorkSpace( result.dir ).stop( isAll )
    } )

Commander
    .command( 'sa' )
    .action( async() => {
        let result = await findValidWorkspace( process.cwd() )
        new WorkSpace( result.dir ).stop( 'all' )
    } )

Commander
    .command( 'log [type]' )
    .alias( 'l' )
    .action( ( type = 's' ) => {
        if ( type in logValues ) {
            Exec( `tail -f /tmp/log/nest-${type}erver/${ Util.getFormatDate()}.log` )
        } else {
            log( 'log 只接受 s/js 两个参数', 'error' )
        }
    } )

Commander
    .command( 'lo' )
    .action( () => {
        let date = Moment().format( 'YYYY/MM/' )

        Exec( `open -a finder "/tmp/log/nest-server/${date}"` )
    } )

Commander
    .command( 'ls' )
    .action( () => WorkSpaceCLI.list() )

Commander
    .command( 'ip' )
    .action( async() => {
        var config     = new Config( WorkSpace.current() ),
            isIPChange = await config.isIPChange()

        if ( isIPChange ) {
            await config.updateIP()
            log( 'ip 更新成功', 'success' )
        } else {
            log( 'ip 无变化, 不需要更新.' )
        }
    } )

Commander.parse( process.argv )
