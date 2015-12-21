'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _bluebird = require('bluebird');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Inquirer = require('inquirer'),
    Path = require('path'),
    Promise = require('bluebird'),
    Rimraf = require('rimraf'),
    FS = Promise.promisifyAll(require('fs')),
    Setup = require('../core/setup'),
    ConfigCLI = require('./config'),
    Key = require('../key');

var USERNAME = Key.username,
    PASSWORD = Key.password,
    YES = '是',
    NO = '否';

var notNull = function notNull(content) {
    return !!content || '内容不能为空！';
};

var SetupCLI = (function () {
    function SetupCLI(dir, url) {
        _classCallCheck(this, SetupCLI);

        var tmp = undefined;

        if (dir || url) {
            if (dir.indexOf('http') !== -1) {
                tmp = url;
                url = dir;
                dir = tmp;
            }
        }

        this._dir = dir;
        this._url = url;

        this.init();
    }

    _createClass(SetupCLI, [{
        key: 'init',
        value: function init() {
            Inquirer.prompt([{
                name: 'dir',
                message: '设置目录',
                default: this._dir || 'master'
            }], (function () {
                var _this = this;

                var ref = (0, _bluebird.coroutine)(regeneratorRuntime.mark(function _callee(answer) {
                    var path, isExist;
                    return regeneratorRuntime.wrap(function _callee$(_context) {
                        while (1) {
                            switch (_context.prev = _context.next) {
                                case 0:
                                    path = Path.resolve(answer.dir), isExist = false;
                                    _context.prev = 1;
                                    _context.next = 4;
                                    return FS.statAsync(path);

                                case 4:
                                    isExist = _context.sent;
                                    _context.next = 9;
                                    break;

                                case 7:
                                    _context.prev = 7;
                                    _context.t0 = _context['catch'](1);

                                case 9:

                                    _this._path = path;

                                    log('目录地址:' + path, 'debug');

                                    if (!isExist) {
                                        _context.next = 15;
                                        break;
                                    }

                                    _this.cleanup();
                                    _context.next = 19;
                                    break;

                                case 15:
                                    _this._setup = new Setup();
                                    _context.next = 18;
                                    return _this._setup.init(path);

                                case 18:
                                    _this.checkout();

                                case 19:
                                case 'end':
                                    return _context.stop();
                            }
                        }
                    }, _callee, _this, [[1, 7]]);
                }));
                return function (_x) {
                    return ref.apply(this, arguments);
                };
            })());
        }
    }, {
        key: 'checkout',
        value: function checkout() {
            Inquirer.prompt([{
                name: USERNAME,
                message: 'SVN 用户名',
                default: Profile.get(USERNAME) || '',
                validate: notNull
            }, {
                type: PASSWORD,
                name: PASSWORD,
                message: 'SVN 密码',
                validate: notNull
            }], (function () {
                var _this2 = this;

                var ref = (0, _bluebird.coroutine)(regeneratorRuntime.mark(function _callee2(answer) {
                    var username, password;
                    return regeneratorRuntime.wrap(function _callee2$(_context2) {
                        while (1) {
                            switch (_context2.prev = _context2.next) {
                                case 0:
                                    username = answer[USERNAME], password = answer[PASSWORD];

                                    Profile.set(USERNAME, username);
                                    _context2.next = 4;
                                    return _this2._setup.checkoutSource(username, password, _this2._url);

                                case 4:
                                    new ConfigCLI(_this2._path);

                                case 5:
                                case 'end':
                                    return _context2.stop();
                            }
                        }
                    }, _callee2, _this2);
                }));
                return function (_x2) {
                    return ref.apply(this, arguments);
                };
            })());
        }
    }, {
        key: 'cleanup',
        value: function cleanup() {
            var _this3 = this;

            Inquirer.prompt([{
                type: 'list',
                name: 'override',
                message: '文件夹已存在，是否覆盖',
                choices: [YES, NO],
                default: NO
            }], function (answer) {
                var path = _this3._path;

                if (answer.override === YES) {
                    Rimraf(path, (function () {
                        var _this4 = this;

                        var ref = (0, _bluebird.coroutine)(regeneratorRuntime.mark(function _callee3(err) {
                            return regeneratorRuntime.wrap(function _callee3$(_context3) {
                                while (1) {
                                    switch (_context3.prev = _context3.next) {
                                        case 0:
                                            if (err) {
                                                _context3.next = 5;
                                                break;
                                            }

                                            _this4._setup = new Setup();
                                            _context3.next = 4;
                                            return _this4._setup.init(path);

                                        case 4:
                                            _this4.checkout();

                                        case 5:
                                        case 'end':
                                            return _context3.stop();
                                    }
                                }
                            }, _callee3, _this4);
                        }));
                        return function (_x3) {
                            return ref.apply(this, arguments);
                        };
                    })());
                } else {
                    new ConfigCLI(path);
                }
            });
        }
    }]);

    return SetupCLI;
})();

