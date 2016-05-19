let ChildProcess = require( 'child_process' ),
    Spawn        = ChildProcess.spawn,
    Exec         = ChildProcess.exec,
    FS           = require( 'fs' ),
    Util         = require( '../util' )

const DIR_APPS     = '/apps',
      DIR_NEST     = '/nest',
      DIR_TMP      = `${DIR_NEST}/tmp`,
      DEPENDENCIES = [ 'less@1.3.3', 'uglify-js@1.2.6' ]

let phases = [ {
    name : 'Nest',
    url  : 'http://svn.meilishuo.com/repos/meilishuo/fex/hornbill_nest/trunk/',
    dir  : DIR_NEST
}, {
    name : 'Apps',
    url  : 'http://svn.meilishuo.com/repos/meilishuo/fex/user/trunk/',
    dir  : DIR_APPS
} ]

function mkdir( path ) {
    return new Promise( ( resolve, reject ) => {
        FS.mkdir( path, err => {
            err ? reject() : resolve()
        } )
    } )
}

class Setup {
    init( path ) {
        this._path = path
        return mkdir( path )
    }

    async checkoutSource( username, password, appSvnUrl ) {
        return await Promise.all( phases.map( async( phaseObj ) => {
            let name, path

            if ( appSvnUrl && phaseObj.name == 'Apps' ) {
                phaseObj.url = appSvnUrl
            }

            name = phaseObj.name
            path = this._path + phaseObj.dir
            log( `\n初始化 ${name} 文件夹` )
            await mkdir( path )

            return new Promise( ( resolve, reject ) => {
                Util.indicator.start()
                let args = [ 'checkout', phaseObj.url, path, '--username', username, '--password', password ],
                    client

                client = Spawn( 'svn', args, {} )

                client.on( 'err', err => {
                    Util.indicator.stop()
                    log( `${name} 设置失败!`, 'error' )
                    log( err, 'info' )
                    reject()
                } )

                client.on( 'exit', () => {
                    Util.indicator.stop()
                    log( `${name} 设置成功!`, 'success' )
                    resolve()
                } )
            } )
        } ) ).then( async() => {
            log( '创建 tmp 文件夹' )
            await mkdir( this._path + DIR_TMP )
            return this.installDependencies()
        } )
    }

    async installDependencies() {
        let deptPath = this._path + DIR_NEST

        log( '安装 less 与 uglify-js' )
        Util.indicator.start()

        return new Promise( resolve => {
            let command = `cd ${deptPath} && npm install ${DEPENDENCIES.join( ' ' )} 	--registry=https://registry.npm.taobao.org`
            log( command, 'debug' )
            Exec( command, ( err, stdout ) => {
                Util.indicator.stop()

                if ( err ) {
                    log( err, 'error' )
                    log( '\n依赖库安装失败!', 'error' )
                } else {
                    log( stdout, 'info' )
                    log( '\n依赖库安装成功!', 'success' )
                    resolve()
                }
            } ).stdout.pipe( process.stdout )
        } )
    }

    error( msg ) {
        Util.indicator.stop()
        log( '下载源码失败，以下为 svn 打印的错误消息', 'error' )
        log( msg )
    }
}

module.exports = Setup
