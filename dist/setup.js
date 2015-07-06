'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var Configstore = require('configstore'),
    Inquirer = require('inquirer'),
    Promise = require('bluebird'),
    Path = require('path'),
    Rimraf = require('rimraf'),
    SVN = require('svn-interface'),
    Exec = require('child_process').exec,
    Util = require('./util'),
    FS = Promise.promisifyAll(require('fs')),
    Config = require('./config'),
    Key = require('./key');

var USERNAME = Key.username,
    PASSWORD = Key.password,
    WORKSPACE_LIST = Key.workspace_list,
    DIR_APPS = '/apps',
    DIR_NEST = '/nest',
    DIR_TMP = '/tmp',
    DIR_NODEMODULES = '/node_modules',
    DIR_THIRD_PARTY = 'third_party_files';

var notNull = function notNull(content) {
    return !!content || '内容不能为空！';
},
    conf = new Configstore(Key.profile),
    phases = [{
    name: 'Nest',
    url: 'http://svn.meilishuo.com/repos/meilishuo/fex/hornbill_nest/trunk/',
    dir: DIR_NEST
}, {
    name: 'Apps',
    url: 'http://svn.meilishuo.com/repos/meilishuo/fex/user/trunk/',
    dir: DIR_APPS
}];

var Setup = (function () {
    function Setup() {
        _classCallCheck(this, Setup);

        this.init();
    }

    _createClass(Setup, [{
        key: 'init',
        value: function init() {
            var _this = this;

            Inquirer.prompt([{
                name: 'dir',
                message: '设置目录',
                'default': 'master'
            }], function (answer) {
                var dirPath = _this._dirPath = Path.resolve(answer.dir),
                    workSpaceList = conf.get(WORKSPACE_LIST) || {};
                //@TODO don't save workspace_list here.
                log('目录地址:' + dirPath, 'debug');
                workSpaceList[dirPath] = 1;
                conf.set(WORKSPACE_LIST, workSpaceList);

                FS.exists(dirPath, function (isExist) {
                    if (isExist) {
                        _this.cleanup(dirPath);
                    } else {
                        FS.mkdirAsync(dirPath).then(function () {
                            return _this.checkout(dirPath);
                        });
                    }
                });
            });
        }
    }, {
        key: 'checkout',
        value: function checkout() {
            var _this2 = this;

            Inquirer.prompt([{
                name: USERNAME,
                message: 'SVN 用户名',
                'default': conf.get(USERNAME) || '',
                validate: notNull
            }, {
                type: PASSWORD,
                name: PASSWORD,
                message: 'SVN 密码',
                validate: notNull
            }], function (answer) {
                var username = answer[USERNAME],
                    password = answer[PASSWORD];

                conf.set(USERNAME, username);
                _this2.nextPhase(username, password, function () {
                    FS.mkdirAsync(_this2._dirPath + DIR_NEST + DIR_TMP).then(function () {
                        return _this2.unzipLib();
                    }).then(function () {
                        return new Config(_this2._dirPath);
                    });
                });
            });
        }
    }, {
        key: 'nextPhase',
        value: function nextPhase(username, password, callback) {
            var _this3 = this;

            var phaseObj = phases.shift(),
                name = phaseObj.name,
                path = this._dirPath + phaseObj.dir;

            log('初始化 ' + name + ' 文件夹');
            Util.indicator.start();

            FS.mkdirAsync(path).then(function (err) {
                !err && SVN.co(phaseObj.url, path, {
                    username: username, password: password
                }, function () {
                    Util.indicator.stop();
                    log(name + ' 设置成功!');
                    if (phases.length) {
                        _this3.nextPhase(username, password, callback);
                    } else {
                        callback.call(null);
                    }
                });
            });
        }
    }, {
        key: 'unzipLib',

        //@TODO need test
        value: function unzipLib() {
            var nodeModulePath = this._dirPath + DIR_NEST + DIR_NODEMODULES;
            return FS.mkdirAsync(nodeModulePath).then(function () {
                return new Promise(function (resolve) {
                    Exec('cp ./' + DIR_THIRD_PARTY + '/* ' + nodeModulePath + ' &\n                        cd ' + nodeModulePath + ' &\n                        tar zxvf less.tar.gz &\n                        tar zxvf uglify.tar.gz', function () {
                        return resolve();
                    });
                });
            });
        }
    }, {
        key: 'cleanup',
        value: function cleanup(dirPath) {
            var _this4 = this;

            Inquirer.prompt([{
                type: 'confirm',
                name: 'override',
                message: '文件夹已存在，是否覆盖',
                'default': false
            }], function (answer) {
                if (answer.override) {
                    Rimraf(dirPath, function (err) {
                        !err && FS.mkdirAsync(dirPath).then(function () {
                            return _this4.checkout();
                        });
                    });
                } else {
                    new Config(_this4._dirPath);
                }
            });
        }
    }]);

    return Setup;
})();

