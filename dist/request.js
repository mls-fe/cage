'use strict';

var HTTP = require('http'),
    Const = require('./const'),
    timeoutLimit = 5000,
    host = Const.URL_SERVER,
    Request = void 0;

Request = function Request(path) {
    path = path.trim();

    return new Promise(function (resolve, reject) {
        var result = '',
            option = {
            host: host, path: path
        },
            timeoutID = void 0,
            req = void 0;

        req = HTTP.request(option, function (res) {
            clearTimeout(timeoutID);
            res.setEncoding('utf8');

            res.on('data', function (data) {
                result += data;
            });

            res.on('end', function () {
                try {
                    result = JSON.parse(result);
                } catch (e) {
                    result = {
                        code: -1,
                        msg: '服务器端返回的不是有效的 JSON 格式:\n                            ' + result
                    };
                } finally {
                    resolve(result);
                }
            });
        });

        log('http://' + host + path, 'debug');

        req.setTimeout(timeoutLimit, function () {
            reject({
                code: -1,
                msg: '网络请求超时.'
            });
        });

        req.on('error', function (err) {
            reject({
                code: -1,
                msg: '\n                网络请求失败, 失败原因:\n                ' + err + '\n                '
            });
        });

        req.end();
    }).catch(function (e) {
        log(e.msg, 'error');
    });
};

