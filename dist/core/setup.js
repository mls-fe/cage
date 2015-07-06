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
            var phaseObj = phases.shift(),
                name = undefined,
                path = undefined;

            if (phaseObj) {
                name = phaseObj.name;
                path = this._path + phaseObj.dir;
                log('\n初始化 ' + name + ' 文件夹');
                Util.indicator.start();

                yield FS.mkdirAsync(path);
                yield SVN.coAsync(phaseObj.url, path, {
                    username: username, password: password
                });

                Util.indicator.stop();
                log(name + ' 设置成功!', 'success');
                return this.checkoutSource(username, password);
            } else {
                return this.installDependencies();
            }
        })
    }, {
        key: 'installDependencies',
        value: _bluebird.coroutine(function* () {
            var deptPath = this._path + DIR_NODEMODULES;
            yield FS.mkdirAsync(deptPath);

            return new Promise(function (resolve) {
                NPM.load({}, function (err, npm) {
                    npm.commands.install(deptPath, DEPENDENCIES, function () {
                        log('\n依赖库安装成功!', 'success');
                        resolve();
                    });
                });
            });
        })
    }]);

    return Setup;
})();

module.exports = Setup;
//# sourceMappingURL=data:application/json;base64,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LEVBQUUsQ0FBQTtxQkFDWixDQUFFLENBQUE7aUJBQ04sQ0FBRSxDQUFBO2FBQ04sQ0FBRSxDQUFBO1NBQ047OztXQXpDQyxLQUFLOzs7QUE0Q1gsTUFBTSxDQUFDLE9BQU8sR0FBRyxLQUFLLENBQUEiLCJmaWxlIjoiY29yZS9zZXR1cC5qcyIsInNvdXJjZXNDb250ZW50IjpbImxldCBQcm9taXNlID0gcmVxdWlyZSggJ2JsdWViaXJkJyApLFxuICAgIEZTICAgICAgPSBQcm9taXNlLnByb21pc2lmeUFsbCggcmVxdWlyZSggJ2ZzJyApICksXG4gICAgU1ZOICAgICA9IFByb21pc2UucHJvbWlzaWZ5QWxsKCByZXF1aXJlKCAnc3ZuLWludGVyZmFjZScgKSApLFxuICAgIE5QTSAgICAgPSByZXF1aXJlKCAnbnBtJyApLFxuICAgIFV0aWwgICAgPSByZXF1aXJlKCAnLi4vdXRpbCcgKVxuXG5jb25zdCBESVJfQVBQUyAgICAgICAgPSAnL2FwcHMnLFxuICAgICAgRElSX05FU1QgICAgICAgID0gJy9uZXN0JyxcbiAgICAgIERJUl9UTVAgICAgICAgICA9ICcvdG1wJyxcbiAgICAgIERJUl9OT0RFTU9EVUxFUyA9IERJUl9ORVNUICsgJy9ub2RlX21vZHVsZXMnLFxuICAgICAgREVQRU5ERU5DSUVTICAgID0gWyAnbGVzc0AxLjMuMycsICd1Z2xpZnktanNAMS4yLjYnIF1cblxubGV0IHBoYXNlcyA9IFsge1xuICAgIG5hbWU6ICdOZXN0JyxcbiAgICB1cmw6ICdodHRwOi8vc3ZuLm1laWxpc2h1by5jb20vcmVwb3MvbWVpbGlzaHVvL2ZleC9ob3JuYmlsbF9uZXN0L3RydW5rLycsXG4gICAgZGlyOiBESVJfTkVTVFxufSwge1xuICAgIG5hbWU6ICdBcHBzJyxcbiAgICB1cmw6ICdodHRwOi8vc3ZuLm1laWxpc2h1by5jb20vcmVwb3MvbWVpbGlzaHVvL2ZleC91c2VyL3RydW5rLycsXG4gICAgZGlyOiBESVJfQVBQU1xufSBdXG5cbmNsYXNzIFNldHVwIHtcbiAgICBpbml0KCBwYXRoICkge1xuICAgICAgICB0aGlzLl9wYXRoID0gcGF0aFxuICAgICAgICByZXR1cm4gRlMubWtkaXJBc3luYyggcGF0aCApXG4gICAgfVxuXG4gICAgYXN5bmMgY2hlY2tvdXRTb3VyY2UoIHVzZXJuYW1lLCBwYXNzd29yZCApIHtcbiAgICAgICAgbGV0IHBoYXNlT2JqID0gcGhhc2VzLnNoaWZ0KCksXG4gICAgICAgICAgICBuYW1lLCBwYXRoXG5cbiAgICAgICAgaWYgKCBwaGFzZU9iaiApIHtcbiAgICAgICAgICAgIG5hbWUgPSBwaGFzZU9iai5uYW1lXG4gICAgICAgICAgICBwYXRoID0gdGhpcy5fcGF0aCArIHBoYXNlT2JqLmRpclxuICAgICAgICAgICAgbG9nKCBgXFxu5Yid5aeL5YyWICR7bmFtZX0g5paH5Lu25aS5YCApXG4gICAgICAgICAgICBVdGlsLmluZGljYXRvci5zdGFydCgpXG5cbiAgICAgICAgICAgIGF3YWl0IEZTLm1rZGlyQXN5bmMoIHBhdGggKVxuICAgICAgICAgICAgYXdhaXQgU1ZOLmNvQXN5bmMoIHBoYXNlT2JqLnVybCwgcGF0aCwge1xuICAgICAgICAgICAgICAgIHVzZXJuYW1lLCBwYXNzd29yZFxuICAgICAgICAgICAgfSApXG5cbiAgICAgICAgICAgIFV0aWwuaW5kaWNhdG9yLnN0b3AoKVxuICAgICAgICAgICAgbG9nKCBgJHtuYW1lfSDorr7nva7miJDlip8hYCwgJ3N1Y2Nlc3MnIClcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmNoZWNrb3V0U291cmNlKCB1c2VybmFtZSwgcGFzc3dvcmQgKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuaW5zdGFsbERlcGVuZGVuY2llcygpXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBhc3luYyBpbnN0YWxsRGVwZW5kZW5jaWVzKCkge1xuICAgICAgICBsZXQgZGVwdFBhdGggPSB0aGlzLl9wYXRoICsgRElSX05PREVNT0RVTEVTXG4gICAgICAgIGF3YWl0IEZTLm1rZGlyQXN5bmMoIGRlcHRQYXRoIClcblxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoIHJlc29sdmUgPT4ge1xuICAgICAgICAgICAgTlBNLmxvYWQoIHt9LCBmdW5jdGlvbiggZXJyLCBucG0gKSB7XG4gICAgICAgICAgICAgICAgbnBtLmNvbW1hbmRzLmluc3RhbGwoIGRlcHRQYXRoLCBERVBFTkRFTkNJRVMsICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgbG9nKCAnXFxu5L6d6LWW5bqT5a6J6KOF5oiQ5YqfIScsICdzdWNjZXNzJyApXG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUoKVxuICAgICAgICAgICAgICAgIH0gKVxuICAgICAgICAgICAgfSApXG4gICAgICAgIH0gKVxuICAgIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBTZXR1cFxuIl19