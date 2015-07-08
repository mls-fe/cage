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
            yield this.config.updateProxy();
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
//# sourceMappingURL=data:application/json;base64,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QUE7U0FDVDs7O21DQUVXLGFBQUc7QUFDWCxnQkFBSSxTQUFTLEdBQUcsSUFBSSxTQUFTLENBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLEVBQUUsQ0FBRTtnQkFDbEQsTUFBTSxHQUFNLElBQUksQ0FBQyxNQUFNLENBQUMsZUFBZSxFQUFFLENBQUUsQ0FBQyxDQUFFLENBQUMsR0FBRyxDQUFBOztBQUV0RCxxQkFBUyxDQUFDLE1BQU0sRUFBRSxDQUFBO0FBQ2xCLGtCQUFNLFNBQVMsQ0FBQyxLQUFLLEVBQUUsQ0FBQTs7QUFFdkIsa0JBQU0sQ0FBQyxJQUFJLEVBQUUsQ0FBQTtBQUNiLGVBQUcsQ0FBRSxzQkFBc0IsQ0FBRSxDQUFBO0FBQzdCLGVBQUcsQ0FBRSxrQkFBa0IsQ0FBRSxDQUFBO0FBQ3pCLGVBQUcsQ0FBRSxrREFBa0QsQ0FBRSxDQUFBO0FBQ3pELHNCQUFVLENBQUUsWUFBTTtBQUNkLG9CQUFJLGFBQVksTUFBTSw0QkFBMEIsQ0FBQTthQUNuRCxFQUFFLElBQUksQ0FBRSxDQUFBO1NBQ1o7OztXQXpJQyxTQUFTOzs7QUE0SWYsTUFBTSxDQUFDLE9BQU8sR0FBRyxTQUFTLENBQUEiLCJmaWxlIjoiY2xpL2NvbmZpZy5qcyIsInNvdXJjZXNDb250ZW50IjpbImxldCBJbnF1aXJlciAgICAgID0gcmVxdWlyZSggJ2lucXVpcmVyJyApLFxuICAgIFBhdGggICAgICAgICAgPSByZXF1aXJlKCAncGF0aCcgKSxcbiAgICBPcGVuICAgICAgICAgID0gcmVxdWlyZSggJ29wZW4nICksXG4gICAgQ29uZmlnICAgICAgICA9IHJlcXVpcmUoICcuLi9jb3JlL2NvbmZpZycgKSxcbiAgICBXb3JrU3BhY2UgICAgID0gcmVxdWlyZSggJy4uL2NvcmUvd29ya3NwYWNlJyApLFxuICAgIFNsb2dhbiAgICAgICAgPSByZXF1aXJlKCAnLi4vc2xvZ2FuJyApLFxuICAgIFV0aWwgICAgICAgICAgPSByZXF1aXJlKCAnLi4vdXRpbCcgKSxcbiAgICBLZXkgICAgICAgICAgID0gcmVxdWlyZSggJy4uL2tleScgKSxcbiAgICBDb25zdCAgICAgICAgID0gcmVxdWlyZSggJy4uL2NvbnN0JyApLFxuICAgIEluZGljYXRvciAgICAgPSBVdGlsLmluZGljYXRvcixcblxuICAgIGRlZmF1bHRQaGFzZXMgPSBbXG4gICAgICAgICdjb25maWdQb3J0JyxcbiAgICAgICAgJ2NvbmZpZ0RvbWFpbicsXG4gICAgICAgICdjb25maWdBZGRyZXNzJyxcbiAgICAgICAgJ2NvbmZpZ1Byb3h5JyxcbiAgICAgICAgJ2ZpbmlzaCdcbiAgICBdXG5cbmNvbnN0IFJBTkRPTSA9IEtleS5yYW5kb20sXG4gICAgICBOT1JNQUwgPSBLZXkubm9ybWFsLFxuICAgICAgWUVTICAgID0gJ+aYrycsXG4gICAgICBOTyAgICAgPSAn5ZCmJyxcbiAgICAgIE4gICAgICA9ICduJ1xuXG5jbGFzcyBDb25maWdDTEkge1xuICAgIGNvbnN0cnVjdG9yKCBwYXRoICkge1xuICAgICAgICB0aGlzLmluaXQoIFBhdGgucmVzb2x2ZSggcGF0aCApIClcbiAgICB9XG5cbiAgICBhc3luYyBpbml0KCBwYXRoICkge1xuICAgICAgICBsZXQgcGhhc2VzID0gZGVmYXVsdFBoYXNlcy5jb25jYXQoKSxcbiAgICAgICAgICAgIG5leHQgICA9ICgpID0+IHtcbiAgICAgICAgICAgICAgICBsZXQgcGhhc2UgPSBwaGFzZXMuc2hpZnQoKVxuICAgICAgICAgICAgICAgIGlmICggcGhhc2UgKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXNbIHBoYXNlIF0oIG5leHQgKVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICBsZXQgaXNWYWxpZCA9IGF3YWl0IFdvcmtTcGFjZS5pc1ZhbGlkV29ya1NwYWNlKCBwYXRoIClcbiAgICAgICAgaWYgKCAhaXNWYWxpZCApIHtcbiAgICAgICAgICAgIGxvZyggYCR7cGF0aH0g5LiN5piv5ZCI5rOV55qE5bel5L2c56m66Ze077yB6K+36YeN5paw5oyH5a6aYCwgJ3dhcm4nIClcbiAgICAgICAgICAgIHJldHVyblxuICAgICAgICB9XG4gICAgICAgIHRoaXMuY29uZmlnID0gbmV3IENvbmZpZyggcGF0aCApXG5cbiAgICAgICAgbmV4dCgpXG4gICAgfVxuXG4gICAgY29uZmlnUG9ydCggbmV4dCApIHtcbiAgICAgICAgSW5xdWlyZXJcbiAgICAgICAgICAgIC5wcm9tcHQoIFsge1xuICAgICAgICAgICAgICAgIHR5cGU6ICdsaXN0JyxcbiAgICAgICAgICAgICAgICBuYW1lOiAncG9ydE9wdGlvbicsXG4gICAgICAgICAgICAgICAgbWVzc2FnZTogJ+mAieaLqeerr+WPo+WPtycsXG4gICAgICAgICAgICAgICAgY2hvaWNlczogWyBOT1JNQUwsIFJBTkRPTSBdLFxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6IFJBTkRPTVxuICAgICAgICAgICAgfSBdLCBhbnN3ZXIgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuY29uZmlnLnNldFBvcnRPcHRpb24oIGFuc3dlci5wb3J0T3B0aW9uIClcbiAgICAgICAgICAgICAgICBuZXh0KClcbiAgICAgICAgICAgIH0gKVxuICAgIH1cblxuICAgIGNvbmZpZ0RvbWFpbiggbmV4dCApIHtcbiAgICAgICAgbGV0IGMgICAgICAgICAgICA9IHRoaXMuY29uZmlnLFxuICAgICAgICAgICAgc2F2ZWREb21haW5zID0gYy5nZXRTYXZlZERvbWFpbnMoKSxcbiAgICAgICAgICAgIGRvbWFpbnNTaXplICA9IHNhdmVkRG9tYWlucy5sZW5ndGhcblxuICAgICAgICBpZiAoIGRvbWFpbnNTaXplICkge1xuICAgICAgICAgICAgSW5xdWlyZXJcbiAgICAgICAgICAgICAgICAucHJvbXB0KCBbIHtcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogJ2xpc3QnLFxuICAgICAgICAgICAgICAgICAgICBuYW1lOiAnb3ZlcnJpZGUnLFxuICAgICAgICAgICAgICAgICAgICBtZXNzYWdlOiAn5piv5ZCm6YeN5paw6K6+572u5Z+f5ZCNPycsXG4gICAgICAgICAgICAgICAgICAgIGNob2ljZXM6IFsgWUVTLCBOTyBdLFxuICAgICAgICAgICAgICAgICAgICBkZWZhdWx0OiBOT1xuICAgICAgICAgICAgICAgIH0gXSwgYW5zd2VyID0+IHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCBhbnN3ZXIub3ZlcnJpZGUgPT0gWUVTICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgYy5jbGVhckRvbWFpbnMoKVxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuY29uZmlnRG9tYWluKCBuZXh0IClcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIG5leHQoKVxuICAgICAgICAgICAgICAgIH0gKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5jb2xsZWN0RG9tYWluKCBuZXh0IClcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGNvbGxlY3REb21haW4oIG5leHQgKSB7XG4gICAgICAgIElucXVpcmVyXG4gICAgICAgICAgICAucHJvbXB0KCBbIHtcbiAgICAgICAgICAgICAgICBuYW1lOiAnZG9tYWluJyxcbiAgICAgICAgICAgICAgICBtZXNzYWdlOiAn6K6+572u5Z+f5ZCNKOi+k+WFpSBuIOWPr+i3s+i/h+atpOatpemqpCknLFxuICAgICAgICAgICAgICAgIHZhbGlkYXRlKCBkb21haW4gKSB7XG4gICAgICAgICAgICAgICAgICAgIGRvbWFpbiA9IGRvbWFpbi50cmltKClcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGRvbWFpbi5zcGxpdCggJyAnICkubGVuZ3RoID09IDIgfHwgZG9tYWluID09IE5cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IF0sIGFuc3dlciA9PiB7XG4gICAgICAgICAgICAgICAgbGV0IGMgICAgICAgICAgID0gdGhpcy5jb25maWcsXG4gICAgICAgICAgICAgICAgICAgIGRvbWFpbiAgICAgID0gYW5zd2VyLmRvbWFpbi50cmltKCksXG4gICAgICAgICAgICAgICAgICAgIGRvbWFpbkFyciAgID0gZG9tYWluLnNwbGl0KCAnICcgKSxcbiAgICAgICAgICAgICAgICAgICAgZG9tYWluc1NpemUgPSBjLmdldERvbWFpbnNTaXplKClcblxuICAgICAgICAgICAgICAgIGlmICggZG9tYWluID09IE4gKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICggZG9tYWluc1NpemUgKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBuZXh0KClcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxvZyggJ+iHs+WwkemcgOimgemFjee9ruS4gOS4quWfn+WQjScsICd3YXJuJyApXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNvbGxlY3REb21haW4oIG5leHQgKVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgYy5hZGREb21haW4oIGRvbWFpbkFyciApXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmNvbGxlY3REb21haW4oIG5leHQgKVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gKVxuICAgIH1cblxuICAgIGFzeW5jIGNvbmZpZ0FkZHJlc3MoIG5leHQgKSB7XG4gICAgICAgIGxvZyggJ+iuvue9riBJUCcgKVxuICAgICAgICBsZXQgYyAgICAgICAgPSB0aGlzLmNvbmZpZyxcbiAgICAgICAgICAgIGlzQ2hhbmdlID0gYXdhaXQgYy5pc0lQQ2hhbmdlKClcblxuICAgICAgICBpZiAoIGlzQ2hhbmdlICkge1xuICAgICAgICAgICAgbG9nKCAnSVAg6ZyA6KaB5pu05pawLi4uJyApXG4gICAgICAgICAgICBJbmRpY2F0b3Iuc3RhcnQoICfmm7TmlrAgSVAg5Zyw5Z2AJyApXG5cbiAgICAgICAgICAgIGxldCBpc09LICA9IGF3YWl0IGMudXBkYXRlSVAoKSxcbiAgICAgICAgICAgICAgICBzdGF0ZSA9IGlzT0sgPyAnc3VjY2VzcycgOiAnZXJyb3InLFxuICAgICAgICAgICAgICAgIHRleHQgID0gaXNPSyA/ICfmiJDlip8nIDogJ+Wksei0pSdcblxuICAgICAgICAgICAgbG9nKCBgXFxu5pu05pawIElQIOWcsOWdgCR7dGV4dH1gLCBzdGF0ZSApXG4gICAgICAgICAgICBJbmRpY2F0b3Iuc3RvcCgpXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBsb2coICdJUCDlnLDlnYDml6Dlj5jljJbvvIzkuI3pnIDopoHmm7TmlrAnIClcbiAgICAgICAgfVxuXG4gICAgICAgIG5leHQoKVxuICAgIH1cblxuICAgIGFzeW5jIGNvbmZpZ1Byb3h5KCBuZXh0ICkge1xuICAgICAgICBJbmRpY2F0b3Iuc3RhcnQoICfmm7TmlrDku6PnkIbmnI3liqHlmagnIClcbiAgICAgICAgYXdhaXQgdGhpcy5jb25maWcudXBkYXRlUHJveHkoKVxuICAgICAgICBJbmRpY2F0b3Iuc3RvcCgpXG4gICAgICAgIGxvZyggJ+abtOaWsOS7o+eQhuacjeWKoeWZqOaIkOWKnycsICdzdWNjZXNzJyApXG4gICAgICAgIG5leHQoKVxuICAgIH1cblxuICAgIGFzeW5jIGZpbmlzaCgpIHtcbiAgICAgICAgbGV0IHdvcmtzcGFjZSA9IG5ldyBXb3JrU3BhY2UoIHRoaXMuY29uZmlnLmdldFBhdGgoKSApLFxuICAgICAgICAgICAgZG9tYWluICAgID0gdGhpcy5jb25maWcuZ2V0U2F2ZWREb21haW5zKClbIDAgXS5rZXlcblxuICAgICAgICB3b3Jrc3BhY2UuYWN0aXZlKClcbiAgICAgICAgYXdhaXQgd29ya3NwYWNlLnN0YXJ0KClcblxuICAgICAgICBTbG9nYW4ueWVsbCgpXG4gICAgICAgIGxvZyggJz09PT09PT09PT09PT09PT09PT09JyApXG4gICAgICAgIGxvZyggJ3dob3JuYmlsbCDnjq/looPphY3nva7lrozmr5UnIClcbiAgICAgICAgbG9nKCAnQ2FnZSDnmoTor6bnu4bkvb/nlKjor7fmn6XnnIvmlofmoaPvvJpcXG5odHRwczovL2dpdGh1Yi5jb20vbWxzLWZlL2NhZ2UnIClcbiAgICAgICAgc2V0VGltZW91dCggKCkgPT4ge1xuICAgICAgICAgICAgT3BlbiggYGh0dHA6Ly8ke2RvbWFpbn0uZmVkZXZvdC5tZWlsaXNodW8uY29tYCApXG4gICAgICAgIH0sIDEwMDAgKVxuICAgIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBDb25maWdDTElcbiJdfQ==