module.exports = SetupCLI;
//# sourceMappingURL=data:application/json;base64,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O1dBMUZDLFFBQVE7OztBQTZGZCxNQUFNLENBQUMsT0FBTyxHQUFHLFFBQVEsQ0FBQSIsImZpbGUiOiJjbGkvc2V0dXAuanMiLCJzb3VyY2VzQ29udGVudCI6WyJsZXQgSW5xdWlyZXIgID0gcmVxdWlyZSggJ2lucXVpcmVyJyApLFxuICAgIFBhdGggICAgICA9IHJlcXVpcmUoICdwYXRoJyApLFxuICAgIFByb21pc2UgICA9IHJlcXVpcmUoICdibHVlYmlyZCcgKSxcbiAgICBSaW1yYWYgICAgPSByZXF1aXJlKCAncmltcmFmJyApLFxuICAgIEZTICAgICAgICA9IFByb21pc2UucHJvbWlzaWZ5QWxsKCByZXF1aXJlKCAnZnMnICkgKSxcbiAgICBTZXR1cCAgICAgPSByZXF1aXJlKCAnLi4vY29yZS9zZXR1cCcgKSxcbiAgICBDb25maWdDTEkgPSByZXF1aXJlKCAnLi9jb25maWcnICksXG4gICAgS2V5ICAgICAgID0gcmVxdWlyZSggJy4uL2tleScgKVxuXG5jb25zdCBVU0VSTkFNRSA9IEtleS51c2VybmFtZSxcbiAgICAgIFBBU1NXT1JEID0gS2V5LnBhc3N3b3JkLFxuICAgICAgWUVTICAgICAgPSAn5pivJyxcbiAgICAgIE5PICAgICAgID0gJ+WQpidcblxubGV0IG5vdE51bGwgPSBjb250ZW50ID0+ICEhY29udGVudCB8fCAn5YaF5a655LiN6IO95Li656m677yBJ1xuXG5jbGFzcyBTZXR1cENMSSB7XG4gICAgY29uc3RydWN0b3IoIGRpciwgdXJsICkge1xuICAgICAgICBsZXQgdG1wXG5cbiAgICAgICAgaWYgKCBkaXIgfHwgdXJsICkge1xuICAgICAgICAgICAgaWYgKCBkaXIuaW5kZXhPZiggJ2h0dHAnICkgIT09IC0xICkge1xuICAgICAgICAgICAgICAgIHRtcCA9IHVybFxuICAgICAgICAgICAgICAgIHVybCA9IGRpclxuICAgICAgICAgICAgICAgIGRpciA9IHRtcFxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5fZGlyID0gZGlyXG4gICAgICAgIHRoaXMuX3VybCA9IHVybFxuXG4gICAgICAgIHRoaXMuaW5pdCgpXG4gICAgfVxuXG4gICAgaW5pdCgpIHtcbiAgICAgICAgSW5xdWlyZXIucHJvbXB0KCBbIHtcbiAgICAgICAgICAgIG5hbWU6ICAgICdkaXInLFxuICAgICAgICAgICAgbWVzc2FnZTogJ+iuvue9ruebruW9lScsXG4gICAgICAgICAgICBkZWZhdWx0OiB0aGlzLl9kaXIgfHwgJ21hc3RlcidcbiAgICAgICAgfSBdLCBhc3luYyBhbnN3ZXIgPT4ge1xuICAgICAgICAgICAgbGV0IHBhdGggICAgPSBQYXRoLnJlc29sdmUoIGFuc3dlci5kaXIgKSxcbiAgICAgICAgICAgICAgICBpc0V4aXN0ID0gZmFsc2VcblxuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAvL2h0dHBzOi8vZ2l0aHViLmNvbS9wZXRrYWFudG9ub3YvYmx1ZWJpcmQvYmxvYi9tYXN0ZXIvQVBJLm1kI3Byb21pc2lmaWNhdGlvblxuICAgICAgICAgICAgICAgIGlzRXhpc3QgPSBhd2FpdCBGUy5zdGF0QXN5bmMoIHBhdGggKVxuICAgICAgICAgICAgfSBjYXRjaCAoIGUgKSB7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMuX3BhdGggPSBwYXRoXG5cbiAgICAgICAgICAgIGxvZyggYOebruW9leWcsOWdgDoke3BhdGh9YCwgJ2RlYnVnJyApXG5cbiAgICAgICAgICAgIGlmICggaXNFeGlzdCApIHtcbiAgICAgICAgICAgICAgICB0aGlzLmNsZWFudXAoKVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9zZXR1cCA9IG5ldyBTZXR1cCgpXG4gICAgICAgICAgICAgICAgYXdhaXQgdGhpcy5fc2V0dXAuaW5pdCggcGF0aCApXG4gICAgICAgICAgICAgICAgdGhpcy5jaGVja291dCgpXG4gICAgICAgICAgICB9XG4gICAgICAgIH0gKVxuICAgIH1cblxuICAgIGNoZWNrb3V0KCkge1xuICAgICAgICBJbnF1aXJlci5wcm9tcHQoIFsge1xuICAgICAgICAgICAgbmFtZTogICAgIFVTRVJOQU1FLFxuICAgICAgICAgICAgbWVzc2FnZTogICdTVk4g55So5oi35ZCNJyxcbiAgICAgICAgICAgIGRlZmF1bHQ6ICBQcm9maWxlLmdldCggVVNFUk5BTUUgKSB8fCAnJyxcbiAgICAgICAgICAgIHZhbGlkYXRlOiBub3ROdWxsXG4gICAgICAgIH0sIHtcbiAgICAgICAgICAgIHR5cGU6ICAgICBQQVNTV09SRCxcbiAgICAgICAgICAgIG5hbWU6ICAgICBQQVNTV09SRCxcbiAgICAgICAgICAgIG1lc3NhZ2U6ICAnU1ZOIOWvhueggScsXG4gICAgICAgICAgICB2YWxpZGF0ZTogbm90TnVsbFxuICAgICAgICB9IF0sIGFzeW5jIGFuc3dlciA9PiB7XG4gICAgICAgICAgICBsZXQgdXNlcm5hbWUgPSBhbnN3ZXJbIFVTRVJOQU1FIF0sXG4gICAgICAgICAgICAgICAgcGFzc3dvcmQgPSBhbnN3ZXJbIFBBU1NXT1JEIF1cblxuICAgICAgICAgICAgUHJvZmlsZS5zZXQoIFVTRVJOQU1FLCB1c2VybmFtZSApXG4gICAgICAgICAgICBhd2FpdCB0aGlzLl9zZXR1cC5jaGVja291dFNvdXJjZSggdXNlcm5hbWUsIHBhc3N3b3JkLCB0aGlzLl91cmwgKVxuICAgICAgICAgICAgbmV3IENvbmZpZ0NMSSggdGhpcy5fcGF0aCApXG4gICAgICAgIH0gKVxuICAgIH1cblxuICAgIGNsZWFudXAoKSB7XG4gICAgICAgIElucXVpcmVyLnByb21wdCggWyB7XG4gICAgICAgICAgICB0eXBlOiAgICAnbGlzdCcsXG4gICAgICAgICAgICBuYW1lOiAgICAnb3ZlcnJpZGUnLFxuICAgICAgICAgICAgbWVzc2FnZTogJ+aWh+S7tuWkueW3suWtmOWcqO+8jOaYr+WQpuimhueblicsXG4gICAgICAgICAgICBjaG9pY2VzOiBbIFlFUywgTk8gXSxcbiAgICAgICAgICAgIGRlZmF1bHQ6IE5PXG4gICAgICAgIH0gXSwgYW5zd2VyID0+IHtcbiAgICAgICAgICAgIGxldCBwYXRoID0gdGhpcy5fcGF0aFxuXG4gICAgICAgICAgICBpZiAoIGFuc3dlci5vdmVycmlkZSA9PT0gWUVTICkge1xuICAgICAgICAgICAgICAgIFJpbXJhZiggcGF0aCwgYXN5bmMgZXJyID0+IHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCAhZXJyICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fc2V0dXAgPSBuZXcgU2V0dXAoKVxuICAgICAgICAgICAgICAgICAgICAgICAgYXdhaXQgdGhpcy5fc2V0dXAuaW5pdCggcGF0aCApXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNoZWNrb3V0KClcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gKVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBuZXcgQ29uZmlnQ0xJKCBwYXRoIClcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSApXG4gICAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFNldHVwQ0xJXG4iXX0=