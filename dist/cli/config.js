'use strict';

var _bluebird = require('bluebird');

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

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
        value: _bluebird.coroutine(function* (path) {
            var _this = this;

            var phases = defaultPhases.concat(),
                next = function next() {
                var phase = phases.shift();
                if (phase) {
                    _this[phase](next);
                }
            };

            var isValid = yield WorkSpace.isValidWorkSpace(path);
            if (!isValid) {
                log(path + ' 不是合法的工作空间！请重新指定', 'warn');
                return;
            }
            this.config = new Config(path);

            next();
        })
    }, {
        key: 'configPort',
        value: function configPort(next) {
            var _this2 = this;

            Inquirer.prompt([{
                type: 'list',
                name: 'portOption',
                message: '选择端口号',
                choices: [NORMAL, RANDOM],
                'default': RANDOM
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
                    'default': NO
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
        value: _bluebird.coroutine(function* (next) {
            log('设置 IP');
            var c = this.config,
                isChange = yield c.isIPChange();

            if (isChange) {
                log('IP 需要更新...');
                Indicator.start('更新 IP 地址');

                var isOK = yield c.updateIP(),
                    state = isOK ? 'success' : 'error',
                    text = isOK ? '成功' : '失败';

                log('\n更新 IP 地址' + text, state);
                Indicator.stop();
            } else {
                log('IP 地址无变化，不需要更新');
            }

            next();
        })
    }, {
        key: 'configProxy',
        value: _bluebird.coroutine(function* (next) {
            Indicator.start('更新代理服务器');

            try {
                yield this.config.updateProxy();
            } catch (e) {
                log('服务器挂了,喊钱云!', 'error');
                Indicator.stop();
                return;
            }

            Indicator.stop();
            log('更新代理服务器成功', 'success');
            next();
        })
    }, {
        key: 'finish',
        value: _bluebird.coroutine(function* () {
            var workspace = new WorkSpace(this.config.getPath()),
                domain = this.config.getSavedDomains()[0].key;

            workspace.active();
            yield workspace.start();

            Slogan.yell();
            log('====================');
            log('whornbill 环境配置完毕');
            log('Cage 的详细使用请查看文档：\nhttps://github.com/mls-fe/cage');
            setTimeout(function () {
                Open('http://' + domain + '.fedevot.meilishuo.com');
            }, 1000);
        })
    }]);

    return ConfigCLI;
})();

