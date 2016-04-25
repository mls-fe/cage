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
    N = 'n';

var ConfigCLI = function () {
    function ConfigCLI(path) {
        _classCallCheck(this, ConfigCLI);

        this.init(Path.resolve(path));
    }

    _createClass(ConfigCLI, [{
        key: 'init',
        value: function () {
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

            function init(_x) {
                return ref.apply(this, arguments);
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
        value: function () {
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

            function configAddress(_x2) {
                return ref.apply(this, arguments);
            }

            return configAddress;
        }()
    }, {
        key: 'configProxy',
        value: function () {
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
                                _context3.next = 10;
                                break;

                            case 6:
                                _context3.prev = 6;
                                _context3.t0 = _context3['catch'](1);

                                log('\r服务器挂了!', 'error');
                                return _context3.abrupt('return');

                            case 10:
                                _context3.prev = 10;

                                Indicator.stop();
                                return _context3.finish(10);

                            case 13:

                                log('更新代理服务器成功', 'success');
                                next();

                            case 15:
                            case 'end':
                                return _context3.stop();
                        }
                    }
                }, _callee3, this, [[1, 6, 10, 13]]);
            }));

            function configProxy(_x3) {
                return ref.apply(this, arguments);
            }

            return configProxy;
        }()
    }, {
        key: 'finish',
        value: function () {
            var ref = (0, _bluebird.coroutine)(regeneratorRuntime.mark(function _callee4() {
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
                return ref.apply(this, arguments);
            }

            return finish;
        }()
    }]);

    return ConfigCLI;
}();

