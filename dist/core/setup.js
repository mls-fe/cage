'use strict';

var _bluebird = require('bluebird');

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var Promise = require('bluebird'),
    FS = Promise.promisifyAll(require('fs')),
    SVN = Promise.promisifyAll(require('svn-interface')),
    NPM = require('npm'),
    Util = require('../util');

var DIR_APPS = '/apps',
    DIR_NEST = '/nest',
    DIR_TMP = DIR_NEST + '/tmp',
    DIR_NODEMODULES = DIR_NEST + '/node_modules',
    DEPENDENCIES = ['less@1.3.3', 'uglify-js@1.2.6'];

var phases = [{
    name: 'Nest',
    url: 'http://svn.meilishuo.com/repos/meilishuo/fex/hornbill_nest/trunk/',
    dir: DIR_NEST
}, {
    name: 'Apps',
    url: 'http://svn.meilishuo.com/repos/meilishuo/fex/user/trunk/',
    dir: DIR_APPS
}];

var Setup = (function () {
    function Setup() {
        _classCallCheck(this, Setup);
    }

    _createClass(Setup, [{
        key: 'init',
        value: function init(path) {
            this._path = path;
            return FS.mkdirAsync(path);
        }
    }, {
        key: 'checkoutSource',
        value: _bluebird.coroutine(function* (username, password, appSvnUrl) {
            var _this = this;

            return yield Promise.all(phases.map(_bluebird.coroutine(function* (phaseObj) {
                var name = undefined,
                    path = undefined;

                if (appSvnUrl && phaseObj.name == 'Apps') {
                    phaseObj.url = appSvnUrl;
                }

                name = phaseObj.name;
                path = _this._path + phaseObj.dir;
                log('\n初始化 ' + name + ' 文件夹');
                yield FS.mkdirAsync(path);

                return new Promise(function (resolve, reject) {
                    Util.indicator.start();

                    var childProcess = SVN.co(phaseObj.url, path, {
                        username: username, password: password
                    }, function (err) {
                        if (!err) {
                            Util.indicator.stop();
                            log(name + ' 设置成功!', 'success');
                            resolve();
                        }
                    });

                    childProcess.stderr.on('data', function (data) {
                        if (!_this.hasError) {
                            reject();
                            childProcess.kill();
                            _this.hasError = true;
                            _this.error(data.toString());
                        }
                    });
                });
            }))).then(_bluebird.coroutine(function* () {
                log('创建 tmp 文件夹');
                yield FS.mkdirAsync(_this._path + DIR_TMP);
                return _this.installDependencies();
            }));
        })
    }, {
        key: 'installDependencies',
        value: _bluebird.coroutine(function* () {
            var deptPath = this._path + DIR_NEST;

            log('安装 less 与 uglify-js');

            return new Promise(function (resolve) {
                NPM.load({}, function (err, npm) {
                    npm.commands.install(deptPath, DEPENDENCIES, function () {
                        log('\n依赖库安装成功!', 'success');
                        Util.indicator.stop();
                        resolve();
                    });
                });
            });
        })
    }, {
        key: 'error',
        value: function error(msg) {
            Util.indicator.stop();
            log('下载源码失败，以下为 svn 打印的错误消息', 'error');
            log(msg);
        }
    }]);

    return Setup;
})();

