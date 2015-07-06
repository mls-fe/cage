'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var Configstore = require('configstore'),
    Promise = require('bluebird'),
    Exec = require('child_process').exec,
    Key = require('./key'),
    Util = require('./util'),
    conf = new Configstore(Key.profile),
    checkedPath = [process.cwd(), conf.get(Key.current_path)];

var Server = (function () {
    function Server() {
        _classCallCheck(this, Server);

        this.checkPath();
    }

    _createClass(Server, [{
        key: 'checkPath',
        value: function checkPath() {
            var _this = this;

            if (checkedPath.length) {
                var _ret = (function () {
                    var _path = checkedPath.shift();

                    return {
                        v: _this.check = Util.isUnderWorkSpace(_path, true).then(function (result) {
                            if (result) {
                                _this.path = _path;
                                return true;
                            } else {
                                return _this.checkPath();
                            }
                        })
                    };
                })();

                if (typeof _ret === 'object') return _ret.v;
            }
        }
    }, {
        key: 'start',
        value: function start() {
            var _this2 = this;

            return new Promise(function (resolve) {
                _this2.check.then(function (result) {
                    if (result) {
                        var path = _this2.path,
                            command = 'cd ' + path + '/nest/cmd && ./service2.sh restart';

                        log(command, 'debug');
                        Exec(command, function (err) {
                            return err && log(err, 'error');
                        }).on('message', function (message) {
                            return log(message, 'debug');
                        }).on('exit', function () {
                            log('服务器正在运行');
                            resolve(true);
                            setTimeout(function () {
                                process.exit();
                            }, 0);
                        });
                    }
                });
            });
        }
    }, {
        key: 'stop',
        value: function stop(isAll) {
            var _this3 = this;

            return new Promise(function (resolve) {
                _this3.check.then(function (result) {
                    if (result) {
                        var path = _this3.path,
                            _isAll = _isAll == 'all' ? 'All' : '',
                            command = 'cd ' + path + '/nest/cmd && ./service2.sh stop' + _isAll;

                        log(command, 'debug');
                        Exec(command, function (err) {
                            return err && log(err, 'error');
                        }).on('exit', function () {
                            log('服务器已停止');
                            resolve(true);
                            setTimeout(function () {
                                process.exit();
                            }, 0);
                        });
                    }
                });
            });
        }
    }]);

    return Server;
})();

