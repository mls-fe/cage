'use strict';

var _bluebird = require('bluebird');

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var Inquirer = require('inquirer'),
    Path = require('path'),
    Promise = require('bluebird'),
    Rimraf = require('rimraf'),
    FS = Promise.promisifyAll(require('fs')),
    Setup = require('../core/setup'),
    ConfigCLI = require('./config'),
    Key = require('../key');

var USERNAME = Key.username,
    PASSWORD = Key.password;

var notNull = function notNull(content) {
    return !!content || '内容不能为空！';
};

var SetupCLI = (function () {
    function SetupCLI() {
        _classCallCheck(this, SetupCLI);

        this.init();
    }

    _createClass(SetupCLI, [{
        key: 'init',
        value: function init() {
            var _this = this;

            Inquirer.prompt([{
                name: 'dir',
                message: '设置目录',
                'default': 'master'
            }], _bluebird.coroutine(function* (answer) {
                var path = Path.resolve(answer.dir),
                    isExist = false;

                try {
                    //https://github.com/petkaantonov/bluebird/blob/master/API.md#promisification
                    isExist = yield FS.statAsync(path);
                } catch (e) {}

                _this._path = path;

                log('目录地址:' + path, 'debug');

                if (isExist) {
                    _this.cleanup();
                } else {
                    _this._setup = new Setup();
                    yield _this._setup.init(path);
                    _this.checkout();
                }
            }));
        }
    }, {
        key: 'checkout',
        value: function checkout() {
            var _this2 = this;

            Inquirer.prompt([{
                name: USERNAME,
                message: 'SVN 用户名',
                'default': Profile.get(USERNAME) || '',
                validate: notNull
            }, {
                type: PASSWORD,
                name: PASSWORD,
                message: 'SVN 密码',
                validate: notNull
            }], _bluebird.coroutine(function* (answer) {
                var username = answer[USERNAME],
                    password = answer[PASSWORD];

                Profile.set(USERNAME, username);
                yield _this2._setup.checkoutSource(username, password);
                new ConfigCLI(_this2._path);
            }));
        }
    }, {
        key: 'cleanup',
        value: function cleanup() {
            var _this3 = this;

            Inquirer.prompt([{
                type: 'confirm',
                name: 'override',
                message: '文件夹已存在，是否覆盖',
                'default': false
            }], function (answer) {
                var path = _this3._path;

                if (answer.override) {
                    Rimraf(path, _bluebird.coroutine(function* (err) {
                        if (!err) {
                            _this3._setup = new Setup();
                            yield _this3._setup.init(path);
                            _this3.checkout();
                        }
                    }));
                } else {
                    new ConfigCLI(path);
                }
            });
        }
    }]);

    return SetupCLI;
})();

