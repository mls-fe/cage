//https://github.com/chalk/ansi-styles/blob/master/index
let levels = [
        {
            name  : 'info',
            color : 'white'
        },
        {
            name  : 'debug',
            color : 'gray'
        },
        {
            name  : 'error',
            color : 'red',
            bold  : true
        },
        {
            name  : 'warn',
            color : 'yellow',
            bold  : true
        },
        {
            name  : 'success',
            color : 'green'
        }
    ],
    bold   = [ 1, 22 ],
    colors = {
        red    : [ 31, 39 ],
        green  : [ 32, 39 ],
        yellow : [ 33, 39 ],
        white  : [ 37, 39 ],
        gray   : [ 90, 39 ]
    },
    edge   = '\u001b[',
    style  = {},
    helper = content => `${edge}${content}m`

levels.forEach( level => {
    let color  = colors[ level.color ],
        isBold = !!level.bold

    style[ level.name ] = content => {
        let str = [ content ]

        str.unshift( helper( color[ 0 ] ) )
        str.push( helper( color[ 1 ] ) )

        if ( isBold ) {
            str.unshift( helper( bold[ 0 ] ) )
            str.push( helper( bold[ 1 ] ) )
        }

        return str.join( '' )
    }
} )

global.log = ( content, type = 'info' ) => {
    console.log( style[ type ]( content ) )
}
