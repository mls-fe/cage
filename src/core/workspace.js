let Promise = require( 'bluebird' ),
    Exec    = require( 'child_process' ).exec,
    Key     = require( '../key' ),
    Const   = require( '../const' ),
    Util    = require( '../util' ),
    Profile = global.Profile

const APPS = Const.APPS,
      NEST = Const.NEST

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
            return results.reduce( ( prev, cur ) => prev && cur )
        } )
    }

    // 获取当前工作空间
    static current() {
        return Profile.get( Key.current_path )
    }

    // 获取全部工作空间
    static list() {
        return Profile.get( Key.workspace_list )
    }

    // 设置 path 为当前工作空间
    static setCurrentWorkSpace( path ) {
        let list         = Profile.get( Key.workspace_list ) || [],
            existPath,
            alreadyExist = list.some( ( item, i ) => {
                if ( item == path ) {
                    existPath = {
                        val: item,
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

    active() {
        WorkSpace.setCurrentWorkSpace( this.basePath )
    }

    start() {
        return new Promise( resolve => {
            let path    = this.basePath,
                command = `cd ${path}/nest/cmd && ./service2.sh restart`

            log( command, 'debug' )
            Exec( command, err => err && log( err, 'error' ) )
                .on( 'message', message => log( message, 'debug' ) )
                .on( 'exit', () => {
                    log( '服务器正在运行' )
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

    stop( all ) {
        return new Promise( resolve => {
            let path    = this.basePath,
                isAll   = all == 'all' ? 'All' : '',
                command = `cd ${path}/nest/cmd && ./service2.sh stop${isAll}`

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
