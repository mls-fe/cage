'use strict';

var _bluebird = require('bluebird');

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Promise = require('bluebird'),
    FS = Promise.promisifyAll(require('fs')),
    SVN = Promise.promisifyAll(require('svn-interface')),
    NPM = require('npm'),
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvcmUvc2V0dXAuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFBQSxJQUFJLE9BQU8sR0FBRyxPQUFPLENBQUUsVUFBVSxDQUFFO0lBQy9CLEVBQUUsR0FBUSxPQUFPLENBQUMsWUFBWSxDQUFFLE9BQU8sQ0FBRSxJQUFJLENBQUUsQ0FBRTtJQUNqRCxHQUFHLEdBQU8sT0FBTyxDQUFDLFlBQVksQ0FBRSxPQUFPLENBQUUsZUFBZSxDQUFFLENBQUU7SUFDNUQsR0FBRyxHQUFPLE9BQU8sQ0FBRSxLQUFLLENBQUU7SUFDMUIsSUFBSSxHQUFNLE9BQU8sQ0FBRSxTQUFTLENBQUUsQ0FBQTs7QUFFbEMsSUFBTSxRQUFRLEdBQU8sT0FBTztJQUN0QixRQUFRLEdBQU8sT0FBTztJQUN0QixPQUFPLEdBQVcsUUFBUSxTQUFNO0lBQ2hDLFlBQVksR0FBRyxDQUFFLFlBQVksRUFBRSxpQkFBaUIsQ0FBRSxDQUFBOztBQUV4RCxJQUFJLE1BQU0sR0FBRyxDQUFFO0FBQ1gsUUFBSSxFQUFHLE1BQU07QUFDYixPQUFHLEVBQUksbUVBQW1FO0FBQzFFLE9BQUcsRUFBSSxRQUFRO0NBQ2xCLEVBQUU7QUFDQyxRQUFJLEVBQUcsTUFBTTtBQUNiLE9BQUcsRUFBSSwwREFBMEQ7QUFDakUsT0FBRyxFQUFJLFFBQVE7Q0FDbEIsQ0FBRSxDQUFBOztJQUVHLEtBQUs7YUFBTCxLQUFLOzhCQUFMLEtBQUs7OztpQkFBTCxLQUFLOzs2QkFDRCxJQUFJLEVBQUc7QUFDVCxnQkFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUE7QUFDakIsbUJBQU8sRUFBRSxDQUFDLFVBQVUsQ0FBRSxJQUFJLENBQUUsQ0FBQTtTQUMvQjs7Ozt5RkFFcUIsUUFBUSxFQUFFLFFBQVEsRUFBRSxTQUFTOzs7Ozs7Ozt1Q0FDbEMsT0FBTyxDQUFDLEdBQUcsQ0FBRSxNQUFNLENBQUMsR0FBRzs7OytGQUFFLGlCQUFNLFFBQVE7NENBQzVDLElBQUksRUFBRSxJQUFJOzs7OztBQUFWLDREQUFJLGNBQUUsSUFBSTs7QUFFZCw0REFBSyxTQUFTLElBQUksUUFBUSxDQUFDLElBQUksSUFBSSxNQUFNLEVBQUc7QUFDeEMsb0VBQVEsQ0FBQyxHQUFHLEdBQUcsU0FBUyxDQUFBO3lEQUMzQjs7QUFFRCw0REFBSSxHQUFHLFFBQVEsQ0FBQyxJQUFJLENBQUE7QUFDcEIsNERBQUksR0FBRyxNQUFLLEtBQUssR0FBRyxRQUFRLENBQUMsR0FBRyxDQUFBO0FBQ2hDLDJEQUFHLFlBQVcsSUFBSSxVQUFRLENBQUE7OytEQUNwQixFQUFFLENBQUMsVUFBVSxDQUFFLElBQUksQ0FBRTs7O3lGQUVwQixJQUFJLE9BQU8sQ0FBRSxVQUFFLE9BQU8sRUFBRSxNQUFNLEVBQU07QUFDdkMsZ0VBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxFQUFFLENBQUE7O0FBRXRCLGdFQUFJLFlBQVksR0FBRyxHQUFHLENBQUMsRUFBRSxDQUFFLFFBQVEsQ0FBQyxHQUFHLEVBQUUsSUFBSSxFQUFFO0FBQzNDLHdFQUFRLEVBQVIsUUFBUSxFQUFFLFFBQVEsRUFBUixRQUFROzZEQUNyQixFQUFFLFVBQUEsR0FBRyxFQUFJO0FBQ04sb0VBQUssQ0FBQyxHQUFHLEVBQUc7QUFDUix3RUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLEVBQUUsQ0FBQTtBQUNyQix1RUFBRyxDQUFLLElBQUksYUFBVSxTQUFTLENBQUUsQ0FBQTtBQUNqQywyRUFBTyxFQUFFLENBQUE7aUVBQ1o7NkRBQ0osQ0FBRSxDQUFBOztBQUVILHdFQUFZLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBRSxNQUFNLEVBQUUsVUFBQSxJQUFJLEVBQUk7QUFDcEMsb0VBQUssQ0FBQyxNQUFLLFFBQVEsRUFBRztBQUNsQiwwRUFBTSxFQUFFLENBQUE7QUFDUixnRkFBWSxDQUFDLElBQUksRUFBRSxDQUFBO0FBQ25CLDBFQUFLLFFBQVEsR0FBRyxJQUFJLENBQUE7QUFDcEIsMEVBQUssS0FBSyxDQUFFLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBRSxDQUFBO2lFQUNoQzs2REFDSixDQUFFLENBQUE7eURBQ04sQ0FBRTs7Ozs7Ozs7cUNBQ047Ozs7cUNBQUUsQ0FBRSxDQUFDLElBQUksa0RBQUU7Ozs7O0FBQ1IsdURBQUcsQ0FBRSxZQUFZLENBQUUsQ0FBQTs7MkRBQ2IsRUFBRSxDQUFDLFVBQVUsQ0FBRSxPQUFLLEtBQUssR0FBRyxPQUFPLENBQUU7OztzRkFDcEMsT0FBSyxtQkFBbUIsRUFBRTs7Ozs7Ozs7aUNBQ3BDLEdBQUU7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O29CQUlDLFFBQVE7Ozs7O0FBQVIsd0NBQVEsR0FBRyxJQUFJLENBQUMsS0FBSyxHQUFHLFFBQVE7O0FBRXBDLG1DQUFHLENBQUUscUJBQXFCLENBQUUsQ0FBQTs7a0VBRXJCLElBQUksT0FBTyxDQUFFLFVBQUEsT0FBTyxFQUFJO0FBQzNCLHVDQUFHLENBQUMsSUFBSSxDQUFFLEVBQUUsRUFBRSxVQUFXLEdBQUcsRUFBRSxHQUFHLEVBQUc7QUFDaEMsMkNBQUcsQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFFLFFBQVEsRUFBRSxZQUFZLEVBQUUsWUFBTTtBQUNoRCwrQ0FBRyxDQUFFLFlBQVksRUFBRSxTQUFTLENBQUUsQ0FBQTtBQUM5QixnREFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLEVBQUUsQ0FBQTtBQUNyQixtREFBTyxFQUFFLENBQUE7eUNBQ1osQ0FBRSxDQUFBO3FDQUNOLENBQUUsQ0FBQTtpQ0FDTixDQUFFOzs7Ozs7Ozs7Ozs7Ozs7OEJBR0EsR0FBRyxFQUFHO0FBQ1QsZ0JBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxFQUFFLENBQUE7QUFDckIsZUFBRyxDQUFFLHdCQUF3QixFQUFFLE9BQU8sQ0FBRSxDQUFBO0FBQ3hDLGVBQUcsQ0FBRSxHQUFHLENBQUUsQ0FBQTtTQUNiOzs7V0FwRUMsS0FBSzs7O0FBdUVYLE1BQU0sQ0FBQyxPQUFPLEdBQUcsS0FBSyxDQUFBIiwiZmlsZSI6ImNvcmUvc2V0dXAuanMiLCJzb3VyY2VzQ29udGVudCI6WyJsZXQgUHJvbWlzZSA9IHJlcXVpcmUoICdibHVlYmlyZCcgKSxcbiAgICBGUyAgICAgID0gUHJvbWlzZS5wcm9taXNpZnlBbGwoIHJlcXVpcmUoICdmcycgKSApLFxuICAgIFNWTiAgICAgPSBQcm9taXNlLnByb21pc2lmeUFsbCggcmVxdWlyZSggJ3N2bi1pbnRlcmZhY2UnICkgKSxcbiAgICBOUE0gICAgID0gcmVxdWlyZSggJ25wbScgKSxcbiAgICBVdGlsICAgID0gcmVxdWlyZSggJy4uL3V0aWwnIClcblxuY29uc3QgRElSX0FQUFMgICAgID0gJy9hcHBzJyxcbiAgICAgIERJUl9ORVNUICAgICA9ICcvbmVzdCcsXG4gICAgICBESVJfVE1QICAgICAgPSBgJHtESVJfTkVTVH0vdG1wYCxcbiAgICAgIERFUEVOREVOQ0lFUyA9IFsgJ2xlc3NAMS4zLjMnLCAndWdsaWZ5LWpzQDEuMi42JyBdXG5cbmxldCBwaGFzZXMgPSBbIHtcbiAgICBuYW1lIDogJ05lc3QnLFxuICAgIHVybCAgOiAnaHR0cDovL3N2bi5tZWlsaXNodW8uY29tL3JlcG9zL21laWxpc2h1by9mZXgvaG9ybmJpbGxfbmVzdC90cnVuay8nLFxuICAgIGRpciAgOiBESVJfTkVTVFxufSwge1xuICAgIG5hbWUgOiAnQXBwcycsXG4gICAgdXJsICA6ICdodHRwOi8vc3ZuLm1laWxpc2h1by5jb20vcmVwb3MvbWVpbGlzaHVvL2ZleC91c2VyL3RydW5rLycsXG4gICAgZGlyICA6IERJUl9BUFBTXG59IF1cblxuY2xhc3MgU2V0dXAge1xuICAgIGluaXQoIHBhdGggKSB7XG4gICAgICAgIHRoaXMuX3BhdGggPSBwYXRoXG4gICAgICAgIHJldHVybiBGUy5ta2RpckFzeW5jKCBwYXRoIClcbiAgICB9XG5cbiAgICBhc3luYyBjaGVja291dFNvdXJjZSggdXNlcm5hbWUsIHBhc3N3b3JkLCBhcHBTdm5VcmwgKSB7XG4gICAgICAgIHJldHVybiBhd2FpdCBQcm9taXNlLmFsbCggcGhhc2VzLm1hcCggYXN5bmMgcGhhc2VPYmogPT4ge1xuICAgICAgICAgICAgbGV0IG5hbWUsIHBhdGhcblxuICAgICAgICAgICAgaWYgKCBhcHBTdm5VcmwgJiYgcGhhc2VPYmoubmFtZSA9PSAnQXBwcycgKSB7XG4gICAgICAgICAgICAgICAgcGhhc2VPYmoudXJsID0gYXBwU3ZuVXJsXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIG5hbWUgPSBwaGFzZU9iai5uYW1lXG4gICAgICAgICAgICBwYXRoID0gdGhpcy5fcGF0aCArIHBoYXNlT2JqLmRpclxuICAgICAgICAgICAgbG9nKCBgXFxu5Yid5aeL5YyWICR7bmFtZX0g5paH5Lu25aS5YCApXG4gICAgICAgICAgICBhd2FpdCBGUy5ta2RpckFzeW5jKCBwYXRoIClcblxuICAgICAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKCAoIHJlc29sdmUsIHJlamVjdCApID0+IHtcbiAgICAgICAgICAgICAgICBVdGlsLmluZGljYXRvci5zdGFydCgpXG5cbiAgICAgICAgICAgICAgICBsZXQgY2hpbGRQcm9jZXNzID0gU1ZOLmNvKCBwaGFzZU9iai51cmwsIHBhdGgsIHtcbiAgICAgICAgICAgICAgICAgICAgdXNlcm5hbWUsIHBhc3N3b3JkXG4gICAgICAgICAgICAgICAgfSwgZXJyID0+IHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCAhZXJyICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgVXRpbC5pbmRpY2F0b3Iuc3RvcCgpXG4gICAgICAgICAgICAgICAgICAgICAgICBsb2coIGAke25hbWV9IOiuvue9ruaIkOWKnyFgLCAnc3VjY2VzcycgKVxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZSgpXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IClcblxuICAgICAgICAgICAgICAgIGNoaWxkUHJvY2Vzcy5zdGRlcnIub24oICdkYXRhJywgZGF0YSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlmICggIXRoaXMuaGFzRXJyb3IgKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZWplY3QoKVxuICAgICAgICAgICAgICAgICAgICAgICAgY2hpbGRQcm9jZXNzLmtpbGwoKVxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5oYXNFcnJvciA9IHRydWVcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZXJyb3IoIGRhdGEudG9TdHJpbmcoKSApXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IClcbiAgICAgICAgICAgIH0gKVxuICAgICAgICB9ICkgKS50aGVuKCBhc3luYygpID0+IHtcbiAgICAgICAgICAgIGxvZyggJ+WIm+W7uiB0bXAg5paH5Lu25aS5JyApXG4gICAgICAgICAgICBhd2FpdCBGUy5ta2RpckFzeW5jKCB0aGlzLl9wYXRoICsgRElSX1RNUCApXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5pbnN0YWxsRGVwZW5kZW5jaWVzKClcbiAgICAgICAgfSApXG4gICAgfVxuXG4gICAgYXN5bmMgaW5zdGFsbERlcGVuZGVuY2llcygpIHtcbiAgICAgICAgbGV0IGRlcHRQYXRoID0gdGhpcy5fcGF0aCArIERJUl9ORVNUXG5cbiAgICAgICAgbG9nKCAn5a6J6KOFIGxlc3Mg5LiOIHVnbGlmeS1qcycgKVxuXG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSggcmVzb2x2ZSA9PiB7XG4gICAgICAgICAgICBOUE0ubG9hZCgge30sIGZ1bmN0aW9uICggZXJyLCBucG0gKSB7XG4gICAgICAgICAgICAgICAgbnBtLmNvbW1hbmRzLmluc3RhbGwoIGRlcHRQYXRoLCBERVBFTkRFTkNJRVMsICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgbG9nKCAnXFxu5L6d6LWW5bqT5a6J6KOF5oiQ5YqfIScsICdzdWNjZXNzJyApXG4gICAgICAgICAgICAgICAgICAgIFV0aWwuaW5kaWNhdG9yLnN0b3AoKVxuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKClcbiAgICAgICAgICAgICAgICB9IClcbiAgICAgICAgICAgIH0gKVxuICAgICAgICB9IClcbiAgICB9XG5cbiAgICBlcnJvciggbXNnICkge1xuICAgICAgICBVdGlsLmluZGljYXRvci5zdG9wKClcbiAgICAgICAgbG9nKCAn5LiL6L295rqQ56CB5aSx6LSl77yM5Lul5LiL5Li6IHN2biDmiZPljbDnmoTplJnor6/mtojmga8nLCAnZXJyb3InIClcbiAgICAgICAgbG9nKCBtc2cgKVxuICAgIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBTZXR1cFxuIl19