let Inquirer      = require( 'inquirer' ),
    Path          = require( 'path' ),
    Config        = require( '../core/config' ),
    WorkSpace     = require( '../core/workspace' ),
    Slogan        = require( '../slogan' ),
    Util          = require( '../util' ),
    Key           = require( '../key' ),
    Indicator     = Util.indicator,

    defaultPhases = [
        'configPort',
        'configDomain',
        'configProxy',
        'configAddress',
        'finish'
    ]

const RANDOM = Key.random,
      NORMAL = Key.normal,
      YES    = '是',
      NO     = '否',
      N      = 'n',
      HINT   = `
域名格式(例子):
  xxx pc
xxs 是你自定义的名字, 不要和其他人重复了
pc 是业务名称, 目前可配置 pc、wap、www 等
设置完毕后, 可以使用访问 http://xxx.fedevot.meilishuo.com
`

class ConfigCLI {
    constructor( path ) {
        this.init( Path.resolve( path ) )
        this._domains = []
    }

    async init( path ) {
        let phases = defaultPhases.concat(),
            next   = () => {
                let phase = phases.shift()
                if ( phase ) {
                    this[ phase ]( next )
                }
            }

        let isValid = await WorkSpace.isValidWorkSpace( path )
        if ( !isValid ) {
            log( `${path} 不是合法的工作空间！请重新指定`, 'warn' )
            return
        }
        this.config = new Config( path )

        next()
    }

    configPort( next ) {
        Inquirer
            .prompt( [ {
                type   : 'list',
                name   : 'portOption',
                message: '选择端口号',
                choices: [ NORMAL, RANDOM ],
                default: RANDOM
            } ] )
            .then( answer => {
                this.config.setPortOption( answer.portOption )
                next()
            } )
    }

    configDomain( next ) {
        let c            = this.config,
            savedDomains = c.getSavedDomains(),
            domainsSize  = savedDomains.length

        if ( domainsSize ) {
            Inquirer
                .prompt( [ {
                    type   : 'list',
                    name   : 'override',
                    message: '是否重新设置域名?',
                    choices: [ YES, NO ],
                    default: NO
                } ] )
                .then( answer => {
                    if ( answer.override == YES ) {
                        c.clearDomains()
                        return this.configDomain( next )
                    }

                    next()
                } )
        } else {
            console.log( HINT )
            this.collectDomain( next )
        }
    }

    collectDomain( next ) {
        Inquirer
            .prompt( [ {
                name   : 'domain',
                message: '设置域名(输入 n 可跳过此步骤):',
                validate( domain ) {
                    domain = domain.trim()
                    return domain.split( ' ' ).length == 2 || domain == N
                }
            } ] )
            .then( answer => {
                let c         = this.config,
                    domain    = answer.domain.trim(),
                    domainArr = domain.split( ' ' )

                if ( domain == N ) {
                    if ( this._domains.length ) {
                        c.addDomain( this._domains )
                        next()
                    } else {
                        log( '至少需要配置一个域名', 'warn' )
                        this.collectDomain( next )
                    }
                } else {
                    this._domains.push( domainArr )
                    return this.collectDomain( next )
                }
            } )
    }

    async configAddress( next ) {
        log( '设置 IP' )
        let c        = this.config,
            isChange = await c.isIPChange()

        if ( isChange ) {
            log( 'IP 需要更新...' )
            Indicator.start( '更新 IP 地址' )

            let isOK  = await c.updateIP(),
                state = isOK ? 'success' : 'error',
                text  = isOK ? '成功' : '失败'

            log( `\n更新 IP 地址${text}`, state )
            Indicator.stop()

            if ( !isOK ) {
                await c.generatePort()
                log( `你当前所在的网络无法连接到服务器，已经切换到本地模式。请使用 127.0.0.1 加上对应端口号来访问。`, 'error' )
                return
            }
        } else {
            log( 'IP 地址无变化，不需要更新' )
        }

        next()
    }

    async configProxy( next ) {
        Indicator.start( '更新代理服务器' )

        try {
            await this.config.updateProxy()
        } catch ( e ) {
            log( '\r服务器挂了!', 'error' )
        } finally {
            Indicator.stop()
        }

        log( '更新代理服务器成功', 'success' )
        next()
    }

    async finish() {
        let workspace = new WorkSpace( this.config.getPath() )

        workspace.active()
        await workspace.start()

        Slogan.yell()
        log( '====================' )
        log( 'whornbill 环境配置完毕' )
        log( 'Cage 的详细使用请查看文档：\nhttps://github.com/mls-fe/cage' )
    }
}

module.exports = ConfigCLI
