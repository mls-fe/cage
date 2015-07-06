let Promise = require( 'bluebird' ),
    FS      = Promise.promisifyAll( require( 'fs' ) ),
    SVN     = Promise.promisifyAll( require( 'svn-interface' ) ),
    NPM     = require( 'npm' ),
    Util    = require( '../util' )

const DIR_APPS        = '/apps',
      DIR_NEST        = '/nest',
      DIR_TMP         = '/tmp',
      DIR_NODEMODULES = DIR_NEST + '/node_modules',
      DEPENDENCIES    = [ 'less@1.3.3', 'uglify-js@1.2.6' ]

let phases = [ {
    name: 'Nest',
    url: 'http://svn.meilishuo.com/repos/meilishuo/fex/hornbill_nest/trunk/',
    dir: DIR_NEST
}, {
    name: 'Apps',
    url: 'http://svn.meilishuo.com/repos/meilishuo/fex/user/trunk/',
    dir: DIR_APPS
} ]

class Setup {
    init( path ) {
        this._path = path
        return FS.mkdirAsync( path )
    }

    async checkoutSource( username, password ) {
        let phaseObj = phases.shift(),
            name, path

        if ( phaseObj ) {
            name = phaseObj.name
            path = this._path + phaseObj.dir
            log( `\n初始化 ${name} 文件夹` )
            Util.indicator.start()

            await FS.mkdirAsync( path )
            await SVN.coAsync( phaseObj.url, path, {
                username, password
            } )

            Util.indicator.stop()
            log( `${name} 设置成功!`, 'success' )
            return this.checkoutSource( username, password )
        } else {
            return this.installDependencies()
        }
    }

    async installDependencies() {
        let deptPath = this._path + DIR_NODEMODULES
        await FS.mkdirAsync( deptPath )

        return new Promise( resolve => {
            NPM.load( {}, function( err, npm ) {
                npm.commands.install( deptPath, DEPENDENCIES, () => {
                    log( '\n依赖库安装成功!', 'success' )
                    resolve()
                } )
            } )
        } )
    }
}

module.exports = Setup