module.exports = Server;
//# sourceMappingURL=data:application/json;base64,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SSxDQUFFLE9BQU8sRUFBRSxVQUFBLEdBQUc7bUNBQUksR0FBRyxJQUFJLEdBQUcsQ0FBRSxHQUFHLEVBQUUsT0FBTyxDQUFFO3lCQUFBLENBQUUsQ0FDN0MsRUFBRSxDQUFFLE1BQU0sRUFBRSxZQUFNO0FBQ2YsK0JBQUcsQ0FBRSxRQUFRLENBQUUsQ0FBQTtBQUNmLG1DQUFPLENBQUUsSUFBSSxDQUFFLENBQUE7QUFDZixzQ0FBVSxDQUFFLFlBQU07QUFDZCx1Q0FBTyxDQUFDLElBQUksRUFBRSxDQUFBOzZCQUNqQixFQUFFLENBQUMsQ0FBRSxDQUFBO3lCQUNULENBQUUsQ0FBQTtxQkFDVjtpQkFDSixDQUFFLENBQUE7YUFDVixDQUFFLENBQUE7U0FFTjs7O1dBdEVDLE1BQU07OztBQXlFWixNQUFNLENBQUMsT0FBTyxHQUFHLE1BQU0sQ0FBQSIsImZpbGUiOiJzZXJ2ZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJsZXQgQ29uZmlnc3RvcmUgPSByZXF1aXJlKCAnY29uZmlnc3RvcmUnICksXG4gICAgUHJvbWlzZSAgICAgPSByZXF1aXJlKCAnYmx1ZWJpcmQnICksXG4gICAgRXhlYyAgICAgICAgPSByZXF1aXJlKCAnY2hpbGRfcHJvY2VzcycgKS5leGVjLFxuICAgIEtleSAgICAgICAgID0gcmVxdWlyZSggJy4va2V5JyApLFxuICAgIFV0aWwgICAgICAgID0gcmVxdWlyZSggJy4vdXRpbCcgKSxcbiAgICBjb25mICAgICAgICA9IG5ldyBDb25maWdzdG9yZSggS2V5LnByb2ZpbGUgKSxcblxuICAgIGNoZWNrZWRQYXRoID0gWyBwcm9jZXNzLmN3ZCgpLCBjb25mLmdldCggS2V5LmN1cnJlbnRfcGF0aCApIF1cblxuY2xhc3MgU2VydmVyIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy5jaGVja1BhdGgoKVxuICAgIH1cblxuICAgIGNoZWNrUGF0aCgpIHtcbiAgICAgICAgaWYgKCBjaGVja2VkUGF0aC5sZW5ndGggKSB7XG4gICAgICAgICAgICBsZXQgX3BhdGggPSBjaGVja2VkUGF0aC5zaGlmdCgpXG5cbiAgICAgICAgICAgIHJldHVybiB0aGlzLmNoZWNrID0gVXRpbFxuICAgICAgICAgICAgICAgIC5pc1VuZGVyV29ya1NwYWNlKCBfcGF0aCwgdHJ1ZSApXG4gICAgICAgICAgICAgICAgLnRoZW4oIHJlc3VsdCA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlmICggcmVzdWx0ICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wYXRoID0gX3BhdGhcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5jaGVja1BhdGgoKVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSApXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBzdGFydCgpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKCByZXNvbHZlID0+IHtcbiAgICAgICAgICAgIHRoaXNcbiAgICAgICAgICAgICAgICAuY2hlY2tcbiAgICAgICAgICAgICAgICAudGhlbiggcmVzdWx0ID0+IHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCByZXN1bHQgKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgcGF0aCAgICA9IHRoaXMucGF0aCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb21tYW5kID0gYGNkICR7cGF0aH0vbmVzdC9jbWQgJiYgLi9zZXJ2aWNlMi5zaCByZXN0YXJ0YFxuXG4gICAgICAgICAgICAgICAgICAgICAgICBsb2coIGNvbW1hbmQsICdkZWJ1ZycgKVxuICAgICAgICAgICAgICAgICAgICAgICAgRXhlYyggY29tbWFuZCwgZXJyID0+IGVyciAmJiBsb2coIGVyciwgJ2Vycm9yJyApIClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAub24oICdtZXNzYWdlJywgbWVzc2FnZSA9PiBsb2coIG1lc3NhZ2UsICdkZWJ1ZycgKSApXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLm9uKCAnZXhpdCcsICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbG9nKCAn5pyN5Yqh5Zmo5q2j5Zyo6L+Q6KGMJyApXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUoIHRydWUgKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KCAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcm9jZXNzLmV4aXQoKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LCAwIClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IClcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gKVxuICAgICAgICB9IClcblxuICAgIH1cblxuICAgIHN0b3AoIGlzQWxsICkge1xuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoIHJlc29sdmUgPT4ge1xuICAgICAgICAgICAgdGhpc1xuICAgICAgICAgICAgICAgIC5jaGVja1xuICAgICAgICAgICAgICAgIC50aGVuKCByZXN1bHQgPT4ge1xuICAgICAgICAgICAgICAgICAgICBpZiAoIHJlc3VsdCApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBwYXRoICAgID0gdGhpcy5wYXRoLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlzQWxsICAgPSBpc0FsbCA9PSAnYWxsJyA/ICdBbGwnIDogJycsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29tbWFuZCA9IGBjZCAke3BhdGh9L25lc3QvY21kICYmIC4vc2VydmljZTIuc2ggc3RvcCR7aXNBbGx9YFxuXG4gICAgICAgICAgICAgICAgICAgICAgICBsb2coIGNvbW1hbmQsICdkZWJ1ZycgKVxuICAgICAgICAgICAgICAgICAgICAgICAgRXhlYyggY29tbWFuZCwgZXJyID0+IGVyciAmJiBsb2coIGVyciwgJ2Vycm9yJyApIClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAub24oICdleGl0JywgKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsb2coICfmnI3liqHlmajlt7LlgZzmraInIClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZSggdHJ1ZSApXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByb2Nlc3MuZXhpdCgpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sIDAgKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gKVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSApXG4gICAgICAgIH0gKVxuXG4gICAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFNlcnZlclxuIl19