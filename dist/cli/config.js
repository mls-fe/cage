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
                                c = this.config, isChange = c.isIPChange();

                                if (!isChange) {
                                    _context2.next = 17;
                                    break;
                                }

                                log('IP 需要更新...');
                                Indicator.start('更新 IP 地址');

                                _context2.next = 7;
                                return c.updateIP();

                            case 7:
                                isOK = _context2.sent;
                                state = isOK ? 'success' : 'error';
                                text = isOK ? '成功' : '失败';


                                log('\n更新 IP 地址' + text, state);
                                Indicator.stop();

                                if (isOK) {
                                    _context2.next = 15;
                                    break;
                                }

                                log('如果曾经更换过硬盘, 那么需要在服务器端重新配置新硬盘的 mac 地址.', 'error');
                                return _context2.abrupt('return');

                            case 15:
                                _context2.next = 18;
                                break;

                            case 17:
                                log('IP 地址无变化，不需要更新');

                            case 18:

                                next();

                            case 19:
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jbGkvY29uZmlnLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBQUEsSUFBSSxXQUFnQixRQUFTLFVBQVQsQ0FBcEI7SUFDSSxPQUFnQixRQUFTLE1BQVQsQ0FEcEI7SUFFSSxTQUFnQixRQUFTLGdCQUFULENBRnBCO0lBR0ksWUFBZ0IsUUFBUyxtQkFBVCxDQUhwQjtJQUlJLFNBQWdCLFFBQVMsV0FBVCxDQUpwQjtJQUtJLE9BQWdCLFFBQVMsU0FBVCxDQUxwQjtJQU1JLE1BQWdCLFFBQVMsUUFBVCxDQU5wQjtJQU9JLFlBQWdCLEtBQUssU0FQekI7SUFTSSxnQkFBZ0IsQ0FDWixZQURZLEVBRVosY0FGWSxFQUdaLGFBSFksRUFJWixlQUpZLEVBS1osUUFMWSxDQVRwQjs7QUFpQkEsSUFBTSxTQUFTLElBQUksTUFBbkI7SUFDTSxTQUFTLElBQUksTUFEbkI7SUFFTSxNQUFTLEdBRmY7SUFHTSxLQUFTLEdBSGY7SUFJTSxJQUFTLEdBSmY7O0lBTU0sUztBQUNGLHVCQUFhLElBQWIsRUFBb0I7QUFBQTs7QUFDaEIsYUFBSyxJQUFMLENBQVcsS0FBSyxPQUFMLENBQWMsSUFBZCxDQUFYO0FBQ0g7Ozs7O3dGQUVXLEk7OztvQkFDSixNLEVBQ0EsSSxFQU9BLE87Ozs7O0FBUkEsc0MsR0FBUyxjQUFjLE1BQWQsRSxFQUNULEksR0FBUyxTQUFULElBQVMsR0FBTTtBQUNYLHdDQUFJLFFBQVEsT0FBTyxLQUFQLEVBQVo7QUFDQSx3Q0FBSyxLQUFMLEVBQWE7QUFDVCw4Q0FBTSxLQUFOLEVBQWUsSUFBZjtBQUNIO0FBQ0osaUM7O3VDQUVlLFVBQVUsZ0JBQVYsQ0FBNEIsSUFBNUIsQzs7O0FBQWhCLHVDOztvQ0FDRSxPOzs7OztBQUNGLG9DQUFRLElBQVIsdUJBQWdDLE1BQWhDOzs7O0FBR0oscUNBQUssTUFBTCxHQUFjLElBQUksTUFBSixDQUFZLElBQVosQ0FBZDs7QUFFQTs7Ozs7Ozs7Ozs7Ozs7Ozs7O21DQUdRLEksRUFBTztBQUFBOztBQUNmLHFCQUNLLE1BREwsQ0FDYSxDQUFFO0FBQ1Asc0JBQVUsTUFESDtBQUVQLHNCQUFVLFlBRkg7QUFHUCx5QkFBVSxPQUhIO0FBSVAseUJBQVUsQ0FBRSxNQUFGLEVBQVUsTUFBVixDQUpIO0FBS1AseUJBQVU7QUFMSCxhQUFGLENBRGIsRUFPUyxrQkFBVTtBQUNYLHVCQUFLLE1BQUwsQ0FBWSxhQUFaLENBQTJCLE9BQU8sVUFBbEM7QUFDQTtBQUNILGFBVkw7QUFXSDs7O3FDQUVhLEksRUFBTztBQUFBOztBQUNqQixnQkFBSSxJQUFlLEtBQUssTUFBeEI7Z0JBQ0ksZUFBZSxFQUFFLGVBQUYsRUFEbkI7Z0JBRUksY0FBZSxhQUFhLE1BRmhDOztBQUlBLGdCQUFLLFdBQUwsRUFBbUI7QUFDZix5QkFDSyxNQURMLENBQ2EsQ0FBRTtBQUNQLDBCQUFVLE1BREg7QUFFUCwwQkFBVSxVQUZIO0FBR1AsNkJBQVUsV0FISDtBQUlQLDZCQUFVLENBQUUsR0FBRixFQUFPLEVBQVAsQ0FKSDtBQUtQLDZCQUFVO0FBTEgsaUJBQUYsQ0FEYixFQU9TLGtCQUFVO0FBQ1gsd0JBQUssT0FBTyxRQUFQLElBQW1CLEdBQXhCLEVBQThCO0FBQzFCLDBCQUFFLFlBQUY7QUFDQSwrQkFBTyxPQUFLLFlBQUwsQ0FBbUIsSUFBbkIsQ0FBUDtBQUNIOztBQUVEO0FBQ0gsaUJBZEw7QUFlSCxhQWhCRCxNQWdCTztBQUNILHFCQUFLLGFBQUwsQ0FBb0IsSUFBcEI7QUFDSDtBQUNKOzs7c0NBRWMsSSxFQUFPO0FBQUE7O0FBQ2xCLHFCQUNLLE1BREwsQ0FDYSxDQUFFO0FBQ1Asc0JBQVUsUUFESDtBQUVQLHlCQUFVLG1CQUZIO0FBR1Asd0JBSE8sb0JBR0csTUFISCxFQUdZO0FBQ2YsNkJBQVMsT0FBTyxJQUFQLEVBQVQ7QUFDQSwyQkFBTyxPQUFPLEtBQVAsQ0FBYyxHQUFkLEVBQW9CLE1BQXBCLElBQThCLENBQTlCLElBQW1DLFVBQVUsQ0FBcEQ7QUFDSDtBQU5NLGFBQUYsQ0FEYixFQVFTLGtCQUFVO0FBQ1gsb0JBQUksSUFBYyxPQUFLLE1BQXZCO29CQUNJLFNBQWMsT0FBTyxNQUFQLENBQWMsSUFBZCxFQURsQjtvQkFFSSxZQUFjLE9BQU8sS0FBUCxDQUFjLEdBQWQsQ0FGbEI7b0JBR0ksY0FBYyxFQUFFLGNBQUYsRUFIbEI7O0FBS0Esb0JBQUssVUFBVSxDQUFmLEVBQW1CO0FBQ2Ysd0JBQUssV0FBTCxFQUFtQjtBQUNmO0FBQ0gscUJBRkQsTUFFTztBQUNILDRCQUFLLFlBQUwsRUFBbUIsTUFBbkI7QUFDQSwrQkFBSyxhQUFMLENBQW9CLElBQXBCO0FBQ0g7QUFDSixpQkFQRCxNQU9PO0FBQ0gsc0JBQUUsU0FBRixDQUFhLFNBQWI7QUFDQSwyQkFBTyxPQUFLLGFBQUwsQ0FBb0IsSUFBcEIsQ0FBUDtBQUNIO0FBQ0osYUF6Qkw7QUEwQkg7Ozs7eUZBRW9CLEk7b0JBRWIsQyxFQUNBLFEsRUFNSSxJLEVBQ0EsSyxFQUNBLEk7Ozs7O0FBVlIsb0NBQUssT0FBTDtBQUNJLGlDLEdBQVcsS0FBSyxNLEVBQ2hCLFEsR0FBVyxFQUFFLFVBQUYsRTs7cUNBRVYsUTs7Ozs7QUFDRCxvQ0FBSyxZQUFMO0FBQ0EsMENBQVUsS0FBVixDQUFpQixVQUFqQjs7O3VDQUVrQixFQUFFLFFBQUYsRTs7O0FBQWQsb0M7QUFDQSxxQyxHQUFRLE9BQU8sU0FBUCxHQUFtQixPO0FBQzNCLG9DLEdBQVEsT0FBTyxJQUFQLEdBQWMsSTs7O0FBRTFCLG1EQUFrQixJQUFsQixFQUEwQixLQUExQjtBQUNBLDBDQUFVLElBQVY7O29DQUVNLEk7Ozs7O0FBQ0YsNEVBQTZDLE9BQTdDOzs7Ozs7OztBQUlKLG9DQUFLLGdCQUFMOzs7O0FBR0o7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7eUZBR2UsSTs7Ozs7QUFDZiwwQ0FBVSxLQUFWLENBQWlCLFNBQWpCOzs7O3VDQUdVLEtBQUssTUFBTCxDQUFZLFdBQVosRTs7Ozs7Ozs7OztBQUVOLG9DQUFLLFVBQUwsRUFBaUIsT0FBakI7Ozs7OztBQUdBLDBDQUFVLElBQVY7Ozs7O0FBR0osb0NBQUssV0FBTCxFQUFrQixTQUFsQjtBQUNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztvQkFJSSxTOzs7OztBQUFBLHlDLEdBQVksSUFBSSxTQUFKLENBQWUsS0FBSyxNQUFMLENBQVksT0FBWixFQUFmLEM7OztBQUVoQiwwQ0FBVSxNQUFWOzt1Q0FDTSxVQUFVLEtBQVYsRTs7OztBQUVOLHVDQUFPLElBQVA7QUFDQSxvQ0FBSyxzQkFBTDtBQUNBLG9DQUFLLGtCQUFMO0FBQ0Esb0NBQUssa0RBQUw7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUlSLE9BQU8sT0FBUCxHQUFpQixTQUFqQiIsImZpbGUiOiJjb25maWcuanMiLCJzb3VyY2VzQ29udGVudCI6WyJsZXQgSW5xdWlyZXIgICAgICA9IHJlcXVpcmUoICdpbnF1aXJlcicgKSxcbiAgICBQYXRoICAgICAgICAgID0gcmVxdWlyZSggJ3BhdGgnICksXG4gICAgQ29uZmlnICAgICAgICA9IHJlcXVpcmUoICcuLi9jb3JlL2NvbmZpZycgKSxcbiAgICBXb3JrU3BhY2UgICAgID0gcmVxdWlyZSggJy4uL2NvcmUvd29ya3NwYWNlJyApLFxuICAgIFNsb2dhbiAgICAgICAgPSByZXF1aXJlKCAnLi4vc2xvZ2FuJyApLFxuICAgIFV0aWwgICAgICAgICAgPSByZXF1aXJlKCAnLi4vdXRpbCcgKSxcbiAgICBLZXkgICAgICAgICAgID0gcmVxdWlyZSggJy4uL2tleScgKSxcbiAgICBJbmRpY2F0b3IgICAgID0gVXRpbC5pbmRpY2F0b3IsXG5cbiAgICBkZWZhdWx0UGhhc2VzID0gW1xuICAgICAgICAnY29uZmlnUG9ydCcsXG4gICAgICAgICdjb25maWdEb21haW4nLFxuICAgICAgICAnY29uZmlnUHJveHknLFxuICAgICAgICAnY29uZmlnQWRkcmVzcycsXG4gICAgICAgICdmaW5pc2gnXG4gICAgXVxuXG5jb25zdCBSQU5ET00gPSBLZXkucmFuZG9tLFxuICAgICAgTk9STUFMID0gS2V5Lm5vcm1hbCxcbiAgICAgIFlFUyAgICA9ICfmmK8nLFxuICAgICAgTk8gICAgID0gJ+WQpicsXG4gICAgICBOICAgICAgPSAnbidcblxuY2xhc3MgQ29uZmlnQ0xJIHtcbiAgICBjb25zdHJ1Y3RvciggcGF0aCApIHtcbiAgICAgICAgdGhpcy5pbml0KCBQYXRoLnJlc29sdmUoIHBhdGggKSApXG4gICAgfVxuXG4gICAgYXN5bmMgaW5pdCggcGF0aCApIHtcbiAgICAgICAgbGV0IHBoYXNlcyA9IGRlZmF1bHRQaGFzZXMuY29uY2F0KCksXG4gICAgICAgICAgICBuZXh0ICAgPSAoKSA9PiB7XG4gICAgICAgICAgICAgICAgbGV0IHBoYXNlID0gcGhhc2VzLnNoaWZ0KClcbiAgICAgICAgICAgICAgICBpZiAoIHBoYXNlICkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzWyBwaGFzZSBdKCBuZXh0IClcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgbGV0IGlzVmFsaWQgPSBhd2FpdCBXb3JrU3BhY2UuaXNWYWxpZFdvcmtTcGFjZSggcGF0aCApXG4gICAgICAgIGlmICggIWlzVmFsaWQgKSB7XG4gICAgICAgICAgICBsb2coIGAke3BhdGh9IOS4jeaYr+WQiOazleeahOW3peS9nOepuumXtO+8geivt+mHjeaWsOaMh+WummAsICd3YXJuJyApXG4gICAgICAgICAgICByZXR1cm5cbiAgICAgICAgfVxuICAgICAgICB0aGlzLmNvbmZpZyA9IG5ldyBDb25maWcoIHBhdGggKVxuXG4gICAgICAgIG5leHQoKVxuICAgIH1cblxuICAgIGNvbmZpZ1BvcnQoIG5leHQgKSB7XG4gICAgICAgIElucXVpcmVyXG4gICAgICAgICAgICAucHJvbXB0KCBbIHtcbiAgICAgICAgICAgICAgICB0eXBlICAgIDogJ2xpc3QnLFxuICAgICAgICAgICAgICAgIG5hbWUgICAgOiAncG9ydE9wdGlvbicsXG4gICAgICAgICAgICAgICAgbWVzc2FnZSA6ICfpgInmi6nnq6/lj6Plj7cnLFxuICAgICAgICAgICAgICAgIGNob2ljZXMgOiBbIE5PUk1BTCwgUkFORE9NIF0sXG4gICAgICAgICAgICAgICAgZGVmYXVsdCA6IFJBTkRPTVxuICAgICAgICAgICAgfSBdLCBhbnN3ZXIgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuY29uZmlnLnNldFBvcnRPcHRpb24oIGFuc3dlci5wb3J0T3B0aW9uIClcbiAgICAgICAgICAgICAgICBuZXh0KClcbiAgICAgICAgICAgIH0gKVxuICAgIH1cblxuICAgIGNvbmZpZ0RvbWFpbiggbmV4dCApIHtcbiAgICAgICAgbGV0IGMgICAgICAgICAgICA9IHRoaXMuY29uZmlnLFxuICAgICAgICAgICAgc2F2ZWREb21haW5zID0gYy5nZXRTYXZlZERvbWFpbnMoKSxcbiAgICAgICAgICAgIGRvbWFpbnNTaXplICA9IHNhdmVkRG9tYWlucy5sZW5ndGhcblxuICAgICAgICBpZiAoIGRvbWFpbnNTaXplICkge1xuICAgICAgICAgICAgSW5xdWlyZXJcbiAgICAgICAgICAgICAgICAucHJvbXB0KCBbIHtcbiAgICAgICAgICAgICAgICAgICAgdHlwZSAgICA6ICdsaXN0JyxcbiAgICAgICAgICAgICAgICAgICAgbmFtZSAgICA6ICdvdmVycmlkZScsXG4gICAgICAgICAgICAgICAgICAgIG1lc3NhZ2UgOiAn5piv5ZCm6YeN5paw6K6+572u5Z+f5ZCNPycsXG4gICAgICAgICAgICAgICAgICAgIGNob2ljZXMgOiBbIFlFUywgTk8gXSxcbiAgICAgICAgICAgICAgICAgICAgZGVmYXVsdCA6IE5PXG4gICAgICAgICAgICAgICAgfSBdLCBhbnN3ZXIgPT4ge1xuICAgICAgICAgICAgICAgICAgICBpZiAoIGFuc3dlci5vdmVycmlkZSA9PSBZRVMgKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjLmNsZWFyRG9tYWlucygpXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5jb25maWdEb21haW4oIG5leHQgKVxuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgbmV4dCgpXG4gICAgICAgICAgICAgICAgfSApXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmNvbGxlY3REb21haW4oIG5leHQgKVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgY29sbGVjdERvbWFpbiggbmV4dCApIHtcbiAgICAgICAgSW5xdWlyZXJcbiAgICAgICAgICAgIC5wcm9tcHQoIFsge1xuICAgICAgICAgICAgICAgIG5hbWUgICAgOiAnZG9tYWluJyxcbiAgICAgICAgICAgICAgICBtZXNzYWdlIDogJ+iuvue9ruWfn+WQjSjovpPlhaUgbiDlj6/ot7Pov4fmraTmraXpqqQpJyxcbiAgICAgICAgICAgICAgICB2YWxpZGF0ZSggZG9tYWluICkge1xuICAgICAgICAgICAgICAgICAgICBkb21haW4gPSBkb21haW4udHJpbSgpXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBkb21haW4uc3BsaXQoICcgJyApLmxlbmd0aCA9PSAyIHx8IGRvbWFpbiA9PSBOXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBdLCBhbnN3ZXIgPT4ge1xuICAgICAgICAgICAgICAgIGxldCBjICAgICAgICAgICA9IHRoaXMuY29uZmlnLFxuICAgICAgICAgICAgICAgICAgICBkb21haW4gICAgICA9IGFuc3dlci5kb21haW4udHJpbSgpLFxuICAgICAgICAgICAgICAgICAgICBkb21haW5BcnIgICA9IGRvbWFpbi5zcGxpdCggJyAnICksXG4gICAgICAgICAgICAgICAgICAgIGRvbWFpbnNTaXplID0gYy5nZXREb21haW5zU2l6ZSgpXG5cbiAgICAgICAgICAgICAgICBpZiAoIGRvbWFpbiA9PSBOICkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoIGRvbWFpbnNTaXplICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgbmV4dCgpXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsb2coICfoh7PlsJHpnIDopoHphY3nva7kuIDkuKrln5/lkI0nLCAnd2FybicgKVxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jb2xsZWN0RG9tYWluKCBuZXh0IClcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGMuYWRkRG9tYWluKCBkb21haW5BcnIgKVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5jb2xsZWN0RG9tYWluKCBuZXh0IClcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IClcbiAgICB9XG5cbiAgICBhc3luYyBjb25maWdBZGRyZXNzKCBuZXh0ICkge1xuICAgICAgICBsb2coICforr7nva4gSVAnIClcbiAgICAgICAgbGV0IGMgICAgICAgID0gdGhpcy5jb25maWcsXG4gICAgICAgICAgICBpc0NoYW5nZSA9IGMuaXNJUENoYW5nZSgpXG5cbiAgICAgICAgaWYgKCBpc0NoYW5nZSApIHtcbiAgICAgICAgICAgIGxvZyggJ0lQIOmcgOimgeabtOaWsC4uLicgKVxuICAgICAgICAgICAgSW5kaWNhdG9yLnN0YXJ0KCAn5pu05pawIElQIOWcsOWdgCcgKVxuXG4gICAgICAgICAgICBsZXQgaXNPSyAgPSBhd2FpdCBjLnVwZGF0ZUlQKCksXG4gICAgICAgICAgICAgICAgc3RhdGUgPSBpc09LID8gJ3N1Y2Nlc3MnIDogJ2Vycm9yJyxcbiAgICAgICAgICAgICAgICB0ZXh0ICA9IGlzT0sgPyAn5oiQ5YqfJyA6ICflpLHotKUnXG5cbiAgICAgICAgICAgIGxvZyggYFxcbuabtOaWsCBJUCDlnLDlnYAke3RleHR9YCwgc3RhdGUgKVxuICAgICAgICAgICAgSW5kaWNhdG9yLnN0b3AoKVxuXG4gICAgICAgICAgICBpZiAoICFpc09LICkge1xuICAgICAgICAgICAgICAgIGxvZyggYOWmguaenOabvue7j+abtOaNoui/h+ehrOebmCwg6YKj5LmI6ZyA6KaB5Zyo5pyN5Yqh5Zmo56uv6YeN5paw6YWN572u5paw56Gs55uY55qEIG1hYyDlnLDlnYAuYCwgJ2Vycm9yJyApXG4gICAgICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBsb2coICdJUCDlnLDlnYDml6Dlj5jljJbvvIzkuI3pnIDopoHmm7TmlrAnIClcbiAgICAgICAgfVxuXG4gICAgICAgIG5leHQoKVxuICAgIH1cblxuICAgIGFzeW5jIGNvbmZpZ1Byb3h5KCBuZXh0ICkge1xuICAgICAgICBJbmRpY2F0b3Iuc3RhcnQoICfmm7TmlrDku6PnkIbmnI3liqHlmagnIClcblxuICAgICAgICB0cnkge1xuICAgICAgICAgICAgYXdhaXQgdGhpcy5jb25maWcudXBkYXRlUHJveHkoKVxuICAgICAgICB9IGNhdGNoICggZSApIHtcbiAgICAgICAgICAgIGxvZyggJ1xccuacjeWKoeWZqOaMguS6hiEnLCAnZXJyb3InIClcbiAgICAgICAgICAgIHJldHVyblxuICAgICAgICB9IGZpbmFsbHkge1xuICAgICAgICAgICAgSW5kaWNhdG9yLnN0b3AoKVxuICAgICAgICB9XG5cbiAgICAgICAgbG9nKCAn5pu05paw5Luj55CG5pyN5Yqh5Zmo5oiQ5YqfJywgJ3N1Y2Nlc3MnIClcbiAgICAgICAgbmV4dCgpXG4gICAgfVxuXG4gICAgYXN5bmMgZmluaXNoKCkge1xuICAgICAgICBsZXQgd29ya3NwYWNlID0gbmV3IFdvcmtTcGFjZSggdGhpcy5jb25maWcuZ2V0UGF0aCgpIClcblxuICAgICAgICB3b3Jrc3BhY2UuYWN0aXZlKClcbiAgICAgICAgYXdhaXQgd29ya3NwYWNlLnN0YXJ0KClcblxuICAgICAgICBTbG9nYW4ueWVsbCgpXG4gICAgICAgIGxvZyggJz09PT09PT09PT09PT09PT09PT09JyApXG4gICAgICAgIGxvZyggJ3dob3JuYmlsbCDnjq/looPphY3nva7lrozmr5UnIClcbiAgICAgICAgbG9nKCAnQ2FnZSDnmoTor6bnu4bkvb/nlKjor7fmn6XnnIvmlofmoaPvvJpcXG5odHRwczovL2dpdGh1Yi5jb20vbWxzLWZlL2NhZ2UnIClcbiAgICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gQ29uZmlnQ0xJXG4iXX0=