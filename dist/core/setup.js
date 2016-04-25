'use strict';

var _bluebird = require('bluebird');

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ChildProcess = require('child_process'),
    Spawn = ChildProcess.spawn,
    Exec = ChildProcess.exec,
    FS = require('fs'),
    Util = require('../util');

var DIR_APPS = '/apps',
    DIR_NEST = '/nest',
    DIR_TMP = DIR_NEST + '/tmp',
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

function mkdir(path) {
    return new Promise(function (resolve, reject) {
        FS.mkdir(path, function (err) {
            err ? reject() : resolve();
        });
    });
}

var Setup = function () {
    function Setup() {
        _classCallCheck(this, Setup);
    }

    _createClass(Setup, [{
        key: 'init',
        value: function init(path) {
            this._path = path;
            return mkdir(path);
        }
    }, {
        key: 'checkoutSource',
        value: function () {
            var ref = (0, _bluebird.coroutine)(regeneratorRuntime.mark(function _callee3(username, password, appSvnUrl) {
                var _this = this;

                return regeneratorRuntime.wrap(function _callee3$(_context3) {
                    while (1) {
                        switch (_context3.prev = _context3.next) {
                            case 0:
                                _context3.next = 2;
                                return Promise.all(phases.map(function () {
                                    var ref = (0, _bluebird.coroutine)(regeneratorRuntime.mark(function _callee(phaseObj) {
                                        var name, path;
                                        return regeneratorRuntime.wrap(function _callee$(_context) {
                                            while (1) {
                                                switch (_context.prev = _context.next) {
                                                    case 0:
                                                        name = void 0, path = void 0;


                                                        if (appSvnUrl && phaseObj.name == 'Apps') {
                                                            phaseObj.url = appSvnUrl;
                                                        }

                                                        name = phaseObj.name;
                                                        path = _this._path + phaseObj.dir;
                                                        log('\n初始化 ' + name + ' 文件夹');
                                                        _context.next = 7;
                                                        return mkdir(path);

                                                    case 7:
                                                        return _context.abrupt('return', new Promise(function (resolve, reject) {
                                                            Util.indicator.start();
                                                            var args = ['checkout', phaseObj.url, path, '--username', username, '--password', password],
                                                                client = void 0;

                                                            client = Spawn('svn', args, {});

                                                            client.on('err', function (err) {
                                                                Util.indicator.stop();
                                                                log(name + ' 设置失败!', 'error');
                                                                log(err, 'info');
                                                                reject();
                                                            });

                                                            client.on('exit', function () {
                                                                Util.indicator.stop();
                                                                log(name + ' 设置成功!', 'success');
                                                                resolve();
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
                                }())).then((0, _bluebird.coroutine)(regeneratorRuntime.mark(function _callee2() {
                                    return regeneratorRuntime.wrap(function _callee2$(_context2) {
                                        while (1) {
                                            switch (_context2.prev = _context2.next) {
                                                case 0:
                                                    log('创建 tmp 文件夹');
                                                    _context2.next = 3;
                                                    return mkdir(_this._path + DIR_TMP);

                                                case 3:
                                                    return _context2.abrupt('return', _this.installDependencies());

                                                case 4:
                                                case 'end':
                                                    return _context2.stop();
                                            }
                                        }
                                    }, _callee2, _this);
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

            function checkoutSource(_x, _x2, _x3) {
                return ref.apply(this, arguments);
            }

            return checkoutSource;
        }()
    }, {
        key: 'installDependencies',
        value: function () {
            var ref = (0, _bluebird.coroutine)(regeneratorRuntime.mark(function _callee4() {
                var deptPath;
                return regeneratorRuntime.wrap(function _callee4$(_context4) {
                    while (1) {
                        switch (_context4.prev = _context4.next) {
                            case 0:
                                deptPath = this._path + DIR_NEST;


                                log('安装 less 与 uglify-js');
                                Util.indicator.start();

                                return _context4.abrupt('return', new Promise(function (resolve) {
                                    var command = 'cd ' + deptPath + ' && npm install ' + DEPENDENCIES.join(' ');
                                    log(command, 'debug');
                                    Exec(command, function (err, stdout) {
                                        Util.indicator.stop();

                                        if (err) {
                                            log(err, 'error');
                                            log('\n依赖库安装失败!', 'error');
                                        } else {
                                            log(stdout, 'info');
                                            log('\n依赖库安装成功!', 'success');
                                            resolve();
                                        }
                                    }).stdout.pipe(process.stdout);
                                }));

                            case 4:
                            case 'end':
                                return _context4.stop();
                        }
                    }
                }, _callee4, this);
            }));

            function installDependencies() {
                return ref.apply(this, arguments);
            }

            return installDependencies;
        }()
    }, {
        key: 'error',
        value: function error(msg) {
            Util.indicator.stop();
            log('下载源码失败，以下为 svn 打印的错误消息', 'error');
            log(msg);
        }
    }]);

    return Setup;
}();

module.exports = Setup;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb3JlL3NldHVwLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBQUEsSUFBSSxlQUFlLFFBQVMsZUFBVCxDQUFuQjtJQUNJLFFBQWUsYUFBYSxLQURoQztJQUVJLE9BQWUsYUFBYSxJQUZoQztJQUdJLEtBQWUsUUFBUyxJQUFULENBSG5CO0lBSUksT0FBZSxRQUFTLFNBQVQsQ0FKbkI7O0FBTUEsSUFBTSxXQUFlLE9BQXJCO0lBQ00sV0FBZSxPQURyQjtJQUVNLFVBQWtCLFFBQWxCLFNBRk47SUFHTSxlQUFlLENBQUUsWUFBRixFQUFnQixpQkFBaEIsQ0FIckI7O0FBS0EsSUFBSSxTQUFTLENBQUU7QUFDWCxVQUFPLE1BREk7QUFFWCxTQUFPLG1FQUZJO0FBR1gsU0FBTztBQUhJLENBQUYsRUFJVjtBQUNDLFVBQU8sTUFEUjtBQUVDLFNBQU8sMERBRlI7QUFHQyxTQUFPO0FBSFIsQ0FKVSxDQUFiOztBQVVBLFNBQVMsS0FBVCxDQUFnQixJQUFoQixFQUF1QjtBQUNuQixXQUFPLElBQUksT0FBSixDQUFhLFVBQUUsT0FBRixFQUFXLE1BQVgsRUFBdUI7QUFDdkMsV0FBRyxLQUFILENBQVUsSUFBVixFQUFnQixlQUFPO0FBQ25CLGtCQUFNLFFBQU4sR0FBaUIsU0FBakI7QUFDSCxTQUZEO0FBR0gsS0FKTSxDQUFQO0FBS0g7O0lBRUssSzs7Ozs7Ozs2QkFDSSxJLEVBQU87QUFDVCxpQkFBSyxLQUFMLEdBQWEsSUFBYjtBQUNBLG1CQUFPLE1BQU8sSUFBUCxDQUFQO0FBQ0g7Ozs7eUZBRXFCLFEsRUFBVSxRLEVBQVUsUzs7Ozs7Ozs7dUNBQ3pCLFFBQVEsR0FBUixDQUFhLE9BQU8sR0FBUDtBQUFBLCtGQUFZLGlCQUFPLFFBQVA7QUFBQSw0Q0FDOUIsSUFEOEIsRUFDeEIsSUFEd0I7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUM5Qiw0REFEOEIsV0FDeEIsSUFEd0I7OztBQUdsQyw0REFBSyxhQUFhLFNBQVMsSUFBVCxJQUFpQixNQUFuQyxFQUE0QztBQUN4QyxxRUFBUyxHQUFULEdBQWUsU0FBZjtBQUNIOztBQUVELCtEQUFPLFNBQVMsSUFBaEI7QUFDQSwrREFBTyxNQUFLLEtBQUwsR0FBYSxTQUFTLEdBQTdCO0FBQ0EsdUVBQWMsSUFBZDtBQVRrQztBQUFBLCtEQVU1QixNQUFPLElBQVAsQ0FWNEI7O0FBQUE7QUFBQSx5RkFZM0IsSUFBSSxPQUFKLENBQWEsVUFBRSxPQUFGLEVBQVcsTUFBWCxFQUF1QjtBQUN2QyxpRUFBSyxTQUFMLENBQWUsS0FBZjtBQUNBLGdFQUFJLE9BQU8sQ0FBRSxVQUFGLEVBQWMsU0FBUyxHQUF2QixFQUE0QixJQUE1QixFQUFrQyxZQUFsQyxFQUFnRCxRQUFoRCxFQUEwRCxZQUExRCxFQUF3RSxRQUF4RSxDQUFYO2dFQUNJLGVBREo7O0FBR0EscUVBQVMsTUFBTyxLQUFQLEVBQWMsSUFBZCxFQUFvQixFQUFwQixDQUFUOztBQUVBLG1FQUFPLEVBQVAsQ0FBVyxLQUFYLEVBQWtCLGVBQU87QUFDckIscUVBQUssU0FBTCxDQUFlLElBQWY7QUFDQSxvRUFBUSxJQUFSLGFBQXNCLE9BQXRCO0FBQ0Esb0VBQUssR0FBTCxFQUFVLE1BQVY7QUFDQTtBQUNILDZEQUxEOztBQU9BLG1FQUFPLEVBQVAsQ0FBVyxNQUFYLEVBQW1CLFlBQU07QUFDckIscUVBQUssU0FBTCxDQUFlLElBQWY7QUFDQSxvRUFBUSxJQUFSLGFBQXNCLFNBQXRCO0FBQ0E7QUFDSCw2REFKRDtBQUtILHlEQW5CTSxDQVoyQjs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxxQ0FBWjtBQUFBO0FBQUE7QUFBQTtBQUFBLG9DQUFiLEVBZ0NQLElBaENPLGtEQWdDRDtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQ1Isd0RBQUssWUFBTDtBQURRO0FBQUEsMkRBRUYsTUFBTyxNQUFLLEtBQUwsR0FBYSxPQUFwQixDQUZFOztBQUFBO0FBQUEsc0ZBR0QsTUFBSyxtQkFBTCxFQUhDOztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLGlDQWhDQyxHOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztvQkF3Q1QsUTs7Ozs7QUFBQSx3QyxHQUFXLEtBQUssS0FBTCxHQUFhLFE7OztBQUU1QixvQ0FBSyxxQkFBTDtBQUNBLHFDQUFLLFNBQUwsQ0FBZSxLQUFmOztrRUFFTyxJQUFJLE9BQUosQ0FBYSxtQkFBVztBQUMzQix3Q0FBSSxrQkFBZ0IsUUFBaEIsd0JBQTJDLGFBQWEsSUFBYixDQUFtQixHQUFuQixDQUEvQztBQUNBLHdDQUFLLE9BQUwsRUFBYyxPQUFkO0FBQ0EseUNBQU0sT0FBTixFQUFlLFVBQUUsR0FBRixFQUFPLE1BQVAsRUFBbUI7QUFDOUIsNkNBQUssU0FBTCxDQUFlLElBQWY7O0FBRUEsNENBQUssR0FBTCxFQUFXO0FBQ1AsZ0RBQUssR0FBTCxFQUFVLE9BQVY7QUFDQSxnREFBSyxZQUFMLEVBQW1CLE9BQW5CO0FBQ0gseUNBSEQsTUFHTztBQUNILGdEQUFLLE1BQUwsRUFBYSxNQUFiO0FBQ0EsZ0RBQUssWUFBTCxFQUFtQixTQUFuQjtBQUNBO0FBQ0g7QUFDSixxQ0FYRCxFQVdJLE1BWEosQ0FXVyxJQVhYLENBV2lCLFFBQVEsTUFYekI7QUFZSCxpQ0FmTSxDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OEJBa0JKLEcsRUFBTTtBQUNULGlCQUFLLFNBQUwsQ0FBZSxJQUFmO0FBQ0EsZ0JBQUssd0JBQUwsRUFBK0IsT0FBL0I7QUFDQSxnQkFBSyxHQUFMO0FBQ0g7Ozs7OztBQUdMLE9BQU8sT0FBUCxHQUFpQixLQUFqQiIsImZpbGUiOiJzZXR1cC5qcyIsInNvdXJjZXNDb250ZW50IjpbImxldCBDaGlsZFByb2Nlc3MgPSByZXF1aXJlKCAnY2hpbGRfcHJvY2VzcycgKSxcbiAgICBTcGF3biAgICAgICAgPSBDaGlsZFByb2Nlc3Muc3Bhd24sXG4gICAgRXhlYyAgICAgICAgID0gQ2hpbGRQcm9jZXNzLmV4ZWMsXG4gICAgRlMgICAgICAgICAgID0gcmVxdWlyZSggJ2ZzJyApLFxuICAgIFV0aWwgICAgICAgICA9IHJlcXVpcmUoICcuLi91dGlsJyApXG5cbmNvbnN0IERJUl9BUFBTICAgICA9ICcvYXBwcycsXG4gICAgICBESVJfTkVTVCAgICAgPSAnL25lc3QnLFxuICAgICAgRElSX1RNUCAgICAgID0gYCR7RElSX05FU1R9L3RtcGAsXG4gICAgICBERVBFTkRFTkNJRVMgPSBbICdsZXNzQDEuMy4zJywgJ3VnbGlmeS1qc0AxLjIuNicgXVxuXG5sZXQgcGhhc2VzID0gWyB7XG4gICAgbmFtZSA6ICdOZXN0JyxcbiAgICB1cmwgIDogJ2h0dHA6Ly9zdm4ubWVpbGlzaHVvLmNvbS9yZXBvcy9tZWlsaXNodW8vZmV4L2hvcm5iaWxsX25lc3QvdHJ1bmsvJyxcbiAgICBkaXIgIDogRElSX05FU1Rcbn0sIHtcbiAgICBuYW1lIDogJ0FwcHMnLFxuICAgIHVybCAgOiAnaHR0cDovL3N2bi5tZWlsaXNodW8uY29tL3JlcG9zL21laWxpc2h1by9mZXgvdXNlci90cnVuay8nLFxuICAgIGRpciAgOiBESVJfQVBQU1xufSBdXG5cbmZ1bmN0aW9uIG1rZGlyKCBwYXRoICkge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZSggKCByZXNvbHZlLCByZWplY3QgKSA9PiB7XG4gICAgICAgIEZTLm1rZGlyKCBwYXRoLCBlcnIgPT4ge1xuICAgICAgICAgICAgZXJyID8gcmVqZWN0KCkgOiByZXNvbHZlKClcbiAgICAgICAgfSApXG4gICAgfSApXG59XG5cbmNsYXNzIFNldHVwIHtcbiAgICBpbml0KCBwYXRoICkge1xuICAgICAgICB0aGlzLl9wYXRoID0gcGF0aFxuICAgICAgICByZXR1cm4gbWtkaXIoIHBhdGggKVxuICAgIH1cblxuICAgIGFzeW5jIGNoZWNrb3V0U291cmNlKCB1c2VybmFtZSwgcGFzc3dvcmQsIGFwcFN2blVybCApIHtcbiAgICAgICAgcmV0dXJuIGF3YWl0IFByb21pc2UuYWxsKCBwaGFzZXMubWFwKCBhc3luYyggcGhhc2VPYmogKSA9PiB7XG4gICAgICAgICAgICBsZXQgbmFtZSwgcGF0aFxuXG4gICAgICAgICAgICBpZiAoIGFwcFN2blVybCAmJiBwaGFzZU9iai5uYW1lID09ICdBcHBzJyApIHtcbiAgICAgICAgICAgICAgICBwaGFzZU9iai51cmwgPSBhcHBTdm5VcmxcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgbmFtZSA9IHBoYXNlT2JqLm5hbWVcbiAgICAgICAgICAgIHBhdGggPSB0aGlzLl9wYXRoICsgcGhhc2VPYmouZGlyXG4gICAgICAgICAgICBsb2coIGBcXG7liJ3lp4vljJYgJHtuYW1lfSDmlofku7blpLlgIClcbiAgICAgICAgICAgIGF3YWl0IG1rZGlyKCBwYXRoIClcblxuICAgICAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKCAoIHJlc29sdmUsIHJlamVjdCApID0+IHtcbiAgICAgICAgICAgICAgICBVdGlsLmluZGljYXRvci5zdGFydCgpXG4gICAgICAgICAgICAgICAgbGV0IGFyZ3MgPSBbICdjaGVja291dCcsIHBoYXNlT2JqLnVybCwgcGF0aCwgJy0tdXNlcm5hbWUnLCB1c2VybmFtZSwgJy0tcGFzc3dvcmQnLCBwYXNzd29yZCBdLFxuICAgICAgICAgICAgICAgICAgICBjbGllbnRcblxuICAgICAgICAgICAgICAgIGNsaWVudCA9IFNwYXduKCAnc3ZuJywgYXJncywge30gKVxuXG4gICAgICAgICAgICAgICAgY2xpZW50Lm9uKCAnZXJyJywgZXJyID0+IHtcbiAgICAgICAgICAgICAgICAgICAgVXRpbC5pbmRpY2F0b3Iuc3RvcCgpXG4gICAgICAgICAgICAgICAgICAgIGxvZyggYCR7bmFtZX0g6K6+572u5aSx6LSlIWAsICdlcnJvcicgKVxuICAgICAgICAgICAgICAgICAgICBsb2coIGVyciwgJ2luZm8nIClcbiAgICAgICAgICAgICAgICAgICAgcmVqZWN0KClcbiAgICAgICAgICAgICAgICB9IClcblxuICAgICAgICAgICAgICAgIGNsaWVudC5vbiggJ2V4aXQnLCAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIFV0aWwuaW5kaWNhdG9yLnN0b3AoKVxuICAgICAgICAgICAgICAgICAgICBsb2coIGAke25hbWV9IOiuvue9ruaIkOWKnyFgLCAnc3VjY2VzcycgKVxuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKClcbiAgICAgICAgICAgICAgICB9IClcbiAgICAgICAgICAgIH0gKVxuICAgICAgICB9ICkgKS50aGVuKCBhc3luYygpID0+IHtcbiAgICAgICAgICAgIGxvZyggJ+WIm+W7uiB0bXAg5paH5Lu25aS5JyApXG4gICAgICAgICAgICBhd2FpdCBta2RpciggdGhpcy5fcGF0aCArIERJUl9UTVAgKVxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuaW5zdGFsbERlcGVuZGVuY2llcygpXG4gICAgICAgIH0gKVxuICAgIH1cblxuICAgIGFzeW5jIGluc3RhbGxEZXBlbmRlbmNpZXMoKSB7XG4gICAgICAgIGxldCBkZXB0UGF0aCA9IHRoaXMuX3BhdGggKyBESVJfTkVTVFxuXG4gICAgICAgIGxvZyggJ+WuieijhSBsZXNzIOS4jiB1Z2xpZnktanMnIClcbiAgICAgICAgVXRpbC5pbmRpY2F0b3Iuc3RhcnQoKVxuXG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSggcmVzb2x2ZSA9PiB7XG4gICAgICAgICAgICBsZXQgY29tbWFuZCA9IGBjZCAke2RlcHRQYXRofSAmJiBucG0gaW5zdGFsbCAke0RFUEVOREVOQ0lFUy5qb2luKCAnICcgKX1gXG4gICAgICAgICAgICBsb2coIGNvbW1hbmQsICdkZWJ1ZycgKVxuICAgICAgICAgICAgRXhlYyggY29tbWFuZCwgKCBlcnIsIHN0ZG91dCApID0+IHtcbiAgICAgICAgICAgICAgICBVdGlsLmluZGljYXRvci5zdG9wKClcblxuICAgICAgICAgICAgICAgIGlmICggZXJyICkge1xuICAgICAgICAgICAgICAgICAgICBsb2coIGVyciwgJ2Vycm9yJyApXG4gICAgICAgICAgICAgICAgICAgIGxvZyggJ1xcbuS+nei1luW6k+WuieijheWksei0pSEnLCAnZXJyb3InIClcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBsb2coIHN0ZG91dCwgJ2luZm8nIClcbiAgICAgICAgICAgICAgICAgICAgbG9nKCAnXFxu5L6d6LWW5bqT5a6J6KOF5oiQ5YqfIScsICdzdWNjZXNzJyApXG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUoKVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gKS5zdGRvdXQucGlwZSggcHJvY2Vzcy5zdGRvdXQgKVxuICAgICAgICB9IClcbiAgICB9XG5cbiAgICBlcnJvciggbXNnICkge1xuICAgICAgICBVdGlsLmluZGljYXRvci5zdG9wKClcbiAgICAgICAgbG9nKCAn5LiL6L295rqQ56CB5aSx6LSl77yM5Lul5LiL5Li6IHN2biDmiZPljbDnmoTplJnor6/mtojmga8nLCAnZXJyb3InIClcbiAgICAgICAgbG9nKCBtc2cgKVxuICAgIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBTZXR1cFxuIl19