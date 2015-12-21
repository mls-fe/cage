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
    Const = require('../const'),
    Indicator = Util.indicator,
    defaultPhases = ['configPort', 'configDomain', 'configAddress', 'configProxy', 'finish'];

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
//# sourceMappingURL=data:application/json;base64,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QUFTLENBQUMsSUFBSSxFQUFFLENBQUE7Ozs7O0FBSXBCLHlDQUFTLENBQUMsSUFBSSxFQUFFLENBQUE7QUFDaEIsbUNBQUcsQ0FBRSxXQUFXLEVBQUUsU0FBUyxDQUFFLENBQUE7QUFDN0Isb0NBQUksRUFBRSxDQUFBOzs7Ozs7Ozs7Ozs7Ozs7OztvQkFJRixTQUFTLEVBQ1QsTUFBTTs7Ozs7QUFETix5Q0FBUyxHQUFHLElBQUksU0FBUyxDQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxFQUFFLENBQUUsRUFDbEQsTUFBTSxHQUFNLElBQUksQ0FBQyxNQUFNLENBQUMsZUFBZSxFQUFFLENBQUUsQ0FBQyxDQUFFLENBQUMsR0FBRzs7QUFFdEQseUNBQVMsQ0FBQyxNQUFNLEVBQUUsQ0FBQTs7dUNBQ1osU0FBUyxDQUFDLEtBQUssRUFBRTs7OztBQUV2QixzQ0FBTSxDQUFDLElBQUksRUFBRSxDQUFBO0FBQ2IsbUNBQUcsQ0FBRSxzQkFBc0IsQ0FBRSxDQUFBO0FBQzdCLG1DQUFHLENBQUUsa0JBQWtCLENBQUUsQ0FBQTtBQUN6QixtQ0FBRyxDQUFFLGtEQUFrRCxDQUFFLENBQUE7QUFDekQsMENBQVUsQ0FBRSxZQUFNO0FBQ2Qsd0NBQUksYUFBWSxNQUFNLDRCQUEwQixDQUFBO2lDQUNuRCxFQUFFLElBQUksQ0FBRSxDQUFBOzs7Ozs7Ozs7Ozs7Ozs7V0FySlgsU0FBUzs7O0FBeUpmLE1BQU0sQ0FBQyxPQUFPLEdBQUcsU0FBUyxDQUFBIiwiZmlsZSI6ImNsaS9jb25maWcuanMiLCJzb3VyY2VzQ29udGVudCI6WyJsZXQgSW5xdWlyZXIgICAgICA9IHJlcXVpcmUoICdpbnF1aXJlcicgKSxcbiAgICBQYXRoICAgICAgICAgID0gcmVxdWlyZSggJ3BhdGgnICksXG4gICAgT3BlbiAgICAgICAgICA9IHJlcXVpcmUoICdvcGVuJyApLFxuICAgIENvbmZpZyAgICAgICAgPSByZXF1aXJlKCAnLi4vY29yZS9jb25maWcnICksXG4gICAgV29ya1NwYWNlICAgICA9IHJlcXVpcmUoICcuLi9jb3JlL3dvcmtzcGFjZScgKSxcbiAgICBTbG9nYW4gICAgICAgID0gcmVxdWlyZSggJy4uL3Nsb2dhbicgKSxcbiAgICBVdGlsICAgICAgICAgID0gcmVxdWlyZSggJy4uL3V0aWwnICksXG4gICAgS2V5ICAgICAgICAgICA9IHJlcXVpcmUoICcuLi9rZXknICksXG4gICAgQ29uc3QgICAgICAgICA9IHJlcXVpcmUoICcuLi9jb25zdCcgKSxcbiAgICBJbmRpY2F0b3IgICAgID0gVXRpbC5pbmRpY2F0b3IsXG5cbiAgICBkZWZhdWx0UGhhc2VzID0gW1xuICAgICAgICAnY29uZmlnUG9ydCcsXG4gICAgICAgICdjb25maWdEb21haW4nLFxuICAgICAgICAnY29uZmlnQWRkcmVzcycsXG4gICAgICAgICdjb25maWdQcm94eScsXG4gICAgICAgICdmaW5pc2gnXG4gICAgXVxuXG5jb25zdCBSQU5ET00gPSBLZXkucmFuZG9tLFxuICAgICAgTk9STUFMID0gS2V5Lm5vcm1hbCxcbiAgICAgIFlFUyAgICA9ICfmmK8nLFxuICAgICAgTk8gICAgID0gJ+WQpicsXG4gICAgICBOICAgICAgPSAnbidcblxuY2xhc3MgQ29uZmlnQ0xJIHtcbiAgICBjb25zdHJ1Y3RvciggcGF0aCApIHtcbiAgICAgICAgdGhpcy5pbml0KCBQYXRoLnJlc29sdmUoIHBhdGggKSApXG4gICAgfVxuXG4gICAgYXN5bmMgaW5pdCggcGF0aCApIHtcbiAgICAgICAgbGV0IHBoYXNlcyA9IGRlZmF1bHRQaGFzZXMuY29uY2F0KCksXG4gICAgICAgICAgICBuZXh0ICAgPSAoKSA9PiB7XG4gICAgICAgICAgICAgICAgbGV0IHBoYXNlID0gcGhhc2VzLnNoaWZ0KClcbiAgICAgICAgICAgICAgICBpZiAoIHBoYXNlICkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzWyBwaGFzZSBdKCBuZXh0IClcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgbGV0IGlzVmFsaWQgPSBhd2FpdCBXb3JrU3BhY2UuaXNWYWxpZFdvcmtTcGFjZSggcGF0aCApXG4gICAgICAgIGlmICggIWlzVmFsaWQgKSB7XG4gICAgICAgICAgICBsb2coIGAke3BhdGh9IOS4jeaYr+WQiOazleeahOW3peS9nOepuumXtO+8geivt+mHjeaWsOaMh+WummAsICd3YXJuJyApXG4gICAgICAgICAgICByZXR1cm5cbiAgICAgICAgfVxuICAgICAgICB0aGlzLmNvbmZpZyA9IG5ldyBDb25maWcoIHBhdGggKVxuXG4gICAgICAgIG5leHQoKVxuICAgIH1cblxuICAgIGNvbmZpZ1BvcnQoIG5leHQgKSB7XG4gICAgICAgIElucXVpcmVyXG4gICAgICAgICAgICAucHJvbXB0KCBbIHtcbiAgICAgICAgICAgICAgICB0eXBlOiAgICAnbGlzdCcsXG4gICAgICAgICAgICAgICAgbmFtZTogICAgJ3BvcnRPcHRpb24nLFxuICAgICAgICAgICAgICAgIG1lc3NhZ2U6ICfpgInmi6nnq6/lj6Plj7cnLFxuICAgICAgICAgICAgICAgIGNob2ljZXM6IFsgTk9STUFMLCBSQU5ET00gXSxcbiAgICAgICAgICAgICAgICBkZWZhdWx0OiBSQU5ET01cbiAgICAgICAgICAgIH0gXSwgYW5zd2VyID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLmNvbmZpZy5zZXRQb3J0T3B0aW9uKCBhbnN3ZXIucG9ydE9wdGlvbiApXG4gICAgICAgICAgICAgICAgbmV4dCgpXG4gICAgICAgICAgICB9IClcbiAgICB9XG5cbiAgICBjb25maWdEb21haW4oIG5leHQgKSB7XG4gICAgICAgIGxldCBjICAgICAgICAgICAgPSB0aGlzLmNvbmZpZyxcbiAgICAgICAgICAgIHNhdmVkRG9tYWlucyA9IGMuZ2V0U2F2ZWREb21haW5zKCksXG4gICAgICAgICAgICBkb21haW5zU2l6ZSAgPSBzYXZlZERvbWFpbnMubGVuZ3RoXG5cbiAgICAgICAgaWYgKCBkb21haW5zU2l6ZSApIHtcbiAgICAgICAgICAgIElucXVpcmVyXG4gICAgICAgICAgICAgICAgLnByb21wdCggWyB7XG4gICAgICAgICAgICAgICAgICAgIHR5cGU6ICAgICdsaXN0JyxcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogICAgJ292ZXJyaWRlJyxcbiAgICAgICAgICAgICAgICAgICAgbWVzc2FnZTogJ+aYr+WQpumHjeaWsOiuvue9ruWfn+WQjT8nLFxuICAgICAgICAgICAgICAgICAgICBjaG9pY2VzOiBbIFlFUywgTk8gXSxcbiAgICAgICAgICAgICAgICAgICAgZGVmYXVsdDogTk9cbiAgICAgICAgICAgICAgICB9IF0sIGFuc3dlciA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlmICggYW5zd2VyLm92ZXJyaWRlID09IFlFUyApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGMuY2xlYXJEb21haW5zKClcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmNvbmZpZ0RvbWFpbiggbmV4dCApXG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBuZXh0KClcbiAgICAgICAgICAgICAgICB9IClcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuY29sbGVjdERvbWFpbiggbmV4dCApXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBjb2xsZWN0RG9tYWluKCBuZXh0ICkge1xuICAgICAgICBJbnF1aXJlclxuICAgICAgICAgICAgLnByb21wdCggWyB7XG4gICAgICAgICAgICAgICAgbmFtZTogICAgJ2RvbWFpbicsXG4gICAgICAgICAgICAgICAgbWVzc2FnZTogJ+iuvue9ruWfn+WQjSjovpPlhaUgbiDlj6/ot7Pov4fmraTmraXpqqQpJyxcbiAgICAgICAgICAgICAgICB2YWxpZGF0ZSggZG9tYWluICkge1xuICAgICAgICAgICAgICAgICAgICBkb21haW4gPSBkb21haW4udHJpbSgpXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBkb21haW4uc3BsaXQoICcgJyApLmxlbmd0aCA9PSAyIHx8IGRvbWFpbiA9PSBOXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBdLCBhbnN3ZXIgPT4ge1xuICAgICAgICAgICAgICAgIGxldCBjICAgICAgICAgICA9IHRoaXMuY29uZmlnLFxuICAgICAgICAgICAgICAgICAgICBkb21haW4gICAgICA9IGFuc3dlci5kb21haW4udHJpbSgpLFxuICAgICAgICAgICAgICAgICAgICBkb21haW5BcnIgICA9IGRvbWFpbi5zcGxpdCggJyAnICksXG4gICAgICAgICAgICAgICAgICAgIGRvbWFpbnNTaXplID0gYy5nZXREb21haW5zU2l6ZSgpXG5cbiAgICAgICAgICAgICAgICBpZiAoIGRvbWFpbiA9PSBOICkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoIGRvbWFpbnNTaXplICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgbmV4dCgpXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsb2coICfoh7PlsJHpnIDopoHphY3nva7kuIDkuKrln5/lkI0nLCAnd2FybicgKVxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jb2xsZWN0RG9tYWluKCBuZXh0IClcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGMuYWRkRG9tYWluKCBkb21haW5BcnIgKVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5jb2xsZWN0RG9tYWluKCBuZXh0IClcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IClcbiAgICB9XG5cbiAgICBhc3luYyBjb25maWdBZGRyZXNzKCBuZXh0ICkge1xuICAgICAgICBsb2coICforr7nva4gSVAnIClcbiAgICAgICAgbGV0IGMgICAgICAgID0gdGhpcy5jb25maWcsXG4gICAgICAgICAgICBpc0NoYW5nZSA9IGF3YWl0IGMuaXNJUENoYW5nZSgpXG5cbiAgICAgICAgaWYgKCBpc0NoYW5nZSApIHtcbiAgICAgICAgICAgIGxvZyggJ0lQIOmcgOimgeabtOaWsC4uLicgKVxuICAgICAgICAgICAgSW5kaWNhdG9yLnN0YXJ0KCAn5pu05pawIElQIOWcsOWdgCcgKVxuXG4gICAgICAgICAgICBsZXQgaXNPSyAgPSBhd2FpdCBjLnVwZGF0ZUlQKCksXG4gICAgICAgICAgICAgICAgc3RhdGUgPSBpc09LID8gJ3N1Y2Nlc3MnIDogJ2Vycm9yJyxcbiAgICAgICAgICAgICAgICB0ZXh0ICA9IGlzT0sgPyAn5oiQ5YqfJyA6ICflpLHotKUnXG5cbiAgICAgICAgICAgIGxvZyggYFxcbuabtOaWsCBJUCDlnLDlnYAke3RleHR9YCwgc3RhdGUgKVxuICAgICAgICAgICAgbG9nKCBg5aaC5p6c5pu+57uP5pu05o2i6L+H56Gs55uYLCDpgqPkuYjpnIDopoHlnKjmnI3liqHlmajnq6/ph43mlrDphY3nva7mlrDnoaznm5jnmoQgbWFjIOWcsOWdgC5gLCAnc3VjY2VzcycgKVxuICAgICAgICAgICAgSW5kaWNhdG9yLnN0b3AoKVxuXG4gICAgICAgICAgICBpZiAoICFpc09LICkge1xuICAgICAgICAgICAgICAgIHJldHVyblxuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbG9nKCAnSVAg5Zyw5Z2A5peg5Y+Y5YyW77yM5LiN6ZyA6KaB5pu05pawJyApXG4gICAgICAgIH1cblxuICAgICAgICBuZXh0KClcbiAgICB9XG5cbiAgICBhc3luYyBjb25maWdQcm94eSggbmV4dCApIHtcbiAgICAgICAgSW5kaWNhdG9yLnN0YXJ0KCAn5pu05paw5Luj55CG5pyN5Yqh5ZmoJyApXG5cbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGF3YWl0IHRoaXMuY29uZmlnLnVwZGF0ZVByb3h5KClcbiAgICAgICAgfSBjYXRjaCAoIGUgKSB7XG4gICAgICAgICAgICBsb2coICfmnI3liqHlmajmjILkuoYs5ZaK6ZKx5LqRIScsICdlcnJvcicgKVxuICAgICAgICAgICAgSW5kaWNhdG9yLnN0b3AoKVxuICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgIH1cblxuICAgICAgICBJbmRpY2F0b3Iuc3RvcCgpXG4gICAgICAgIGxvZyggJ+abtOaWsOS7o+eQhuacjeWKoeWZqOaIkOWKnycsICdzdWNjZXNzJyApXG4gICAgICAgIG5leHQoKVxuICAgIH1cblxuICAgIGFzeW5jIGZpbmlzaCgpIHtcbiAgICAgICAgbGV0IHdvcmtzcGFjZSA9IG5ldyBXb3JrU3BhY2UoIHRoaXMuY29uZmlnLmdldFBhdGgoKSApLFxuICAgICAgICAgICAgZG9tYWluICAgID0gdGhpcy5jb25maWcuZ2V0U2F2ZWREb21haW5zKClbIDAgXS5rZXlcblxuICAgICAgICB3b3Jrc3BhY2UuYWN0aXZlKClcbiAgICAgICAgYXdhaXQgd29ya3NwYWNlLnN0YXJ0KClcblxuICAgICAgICBTbG9nYW4ueWVsbCgpXG4gICAgICAgIGxvZyggJz09PT09PT09PT09PT09PT09PT09JyApXG4gICAgICAgIGxvZyggJ3dob3JuYmlsbCDnjq/looPphY3nva7lrozmr5UnIClcbiAgICAgICAgbG9nKCAnQ2FnZSDnmoTor6bnu4bkvb/nlKjor7fmn6XnnIvmlofmoaPvvJpcXG5odHRwczovL2dpdGh1Yi5jb20vbWxzLWZlL2NhZ2UnIClcbiAgICAgICAgc2V0VGltZW91dCggKCkgPT4ge1xuICAgICAgICAgICAgT3BlbiggYGh0dHA6Ly8ke2RvbWFpbn0uZmVkZXZvdC5tZWlsaXNodW8uY29tYCApXG4gICAgICAgIH0sIDEwMDAgKVxuICAgIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBDb25maWdDTElcbiJdfQ==