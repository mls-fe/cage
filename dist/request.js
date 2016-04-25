'use strict';

var HTTP = require('http'),
    Const = require('./const'),
    timeoutLimit = 5000,
    host = Const.URL_SERVER,
    Request = void 0;

Request = function Request(path) {
    return new Promise(function (resolve, reject) {
        path = path.replace(/\s+/g, '');

        if (path.indexOf('/') != 0) {
            path = '/' + path;
        }

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9yZXF1ZXN0LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsSUFBSSxPQUFlLFFBQVMsTUFBVCxDQUFuQjtJQUNJLFFBQWUsUUFBUyxTQUFULENBRG5CO0lBRUksZUFBZSxJQUZuQjtJQUdJLE9BQWUsTUFBTSxVQUh6QjtJQUlJLGdCQUpKOztBQU1BLFVBQVUsdUJBQVE7QUFDZCxXQUFPLElBQUksT0FBSixDQUFhLFVBQUUsT0FBRixFQUFXLE1BQVgsRUFBdUI7QUFDdkMsZUFBTyxLQUFLLE9BQUwsQ0FBYyxNQUFkLEVBQXNCLEVBQXRCLENBQVA7O0FBRUEsWUFBSyxLQUFLLE9BQUwsQ0FBYyxHQUFkLEtBQXVCLENBQTVCLEVBQWdDO0FBQzVCLG1CQUFPLE1BQU0sSUFBYjtBQUNIOztBQUVELFlBQUksU0FBUyxFQUFiO1lBQ0ksU0FBUztBQUNMLHNCQURLLEVBQ0M7QUFERCxTQURiO1lBSUksa0JBSko7WUFJZSxZQUpmOztBQU1BLGNBQU0sS0FBSyxPQUFMLENBQWMsTUFBZCxFQUFzQixlQUFPO0FBQy9CLHlCQUFjLFNBQWQ7QUFDQSxnQkFBSSxXQUFKLENBQWlCLE1BQWpCOztBQUVBLGdCQUFJLEVBQUosQ0FBUSxNQUFSLEVBQWdCLGdCQUFRO0FBQ3BCLDBCQUFVLElBQVY7QUFDSCxhQUZEOztBQUlBLGdCQUFJLEVBQUosQ0FBUSxLQUFSLEVBQWUsWUFBTTtBQUNqQixvQkFBSTtBQUNBLDZCQUFTLEtBQUssS0FBTCxDQUFZLE1BQVosQ0FBVDtBQUNILGlCQUZELENBRUUsT0FBUSxDQUFSLEVBQVk7QUFDViw2QkFBUztBQUNMLDhCQUFPLENBQUMsQ0FESDtBQUVMLHFGQUNNO0FBSEQscUJBQVQ7QUFLSCxpQkFSRCxTQVNRO0FBQ0osNEJBQVMsTUFBVDtBQUNIO0FBQ0osYUFiRDtBQWNILFNBdEJLLENBQU47O0FBd0JBLHdCQUFlLElBQWYsR0FBc0IsSUFBdEIsRUFBOEIsT0FBOUI7O0FBRUEsWUFBSSxVQUFKLENBQWdCLFlBQWhCLEVBQThCLFlBQU07QUFDaEMsbUJBQVE7QUFDSixzQkFBTyxDQUFDLENBREo7QUFFSixxQkFBTztBQUZILGFBQVI7QUFJSCxTQUxEOztBQU9BLFlBQUksRUFBSixDQUFRLE9BQVIsRUFBaUIsZUFBTztBQUNwQixtQkFBUTtBQUNKLHNCQUFPLENBQUMsQ0FESjtBQUVKLDJFQUVFLEdBRkY7QUFGSSxhQUFSO0FBT0gsU0FSRDs7QUFVQSxZQUFJLEdBQUo7QUFDSCxLQXpETSxFQXlESCxLQXpERyxDQXlESSxhQUFLO0FBQ1osWUFBSyxFQUFFLEdBQVAsRUFBWSxPQUFaO0FBQ0gsS0EzRE0sQ0FBUDtBQTRESCxDQTdERDs7QUErREEsT0FBTyxPQUFQLEdBQWlCLE9BQWpCIiwiZmlsZSI6InJlcXVlc3QuanMiLCJzb3VyY2VzQ29udGVudCI6WyJsZXQgSFRUUCAgICAgICAgID0gcmVxdWlyZSggJ2h0dHAnICksXG4gICAgQ29uc3QgICAgICAgID0gcmVxdWlyZSggJy4vY29uc3QnICksXG4gICAgdGltZW91dExpbWl0ID0gNTAwMCxcbiAgICBob3N0ICAgICAgICAgPSBDb25zdC5VUkxfU0VSVkVSLFxuICAgIFJlcXVlc3RcblxuUmVxdWVzdCA9IHBhdGggPT4ge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZSggKCByZXNvbHZlLCByZWplY3QgKSA9PiB7XG4gICAgICAgIHBhdGggPSBwYXRoLnJlcGxhY2UoIC9cXHMrL2csICcnIClcblxuICAgICAgICBpZiAoIHBhdGguaW5kZXhPZiggJy8nICkgIT0gMCApIHtcbiAgICAgICAgICAgIHBhdGggPSAnLycgKyBwYXRoXG4gICAgICAgIH1cblxuICAgICAgICBsZXQgcmVzdWx0ID0gJycsXG4gICAgICAgICAgICBvcHRpb24gPSB7XG4gICAgICAgICAgICAgICAgaG9zdCwgcGF0aFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHRpbWVvdXRJRCwgcmVxXG5cbiAgICAgICAgcmVxID0gSFRUUC5yZXF1ZXN0KCBvcHRpb24sIHJlcyA9PiB7XG4gICAgICAgICAgICBjbGVhclRpbWVvdXQoIHRpbWVvdXRJRCApXG4gICAgICAgICAgICByZXMuc2V0RW5jb2RpbmcoICd1dGY4JyApXG5cbiAgICAgICAgICAgIHJlcy5vbiggJ2RhdGEnLCBkYXRhID0+IHtcbiAgICAgICAgICAgICAgICByZXN1bHQgKz0gZGF0YVxuICAgICAgICAgICAgfSApXG5cbiAgICAgICAgICAgIHJlcy5vbiggJ2VuZCcsICgpID0+IHtcbiAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICByZXN1bHQgPSBKU09OLnBhcnNlKCByZXN1bHQgKVxuICAgICAgICAgICAgICAgIH0gY2F0Y2ggKCBlICkge1xuICAgICAgICAgICAgICAgICAgICByZXN1bHQgPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb2RlIDogLTEsXG4gICAgICAgICAgICAgICAgICAgICAgICBtc2cgIDogYOacjeWKoeWZqOerr+i/lOWbnueahOS4jeaYr+acieaViOeahCBKU09OIOagvOW8jzpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAke3Jlc3VsdH1gXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZmluYWxseSB7XG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUoIHJlc3VsdCApXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSApXG4gICAgICAgIH0gKVxuXG4gICAgICAgIGxvZyggYGh0dHA6Ly8ke2hvc3R9JHtwYXRofWAsICdkZWJ1ZycgKVxuXG4gICAgICAgIHJlcS5zZXRUaW1lb3V0KCB0aW1lb3V0TGltaXQsICgpID0+IHtcbiAgICAgICAgICAgIHJlamVjdCgge1xuICAgICAgICAgICAgICAgIGNvZGUgOiAtMSxcbiAgICAgICAgICAgICAgICBtc2cgIDogJ+e9kee7nOivt+axgui2heaXti4nXG4gICAgICAgICAgICB9IClcbiAgICAgICAgfSApXG5cbiAgICAgICAgcmVxLm9uKCAnZXJyb3InLCBlcnIgPT4ge1xuICAgICAgICAgICAgcmVqZWN0KCB7XG4gICAgICAgICAgICAgICAgY29kZSA6IC0xLFxuICAgICAgICAgICAgICAgIG1zZyAgOiBgXG4gICAgICAgICAgICAgICAg572R57uc6K+35rGC5aSx6LSlLCDlpLHotKXljp/lm6A6XG4gICAgICAgICAgICAgICAgJHtlcnJ9XG4gICAgICAgICAgICAgICAgYFxuICAgICAgICAgICAgfSApXG4gICAgICAgIH0gKVxuXG4gICAgICAgIHJlcS5lbmQoKVxuICAgIH0gKS5jYXRjaCggZSA9PiB7XG4gICAgICAgIGxvZyggZS5tc2csICdlcnJvcicgKVxuICAgIH0gKVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFJlcXVlc3RcbiJdfQ==