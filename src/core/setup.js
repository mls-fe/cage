let Promise = require( 'bluebird' ),
    FS      = Promise.promisifyAll( require( 'fs' ) ),
    SVN     = Promise.promisifyAll( require( 'svn-interface' ) ),
    NPM     = require( 'npm' ),
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

                let childProcess = SVN.co( phaseObj.url, path, {
                    username, password
                }, err => {
                    if ( !err ) {
                        Util.indicator.stop()
                        log( `${name} 设置成功!`, 'success' )
                        resolve()
                    }
                } )

                childProcess.stderr.on( 'data', data => {
                    if ( !this.hasError ) {
                        reject()
                        childProcess.kill()
                        this.hasError = true
                        this.error( data.toString() )
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
            NPM.load( {}, function ( err, npm ) {
                npm.commands.install( deptPath, DEPENDENCIES, () => {
                    log( '\n依赖库安装成功!', 'success' )
                    Util.indicator.stop()
                    resolve()
                } )
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
