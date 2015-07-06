let Inquirer  = require( 'inquirer' ),
    WorkSpace = require( '../core/workspace' )

module.exports = {
    list() {
        Inquirer
            .prompt( [ {
                type: 'list',
                name: 'workspace',
                message: '工作空间列表',
                choices: WorkSpace.list(),
                default: WorkSpace.current()
            } ], answer => {
                WorkSpace.setCurrentWorkSpace( answer.workspace )
                log( '切换工作空间成功！' )
            } )
    }
}
