'use strict';

var _bluebird = require('bluebird');

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

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

var SetupCLI = function () {
    function SetupCLI(dir, url) {
        _classCallCheck(this, SetupCLI);

        var tmp = void 0;

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
            var _this = this;

            Inquirer.prompt([{
                name: 'dir',
                message: '设置目录',
                default: this._dir || 'master'
            }], function () {
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
            }());
        }
    }, {
        key: 'checkout',
        value: function checkout() {
            var _this2 = this;

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
            }], function () {
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
            }());
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
                    Rimraf(path, function () {
                        var ref = (0, _bluebird.coroutine)(regeneratorRuntime.mark(function _callee3(err) {
                            return regeneratorRuntime.wrap(function _callee3$(_context3) {
                                while (1) {
                                    switch (_context3.prev = _context3.next) {
                                        case 0:
                                            if (err) {
                                                _context3.next = 5;
                                                break;
                                            }

                                            _this3._setup = new Setup();
                                            _context3.next = 4;
                                            return _this3._setup.init(path);

                                        case 4:
                                            _this3.checkout();

                                        case 5:
                                        case 'end':
                                            return _context3.stop();
                                    }
                                }
                            }, _callee3, _this3);
                        }));
                        return function (_x3) {
                            return ref.apply(this, arguments);
                        };
                    }());
                } else {
                    new ConfigCLI(path);
                }
            });
        }
    }]);

    return SetupCLI;
}();

