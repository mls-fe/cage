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
    Request            = require( './request' ),
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
    .description( '在 dir 文件夹下生成环境' )
    .action( ( dir = '', url = '' ) => new SetupCLI( dir, url ) )

Commander
    .command( 'config [dir]' )
    .description( '配置环境' )
    .alias( 'c' )
    .action( ( dir = process.cwd() ) => new ConfigCLI( dir ) )

Commander
    .command( 'run' )
    .description( '运行服务' )
    .alias( 'r' )
    .action( async() => {
        let result = await findValidWorkspace( process.cwd() )
        new WorkSpace( result.dir ).start()
    } )

Commander
    .command( 'stop [isAll]' )
    .description( '停止服务' )
    .alias( 's' )
    .action( async( isAll = false ) => {
        let result = await findValidWorkspace( process.cwd() )
        new WorkSpace( result.dir ).stop( isAll )
    } )

Commander
    .command( 'sa' )
    .description( '停止所有服务' )
    .action( async() => {
        let result = await findValidWorkspace( process.cwd() )
        new WorkSpace( result.dir ).stop( 'all' )
    } )

Commander
    .command( 'log [type]' )
    .description( '显示日志' )
    .alias( 'l' )
    .action( ( type = 's' ) => {
        if ( type in logValues ) {
            Exec( `tail -f /tmp/log/nest-${type}erver/${Util.getFormatDate()}.log` )
                .on( 'message', message => log( message ) )
                .on( 'error', err => log( err, 'error' ) )
        } else {
            log( 'log 只接受 s/js 两个参数', 'error' )
        }
    } )

Commander
    .command( 'lo' )
    .description( '打开日志所在位置' )
    .action( () => {
        Exec( 'open -a finder "/tmp/log/nest-server/"' )
            .on( 'error', err => log( err, 'error' ) )
    } )

Commander
    .command( 'ls' )
    .description( '显示工作空间列表' )
    .action( () => WorkSpaceCLI.list() )

Commander
    .command( 'ip' )
    .description( '显示本机 IP 地址' )
    .action( () => {
        log( Util.getIP() )
    } )

Commander
    .command( 'mac' )
    .description( '显示本机 Mac 地址' )
    .action( async() => {
        var mac = await Util.getMac()
        log( mac )
    } )

Commander
    .command( 'update' )
    .description( '更新环境配置' )
    .alias( 'u' )
    .action( async() => {
        var config     = new Config( WorkSpace.current() ),
            isIPChange = config.isIPChange()

        if ( isIPChange ) {
            await config.updateIP()
            log( 'ip 更新成功', 'success' )
        } else {
            log( 'ip 无变化, 不需要更新.' )
        }
    } )

Commander
    .command( 'hostlist' )
    .description( '显示你配置过的域名列表' )
    .action( async() => {
        var mac     = await Util.getMac(),
            result  = await Request( 'hostlist?ukey=' + mac ),
            display = ''

        if ( result ) {
            result.data.forEach( data => {
                display += `
${data.host}
    id: ${data.id}
    ip: ${data.ip}
    port: ${data.port}
    ukey: ${data.ukey}
                `
            } )
            log( display )
        }
    } )

Commander.parse( process.argv )
