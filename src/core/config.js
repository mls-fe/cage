let Key     = require( '../key' ),
    Util    = require( '../util' ),
    Const   = require( '../const' ),
    Profile = global.Profile

const DOMAINS = Key.domains,
      RANDOM  = Key.random,
      IP      = Key.ip

class Config {
    constructor( path ) {
        this.param = { path }
    }

    getPath() {
        return this.param.path
    }

    getPortOption() {
        return this.param.portOption
    }

    setPort( port ) {
        this.param.port = port
    }

    getPort() {
        return this.param.port
    }

    setPortOption( port ) {
        this.param.portOption = port
    }

    async generatePort() {
        let ip   = Profile.get( IP ),
            path = this.getPath(),
            port, url

        if ( this.getPortOption() == RANDOM ) {
            port = Math.random() * 1000 | 0 + 6000
            this.setPort( port )

            url = `http://${ip}:${port + 1}/`

            await Util.updateRuntimeConfig( path, ( data ) => {
                data.site.JCSTATIC_BASE   = url + 'pc/'
                data.site.M_JCSTATIC_BASE = url + 'wap/'
                data.etc.onPort           = port
                data.service.onPort       = port + 1
                return data
            } )
        }
    }

    addDomain( domains ) {
        let param      = this.param,
            domainsObj = param.domainsObj,
            ds         = param.domains

        domains.forEach( ( domain ) => {
            let [ key, value ] = domain

            domainsObj[ key ] = value

            ds.push( {
                key, value
            } )
        } )

        Profile.set( DOMAINS, domainsObj )
    }

    getSavedDomains() {
        let param          = this.param,
            defaultDomains = param.domainsObj,
            domainsArr     = param.domains

        if ( domainsArr ) {
            return domainsArr
        } else {
            defaultDomains = Profile.get( DOMAINS ) || {}
            domainsArr     = []
        }

        for ( let key in defaultDomains ) {
            domainsArr.push( {
                key,
                value: defaultDomains[ key ]
            } )
        }

        param.domainsObj = defaultDomains
        return param.domains = domainsArr
    }

    getDomainsSize() {
        return this.param.domains.length
    }

    clearDomains() {
        let param = this.param

        Profile.del( DOMAINS )
        param.domainsObj = {}
        param.domains    = []
    }

    async isIPChange() {
        let ip = this.param.ip = await Util.getIP()
        log( ip, 'debug' )
        return Profile.get( IP ) != ip
    }

    async updateIP() {
        let mac = await Util.getMac(),
            res = await Util.updateMac( mac )

        if ( res ) {
            Profile.set( IP, this.param.ip )
            return true
        }
    }

    async updateProxy() {
        let domains   = this.getSavedDomains(),
            hosts     = {},
            hostParam = [],
            port

        domains.forEach( domain => {
            hostParam.push( 'host=' + domain.key )
            hosts[ domain.key + Const.SITE_SUFFIX ] = domain.value
        } )

        await this.generatePort()

        port = this.getPort() || Util.getPort( this.getPath() )

        await Util.updateRuntimeConfig( this.getPath(), ( data ) => {
            data.virtualHost = hosts
            return data
        } )

        await Util.updateProxy( port, hostParam.join( '&' ) )
    }
}

module.exports = Config
