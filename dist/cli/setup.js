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
            }]).then(function () {
                var _ref = (0, _bluebird.coroutine)(regeneratorRuntime.mark(function _callee(answer) {
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

                                    log(`目录地址:${path}`, 'debug');

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
                    return _ref.apply(this, arguments);
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
            }]).then(function () {
                var _ref2 = (0, _bluebird.coroutine)(regeneratorRuntime.mark(function _callee2(answer) {
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
                    return _ref2.apply(this, arguments);
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
            }]).then(function (answer) {
                var path = _this3._path;

                if (answer.override === YES) {
                    Rimraf(path, function () {
                        var _ref3 = (0, _bluebird.coroutine)(regeneratorRuntime.mark(function _callee3(err) {
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
                            return _ref3.apply(this, arguments);
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