let HTTP         = require( 'http' ),
    timeoutLimit = 5000,
    Request

Request = option => {
    return new Promise( ( resolve, reject ) => {
        let timeoutID,
            result = '',
            req    = HTTP.request( option, res => {
                clearTimeout( timeoutID )
                res.setEncoding( 'utf8' )

                res.on( 'data', data => {
                    result += data
                } )

                res.on( 'end', () => {
                    try {
                        result = JSON.parse( result )
                    } catch ( e ) {
                        result = {
                            code : -1,
                            msg  : `服务器端返回的不是有效的 JSON 格式:
                            ${result}`
                        }
                    }
                    finally {
                        resolve( result )
                    }
                } )
            } )

        req.on( 'error', err => {
            reject( {
                code : -1,
                msg  : `网络请求失败, 失败原因:\n${err}`
            } )
        } )

        req.end()

        timeoutID = setTimeout( () => {
            reject( {
                code : -1,
                msg  : '请求超时.'
            } )
        }, timeoutLimit )
    } )
}

module.exports = Request