module.exports = Setup;
//# sourceMappingURL=data:application/json;base64,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ZS9zZXR1cC5qcyIsInNvdXJjZXNDb250ZW50IjpbImxldCBQcm9taXNlID0gcmVxdWlyZSggJ2JsdWViaXJkJyApLFxuICAgIEZTICAgICAgPSBQcm9taXNlLnByb21pc2lmeUFsbCggcmVxdWlyZSggJ2ZzJyApICksXG4gICAgU1ZOICAgICA9IFByb21pc2UucHJvbWlzaWZ5QWxsKCByZXF1aXJlKCAnc3ZuLWludGVyZmFjZScgKSApLFxuICAgIE5QTSAgICAgPSByZXF1aXJlKCAnbnBtJyApLFxuICAgIFV0aWwgICAgPSByZXF1aXJlKCAnLi4vdXRpbCcgKVxuXG5jb25zdCBESVJfQVBQUyAgICAgICAgPSAnL2FwcHMnLFxuICAgICAgRElSX05FU1QgICAgICAgID0gJy9uZXN0JyxcbiAgICAgIERJUl9UTVAgICAgICAgICA9IGAke0RJUl9ORVNUfS90bXBgLFxuICAgICAgRElSX05PREVNT0RVTEVTID0gRElSX05FU1QgKyAnL25vZGVfbW9kdWxlcycsXG4gICAgICBERVBFTkRFTkNJRVMgICAgPSBbICdsZXNzQDEuMy4zJywgJ3VnbGlmeS1qc0AxLjIuNicgXVxuXG5sZXQgcGhhc2VzID0gWyB7XG4gICAgbmFtZTogJ05lc3QnLFxuICAgIHVybDogICdodHRwOi8vc3ZuLm1laWxpc2h1by5jb20vcmVwb3MvbWVpbGlzaHVvL2ZleC9ob3JuYmlsbF9uZXN0L3RydW5rLycsXG4gICAgZGlyOiAgRElSX05FU1Rcbn0sIHtcbiAgICBuYW1lOiAnQXBwcycsXG4gICAgdXJsOiAgJ2h0dHA6Ly9zdm4ubWVpbGlzaHVvLmNvbS9yZXBvcy9tZWlsaXNodW8vZmV4L3VzZXIvdHJ1bmsvJyxcbiAgICBkaXI6ICBESVJfQVBQU1xufSBdXG5cbmNsYXNzIFNldHVwIHtcbiAgICBpbml0KCBwYXRoICkge1xuICAgICAgICB0aGlzLl9wYXRoID0gcGF0aFxuICAgICAgICByZXR1cm4gRlMubWtkaXJBc3luYyggcGF0aCApXG4gICAgfVxuXG4gICAgYXN5bmMgY2hlY2tvdXRTb3VyY2UoIHVzZXJuYW1lLCBwYXNzd29yZCwgYXBwU3ZuVXJsICkge1xuICAgICAgICByZXR1cm4gYXdhaXQgUHJvbWlzZS5hbGwoIHBoYXNlcy5tYXAoIGFzeW5jIHBoYXNlT2JqID0+IHtcbiAgICAgICAgICAgIGxldCBuYW1lLCBwYXRoXG5cbiAgICAgICAgICAgIGlmICggYXBwU3ZuVXJsICYmIHBoYXNlT2JqLm5hbWUgPT0gJ0FwcHMnICkge1xuICAgICAgICAgICAgICAgIHBoYXNlT2JqLnVybCA9IGFwcFN2blVybFxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBuYW1lID0gcGhhc2VPYmoubmFtZVxuICAgICAgICAgICAgcGF0aCA9IHRoaXMuX3BhdGggKyBwaGFzZU9iai5kaXJcbiAgICAgICAgICAgIGxvZyggYFxcbuWIneWni+WMliAke25hbWV9IOaWh+S7tuWkuWAgKVxuICAgICAgICAgICAgYXdhaXQgRlMubWtkaXJBc3luYyggcGF0aCApXG5cbiAgICAgICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSggKCByZXNvbHZlLCByZWplY3QgKSA9PiB7XG4gICAgICAgICAgICAgICAgVXRpbC5pbmRpY2F0b3Iuc3RhcnQoKVxuXG4gICAgICAgICAgICAgICAgbGV0IGNoaWxkUHJvY2VzcyA9IFNWTi5jbyggcGhhc2VPYmoudXJsLCBwYXRoLCB7XG4gICAgICAgICAgICAgICAgICAgIHVzZXJuYW1lLCBwYXNzd29yZFxuICAgICAgICAgICAgICAgIH0sIGVyciA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlmICggIWVyciApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIFV0aWwuaW5kaWNhdG9yLnN0b3AoKVxuICAgICAgICAgICAgICAgICAgICAgICAgbG9nKCBgJHtuYW1lfSDorr7nva7miJDlip8hYCwgJ3N1Y2Nlc3MnIClcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUoKVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSApXG5cbiAgICAgICAgICAgICAgICBjaGlsZFByb2Nlc3Muc3RkZXJyLm9uKCAnZGF0YScsIGRhdGEgPT4ge1xuICAgICAgICAgICAgICAgICAgICBpZiAoICF0aGlzLmhhc0Vycm9yICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVqZWN0KClcbiAgICAgICAgICAgICAgICAgICAgICAgIGNoaWxkUHJvY2Vzcy5raWxsKClcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuaGFzRXJyb3IgPSB0cnVlXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmVycm9yKCBkYXRhLnRvU3RyaW5nKCkgKVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSApXG4gICAgICAgICAgICB9IClcbiAgICAgICAgfSApICkudGhlbiggYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgbG9nKCAn5Yib5bu6IHRtcCDmlofku7blpLknIClcbiAgICAgICAgICAgIGF3YWl0IEZTLm1rZGlyQXN5bmMoIHRoaXMuX3BhdGggKyBESVJfVE1QIClcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmluc3RhbGxEZXBlbmRlbmNpZXMoKVxuICAgICAgICB9IClcbiAgICB9XG5cbiAgICBhc3luYyBpbnN0YWxsRGVwZW5kZW5jaWVzKCkge1xuICAgICAgICBsZXQgZGVwdFBhdGggPSB0aGlzLl9wYXRoICsgRElSX05FU1RcblxuICAgICAgICBsb2coICflronoo4UgbGVzcyDkuI4gdWdsaWZ5LWpzJyApXG5cbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKCByZXNvbHZlID0+IHtcbiAgICAgICAgICAgIE5QTS5sb2FkKCB7fSwgZnVuY3Rpb24oIGVyciwgbnBtICkge1xuICAgICAgICAgICAgICAgIG5wbS5jb21tYW5kcy5pbnN0YWxsKCBkZXB0UGF0aCwgREVQRU5ERU5DSUVTLCAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGxvZyggJ1xcbuS+nei1luW6k+WuieijheaIkOWKnyEnLCAnc3VjY2VzcycgKVxuICAgICAgICAgICAgICAgICAgICBVdGlsLmluZGljYXRvci5zdG9wKClcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZSgpXG4gICAgICAgICAgICAgICAgfSApXG4gICAgICAgICAgICB9IClcbiAgICAgICAgfSApXG4gICAgfVxuXG4gICAgZXJyb3IoIG1zZyApIHtcbiAgICAgICAgVXRpbC5pbmRpY2F0b3Iuc3RvcCgpXG4gICAgICAgIGxvZyggJ+S4i+i9vea6kOeggeWksei0pe+8jOS7peS4i+S4uiBzdm4g5omT5Y2w55qE6ZSZ6K+v5raI5oGvJywgJ2Vycm9yJyApXG4gICAgICAgIGxvZyggbXNnIClcbiAgICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gU2V0dXBcbiJdfQ==