module.exports = SetupCLI;
//# sourceMappingURL=data:application/json;base64,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OztlQUVNLG1CQUFHOzs7QUFDTixvQkFBUSxDQUFDLE1BQU0sQ0FBRSxDQUFFO0FBQ2Ysb0JBQUksRUFBRSxTQUFTO0FBQ2Ysb0JBQUksRUFBRSxVQUFVO0FBQ2hCLHVCQUFPLEVBQUUsYUFBYTtBQUN0QiwyQkFBUyxLQUFLO2FBQ2pCLENBQUUsRUFBRSxVQUFBLE1BQU0sRUFBSTtBQUNYLG9CQUFJLElBQUksR0FBRyxPQUFLLEtBQUssQ0FBQTs7QUFFckIsb0JBQUssTUFBTSxDQUFDLFFBQVEsRUFBRztBQUNuQiwwQkFBTSxDQUFFLElBQUksc0JBQUUsV0FBTSxHQUFHLEVBQUk7QUFDdkIsNEJBQUssQ0FBQyxHQUFHLEVBQUc7QUFDUixtQ0FBSyxNQUFNLEdBQUcsSUFBSSxLQUFLLEVBQUUsQ0FBQTtBQUN6QixrQ0FBTSxPQUFLLE1BQU0sQ0FBQyxJQUFJLENBQUUsSUFBSSxDQUFFLENBQUE7QUFDOUIsbUNBQUssUUFBUSxFQUFFLENBQUE7eUJBQ2xCO3FCQUNKLEVBQUUsQ0FBQTtpQkFDTixNQUFNO0FBQ0gsd0JBQUksU0FBUyxDQUFFLElBQUksQ0FBRSxDQUFBO2lCQUN4QjthQUNKLENBQUUsQ0FBQTtTQUNOOzs7V0E1RUMsUUFBUTs7O0FBK0VkLE1BQU0sQ0FBQyxPQUFPLEdBQUcsUUFBUSxDQUFBIiwiZmlsZSI6ImNsaS9zZXR1cC5qcyIsInNvdXJjZXNDb250ZW50IjpbImxldCBJbnF1aXJlciAgPSByZXF1aXJlKCAnaW5xdWlyZXInICksXG4gICAgUGF0aCAgICAgID0gcmVxdWlyZSggJ3BhdGgnICksXG4gICAgUHJvbWlzZSAgID0gcmVxdWlyZSggJ2JsdWViaXJkJyApLFxuICAgIFJpbXJhZiAgICA9IHJlcXVpcmUoICdyaW1yYWYnICksXG4gICAgRlMgICAgICAgID0gUHJvbWlzZS5wcm9taXNpZnlBbGwoIHJlcXVpcmUoICdmcycgKSApLFxuICAgIFNldHVwICAgICA9IHJlcXVpcmUoICcuLi9jb3JlL3NldHVwJyApLFxuICAgIENvbmZpZ0NMSSA9IHJlcXVpcmUoICcuL2NvbmZpZycgKSxcbiAgICBLZXkgICAgICAgPSByZXF1aXJlKCAnLi4va2V5JyApXG5cbmNvbnN0IFVTRVJOQU1FID0gS2V5LnVzZXJuYW1lLFxuICAgICAgUEFTU1dPUkQgPSBLZXkucGFzc3dvcmRcblxubGV0IG5vdE51bGwgPSBjb250ZW50ID0+ICEhY29udGVudCB8fCAn5YaF5a655LiN6IO95Li656m677yBJ1xuXG5jbGFzcyBTZXR1cENMSSB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHRoaXMuaW5pdCgpXG4gICAgfVxuXG4gICAgaW5pdCgpIHtcbiAgICAgICAgSW5xdWlyZXIucHJvbXB0KCBbIHtcbiAgICAgICAgICAgIG5hbWU6ICdkaXInLFxuICAgICAgICAgICAgbWVzc2FnZTogJ+iuvue9ruebruW9lScsXG4gICAgICAgICAgICBkZWZhdWx0OiAnbWFzdGVyJ1xuICAgICAgICB9IF0sIGFzeW5jIGFuc3dlciA9PiB7XG4gICAgICAgICAgICBsZXQgcGF0aCAgICA9IFBhdGgucmVzb2x2ZSggYW5zd2VyLmRpciApLFxuICAgICAgICAgICAgICAgIGlzRXhpc3QgPSBmYWxzZVxuXG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIC8vaHR0cHM6Ly9naXRodWIuY29tL3BldGthYW50b25vdi9ibHVlYmlyZC9ibG9iL21hc3Rlci9BUEkubWQjcHJvbWlzaWZpY2F0aW9uXG4gICAgICAgICAgICAgICAgaXNFeGlzdCA9IGF3YWl0IEZTLnN0YXRBc3luYyggcGF0aCApXG4gICAgICAgICAgICB9IGNhdGNoICggZSApIHtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5fcGF0aCA9IHBhdGhcblxuICAgICAgICAgICAgbG9nKCBg55uu5b2V5Zyw5Z2AOiR7cGF0aH1gLCAnZGVidWcnIClcblxuICAgICAgICAgICAgaWYgKCBpc0V4aXN0ICkge1xuICAgICAgICAgICAgICAgIHRoaXMuY2xlYW51cCgpXG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuX3NldHVwID0gbmV3IFNldHVwKClcbiAgICAgICAgICAgICAgICBhd2FpdCB0aGlzLl9zZXR1cC5pbml0KCBwYXRoIClcbiAgICAgICAgICAgICAgICB0aGlzLmNoZWNrb3V0KClcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSApXG4gICAgfVxuXG4gICAgY2hlY2tvdXQoKSB7XG4gICAgICAgIElucXVpcmVyLnByb21wdCggWyB7XG4gICAgICAgICAgICBuYW1lOiBVU0VSTkFNRSxcbiAgICAgICAgICAgIG1lc3NhZ2U6ICdTVk4g55So5oi35ZCNJyxcbiAgICAgICAgICAgIGRlZmF1bHQ6IFByb2ZpbGUuZ2V0KCBVU0VSTkFNRSApIHx8ICcnLFxuICAgICAgICAgICAgdmFsaWRhdGU6IG5vdE51bGxcbiAgICAgICAgfSwge1xuICAgICAgICAgICAgdHlwZTogUEFTU1dPUkQsXG4gICAgICAgICAgICBuYW1lOiBQQVNTV09SRCxcbiAgICAgICAgICAgIG1lc3NhZ2U6ICdTVk4g5a+G56CBJyxcbiAgICAgICAgICAgIHZhbGlkYXRlOiBub3ROdWxsXG4gICAgICAgIH0gXSwgYXN5bmMgYW5zd2VyID0+IHtcbiAgICAgICAgICAgIGxldCB1c2VybmFtZSA9IGFuc3dlclsgVVNFUk5BTUUgXSxcbiAgICAgICAgICAgICAgICBwYXNzd29yZCA9IGFuc3dlclsgUEFTU1dPUkQgXVxuXG4gICAgICAgICAgICBQcm9maWxlLnNldCggVVNFUk5BTUUsIHVzZXJuYW1lIClcbiAgICAgICAgICAgIGF3YWl0IHRoaXMuX3NldHVwLmNoZWNrb3V0U291cmNlKCB1c2VybmFtZSwgcGFzc3dvcmQgKVxuICAgICAgICAgICAgbmV3IENvbmZpZ0NMSSggdGhpcy5fcGF0aCApXG4gICAgICAgIH0gKVxuICAgIH1cblxuICAgIGNsZWFudXAoKSB7XG4gICAgICAgIElucXVpcmVyLnByb21wdCggWyB7XG4gICAgICAgICAgICB0eXBlOiAnY29uZmlybScsXG4gICAgICAgICAgICBuYW1lOiAnb3ZlcnJpZGUnLFxuICAgICAgICAgICAgbWVzc2FnZTogJ+aWh+S7tuWkueW3suWtmOWcqO+8jOaYr+WQpuimhueblicsXG4gICAgICAgICAgICBkZWZhdWx0OiBmYWxzZVxuICAgICAgICB9IF0sIGFuc3dlciA9PiB7XG4gICAgICAgICAgICBsZXQgcGF0aCA9IHRoaXMuX3BhdGhcblxuICAgICAgICAgICAgaWYgKCBhbnN3ZXIub3ZlcnJpZGUgKSB7XG4gICAgICAgICAgICAgICAgUmltcmFmKCBwYXRoLCBhc3luYyBlcnIgPT4ge1xuICAgICAgICAgICAgICAgICAgICBpZiAoICFlcnIgKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9zZXR1cCA9IG5ldyBTZXR1cCgpXG4gICAgICAgICAgICAgICAgICAgICAgICBhd2FpdCB0aGlzLl9zZXR1cC5pbml0KCBwYXRoIClcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY2hlY2tvdXQoKVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSApXG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIG5ldyBDb25maWdDTEkoIHBhdGggKVxuICAgICAgICAgICAgfVxuICAgICAgICB9IClcbiAgICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gU2V0dXBDTElcbiJdfQ==