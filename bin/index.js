#!/usr/bin/env node
if ( parseFloat( process.version.replace( 'v', '' ) ) < 4.2 ) {
    return console.warn( 'Node 版本过低, 请升级至最新版本.' )
}

require( '../dist/index' )