module.exports = Request;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9yZXF1ZXN0LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsSUFBSSxPQUFlLFFBQVMsTUFBVCxDQUFuQjtJQUNJLFFBQWUsUUFBUyxTQUFULENBRG5CO0lBRUksZUFBZSxJQUZuQjtJQUdJLE9BQWUsTUFBTSxVQUh6QjtJQUlJLGdCQUpKOztBQU1BLFVBQVUsdUJBQVE7QUFDZCxXQUFPLEtBQUssSUFBTCxFQUFQOztBQUVBLFdBQU8sSUFBSSxPQUFKLENBQWEsVUFBRSxPQUFGLEVBQVcsTUFBWCxFQUF1QjtBQUN2QyxZQUFJLFNBQVMsRUFBYjtZQUNJLFNBQVM7QUFDTCxzQkFESyxFQUNDO0FBREQsU0FEYjtZQUlJLGtCQUpKO1lBSWUsWUFKZjs7QUFNQSxjQUFNLEtBQUssT0FBTCxDQUFjLE1BQWQsRUFBc0IsZUFBTztBQUMvQix5QkFBYyxTQUFkO0FBQ0EsZ0JBQUksV0FBSixDQUFpQixNQUFqQjs7QUFFQSxnQkFBSSxFQUFKLENBQVEsTUFBUixFQUFnQixnQkFBUTtBQUNwQiwwQkFBVSxJQUFWO0FBQ0gsYUFGRDs7QUFJQSxnQkFBSSxFQUFKLENBQVEsS0FBUixFQUFlLFlBQU07QUFDakIsb0JBQUk7QUFDQSw2QkFBUyxLQUFLLEtBQUwsQ0FBWSxNQUFaLENBQVQ7QUFDSCxpQkFGRCxDQUVFLE9BQVEsQ0FBUixFQUFZO0FBQ1YsNkJBQVM7QUFDTCw4QkFBTyxDQUFDLENBREg7QUFFTCxxRkFDTTtBQUhELHFCQUFUO0FBS0gsaUJBUkQsU0FTUTtBQUNKLDRCQUFTLE1BQVQ7QUFDSDtBQUNKLGFBYkQ7QUFjSCxTQXRCSyxDQUFOOztBQXdCQSx3QkFBZSxJQUFmLEdBQXNCLElBQXRCLEVBQThCLE9BQTlCOztBQUVBLFlBQUksVUFBSixDQUFnQixZQUFoQixFQUE4QixZQUFNO0FBQ2hDLG1CQUFRO0FBQ0osc0JBQU8sQ0FBQyxDQURKO0FBRUoscUJBQU87QUFGSCxhQUFSO0FBSUgsU0FMRDs7QUFPQSxZQUFJLEVBQUosQ0FBUSxPQUFSLEVBQWlCLGVBQU87QUFDcEIsbUJBQVE7QUFDSixzQkFBTyxDQUFDLENBREo7QUFFSiwyRUFFRSxHQUZGO0FBRkksYUFBUjtBQU9ILFNBUkQ7O0FBVUEsWUFBSSxHQUFKO0FBQ0gsS0FuRE0sRUFtREgsS0FuREcsQ0FtREksYUFBSztBQUNaLFlBQUssRUFBRSxHQUFQLEVBQVksT0FBWjtBQUNILEtBckRNLENBQVA7QUFzREgsQ0F6REQ7O0FBMkRBLE9BQU8sT0FBUCxHQUFpQixPQUFqQiIsImZpbGUiOiJyZXF1ZXN0LmpzIiwic291cmNlc0NvbnRlbnQiOlsibGV0IEhUVFAgICAgICAgICA9IHJlcXVpcmUoICdodHRwJyApLFxuICAgIENvbnN0ICAgICAgICA9IHJlcXVpcmUoICcuL2NvbnN0JyApLFxuICAgIHRpbWVvdXRMaW1pdCA9IDUwMDAsXG4gICAgaG9zdCAgICAgICAgID0gQ29uc3QuVVJMX1NFUlZFUixcbiAgICBSZXF1ZXN0XG5cblJlcXVlc3QgPSBwYXRoID0+IHtcbiAgICBwYXRoID0gcGF0aC50cmltKClcblxuICAgIHJldHVybiBuZXcgUHJvbWlzZSggKCByZXNvbHZlLCByZWplY3QgKSA9PiB7XG4gICAgICAgIGxldCByZXN1bHQgPSAnJyxcbiAgICAgICAgICAgIG9wdGlvbiA9IHtcbiAgICAgICAgICAgICAgICBob3N0LCBwYXRoXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgdGltZW91dElELCByZXFcblxuICAgICAgICByZXEgPSBIVFRQLnJlcXVlc3QoIG9wdGlvbiwgcmVzID0+IHtcbiAgICAgICAgICAgIGNsZWFyVGltZW91dCggdGltZW91dElEIClcbiAgICAgICAgICAgIHJlcy5zZXRFbmNvZGluZyggJ3V0ZjgnIClcblxuICAgICAgICAgICAgcmVzLm9uKCAnZGF0YScsIGRhdGEgPT4ge1xuICAgICAgICAgICAgICAgIHJlc3VsdCArPSBkYXRhXG4gICAgICAgICAgICB9IClcblxuICAgICAgICAgICAgcmVzLm9uKCAnZW5kJywgKCkgPT4ge1xuICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdCA9IEpTT04ucGFyc2UoIHJlc3VsdCApXG4gICAgICAgICAgICAgICAgfSBjYXRjaCAoIGUgKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdCA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvZGUgOiAtMSxcbiAgICAgICAgICAgICAgICAgICAgICAgIG1zZyAgOiBg5pyN5Yqh5Zmo56uv6L+U5Zue55qE5LiN5piv5pyJ5pWI55qEIEpTT04g5qC85byPOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICR7cmVzdWx0fWBcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBmaW5hbGx5IHtcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZSggcmVzdWx0IClcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IClcbiAgICAgICAgfSApXG5cbiAgICAgICAgbG9nKCBgaHR0cDovLyR7aG9zdH0ke3BhdGh9YCwgJ2RlYnVnJyApXG5cbiAgICAgICAgcmVxLnNldFRpbWVvdXQoIHRpbWVvdXRMaW1pdCwgKCkgPT4ge1xuICAgICAgICAgICAgcmVqZWN0KCB7XG4gICAgICAgICAgICAgICAgY29kZSA6IC0xLFxuICAgICAgICAgICAgICAgIG1zZyAgOiAn572R57uc6K+35rGC6LaF5pe2LidcbiAgICAgICAgICAgIH0gKVxuICAgICAgICB9IClcblxuICAgICAgICByZXEub24oICdlcnJvcicsIGVyciA9PiB7XG4gICAgICAgICAgICByZWplY3QoIHtcbiAgICAgICAgICAgICAgICBjb2RlIDogLTEsXG4gICAgICAgICAgICAgICAgbXNnICA6IGBcbiAgICAgICAgICAgICAgICDnvZHnu5zor7fmsYLlpLHotKUsIOWksei0peWOn+WboDpcbiAgICAgICAgICAgICAgICAke2Vycn1cbiAgICAgICAgICAgICAgICBgXG4gICAgICAgICAgICB9IClcbiAgICAgICAgfSApXG5cbiAgICAgICAgcmVxLmVuZCgpXG4gICAgfSApLmNhdGNoKCBlID0+IHtcbiAgICAgICAgbG9nKCBlLm1zZywgJ2Vycm9yJyApXG4gICAgfSApXG59XG5cbm1vZHVsZS5leHBvcnRzID0gUmVxdWVzdFxuIl19