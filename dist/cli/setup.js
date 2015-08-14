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
            var _this = this;

            Inquirer.prompt([{
                name: 'dir',
                message: '设置目录',
                'default': this._dir || 'master'
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
                yield _this2._setup.checkoutSource(username, password, _this2._url);
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
//# sourceMappingURL=data:application/json;base64,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QUUsSUFBSSxDQUFFLENBQUE7aUJBQ3hCO2FBQ0osQ0FBRSxDQUFBO1NBQ047OztXQTFGQyxRQUFROzs7QUE2RmQsTUFBTSxDQUFDLE9BQU8sR0FBRyxRQUFRLENBQUEiLCJmaWxlIjoiY2xpL3NldHVwLmpzIiwic291cmNlc0NvbnRlbnQiOlsibGV0IElucXVpcmVyICA9IHJlcXVpcmUoICdpbnF1aXJlcicgKSxcbiAgICBQYXRoICAgICAgPSByZXF1aXJlKCAncGF0aCcgKSxcbiAgICBQcm9taXNlICAgPSByZXF1aXJlKCAnYmx1ZWJpcmQnICksXG4gICAgUmltcmFmICAgID0gcmVxdWlyZSggJ3JpbXJhZicgKSxcbiAgICBGUyAgICAgICAgPSBQcm9taXNlLnByb21pc2lmeUFsbCggcmVxdWlyZSggJ2ZzJyApICksXG4gICAgU2V0dXAgICAgID0gcmVxdWlyZSggJy4uL2NvcmUvc2V0dXAnICksXG4gICAgQ29uZmlnQ0xJID0gcmVxdWlyZSggJy4vY29uZmlnJyApLFxuICAgIEtleSAgICAgICA9IHJlcXVpcmUoICcuLi9rZXknIClcblxuY29uc3QgVVNFUk5BTUUgPSBLZXkudXNlcm5hbWUsXG4gICAgICBQQVNTV09SRCA9IEtleS5wYXNzd29yZCxcbiAgICAgIFlFUyAgICAgID0gJ+aYrycsXG4gICAgICBOTyAgICAgICA9ICflkKYnXG5cbmxldCBub3ROdWxsID0gY29udGVudCA9PiAhIWNvbnRlbnQgfHwgJ+WGheWuueS4jeiDveS4uuepuu+8gSdcblxuY2xhc3MgU2V0dXBDTEkge1xuICAgIGNvbnN0cnVjdG9yKCBkaXIsIHVybCApIHtcbiAgICAgICAgbGV0IHRtcFxuXG4gICAgICAgIGlmICggZGlyIHx8IHVybCApIHtcbiAgICAgICAgICAgIGlmICggZGlyLmluZGV4T2YoICdodHRwJyApICE9PSAtMSApIHtcbiAgICAgICAgICAgICAgICB0bXAgPSB1cmxcbiAgICAgICAgICAgICAgICB1cmwgPSBkaXJcbiAgICAgICAgICAgICAgICBkaXIgPSB0bXBcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuX2RpciA9IGRpclxuICAgICAgICB0aGlzLl91cmwgPSB1cmxcblxuICAgICAgICB0aGlzLmluaXQoKVxuICAgIH1cblxuICAgIGluaXQoKSB7XG4gICAgICAgIElucXVpcmVyLnByb21wdCggWyB7XG4gICAgICAgICAgICBuYW1lOiAgICAnZGlyJyxcbiAgICAgICAgICAgIG1lc3NhZ2U6ICforr7nva7nm67lvZUnLFxuICAgICAgICAgICAgZGVmYXVsdDogdGhpcy5fZGlyIHx8ICdtYXN0ZXInXG4gICAgICAgIH0gXSwgYXN5bmMgYW5zd2VyID0+IHtcbiAgICAgICAgICAgIGxldCBwYXRoICAgID0gUGF0aC5yZXNvbHZlKCBhbnN3ZXIuZGlyICksXG4gICAgICAgICAgICAgICAgaXNFeGlzdCA9IGZhbHNlXG5cbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgLy9odHRwczovL2dpdGh1Yi5jb20vcGV0a2FhbnRvbm92L2JsdWViaXJkL2Jsb2IvbWFzdGVyL0FQSS5tZCNwcm9taXNpZmljYXRpb25cbiAgICAgICAgICAgICAgICBpc0V4aXN0ID0gYXdhaXQgRlMuc3RhdEFzeW5jKCBwYXRoIClcbiAgICAgICAgICAgIH0gY2F0Y2ggKCBlICkge1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLl9wYXRoID0gcGF0aFxuXG4gICAgICAgICAgICBsb2coIGDnm67lvZXlnLDlnYA6JHtwYXRofWAsICdkZWJ1ZycgKVxuXG4gICAgICAgICAgICBpZiAoIGlzRXhpc3QgKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5jbGVhbnVwKClcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fc2V0dXAgPSBuZXcgU2V0dXAoKVxuICAgICAgICAgICAgICAgIGF3YWl0IHRoaXMuX3NldHVwLmluaXQoIHBhdGggKVxuICAgICAgICAgICAgICAgIHRoaXMuY2hlY2tvdXQoKVxuICAgICAgICAgICAgfVxuICAgICAgICB9IClcbiAgICB9XG5cbiAgICBjaGVja291dCgpIHtcbiAgICAgICAgSW5xdWlyZXIucHJvbXB0KCBbIHtcbiAgICAgICAgICAgIG5hbWU6ICAgICBVU0VSTkFNRSxcbiAgICAgICAgICAgIG1lc3NhZ2U6ICAnU1ZOIOeUqOaIt+WQjScsXG4gICAgICAgICAgICBkZWZhdWx0OiAgUHJvZmlsZS5nZXQoIFVTRVJOQU1FICkgfHwgJycsXG4gICAgICAgICAgICB2YWxpZGF0ZTogbm90TnVsbFxuICAgICAgICB9LCB7XG4gICAgICAgICAgICB0eXBlOiAgICAgUEFTU1dPUkQsXG4gICAgICAgICAgICBuYW1lOiAgICAgUEFTU1dPUkQsXG4gICAgICAgICAgICBtZXNzYWdlOiAgJ1NWTiDlr4bnoIEnLFxuICAgICAgICAgICAgdmFsaWRhdGU6IG5vdE51bGxcbiAgICAgICAgfSBdLCBhc3luYyBhbnN3ZXIgPT4ge1xuICAgICAgICAgICAgbGV0IHVzZXJuYW1lID0gYW5zd2VyWyBVU0VSTkFNRSBdLFxuICAgICAgICAgICAgICAgIHBhc3N3b3JkID0gYW5zd2VyWyBQQVNTV09SRCBdXG5cbiAgICAgICAgICAgIFByb2ZpbGUuc2V0KCBVU0VSTkFNRSwgdXNlcm5hbWUgKVxuICAgICAgICAgICAgYXdhaXQgdGhpcy5fc2V0dXAuY2hlY2tvdXRTb3VyY2UoIHVzZXJuYW1lLCBwYXNzd29yZCwgdGhpcy5fdXJsIClcbiAgICAgICAgICAgIG5ldyBDb25maWdDTEkoIHRoaXMuX3BhdGggKVxuICAgICAgICB9IClcbiAgICB9XG5cbiAgICBjbGVhbnVwKCkge1xuICAgICAgICBJbnF1aXJlci5wcm9tcHQoIFsge1xuICAgICAgICAgICAgdHlwZTogICAgJ2xpc3QnLFxuICAgICAgICAgICAgbmFtZTogICAgJ292ZXJyaWRlJyxcbiAgICAgICAgICAgIG1lc3NhZ2U6ICfmlofku7blpLnlt7LlrZjlnKjvvIzmmK/lkKbopobnm5YnLFxuICAgICAgICAgICAgY2hvaWNlczogWyBZRVMsIE5PIF0sXG4gICAgICAgICAgICBkZWZhdWx0OiBOT1xuICAgICAgICB9IF0sIGFuc3dlciA9PiB7XG4gICAgICAgICAgICBsZXQgcGF0aCA9IHRoaXMuX3BhdGhcblxuICAgICAgICAgICAgaWYgKCBhbnN3ZXIub3ZlcnJpZGUgPT09IFlFUyApIHtcbiAgICAgICAgICAgICAgICBSaW1yYWYoIHBhdGgsIGFzeW5jIGVyciA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlmICggIWVyciApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX3NldHVwID0gbmV3IFNldHVwKClcbiAgICAgICAgICAgICAgICAgICAgICAgIGF3YWl0IHRoaXMuX3NldHVwLmluaXQoIHBhdGggKVxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jaGVja291dCgpXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IClcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgbmV3IENvbmZpZ0NMSSggcGF0aCApXG4gICAgICAgICAgICB9XG4gICAgICAgIH0gKVxuICAgIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBTZXR1cENMSVxuIl19