module.exports = SetupCLI;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jbGkvc2V0dXAuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFBQSxJQUFJLFdBQVksUUFBUyxVQUFULENBQWhCO0lBQ0ksT0FBWSxRQUFTLE1BQVQsQ0FEaEI7SUFFSSxVQUFZLFFBQVMsVUFBVCxDQUZoQjtJQUdJLFNBQVksUUFBUyxRQUFULENBSGhCO0lBSUksS0FBWSxRQUFRLFlBQVIsQ0FBc0IsUUFBUyxJQUFULENBQXRCLENBSmhCO0lBS0ksUUFBWSxRQUFTLGVBQVQsQ0FMaEI7SUFNSSxZQUFZLFFBQVMsVUFBVCxDQU5oQjtJQU9JLE1BQVksUUFBUyxRQUFULENBUGhCOztBQVNBLElBQU0sV0FBVyxJQUFJLFFBQXJCO0lBQ00sV0FBVyxJQUFJLFFBRHJCO0lBRU0sTUFBVyxHQUZqQjtJQUdNLEtBQVcsR0FIakI7O0FBS0EsSUFBSSxVQUFVLFNBQVYsT0FBVTtBQUFBLFdBQVcsQ0FBQyxDQUFDLE9BQUYsSUFBYSxTQUF4QjtBQUFBLENBQWQ7O0lBRU0sUTtBQUNGLHNCQUFhLEdBQWIsRUFBa0IsR0FBbEIsRUFBd0I7QUFBQTs7QUFDcEIsWUFBSSxZQUFKOztBQUVBLFlBQUssT0FBTyxHQUFaLEVBQWtCO0FBQ2QsZ0JBQUssSUFBSSxPQUFKLENBQWEsTUFBYixNQUEwQixDQUFDLENBQWhDLEVBQW9DO0FBQ2hDLHNCQUFNLEdBQU47QUFDQSxzQkFBTSxHQUFOO0FBQ0Esc0JBQU0sR0FBTjtBQUNIO0FBQ0o7O0FBRUQsYUFBSyxJQUFMLEdBQVksR0FBWjtBQUNBLGFBQUssSUFBTCxHQUFZLEdBQVo7O0FBRUEsYUFBSyxJQUFMO0FBQ0g7Ozs7K0JBRU07QUFBQTs7QUFDSCxxQkFBUyxNQUFULENBQWlCLENBQUU7QUFDZixzQkFBUyxLQURNO0FBRWYseUJBQVMsTUFGTTtBQUdmLHlCQUFTLEtBQUssSUFBTCxJQUFhO0FBSFAsYUFBRixDQUFqQjtBQUFBLDJFQUlLLGlCQUFNLE1BQU47QUFBQSx3QkFDRyxJQURILEVBRUcsT0FGSDtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQ0csd0NBREgsR0FDYSxLQUFLLE9BQUwsQ0FBYyxPQUFPLEdBQXJCLENBRGIsRUFFRyxPQUZILEdBRWEsS0FGYjtBQUFBO0FBQUE7QUFBQSwyQ0FNbUIsR0FBRyxTQUFILENBQWMsSUFBZCxDQU5uQjs7QUFBQTtBQU1HLDJDQU5IO0FBQUE7QUFBQTs7QUFBQTtBQUFBO0FBQUE7O0FBQUE7O0FBVUQsMENBQUssS0FBTCxHQUFhLElBQWI7O0FBRUEsa0RBQWEsSUFBYixFQUFxQixPQUFyQjs7QUFaQyx5Q0FjSSxPQWRKO0FBQUE7QUFBQTtBQUFBOztBQWVHLDBDQUFLLE9BQUw7QUFmSDtBQUFBOztBQUFBO0FBaUJHLDBDQUFLLE1BQUwsR0FBYyxJQUFJLEtBQUosRUFBZDtBQWpCSDtBQUFBLDJDQWtCUyxNQUFLLE1BQUwsQ0FBWSxJQUFaLENBQWtCLElBQWxCLENBbEJUOztBQUFBO0FBbUJHLDBDQUFLLFFBQUw7O0FBbkJIO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLGlCQUpMO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUEwQkg7OzttQ0FFVTtBQUFBOztBQUNQLHFCQUFTLE1BQVQsQ0FBaUIsQ0FBRTtBQUNmLHNCQUFVLFFBREs7QUFFZix5QkFBVSxTQUZLO0FBR2YseUJBQVUsUUFBUSxHQUFSLENBQWEsUUFBYixLQUEyQixFQUh0QjtBQUlmLDBCQUFVO0FBSkssYUFBRixFQUtkO0FBQ0Msc0JBQVUsUUFEWDtBQUVDLHNCQUFVLFFBRlg7QUFHQyx5QkFBVSxRQUhYO0FBSUMsMEJBQVU7QUFKWCxhQUxjLENBQWpCO0FBQUEsMkVBVUssa0JBQU0sTUFBTjtBQUFBLHdCQUNHLFFBREgsRUFFRyxRQUZIO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDRyw0Q0FESCxHQUNjLE9BQVEsUUFBUixDQURkLEVBRUcsUUFGSCxHQUVjLE9BQVEsUUFBUixDQUZkOzs7QUFJRCw0Q0FBUSxHQUFSLENBQWEsUUFBYixFQUF1QixRQUF2QjtBQUpDO0FBQUEsMkNBS0ssT0FBSyxNQUFMLENBQVksY0FBWixDQUE0QixRQUE1QixFQUFzQyxRQUF0QyxFQUFnRCxPQUFLLElBQXJELENBTEw7O0FBQUE7QUFNRCx3Q0FBSSxTQUFKLENBQWUsT0FBSyxLQUFwQjs7QUFOQztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxpQkFWTDtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBa0JIOzs7a0NBRVM7QUFBQTs7QUFDTixxQkFBUyxNQUFULENBQWlCLENBQUU7QUFDZixzQkFBUyxNQURNO0FBRWYsc0JBQVMsVUFGTTtBQUdmLHlCQUFTLGFBSE07QUFJZix5QkFBUyxDQUFFLEdBQUYsRUFBTyxFQUFQLENBSk07QUFLZix5QkFBUztBQUxNLGFBQUYsQ0FBakIsRUFNSyxrQkFBVTtBQUNYLG9CQUFJLE9BQU8sT0FBSyxLQUFoQjs7QUFFQSxvQkFBSyxPQUFPLFFBQVAsS0FBb0IsR0FBekIsRUFBK0I7QUFDM0IsMkJBQVEsSUFBUjtBQUFBLG1GQUFjLGtCQUFNLEdBQU47QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLGdEQUNKLEdBREk7QUFBQTtBQUFBO0FBQUE7O0FBRU4sbURBQUssTUFBTCxHQUFjLElBQUksS0FBSixFQUFkO0FBRk07QUFBQSxtREFHQSxPQUFLLE1BQUwsQ0FBWSxJQUFaLENBQWtCLElBQWxCLENBSEE7O0FBQUE7QUFJTixtREFBSyxRQUFMOztBQUpNO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLHlCQUFkO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFPSCxpQkFSRCxNQVFPO0FBQ0gsd0JBQUksU0FBSixDQUFlLElBQWY7QUFDSDtBQUNKLGFBcEJEO0FBcUJIOzs7Ozs7QUFHTCxPQUFPLE9BQVAsR0FBaUIsUUFBakIiLCJmaWxlIjoic2V0dXAuanMiLCJzb3VyY2VzQ29udGVudCI6WyJsZXQgSW5xdWlyZXIgID0gcmVxdWlyZSggJ2lucXVpcmVyJyApLFxuICAgIFBhdGggICAgICA9IHJlcXVpcmUoICdwYXRoJyApLFxuICAgIFByb21pc2UgICA9IHJlcXVpcmUoICdibHVlYmlyZCcgKSxcbiAgICBSaW1yYWYgICAgPSByZXF1aXJlKCAncmltcmFmJyApLFxuICAgIEZTICAgICAgICA9IFByb21pc2UucHJvbWlzaWZ5QWxsKCByZXF1aXJlKCAnZnMnICkgKSxcbiAgICBTZXR1cCAgICAgPSByZXF1aXJlKCAnLi4vY29yZS9zZXR1cCcgKSxcbiAgICBDb25maWdDTEkgPSByZXF1aXJlKCAnLi9jb25maWcnICksXG4gICAgS2V5ICAgICAgID0gcmVxdWlyZSggJy4uL2tleScgKVxuXG5jb25zdCBVU0VSTkFNRSA9IEtleS51c2VybmFtZSxcbiAgICAgIFBBU1NXT1JEID0gS2V5LnBhc3N3b3JkLFxuICAgICAgWUVTICAgICAgPSAn5pivJyxcbiAgICAgIE5PICAgICAgID0gJ+WQpidcblxubGV0IG5vdE51bGwgPSBjb250ZW50ID0+ICEhY29udGVudCB8fCAn5YaF5a655LiN6IO95Li656m677yBJ1xuXG5jbGFzcyBTZXR1cENMSSB7XG4gICAgY29uc3RydWN0b3IoIGRpciwgdXJsICkge1xuICAgICAgICBsZXQgdG1wXG5cbiAgICAgICAgaWYgKCBkaXIgfHwgdXJsICkge1xuICAgICAgICAgICAgaWYgKCBkaXIuaW5kZXhPZiggJ2h0dHAnICkgIT09IC0xICkge1xuICAgICAgICAgICAgICAgIHRtcCA9IHVybFxuICAgICAgICAgICAgICAgIHVybCA9IGRpclxuICAgICAgICAgICAgICAgIGRpciA9IHRtcFxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5fZGlyID0gZGlyXG4gICAgICAgIHRoaXMuX3VybCA9IHVybFxuXG4gICAgICAgIHRoaXMuaW5pdCgpXG4gICAgfVxuXG4gICAgaW5pdCgpIHtcbiAgICAgICAgSW5xdWlyZXIucHJvbXB0KCBbIHtcbiAgICAgICAgICAgIG5hbWU6ICAgICdkaXInLFxuICAgICAgICAgICAgbWVzc2FnZTogJ+iuvue9ruebruW9lScsXG4gICAgICAgICAgICBkZWZhdWx0OiB0aGlzLl9kaXIgfHwgJ21hc3RlcidcbiAgICAgICAgfSBdLCBhc3luYyBhbnN3ZXIgPT4ge1xuICAgICAgICAgICAgbGV0IHBhdGggICAgPSBQYXRoLnJlc29sdmUoIGFuc3dlci5kaXIgKSxcbiAgICAgICAgICAgICAgICBpc0V4aXN0ID0gZmFsc2VcblxuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAvL2h0dHBzOi8vZ2l0aHViLmNvbS9wZXRrYWFudG9ub3YvYmx1ZWJpcmQvYmxvYi9tYXN0ZXIvQVBJLm1kI3Byb21pc2lmaWNhdGlvblxuICAgICAgICAgICAgICAgIGlzRXhpc3QgPSBhd2FpdCBGUy5zdGF0QXN5bmMoIHBhdGggKVxuICAgICAgICAgICAgfSBjYXRjaCAoIGUgKSB7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMuX3BhdGggPSBwYXRoXG5cbiAgICAgICAgICAgIGxvZyggYOebruW9leWcsOWdgDoke3BhdGh9YCwgJ2RlYnVnJyApXG5cbiAgICAgICAgICAgIGlmICggaXNFeGlzdCApIHtcbiAgICAgICAgICAgICAgICB0aGlzLmNsZWFudXAoKVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9zZXR1cCA9IG5ldyBTZXR1cCgpXG4gICAgICAgICAgICAgICAgYXdhaXQgdGhpcy5fc2V0dXAuaW5pdCggcGF0aCApXG4gICAgICAgICAgICAgICAgdGhpcy5jaGVja291dCgpXG4gICAgICAgICAgICB9XG4gICAgICAgIH0gKVxuICAgIH1cblxuICAgIGNoZWNrb3V0KCkge1xuICAgICAgICBJbnF1aXJlci5wcm9tcHQoIFsge1xuICAgICAgICAgICAgbmFtZTogICAgIFVTRVJOQU1FLFxuICAgICAgICAgICAgbWVzc2FnZTogICdTVk4g55So5oi35ZCNJyxcbiAgICAgICAgICAgIGRlZmF1bHQ6ICBQcm9maWxlLmdldCggVVNFUk5BTUUgKSB8fCAnJyxcbiAgICAgICAgICAgIHZhbGlkYXRlOiBub3ROdWxsXG4gICAgICAgIH0sIHtcbiAgICAgICAgICAgIHR5cGU6ICAgICBQQVNTV09SRCxcbiAgICAgICAgICAgIG5hbWU6ICAgICBQQVNTV09SRCxcbiAgICAgICAgICAgIG1lc3NhZ2U6ICAnU1ZOIOWvhueggScsXG4gICAgICAgICAgICB2YWxpZGF0ZTogbm90TnVsbFxuICAgICAgICB9IF0sIGFzeW5jIGFuc3dlciA9PiB7XG4gICAgICAgICAgICBsZXQgdXNlcm5hbWUgPSBhbnN3ZXJbIFVTRVJOQU1FIF0sXG4gICAgICAgICAgICAgICAgcGFzc3dvcmQgPSBhbnN3ZXJbIFBBU1NXT1JEIF1cblxuICAgICAgICAgICAgUHJvZmlsZS5zZXQoIFVTRVJOQU1FLCB1c2VybmFtZSApXG4gICAgICAgICAgICBhd2FpdCB0aGlzLl9zZXR1cC5jaGVja291dFNvdXJjZSggdXNlcm5hbWUsIHBhc3N3b3JkLCB0aGlzLl91cmwgKVxuICAgICAgICAgICAgbmV3IENvbmZpZ0NMSSggdGhpcy5fcGF0aCApXG4gICAgICAgIH0gKVxuICAgIH1cblxuICAgIGNsZWFudXAoKSB7XG4gICAgICAgIElucXVpcmVyLnByb21wdCggWyB7XG4gICAgICAgICAgICB0eXBlOiAgICAnbGlzdCcsXG4gICAgICAgICAgICBuYW1lOiAgICAnb3ZlcnJpZGUnLFxuICAgICAgICAgICAgbWVzc2FnZTogJ+aWh+S7tuWkueW3suWtmOWcqO+8jOaYr+WQpuimhueblicsXG4gICAgICAgICAgICBjaG9pY2VzOiBbIFlFUywgTk8gXSxcbiAgICAgICAgICAgIGRlZmF1bHQ6IE5PXG4gICAgICAgIH0gXSwgYW5zd2VyID0+IHtcbiAgICAgICAgICAgIGxldCBwYXRoID0gdGhpcy5fcGF0aFxuXG4gICAgICAgICAgICBpZiAoIGFuc3dlci5vdmVycmlkZSA9PT0gWUVTICkge1xuICAgICAgICAgICAgICAgIFJpbXJhZiggcGF0aCwgYXN5bmMgZXJyID0+IHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCAhZXJyICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fc2V0dXAgPSBuZXcgU2V0dXAoKVxuICAgICAgICAgICAgICAgICAgICAgICAgYXdhaXQgdGhpcy5fc2V0dXAuaW5pdCggcGF0aCApXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNoZWNrb3V0KClcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gKVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBuZXcgQ29uZmlnQ0xJKCBwYXRoIClcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSApXG4gICAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFNldHVwQ0xJXG4iXX0=