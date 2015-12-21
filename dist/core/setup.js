'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _bluebird = require('bluebird');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

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
        value: (function () {
            var ref = (0, _bluebird.coroutine)(regeneratorRuntime.mark(function _callee3(username, password, appSvnUrl) {
                var _this2 = this;

                return regeneratorRuntime.wrap(function _callee3$(_context3) {
                    while (1) {
                        switch (_context3.prev = _context3.next) {
                            case 0:
                                _context3.next = 2;
                                return Promise.all(phases.map((function () {
                                    var _this = this;

                                    var ref = (0, _bluebird.coroutine)(regeneratorRuntime.mark(function _callee(phaseObj) {
                                        var name, path;
                                        return regeneratorRuntime.wrap(function _callee$(_context) {
                                            while (1) {
                                                switch (_context.prev = _context.next) {
                                                    case 0:
                                                        name = undefined, path = undefined;

                                                        if (appSvnUrl && phaseObj.name == 'Apps') {
                                                            phaseObj.url = appSvnUrl;
                                                        }

                                                        name = phaseObj.name;
                                                        path = _this._path + phaseObj.dir;
                                                        log('\n初始化 ' + name + ' 文件夹');
                                                        _context.next = 7;
                                                        return FS.mkdirAsync(path);

                                                    case 7:
                                                        return _context.abrupt('return', new Promise(function (resolve, reject) {
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
                                                        }));

                                                    case 8:
                                                    case 'end':
                                                        return _context.stop();
                                                }
                                            }
                                        }, _callee, _this);
                                    }));
                                    return function (_x4) {
                                        return ref.apply(this, arguments);
                                    };
                                })())).then((0, _bluebird.coroutine)(regeneratorRuntime.mark(function _callee2() {
                                    return regeneratorRuntime.wrap(function _callee2$(_context2) {
                                        while (1) {
                                            switch (_context2.prev = _context2.next) {
                                                case 0:
                                                    log('创建 tmp 文件夹');
                                                    _context2.next = 3;
                                                    return FS.mkdirAsync(_this2._path + DIR_TMP);

                                                case 3:
                                                    return _context2.abrupt('return', _this2.installDependencies());

                                                case 4:
                                                case 'end':
                                                    return _context2.stop();
                                            }
                                        }
                                    }, _callee2, _this2);
                                })));

                            case 2:
                                return _context3.abrupt('return', _context3.sent);

                            case 3:
                            case 'end':
                                return _context3.stop();
                        }
                    }
                }, _callee3, this);
            }));
            return function checkoutSource(_x, _x2, _x3) {
                return ref.apply(this, arguments);
            };
        })()
    }, {
        key: 'installDependencies',
        value: (function () {
            var ref = (0, _bluebird.coroutine)(regeneratorRuntime.mark(function _callee4() {
                var deptPath;
                return regeneratorRuntime.wrap(function _callee4$(_context4) {
                    while (1) {
                        switch (_context4.prev = _context4.next) {
                            case 0:
                                deptPath = this._path + DIR_NEST;

                                log('安装 less 与 uglify-js');

                                return _context4.abrupt('return', new Promise(function (resolve) {
                                    NPM.load({}, function (err, npm) {
                                        npm.commands.install(deptPath, DEPENDENCIES, function () {
                                            log('\n依赖库安装成功!', 'success');
                                            Util.indicator.stop();
                                            resolve();
                                        });
                                    });
                                }));

                            case 3:
                            case 'end':
                                return _context4.stop();
                        }
                    }
                }, _callee4, this);
            }));
            return function installDependencies() {
                return ref.apply(this, arguments);
            };
        })()
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
//# sourceMappingURL=data:application/json;base64,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c2UgPSByZXF1aXJlKCAnYmx1ZWJpcmQnICksXG4gICAgRlMgICAgICA9IFByb21pc2UucHJvbWlzaWZ5QWxsKCByZXF1aXJlKCAnZnMnICkgKSxcbiAgICBTVk4gICAgID0gUHJvbWlzZS5wcm9taXNpZnlBbGwoIHJlcXVpcmUoICdzdm4taW50ZXJmYWNlJyApICksXG4gICAgTlBNICAgICA9IHJlcXVpcmUoICducG0nICksXG4gICAgVXRpbCAgICA9IHJlcXVpcmUoICcuLi91dGlsJyApXG5cbmNvbnN0IERJUl9BUFBTICAgICAgICA9ICcvYXBwcycsXG4gICAgICBESVJfTkVTVCAgICAgICAgPSAnL25lc3QnLFxuICAgICAgRElSX1RNUCAgICAgICAgID0gYCR7RElSX05FU1R9L3RtcGAsXG4gICAgICBESVJfTk9ERU1PRFVMRVMgPSBESVJfTkVTVCArICcvbm9kZV9tb2R1bGVzJyxcbiAgICAgIERFUEVOREVOQ0lFUyAgICA9IFsgJ2xlc3NAMS4zLjMnLCAndWdsaWZ5LWpzQDEuMi42JyBdXG5cbmxldCBwaGFzZXMgPSBbIHtcbiAgICBuYW1lOiAnTmVzdCcsXG4gICAgdXJsOiAgJ2h0dHA6Ly9zdm4ubWVpbGlzaHVvLmNvbS9yZXBvcy9tZWlsaXNodW8vZmV4L2hvcm5iaWxsX25lc3QvdHJ1bmsvJyxcbiAgICBkaXI6ICBESVJfTkVTVFxufSwge1xuICAgIG5hbWU6ICdBcHBzJyxcbiAgICB1cmw6ICAnaHR0cDovL3N2bi5tZWlsaXNodW8uY29tL3JlcG9zL21laWxpc2h1by9mZXgvdXNlci90cnVuay8nLFxuICAgIGRpcjogIERJUl9BUFBTXG59IF1cblxuY2xhc3MgU2V0dXAge1xuICAgIGluaXQoIHBhdGggKSB7XG4gICAgICAgIHRoaXMuX3BhdGggPSBwYXRoXG4gICAgICAgIHJldHVybiBGUy5ta2RpckFzeW5jKCBwYXRoIClcbiAgICB9XG5cbiAgICBhc3luYyBjaGVja291dFNvdXJjZSggdXNlcm5hbWUsIHBhc3N3b3JkLCBhcHBTdm5VcmwgKSB7XG4gICAgICAgIHJldHVybiBhd2FpdCBQcm9taXNlLmFsbCggcGhhc2VzLm1hcCggYXN5bmMgcGhhc2VPYmogPT4ge1xuICAgICAgICAgICAgbGV0IG5hbWUsIHBhdGhcblxuICAgICAgICAgICAgaWYgKCBhcHBTdm5VcmwgJiYgcGhhc2VPYmoubmFtZSA9PSAnQXBwcycgKSB7XG4gICAgICAgICAgICAgICAgcGhhc2VPYmoudXJsID0gYXBwU3ZuVXJsXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIG5hbWUgPSBwaGFzZU9iai5uYW1lXG4gICAgICAgICAgICBwYXRoID0gdGhpcy5fcGF0aCArIHBoYXNlT2JqLmRpclxuICAgICAgICAgICAgbG9nKCBgXFxu5Yid5aeL5YyWICR7bmFtZX0g5paH5Lu25aS5YCApXG4gICAgICAgICAgICBhd2FpdCBGUy5ta2RpckFzeW5jKCBwYXRoIClcblxuICAgICAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKCAoIHJlc29sdmUsIHJlamVjdCApID0+IHtcbiAgICAgICAgICAgICAgICBVdGlsLmluZGljYXRvci5zdGFydCgpXG5cbiAgICAgICAgICAgICAgICBsZXQgY2hpbGRQcm9jZXNzID0gU1ZOLmNvKCBwaGFzZU9iai51cmwsIHBhdGgsIHtcbiAgICAgICAgICAgICAgICAgICAgdXNlcm5hbWUsIHBhc3N3b3JkXG4gICAgICAgICAgICAgICAgfSwgZXJyID0+IHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCAhZXJyICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgVXRpbC5pbmRpY2F0b3Iuc3RvcCgpXG4gICAgICAgICAgICAgICAgICAgICAgICBsb2coIGAke25hbWV9IOiuvue9ruaIkOWKnyFgLCAnc3VjY2VzcycgKVxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZSgpXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IClcblxuICAgICAgICAgICAgICAgIGNoaWxkUHJvY2Vzcy5zdGRlcnIub24oICdkYXRhJywgZGF0YSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlmICggIXRoaXMuaGFzRXJyb3IgKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZWplY3QoKVxuICAgICAgICAgICAgICAgICAgICAgICAgY2hpbGRQcm9jZXNzLmtpbGwoKVxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5oYXNFcnJvciA9IHRydWVcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZXJyb3IoIGRhdGEudG9TdHJpbmcoKSApXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IClcbiAgICAgICAgICAgIH0gKVxuICAgICAgICB9ICkgKS50aGVuKCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICBsb2coICfliJvlu7ogdG1wIOaWh+S7tuWkuScgKVxuICAgICAgICAgICAgYXdhaXQgRlMubWtkaXJBc3luYyggdGhpcy5fcGF0aCArIERJUl9UTVAgKVxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuaW5zdGFsbERlcGVuZGVuY2llcygpXG4gICAgICAgIH0gKVxuICAgIH1cblxuICAgIGFzeW5jIGluc3RhbGxEZXBlbmRlbmNpZXMoKSB7XG4gICAgICAgIGxldCBkZXB0UGF0aCA9IHRoaXMuX3BhdGggKyBESVJfTkVTVFxuXG4gICAgICAgIGxvZyggJ+WuieijhSBsZXNzIOS4jiB1Z2xpZnktanMnIClcblxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoIHJlc29sdmUgPT4ge1xuICAgICAgICAgICAgTlBNLmxvYWQoIHt9LCBmdW5jdGlvbiggZXJyLCBucG0gKSB7XG4gICAgICAgICAgICAgICAgbnBtLmNvbW1hbmRzLmluc3RhbGwoIGRlcHRQYXRoLCBERVBFTkRFTkNJRVMsICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgbG9nKCAnXFxu5L6d6LWW5bqT5a6J6KOF5oiQ5YqfIScsICdzdWNjZXNzJyApXG4gICAgICAgICAgICAgICAgICAgIFV0aWwuaW5kaWNhdG9yLnN0b3AoKVxuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKClcbiAgICAgICAgICAgICAgICB9IClcbiAgICAgICAgICAgIH0gKVxuICAgICAgICB9IClcbiAgICB9XG5cbiAgICBlcnJvciggbXNnICkge1xuICAgICAgICBVdGlsLmluZGljYXRvci5zdG9wKClcbiAgICAgICAgbG9nKCAn5LiL6L295rqQ56CB5aSx6LSl77yM5Lul5LiL5Li6IHN2biDmiZPljbDnmoTplJnor6/mtojmga8nLCAnZXJyb3InIClcbiAgICAgICAgbG9nKCBtc2cgKVxuICAgIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBTZXR1cFxuIl19