let Inquirer  = require( 'inquirer' ),
    Path      = require( 'path' ),
    Promise   = require( 'bluebird' ),
    Rimraf    = require( 'rimraf' ),
    FS        = Promise.promisifyAll( require( 'fs' ) ),
    Setup     = require( '../core/setup' ),
    ConfigCLI = require( './config' ),
    Key       = require( '../key' )

const USERNAME = Key.username,
      PASSWORD = Key.password

let notNull = content => !!content || '内容不能为空！'

class SetupCLI {
    constructor() {
        this.init()
    }

    init() {
        Inquirer.prompt( [ {
            name: 'dir',
            message: '设置目录',
            default: 'master'
        } ], async answer => {
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
            name: USERNAME,
            message: 'SVN 用户名',
            default: Profile.get( USERNAME ) || '',
            validate: notNull
        }, {
            type: PASSWORD,
            name: PASSWORD,
            message: 'SVN 密码',
            validate: notNull
        } ], async answer => {
            let username = answer[ USERNAME ],
                password = answer[ PASSWORD ]

            Profile.set( USERNAME, username )
            await this._setup.checkoutSource( username, password )
            new ConfigCLI( this._path )
        } )
    }

    cleanup() {
        Inquirer.prompt( [ {
            type: 'confirm',
            name: 'override',
            message: '文件夹已存在，是否覆盖',
            default: false
        } ], answer => {
            let path = this._path

            if ( answer.override ) {
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