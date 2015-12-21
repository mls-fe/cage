'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _bluebird = require('bluebird');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Inquirer = require('inquirer'),
    Path = require('path'),
    Open = require('open'),
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
    N = 'n';

var ConfigCLI = (function () {
    function ConfigCLI(path) {
        _classCallCheck(this, ConfigCLI);

        this.init(Path.resolve(path));
    }

    _createClass(ConfigCLI, [{
        key: 'init',
        value: (function () {
            var ref = (0, _bluebird.coroutine)(regeneratorRuntime.mark(function _callee(path) {
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

                                log(path + ' 不是合法的工作空间！请重新指定', 'warn');
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
            return function init(_x) {
                return ref.apply(this, arguments);
            };
        })()
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
            }], function (answer) {
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
                }], function (answer) {
                    if (answer.override == YES) {
                        c.clearDomains();
                        return _this3.configDomain(next);
                    }

                    next();
                });
            } else {
                this.collectDomain(next);
            }
        }
    }, {
        key: 'collectDomain',
        value: function collectDomain(next) {
            var _this4 = this;

            Inquirer.prompt([{
                name: 'domain',
                message: '设置域名(输入 n 可跳过此步骤)',
                validate: function validate(domain) {
                    domain = domain.trim();
                    return domain.split(' ').length == 2 || domain == N;
                }
            }], function (answer) {
                var c = _this4.config,
                    domain = answer.domain.trim(),
                    domainArr = domain.split(' '),
                    domainsSize = c.getDomainsSize();

                if (domain == N) {
                    if (domainsSize) {
                        next();
                    } else {
                        log('至少需要配置一个域名', 'warn');
                        _this4.collectDomain(next);
                    }
                } else {
                    c.addDomain(domainArr);
                    return _this4.collectDomain(next);
                }
            });
        }
    }, {
        key: 'configAddress',
        value: (function () {
            var ref = (0, _bluebird.coroutine)(regeneratorRuntime.mark(function _callee2(next) {
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
                                    _context2.next = 20;
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

                                log('\n更新 IP 地址' + text, state);
                                log('如果曾经更换过硬盘, 那么需要在服务器端重新配置新硬盘的 mac 地址.', 'success');
                                Indicator.stop();

                                if (isOK) {
                                    _context2.next = 18;
                                    break;
                                }

                                return _context2.abrupt('return');

                            case 18:
                                _context2.next = 21;
                                break;

                            case 20:
                                log('IP 地址无变化，不需要更新');

                            case 21:

                                next();

                            case 22:
                            case 'end':
                                return _context2.stop();
                        }
                    }
                }, _callee2, this);
            }));
            return function configAddress(_x2) {
                return ref.apply(this, arguments);
            };
        })()
    }, {
        key: 'configProxy',
        value: (function () {
            var ref = (0, _bluebird.coroutine)(regeneratorRuntime.mark(function _callee3(next) {
                return regeneratorRuntime.wrap(function _callee3$(_context3) {
                    while (1) {
                        switch (_context3.prev = _context3.next) {
                            case 0:
                                Indicator.start('更新代理服务器');

                                _context3.prev = 1;
                                _context3.next = 4;
                                return this.config.updateProxy();

                            case 4:
                                _context3.next = 11;
                                break;

                            case 6:
                                _context3.prev = 6;
                                _context3.t0 = _context3['catch'](1);

                                log('服务器挂了,喊钱云!', 'error');
                                Indicator.stop();
                                return _context3.abrupt('return');

                            case 11:

                                Indicator.stop();
                                log('更新代理服务器成功', 'success');
                                next();

                            case 14:
                            case 'end':
                                return _context3.stop();
                        }
                    }
                }, _callee3, this, [[1, 6]]);
            }));
            return function configProxy(_x3) {
                return ref.apply(this, arguments);
            };
        })()
    }, {
        key: 'finish',
        value: (function () {
            var ref = (0, _bluebird.coroutine)(regeneratorRuntime.mark(function _callee4() {
                var workspace, domain;
                return regeneratorRuntime.wrap(function _callee4$(_context4) {
                    while (1) {
                        switch (_context4.prev = _context4.next) {
                            case 0:
                                workspace = new WorkSpace(this.config.getPath()), domain = this.config.getSavedDomains()[0].key;

                                workspace.active();
                                _context4.next = 4;
                                return workspace.start();

                            case 4:

                                Slogan.yell();
                                log('====================');
                                log('whornbill 环境配置完毕');
                                log('Cage 的详细使用请查看文档：\nhttps://github.com/mls-fe/cage');
                                setTimeout(function () {
                                    Open('http://' + domain + '.fedevot.meilishuo.com');
                                }, 1000);

                            case 9:
                            case 'end':
                                return _context4.stop();
                        }
                    }
                }, _callee4, this);
            }));
            return function finish() {
                return ref.apply(this, arguments);
            };
        })()
    }]);

    return ConfigCLI;
})();

