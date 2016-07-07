let Exec    = require( 'child_process' ).exec,
    Key     = require( '../key' ),
    Const   = require( '../const' ),
    Util    = require( '../util' ),
    Profile = global.Profile

const APPS     = Const.APPS,
      NEST     = Const.NEST,
      HORNBILL = Const.HORNBILL

class WorkSpace {
    constructor( path ) {
        this.basePath = path
    }

    // path 是否为有效的工作空间
    static isValidWorkSpace( path ) {
        return Promise.all( [
            Util.checkFileExist( path + APPS ),
            Util.checkFileExist( path + NEST )
        ] ).then( results => {
            if ( results && !results[ 0 ] ) {
                return Promise
                    .resolve( Util.checkFileExist( path + HORNBILL ) )
            }
            return Promise.resolve( results.reduce( ( prev, cur ) => prev && cur ) )
        } )
    }

    // 获取当前工作空间
    static current() {
        return Profile.get( Key.current_path )
    }

    // 获取全部工作空间
    static list() {
        return Profile.get( Key.workspace_list ) || []
    }

    // 设置 path 为当前工作空间
    static setCurrentWorkSpace( path ) {
        let list         = Profile.get( Key.workspace_list ) || [],
            existPath,
            alreadyExist = list.some( ( item, i ) => {
                if ( item == path ) {
                    existPath = {
                        val  : item,
                        index: i
                    }
                    return true
                }
            } )

        if ( alreadyExist ) {
            list.splice( existPath.index, 1 )
        }

        list.unshift( path )
        Profile.set( Key.workspace_list, list )
        Profile.set( Key.current_path, path )
    }

    static isNew( path ) {
        return Util.checkFileExist( path + HORNBILL )
    }

    async getCommandPath( path ) {
        let isNew = await WorkSpace.isNew( path )

        isNew && Const.changeToNewPath( path + HORNBILL )

        return `${ path }${ isNew ? HORNBILL : NEST }/cmd/`
    }

    active() {
        WorkSpace.setCurrentWorkSpace( this.basePath )
    }

    start( autoExit = true ) {
        return new Promise( async( resolve ) => {
            let path, command

            path = await this.getCommandPath( this.basePath )

            command = `cd ${path} && ./service2.sh restart`

            log( command, 'debug' )
            Exec( command, err => err && log( err, 'error' ) )
                .on( 'message', message => log( message, 'debug' ) )
                .on( 'exit', () => {
                    log( '服务器正在运行' )
                    resolve( true )
                    process.nextTick( () => {
                        autoExit && process.exit()
                    } )
                } )
                .on( 'error', () => {
                    resolve( false )
                } )
        } )
    }

    stop( all ) {
        return new Promise( async( resolve ) => {
            let path, isAll, command

            isAll   = all == 'all' ? 'All' : ''
            path    = await this.getCommandPath( this.basePath )
            command = `cd ${path} && ./service2.sh stop${isAll}`

            log( command, 'debug' )
            Exec( command, err => err && log( err, 'error' ) )
                .on( 'exit', () => {
                    log( '服务器已停止' )
                    resolve( true )
                    setTimeout( () => {
                        process.exit()
                    }, 0 )
                } )
                .on( 'error', () => {
                    resolve( false )
                } )
        } )
    }
}

module.exports = WorkSpace
