let CFonts = require( 'cfonts' )

exports.yell = () => {
    new CFonts( {
        text           : 'Cage',
        font           : '3d',
        'colors'       : [ 'green', 'yellow' ],
        'background'   : 'Black',
        'letterSpacing': 1,
        'space'        : true,
        'maxLength'    : '10'
    } )
}
