let Inquirer  = require( 'inquirer' ),
    WorkSpace = require( '../core/workspace' )

module.exports = {
    list() {
        let list = WorkSpace.list()

        if ( list.length ) {
            Inquirer
                .prompt( [ {
                    type   : 'list',
                    name   : 'workspace',
                    message: '工作空间列表',
                    choices: list,
                    default: WorkSpace.current()
                } ] )
                .then( ( answer ) => {
                    WorkSpace.setCurrentWorkSpace( answer.workspace )
                    log( '切换工作空间成功！' )
                } )
        } else {
            log( '没有检测到工作空间，请使用 cage config 设置', 'warn' )
        }
    }
}
