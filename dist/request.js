'use strict';

var HTTP = require('http'),
    Const = require('./const'),
    timeoutLimit = 5000,
    host = Const.URL_SERVER,
    port = Const.URL_PORT,
    Request = void 0;

Request = function Request(path) {
    path = path.trim();

    return new Promise(function (resolve, reject) {
        var result = '',
            option = {
            host: host, port: port, path: path
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
                    console.log(result);
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

        log('http://' + host + ':' + port + path, 'debug');

        req.setTimeout(timeoutLimit, function () {
            reject({
                code: -1,
                msg: '请求超时.'
            });
        });

        req.on('error', function (err) {
            reject({
                code: -1,
                msg: '网络请求失败, 失败原因:\n' + err
            });
        });

        req.end();
    }).catch(function (e) {
        log(e.msg, 'error');
    });
};

module.exports = Request;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9yZXF1ZXN0LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsSUFBSSxPQUFlLFFBQVMsTUFBVCxDQUFuQjtJQUNJLFFBQWUsUUFBUyxTQUFULENBRG5CO0lBRUksZUFBZSxJQUZuQjtJQUdJLE9BQWUsTUFBTSxVQUh6QjtJQUlJLE9BQWUsTUFBTSxRQUp6QjtJQUtJLGdCQUxKOztBQU9BLFVBQVUsdUJBQVE7QUFDZCxXQUFPLEtBQUssSUFBTCxFQUFQOztBQUVBLFdBQU8sSUFBSSxPQUFKLENBQWEsVUFBRSxPQUFGLEVBQVcsTUFBWCxFQUF1QjtBQUN2QyxZQUFJLFNBQVMsRUFBYjtZQUNJLFNBQVM7QUFDTCxzQkFESyxFQUNDLFVBREQsRUFDTztBQURQLFNBRGI7WUFJSSxrQkFKSjtZQUllLFlBSmY7O0FBTUEsY0FBTSxLQUFLLE9BQUwsQ0FBYyxNQUFkLEVBQXNCLGVBQU87QUFDL0IseUJBQWMsU0FBZDtBQUNBLGdCQUFJLFdBQUosQ0FBaUIsTUFBakI7O0FBRUEsZ0JBQUksRUFBSixDQUFRLE1BQVIsRUFBZ0IsZ0JBQVE7QUFDcEIsMEJBQVUsSUFBVjtBQUNILGFBRkQ7O0FBSUEsZ0JBQUksRUFBSixDQUFRLEtBQVIsRUFBZSxZQUFNO0FBQ2pCLG9CQUFJO0FBQ0EsNEJBQVEsR0FBUixDQUFhLE1BQWI7QUFDQSw2QkFBUyxLQUFLLEtBQUwsQ0FBWSxNQUFaLENBQVQ7QUFDSCxpQkFIRCxDQUdFLE9BQVEsQ0FBUixFQUFZO0FBQ1YsNkJBQVM7QUFDTCw4QkFBTyxDQUFDLENBREg7QUFFTCxxRkFDTTtBQUhELHFCQUFUO0FBS0gsaUJBVEQsU0FVUTtBQUNKLDRCQUFTLE1BQVQ7QUFDSDtBQUNKLGFBZEQ7QUFlSCxTQXZCSyxDQUFOOztBQXlCQSx3QkFBZSxJQUFmLFNBQXVCLElBQXZCLEdBQThCLElBQTlCLEVBQXNDLE9BQXRDOztBQUVBLFlBQUksVUFBSixDQUFnQixZQUFoQixFQUE4QixZQUFNO0FBQ2hDLG1CQUFRO0FBQ0osc0JBQU8sQ0FBQyxDQURKO0FBRUoscUJBQU87QUFGSCxhQUFSO0FBSUgsU0FMRDs7QUFPQSxZQUFJLEVBQUosQ0FBUSxPQUFSLEVBQWlCLGVBQU87QUFDcEIsbUJBQVE7QUFDSixzQkFBTyxDQUFDLENBREo7QUFFSix5Q0FBeUI7QUFGckIsYUFBUjtBQUlILFNBTEQ7O0FBT0EsWUFBSSxHQUFKO0FBQ0gsS0FqRE0sRUFpREgsS0FqREcsQ0FpREksYUFBSztBQUNaLFlBQUssRUFBRSxHQUFQLEVBQVksT0FBWjtBQUNILEtBbkRNLENBQVA7QUFvREgsQ0F2REQ7O0FBeURBLE9BQU8sT0FBUCxHQUFpQixPQUFqQiIsImZpbGUiOiJyZXF1ZXN0LmpzIiwic291cmNlc0NvbnRlbnQiOlsibGV0IEhUVFAgICAgICAgICA9IHJlcXVpcmUoICdodHRwJyApLFxuICAgIENvbnN0ICAgICAgICA9IHJlcXVpcmUoICcuL2NvbnN0JyApLFxuICAgIHRpbWVvdXRMaW1pdCA9IDUwMDAsXG4gICAgaG9zdCAgICAgICAgID0gQ29uc3QuVVJMX1NFUlZFUixcbiAgICBwb3J0ICAgICAgICAgPSBDb25zdC5VUkxfUE9SVCxcbiAgICBSZXF1ZXN0XG5cblJlcXVlc3QgPSBwYXRoID0+IHtcbiAgICBwYXRoID0gcGF0aC50cmltKClcbiAgICBcbiAgICByZXR1cm4gbmV3IFByb21pc2UoICggcmVzb2x2ZSwgcmVqZWN0ICkgPT4ge1xuICAgICAgICBsZXQgcmVzdWx0ID0gJycsXG4gICAgICAgICAgICBvcHRpb24gPSB7XG4gICAgICAgICAgICAgICAgaG9zdCwgcG9ydCwgcGF0aFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHRpbWVvdXRJRCwgcmVxXG5cbiAgICAgICAgcmVxID0gSFRUUC5yZXF1ZXN0KCBvcHRpb24sIHJlcyA9PiB7XG4gICAgICAgICAgICBjbGVhclRpbWVvdXQoIHRpbWVvdXRJRCApXG4gICAgICAgICAgICByZXMuc2V0RW5jb2RpbmcoICd1dGY4JyApXG5cbiAgICAgICAgICAgIHJlcy5vbiggJ2RhdGEnLCBkYXRhID0+IHtcbiAgICAgICAgICAgICAgICByZXN1bHQgKz0gZGF0YVxuICAgICAgICAgICAgfSApXG5cbiAgICAgICAgICAgIHJlcy5vbiggJ2VuZCcsICgpID0+IHtcbiAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyggcmVzdWx0IClcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0ID0gSlNPTi5wYXJzZSggcmVzdWx0IClcbiAgICAgICAgICAgICAgICB9IGNhdGNoICggZSApIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0ID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29kZSA6IC0xLFxuICAgICAgICAgICAgICAgICAgICAgICAgbXNnICA6IGDmnI3liqHlmajnq6/ov5Tlm57nmoTkuI3mmK/mnInmlYjnmoQgSlNPTiDmoLzlvI86XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJHtyZXN1bHR9YFxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGZpbmFsbHkge1xuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKCByZXN1bHQgKVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gKVxuICAgICAgICB9IClcblxuICAgICAgICBsb2coIGBodHRwOi8vJHtob3N0fToke3BvcnR9JHtwYXRofWAsICdkZWJ1ZycgKVxuXG4gICAgICAgIHJlcS5zZXRUaW1lb3V0KCB0aW1lb3V0TGltaXQsICgpID0+IHtcbiAgICAgICAgICAgIHJlamVjdCgge1xuICAgICAgICAgICAgICAgIGNvZGUgOiAtMSxcbiAgICAgICAgICAgICAgICBtc2cgIDogJ+ivt+axgui2heaXti4nXG4gICAgICAgICAgICB9IClcbiAgICAgICAgfSApXG5cbiAgICAgICAgcmVxLm9uKCAnZXJyb3InLCBlcnIgPT4ge1xuICAgICAgICAgICAgcmVqZWN0KCB7XG4gICAgICAgICAgICAgICAgY29kZSA6IC0xLFxuICAgICAgICAgICAgICAgIG1zZyAgOiBg572R57uc6K+35rGC5aSx6LSlLCDlpLHotKXljp/lm6A6XFxuJHtlcnJ9YFxuICAgICAgICAgICAgfSApXG4gICAgICAgIH0gKVxuXG4gICAgICAgIHJlcS5lbmQoKVxuICAgIH0gKS5jYXRjaCggZSA9PiB7XG4gICAgICAgIGxvZyggZS5tc2csICdlcnJvcicgKVxuICAgIH0gKVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFJlcXVlc3RcbiJdfQ==