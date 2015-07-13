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

            yield Promise.all(phases.map(_bluebird.coroutine(function* (phaseObj) {
                var name = undefined,
                    path = undefined;

                name = phaseObj.name;
                path = _this._path + phaseObj.dir;
                log('\n初始化 ' + name + ' 文件夹');
                Util.indicator.start();

                yield FS.mkdirAsync(path);

                new Promise(function (resolve, reject) {
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

            yield FS.mkdirAsync(this._path + DIR_TMP);

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
//# sourceMappingURL=data:application/json;base64,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LEVBQUUsQ0FBQyxVQUFVLENBQUUsSUFBSSxDQUFDLEtBQUssR0FBRyxPQUFPLENBQUUsQ0FBQTs7QUFFM0MsbUJBQU8sSUFBSSxDQUFDLG1CQUFtQixFQUFFLENBQUE7U0FDcEM7OzttQ0FFd0IsYUFBRztBQUN4QixnQkFBSSxRQUFRLEdBQUcsSUFBSSxDQUFDLEtBQUssR0FBRyxRQUFRLENBQUE7O0FBRXBDLG1CQUFPLElBQUksT0FBTyxDQUFFLFVBQUEsT0FBTyxFQUFJO0FBQzNCLG1CQUFHLENBQUMsSUFBSSxDQUFFLEVBQUUsRUFBRSxVQUFVLEdBQUcsRUFBRSxHQUFHLEVBQUc7QUFDL0IsdUJBQUcsQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFFLFFBQVEsRUFBRSxZQUFZLEVBQUUsWUFBTTtBQUNoRCwyQkFBRyxDQUFFLFlBQVksRUFBRSxTQUFTLENBQUUsQ0FBQTtBQUM5QiwrQkFBTyxFQUFFLENBQUE7cUJBQ1osQ0FBRSxDQUFBO2lCQUNOLENBQUUsQ0FBQTthQUNOLENBQUUsQ0FBQTtTQUNOOzs7ZUFFSSxlQUFFLEdBQUcsRUFBRztBQUNULGdCQUFJLENBQUMsU0FBUyxDQUFDLElBQUksRUFBRSxDQUFBO0FBQ3JCLGVBQUcsQ0FBRSx3QkFBd0IsRUFBRSxPQUFPLENBQUUsQ0FBQTtBQUN4QyxlQUFHLENBQUUsR0FBRyxDQUFFLENBQUE7U0FDYjs7O1dBN0RDLEtBQUs7OztBQWdFWCxNQUFNLENBQUMsT0FBTyxHQUFHLEtBQUssQ0FBQSIsImZpbGUiOiJjb3JlL3NldHVwLmpzIiwic291cmNlc0NvbnRlbnQiOlsibGV0IFByb21pc2UgPSByZXF1aXJlKCAnYmx1ZWJpcmQnICksXG4gICAgRlMgICAgICA9IFByb21pc2UucHJvbWlzaWZ5QWxsKCByZXF1aXJlKCAnZnMnICkgKSxcbiAgICBTVk4gICAgID0gUHJvbWlzZS5wcm9taXNpZnlBbGwoIHJlcXVpcmUoICdzdm4taW50ZXJmYWNlJyApICksXG4gICAgTlBNICAgICA9IHJlcXVpcmUoICducG0nICksXG4gICAgVXRpbCAgICA9IHJlcXVpcmUoICcuLi91dGlsJyApXG5cbmNvbnN0IERJUl9BUFBTICAgICAgICA9ICcvYXBwcycsXG4gICAgICBESVJfTkVTVCAgICAgICAgPSAnL25lc3QnLFxuICAgICAgRElSX1RNUCAgICAgICAgID0gYCR7RElSX05FU1R9L3RtcGAsXG4gICAgICBESVJfTk9ERU1PRFVMRVMgPSBESVJfTkVTVCArICcvbm9kZV9tb2R1bGVzJyxcbiAgICAgIERFUEVOREVOQ0lFUyAgICA9IFsgJ2xlc3NAMS4zLjMnLCAndWdsaWZ5LWpzQDEuMi42JyBdXG5cbmxldCBwaGFzZXMgPSBbIHtcbiAgICBuYW1lOiAnTmVzdCcsXG4gICAgdXJsOiAnaHR0cDovL3N2bi5tZWlsaXNodW8uY29tL3JlcG9zL21laWxpc2h1by9mZXgvaG9ybmJpbGxfbmVzdC90cnVuay8nLFxuICAgIGRpcjogRElSX05FU1Rcbn0sIHtcbiAgICBuYW1lOiAnQXBwcycsXG4gICAgdXJsOiAnaHR0cDovL3N2bi5tZWlsaXNodW8uY29tL3JlcG9zL21laWxpc2h1by9mZXgvdXNlci90cnVuay8nLFxuICAgIGRpcjogRElSX0FQUFNcbn0gXVxuXG5jbGFzcyBTZXR1cCB7XG4gICAgaW5pdCggcGF0aCApIHtcbiAgICAgICAgdGhpcy5fcGF0aCA9IHBhdGhcbiAgICAgICAgcmV0dXJuIEZTLm1rZGlyQXN5bmMoIHBhdGggKVxuICAgIH1cblxuICAgIGFzeW5jIGNoZWNrb3V0U291cmNlKCB1c2VybmFtZSwgcGFzc3dvcmQgKSB7XG4gICAgICAgIGF3YWl0IFByb21pc2UuYWxsKCBwaGFzZXMubWFwKCBhc3luYyBwaGFzZU9iaiA9PiB7XG4gICAgICAgICAgICBsZXQgbmFtZSwgcGF0aFxuXG4gICAgICAgICAgICBuYW1lID0gcGhhc2VPYmoubmFtZVxuICAgICAgICAgICAgcGF0aCA9IHRoaXMuX3BhdGggKyBwaGFzZU9iai5kaXJcbiAgICAgICAgICAgIGxvZyggYFxcbuWIneWni+WMliAke25hbWV9IOaWh+S7tuWkuWAgKVxuICAgICAgICAgICAgVXRpbC5pbmRpY2F0b3Iuc3RhcnQoKVxuXG4gICAgICAgICAgICBhd2FpdCBGUy5ta2RpckFzeW5jKCBwYXRoIClcblxuICAgICAgICAgICAgbmV3IFByb21pc2UoICggcmVzb2x2ZSwgcmVqZWN0ICkgPT4ge1xuICAgICAgICAgICAgICAgIGxldCBjaGlsZFByb2Nlc3MgPSBTVk4uY28oIHBoYXNlT2JqLnVybCwgcGF0aCwge1xuICAgICAgICAgICAgICAgICAgICB1c2VybmFtZSwgcGFzc3dvcmRcbiAgICAgICAgICAgICAgICB9LCBlcnIgPT4ge1xuICAgICAgICAgICAgICAgICAgICBpZiAoICFlcnIgKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBVdGlsLmluZGljYXRvci5zdG9wKClcbiAgICAgICAgICAgICAgICAgICAgICAgIGxvZyggYCR7bmFtZX0g6K6+572u5oiQ5YqfIWAsICdzdWNjZXNzJyApXG4gICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKClcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gKVxuXG4gICAgICAgICAgICAgICAgY2hpbGRQcm9jZXNzLnN0ZGVyci5vbiggJ2RhdGEnLCBkYXRhID0+IHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCAhdGhpcy5oYXNFcnJvciApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlamVjdCgpXG4gICAgICAgICAgICAgICAgICAgICAgICBjaGlsZFByb2Nlc3Mua2lsbCgpXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmhhc0Vycm9yID0gdHJ1ZVxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5lcnJvciggZGF0YS50b1N0cmluZygpIClcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gKVxuICAgICAgICAgICAgfSApXG4gICAgICAgIH0gKSApXG5cbiAgICAgICAgYXdhaXQgRlMubWtkaXJBc3luYyggdGhpcy5fcGF0aCArIERJUl9UTVAgKVxuXG4gICAgICAgIHJldHVybiB0aGlzLmluc3RhbGxEZXBlbmRlbmNpZXMoKVxuICAgIH1cblxuICAgIGFzeW5jIGluc3RhbGxEZXBlbmRlbmNpZXMoKSB7XG4gICAgICAgIGxldCBkZXB0UGF0aCA9IHRoaXMuX3BhdGggKyBESVJfTkVTVFxuXG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSggcmVzb2x2ZSA9PiB7XG4gICAgICAgICAgICBOUE0ubG9hZCgge30sIGZ1bmN0aW9uKCBlcnIsIG5wbSApIHtcbiAgICAgICAgICAgICAgICBucG0uY29tbWFuZHMuaW5zdGFsbCggZGVwdFBhdGgsIERFUEVOREVOQ0lFUywgKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBsb2coICdcXG7kvp3otZblupPlronoo4XmiJDlip8hJywgJ3N1Y2Nlc3MnIClcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZSgpXG4gICAgICAgICAgICAgICAgfSApXG4gICAgICAgICAgICB9IClcbiAgICAgICAgfSApXG4gICAgfVxuXG4gICAgZXJyb3IoIG1zZyApIHtcbiAgICAgICAgVXRpbC5pbmRpY2F0b3Iuc3RvcCgpXG4gICAgICAgIGxvZyggJ+S4i+i9vea6kOeggeWksei0pe+8jOS7peS4i+S4uiBzdm4g5omT5Y2w55qE6ZSZ6K+v5raI5oGvJywgJ2Vycm9yJyApXG4gICAgICAgIGxvZyggbXNnIClcbiAgICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gU2V0dXBcbiJdfQ==