module.exports = ConfigCLI;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jbGkvY29uZmlnLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBQUEsSUFBSSxXQUFnQixRQUFTLFVBQVQsQ0FBcEI7SUFDSSxPQUFnQixRQUFTLE1BQVQsQ0FEcEI7SUFFSSxTQUFnQixRQUFTLGdCQUFULENBRnBCO0lBR0ksWUFBZ0IsUUFBUyxtQkFBVCxDQUhwQjtJQUlJLFNBQWdCLFFBQVMsV0FBVCxDQUpwQjtJQUtJLE9BQWdCLFFBQVMsU0FBVCxDQUxwQjtJQU1JLE1BQWdCLFFBQVMsUUFBVCxDQU5wQjtJQU9JLFlBQWdCLEtBQUssU0FQekI7SUFTSSxnQkFBZ0IsQ0FDWixZQURZLEVBRVosY0FGWSxFQUdaLGFBSFksRUFJWixlQUpZLEVBS1osUUFMWSxDQVRwQjs7QUFpQkEsSUFBTSxTQUFTLElBQUksTUFBbkI7SUFDTSxTQUFTLElBQUksTUFEbkI7SUFFTSxNQUFTLEdBRmY7SUFHTSxLQUFTLEdBSGY7SUFJTSxJQUFTLEdBSmY7O0lBTU0sUztBQUNGLHVCQUFhLElBQWIsRUFBb0I7QUFBQTs7QUFDaEIsYUFBSyxJQUFMLENBQVcsS0FBSyxPQUFMLENBQWMsSUFBZCxDQUFYO0FBQ0g7Ozs7O3dGQUVXLEk7OztvQkFDSixNLEVBQ0EsSSxFQU9BLE87Ozs7O0FBUkEsc0MsR0FBUyxjQUFjLE1BQWQsRSxFQUNULEksR0FBUyxTQUFULElBQVMsR0FBTTtBQUNYLHdDQUFJLFFBQVEsT0FBTyxLQUFQLEVBQVo7QUFDQSx3Q0FBSyxLQUFMLEVBQWE7QUFDVCw4Q0FBTSxLQUFOLEVBQWUsSUFBZjtBQUNIO0FBQ0osaUM7O3VDQUVlLFVBQVUsZ0JBQVYsQ0FBNEIsSUFBNUIsQzs7O0FBQWhCLHVDOztvQ0FDRSxPOzs7OztBQUNGLG9DQUFRLElBQVIsdUJBQWdDLE1BQWhDOzs7O0FBR0oscUNBQUssTUFBTCxHQUFjLElBQUksTUFBSixDQUFZLElBQVosQ0FBZDs7QUFFQTs7Ozs7Ozs7Ozs7Ozs7Ozs7O21DQUdRLEksRUFB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QUFMLEVBQWtCLFNBQWxCO0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O29CQUlJLFM7Ozs7O0FBQUEseUMsR0FBWSxJQUFJLFNBQUosQ0FBZSxLQUFLLE1BQUwsQ0FBWSxPQUFaLEVBQWYsQzs7O0FBRWhCLDBDQUFVLE1BQVY7O3VDQUNNLFVBQVUsS0FBVixFOzs7O0FBRU4sdUNBQU8sSUFBUDtBQUNBLG9DQUFLLHNCQUFMO0FBQ0Esb0NBQUssa0JBQUw7QUFDQSxvQ0FBSyxrREFBTDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBSVIsT0FBTyxPQUFQLEdBQWlCLFNBQWpCIiwiZmlsZSI6ImNvbmZpZy5qcyIsInNvdXJjZXNDb250ZW50IjpbImxldCBJbnF1aXJlciAgICAgID0gcmVxdWlyZSggJ2lucXVpcmVyJyApLFxuICAgIFBhdGggICAgICAgICAgPSByZXF1aXJlKCAncGF0aCcgKSxcbiAgICBDb25maWcgICAgICAgID0gcmVxdWlyZSggJy4uL2NvcmUvY29uZmlnJyApLFxuICAgIFdvcmtTcGFjZSAgICAgPSByZXF1aXJlKCAnLi4vY29yZS93b3Jrc3BhY2UnICksXG4gICAgU2xvZ2FuICAgICAgICA9IHJlcXVpcmUoICcuLi9zbG9nYW4nICksXG4gICAgVXRpbCAgICAgICAgICA9IHJlcXVpcmUoICcuLi91dGlsJyApLFxuICAgIEtleSAgICAgICAgICAgPSByZXF1aXJlKCAnLi4va2V5JyApLFxuICAgIEluZGljYXRvciAgICAgPSBVdGlsLmluZGljYXRvcixcblxuICAgIGRlZmF1bHRQaGFzZXMgPSBbXG4gICAgICAgICdjb25maWdQb3J0JyxcbiAgICAgICAgJ2NvbmZpZ0RvbWFpbicsXG4gICAgICAgICdjb25maWdQcm94eScsXG4gICAgICAgICdjb25maWdBZGRyZXNzJyxcbiAgICAgICAgJ2ZpbmlzaCdcbiAgICBdXG5cbmNvbnN0IFJBTkRPTSA9IEtleS5yYW5kb20sXG4gICAgICBOT1JNQUwgPSBLZXkubm9ybWFsLFxuICAgICAgWUVTICAgID0gJ+aYrycsXG4gICAgICBOTyAgICAgPSAn5ZCmJyxcbiAgICAgIE4gICAgICA9ICduJ1xuXG5jbGFzcyBDb25maWdDTEkge1xuICAgIGNvbnN0cnVjdG9yKCBwYXRoICkge1xuICAgICAgICB0aGlzLmluaXQoIFBhdGgucmVzb2x2ZSggcGF0aCApIClcbiAgICB9XG5cbiAgICBhc3luYyBpbml0KCBwYXRoICkge1xuICAgICAgICBsZXQgcGhhc2VzID0gZGVmYXVsdFBoYXNlcy5jb25jYXQoKSxcbiAgICAgICAgICAgIG5leHQgICA9ICgpID0+IHtcbiAgICAgICAgICAgICAgICBsZXQgcGhhc2UgPSBwaGFzZXMuc2hpZnQoKVxuICAgICAgICAgICAgICAgIGlmICggcGhhc2UgKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXNbIHBoYXNlIF0oIG5leHQgKVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICBsZXQgaXNWYWxpZCA9IGF3YWl0IFdvcmtTcGFjZS5pc1ZhbGlkV29ya1NwYWNlKCBwYXRoIClcbiAgICAgICAgaWYgKCAhaXNWYWxpZCApIHtcbiAgICAgICAgICAgIGxvZyggYCR7cGF0aH0g5LiN5piv5ZCI5rOV55qE5bel5L2c56m66Ze077yB6K+36YeN5paw5oyH5a6aYCwgJ3dhcm4nIClcbiAgICAgICAgICAgIHJldHVyblxuICAgICAgICB9XG4gICAgICAgIHRoaXMuY29uZmlnID0gbmV3IENvbmZpZyggcGF0aCApXG5cbiAgICAgICAgbmV4dCgpXG4gICAgfVxuXG4gICAgY29uZmlnUG9ydCggbmV4dCApIHtcbiAgICAgICAgSW5xdWlyZXJcbiAgICAgICAgICAgIC5wcm9tcHQoIFsge1xuICAgICAgICAgICAgICAgIHR5cGUgICAgOiAnbGlzdCcsXG4gICAgICAgICAgICAgICAgbmFtZSAgICA6ICdwb3J0T3B0aW9uJyxcbiAgICAgICAgICAgICAgICBtZXNzYWdlIDogJ+mAieaLqeerr+WPo+WPtycsXG4gICAgICAgICAgICAgICAgY2hvaWNlcyA6IFsgTk9STUFMLCBSQU5ET00gXSxcbiAgICAgICAgICAgICAgICBkZWZhdWx0IDogUkFORE9NXG4gICAgICAgICAgICB9IF0sIGFuc3dlciA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5jb25maWcuc2V0UG9ydE9wdGlvbiggYW5zd2VyLnBvcnRPcHRpb24gKVxuICAgICAgICAgICAgICAgIG5leHQoKVxuICAgICAgICAgICAgfSApXG4gICAgfVxuXG4gICAgY29uZmlnRG9tYWluKCBuZXh0ICkge1xuICAgICAgICBsZXQgYyAgICAgICAgICAgID0gdGhpcy5jb25maWcsXG4gICAgICAgICAgICBzYXZlZERvbWFpbnMgPSBjLmdldFNhdmVkRG9tYWlucygpLFxuICAgICAgICAgICAgZG9tYWluc1NpemUgID0gc2F2ZWREb21haW5zLmxlbmd0aFxuXG4gICAgICAgIGlmICggZG9tYWluc1NpemUgKSB7XG4gICAgICAgICAgICBJbnF1aXJlclxuICAgICAgICAgICAgICAgIC5wcm9tcHQoIFsge1xuICAgICAgICAgICAgICAgICAgICB0eXBlICAgIDogJ2xpc3QnLFxuICAgICAgICAgICAgICAgICAgICBuYW1lICAgIDogJ292ZXJyaWRlJyxcbiAgICAgICAgICAgICAgICAgICAgbWVzc2FnZSA6ICfmmK/lkKbph43mlrDorr7nva7ln5/lkI0/JyxcbiAgICAgICAgICAgICAgICAgICAgY2hvaWNlcyA6IFsgWUVTLCBOTyBdLFxuICAgICAgICAgICAgICAgICAgICBkZWZhdWx0IDogTk9cbiAgICAgICAgICAgICAgICB9IF0sIGFuc3dlciA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlmICggYW5zd2VyLm92ZXJyaWRlID09IFlFUyApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGMuY2xlYXJEb21haW5zKClcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmNvbmZpZ0RvbWFpbiggbmV4dCApXG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBuZXh0KClcbiAgICAgICAgICAgICAgICB9IClcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuY29sbGVjdERvbWFpbiggbmV4dCApXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBjb2xsZWN0RG9tYWluKCBuZXh0ICkge1xuICAgICAgICBJbnF1aXJlclxuICAgICAgICAgICAgLnByb21wdCggWyB7XG4gICAgICAgICAgICAgICAgbmFtZSAgICA6ICdkb21haW4nLFxuICAgICAgICAgICAgICAgIG1lc3NhZ2UgOiAn6K6+572u5Z+f5ZCNKOi+k+WFpSBuIOWPr+i3s+i/h+atpOatpemqpCknLFxuICAgICAgICAgICAgICAgIHZhbGlkYXRlKCBkb21haW4gKSB7XG4gICAgICAgICAgICAgICAgICAgIGRvbWFpbiA9IGRvbWFpbi50cmltKClcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGRvbWFpbi5zcGxpdCggJyAnICkubGVuZ3RoID09IDIgfHwgZG9tYWluID09IE5cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IF0sIGFuc3dlciA9PiB7XG4gICAgICAgICAgICAgICAgbGV0IGMgICAgICAgICAgID0gdGhpcy5jb25maWcsXG4gICAgICAgICAgICAgICAgICAgIGRvbWFpbiAgICAgID0gYW5zd2VyLmRvbWFpbi50cmltKCksXG4gICAgICAgICAgICAgICAgICAgIGRvbWFpbkFyciAgID0gZG9tYWluLnNwbGl0KCAnICcgKSxcbiAgICAgICAgICAgICAgICAgICAgZG9tYWluc1NpemUgPSBjLmdldERvbWFpbnNTaXplKClcblxuICAgICAgICAgICAgICAgIGlmICggZG9tYWluID09IE4gKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICggZG9tYWluc1NpemUgKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBuZXh0KClcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxvZyggJ+iHs+WwkemcgOimgemFjee9ruS4gOS4quWfn+WQjScsICd3YXJuJyApXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNvbGxlY3REb21haW4oIG5leHQgKVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgYy5hZGREb21haW4oIGRvbWFpbkFyciApXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmNvbGxlY3REb21haW4oIG5leHQgKVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gKVxuICAgIH1cblxuICAgIGFzeW5jIGNvbmZpZ0FkZHJlc3MoIG5leHQgKSB7XG4gICAgICAgIGxvZyggJ+iuvue9riBJUCcgKVxuICAgICAgICBsZXQgYyAgICAgICAgPSB0aGlzLmNvbmZpZyxcbiAgICAgICAgICAgIGlzQ2hhbmdlID0gYXdhaXQgYy5pc0lQQ2hhbmdlKClcblxuICAgICAgICBpZiAoIGlzQ2hhbmdlICkge1xuICAgICAgICAgICAgbG9nKCAnSVAg6ZyA6KaB5pu05pawLi4uJyApXG4gICAgICAgICAgICBJbmRpY2F0b3Iuc3RhcnQoICfmm7TmlrAgSVAg5Zyw5Z2AJyApXG5cbiAgICAgICAgICAgIGxldCBpc09LICA9IGF3YWl0IGMudXBkYXRlSVAoKSxcbiAgICAgICAgICAgICAgICBzdGF0ZSA9IGlzT0sgPyAnc3VjY2VzcycgOiAnZXJyb3InLFxuICAgICAgICAgICAgICAgIHRleHQgID0gaXNPSyA/ICfmiJDlip8nIDogJ+Wksei0pSdcblxuICAgICAgICAgICAgbG9nKCBgXFxu5pu05pawIElQIOWcsOWdgCR7dGV4dH1gLCBzdGF0ZSApXG4gICAgICAgICAgICBJbmRpY2F0b3Iuc3RvcCgpXG5cbiAgICAgICAgICAgIGlmICggIWlzT0sgKSB7XG4gICAgICAgICAgICAgICAgbG9nKCBg5aaC5p6c5pu+57uP5pu05o2i6L+H56Gs55uYLCDpgqPkuYjpnIDopoHlnKjmnI3liqHlmajnq6/ph43mlrDphY3nva7mlrDnoaznm5jnmoQgbWFjIOWcsOWdgC5gLCAnZXJyb3InIClcbiAgICAgICAgICAgICAgICByZXR1cm5cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGxvZyggJ0lQIOWcsOWdgOaXoOWPmOWMlu+8jOS4jemcgOimgeabtOaWsCcgKVxuICAgICAgICB9XG5cbiAgICAgICAgbmV4dCgpXG4gICAgfVxuXG4gICAgYXN5bmMgY29uZmlnUHJveHkoIG5leHQgKSB7XG4gICAgICAgIEluZGljYXRvci5zdGFydCggJ+abtOaWsOS7o+eQhuacjeWKoeWZqCcgKVxuXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBhd2FpdCB0aGlzLmNvbmZpZy51cGRhdGVQcm94eSgpXG4gICAgICAgIH0gY2F0Y2ggKCBlICkge1xuICAgICAgICAgICAgbG9nKCAnXFxy5pyN5Yqh5Zmo5oyC5LqGIScsICdlcnJvcicgKVxuICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgIH0gZmluYWxseSB7XG4gICAgICAgICAgICBJbmRpY2F0b3Iuc3RvcCgpXG4gICAgICAgIH1cblxuICAgICAgICBsb2coICfmm7TmlrDku6PnkIbmnI3liqHlmajmiJDlip8nLCAnc3VjY2VzcycgKVxuICAgICAgICBuZXh0KClcbiAgICB9XG5cbiAgICBhc3luYyBmaW5pc2goKSB7XG4gICAgICAgIGxldCB3b3Jrc3BhY2UgPSBuZXcgV29ya1NwYWNlKCB0aGlzLmNvbmZpZy5nZXRQYXRoKCkgKVxuXG4gICAgICAgIHdvcmtzcGFjZS5hY3RpdmUoKVxuICAgICAgICBhd2FpdCB3b3Jrc3BhY2Uuc3RhcnQoKVxuXG4gICAgICAgIFNsb2dhbi55ZWxsKClcbiAgICAgICAgbG9nKCAnPT09PT09PT09PT09PT09PT09PT0nIClcbiAgICAgICAgbG9nKCAnd2hvcm5iaWxsIOeOr+Wig+mFjee9ruWujOavlScgKVxuICAgICAgICBsb2coICdDYWdlIOeahOivpue7huS9v+eUqOivt+afpeeci+aWh+aho++8mlxcbmh0dHBzOi8vZ2l0aHViLmNvbS9tbHMtZmUvY2FnZScgKVxuICAgIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBDb25maWdDTElcbiJdfQ==