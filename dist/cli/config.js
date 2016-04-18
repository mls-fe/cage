'use strict';

var _bluebird = require('bluebird');

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

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
                                Indicator.stop();

                                if (isOK) {
                                    _context2.next = 18;
                                    break;
                                }

                                log('如果曾经更换过硬盘, 那么需要在服务器端重新配置新硬盘的 mac 地址.', 'error');
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

                                log('\r服务器挂了!', 'error');
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
//# sourceMappingURL=data:application/json;base64,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eUNBQVMsQ0FBQyxJQUFJLEVBQUUsQ0FBQTtBQUNoQixtQ0FBRyxDQUFFLFdBQVcsRUFBRSxTQUFTLENBQUUsQ0FBQTtBQUM3QixvQ0FBSSxFQUFFLENBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7O29CQUlGLFNBQVMsRUFDVCxNQUFNOzs7OztBQUROLHlDQUFTLEdBQUcsSUFBSSxTQUFTLENBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLEVBQUUsQ0FBRSxFQUNsRCxNQUFNLEdBQU0sSUFBSSxDQUFDLE1BQU0sQ0FBQyxlQUFlLEVBQUUsQ0FBRSxDQUFDLENBQUUsQ0FBQyxHQUFHOztBQUV0RCx5Q0FBUyxDQUFDLE1BQU0sRUFBRSxDQUFBOzt1Q0FDWixTQUFTLENBQUMsS0FBSyxFQUFFOzs7O0FBRXZCLHNDQUFNLENBQUMsSUFBSSxFQUFFLENBQUE7QUFDYixtQ0FBRyxDQUFFLHNCQUFzQixDQUFFLENBQUE7QUFDN0IsbUNBQUcsQ0FBRSxrQkFBa0IsQ0FBRSxDQUFBO0FBQ3pCLG1DQUFHLENBQUUsa0RBQWtELENBQUUsQ0FBQTtBQUN6RCwwQ0FBVSxDQUFFLFlBQU07QUFDZCx3Q0FBSSxhQUFZLE1BQU0sNEJBQTBCLENBQUE7aUNBQ25ELEVBQUUsSUFBSSxDQUFFLENBQUE7Ozs7Ozs7Ozs7Ozs7OztXQXJKWCxTQUFTOzs7QUF5SmYsTUFBTSxDQUFDLE9BQU8sR0FBRyxTQUFTLENBQUEiLCJmaWxlIjoiY2xpL2NvbmZpZy5qcyIsInNvdXJjZXNDb250ZW50IjpbImxldCBJbnF1aXJlciAgICAgID0gcmVxdWlyZSggJ2lucXVpcmVyJyApLFxuICAgIFBhdGggICAgICAgICAgPSByZXF1aXJlKCAncGF0aCcgKSxcbiAgICBPcGVuICAgICAgICAgID0gcmVxdWlyZSggJ29wZW4nICksXG4gICAgQ29uZmlnICAgICAgICA9IHJlcXVpcmUoICcuLi9jb3JlL2NvbmZpZycgKSxcbiAgICBXb3JrU3BhY2UgICAgID0gcmVxdWlyZSggJy4uL2NvcmUvd29ya3NwYWNlJyApLFxuICAgIFNsb2dhbiAgICAgICAgPSByZXF1aXJlKCAnLi4vc2xvZ2FuJyApLFxuICAgIFV0aWwgICAgICAgICAgPSByZXF1aXJlKCAnLi4vdXRpbCcgKSxcbiAgICBLZXkgICAgICAgICAgID0gcmVxdWlyZSggJy4uL2tleScgKSxcbiAgICBJbmRpY2F0b3IgICAgID0gVXRpbC5pbmRpY2F0b3IsXG5cbiAgICBkZWZhdWx0UGhhc2VzID0gW1xuICAgICAgICAnY29uZmlnUG9ydCcsXG4gICAgICAgICdjb25maWdEb21haW4nLFxuICAgICAgICAnY29uZmlnUHJveHknLFxuICAgICAgICAnY29uZmlnQWRkcmVzcycsXG4gICAgICAgICdmaW5pc2gnXG4gICAgXVxuXG5jb25zdCBSQU5ET00gPSBLZXkucmFuZG9tLFxuICAgICAgTk9STUFMID0gS2V5Lm5vcm1hbCxcbiAgICAgIFlFUyAgICA9ICfmmK8nLFxuICAgICAgTk8gICAgID0gJ+WQpicsXG4gICAgICBOICAgICAgPSAnbidcblxuY2xhc3MgQ29uZmlnQ0xJIHtcbiAgICBjb25zdHJ1Y3RvciggcGF0aCApIHtcbiAgICAgICAgdGhpcy5pbml0KCBQYXRoLnJlc29sdmUoIHBhdGggKSApXG4gICAgfVxuXG4gICAgYXN5bmMgaW5pdCggcGF0aCApIHtcbiAgICAgICAgbGV0IHBoYXNlcyA9IGRlZmF1bHRQaGFzZXMuY29uY2F0KCksXG4gICAgICAgICAgICBuZXh0ICAgPSAoKSA9PiB7XG4gICAgICAgICAgICAgICAgbGV0IHBoYXNlID0gcGhhc2VzLnNoaWZ0KClcbiAgICAgICAgICAgICAgICBpZiAoIHBoYXNlICkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzWyBwaGFzZSBdKCBuZXh0IClcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgbGV0IGlzVmFsaWQgPSBhd2FpdCBXb3JrU3BhY2UuaXNWYWxpZFdvcmtTcGFjZSggcGF0aCApXG4gICAgICAgIGlmICggIWlzVmFsaWQgKSB7XG4gICAgICAgICAgICBsb2coIGAke3BhdGh9IOS4jeaYr+WQiOazleeahOW3peS9nOepuumXtO+8geivt+mHjeaWsOaMh+WummAsICd3YXJuJyApXG4gICAgICAgICAgICByZXR1cm5cbiAgICAgICAgfVxuICAgICAgICB0aGlzLmNvbmZpZyA9IG5ldyBDb25maWcoIHBhdGggKVxuXG4gICAgICAgIG5leHQoKVxuICAgIH1cblxuICAgIGNvbmZpZ1BvcnQoIG5leHQgKSB7XG4gICAgICAgIElucXVpcmVyXG4gICAgICAgICAgICAucHJvbXB0KCBbIHtcbiAgICAgICAgICAgICAgICB0eXBlICAgIDogJ2xpc3QnLFxuICAgICAgICAgICAgICAgIG5hbWUgICAgOiAncG9ydE9wdGlvbicsXG4gICAgICAgICAgICAgICAgbWVzc2FnZSA6ICfpgInmi6nnq6/lj6Plj7cnLFxuICAgICAgICAgICAgICAgIGNob2ljZXMgOiBbIE5PUk1BTCwgUkFORE9NIF0sXG4gICAgICAgICAgICAgICAgZGVmYXVsdCA6IFJBTkRPTVxuICAgICAgICAgICAgfSBdLCBhbnN3ZXIgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuY29uZmlnLnNldFBvcnRPcHRpb24oIGFuc3dlci5wb3J0T3B0aW9uIClcbiAgICAgICAgICAgICAgICBuZXh0KClcbiAgICAgICAgICAgIH0gKVxuICAgIH1cblxuICAgIGNvbmZpZ0RvbWFpbiggbmV4dCApIHtcbiAgICAgICAgbGV0IGMgICAgICAgICAgICA9IHRoaXMuY29uZmlnLFxuICAgICAgICAgICAgc2F2ZWREb21haW5zID0gYy5nZXRTYXZlZERvbWFpbnMoKSxcbiAgICAgICAgICAgIGRvbWFpbnNTaXplICA9IHNhdmVkRG9tYWlucy5sZW5ndGhcblxuICAgICAgICBpZiAoIGRvbWFpbnNTaXplICkge1xuICAgICAgICAgICAgSW5xdWlyZXJcbiAgICAgICAgICAgICAgICAucHJvbXB0KCBbIHtcbiAgICAgICAgICAgICAgICAgICAgdHlwZSAgICA6ICdsaXN0JyxcbiAgICAgICAgICAgICAgICAgICAgbmFtZSAgICA6ICdvdmVycmlkZScsXG4gICAgICAgICAgICAgICAgICAgIG1lc3NhZ2UgOiAn5piv5ZCm6YeN5paw6K6+572u5Z+f5ZCNPycsXG4gICAgICAgICAgICAgICAgICAgIGNob2ljZXMgOiBbIFlFUywgTk8gXSxcbiAgICAgICAgICAgICAgICAgICAgZGVmYXVsdCA6IE5PXG4gICAgICAgICAgICAgICAgfSBdLCBhbnN3ZXIgPT4ge1xuICAgICAgICAgICAgICAgICAgICBpZiAoIGFuc3dlci5vdmVycmlkZSA9PSBZRVMgKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjLmNsZWFyRG9tYWlucygpXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5jb25maWdEb21haW4oIG5leHQgKVxuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgbmV4dCgpXG4gICAgICAgICAgICAgICAgfSApXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmNvbGxlY3REb21haW4oIG5leHQgKVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgY29sbGVjdERvbWFpbiggbmV4dCApIHtcbiAgICAgICAgSW5xdWlyZXJcbiAgICAgICAgICAgIC5wcm9tcHQoIFsge1xuICAgICAgICAgICAgICAgIG5hbWUgICAgOiAnZG9tYWluJyxcbiAgICAgICAgICAgICAgICBtZXNzYWdlIDogJ+iuvue9ruWfn+WQjSjovpPlhaUgbiDlj6/ot7Pov4fmraTmraXpqqQpJyxcbiAgICAgICAgICAgICAgICB2YWxpZGF0ZSggZG9tYWluICkge1xuICAgICAgICAgICAgICAgICAgICBkb21haW4gPSBkb21haW4udHJpbSgpXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBkb21haW4uc3BsaXQoICcgJyApLmxlbmd0aCA9PSAyIHx8IGRvbWFpbiA9PSBOXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBdLCBhbnN3ZXIgPT4ge1xuICAgICAgICAgICAgICAgIGxldCBjICAgICAgICAgICA9IHRoaXMuY29uZmlnLFxuICAgICAgICAgICAgICAgICAgICBkb21haW4gICAgICA9IGFuc3dlci5kb21haW4udHJpbSgpLFxuICAgICAgICAgICAgICAgICAgICBkb21haW5BcnIgICA9IGRvbWFpbi5zcGxpdCggJyAnICksXG4gICAgICAgICAgICAgICAgICAgIGRvbWFpbnNTaXplID0gYy5nZXREb21haW5zU2l6ZSgpXG5cbiAgICAgICAgICAgICAgICBpZiAoIGRvbWFpbiA9PSBOICkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoIGRvbWFpbnNTaXplICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgbmV4dCgpXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsb2coICfoh7PlsJHpnIDopoHphY3nva7kuIDkuKrln5/lkI0nLCAnd2FybicgKVxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jb2xsZWN0RG9tYWluKCBuZXh0IClcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGMuYWRkRG9tYWluKCBkb21haW5BcnIgKVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5jb2xsZWN0RG9tYWluKCBuZXh0IClcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IClcbiAgICB9XG5cbiAgICBhc3luYyBjb25maWdBZGRyZXNzKCBuZXh0ICkge1xuICAgICAgICBsb2coICforr7nva4gSVAnIClcbiAgICAgICAgbGV0IGMgICAgICAgID0gdGhpcy5jb25maWcsXG4gICAgICAgICAgICBpc0NoYW5nZSA9IGF3YWl0IGMuaXNJUENoYW5nZSgpXG5cbiAgICAgICAgaWYgKCBpc0NoYW5nZSApIHtcbiAgICAgICAgICAgIGxvZyggJ0lQIOmcgOimgeabtOaWsC4uLicgKVxuICAgICAgICAgICAgSW5kaWNhdG9yLnN0YXJ0KCAn5pu05pawIElQIOWcsOWdgCcgKVxuXG4gICAgICAgICAgICBsZXQgaXNPSyAgPSBhd2FpdCBjLnVwZGF0ZUlQKCksXG4gICAgICAgICAgICAgICAgc3RhdGUgPSBpc09LID8gJ3N1Y2Nlc3MnIDogJ2Vycm9yJyxcbiAgICAgICAgICAgICAgICB0ZXh0ICA9IGlzT0sgPyAn5oiQ5YqfJyA6ICflpLHotKUnXG5cbiAgICAgICAgICAgIGxvZyggYFxcbuabtOaWsCBJUCDlnLDlnYAke3RleHR9YCwgc3RhdGUgKVxuICAgICAgICAgICAgSW5kaWNhdG9yLnN0b3AoKVxuXG4gICAgICAgICAgICBpZiAoICFpc09LICkge1xuICAgICAgICAgICAgICAgIGxvZyggYOWmguaenOabvue7j+abtOaNoui/h+ehrOebmCwg6YKj5LmI6ZyA6KaB5Zyo5pyN5Yqh5Zmo56uv6YeN5paw6YWN572u5paw56Gs55uY55qEIG1hYyDlnLDlnYAuYCwgJ2Vycm9yJyApXG4gICAgICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBsb2coICdJUCDlnLDlnYDml6Dlj5jljJbvvIzkuI3pnIDopoHmm7TmlrAnIClcbiAgICAgICAgfVxuXG4gICAgICAgIG5leHQoKVxuICAgIH1cblxuICAgIGFzeW5jIGNvbmZpZ1Byb3h5KCBuZXh0ICkge1xuICAgICAgICBJbmRpY2F0b3Iuc3RhcnQoICfmm7TmlrDku6PnkIbmnI3liqHlmagnIClcblxuICAgICAgICB0cnkge1xuICAgICAgICAgICAgYXdhaXQgdGhpcy5jb25maWcudXBkYXRlUHJveHkoKVxuICAgICAgICB9IGNhdGNoICggZSApIHtcbiAgICAgICAgICAgIGxvZyggJ1xccuacjeWKoeWZqOaMguS6hiEnLCAnZXJyb3InIClcbiAgICAgICAgICAgIEluZGljYXRvci5zdG9wKClcbiAgICAgICAgICAgIHJldHVyblxuICAgICAgICB9XG5cbiAgICAgICAgSW5kaWNhdG9yLnN0b3AoKVxuICAgICAgICBsb2coICfmm7TmlrDku6PnkIbmnI3liqHlmajmiJDlip8nLCAnc3VjY2VzcycgKVxuICAgICAgICBuZXh0KClcbiAgICB9XG5cbiAgICBhc3luYyBmaW5pc2goKSB7XG4gICAgICAgIGxldCB3b3Jrc3BhY2UgPSBuZXcgV29ya1NwYWNlKCB0aGlzLmNvbmZpZy5nZXRQYXRoKCkgKSxcbiAgICAgICAgICAgIGRvbWFpbiAgICA9IHRoaXMuY29uZmlnLmdldFNhdmVkRG9tYWlucygpWyAwIF0ua2V5XG5cbiAgICAgICAgd29ya3NwYWNlLmFjdGl2ZSgpXG4gICAgICAgIGF3YWl0IHdvcmtzcGFjZS5zdGFydCgpXG5cbiAgICAgICAgU2xvZ2FuLnllbGwoKVxuICAgICAgICBsb2coICc9PT09PT09PT09PT09PT09PT09PScgKVxuICAgICAgICBsb2coICd3aG9ybmJpbGwg546v5aKD6YWN572u5a6M5q+VJyApXG4gICAgICAgIGxvZyggJ0NhZ2Ug55qE6K+m57uG5L2/55So6K+35p+l55yL5paH5qGj77yaXFxuaHR0cHM6Ly9naXRodWIuY29tL21scy1mZS9jYWdlJyApXG4gICAgICAgIHNldFRpbWVvdXQoICgpID0+IHtcbiAgICAgICAgICAgIE9wZW4oIGBodHRwOi8vJHtkb21haW59LmZlZGV2b3QubWVpbGlzaHVvLmNvbWAgKVxuICAgICAgICB9LCAxMDAwIClcbiAgICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gQ29uZmlnQ0xJXG4iXX0=