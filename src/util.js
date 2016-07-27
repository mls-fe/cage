let FS        = require( 'fs' ),
    Exec      = require( 'child_process' ).exec,
    Request   = require( './request' ),
    Key       = require( './key' ),
    Const     = require( './const' ),
    count     = 0,
    stdout    = process.stdout,
    Cache     = {},
    timeoutID = 0,
    Util, Indicator, ObjectAssign

const ACTION_UPDATE = 'update?ukey=',
      MAC           = Key.mac,
      IP            = Key.ip

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
    indicator: Indicator,

    updateJSONFile( path, content ) {
        return this.checkFileExist( path ).then( isExist => {
            if ( !isExist ) {
                log( `${path} 文件不存在`, 'error' )
                return Promise.reject( `${path} 文件不存在` )
            } else {
                try {
                    content = JSON.stringify( ObjectAssign( {}, require( path ), content ), null, '  ' )
                } catch ( e ) {
                    log( `读取 ${path} 文件错误, 原因为:` )
                    log( e, 'error' )
                }

                return new Promise( ( resolve, reject ) => {
                    FS.writeFile( path, content, err => {
                        err ? reject() : resolve()
                    } )
                } )
            }
        } ).catch( e => log( e, 'error' ) )
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
        var result = await Request( 'ip' )
        return result && result.data
    },

    async getMac() {
        var getMacAddress = () => {
            return new Promise( ( resolve, reject ) => {
                Exec( `ifconfig en0| grep ether| awk '{print $NF}'`, ( err, stdout ) => {
                    ( err || !stdout ) ? reject() : resolve( stdout.trim() )
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
        let res = await Request( ACTION_UPDATE + mac )

        Indicator.stop()
        if ( res && res.code == '0' ) {
            return true
        }
        log( '更新 IP 地址失败', 'error' )
    },

    async updateProxy( port, params ) {
        let mac = await this.getMac()
        return Request( `host?port=${port}&ukey=${mac}&${params}` )
    },

    getFormatDate() {
        var now   = new Date,
            year  = now.getFullYear(),
            month = String( now.getMonth() + 1 ),
            date  = String( now.getDate() )

        month = month.length > 1 ? month : ( '0' + month )
        date  = date.length > 1 ? date : ( '0' + date )

        return `${year}/${month}/${date}`
    },

    /**
     * 更新运行时配置
     * 如果配置文件不存在, 默认读取 dev.conf.js
     */
    async updateRuntimeConfig( path, fn ) {
        let isExist = await this.checkFileExist( path + Const.RUNTIME_CONFIG )

        let data

        if ( !isExist ) {
            data           = require( path + Const.DEV_CONFIG )
            let isDirExist = await this.checkFileExist( path + Const.CONFIG_DIR )

            if ( !isDirExist ) {
                FS.mkdirSync( path + Const.CONFIG_DIR )
            }
            FS.writeFileSync( path + Const.RUNTIME_CONFIG, JSON.stringify( data ) )
        } else {
            data = require( path + Const.RUNTIME_CONFIG )
        }

        data = fn( data )

        this.updateJSONFile( path + Const.RUNTIME_CONFIG, data )
    }
}