module.exports = Setup;
//# sourceMappingURL=data:application/json;base64,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LDJCQUFTLEtBQUs7YUFDakIsQ0FBRSxFQUFFLFVBQUEsTUFBTSxFQUFJO0FBQ1gsb0JBQUssTUFBTSxDQUFDLFFBQVEsRUFBRztBQUNuQiwwQkFBTSxDQUFFLE9BQU8sRUFBRSxVQUFBLEdBQUcsRUFBSTtBQUNwQix5QkFBQyxHQUFHLElBQUksRUFBRSxDQUFDLFVBQVUsQ0FBRSxPQUFPLENBQUUsQ0FDM0IsSUFBSSxDQUFFO21DQUFNLE9BQUssUUFBUSxFQUFFO3lCQUFBLENBQUUsQ0FBQTtxQkFDckMsQ0FBRSxDQUFBO2lCQUNOLE1BQU07QUFDSCx3QkFBSSxNQUFNLENBQUUsT0FBSyxRQUFRLENBQUUsQ0FBQTtpQkFDOUI7YUFDSixDQUFFLENBQUE7U0FDTjs7O1dBN0dDLEtBQUs7OztBQWdIWCxNQUFNLENBQUMsT0FBTyxHQUFHLEtBQUssQ0FBQSIsImZpbGUiOiJzZXR1cC5qcyIsInNvdXJjZXNDb250ZW50IjpbImxldCBDb25maWdzdG9yZSA9IHJlcXVpcmUoICdjb25maWdzdG9yZScgKSxcbiAgICBJbnF1aXJlciAgICA9IHJlcXVpcmUoICdpbnF1aXJlcicgKSxcbiAgICBQcm9taXNlICAgICA9IHJlcXVpcmUoICdibHVlYmlyZCcgKSxcbiAgICBQYXRoICAgICAgICA9IHJlcXVpcmUoICdwYXRoJyApLFxuICAgIFJpbXJhZiAgICAgID0gcmVxdWlyZSggJ3JpbXJhZicgKSxcbiAgICBTVk4gICAgICAgICA9IHJlcXVpcmUoICdzdm4taW50ZXJmYWNlJyApLFxuICAgIEV4ZWMgICAgICAgID0gcmVxdWlyZSggJ2NoaWxkX3Byb2Nlc3MnICkuZXhlYyxcbiAgICBVdGlsICAgICAgICA9IHJlcXVpcmUoICcuL3V0aWwnICksXG4gICAgRlMgICAgICAgICAgPSBQcm9taXNlLnByb21pc2lmeUFsbCggcmVxdWlyZSggJ2ZzJyApICksXG4gICAgQ29uZmlnICAgICAgPSByZXF1aXJlKCAnLi9jb25maWcnICksXG4gICAgS2V5ICAgICAgICAgPSByZXF1aXJlKCAnLi9rZXknIClcblxuY29uc3QgVVNFUk5BTUUgICAgICAgID0gS2V5LnVzZXJuYW1lLFxuICAgICAgUEFTU1dPUkQgICAgICAgID0gS2V5LnBhc3N3b3JkLFxuICAgICAgV09SS1NQQUNFX0xJU1QgID0gS2V5LndvcmtzcGFjZV9saXN0LFxuICAgICAgRElSX0FQUFMgICAgICAgID0gJy9hcHBzJyxcbiAgICAgIERJUl9ORVNUICAgICAgICA9ICcvbmVzdCcsXG4gICAgICBESVJfVE1QICAgICAgICAgPSAnL3RtcCcsXG4gICAgICBESVJfTk9ERU1PRFVMRVMgPSAnL25vZGVfbW9kdWxlcycsXG4gICAgICBESVJfVEhJUkRfUEFSVFkgPSAndGhpcmRfcGFydHlfZmlsZXMnXG5cbmxldCBub3ROdWxsID0gY29udGVudCA9PiAhIWNvbnRlbnQgfHwgJ+WGheWuueS4jeiDveS4uuepuu+8gScsXG4gICAgY29uZiAgICA9IG5ldyBDb25maWdzdG9yZSggS2V5LnByb2ZpbGUgKSxcbiAgICBwaGFzZXMgID0gWyB7XG4gICAgICAgIG5hbWU6ICdOZXN0JyxcbiAgICAgICAgdXJsOiAnaHR0cDovL3N2bi5tZWlsaXNodW8uY29tL3JlcG9zL21laWxpc2h1by9mZXgvaG9ybmJpbGxfbmVzdC90cnVuay8nLFxuICAgICAgICBkaXI6IERJUl9ORVNUXG4gICAgfSwge1xuICAgICAgICBuYW1lOiAnQXBwcycsXG4gICAgICAgIHVybDogJ2h0dHA6Ly9zdm4ubWVpbGlzaHVvLmNvbS9yZXBvcy9tZWlsaXNodW8vZmV4L3VzZXIvdHJ1bmsvJyxcbiAgICAgICAgZGlyOiBESVJfQVBQU1xuICAgIH0gXVxuXG5jbGFzcyBTZXR1cCB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHRoaXMuaW5pdCgpXG4gICAgfVxuXG4gICAgaW5pdCgpIHtcbiAgICAgICAgSW5xdWlyZXIucHJvbXB0KCBbIHtcbiAgICAgICAgICAgIG5hbWU6ICdkaXInLFxuICAgICAgICAgICAgbWVzc2FnZTogJ+iuvue9ruebruW9lScsXG4gICAgICAgICAgICBkZWZhdWx0OiAnbWFzdGVyJ1xuICAgICAgICB9IF0sIGFuc3dlciA9PiB7XG4gICAgICAgICAgICBsZXQgZGlyUGF0aCA9IHRoaXMuX2RpclBhdGggPSBQYXRoLnJlc29sdmUoIGFuc3dlci5kaXIgKSxcbiAgICAgICAgICAgICAgICB3b3JrU3BhY2VMaXN0ICAgICAgICA9IGNvbmYuZ2V0KCBXT1JLU1BBQ0VfTElTVCApIHx8IHt9XG4gICAgICAgICAgICAvL0BUT0RPIGRvbid0IHNhdmUgd29ya3NwYWNlX2xpc3QgaGVyZS5cbiAgICAgICAgICAgIGxvZyggYOebruW9leWcsOWdgDoke2RpclBhdGh9YCwgJ2RlYnVnJyApXG4gICAgICAgICAgICB3b3JrU3BhY2VMaXN0WyBkaXJQYXRoIF0gPSAxXG4gICAgICAgICAgICBjb25mLnNldCggV09SS1NQQUNFX0xJU1QsIHdvcmtTcGFjZUxpc3QgKVxuXG4gICAgICAgICAgICBGUy5leGlzdHMoIGRpclBhdGgsIGlzRXhpc3QgPT4ge1xuICAgICAgICAgICAgICAgIGlmICggaXNFeGlzdCApIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jbGVhbnVwKCBkaXJQYXRoIClcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBGUy5ta2RpckFzeW5jKCBkaXJQYXRoIClcbiAgICAgICAgICAgICAgICAgICAgICAgIC50aGVuKCAoKSA9PiB0aGlzLmNoZWNrb3V0KCBkaXJQYXRoICkgKVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gKVxuICAgICAgICB9IClcbiAgICB9XG5cbiAgICBjaGVja291dCgpIHtcbiAgICAgICAgSW5xdWlyZXIucHJvbXB0KCBbIHtcbiAgICAgICAgICAgIG5hbWU6IFVTRVJOQU1FLFxuICAgICAgICAgICAgbWVzc2FnZTogJ1NWTiDnlKjmiLflkI0nLFxuICAgICAgICAgICAgZGVmYXVsdDogY29uZi5nZXQoIFVTRVJOQU1FICkgfHwgJycsXG4gICAgICAgICAgICB2YWxpZGF0ZTogbm90TnVsbFxuICAgICAgICB9LCB7XG4gICAgICAgICAgICB0eXBlOiBQQVNTV09SRCxcbiAgICAgICAgICAgIG5hbWU6IFBBU1NXT1JELFxuICAgICAgICAgICAgbWVzc2FnZTogJ1NWTiDlr4bnoIEnLFxuICAgICAgICAgICAgdmFsaWRhdGU6IG5vdE51bGxcbiAgICAgICAgfSBdLCBhbnN3ZXIgPT4ge1xuICAgICAgICAgICAgbGV0IHVzZXJuYW1lID0gYW5zd2VyWyBVU0VSTkFNRSBdLFxuICAgICAgICAgICAgICAgIHBhc3N3b3JkID0gYW5zd2VyWyBQQVNTV09SRCBdXG5cbiAgICAgICAgICAgIGNvbmYuc2V0KCBVU0VSTkFNRSwgdXNlcm5hbWUgKVxuICAgICAgICAgICAgdGhpcy5uZXh0UGhhc2UoIHVzZXJuYW1lLCBwYXNzd29yZCwgKCkgPT4ge1xuICAgICAgICAgICAgICAgIEZTLm1rZGlyQXN5bmMoIHRoaXMuX2RpclBhdGggKyBESVJfTkVTVCArIERJUl9UTVAgKVxuICAgICAgICAgICAgICAgICAgICAudGhlbiggKCkgPT4gdGhpcy51bnppcExpYigpIClcbiAgICAgICAgICAgICAgICAgICAgLnRoZW4oICgpID0+IG5ldyBDb25maWcoIHRoaXMuX2RpclBhdGggKSApXG4gICAgICAgICAgICB9IClcbiAgICAgICAgfSApXG4gICAgfVxuXG4gICAgbmV4dFBoYXNlKCB1c2VybmFtZSwgcGFzc3dvcmQsIGNhbGxiYWNrICkge1xuICAgICAgICBsZXQgcGhhc2VPYmogPSBwaGFzZXMuc2hpZnQoKSxcbiAgICAgICAgICAgIG5hbWUgICAgID0gcGhhc2VPYmoubmFtZSxcbiAgICAgICAgICAgIHBhdGggICAgID0gdGhpcy5fZGlyUGF0aCArIHBoYXNlT2JqLmRpclxuXG4gICAgICAgIGxvZyggYOWIneWni+WMliAke25hbWV9IOaWh+S7tuWkuWAgKVxuICAgICAgICBVdGlsLmluZGljYXRvci5zdGFydCgpXG5cbiAgICAgICAgRlMubWtkaXJBc3luYyggcGF0aCApXG4gICAgICAgICAgICAudGhlbiggZXJyID0+IHtcbiAgICAgICAgICAgICAgICAhZXJyICYmIFNWTi5jbyggcGhhc2VPYmoudXJsLCBwYXRoLCB7XG4gICAgICAgICAgICAgICAgICAgIHVzZXJuYW1lLCBwYXNzd29yZFxuICAgICAgICAgICAgICAgIH0sICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgVXRpbC5pbmRpY2F0b3Iuc3RvcCgpXG4gICAgICAgICAgICAgICAgICAgIGxvZyggYCR7bmFtZX0g6K6+572u5oiQ5YqfIWAgKVxuICAgICAgICAgICAgICAgICAgICBpZiAoIHBoYXNlcy5sZW5ndGggKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm5leHRQaGFzZSggdXNlcm5hbWUsIHBhc3N3b3JkLCBjYWxsYmFjayApXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjYWxsYmFjay5jYWxsKCBudWxsIClcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gKVxuICAgICAgICAgICAgfSApXG4gICAgfVxuXG4gICAgLy9AVE9ETyBuZWVkIHRlc3RcbiAgICB1bnppcExpYigpIHtcbiAgICAgICAgbGV0IG5vZGVNb2R1bGVQYXRoID0gdGhpcy5fZGlyUGF0aCArIERJUl9ORVNUICsgRElSX05PREVNT0RVTEVTXG4gICAgICAgIHJldHVybiBGUy5ta2RpckFzeW5jKCBub2RlTW9kdWxlUGF0aCApXG4gICAgICAgICAgICAudGhlbiggKCkgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSggcmVzb2x2ZSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIEV4ZWMoXG4gICAgICAgICAgICAgICAgICAgICAgICBgY3AgLi8ke0RJUl9USElSRF9QQVJUWX0vKiAke25vZGVNb2R1bGVQYXRofSAmXG4gICAgICAgICAgICAgICAgICAgICAgICBjZCAke25vZGVNb2R1bGVQYXRofSAmXG4gICAgICAgICAgICAgICAgICAgICAgICB0YXIgenh2ZiBsZXNzLnRhci5neiAmXG4gICAgICAgICAgICAgICAgICAgICAgICB0YXIgenh2ZiB1Z2xpZnkudGFyLmd6YCxcbiAgICAgICAgICAgICAgICAgICAgICAgICgpID0+IHJlc29sdmUoKSApXG4gICAgICAgICAgICAgICAgfSApXG4gICAgICAgICAgICB9IClcbiAgICB9XG5cbiAgICBjbGVhbnVwKCBkaXJQYXRoICkge1xuICAgICAgICBJbnF1aXJlci5wcm9tcHQoIFsge1xuICAgICAgICAgICAgdHlwZTogJ2NvbmZpcm0nLFxuICAgICAgICAgICAgbmFtZTogJ292ZXJyaWRlJyxcbiAgICAgICAgICAgIG1lc3NhZ2U6ICfmlofku7blpLnlt7LlrZjlnKjvvIzmmK/lkKbopobnm5YnLFxuICAgICAgICAgICAgZGVmYXVsdDogZmFsc2VcbiAgICAgICAgfSBdLCBhbnN3ZXIgPT4ge1xuICAgICAgICAgICAgaWYgKCBhbnN3ZXIub3ZlcnJpZGUgKSB7XG4gICAgICAgICAgICAgICAgUmltcmFmKCBkaXJQYXRoLCBlcnIgPT4ge1xuICAgICAgICAgICAgICAgICAgICAhZXJyICYmIEZTLm1rZGlyQXN5bmMoIGRpclBhdGggKVxuICAgICAgICAgICAgICAgICAgICAgICAgLnRoZW4oICgpID0+IHRoaXMuY2hlY2tvdXQoKSApXG4gICAgICAgICAgICAgICAgfSApXG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIG5ldyBDb25maWcoIHRoaXMuX2RpclBhdGggKVxuICAgICAgICAgICAgfVxuICAgICAgICB9IClcbiAgICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gU2V0dXBcbiJdfQ==