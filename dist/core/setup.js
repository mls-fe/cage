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
        value: _bluebird.coroutine(function* (username, password) {
            var _this = this;

            return yield Promise.all(phases.map(_bluebird.coroutine(function* (phaseObj) {
                var name = undefined,
                    path = undefined;

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
//# sourceMappingURL=data:application/json;base64,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QUFJLHFCQUFFLGFBQVk7QUFDcEIsbUJBQUcsQ0FBRSxZQUFZLENBQUUsQ0FBQTtBQUNuQixzQkFBTSxFQUFFLENBQUMsVUFBVSxDQUFFLE1BQUssS0FBSyxHQUFHLE9BQU8sQ0FBRSxDQUFBO0FBQzNDLHVCQUFPLE1BQUssbUJBQW1CLEVBQUUsQ0FBQTthQUNwQyxFQUFFLENBQUE7U0FDTjs7O21DQUV3QixhQUFHO0FBQ3hCLGdCQUFJLFFBQVEsR0FBRyxJQUFJLENBQUMsS0FBSyxHQUFHLFFBQVEsQ0FBQTs7QUFFcEMsbUJBQU8sSUFBSSxPQUFPLENBQUUsVUFBQSxPQUFPLEVBQUk7QUFDM0IsbUJBQUcsQ0FBQyxJQUFJLENBQUUsRUFBRSxFQUFFLFVBQVUsR0FBRyxFQUFFLEdBQUcsRUFBRztBQUMvQix1QkFBRyxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUUsUUFBUSxFQUFFLFlBQVksRUFBRSxZQUFNO0FBQ2hELDJCQUFHLENBQUUsWUFBWSxFQUFFLFNBQVMsQ0FBRSxDQUFBO0FBQzlCLDRCQUFJLENBQUMsU0FBUyxDQUFDLElBQUksRUFBRSxDQUFBO0FBQ3JCLCtCQUFPLEVBQUUsQ0FBQTtxQkFDWixDQUFFLENBQUE7aUJBQ04sQ0FBRSxDQUFBO2FBQ04sQ0FBRSxDQUFBO1NBQ047OztlQUVJLGVBQUUsR0FBRyxFQUFHO0FBQ1QsZ0JBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxFQUFFLENBQUE7QUFDckIsZUFBRyxDQUFFLHdCQUF3QixFQUFFLE9BQU8sQ0FBRSxDQUFBO0FBQ3hDLGVBQUcsQ0FBRSxHQUFHLENBQUUsQ0FBQTtTQUNiOzs7V0E5REMsS0FBSzs7O0FBaUVYLE1BQU0sQ0FBQyxPQUFPLEdBQUcsS0FBSyxDQUFBIiwiZmlsZSI6ImNvcmUvc2V0dXAuanMiLCJzb3VyY2VzQ29udGVudCI6WyJsZXQgUHJvbWlzZSA9IHJlcXVpcmUoICdibHVlYmlyZCcgKSxcbiAgICBGUyAgICAgID0gUHJvbWlzZS5wcm9taXNpZnlBbGwoIHJlcXVpcmUoICdmcycgKSApLFxuICAgIFNWTiAgICAgPSBQcm9taXNlLnByb21pc2lmeUFsbCggcmVxdWlyZSggJ3N2bi1pbnRlcmZhY2UnICkgKSxcbiAgICBOUE0gICAgID0gcmVxdWlyZSggJ25wbScgKSxcbiAgICBVdGlsICAgID0gcmVxdWlyZSggJy4uL3V0aWwnIClcblxuY29uc3QgRElSX0FQUFMgICAgICAgID0gJy9hcHBzJyxcbiAgICAgIERJUl9ORVNUICAgICAgICA9ICcvbmVzdCcsXG4gICAgICBESVJfVE1QICAgICAgICAgPSBgJHtESVJfTkVTVH0vdG1wYCxcbiAgICAgIERJUl9OT0RFTU9EVUxFUyA9IERJUl9ORVNUICsgJy9ub2RlX21vZHVsZXMnLFxuICAgICAgREVQRU5ERU5DSUVTICAgID0gWyAnbGVzc0AxLjMuMycsICd1Z2xpZnktanNAMS4yLjYnIF1cblxubGV0IHBoYXNlcyA9IFsge1xuICAgIG5hbWU6ICdOZXN0JyxcbiAgICB1cmw6ICdodHRwOi8vc3ZuLm1laWxpc2h1by5jb20vcmVwb3MvbWVpbGlzaHVvL2ZleC9ob3JuYmlsbF9uZXN0L3RydW5rLycsXG4gICAgZGlyOiBESVJfTkVTVFxufSwge1xuICAgIG5hbWU6ICdBcHBzJyxcbiAgICB1cmw6ICdodHRwOi8vc3ZuLm1laWxpc2h1by5jb20vcmVwb3MvbWVpbGlzaHVvL2ZleC91c2VyL3RydW5rLycsXG4gICAgZGlyOiBESVJfQVBQU1xufSBdXG5cbmNsYXNzIFNldHVwIHtcbiAgICBpbml0KCBwYXRoICkge1xuICAgICAgICB0aGlzLl9wYXRoID0gcGF0aFxuICAgICAgICByZXR1cm4gRlMubWtkaXJBc3luYyggcGF0aCApXG4gICAgfVxuXG4gICAgYXN5bmMgY2hlY2tvdXRTb3VyY2UoIHVzZXJuYW1lLCBwYXNzd29yZCApIHtcbiAgICAgICAgcmV0dXJuIGF3YWl0IFByb21pc2UuYWxsKCBwaGFzZXMubWFwKCBhc3luYyBwaGFzZU9iaiA9PiB7XG4gICAgICAgICAgICBsZXQgbmFtZSwgcGF0aFxuXG4gICAgICAgICAgICBuYW1lID0gcGhhc2VPYmoubmFtZVxuICAgICAgICAgICAgcGF0aCA9IHRoaXMuX3BhdGggKyBwaGFzZU9iai5kaXJcbiAgICAgICAgICAgIGxvZyggYFxcbuWIneWni+WMliAke25hbWV9IOaWh+S7tuWkuWAgKVxuICAgICAgICAgICAgYXdhaXQgRlMubWtkaXJBc3luYyggcGF0aCApXG5cbiAgICAgICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSggKCByZXNvbHZlLCByZWplY3QgKSA9PiB7XG4gICAgICAgICAgICAgICAgVXRpbC5pbmRpY2F0b3Iuc3RhcnQoKVxuXG4gICAgICAgICAgICAgICAgbGV0IGNoaWxkUHJvY2VzcyA9IFNWTi5jbyggcGhhc2VPYmoudXJsLCBwYXRoLCB7XG4gICAgICAgICAgICAgICAgICAgIHVzZXJuYW1lLCBwYXNzd29yZFxuICAgICAgICAgICAgICAgIH0sIGVyciA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlmICggIWVyciApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIFV0aWwuaW5kaWNhdG9yLnN0b3AoKVxuICAgICAgICAgICAgICAgICAgICAgICAgbG9nKCBgJHtuYW1lfSDorr7nva7miJDlip8hYCwgJ3N1Y2Nlc3MnIClcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUoKVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSApXG5cbiAgICAgICAgICAgICAgICBjaGlsZFByb2Nlc3Muc3RkZXJyLm9uKCAnZGF0YScsIGRhdGEgPT4ge1xuICAgICAgICAgICAgICAgICAgICBpZiAoICF0aGlzLmhhc0Vycm9yICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVqZWN0KClcbiAgICAgICAgICAgICAgICAgICAgICAgIGNoaWxkUHJvY2Vzcy5raWxsKClcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuaGFzRXJyb3IgPSB0cnVlXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmVycm9yKCBkYXRhLnRvU3RyaW5nKCkgKVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSApXG4gICAgICAgICAgICB9IClcbiAgICAgICAgfSApICkudGhlbiggYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgbG9nKCAn5Yib5bu6IHRtcCDmlofku7blpLknIClcbiAgICAgICAgICAgIGF3YWl0IEZTLm1rZGlyQXN5bmMoIHRoaXMuX3BhdGggKyBESVJfVE1QIClcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmluc3RhbGxEZXBlbmRlbmNpZXMoKVxuICAgICAgICB9IClcbiAgICB9XG5cbiAgICBhc3luYyBpbnN0YWxsRGVwZW5kZW5jaWVzKCkge1xuICAgICAgICBsZXQgZGVwdFBhdGggPSB0aGlzLl9wYXRoICsgRElSX05FU1RcblxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoIHJlc29sdmUgPT4ge1xuICAgICAgICAgICAgTlBNLmxvYWQoIHt9LCBmdW5jdGlvbiggZXJyLCBucG0gKSB7XG4gICAgICAgICAgICAgICAgbnBtLmNvbW1hbmRzLmluc3RhbGwoIGRlcHRQYXRoLCBERVBFTkRFTkNJRVMsICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgbG9nKCAnXFxu5L6d6LWW5bqT5a6J6KOF5oiQ5YqfIScsICdzdWNjZXNzJyApXG4gICAgICAgICAgICAgICAgICAgIFV0aWwuaW5kaWNhdG9yLnN0b3AoKVxuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKClcbiAgICAgICAgICAgICAgICB9IClcbiAgICAgICAgICAgIH0gKVxuICAgICAgICB9IClcbiAgICB9XG5cbiAgICBlcnJvciggbXNnICkge1xuICAgICAgICBVdGlsLmluZGljYXRvci5zdG9wKClcbiAgICAgICAgbG9nKCAn5LiL6L295rqQ56CB5aSx6LSl77yM5Lul5LiL5Li6IHN2biDmiZPljbDnmoTplJnor6/mtojmga8nLCAnZXJyb3InIClcbiAgICAgICAgbG9nKCBtc2cgKVxuICAgIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBTZXR1cFxuIl19