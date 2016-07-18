let Inquirer  = require( 'inquirer' ),
    Path      = require( 'path' ),
    Promise   = require( 'bluebird' ),
    Rimraf    = require( 'rimraf' ),
    FS        = Promise.promisifyAll( require( 'fs' ) ),
    Setup     = require( '../core/setup' ),
    ConfigCLI = require( './config' ),
    Key       = require( '../key' )

const USERNAME = Key.username,
      PASSWORD = Key.password,
      YES      = '是',
      NO       = '否'

let notNull = content => !!content || '内容不能为空！'

class SetupCLI {
    constructor( dir, url ) {
        let tmp

        if ( dir || url ) {
            if ( dir.indexOf( 'http' ) !== -1 ) {
                tmp = url
                url = dir
                dir = tmp
            }
        }

        this._dir = dir
        this._url = url

        this.init()
    }

    init() {
        Inquirer.prompt( [ {
            name   : 'dir',
            message: '设置目录',
            default: this._dir || 'master'
        } ] )
            .then( async answer => {
                let path    = Path.resolve( answer.dir ),
                    isExist = false

                try {
                    //https://github.com/petkaantonov/bluebird/blob/master/API.md#promisification
                    isExist = await FS.statAsync( path )
                } catch ( e ) {
                }

                this._path = path

                log( `目录地址:${path}`, 'debug' )

                if ( isExist ) {
                    this.cleanup()
                } else {
                    this._setup = new Setup()
                    await this._setup.init( path )
                    this.checkout()
                }
            } )
    }

    checkout() {
        Inquirer.prompt( [ {
            name    : USERNAME,
            message : 'SVN 用户名',
            default : Profile.get( USERNAME ) || '',
            validate: notNull
        }, {
            type    : PASSWORD,
            name    : PASSWORD,
            message : 'SVN 密码',
            validate: notNull
        } ] )
            .then( async answer => {
                let username = answer[ USERNAME ],
                    password = answer[ PASSWORD ]

                Profile.set( USERNAME, username )
                await this._setup.checkoutSource( username, password, this._url )
                new ConfigCLI( this._path )
            } )
    }

    cleanup() {
        Inquirer.prompt( [ {
            type   : 'list',
            name   : 'override',
            message: '文件夹已存在，是否覆盖',
            choices: [ YES, NO ],
            default: NO
        } ] )
            .then( answer => {
                let path = this._path

                if ( answer.override === YES ) {
                    Rimraf( path, async err => {
                        if ( !err ) {
                            this._setup = new Setup()
                            await this._setup.init( path )
                            this.checkout()
                        }
                    } )
                } else {
                    new ConfigCLI( path )
                }
            } )
    }
}

module.exports = SetupCLI