module.exports = ConfigCLI;
//# sourceMappingURL=data:application/json;base64,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QUFDLElBQUksRUFBRSxDQUFBO0FBQ2hCLHVCQUFNO2FBQ1Q7O0FBRUQscUJBQVMsQ0FBQyxJQUFJLEVBQUUsQ0FBQTtBQUNoQixlQUFHLENBQUUsV0FBVyxFQUFFLFNBQVMsQ0FBRSxDQUFBO0FBQzdCLGdCQUFJLEVBQUUsQ0FBQTtTQUNUOzs7bUNBRVcsYUFBRztBQUNYLGdCQUFJLFNBQVMsR0FBRyxJQUFJLFNBQVMsQ0FBRSxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sRUFBRSxDQUFFO2dCQUNsRCxNQUFNLEdBQU0sSUFBSSxDQUFDLE1BQU0sQ0FBQyxlQUFlLEVBQUUsQ0FBRSxDQUFDLENBQUUsQ0FBQyxHQUFHLENBQUE7O0FBRXRELHFCQUFTLENBQUMsTUFBTSxFQUFFLENBQUE7QUFDbEIsa0JBQU0sU0FBUyxDQUFDLEtBQUssRUFBRSxDQUFBOztBQUV2QixrQkFBTSxDQUFDLElBQUksRUFBRSxDQUFBO0FBQ2IsZUFBRyxDQUFFLHNCQUFzQixDQUFFLENBQUE7QUFDN0IsZUFBRyxDQUFFLGtCQUFrQixDQUFFLENBQUE7QUFDekIsZUFBRyxDQUFFLGtEQUFrRCxDQUFFLENBQUE7QUFDekQsc0JBQVUsQ0FBRSxZQUFNO0FBQ2Qsb0JBQUksYUFBWSxNQUFNLDRCQUEwQixDQUFBO2FBQ25ELEVBQUUsSUFBSSxDQUFFLENBQUE7U0FDWjs7O1dBakpDLFNBQVM7OztBQW9KZixNQUFNLENBQUMsT0FBTyxHQUFHLFNBQVMsQ0FBQSIsImZpbGUiOiJjbGkvY29uZmlnLmpzIiwic291cmNlc0NvbnRlbnQiOlsibGV0IElucXVpcmVyICAgICAgPSByZXF1aXJlKCAnaW5xdWlyZXInICksXG4gICAgUGF0aCAgICAgICAgICA9IHJlcXVpcmUoICdwYXRoJyApLFxuICAgIE9wZW4gICAgICAgICAgPSByZXF1aXJlKCAnb3BlbicgKSxcbiAgICBDb25maWcgICAgICAgID0gcmVxdWlyZSggJy4uL2NvcmUvY29uZmlnJyApLFxuICAgIFdvcmtTcGFjZSAgICAgPSByZXF1aXJlKCAnLi4vY29yZS93b3Jrc3BhY2UnICksXG4gICAgU2xvZ2FuICAgICAgICA9IHJlcXVpcmUoICcuLi9zbG9nYW4nICksXG4gICAgVXRpbCAgICAgICAgICA9IHJlcXVpcmUoICcuLi91dGlsJyApLFxuICAgIEtleSAgICAgICAgICAgPSByZXF1aXJlKCAnLi4va2V5JyApLFxuICAgIENvbnN0ICAgICAgICAgPSByZXF1aXJlKCAnLi4vY29uc3QnICksXG4gICAgSW5kaWNhdG9yICAgICA9IFV0aWwuaW5kaWNhdG9yLFxuXG4gICAgZGVmYXVsdFBoYXNlcyA9IFtcbiAgICAgICAgJ2NvbmZpZ1BvcnQnLFxuICAgICAgICAnY29uZmlnRG9tYWluJyxcbiAgICAgICAgJ2NvbmZpZ0FkZHJlc3MnLFxuICAgICAgICAnY29uZmlnUHJveHknLFxuICAgICAgICAnZmluaXNoJ1xuICAgIF1cblxuY29uc3QgUkFORE9NID0gS2V5LnJhbmRvbSxcbiAgICAgIE5PUk1BTCA9IEtleS5ub3JtYWwsXG4gICAgICBZRVMgICAgPSAn5pivJyxcbiAgICAgIE5PICAgICA9ICflkKYnLFxuICAgICAgTiAgICAgID0gJ24nXG5cbmNsYXNzIENvbmZpZ0NMSSB7XG4gICAgY29uc3RydWN0b3IoIHBhdGggKSB7XG4gICAgICAgIHRoaXMuaW5pdCggUGF0aC5yZXNvbHZlKCBwYXRoICkgKVxuICAgIH1cblxuICAgIGFzeW5jIGluaXQoIHBhdGggKSB7XG4gICAgICAgIGxldCBwaGFzZXMgPSBkZWZhdWx0UGhhc2VzLmNvbmNhdCgpLFxuICAgICAgICAgICAgbmV4dCAgID0gKCkgPT4ge1xuICAgICAgICAgICAgICAgIGxldCBwaGFzZSA9IHBoYXNlcy5zaGlmdCgpXG4gICAgICAgICAgICAgICAgaWYgKCBwaGFzZSApIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpc1sgcGhhc2UgXSggbmV4dCApXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgIGxldCBpc1ZhbGlkID0gYXdhaXQgV29ya1NwYWNlLmlzVmFsaWRXb3JrU3BhY2UoIHBhdGggKVxuICAgICAgICBpZiAoICFpc1ZhbGlkICkge1xuICAgICAgICAgICAgbG9nKCBgJHtwYXRofSDkuI3mmK/lkIjms5XnmoTlt6XkvZznqbrpl7TvvIHor7fph43mlrDmjIflrppgLCAnd2FybicgKVxuICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5jb25maWcgPSBuZXcgQ29uZmlnKCBwYXRoIClcblxuICAgICAgICBuZXh0KClcbiAgICB9XG5cbiAgICBjb25maWdQb3J0KCBuZXh0ICkge1xuICAgICAgICBJbnF1aXJlclxuICAgICAgICAgICAgLnByb21wdCggWyB7XG4gICAgICAgICAgICAgICAgdHlwZTogJ2xpc3QnLFxuICAgICAgICAgICAgICAgIG5hbWU6ICdwb3J0T3B0aW9uJyxcbiAgICAgICAgICAgICAgICBtZXNzYWdlOiAn6YCJ5oup56uv5Y+j5Y+3JyxcbiAgICAgICAgICAgICAgICBjaG9pY2VzOiBbIE5PUk1BTCwgUkFORE9NIF0sXG4gICAgICAgICAgICAgICAgZGVmYXVsdDogUkFORE9NXG4gICAgICAgICAgICB9IF0sIGFuc3dlciA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5jb25maWcuc2V0UG9ydE9wdGlvbiggYW5zd2VyLnBvcnRPcHRpb24gKVxuICAgICAgICAgICAgICAgIG5leHQoKVxuICAgICAgICAgICAgfSApXG4gICAgfVxuXG4gICAgY29uZmlnRG9tYWluKCBuZXh0ICkge1xuICAgICAgICBsZXQgYyAgICAgICAgICAgID0gdGhpcy5jb25maWcsXG4gICAgICAgICAgICBzYXZlZERvbWFpbnMgPSBjLmdldFNhdmVkRG9tYWlucygpLFxuICAgICAgICAgICAgZG9tYWluc1NpemUgID0gc2F2ZWREb21haW5zLmxlbmd0aFxuXG4gICAgICAgIGlmICggZG9tYWluc1NpemUgKSB7XG4gICAgICAgICAgICBJbnF1aXJlclxuICAgICAgICAgICAgICAgIC5wcm9tcHQoIFsge1xuICAgICAgICAgICAgICAgICAgICB0eXBlOiAnbGlzdCcsXG4gICAgICAgICAgICAgICAgICAgIG5hbWU6ICdvdmVycmlkZScsXG4gICAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6ICfmmK/lkKbph43mlrDorr7nva7ln5/lkI0/JyxcbiAgICAgICAgICAgICAgICAgICAgY2hvaWNlczogWyBZRVMsIE5PIF0sXG4gICAgICAgICAgICAgICAgICAgIGRlZmF1bHQ6IE5PXG4gICAgICAgICAgICAgICAgfSBdLCBhbnN3ZXIgPT4ge1xuICAgICAgICAgICAgICAgICAgICBpZiAoIGFuc3dlci5vdmVycmlkZSA9PSBZRVMgKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjLmNsZWFyRG9tYWlucygpXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5jb25maWdEb21haW4oIG5leHQgKVxuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgbmV4dCgpXG4gICAgICAgICAgICAgICAgfSApXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmNvbGxlY3REb21haW4oIG5leHQgKVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgY29sbGVjdERvbWFpbiggbmV4dCApIHtcbiAgICAgICAgSW5xdWlyZXJcbiAgICAgICAgICAgIC5wcm9tcHQoIFsge1xuICAgICAgICAgICAgICAgIG5hbWU6ICdkb21haW4nLFxuICAgICAgICAgICAgICAgIG1lc3NhZ2U6ICforr7nva7ln5/lkI0o6L6T5YWlIG4g5Y+v6Lez6L+H5q2k5q2l6aqkKScsXG4gICAgICAgICAgICAgICAgdmFsaWRhdGUoIGRvbWFpbiApIHtcbiAgICAgICAgICAgICAgICAgICAgZG9tYWluID0gZG9tYWluLnRyaW0oKVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZG9tYWluLnNwbGl0KCAnICcgKS5sZW5ndGggPT0gMiB8fCBkb21haW4gPT0gTlxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gXSwgYW5zd2VyID0+IHtcbiAgICAgICAgICAgICAgICBsZXQgYyAgICAgICAgICAgPSB0aGlzLmNvbmZpZyxcbiAgICAgICAgICAgICAgICAgICAgZG9tYWluICAgICAgPSBhbnN3ZXIuZG9tYWluLnRyaW0oKSxcbiAgICAgICAgICAgICAgICAgICAgZG9tYWluQXJyICAgPSBkb21haW4uc3BsaXQoICcgJyApLFxuICAgICAgICAgICAgICAgICAgICBkb21haW5zU2l6ZSA9IGMuZ2V0RG9tYWluc1NpemUoKVxuXG4gICAgICAgICAgICAgICAgaWYgKCBkb21haW4gPT0gTiApIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCBkb21haW5zU2l6ZSApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG5leHQoKVxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgbG9nKCAn6Iez5bCR6ZyA6KaB6YWN572u5LiA5Liq5Z+f5ZCNJywgJ3dhcm4nIClcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY29sbGVjdERvbWFpbiggbmV4dCApXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBjLmFkZERvbWFpbiggZG9tYWluQXJyIClcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuY29sbGVjdERvbWFpbiggbmV4dCApXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSApXG4gICAgfVxuXG4gICAgYXN5bmMgY29uZmlnQWRkcmVzcyggbmV4dCApIHtcbiAgICAgICAgbG9nKCAn6K6+572uIElQJyApXG4gICAgICAgIGxldCBjICAgICAgICA9IHRoaXMuY29uZmlnLFxuICAgICAgICAgICAgaXNDaGFuZ2UgPSBhd2FpdCBjLmlzSVBDaGFuZ2UoKVxuXG4gICAgICAgIGlmICggaXNDaGFuZ2UgKSB7XG4gICAgICAgICAgICBsb2coICdJUCDpnIDopoHmm7TmlrAuLi4nIClcbiAgICAgICAgICAgIEluZGljYXRvci5zdGFydCggJ+abtOaWsCBJUCDlnLDlnYAnIClcblxuICAgICAgICAgICAgbGV0IGlzT0sgID0gYXdhaXQgYy51cGRhdGVJUCgpLFxuICAgICAgICAgICAgICAgIHN0YXRlID0gaXNPSyA/ICdzdWNjZXNzJyA6ICdlcnJvcicsXG4gICAgICAgICAgICAgICAgdGV4dCAgPSBpc09LID8gJ+aIkOWKnycgOiAn5aSx6LSlJ1xuXG4gICAgICAgICAgICBsb2coIGBcXG7mm7TmlrAgSVAg5Zyw5Z2AJHt0ZXh0fWAsIHN0YXRlIClcbiAgICAgICAgICAgIEluZGljYXRvci5zdG9wKClcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGxvZyggJ0lQIOWcsOWdgOaXoOWPmOWMlu+8jOS4jemcgOimgeabtOaWsCcgKVxuICAgICAgICB9XG5cbiAgICAgICAgbmV4dCgpXG4gICAgfVxuXG4gICAgYXN5bmMgY29uZmlnUHJveHkoIG5leHQgKSB7XG4gICAgICAgIEluZGljYXRvci5zdGFydCggJ+abtOaWsOS7o+eQhuacjeWKoeWZqCcgKVxuXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBhd2FpdCB0aGlzLmNvbmZpZy51cGRhdGVQcm94eSgpXG4gICAgICAgIH0gY2F0Y2goIGUgKSB7XG4gICAgICAgICAgICBsb2coICfmnI3liqHlmajmjILkuoYs5ZaK6ZKx5LqRIScsICdlcnJvcicgKVxuICAgICAgICAgICAgSW5kaWNhdG9yLnN0b3AoKVxuICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgIH1cblxuICAgICAgICBJbmRpY2F0b3Iuc3RvcCgpXG4gICAgICAgIGxvZyggJ+abtOaWsOS7o+eQhuacjeWKoeWZqOaIkOWKnycsICdzdWNjZXNzJyApXG4gICAgICAgIG5leHQoKVxuICAgIH1cblxuICAgIGFzeW5jIGZpbmlzaCgpIHtcbiAgICAgICAgbGV0IHdvcmtzcGFjZSA9IG5ldyBXb3JrU3BhY2UoIHRoaXMuY29uZmlnLmdldFBhdGgoKSApLFxuICAgICAgICAgICAgZG9tYWluICAgID0gdGhpcy5jb25maWcuZ2V0U2F2ZWREb21haW5zKClbIDAgXS5rZXlcblxuICAgICAgICB3b3Jrc3BhY2UuYWN0aXZlKClcbiAgICAgICAgYXdhaXQgd29ya3NwYWNlLnN0YXJ0KClcblxuICAgICAgICBTbG9nYW4ueWVsbCgpXG4gICAgICAgIGxvZyggJz09PT09PT09PT09PT09PT09PT09JyApXG4gICAgICAgIGxvZyggJ3dob3JuYmlsbCDnjq/looPphY3nva7lrozmr5UnIClcbiAgICAgICAgbG9nKCAnQ2FnZSDnmoTor6bnu4bkvb/nlKjor7fmn6XnnIvmlofmoaPvvJpcXG5odHRwczovL2dpdGh1Yi5jb20vbWxzLWZlL2NhZ2UnIClcbiAgICAgICAgc2V0VGltZW91dCggKCkgPT4ge1xuICAgICAgICAgICAgT3BlbiggYGh0dHA6Ly8ke2RvbWFpbn0uZmVkZXZvdC5tZWlsaXNodW8uY29tYCApXG4gICAgICAgIH0sIDEwMDAgKVxuICAgIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBDb25maWdDTElcbiJdfQ==