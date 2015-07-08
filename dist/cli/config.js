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
                domain = this.config.getSavedDomains()[0];

            workspace.active();
            yield workspace.start();

            Slogan.yell();
            log('====================');
            log('whornbill 环境配置完毕');
            log('Cage 的详细使用请查看文档：\nhttps://github.com/mls-fe/cage');
            Open('http://' + domain + '.fedevot.meilishuo.com');
        })
    }]);

    return ConfigCLI;
})();

module.exports = ConfigCLI;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNsaS9jb25maWcuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFBQSxJQUFJLFFBQVEsR0FBUSxPQUFPLENBQUUsVUFBVSxDQUFFO0lBQ3JDLElBQUksR0FBWSxPQUFPLENBQUUsTUFBTSxDQUFFO0lBQ2pDLElBQUksR0FBWSxPQUFPLENBQUUsTUFBTSxDQUFFO0lBQ2pDLE1BQU0sR0FBVSxPQUFPLENBQUUsZ0JBQWdCLENBQUU7SUFDM0MsU0FBUyxHQUFPLE9BQU8sQ0FBRSxtQkFBbUIsQ0FBRTtJQUM5QyxNQUFNLEdBQVUsT0FBTyxDQUFFLFdBQVcsQ0FBRTtJQUN0QyxJQUFJLEdBQVksT0FBTyxDQUFFLFNBQVMsQ0FBRTtJQUNwQyxHQUFHLEdBQWEsT0FBTyxDQUFFLFFBQVEsQ0FBRTtJQUNuQyxLQUFLLEdBQVcsT0FBTyxDQUFFLFVBQVUsQ0FBRTtJQUNyQyxTQUFTLEdBQU8sSUFBSSxDQUFDLFNBQVM7SUFFOUIsYUFBYSxHQUFHLENBQUUsWUFBWSxFQUFFLGNBQWMsRUFBRSxlQUFlLEVBQUUsYUFBYSxFQUFFLFFBQVEsQ0FBRSxDQUFBOztBQUU5RixJQUFNLE1BQU0sR0FBRyxHQUFHLENBQUMsTUFBTTtJQUNuQixNQUFNLEdBQUcsR0FBRyxDQUFDLE1BQU07SUFDbkIsR0FBRyxHQUFNLEdBQUc7SUFDWixFQUFFLEdBQU8sR0FBRztJQUNaLENBQUMsR0FBUSxHQUFHLENBQUE7O0lBRVosU0FBUztBQUNBLGFBRFQsU0FBUyxDQUNFLElBQUksRUFBRzs4QkFEbEIsU0FBUzs7QUFFUCxZQUFJLENBQUMsSUFBSSxDQUFFLElBQUksQ0FBQyxPQUFPLENBQUUsSUFBSSxDQUFFLENBQUUsQ0FBQTtLQUNwQzs7aUJBSEMsU0FBUzs7bUNBS0QsV0FBRSxJQUFJLEVBQUc7OztBQUNmLGdCQUFJLE1BQU0sR0FBRyxhQUFhLENBQUMsTUFBTSxFQUFFO2dCQUMvQixJQUFJLEdBQUssU0FBVCxJQUFJLEdBQVc7QUFDWCxvQkFBSSxLQUFLLEdBQUcsTUFBTSxDQUFDLEtBQUssRUFBRSxDQUFBO0FBQzFCLG9CQUFLLEtBQUssRUFBRztBQUNULDBCQUFNLEtBQUssQ0FBRSxDQUFFLElBQUksQ0FBRSxDQUFBO2lCQUN4QjthQUNKLENBQUE7O0FBRUwsZ0JBQUksT0FBTyxHQUFHLE1BQU0sU0FBUyxDQUFDLGdCQUFnQixDQUFFLElBQUksQ0FBRSxDQUFBO0FBQ3RELGdCQUFLLENBQUMsT0FBTyxFQUFHO0FBQ1osbUJBQUcsQ0FBSyxJQUFJLHVCQUFvQixNQUFNLENBQUUsQ0FBQTtBQUN4Qyx1QkFBTTthQUNUO0FBQ0QsZ0JBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxNQUFNLENBQUUsSUFBSSxDQUFFLENBQUE7O0FBRWhDLGdCQUFJLEVBQUUsQ0FBQTtTQUNUOzs7ZUFFUyxvQkFBRSxJQUFJLEVBQUc7OztBQUNmLG9CQUFRLENBQ0gsTUFBTSxDQUFFLENBQUU7QUFDUCxvQkFBSSxFQUFFLE1BQU07QUFDWixvQkFBSSxFQUFFLFlBQVk7QUFDbEIsdUJBQU8sRUFBRSxPQUFPO0FBQ2hCLHVCQUFPLEVBQUUsQ0FBRSxNQUFNLEVBQUUsTUFBTSxDQUFFO0FBQzNCLDJCQUFTLE1BQU07YUFDbEIsQ0FBRSxFQUFFLFVBQUEsTUFBTSxFQUFJO0FBQ1gsdUJBQUssTUFBTSxDQUFDLGFBQWEsQ0FBRSxNQUFNLENBQUMsVUFBVSxDQUFFLENBQUE7QUFDOUMsb0JBQUksRUFBRSxDQUFBO2FBQ1QsQ0FBRSxDQUFBO1NBQ1Y7OztlQUVXLHNCQUFFLElBQUksRUFBRzs7O0FBQ2pCLGdCQUFJLENBQUMsR0FBYyxJQUFJLENBQUMsTUFBTTtnQkFDMUIsWUFBWSxHQUFHLENBQUMsQ0FBQyxlQUFlLEVBQUU7Z0JBQ2xDLFdBQVcsR0FBSSxZQUFZLENBQUMsTUFBTSxDQUFBOztBQUV0QyxnQkFBSyxXQUFXLEVBQUc7QUFDZix3QkFBUSxDQUNILE1BQU0sQ0FBRSxDQUFFO0FBQ1Asd0JBQUksRUFBRSxNQUFNO0FBQ1osd0JBQUksRUFBRSxVQUFVO0FBQ2hCLDJCQUFPLEVBQUUsV0FBVztBQUNwQiwyQkFBTyxFQUFFLENBQUUsR0FBRyxFQUFFLEVBQUUsQ0FBRTtBQUNwQiwrQkFBUyxFQUFFO2lCQUNkLENBQUUsRUFBRSxVQUFBLE1BQU0sRUFBSTtBQUNYLHdCQUFLLE1BQU0sQ0FBQyxRQUFRLElBQUksR0FBRyxFQUFHO0FBQzFCLHlCQUFDLENBQUMsWUFBWSxFQUFFLENBQUE7QUFDaEIsK0JBQU8sT0FBSyxZQUFZLENBQUUsSUFBSSxDQUFFLENBQUE7cUJBQ25DOztBQUVELHdCQUFJLEVBQUUsQ0FBQTtpQkFDVCxDQUFFLENBQUE7YUFDVixNQUFNO0FBQ0gsb0JBQUksQ0FBQyxhQUFhLENBQUUsSUFBSSxDQUFFLENBQUE7YUFDN0I7U0FDSjs7O2VBRVksdUJBQUUsSUFBSSxFQUFHOzs7QUFDbEIsb0JBQVEsQ0FDSCxNQUFNLENBQUUsQ0FBRTtBQUNQLG9CQUFJLEVBQUUsUUFBUTtBQUNkLHVCQUFPLEVBQUUsbUJBQW1CO0FBQzVCLHdCQUFRLEVBQUEsa0JBQUUsTUFBTSxFQUFHO0FBQ2YsMEJBQU0sR0FBRyxNQUFNLENBQUMsSUFBSSxFQUFFLENBQUE7QUFDdEIsMkJBQU8sTUFBTSxDQUFDLEtBQUssQ0FBRSxHQUFHLENBQUUsQ0FBQyxNQUFNLElBQUksQ0FBQyxJQUFJLE1BQU0sSUFBSSxDQUFDLENBQUE7aUJBQ3hEO2FBQ0osQ0FBRSxFQUFFLFVBQUEsTUFBTSxFQUFJO0FBQ1gsb0JBQUksQ0FBQyxHQUFhLE9BQUssTUFBTTtvQkFDekIsTUFBTSxHQUFRLE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFO29CQUNsQyxTQUFTLEdBQUssTUFBTSxDQUFDLEtBQUssQ0FBRSxHQUFHLENBQUU7b0JBQ2pDLFdBQVcsR0FBRyxDQUFDLENBQUMsY0FBYyxFQUFFLENBQUE7O0FBRXBDLG9CQUFLLE1BQU0sSUFBSSxDQUFDLEVBQUc7QUFDZix3QkFBSyxXQUFXLEVBQUc7QUFDZiw0QkFBSSxFQUFFLENBQUE7cUJBQ1QsTUFBTTtBQUNILDJCQUFHLENBQUUsWUFBWSxFQUFFLE1BQU0sQ0FBRSxDQUFBO0FBQzNCLCtCQUFLLGFBQWEsQ0FBRSxJQUFJLENBQUUsQ0FBQTtxQkFDN0I7aUJBQ0osTUFBTTtBQUNILHFCQUFDLENBQUMsU0FBUyxDQUFFLFNBQVMsQ0FBRSxDQUFBO0FBQ3hCLDJCQUFPLE9BQUssYUFBYSxDQUFFLElBQUksQ0FBRSxDQUFBO2lCQUNwQzthQUNKLENBQUUsQ0FBQTtTQUNWOzs7bUNBRWtCLFdBQUUsSUFBSSxFQUFHO0FBQ3hCLGVBQUcsQ0FBRSxPQUFPLENBQUUsQ0FBQTtBQUNkLGdCQUFJLENBQUMsR0FBVSxJQUFJLENBQUMsTUFBTTtnQkFDdEIsUUFBUSxHQUFHLE1BQU0sQ0FBQyxDQUFDLFVBQVUsRUFBRSxDQUFBOztBQUVuQyxnQkFBSyxRQUFRLEVBQUc7QUFDWixtQkFBRyxDQUFFLFlBQVksQ0FBRSxDQUFBO0FBQ25CLHlCQUFTLENBQUMsS0FBSyxDQUFFLFVBQVUsQ0FBRSxDQUFBOztBQUU3QixvQkFBSSxJQUFJLEdBQUksTUFBTSxDQUFDLENBQUMsUUFBUSxFQUFFO29CQUMxQixLQUFLLEdBQUcsSUFBSSxHQUFHLFNBQVMsR0FBRyxPQUFPO29CQUNsQyxJQUFJLEdBQUksSUFBSSxHQUFHLElBQUksR0FBRyxJQUFJLENBQUE7O0FBRTlCLG1CQUFHLGdCQUFlLElBQUksRUFBSSxLQUFLLENBQUUsQ0FBQTtBQUNqQyx5QkFBUyxDQUFDLElBQUksRUFBRSxDQUFBO2FBQ25CLE1BQU07QUFDSCxtQkFBRyxDQUFFLGdCQUFnQixDQUFFLENBQUE7YUFDMUI7O0FBRUQsZ0JBQUksRUFBRSxDQUFBO1NBQ1Q7OzttQ0FFZ0IsV0FBRSxJQUFJLEVBQUc7QUFDdEIscUJBQVMsQ0FBQyxLQUFLLENBQUUsU0FBUyxDQUFFLENBQUE7QUFDNUIsa0JBQU0sSUFBSSxDQUFDLE1BQU0sQ0FBQyxXQUFXLEVBQUUsQ0FBQTtBQUMvQixxQkFBUyxDQUFDLElBQUksRUFBRSxDQUFBO0FBQ2hCLGVBQUcsQ0FBRSxXQUFXLEVBQUUsU0FBUyxDQUFFLENBQUE7QUFDN0IsZ0JBQUksRUFBRSxDQUFBO1NBQ1Q7OzttQ0FFVyxhQUFHO0FBQ1gsZ0JBQUksU0FBUyxHQUFHLElBQUksU0FBUyxDQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxFQUFFLENBQUU7Z0JBQ2xELE1BQU0sR0FBTSxJQUFJLENBQUMsTUFBTSxDQUFDLGVBQWUsRUFBRSxDQUFFLENBQUMsQ0FBRSxDQUFBOztBQUVsRCxxQkFBUyxDQUFDLE1BQU0sRUFBRSxDQUFBO0FBQ2xCLGtCQUFNLFNBQVMsQ0FBQyxLQUFLLEVBQUUsQ0FBQTs7QUFFdkIsa0JBQU0sQ0FBQyxJQUFJLEVBQUUsQ0FBQTtBQUNiLGVBQUcsQ0FBRSxzQkFBc0IsQ0FBRSxDQUFBO0FBQzdCLGVBQUcsQ0FBRSxrQkFBa0IsQ0FBRSxDQUFBO0FBQ3pCLGVBQUcsQ0FBRSxrREFBa0QsQ0FBRSxDQUFBO0FBQ3pELGdCQUFJLGFBQVksTUFBTSw0QkFBMEIsQ0FBQTtTQUNuRDs7O1dBdklDLFNBQVM7OztBQTBJZixNQUFNLENBQUMsT0FBTyxHQUFHLFNBQVMsQ0FBQSIsImZpbGUiOiJjbGkvY29uZmlnLmpzIiwic291cmNlc0NvbnRlbnQiOlsibGV0IElucXVpcmVyICAgICAgPSByZXF1aXJlKCAnaW5xdWlyZXInICksXG4gICAgUGF0aCAgICAgICAgICA9IHJlcXVpcmUoICdwYXRoJyApLFxuICAgIE9wZW4gICAgICAgICAgPSByZXF1aXJlKCAnb3BlbicgKSxcbiAgICBDb25maWcgICAgICAgID0gcmVxdWlyZSggJy4uL2NvcmUvY29uZmlnJyApLFxuICAgIFdvcmtTcGFjZSAgICAgPSByZXF1aXJlKCAnLi4vY29yZS93b3Jrc3BhY2UnICksXG4gICAgU2xvZ2FuICAgICAgICA9IHJlcXVpcmUoICcuLi9zbG9nYW4nICksXG4gICAgVXRpbCAgICAgICAgICA9IHJlcXVpcmUoICcuLi91dGlsJyApLFxuICAgIEtleSAgICAgICAgICAgPSByZXF1aXJlKCAnLi4va2V5JyApLFxuICAgIENvbnN0ICAgICAgICAgPSByZXF1aXJlKCAnLi4vY29uc3QnICksXG4gICAgSW5kaWNhdG9yICAgICA9IFV0aWwuaW5kaWNhdG9yLFxuXG4gICAgZGVmYXVsdFBoYXNlcyA9IFsgJ2NvbmZpZ1BvcnQnLCAnY29uZmlnRG9tYWluJywgJ2NvbmZpZ0FkZHJlc3MnLCAnY29uZmlnUHJveHknLCAnZmluaXNoJyBdXG5cbmNvbnN0IFJBTkRPTSA9IEtleS5yYW5kb20sXG4gICAgICBOT1JNQUwgPSBLZXkubm9ybWFsLFxuICAgICAgWUVTICAgID0gJ+aYrycsXG4gICAgICBOTyAgICAgPSAn5ZCmJyxcbiAgICAgIE4gICAgICA9ICduJ1xuXG5jbGFzcyBDb25maWdDTEkge1xuICAgIGNvbnN0cnVjdG9yKCBwYXRoICkge1xuICAgICAgICB0aGlzLmluaXQoIFBhdGgucmVzb2x2ZSggcGF0aCApIClcbiAgICB9XG5cbiAgICBhc3luYyBpbml0KCBwYXRoICkge1xuICAgICAgICBsZXQgcGhhc2VzID0gZGVmYXVsdFBoYXNlcy5jb25jYXQoKSxcbiAgICAgICAgICAgIG5leHQgICA9ICgpID0+IHtcbiAgICAgICAgICAgICAgICBsZXQgcGhhc2UgPSBwaGFzZXMuc2hpZnQoKVxuICAgICAgICAgICAgICAgIGlmICggcGhhc2UgKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXNbIHBoYXNlIF0oIG5leHQgKVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICBsZXQgaXNWYWxpZCA9IGF3YWl0IFdvcmtTcGFjZS5pc1ZhbGlkV29ya1NwYWNlKCBwYXRoIClcbiAgICAgICAgaWYgKCAhaXNWYWxpZCApIHtcbiAgICAgICAgICAgIGxvZyggYCR7cGF0aH0g5LiN5piv5ZCI5rOV55qE5bel5L2c56m66Ze077yB6K+36YeN5paw5oyH5a6aYCwgJ3dhcm4nIClcbiAgICAgICAgICAgIHJldHVyblxuICAgICAgICB9XG4gICAgICAgIHRoaXMuY29uZmlnID0gbmV3IENvbmZpZyggcGF0aCApXG5cbiAgICAgICAgbmV4dCgpXG4gICAgfVxuXG4gICAgY29uZmlnUG9ydCggbmV4dCApIHtcbiAgICAgICAgSW5xdWlyZXJcbiAgICAgICAgICAgIC5wcm9tcHQoIFsge1xuICAgICAgICAgICAgICAgIHR5cGU6ICdsaXN0JyxcbiAgICAgICAgICAgICAgICBuYW1lOiAncG9ydE9wdGlvbicsXG4gICAgICAgICAgICAgICAgbWVzc2FnZTogJ+mAieaLqeerr+WPo+WPtycsXG4gICAgICAgICAgICAgICAgY2hvaWNlczogWyBOT1JNQUwsIFJBTkRPTSBdLFxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6IFJBTkRPTVxuICAgICAgICAgICAgfSBdLCBhbnN3ZXIgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuY29uZmlnLnNldFBvcnRPcHRpb24oIGFuc3dlci5wb3J0T3B0aW9uIClcbiAgICAgICAgICAgICAgICBuZXh0KClcbiAgICAgICAgICAgIH0gKVxuICAgIH1cblxuICAgIGNvbmZpZ0RvbWFpbiggbmV4dCApIHtcbiAgICAgICAgbGV0IGMgICAgICAgICAgICA9IHRoaXMuY29uZmlnLFxuICAgICAgICAgICAgc2F2ZWREb21haW5zID0gYy5nZXRTYXZlZERvbWFpbnMoKSxcbiAgICAgICAgICAgIGRvbWFpbnNTaXplICA9IHNhdmVkRG9tYWlucy5sZW5ndGhcblxuICAgICAgICBpZiAoIGRvbWFpbnNTaXplICkge1xuICAgICAgICAgICAgSW5xdWlyZXJcbiAgICAgICAgICAgICAgICAucHJvbXB0KCBbIHtcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogJ2xpc3QnLFxuICAgICAgICAgICAgICAgICAgICBuYW1lOiAnb3ZlcnJpZGUnLFxuICAgICAgICAgICAgICAgICAgICBtZXNzYWdlOiAn5piv5ZCm6YeN5paw6K6+572u5Z+f5ZCNPycsXG4gICAgICAgICAgICAgICAgICAgIGNob2ljZXM6IFsgWUVTLCBOTyBdLFxuICAgICAgICAgICAgICAgICAgICBkZWZhdWx0OiBOT1xuICAgICAgICAgICAgICAgIH0gXSwgYW5zd2VyID0+IHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCBhbnN3ZXIub3ZlcnJpZGUgPT0gWUVTICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgYy5jbGVhckRvbWFpbnMoKVxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuY29uZmlnRG9tYWluKCBuZXh0IClcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIG5leHQoKVxuICAgICAgICAgICAgICAgIH0gKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5jb2xsZWN0RG9tYWluKCBuZXh0IClcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGNvbGxlY3REb21haW4oIG5leHQgKSB7XG4gICAgICAgIElucXVpcmVyXG4gICAgICAgICAgICAucHJvbXB0KCBbIHtcbiAgICAgICAgICAgICAgICBuYW1lOiAnZG9tYWluJyxcbiAgICAgICAgICAgICAgICBtZXNzYWdlOiAn6K6+572u5Z+f5ZCNKOi+k+WFpSBuIOWPr+i3s+i/h+atpOatpemqpCknLFxuICAgICAgICAgICAgICAgIHZhbGlkYXRlKCBkb21haW4gKSB7XG4gICAgICAgICAgICAgICAgICAgIGRvbWFpbiA9IGRvbWFpbi50cmltKClcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGRvbWFpbi5zcGxpdCggJyAnICkubGVuZ3RoID09IDIgfHwgZG9tYWluID09IE5cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IF0sIGFuc3dlciA9PiB7XG4gICAgICAgICAgICAgICAgbGV0IGMgICAgICAgICAgID0gdGhpcy5jb25maWcsXG4gICAgICAgICAgICAgICAgICAgIGRvbWFpbiAgICAgID0gYW5zd2VyLmRvbWFpbi50cmltKCksXG4gICAgICAgICAgICAgICAgICAgIGRvbWFpbkFyciAgID0gZG9tYWluLnNwbGl0KCAnICcgKSxcbiAgICAgICAgICAgICAgICAgICAgZG9tYWluc1NpemUgPSBjLmdldERvbWFpbnNTaXplKClcblxuICAgICAgICAgICAgICAgIGlmICggZG9tYWluID09IE4gKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICggZG9tYWluc1NpemUgKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBuZXh0KClcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxvZyggJ+iHs+WwkemcgOimgemFjee9ruS4gOS4quWfn+WQjScsICd3YXJuJyApXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNvbGxlY3REb21haW4oIG5leHQgKVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgYy5hZGREb21haW4oIGRvbWFpbkFyciApXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmNvbGxlY3REb21haW4oIG5leHQgKVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gKVxuICAgIH1cblxuICAgIGFzeW5jIGNvbmZpZ0FkZHJlc3MoIG5leHQgKSB7XG4gICAgICAgIGxvZyggJ+iuvue9riBJUCcgKVxuICAgICAgICBsZXQgYyAgICAgICAgPSB0aGlzLmNvbmZpZyxcbiAgICAgICAgICAgIGlzQ2hhbmdlID0gYXdhaXQgYy5pc0lQQ2hhbmdlKClcblxuICAgICAgICBpZiAoIGlzQ2hhbmdlICkge1xuICAgICAgICAgICAgbG9nKCAnSVAg6ZyA6KaB5pu05pawLi4uJyApXG4gICAgICAgICAgICBJbmRpY2F0b3Iuc3RhcnQoICfmm7TmlrAgSVAg5Zyw5Z2AJyApXG5cbiAgICAgICAgICAgIGxldCBpc09LICA9IGF3YWl0IGMudXBkYXRlSVAoKSxcbiAgICAgICAgICAgICAgICBzdGF0ZSA9IGlzT0sgPyAnc3VjY2VzcycgOiAnZXJyb3InLFxuICAgICAgICAgICAgICAgIHRleHQgID0gaXNPSyA/ICfmiJDlip8nIDogJ+Wksei0pSdcblxuICAgICAgICAgICAgbG9nKCBgXFxu5pu05pawIElQIOWcsOWdgCR7dGV4dH1gLCBzdGF0ZSApXG4gICAgICAgICAgICBJbmRpY2F0b3Iuc3RvcCgpXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBsb2coICdJUCDlnLDlnYDml6Dlj5jljJbvvIzkuI3pnIDopoHmm7TmlrAnIClcbiAgICAgICAgfVxuXG4gICAgICAgIG5leHQoKVxuICAgIH1cblxuICAgIGFzeW5jIGNvbmZpZ1Byb3h5KCBuZXh0ICkge1xuICAgICAgICBJbmRpY2F0b3Iuc3RhcnQoICfmm7TmlrDku6PnkIbmnI3liqHlmagnIClcbiAgICAgICAgYXdhaXQgdGhpcy5jb25maWcudXBkYXRlUHJveHkoKVxuICAgICAgICBJbmRpY2F0b3Iuc3RvcCgpXG4gICAgICAgIGxvZyggJ+abtOaWsOS7o+eQhuacjeWKoeWZqOaIkOWKnycsICdzdWNjZXNzJyApXG4gICAgICAgIG5leHQoKVxuICAgIH1cblxuICAgIGFzeW5jIGZpbmlzaCgpIHtcbiAgICAgICAgbGV0IHdvcmtzcGFjZSA9IG5ldyBXb3JrU3BhY2UoIHRoaXMuY29uZmlnLmdldFBhdGgoKSApLFxuICAgICAgICAgICAgZG9tYWluICAgID0gdGhpcy5jb25maWcuZ2V0U2F2ZWREb21haW5zKClbIDAgXVxuXG4gICAgICAgIHdvcmtzcGFjZS5hY3RpdmUoKVxuICAgICAgICBhd2FpdCB3b3Jrc3BhY2Uuc3RhcnQoKVxuXG4gICAgICAgIFNsb2dhbi55ZWxsKClcbiAgICAgICAgbG9nKCAnPT09PT09PT09PT09PT09PT09PT0nIClcbiAgICAgICAgbG9nKCAnd2hvcm5iaWxsIOeOr+Wig+mFjee9ruWujOavlScgKVxuICAgICAgICBsb2coICdDYWdlIOeahOivpue7huS9v+eUqOivt+afpeeci+aWh+aho++8mlxcbmh0dHBzOi8vZ2l0aHViLmNvbS9tbHMtZmUvY2FnZScgKVxuICAgICAgICBPcGVuKCBgaHR0cDovLyR7ZG9tYWlufS5mZWRldm90Lm1laWxpc2h1by5jb21gIClcbiAgICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gQ29uZmlnQ0xJXG4iXX0=