let Promise      = require( 'bluebird' ),
    ObjectAssign = require( 'object-assign' ),
    GetMac       = Promise.promisifyAll( require( 'getmac' ) ),
    Got          = Promise.promisifyAll( require( 'got' ) ),
    FS           = Promise.promisifyAll( require( 'fs' ) ),
    Key          = require( './key' ),
    Const        = require( './const' ),
    count        = 0,
    stdout       = process.stdout,
    Cache        = {},
    Util, Indicator, timeoutID

const URL_SERVER    = Const.URL_SERVER,
      ACTION_UPDATE = 'update?ukey=',
      ACTION_DOMAIN = 'host',
      MAC           = Key.mac,
      IP            = Key.ip,
      APPS          = Const.APPS,
      NEST          = Const.NEST,
      TIMEOUT       = 5000

Indicator = {
    start( text = 'waiting' ) {
        count     = 0
        timeoutID = setInterval( function() {
            count    = ( count + 1 ) % 5
            let dots = new Array( count ).join( '.' )

            stdout.clearLine()
            stdout.cursorTo( 0 )
            stdout.write( text + dots )
        }, 300 )
    },

    stop() {
        clearTimeout( timeoutID )
        stdout.clearLine()
        stdout.cursorTo( 0 )
    }
}

module.exports = Util = {
    indicator: Indicator,

    updateJSONFile( path, content ) {
        content = JSON.stringify( ObjectAssign( {}, require( path ), content ) )
        return FS.writeFileAsync( path, content )
    },

    checkFileExist( path ) {
        return new Promise( resolve => {
            FS.exists( path, isExist => {
                resolve( isExist )
            } )
        } )
    },

    getPort() {
        let basePath = Profile.get( Key.current_path ),
            etcPath  = basePath + Const.FILE_ETC

        return require( etcPath ).onPort
    },

    async getIP() {
        let result = await Got.getAsync( URL_SERVER + IP, {
            timeout: TIMEOUT
        } )

        return result[ 0 ]
    },

    async getMac() {
        let mac = Cache[ MAC ] || await GetMac.getMacAsync()

        if ( !mac ) {
            log( '获取 MAC 地址失败', 'error' )
        }

        return Cache[ MAC ] = mac
    },

    async updateMac( mac ) {
        let res = await Got.getAsync( URL_SERVER + ACTION_UPDATE + mac, {
            json: true,
            timeout: TIMEOUT
        } )

        if ( res && res[ 0 ].updated ) {
            return true
        }

        Indicator.stop()
        log( '更新 IP 地址失败', 'error' )
    },

    async updateProxy( port, params ) {
        let mac = await this.getMac(),
            url = `${URL_SERVER}host?port=${port}&ukey=${mac}&${params}`

        return Got
            .getAsync( url, {
                timeout: TIMEOUT
            } )
    }
}
