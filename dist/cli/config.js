'use strict';

var _bluebird = require('bluebird');

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Inquirer = require('inquirer'),
    Path = require('path'),
    Config = require('../core/config'),
    WorkSpace = require('../core/workspace'),
    Slogan = require('../slogan'),
    Util = require('../util'),
    Key = require('../key'),
    Indicator = Util.indicator,
    defaultPhases = ['configPort', 'configDomain', 'configProxy', 'configAddress', 'finish'];

var RANDOM = Key.random,
    NORMAL = Key.normal,
    YES = '是',
    NO = '否',
    N = 'n',
    HINT = `
域名格式:
  xxx pc
xxx 是你自定义的名字, 不要和其他人重复了
pc 是业务名称, 目前可配置 pc 与 wap
设置完毕后, 可以使用访问 http://xxx.fedevot.meilishuo.com

举例：

我希望 http://szdp.fedevot.meilishuo.com 来访问本地的 pc 服务，那么我应该输入：

szdp pc

如果已经设置完毕，或者不小心进入该步骤，可以输入字母 n 跳过。
`;

var ConfigCLI = function () {
    function ConfigCLI(path) {
        _classCallCheck(this, ConfigCLI);

        this.init(Path.resolve(path));
        this._domains = [];
    }

    _createClass(ConfigCLI, [{
        key: 'init',
        value: function () {
            var _ref = (0, _bluebird.coroutine)(regeneratorRuntime.mark(function _callee(path) {
                var _this = this;

                var phases, next, isValid;
                return regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                phases = defaultPhases.concat(), next = function next() {
                                    var phase = phases.shift();
                                    if (phase) {
                                        _this[phase](next);
                                    }
                                };
                                _context.next = 3;
                                return WorkSpace.isValidWorkSpace(path);

                            case 3:
                                isValid = _context.sent;

                                if (isValid) {
                                    _context.next = 7;
                                    break;
                                }

                                log(`${path} 不是合法的工作空间！请重新指定`, 'warn');
                                return _context.abrupt('return');

                            case 7:
                                this.config = new Config(path);

                                next();

                            case 9:
                            case 'end':
                                return _context.stop();
                        }
                    }
                }, _callee, this);
            }));

            function init(_x) {
                return _ref.apply(this, arguments);
            }

            return init;
        }()
    }, {
        key: 'configPort',
        value: function configPort(next) {
            var _this2 = this;

            Inquirer.prompt([{
                type: 'list',
                name: 'portOption',
                message: '选择端口号',
                choices: [NORMAL, RANDOM],
                default: RANDOM
            }]).then(function (answer) {
                _this2.config.setPortOption(answer.portOption);
                next();
            });
        }
    }, {
        key: 'configDomain',
        value: function configDomain(next) {
            var _this3 = this;

            var c = this.config,
                savedDomains = c.getSavedDomains(),
                domainsSize = savedDomains.length;

            if (domainsSize) {
                Inquirer.prompt([{
                    type: 'list',
                    name: 'override',
                    message: '是否重新设置域名?',
                    choices: [YES, NO],
                    default: NO
                }]).then(function (answer) {
                    if (answer.override == YES) {
                        c.clearDomains();
                        return _this3.configDomain(next);
                    }
                    next();
                });
            } else {
                console.log(HINT);
                this.collectDomain(next);
            }
        }
    }, {
        key: 'collectDomain',
        value: function collectDomain(next) {
            var _this4 = this;

            Inquirer.prompt([{
                name: 'domain',
                message: '设置域名(输入 n 可跳过此步骤):',
                validate(domain) {
                    domain = domain.trim();
                    return domain.split(' ').length == 2 || domain == N;
                }
            }]).then(function (answer) {
                var c = _this4.config,
                    domain = answer.domain.trim(),
                    domainArr = domain.split(' ');

                if (domain == N) {
                    if (_this4._domains.length) {
                        c.addDomain(_this4._domains);
                        next();
                    } else {
                        log('至少需要配置一个域名', 'warn');
                        _this4.collectDomain(next);
                    }
                } else {
                    _this4._domains.push(domainArr);
                    return _this4.collectDomain(next);
                }
            });
        }
    }, {
        key: 'configAddress',
        value: function () {
            var _ref2 = (0, _bluebird.coroutine)(regeneratorRuntime.mark(function _callee2(next) {
                var c, isChange, isOK, state, text;
                return regeneratorRuntime.wrap(function _callee2$(_context2) {
                    while (1) {
                        switch (_context2.prev = _context2.next) {
                            case 0:
                                log('设置 IP');
                                c = this.config;
                                _context2.next = 4;
                                return c.isIPChange();

                            case 4:
                                isChange = _context2.sent;

                                if (!isChange) {
                                    _context2.next = 22;
                                    break;
                                }

                                log('IP 需要更新...');
                                Indicator.start('更新 IP 地址');

                                _context2.next = 10;
                                return c.updateIP();

                            case 10:
                                isOK = _context2.sent;
                                state = isOK ? 'success' : 'error';
                                text = isOK ? '成功' : '失败';


                                log(`\n更新 IP 地址${text}`, state);
                                Indicator.stop();

                                if (isOK) {
                                    _context2.next = 20;
                                    break;
                                }

                                _context2.next = 18;
                                return c.generatePort();

                            case 18:
                                log(`你当前所在的网络无法连接到服务器，已经切换到本地模式。请使用 127.0.0.1 加上对应端口号来访问。`, 'error');
                                return _context2.abrupt('return');

                            case 20:
                                _context2.next = 23;
                                break;

                            case 22:
                                log('IP 地址无变化，不需要更新');

                            case 23:

                                next();

                            case 24:
                            case 'end':
                                return _context2.stop();
                        }
                    }
                }, _callee2, this);
            }));

            function configAddress(_x2) {
                return _ref2.apply(this, arguments);
            }

            return configAddress;
        }()
    }, {
        key: 'configProxy',
        value: function () {
            var _ref3 = (0, _bluebird.coroutine)(regeneratorRuntime.mark(function _callee3(next) {
                return regeneratorRuntime.wrap(function _callee3$(_context3) {
                    while (1) {
                        switch (_context3.prev = _context3.next) {
                            case 0:
                                Indicator.start('更新代理服务器');

                                _context3.prev = 1;
                                _context3.next = 4;
                                return this.config.updateProxy();

                            case 4:
                                _context3.next = 9;
                                break;

                            case 6:
                                _context3.prev = 6;
                                _context3.t0 = _context3['catch'](1);

                                log('\r服务器挂了!', 'error');

                            case 9:
                                _context3.prev = 9;

                                Indicator.stop();
                                return _context3.finish(9);

                            case 12:

                                log('更新代理服务器成功', 'success');
                                next();

                            case 14:
                            case 'end':
                                return _context3.stop();
                        }
                    }
                }, _callee3, this, [[1, 6, 9, 12]]);
            }));

            function configProxy(_x3) {
                return _ref3.apply(this, arguments);
            }

            return configProxy;
        }()
    }, {
        key: 'finish',
        value: function () {
            var _ref4 = (0, _bluebird.coroutine)(regeneratorRuntime.mark(function _callee4() {
                var workspace;
                return regeneratorRuntime.wrap(function _callee4$(_context4) {
                    while (1) {
                        switch (_context4.prev = _context4.next) {
                            case 0:
                                workspace = new WorkSpace(this.config.getPath());


                                workspace.active();
                                _context4.next = 4;
                                return workspace.start();

                            case 4:

                                Slogan.yell();
                                log('====================');
                                log('whornbill 环境配置完毕');
                                log('Cage 的详细使用请查看文档：\nhttps://github.com/mls-fe/cage');

                            case 8:
                            case 'end':
                                return _context4.stop();
                        }
                    }
                }, _callee4, this);
            }));

            function finish() {
                return _ref4.apply(this, arguments);
            }

            return finish;
        }()
    }]);

    return ConfigCLI;
}();

module.exports = ConfigCLI;