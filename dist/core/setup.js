'use strict';

var _bluebird = require('bluebird');

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Exec = require('child_process').exec,
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

                                                            Exec('svn checkout ' + phaseObj.url + ' ' + path + ' --username ' + username + ' --password ' + password, function (err) {
                                                                Util.indicator.stop();
                                                                if (!err) {
                                                                    log(name + ' 设置成功!', 'success');
                                                                    resolve();
                                                                } else {
                                                                    log(name + ' 设置失败!', 'error');
                                                                    log(err, 'info');
                                                                    reject();
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

                                return _context4.abrupt('return', new Promise(function (resolve) {
                                    Exec('cd ' + deptPath + ' && npm install ' + DEPENDENCIES.join(' '), function (err, stdout) {
                                        Util.indicator.stop();

                                        if (err) {
                                            log(err, 'error');
                                            log('\n依赖库安装失败!', 'error');
                                        } else {
                                            log(stdout, 'info');
                                            log('\n依赖库安装成功!', 'success');
                                            resolve();
                                        }
                                    });
                                }));

                            case 3:
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb3JlL3NldHVwLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBQUEsSUFBSSxPQUFPLFFBQVMsZUFBVCxFQUEyQixJQUF0QztJQUNJLEtBQU8sUUFBUyxJQUFULENBRFg7SUFFSSxPQUFPLFFBQVMsU0FBVCxDQUZYOztBQUlBLElBQU0sV0FBZSxPQUFyQjtJQUNNLFdBQWUsT0FEckI7SUFFTSxVQUFrQixRQUFsQixTQUZOO0lBR00sZUFBZSxDQUFFLFlBQUYsRUFBZ0IsaUJBQWhCLENBSHJCOztBQUtBLElBQUksU0FBUyxDQUFFO0FBQ1gsVUFBTyxNQURJO0FBRVgsU0FBTyxtRUFGSTtBQUdYLFNBQU87QUFISSxDQUFGLEVBSVY7QUFDQyxVQUFPLE1BRFI7QUFFQyxTQUFPLDBEQUZSO0FBR0MsU0FBTztBQUhSLENBSlUsQ0FBYjs7QUFVQSxTQUFTLEtBQVQsQ0FBZ0IsSUFBaEIsRUFBdUI7QUFDbkIsV0FBTyxJQUFJLE9BQUosQ0FBYSxVQUFFLE9BQUYsRUFBVyxNQUFYLEVBQXVCO0FBQ3ZDLFdBQUcsS0FBSCxDQUFVLElBQVYsRUFBZ0IsZUFBTztBQUNuQixrQkFBTSxRQUFOLEdBQWlCLFNBQWpCO0FBQ0gsU0FGRDtBQUdILEtBSk0sQ0FBUDtBQUtIOztJQUVLLEs7Ozs7Ozs7NkJBQ0ksSSxFQUFPO0FBQ1QsaUJBQUssS0FBTCxHQUFhLElBQWI7QUFDQSxtQkFBTyxNQUFPLElBQVAsQ0FBUDtBQUNIOzs7O3lGQUVxQixRLEVBQVUsUSxFQUFVLFM7Ozs7Ozs7O3VDQUN6QixRQUFRLEdBQVIsQ0FBYSxPQUFPLEdBQVA7QUFBQSwrRkFBWSxpQkFBTyxRQUFQO0FBQUEsNENBQzlCLElBRDhCLEVBQ3hCLElBRHdCO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDOUIsNERBRDhCLFdBQ3hCLElBRHdCOzs7QUFHbEMsNERBQUssYUFBYSxTQUFTLElBQVQsSUFBaUIsTUFBbkMsRUFBNEM7QUFDeEMscUVBQVMsR0FBVCxHQUFlLFNBQWY7QUFDSDs7QUFFRCwrREFBTyxTQUFTLElBQWhCO0FBQ0EsK0RBQU8sTUFBSyxLQUFMLEdBQWEsU0FBUyxHQUE3QjtBQUNBLHVFQUFjLElBQWQ7QUFUa0M7QUFBQSwrREFVNUIsTUFBTyxJQUFQLENBVjRCOztBQUFBO0FBQUEseUZBWTNCLElBQUksT0FBSixDQUFhLFVBQUUsT0FBRixFQUFXLE1BQVgsRUFBdUI7QUFDdkMsaUVBQUssU0FBTCxDQUFlLEtBQWY7O0FBRUEsbUZBQXNCLFNBQVMsR0FBL0IsU0FBc0MsSUFBdEMsb0JBQXlELFFBQXpELG9CQUFnRixRQUFoRixFQUE0RixlQUFPO0FBQy9GLHFFQUFLLFNBQUwsQ0FBZSxJQUFmO0FBQ0Esb0VBQUssQ0FBQyxHQUFOLEVBQVk7QUFDUix3RUFBUSxJQUFSLGFBQXNCLFNBQXRCO0FBQ0E7QUFDSCxpRUFIRCxNQUdPO0FBQ0gsd0VBQVEsSUFBUixhQUFzQixPQUF0QjtBQUNBLHdFQUFLLEdBQUwsRUFBVSxNQUFWO0FBQ0E7QUFDSDtBQUNKLDZEQVZEO0FBV0gseURBZE0sQ0FaMkI7O0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEscUNBQVo7QUFBQTtBQUFBO0FBQUE7QUFBQSxvQ0FBYixFQTJCUCxJQTNCTyxrREEyQkQ7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUNSLHdEQUFLLFlBQUw7QUFEUTtBQUFBLDJEQUVGLE1BQU8sTUFBSyxLQUFMLEdBQWEsT0FBcEIsQ0FGRTs7QUFBQTtBQUFBLHNGQUdELE1BQUssbUJBQUwsRUFIQzs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxpQ0EzQkMsRzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7b0JBbUNULFE7Ozs7O0FBQUEsd0MsR0FBVyxLQUFLLEtBQUwsR0FBYSxROzs7QUFFNUIsb0NBQUsscUJBQUw7O2tFQUVPLElBQUksT0FBSixDQUFhLG1CQUFXO0FBQzNCLGlEQUFZLFFBQVosd0JBQXVDLGFBQWEsSUFBYixDQUFtQixHQUFuQixDQUF2QyxFQUFtRSxVQUFFLEdBQUYsRUFBTyxNQUFQLEVBQW1CO0FBQ2xGLDZDQUFLLFNBQUwsQ0FBZSxJQUFmOztBQUVBLDRDQUFLLEdBQUwsRUFBVztBQUNQLGdEQUFLLEdBQUwsRUFBVSxPQUFWO0FBQ0EsZ0RBQUssWUFBTCxFQUFtQixPQUFuQjtBQUNILHlDQUhELE1BR087QUFDSCxnREFBSyxNQUFMLEVBQWEsTUFBYjtBQUNBLGdEQUFLLFlBQUwsRUFBbUIsU0FBbkI7QUFDQTtBQUNIO0FBQ0oscUNBWEQ7QUFZSCxpQ0FiTSxDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OEJBZ0JKLEcsRUFBTTtBQUNULGlCQUFLLFNBQUwsQ0FBZSxJQUFmO0FBQ0EsZ0JBQUssd0JBQUwsRUFBK0IsT0FBL0I7QUFDQSxnQkFBSyxHQUFMO0FBQ0g7Ozs7OztBQUdMLE9BQU8sT0FBUCxHQUFpQixLQUFqQiIsImZpbGUiOiJzZXR1cC5qcyIsInNvdXJjZXNDb250ZW50IjpbImxldCBFeGVjID0gcmVxdWlyZSggJ2NoaWxkX3Byb2Nlc3MnICkuZXhlYyxcbiAgICBGUyAgID0gcmVxdWlyZSggJ2ZzJyApLFxuICAgIFV0aWwgPSByZXF1aXJlKCAnLi4vdXRpbCcgKVxuXG5jb25zdCBESVJfQVBQUyAgICAgPSAnL2FwcHMnLFxuICAgICAgRElSX05FU1QgICAgID0gJy9uZXN0JyxcbiAgICAgIERJUl9UTVAgICAgICA9IGAke0RJUl9ORVNUfS90bXBgLFxuICAgICAgREVQRU5ERU5DSUVTID0gWyAnbGVzc0AxLjMuMycsICd1Z2xpZnktanNAMS4yLjYnIF1cblxubGV0IHBoYXNlcyA9IFsge1xuICAgIG5hbWUgOiAnTmVzdCcsXG4gICAgdXJsICA6ICdodHRwOi8vc3ZuLm1laWxpc2h1by5jb20vcmVwb3MvbWVpbGlzaHVvL2ZleC9ob3JuYmlsbF9uZXN0L3RydW5rLycsXG4gICAgZGlyICA6IERJUl9ORVNUXG59LCB7XG4gICAgbmFtZSA6ICdBcHBzJyxcbiAgICB1cmwgIDogJ2h0dHA6Ly9zdm4ubWVpbGlzaHVvLmNvbS9yZXBvcy9tZWlsaXNodW8vZmV4L3VzZXIvdHJ1bmsvJyxcbiAgICBkaXIgIDogRElSX0FQUFNcbn0gXVxuXG5mdW5jdGlvbiBta2RpciggcGF0aCApIHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoICggcmVzb2x2ZSwgcmVqZWN0ICkgPT4ge1xuICAgICAgICBGUy5ta2RpciggcGF0aCwgZXJyID0+IHtcbiAgICAgICAgICAgIGVyciA/IHJlamVjdCgpIDogcmVzb2x2ZSgpXG4gICAgICAgIH0gKVxuICAgIH0gKVxufVxuXG5jbGFzcyBTZXR1cCB7XG4gICAgaW5pdCggcGF0aCApIHtcbiAgICAgICAgdGhpcy5fcGF0aCA9IHBhdGhcbiAgICAgICAgcmV0dXJuIG1rZGlyKCBwYXRoIClcbiAgICB9XG5cbiAgICBhc3luYyBjaGVja291dFNvdXJjZSggdXNlcm5hbWUsIHBhc3N3b3JkLCBhcHBTdm5VcmwgKSB7XG4gICAgICAgIHJldHVybiBhd2FpdCBQcm9taXNlLmFsbCggcGhhc2VzLm1hcCggYXN5bmMoIHBoYXNlT2JqICkgPT4ge1xuICAgICAgICAgICAgbGV0IG5hbWUsIHBhdGhcblxuICAgICAgICAgICAgaWYgKCBhcHBTdm5VcmwgJiYgcGhhc2VPYmoubmFtZSA9PSAnQXBwcycgKSB7XG4gICAgICAgICAgICAgICAgcGhhc2VPYmoudXJsID0gYXBwU3ZuVXJsXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIG5hbWUgPSBwaGFzZU9iai5uYW1lXG4gICAgICAgICAgICBwYXRoID0gdGhpcy5fcGF0aCArIHBoYXNlT2JqLmRpclxuICAgICAgICAgICAgbG9nKCBgXFxu5Yid5aeL5YyWICR7bmFtZX0g5paH5Lu25aS5YCApXG4gICAgICAgICAgICBhd2FpdCBta2RpciggcGF0aCApXG5cbiAgICAgICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSggKCByZXNvbHZlLCByZWplY3QgKSA9PiB7XG4gICAgICAgICAgICAgICAgVXRpbC5pbmRpY2F0b3Iuc3RhcnQoKVxuXG4gICAgICAgICAgICAgICAgRXhlYyggYHN2biBjaGVja291dCAke3BoYXNlT2JqLnVybH0gJHtwYXRofSAtLXVzZXJuYW1lICR7dXNlcm5hbWV9IC0tcGFzc3dvcmQgJHtwYXNzd29yZH1gLCBlcnIgPT4ge1xuICAgICAgICAgICAgICAgICAgICBVdGlsLmluZGljYXRvci5zdG9wKClcbiAgICAgICAgICAgICAgICAgICAgaWYgKCAhZXJyICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgbG9nKCBgJHtuYW1lfSDorr7nva7miJDlip8hYCwgJ3N1Y2Nlc3MnIClcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUoKVxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgbG9nKCBgJHtuYW1lfSDorr7nva7lpLHotKUhYCwgJ2Vycm9yJyApXG4gICAgICAgICAgICAgICAgICAgICAgICBsb2coIGVyciwgJ2luZm8nIClcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlamVjdCgpXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IClcbiAgICAgICAgICAgIH0gKVxuICAgICAgICB9ICkgKS50aGVuKCBhc3luYygpID0+IHtcbiAgICAgICAgICAgIGxvZyggJ+WIm+W7uiB0bXAg5paH5Lu25aS5JyApXG4gICAgICAgICAgICBhd2FpdCBta2RpciggdGhpcy5fcGF0aCArIERJUl9UTVAgKVxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuaW5zdGFsbERlcGVuZGVuY2llcygpXG4gICAgICAgIH0gKVxuICAgIH1cblxuICAgIGFzeW5jIGluc3RhbGxEZXBlbmRlbmNpZXMoKSB7XG4gICAgICAgIGxldCBkZXB0UGF0aCA9IHRoaXMuX3BhdGggKyBESVJfTkVTVFxuXG4gICAgICAgIGxvZyggJ+WuieijhSBsZXNzIOS4jiB1Z2xpZnktanMnIClcblxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoIHJlc29sdmUgPT4ge1xuICAgICAgICAgICAgRXhlYyggYGNkICR7ZGVwdFBhdGh9ICYmIG5wbSBpbnN0YWxsICR7REVQRU5ERU5DSUVTLmpvaW4oICcgJyApfWAsICggZXJyLCBzdGRvdXQgKSA9PiB7XG4gICAgICAgICAgICAgICAgVXRpbC5pbmRpY2F0b3Iuc3RvcCgpXG5cbiAgICAgICAgICAgICAgICBpZiAoIGVyciApIHtcbiAgICAgICAgICAgICAgICAgICAgbG9nKCBlcnIsICdlcnJvcicgKVxuICAgICAgICAgICAgICAgICAgICBsb2coICdcXG7kvp3otZblupPlronoo4XlpLHotKUhJywgJ2Vycm9yJyApXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgbG9nKCBzdGRvdXQsICdpbmZvJyApXG4gICAgICAgICAgICAgICAgICAgIGxvZyggJ1xcbuS+nei1luW6k+WuieijheaIkOWKnyEnLCAnc3VjY2VzcycgKVxuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKClcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IClcbiAgICAgICAgfSApXG4gICAgfVxuXG4gICAgZXJyb3IoIG1zZyApIHtcbiAgICAgICAgVXRpbC5pbmRpY2F0b3Iuc3RvcCgpXG4gICAgICAgIGxvZyggJ+S4i+i9vea6kOeggeWksei0pe+8jOS7peS4i+S4uiBzdm4g5omT5Y2w55qE6ZSZ6K+v5raI5oGvJywgJ2Vycm9yJyApXG4gICAgICAgIGxvZyggbXNnIClcbiAgICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gU2V0dXBcbiJdfQ==