let Promise   = require( 'bluebird' ),
    FS_ORIGIN = require( 'fs' ),
    Exec      = require( 'child_process' ).exec,
    Got       = Promise.promisifyAll( require( 'got' ) ),
    FS        = Promise.promisifyAll( FS_ORIGIN ),
    Key       = require( './key' ),
    Const     = require( './const' ),
    count     = 0,
    stdout    = process.stdout,
    Cache     = {},
    timeoutID = 0,
    Util, Indicator, ObjectAssign

const URL_SERVER    = Const.URL_SERVER,
      ACTION_UPDATE = 'update?ukey=',
      MAC           = Key.mac,
      IP            = Key.ip,
      TIMEOUT       = 5000

ObjectAssign = Object.assign || function ( target, ...mixins ) {
        target = target || {}

        mixins.forEach( obj => {
            for ( var key in obj ) {
                target[ key ] = obj[ key ]
            }
        } )

        return target
    }

Indicator = {
    start( text = 'waiting' ) {
        count = 0
        clearTimeout( timeoutID )
        timeoutID = setInterval( function () {
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
    indicator : Indicator,

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

    getPort( basePath ) {
        return require( basePath + Const.FILE_ETC ).onPort
    },

    async getIP() {
        return new Promise( ( resolve, reject ) => {
            Exec( `ifconfig en0| grep inet| awk '{print $NF}'`, ( err, stdout ) => {
                ( err || !stdout ) ? reject() : resolve( stdout )
            } )
        } ).then( str => {
            var ips = str.trim().split( /\s/m ),
                rip = /(?:\d{1,3}\.){3}\d{1,3}/

            return ips.filter( ip => {
                return rip.test( ip )
            } )
        } )
    },

    async getMac() {
        var getMacAddress = () => {
            return new Promise( ( resolve, reject ) => {
                Exec( `ifconfig en0| grep ether| awk '{print $NF}'`, ( err, stdout ) => {
                    ( err || !stdout ) ? reject() : resolve( stdout )
                } )
            } )
        }

        let mac = Cache[ MAC ] || await getMacAddress()

        if ( !mac ) {
            log( '获取 MAC 地址失败', 'error' )
        }

        return Cache[ MAC ] = mac
    },

    async updateMac( mac ) {
        log( URL_SERVER + ACTION_UPDATE + mac, 'debug' )
        let res = await Got.getAsync( URL_SERVER + ACTION_UPDATE + mac, {
            json    : true,
            timeout : TIMEOUT
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

        log( url, 'debug' )

        return Got
            .getAsync( url, {
                timeout : TIMEOUT
            } )
    },

    getFormatDate() {
        var now   = new Date,
            year  = now.getFullYear(),
            month = String( now.getMonth() ),
            date  = String( now.getDate() )

        month = month.length > 1 ? month : ( '0' + month )
        date  = date.length > 1 ? date : ( '0' + date )

        return `${year}/${month}/${date}`
    }
}
