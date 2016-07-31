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
    Key                = require( './key' ),
    pkg                = require( '../package.json' ),
    logValues          = { 's': 1, 'js': 1 },

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
    },

    update             = async() => {
        let config     = new Config( WorkSpace.current() ),
            isIPChange = await config.isIPChange()

        if ( !config.isNew ) {
            config.setPortOption( Key.random )
            await config.updateProxy()
            log( '端口更新成功', 'success' )
        }

        if ( isIPChange ) {
            let result = await config.updateIP()
            result && log( 'ip 更新成功', 'success' )
        } else {
            log( 'ip 无变化, 不需要更新' )
        }

        let result = await findValidWorkspace( process.cwd() )
        new WorkSpace( result.dir ).start()
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
    .action( async( type = 's' ) => {
        if ( type in logValues ) {
            let displayLog = () => {
                let client = Exec( `tail -f ${filepath}` )
                    .on( 'error', err => log( err, 'error' ) )

                client.stdout.pipe( process.stdout )
            }

            let isNew    = await WorkSpace.isNew( WorkSpace.current() ),
                filepath = `/tmp/log/${ isNew ? 'hornbill' : 'nest' }-${type}erver/${Util.getFormatDate()}.log`,
                isExist  = await Util.checkFileExist( filepath )

            if ( isExist ) {
                displayLog()
            } else {
                log( '日志文件不存在, 正在重启 whornbill 服务...', 'warn' )
                let result = await findValidWorkspace( process.cwd() )
                new WorkSpace( result.dir )
                    .start( false )
                    .then( displayLog )
            }
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
    .action( () => {
        WorkSpaceCLI.list( () => {
            update()
        } )
    } )

Commander
    .command( 'ip' )
    .description( '显示本机 IP 地址' )
    .action( async() => {
        var ip = await Util.getIP()
        log( ip )
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
    .action( update )

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
