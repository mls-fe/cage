let Promise = require( 'bluebird' ),
    Exec    = require( 'child_process' ).exec,
    FS      = Promise.promisifyAll( require( 'fs' ) ),
    Util    = require( '../util' )

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

class Setup {
    init( path ) {
        this._path = path
        return FS.mkdirAsync( path )
    }

    async checkoutSource( username, password, appSvnUrl ) {
        return await Promise.all( phases.map( async phaseObj => {
            let name, path

            if ( appSvnUrl && phaseObj.name == 'Apps' ) {
                phaseObj.url = appSvnUrl
            }

            name = phaseObj.name
            path = this._path + phaseObj.dir
            log( `\n初始化 ${name} 文件夹` )
            await FS.mkdirAsync( path )

            return new Promise( ( resolve, reject ) => {
                Util.indicator.start()

                Exec( `svn checkout ${phaseObj.url} ${path} --username ${username} --password ${password}`, err => {
                    Util.indicator.stop()
                    if ( !err ) {
                        log( `${name} 设置成功!`, 'success' )
                        resolve()
                    } else {
                        log( `${name} 设置失败!`, 'error' )
                        log( err, 'info' )
                        reject()
                    }
                } )
            } )
        } ) ).then( async() => {
            log( '创建 tmp 文件夹' )
            await FS.mkdirAsync( this._path + DIR_TMP )
            return this.installDependencies()
        } )
    }

    async installDependencies() {
        let deptPath = this._path + DIR_NEST

        log( '安装 less 与 uglify-js' )

        return new Promise( resolve => {
            Exec( `cd ${deptPath} && npm install ${DEPENDENCIES.join( ' ' )}`, ( err, stdout ) => {
                Util.indicator.stop()

                if ( err ) {
                    log( err, 'error' )
                    log( '\n依赖库安装失败!', 'error' )
                } else {
                    log( stdout, 'info' )
                    log( '\n依赖库安装成功!', 'success' )
                    resolve()
                }
            } )
        } )
    }

    error( msg ) {
        Util.indicator.stop()
        log( '下载源码失败，以下为 svn 打印的错误消息', 'error' )
        log( msg )
    }
}

module.exports = Setup
