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
    PASSWORD = Key.password,
    YES = '是',
    NO = '否';

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
                type: 'list',
                name: 'override',
                message: '文件夹已存在，是否覆盖',
                choices: [YES, NO],
                'default': NO
            }], function (answer) {
                var path = _this3._path;

                if (answer.override === YES) {
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
//# sourceMappingURL=data:application/json;base64,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T0FBSyxLQUFLLENBQUUsQ0FBQTthQUM5QixFQUFFLENBQUE7U0FDTjs7O2VBRU0sbUJBQUc7OztBQUNOLG9CQUFRLENBQUMsTUFBTSxDQUFFLENBQUU7QUFDZixvQkFBSSxFQUFFLE1BQU07QUFDWixvQkFBSSxFQUFFLFVBQVU7QUFDaEIsdUJBQU8sRUFBRSxhQUFhO0FBQ3RCLHVCQUFPLEVBQUUsQ0FBRSxHQUFHLEVBQUUsRUFBRSxDQUFFO0FBQ3BCLDJCQUFTLEVBQUU7YUFDZCxDQUFFLEVBQUUsVUFBQSxNQUFNLEVBQUk7QUFDWCxvQkFBSSxJQUFJLEdBQUcsT0FBSyxLQUFLLENBQUE7O0FBRXJCLG9CQUFLLE1BQU0sQ0FBQyxRQUFRLEtBQUssR0FBRyxFQUFHO0FBQzNCLDBCQUFNLENBQUUsSUFBSSxzQkFBRSxXQUFNLEdBQUcsRUFBSTtBQUN2Qiw0QkFBSyxDQUFDLEdBQUcsRUFBRztBQUNSLG1DQUFLLE1BQU0sR0FBRyxJQUFJLEtBQUssRUFBRSxDQUFBO0FBQ3pCLGtDQUFNLE9BQUssTUFBTSxDQUFDLElBQUksQ0FBRSxJQUFJLENBQUUsQ0FBQTtBQUM5QixtQ0FBSyxRQUFRLEVBQUUsQ0FBQTt5QkFDbEI7cUJBQ0osRUFBRSxDQUFBO2lCQUNOLE1BQU07QUFDSCx3QkFBSSxTQUFTLENBQUUsSUFBSSxDQUFFLENBQUE7aUJBQ3hCO2FBQ0osQ0FBRSxDQUFBO1NBQ047OztXQTdFQyxRQUFROzs7QUFnRmQsTUFBTSxDQUFDLE9BQU8sR0FBRyxRQUFRLENBQUEiLCJmaWxlIjoiY2xpL3NldHVwLmpzIiwic291cmNlc0NvbnRlbnQiOlsibGV0IElucXVpcmVyICA9IHJlcXVpcmUoICdpbnF1aXJlcicgKSxcbiAgICBQYXRoICAgICAgPSByZXF1aXJlKCAncGF0aCcgKSxcbiAgICBQcm9taXNlICAgPSByZXF1aXJlKCAnYmx1ZWJpcmQnICksXG4gICAgUmltcmFmICAgID0gcmVxdWlyZSggJ3JpbXJhZicgKSxcbiAgICBGUyAgICAgICAgPSBQcm9taXNlLnByb21pc2lmeUFsbCggcmVxdWlyZSggJ2ZzJyApICksXG4gICAgU2V0dXAgICAgID0gcmVxdWlyZSggJy4uL2NvcmUvc2V0dXAnICksXG4gICAgQ29uZmlnQ0xJID0gcmVxdWlyZSggJy4vY29uZmlnJyApLFxuICAgIEtleSAgICAgICA9IHJlcXVpcmUoICcuLi9rZXknIClcblxuY29uc3QgVVNFUk5BTUUgPSBLZXkudXNlcm5hbWUsXG4gICAgICBQQVNTV09SRCA9IEtleS5wYXNzd29yZCxcbiAgICAgIFlFUyAgICAgID0gJ+aYrycsXG4gICAgICBOTyAgICAgICA9ICflkKYnXG5cbmxldCBub3ROdWxsID0gY29udGVudCA9PiAhIWNvbnRlbnQgfHwgJ+WGheWuueS4jeiDveS4uuepuu+8gSdcblxuY2xhc3MgU2V0dXBDTEkge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICB0aGlzLmluaXQoKVxuICAgIH1cblxuICAgIGluaXQoKSB7XG4gICAgICAgIElucXVpcmVyLnByb21wdCggWyB7XG4gICAgICAgICAgICBuYW1lOiAnZGlyJyxcbiAgICAgICAgICAgIG1lc3NhZ2U6ICforr7nva7nm67lvZUnLFxuICAgICAgICAgICAgZGVmYXVsdDogJ21hc3RlcidcbiAgICAgICAgfSBdLCBhc3luYyBhbnN3ZXIgPT4ge1xuICAgICAgICAgICAgbGV0IHBhdGggICAgPSBQYXRoLnJlc29sdmUoIGFuc3dlci5kaXIgKSxcbiAgICAgICAgICAgICAgICBpc0V4aXN0ID0gZmFsc2VcblxuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAvL2h0dHBzOi8vZ2l0aHViLmNvbS9wZXRrYWFudG9ub3YvYmx1ZWJpcmQvYmxvYi9tYXN0ZXIvQVBJLm1kI3Byb21pc2lmaWNhdGlvblxuICAgICAgICAgICAgICAgIGlzRXhpc3QgPSBhd2FpdCBGUy5zdGF0QXN5bmMoIHBhdGggKVxuICAgICAgICAgICAgfSBjYXRjaCAoIGUgKSB7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMuX3BhdGggPSBwYXRoXG5cbiAgICAgICAgICAgIGxvZyggYOebruW9leWcsOWdgDoke3BhdGh9YCwgJ2RlYnVnJyApXG5cbiAgICAgICAgICAgIGlmICggaXNFeGlzdCApIHtcbiAgICAgICAgICAgICAgICB0aGlzLmNsZWFudXAoKVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9zZXR1cCA9IG5ldyBTZXR1cCgpXG4gICAgICAgICAgICAgICAgYXdhaXQgdGhpcy5fc2V0dXAuaW5pdCggcGF0aCApXG4gICAgICAgICAgICAgICAgdGhpcy5jaGVja291dCgpXG4gICAgICAgICAgICB9XG4gICAgICAgIH0gKVxuICAgIH1cblxuICAgIGNoZWNrb3V0KCkge1xuICAgICAgICBJbnF1aXJlci5wcm9tcHQoIFsge1xuICAgICAgICAgICAgbmFtZTogVVNFUk5BTUUsXG4gICAgICAgICAgICBtZXNzYWdlOiAnU1ZOIOeUqOaIt+WQjScsXG4gICAgICAgICAgICBkZWZhdWx0OiBQcm9maWxlLmdldCggVVNFUk5BTUUgKSB8fCAnJyxcbiAgICAgICAgICAgIHZhbGlkYXRlOiBub3ROdWxsXG4gICAgICAgIH0sIHtcbiAgICAgICAgICAgIHR5cGU6IFBBU1NXT1JELFxuICAgICAgICAgICAgbmFtZTogUEFTU1dPUkQsXG4gICAgICAgICAgICBtZXNzYWdlOiAnU1ZOIOWvhueggScsXG4gICAgICAgICAgICB2YWxpZGF0ZTogbm90TnVsbFxuICAgICAgICB9IF0sIGFzeW5jIGFuc3dlciA9PiB7XG4gICAgICAgICAgICBsZXQgdXNlcm5hbWUgPSBhbnN3ZXJbIFVTRVJOQU1FIF0sXG4gICAgICAgICAgICAgICAgcGFzc3dvcmQgPSBhbnN3ZXJbIFBBU1NXT1JEIF1cblxuICAgICAgICAgICAgUHJvZmlsZS5zZXQoIFVTRVJOQU1FLCB1c2VybmFtZSApXG4gICAgICAgICAgICBhd2FpdCB0aGlzLl9zZXR1cC5jaGVja291dFNvdXJjZSggdXNlcm5hbWUsIHBhc3N3b3JkIClcbiAgICAgICAgICAgIG5ldyBDb25maWdDTEkoIHRoaXMuX3BhdGggKVxuICAgICAgICB9IClcbiAgICB9XG5cbiAgICBjbGVhbnVwKCkge1xuICAgICAgICBJbnF1aXJlci5wcm9tcHQoIFsge1xuICAgICAgICAgICAgdHlwZTogJ2xpc3QnLFxuICAgICAgICAgICAgbmFtZTogJ292ZXJyaWRlJyxcbiAgICAgICAgICAgIG1lc3NhZ2U6ICfmlofku7blpLnlt7LlrZjlnKjvvIzmmK/lkKbopobnm5YnLFxuICAgICAgICAgICAgY2hvaWNlczogWyBZRVMsIE5PIF0sXG4gICAgICAgICAgICBkZWZhdWx0OiBOT1xuICAgICAgICB9IF0sIGFuc3dlciA9PiB7XG4gICAgICAgICAgICBsZXQgcGF0aCA9IHRoaXMuX3BhdGhcblxuICAgICAgICAgICAgaWYgKCBhbnN3ZXIub3ZlcnJpZGUgPT09IFlFUyApIHtcbiAgICAgICAgICAgICAgICBSaW1yYWYoIHBhdGgsIGFzeW5jIGVyciA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlmICggIWVyciApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX3NldHVwID0gbmV3IFNldHVwKClcbiAgICAgICAgICAgICAgICAgICAgICAgIGF3YWl0IHRoaXMuX3NldHVwLmluaXQoIHBhdGggKVxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jaGVja291dCgpXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IClcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgbmV3IENvbmZpZ0NMSSggcGF0aCApXG4gICAgICAgICAgICB9XG4gICAgICAgIH0gKVxuICAgIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBTZXR1cENMSVxuIl19