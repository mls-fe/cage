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
    DIR_TMP = '/tmp',
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
        value: _bluebird.coroutine(function* (username, password) {
            var _this = this;

            yield Promise.all(phases.map(_bluebird.coroutine(function* (phaseObj) {
                var name = undefined,
                    path = undefined;

                name = phaseObj.name;
                path = _this._path + phaseObj.dir;
                log('\n初始化 ' + name + ' 文件夹');
                Util.indicator.start();

                yield FS.mkdirAsync(path);

                return new Promise(function (resolve, reject) {
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
            })));

            return this.installDependencies();
        })
    }, {
        key: 'installDependencies',
        value: _bluebird.coroutine(function* () {
            var deptPath = this._path + DIR_NEST;

            return new Promise(function (resolve) {
                NPM.load({}, function (err, npm) {
                    npm.commands.install(deptPath, DEPENDENCIES, function () {
                        log('\n依赖库安装成功!', 'success');
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
//# sourceMappingURL=data:application/json;base64,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LElBQUksQ0FBQyxtQkFBbUIsRUFBRSxDQUFBO1NBQ3BDOzs7bUNBRXdCLGFBQUc7QUFDeEIsZ0JBQUksUUFBUSxHQUFHLElBQUksQ0FBQyxLQUFLLEdBQUcsUUFBUSxDQUFBOztBQUVwQyxtQkFBTyxJQUFJLE9BQU8sQ0FBRSxVQUFBLE9BQU8sRUFBSTtBQUMzQixtQkFBRyxDQUFDLElBQUksQ0FBRSxFQUFFLEVBQUUsVUFBVSxHQUFHLEVBQUUsR0FBRyxFQUFHO0FBQy9CLHVCQUFHLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBRSxRQUFRLEVBQUUsWUFBWSxFQUFFLFlBQU07QUFDaEQsMkJBQUcsQ0FBRSxZQUFZLEVBQUUsU0FBUyxDQUFFLENBQUE7QUFDOUIsK0JBQU8sRUFBRSxDQUFBO3FCQUNaLENBQUUsQ0FBQTtpQkFDTixDQUFFLENBQUE7YUFDTixDQUFFLENBQUE7U0FDTjs7O2VBRUksZUFBRSxHQUFHLEVBQUc7QUFDVCxnQkFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLEVBQUUsQ0FBQTtBQUNyQixlQUFHLENBQUUsd0JBQXdCLEVBQUUsT0FBTyxDQUFFLENBQUE7QUFDeEMsZUFBRyxDQUFFLEdBQUcsQ0FBRSxDQUFBO1NBQ2I7OztXQTNEQyxLQUFLOzs7QUE4RFgsTUFBTSxDQUFDLE9BQU8sR0FBRyxLQUFLLENBQUEiLCJmaWxlIjoiY29yZS9zZXR1cC5qcyIsInNvdXJjZXNDb250ZW50IjpbImxldCBQcm9taXNlID0gcmVxdWlyZSggJ2JsdWViaXJkJyApLFxuICAgIEZTICAgICAgPSBQcm9taXNlLnByb21pc2lmeUFsbCggcmVxdWlyZSggJ2ZzJyApICksXG4gICAgU1ZOICAgICA9IFByb21pc2UucHJvbWlzaWZ5QWxsKCByZXF1aXJlKCAnc3ZuLWludGVyZmFjZScgKSApLFxuICAgIE5QTSAgICAgPSByZXF1aXJlKCAnbnBtJyApLFxuICAgIFV0aWwgICAgPSByZXF1aXJlKCAnLi4vdXRpbCcgKVxuXG5jb25zdCBESVJfQVBQUyAgICAgICAgPSAnL2FwcHMnLFxuICAgICAgRElSX05FU1QgICAgICAgID0gJy9uZXN0JyxcbiAgICAgIERJUl9UTVAgICAgICAgICA9ICcvdG1wJyxcbiAgICAgIERJUl9OT0RFTU9EVUxFUyA9IERJUl9ORVNUICsgJy9ub2RlX21vZHVsZXMnLFxuICAgICAgREVQRU5ERU5DSUVTICAgID0gWyAnbGVzc0AxLjMuMycsICd1Z2xpZnktanNAMS4yLjYnIF1cblxubGV0IHBoYXNlcyA9IFsge1xuICAgIG5hbWU6ICdOZXN0JyxcbiAgICB1cmw6ICdodHRwOi8vc3ZuLm1laWxpc2h1by5jb20vcmVwb3MvbWVpbGlzaHVvL2ZleC9ob3JuYmlsbF9uZXN0L3RydW5rLycsXG4gICAgZGlyOiBESVJfTkVTVFxufSwge1xuICAgIG5hbWU6ICdBcHBzJyxcbiAgICB1cmw6ICdodHRwOi8vc3ZuLm1laWxpc2h1by5jb20vcmVwb3MvbWVpbGlzaHVvL2ZleC91c2VyL3RydW5rLycsXG4gICAgZGlyOiBESVJfQVBQU1xufSBdXG5cbmNsYXNzIFNldHVwIHtcbiAgICBpbml0KCBwYXRoICkge1xuICAgICAgICB0aGlzLl9wYXRoID0gcGF0aFxuICAgICAgICByZXR1cm4gRlMubWtkaXJBc3luYyggcGF0aCApXG4gICAgfVxuXG4gICAgYXN5bmMgY2hlY2tvdXRTb3VyY2UoIHVzZXJuYW1lLCBwYXNzd29yZCApIHtcbiAgICAgICAgYXdhaXQgUHJvbWlzZS5hbGwoIHBoYXNlcy5tYXAoIGFzeW5jIHBoYXNlT2JqID0+IHtcbiAgICAgICAgICAgIGxldCBuYW1lLCBwYXRoXG5cbiAgICAgICAgICAgIG5hbWUgPSBwaGFzZU9iai5uYW1lXG4gICAgICAgICAgICBwYXRoID0gdGhpcy5fcGF0aCArIHBoYXNlT2JqLmRpclxuICAgICAgICAgICAgbG9nKCBgXFxu5Yid5aeL5YyWICR7bmFtZX0g5paH5Lu25aS5YCApXG4gICAgICAgICAgICBVdGlsLmluZGljYXRvci5zdGFydCgpXG5cbiAgICAgICAgICAgIGF3YWl0IEZTLm1rZGlyQXN5bmMoIHBhdGggKVxuXG4gICAgICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoICggcmVzb2x2ZSwgcmVqZWN0ICkgPT4ge1xuICAgICAgICAgICAgICAgIGxldCBjaGlsZFByb2Nlc3MgPSBTVk4uY28oIHBoYXNlT2JqLnVybCwgcGF0aCwge1xuICAgICAgICAgICAgICAgICAgICB1c2VybmFtZSwgcGFzc3dvcmRcbiAgICAgICAgICAgICAgICB9LCBlcnIgPT4ge1xuICAgICAgICAgICAgICAgICAgICBpZiAoICFlcnIgKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBVdGlsLmluZGljYXRvci5zdG9wKClcbiAgICAgICAgICAgICAgICAgICAgICAgIGxvZyggYCR7bmFtZX0g6K6+572u5oiQ5YqfIWAsICdzdWNjZXNzJyApXG4gICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKClcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gKVxuXG4gICAgICAgICAgICAgICAgY2hpbGRQcm9jZXNzLnN0ZGVyci5vbiggJ2RhdGEnLCBkYXRhID0+IHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCAhdGhpcy5oYXNFcnJvciApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlamVjdCgpXG4gICAgICAgICAgICAgICAgICAgICAgICBjaGlsZFByb2Nlc3Mua2lsbCgpXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmhhc0Vycm9yID0gdHJ1ZVxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5lcnJvciggZGF0YS50b1N0cmluZygpIClcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gKVxuICAgICAgICAgICAgfSApXG4gICAgICAgIH0gKSApXG5cbiAgICAgICAgcmV0dXJuIHRoaXMuaW5zdGFsbERlcGVuZGVuY2llcygpXG4gICAgfVxuXG4gICAgYXN5bmMgaW5zdGFsbERlcGVuZGVuY2llcygpIHtcbiAgICAgICAgbGV0IGRlcHRQYXRoID0gdGhpcy5fcGF0aCArIERJUl9ORVNUXG5cbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKCByZXNvbHZlID0+IHtcbiAgICAgICAgICAgIE5QTS5sb2FkKCB7fSwgZnVuY3Rpb24oIGVyciwgbnBtICkge1xuICAgICAgICAgICAgICAgIG5wbS5jb21tYW5kcy5pbnN0YWxsKCBkZXB0UGF0aCwgREVQRU5ERU5DSUVTLCAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGxvZyggJ1xcbuS+nei1luW6k+WuieijheaIkOWKnyEnLCAnc3VjY2VzcycgKVxuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKClcbiAgICAgICAgICAgICAgICB9IClcbiAgICAgICAgICAgIH0gKVxuICAgICAgICB9IClcbiAgICB9XG5cbiAgICBlcnJvciggbXNnICkge1xuICAgICAgICBVdGlsLmluZGljYXRvci5zdG9wKClcbiAgICAgICAgbG9nKCAn5LiL6L295rqQ56CB5aSx6LSl77yM5Lul5LiL5Li6IHN2biDmiZPljbDnmoTplJnor6/mtojmga8nLCAnZXJyb3InIClcbiAgICAgICAgbG9nKCBtc2cgKVxuICAgIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBTZXR1cFxuIl19