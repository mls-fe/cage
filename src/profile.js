let Configstore = require( 'configstore' ),
    Key         = require( './key' )

global.Profile = new Configstore( Key.profile )
