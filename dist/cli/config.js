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
                    type: 'confirm',
                    name: 'override',
                    message: '是否重新设置域名?',
                    'default': false
                }], function (answer) {
                    if (answer.override) {
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
                domain = this.config.getSavedDomains()[0];

            workspace.active();
            yield workspace.start();

            Slogan.yell();
            log('====================');
            log('whornbill 环境配置完毕');
            log('Cage 的详细使用请查看文档：\nhttp://gitlab.fexot.meiliworks.com/zhidongsun/cage/tree/master');
            Open('http://' + domain + '.fedevot.meilishuo.com');
        })
    }]);

    return ConfigCLI;
})();

module.exports = ConfigCLI;
//# sourceMappingURL=data:application/json;base64,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RTtnQkFDbEQsTUFBTSxHQUFNLElBQUksQ0FBQyxNQUFNLENBQUMsZUFBZSxFQUFFLENBQUUsQ0FBQyxDQUFFLENBQUE7O0FBRWxELHFCQUFTLENBQUMsTUFBTSxFQUFFLENBQUE7QUFDbEIsa0JBQU0sU0FBUyxDQUFDLEtBQUssRUFBRSxDQUFBOztBQUV2QixrQkFBTSxDQUFDLElBQUksRUFBRSxDQUFBO0FBQ2IsZUFBRyxDQUFFLHNCQUFzQixDQUFFLENBQUE7QUFDN0IsZUFBRyxDQUFFLGtCQUFrQixDQUFFLENBQUE7QUFDekIsZUFBRyxDQUFFLGtGQUFrRixDQUFFLENBQUE7QUFDekYsZ0JBQUksYUFBWSxNQUFNLDRCQUEwQixDQUFBO1NBQ25EOzs7V0F0SUMsU0FBUzs7O0FBeUlmLE1BQU0sQ0FBQyxPQUFPLEdBQUcsU0FBUyxDQUFBIiwiZmlsZSI6ImNsaS9jb25maWcuanMiLCJzb3VyY2VzQ29udGVudCI6WyJsZXQgSW5xdWlyZXIgICAgICA9IHJlcXVpcmUoICdpbnF1aXJlcicgKSxcbiAgICBQYXRoICAgICAgICAgID0gcmVxdWlyZSggJ3BhdGgnICksXG4gICAgT3BlbiAgICAgICAgICA9IHJlcXVpcmUoICdvcGVuJyApLFxuICAgIENvbmZpZyAgICAgICAgPSByZXF1aXJlKCAnLi4vY29yZS9jb25maWcnICksXG4gICAgV29ya1NwYWNlICAgICA9IHJlcXVpcmUoICcuLi9jb3JlL3dvcmtzcGFjZScgKSxcbiAgICBTbG9nYW4gICAgICAgID0gcmVxdWlyZSggJy4uL3Nsb2dhbicgKSxcbiAgICBVdGlsICAgICAgICAgID0gcmVxdWlyZSggJy4uL3V0aWwnICksXG4gICAgS2V5ICAgICAgICAgICA9IHJlcXVpcmUoICcuLi9rZXknICksXG4gICAgQ29uc3QgICAgICAgICA9IHJlcXVpcmUoICcuLi9jb25zdCcgKSxcbiAgICBJbmRpY2F0b3IgICAgID0gVXRpbC5pbmRpY2F0b3IsXG5cbiAgICBkZWZhdWx0UGhhc2VzID0gWyAnY29uZmlnUG9ydCcsICdjb25maWdEb21haW4nLCAnY29uZmlnQWRkcmVzcycsICdjb25maWdQcm94eScsICdmaW5pc2gnIF1cblxuY29uc3QgUkFORE9NID0gS2V5LnJhbmRvbSxcbiAgICAgIE5PUk1BTCA9IEtleS5ub3JtYWwsXG4gICAgICBOICAgICAgPSAnbidcblxuY2xhc3MgQ29uZmlnQ0xJIHtcbiAgICBjb25zdHJ1Y3RvciggcGF0aCApIHtcbiAgICAgICAgdGhpcy5pbml0KCBQYXRoLnJlc29sdmUoIHBhdGggKSApXG4gICAgfVxuXG4gICAgYXN5bmMgaW5pdCggcGF0aCApIHtcbiAgICAgICAgbGV0IHBoYXNlcyA9IGRlZmF1bHRQaGFzZXMuY29uY2F0KCksXG4gICAgICAgICAgICBuZXh0ICAgPSAoKSA9PiB7XG4gICAgICAgICAgICAgICAgbGV0IHBoYXNlID0gcGhhc2VzLnNoaWZ0KClcbiAgICAgICAgICAgICAgICBpZiAoIHBoYXNlICkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzWyBwaGFzZSBdKCBuZXh0IClcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgbGV0IGlzVmFsaWQgPSBhd2FpdCBXb3JrU3BhY2UuaXNWYWxpZFdvcmtTcGFjZSggcGF0aCApXG4gICAgICAgIGlmICggIWlzVmFsaWQgKSB7XG4gICAgICAgICAgICBsb2coIGAke3BhdGh9IOS4jeaYr+WQiOazleeahOW3peS9nOepuumXtO+8geivt+mHjeaWsOaMh+WummAsICd3YXJuJyApXG4gICAgICAgICAgICByZXR1cm5cbiAgICAgICAgfVxuICAgICAgICB0aGlzLmNvbmZpZyA9IG5ldyBDb25maWcoIHBhdGggKVxuXG4gICAgICAgIG5leHQoKVxuICAgIH1cblxuICAgIGNvbmZpZ1BvcnQoIG5leHQgKSB7XG4gICAgICAgIElucXVpcmVyXG4gICAgICAgICAgICAucHJvbXB0KCBbIHtcbiAgICAgICAgICAgICAgICB0eXBlOiAnbGlzdCcsXG4gICAgICAgICAgICAgICAgbmFtZTogJ3BvcnRPcHRpb24nLFxuICAgICAgICAgICAgICAgIG1lc3NhZ2U6ICfpgInmi6nnq6/lj6Plj7cnLFxuICAgICAgICAgICAgICAgIGNob2ljZXM6IFsgTk9STUFMLCBSQU5ET00gXSxcbiAgICAgICAgICAgICAgICBkZWZhdWx0OiBSQU5ET01cbiAgICAgICAgICAgIH0gXSwgYW5zd2VyID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLmNvbmZpZy5zZXRQb3J0T3B0aW9uKCBhbnN3ZXIucG9ydE9wdGlvbiApXG4gICAgICAgICAgICAgICAgbmV4dCgpXG4gICAgICAgICAgICB9IClcbiAgICB9XG5cbiAgICBjb25maWdEb21haW4oIG5leHQgKSB7XG4gICAgICAgIGxldCBjICAgICAgICAgICAgPSB0aGlzLmNvbmZpZyxcbiAgICAgICAgICAgIHNhdmVkRG9tYWlucyA9IGMuZ2V0U2F2ZWREb21haW5zKCksXG4gICAgICAgICAgICBkb21haW5zU2l6ZSAgPSBzYXZlZERvbWFpbnMubGVuZ3RoXG5cbiAgICAgICAgaWYgKCBkb21haW5zU2l6ZSApIHtcbiAgICAgICAgICAgIElucXVpcmVyXG4gICAgICAgICAgICAgICAgLnByb21wdCggWyB7XG4gICAgICAgICAgICAgICAgICAgIHR5cGU6ICdjb25maXJtJyxcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogJ292ZXJyaWRlJyxcbiAgICAgICAgICAgICAgICAgICAgbWVzc2FnZTogJ+aYr+WQpumHjeaWsOiuvue9ruWfn+WQjT8nLFxuICAgICAgICAgICAgICAgICAgICBkZWZhdWx0OiBmYWxzZVxuICAgICAgICAgICAgICAgIH0gXSwgYW5zd2VyID0+IHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCBhbnN3ZXIub3ZlcnJpZGUgKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjLmNsZWFyRG9tYWlucygpXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5jb25maWdEb21haW4oIG5leHQgKVxuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgbmV4dCgpXG4gICAgICAgICAgICAgICAgfSApXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmNvbGxlY3REb21haW4oIG5leHQgKVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgY29sbGVjdERvbWFpbiggbmV4dCApIHtcbiAgICAgICAgSW5xdWlyZXJcbiAgICAgICAgICAgIC5wcm9tcHQoIFsge1xuICAgICAgICAgICAgICAgIG5hbWU6ICdkb21haW4nLFxuICAgICAgICAgICAgICAgIG1lc3NhZ2U6ICforr7nva7ln5/lkI0o6L6T5YWlIG4g5Y+v6Lez6L+H5q2k5q2l6aqkKScsXG4gICAgICAgICAgICAgICAgdmFsaWRhdGUoIGRvbWFpbiApIHtcbiAgICAgICAgICAgICAgICAgICAgZG9tYWluID0gZG9tYWluLnRyaW0oKVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZG9tYWluLnNwbGl0KCAnICcgKS5sZW5ndGggPT0gMiB8fCBkb21haW4gPT0gTlxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gXSwgYW5zd2VyID0+IHtcbiAgICAgICAgICAgICAgICBsZXQgYyAgICAgICAgICAgPSB0aGlzLmNvbmZpZyxcbiAgICAgICAgICAgICAgICAgICAgZG9tYWluICAgICAgPSBhbnN3ZXIuZG9tYWluLnRyaW0oKSxcbiAgICAgICAgICAgICAgICAgICAgZG9tYWluQXJyICAgPSBkb21haW4uc3BsaXQoICcgJyApLFxuICAgICAgICAgICAgICAgICAgICBkb21haW5zU2l6ZSA9IGMuZ2V0RG9tYWluc1NpemUoKVxuXG4gICAgICAgICAgICAgICAgaWYgKCBkb21haW4gPT0gTiApIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCBkb21haW5zU2l6ZSApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG5leHQoKVxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgbG9nKCAn6Iez5bCR6ZyA6KaB6YWN572u5LiA5Liq5Z+f5ZCNJywgJ3dhcm4nIClcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY29sbGVjdERvbWFpbiggbmV4dCApXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBjLmFkZERvbWFpbiggZG9tYWluQXJyIClcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuY29sbGVjdERvbWFpbiggbmV4dCApXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSApXG4gICAgfVxuXG4gICAgYXN5bmMgY29uZmlnQWRkcmVzcyggbmV4dCApIHtcbiAgICAgICAgbG9nKCAn6K6+572uIElQJyApXG4gICAgICAgIGxldCBjICAgICAgICA9IHRoaXMuY29uZmlnLFxuICAgICAgICAgICAgaXNDaGFuZ2UgPSBhd2FpdCBjLmlzSVBDaGFuZ2UoKVxuXG4gICAgICAgIGlmICggaXNDaGFuZ2UgKSB7XG4gICAgICAgICAgICBsb2coICdJUCDpnIDopoHmm7TmlrAuLi4nIClcbiAgICAgICAgICAgIEluZGljYXRvci5zdGFydCggJ+abtOaWsCBJUCDlnLDlnYAnIClcblxuICAgICAgICAgICAgbGV0IGlzT0sgID0gYXdhaXQgYy51cGRhdGVJUCgpLFxuICAgICAgICAgICAgICAgIHN0YXRlID0gaXNPSyA/ICdzdWNjZXNzJyA6ICdlcnJvcicsXG4gICAgICAgICAgICAgICAgdGV4dCAgPSBpc09LID8gJ+aIkOWKnycgOiAn5aSx6LSlJ1xuXG4gICAgICAgICAgICBsb2coIGBcXG7mm7TmlrAgSVAg5Zyw5Z2AJHt0ZXh0fWAsIHN0YXRlIClcbiAgICAgICAgICAgIEluZGljYXRvci5zdG9wKClcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGxvZyggJ0lQIOWcsOWdgOaXoOWPmOWMlu+8jOS4jemcgOimgeabtOaWsCcgKVxuICAgICAgICB9XG5cbiAgICAgICAgbmV4dCgpXG4gICAgfVxuXG4gICAgYXN5bmMgY29uZmlnUHJveHkoIG5leHQgKSB7XG4gICAgICAgIEluZGljYXRvci5zdGFydCggJ+abtOaWsOS7o+eQhuacjeWKoeWZqCcgKVxuICAgICAgICBhd2FpdCB0aGlzLmNvbmZpZy51cGRhdGVQcm94eSgpXG4gICAgICAgIEluZGljYXRvci5zdG9wKClcbiAgICAgICAgbG9nKCAn5pu05paw5Luj55CG5pyN5Yqh5Zmo5oiQ5YqfJywgJ3N1Y2Nlc3MnIClcbiAgICAgICAgbmV4dCgpXG4gICAgfVxuXG4gICAgYXN5bmMgZmluaXNoKCkge1xuICAgICAgICBsZXQgd29ya3NwYWNlID0gbmV3IFdvcmtTcGFjZSggdGhpcy5jb25maWcuZ2V0UGF0aCgpICksXG4gICAgICAgICAgICBkb21haW4gICAgPSB0aGlzLmNvbmZpZy5nZXRTYXZlZERvbWFpbnMoKVsgMCBdXG5cbiAgICAgICAgd29ya3NwYWNlLmFjdGl2ZSgpXG4gICAgICAgIGF3YWl0IHdvcmtzcGFjZS5zdGFydCgpXG5cbiAgICAgICAgU2xvZ2FuLnllbGwoKVxuICAgICAgICBsb2coICc9PT09PT09PT09PT09PT09PT09PScgKVxuICAgICAgICBsb2coICd3aG9ybmJpbGwg546v5aKD6YWN572u5a6M5q+VJyApXG4gICAgICAgIGxvZyggJ0NhZ2Ug55qE6K+m57uG5L2/55So6K+35p+l55yL5paH5qGj77yaXFxuaHR0cDovL2dpdGxhYi5mZXhvdC5tZWlsaXdvcmtzLmNvbS96aGlkb25nc3VuL2NhZ2UvdHJlZS9tYXN0ZXInIClcbiAgICAgICAgT3BlbiggYGh0dHA6Ly8ke2RvbWFpbn0uZmVkZXZvdC5tZWlsaXNodW8uY29tYCApXG4gICAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IENvbmZpZ0NMSVxuIl19