module.exports = ConfigCLI;
//# sourceMappingURL=data:application/json;base64,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QUFTLENBQUMsSUFBSSxFQUFFLENBQUE7QUFDaEIsbUNBQUcsQ0FBRSxXQUFXLEVBQUUsU0FBUyxDQUFFLENBQUE7QUFDN0Isb0NBQUksRUFBRSxDQUFBOzs7Ozs7Ozs7Ozs7Ozs7OztvQkFJRixTQUFTLEVBQ1QsTUFBTTs7Ozs7QUFETix5Q0FBUyxHQUFHLElBQUksU0FBUyxDQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxFQUFFLENBQUUsRUFDbEQsTUFBTSxHQUFNLElBQUksQ0FBQyxNQUFNLENBQUMsZUFBZSxFQUFFLENBQUUsQ0FBQyxDQUFFLENBQUMsR0FBRzs7QUFFdEQseUNBQVMsQ0FBQyxNQUFNLEVBQUUsQ0FBQTs7dUNBQ1osU0FBUyxDQUFDLEtBQUssRUFBRTs7OztBQUV2QixzQ0FBTSxDQUFDLElBQUksRUFBRSxDQUFBO0FBQ2IsbUNBQUcsQ0FBRSxzQkFBc0IsQ0FBRSxDQUFBO0FBQzdCLG1DQUFHLENBQUUsa0JBQWtCLENBQUUsQ0FBQTtBQUN6QixtQ0FBRyxDQUFFLGtEQUFrRCxDQUFFLENBQUE7QUFDekQsMENBQVUsQ0FBRSxZQUFNO0FBQ2Qsd0NBQUksYUFBWSxNQUFNLDRCQUEwQixDQUFBO2lDQUNuRCxFQUFFLElBQUksQ0FBRSxDQUFBOzs7Ozs7Ozs7Ozs7Ozs7V0FySlgsU0FBUzs7O0FBeUpmLE1BQU0sQ0FBQyxPQUFPLEdBQUcsU0FBUyxDQUFBIiwiZmlsZSI6ImNsaS9jb25maWcuanMiLCJzb3VyY2VzQ29udGVudCI6WyJsZXQgSW5xdWlyZXIgICAgICA9IHJlcXVpcmUoICdpbnF1aXJlcicgKSxcbiAgICBQYXRoICAgICAgICAgID0gcmVxdWlyZSggJ3BhdGgnICksXG4gICAgT3BlbiAgICAgICAgICA9IHJlcXVpcmUoICdvcGVuJyApLFxuICAgIENvbmZpZyAgICAgICAgPSByZXF1aXJlKCAnLi4vY29yZS9jb25maWcnICksXG4gICAgV29ya1NwYWNlICAgICA9IHJlcXVpcmUoICcuLi9jb3JlL3dvcmtzcGFjZScgKSxcbiAgICBTbG9nYW4gICAgICAgID0gcmVxdWlyZSggJy4uL3Nsb2dhbicgKSxcbiAgICBVdGlsICAgICAgICAgID0gcmVxdWlyZSggJy4uL3V0aWwnICksXG4gICAgS2V5ICAgICAgICAgICA9IHJlcXVpcmUoICcuLi9rZXknICksXG4gICAgSW5kaWNhdG9yICAgICA9IFV0aWwuaW5kaWNhdG9yLFxuXG4gICAgZGVmYXVsdFBoYXNlcyA9IFtcbiAgICAgICAgJ2NvbmZpZ1BvcnQnLFxuICAgICAgICAnY29uZmlnRG9tYWluJyxcbiAgICAgICAgJ2NvbmZpZ1Byb3h5JyxcbiAgICAgICAgJ2NvbmZpZ0FkZHJlc3MnLFxuICAgICAgICAnZmluaXNoJ1xuICAgIF1cblxuY29uc3QgUkFORE9NID0gS2V5LnJhbmRvbSxcbiAgICAgIE5PUk1BTCA9IEtleS5ub3JtYWwsXG4gICAgICBZRVMgICAgPSAn5pivJyxcbiAgICAgIE5PICAgICA9ICflkKYnLFxuICAgICAgTiAgICAgID0gJ24nXG5cbmNsYXNzIENvbmZpZ0NMSSB7XG4gICAgY29uc3RydWN0b3IoIHBhdGggKSB7XG4gICAgICAgIHRoaXMuaW5pdCggUGF0aC5yZXNvbHZlKCBwYXRoICkgKVxuICAgIH1cblxuICAgIGFzeW5jIGluaXQoIHBhdGggKSB7XG4gICAgICAgIGxldCBwaGFzZXMgPSBkZWZhdWx0UGhhc2VzLmNvbmNhdCgpLFxuICAgICAgICAgICAgbmV4dCAgID0gKCkgPT4ge1xuICAgICAgICAgICAgICAgIGxldCBwaGFzZSA9IHBoYXNlcy5zaGlmdCgpXG4gICAgICAgICAgICAgICAgaWYgKCBwaGFzZSApIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpc1sgcGhhc2UgXSggbmV4dCApXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgIGxldCBpc1ZhbGlkID0gYXdhaXQgV29ya1NwYWNlLmlzVmFsaWRXb3JrU3BhY2UoIHBhdGggKVxuICAgICAgICBpZiAoICFpc1ZhbGlkICkge1xuICAgICAgICAgICAgbG9nKCBgJHtwYXRofSDkuI3mmK/lkIjms5XnmoTlt6XkvZznqbrpl7TvvIHor7fph43mlrDmjIflrppgLCAnd2FybicgKVxuICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5jb25maWcgPSBuZXcgQ29uZmlnKCBwYXRoIClcblxuICAgICAgICBuZXh0KClcbiAgICB9XG5cbiAgICBjb25maWdQb3J0KCBuZXh0ICkge1xuICAgICAgICBJbnF1aXJlclxuICAgICAgICAgICAgLnByb21wdCggWyB7XG4gICAgICAgICAgICAgICAgdHlwZTogICAgJ2xpc3QnLFxuICAgICAgICAgICAgICAgIG5hbWU6ICAgICdwb3J0T3B0aW9uJyxcbiAgICAgICAgICAgICAgICBtZXNzYWdlOiAn6YCJ5oup56uv5Y+j5Y+3JyxcbiAgICAgICAgICAgICAgICBjaG9pY2VzOiBbIE5PUk1BTCwgUkFORE9NIF0sXG4gICAgICAgICAgICAgICAgZGVmYXVsdDogUkFORE9NXG4gICAgICAgICAgICB9IF0sIGFuc3dlciA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5jb25maWcuc2V0UG9ydE9wdGlvbiggYW5zd2VyLnBvcnRPcHRpb24gKVxuICAgICAgICAgICAgICAgIG5leHQoKVxuICAgICAgICAgICAgfSApXG4gICAgfVxuXG4gICAgY29uZmlnRG9tYWluKCBuZXh0ICkge1xuICAgICAgICBsZXQgYyAgICAgICAgICAgID0gdGhpcy5jb25maWcsXG4gICAgICAgICAgICBzYXZlZERvbWFpbnMgPSBjLmdldFNhdmVkRG9tYWlucygpLFxuICAgICAgICAgICAgZG9tYWluc1NpemUgID0gc2F2ZWREb21haW5zLmxlbmd0aFxuXG4gICAgICAgIGlmICggZG9tYWluc1NpemUgKSB7XG4gICAgICAgICAgICBJbnF1aXJlclxuICAgICAgICAgICAgICAgIC5wcm9tcHQoIFsge1xuICAgICAgICAgICAgICAgICAgICB0eXBlOiAgICAnbGlzdCcsXG4gICAgICAgICAgICAgICAgICAgIG5hbWU6ICAgICdvdmVycmlkZScsXG4gICAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6ICfmmK/lkKbph43mlrDorr7nva7ln5/lkI0/JyxcbiAgICAgICAgICAgICAgICAgICAgY2hvaWNlczogWyBZRVMsIE5PIF0sXG4gICAgICAgICAgICAgICAgICAgIGRlZmF1bHQ6IE5PXG4gICAgICAgICAgICAgICAgfSBdLCBhbnN3ZXIgPT4ge1xuICAgICAgICAgICAgICAgICAgICBpZiAoIGFuc3dlci5vdmVycmlkZSA9PSBZRVMgKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjLmNsZWFyRG9tYWlucygpXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5jb25maWdEb21haW4oIG5leHQgKVxuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgbmV4dCgpXG4gICAgICAgICAgICAgICAgfSApXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmNvbGxlY3REb21haW4oIG5leHQgKVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgY29sbGVjdERvbWFpbiggbmV4dCApIHtcbiAgICAgICAgSW5xdWlyZXJcbiAgICAgICAgICAgIC5wcm9tcHQoIFsge1xuICAgICAgICAgICAgICAgIG5hbWU6ICAgICdkb21haW4nLFxuICAgICAgICAgICAgICAgIG1lc3NhZ2U6ICforr7nva7ln5/lkI0o6L6T5YWlIG4g5Y+v6Lez6L+H5q2k5q2l6aqkKScsXG4gICAgICAgICAgICAgICAgdmFsaWRhdGUoIGRvbWFpbiApIHtcbiAgICAgICAgICAgICAgICAgICAgZG9tYWluID0gZG9tYWluLnRyaW0oKVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZG9tYWluLnNwbGl0KCAnICcgKS5sZW5ndGggPT0gMiB8fCBkb21haW4gPT0gTlxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gXSwgYW5zd2VyID0+IHtcbiAgICAgICAgICAgICAgICBsZXQgYyAgICAgICAgICAgPSB0aGlzLmNvbmZpZyxcbiAgICAgICAgICAgICAgICAgICAgZG9tYWluICAgICAgPSBhbnN3ZXIuZG9tYWluLnRyaW0oKSxcbiAgICAgICAgICAgICAgICAgICAgZG9tYWluQXJyICAgPSBkb21haW4uc3BsaXQoICcgJyApLFxuICAgICAgICAgICAgICAgICAgICBkb21haW5zU2l6ZSA9IGMuZ2V0RG9tYWluc1NpemUoKVxuXG4gICAgICAgICAgICAgICAgaWYgKCBkb21haW4gPT0gTiApIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCBkb21haW5zU2l6ZSApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG5leHQoKVxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgbG9nKCAn6Iez5bCR6ZyA6KaB6YWN572u5LiA5Liq5Z+f5ZCNJywgJ3dhcm4nIClcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY29sbGVjdERvbWFpbiggbmV4dCApXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBjLmFkZERvbWFpbiggZG9tYWluQXJyIClcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuY29sbGVjdERvbWFpbiggbmV4dCApXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSApXG4gICAgfVxuXG4gICAgYXN5bmMgY29uZmlnQWRkcmVzcyggbmV4dCApIHtcbiAgICAgICAgbG9nKCAn6K6+572uIElQJyApXG4gICAgICAgIGxldCBjICAgICAgICA9IHRoaXMuY29uZmlnLFxuICAgICAgICAgICAgaXNDaGFuZ2UgPSBhd2FpdCBjLmlzSVBDaGFuZ2UoKVxuXG4gICAgICAgIGlmICggaXNDaGFuZ2UgKSB7XG4gICAgICAgICAgICBsb2coICdJUCDpnIDopoHmm7TmlrAuLi4nIClcbiAgICAgICAgICAgIEluZGljYXRvci5zdGFydCggJ+abtOaWsCBJUCDlnLDlnYAnIClcblxuICAgICAgICAgICAgbGV0IGlzT0sgID0gYXdhaXQgYy51cGRhdGVJUCgpLFxuICAgICAgICAgICAgICAgIHN0YXRlID0gaXNPSyA/ICdzdWNjZXNzJyA6ICdlcnJvcicsXG4gICAgICAgICAgICAgICAgdGV4dCAgPSBpc09LID8gJ+aIkOWKnycgOiAn5aSx6LSlJ1xuXG4gICAgICAgICAgICBsb2coIGBcXG7mm7TmlrAgSVAg5Zyw5Z2AJHt0ZXh0fWAsIHN0YXRlIClcbiAgICAgICAgICAgIGxvZyggYOWmguaenOabvue7j+abtOaNoui/h+ehrOebmCwg6YKj5LmI6ZyA6KaB5Zyo5pyN5Yqh5Zmo56uv6YeN5paw6YWN572u5paw56Gs55uY55qEIG1hYyDlnLDlnYAuYCwgJ3N1Y2Nlc3MnIClcbiAgICAgICAgICAgIEluZGljYXRvci5zdG9wKClcblxuICAgICAgICAgICAgaWYgKCAhaXNPSyApIHtcbiAgICAgICAgICAgICAgICByZXR1cm5cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGxvZyggJ0lQIOWcsOWdgOaXoOWPmOWMlu+8jOS4jemcgOimgeabtOaWsCcgKVxuICAgICAgICB9XG5cbiAgICAgICAgbmV4dCgpXG4gICAgfVxuXG4gICAgYXN5bmMgY29uZmlnUHJveHkoIG5leHQgKSB7XG4gICAgICAgIEluZGljYXRvci5zdGFydCggJ+abtOaWsOS7o+eQhuacjeWKoeWZqCcgKVxuXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBhd2FpdCB0aGlzLmNvbmZpZy51cGRhdGVQcm94eSgpXG4gICAgICAgIH0gY2F0Y2ggKCBlICkge1xuICAgICAgICAgICAgbG9nKCAn5pyN5Yqh5Zmo5oyC5LqGLOWWiumSseS6kSEnLCAnZXJyb3InIClcbiAgICAgICAgICAgIEluZGljYXRvci5zdG9wKClcbiAgICAgICAgICAgIHJldHVyblxuICAgICAgICB9XG5cbiAgICAgICAgSW5kaWNhdG9yLnN0b3AoKVxuICAgICAgICBsb2coICfmm7TmlrDku6PnkIbmnI3liqHlmajmiJDlip8nLCAnc3VjY2VzcycgKVxuICAgICAgICBuZXh0KClcbiAgICB9XG5cbiAgICBhc3luYyBmaW5pc2goKSB7XG4gICAgICAgIGxldCB3b3Jrc3BhY2UgPSBuZXcgV29ya1NwYWNlKCB0aGlzLmNvbmZpZy5nZXRQYXRoKCkgKSxcbiAgICAgICAgICAgIGRvbWFpbiAgICA9IHRoaXMuY29uZmlnLmdldFNhdmVkRG9tYWlucygpWyAwIF0ua2V5XG5cbiAgICAgICAgd29ya3NwYWNlLmFjdGl2ZSgpXG4gICAgICAgIGF3YWl0IHdvcmtzcGFjZS5zdGFydCgpXG5cbiAgICAgICAgU2xvZ2FuLnllbGwoKVxuICAgICAgICBsb2coICc9PT09PT09PT09PT09PT09PT09PScgKVxuICAgICAgICBsb2coICd3aG9ybmJpbGwg546v5aKD6YWN572u5a6M5q+VJyApXG4gICAgICAgIGxvZyggJ0NhZ2Ug55qE6K+m57uG5L2/55So6K+35p+l55yL5paH5qGj77yaXFxuaHR0cHM6Ly9naXRodWIuY29tL21scy1mZS9jYWdlJyApXG4gICAgICAgIHNldFRpbWVvdXQoICgpID0+IHtcbiAgICAgICAgICAgIE9wZW4oIGBodHRwOi8vJHtkb21haW59LmZlZGV2b3QubWVpbGlzaHVvLmNvbWAgKVxuICAgICAgICB9LCAxMDAwIClcbiAgICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gQ29uZmlnQ0xJXG4iXX0=