'use strict';

var _bluebird = require('bluebird');

require('babel-polyfill');
require('./log');
require('./profile');

var Commander = require('commander'),
    Exec = require('child_process').exec,
    ConfigCLI = require('./cli/config'),
    Config = require('./core/config'),
    SetupCLI = require('./cli/setup'),
    WorkSpaceCLI = require('./cli/workspace'),
    WorkSpace = require('./core/workspace'),
    Request = require('./request'),
    Util = require('./util'),
    pkg = require('../package.json'),
    logValues = { 's': 1, 'js': 1 },
    findValidWorkspace = function () {
    var ref = (0, _bluebird.coroutine)(regeneratorRuntime.mark(function _callee(dir) {
        var isValid;
        return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        _context.next = 2;
                        return WorkSpace.isValidWorkSpace(dir);

                    case 2:
                        isValid = _context.sent;

                        if (isValid) {
                            _context.next = 8;
                            break;
                        }

                        dir = WorkSpace.current();
                        _context.next = 7;
                        return WorkSpace.isValidWorkSpace(dir);

                    case 7:
                        isValid = _context.sent;

                    case 8:
                        if (!isValid) {
                            _context.next = 12;
                            break;
                        }

                        return _context.abrupt('return', { isValid: isValid, dir: dir });

                    case 12:
                        log('无法找到可运行的工作空间', 'error');
                        throw new Error();

                    case 14:
                    case 'end':
                        return _context.stop();
                }
            }
        }, _callee, undefined);
    }));
    return function findValidWorkspace(_x) {
        return ref.apply(this, arguments);
    };
}();

Commander.version(pkg.version, '-v, --version');

Commander.command('setup [dir] [url]').description('在 dir 文件夹下生成环境').action(function () {
    var dir = arguments.length <= 0 || arguments[0] === undefined ? '' : arguments[0];
    var url = arguments.length <= 1 || arguments[1] === undefined ? '' : arguments[1];
    return new SetupCLI(dir, url);
});

Commander.command('config [dir]').description('配置环境').alias('c').action(function () {
    var dir = arguments.length <= 0 || arguments[0] === undefined ? process.cwd() : arguments[0];
    return new ConfigCLI(dir);
});

Commander.command('run').description('运行服务').alias('r').action((0, _bluebird.coroutine)(regeneratorRuntime.mark(function _callee2() {
    var result;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
            switch (_context2.prev = _context2.next) {
                case 0:
                    _context2.next = 2;
                    return findValidWorkspace(process.cwd());

                case 2:
                    result = _context2.sent;

                    new WorkSpace(result.dir).start();

                case 4:
                case 'end':
                    return _context2.stop();
            }
        }
    }, _callee2, undefined);
})));

Commander.command('stop [isAll]').description('停止服务').alias('s').action(function () {
    var ref = (0, _bluebird.coroutine)(regeneratorRuntime.mark(function _callee3() {
        var isAll = arguments.length <= 0 || arguments[0] === undefined ? false : arguments[0];
        var result;
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
            while (1) {
                switch (_context3.prev = _context3.next) {
                    case 0:
                        _context3.next = 2;
                        return findValidWorkspace(process.cwd());

                    case 2:
                        result = _context3.sent;

                        new WorkSpace(result.dir).stop(isAll);

                    case 4:
                    case 'end':
                        return _context3.stop();
                }
            }
        }, _callee3, undefined);
    }));
    return function (_x5) {
        return ref.apply(this, arguments);
    };
}());

Commander.command('sa').description('停止所有服务').action((0, _bluebird.coroutine)(regeneratorRuntime.mark(function _callee4() {
    var result;
    return regeneratorRuntime.wrap(function _callee4$(_context4) {
        while (1) {
            switch (_context4.prev = _context4.next) {
                case 0:
                    _context4.next = 2;
                    return findValidWorkspace(process.cwd());

                case 2:
                    result = _context4.sent;

                    new WorkSpace(result.dir).stop('all');

                case 4:
                case 'end':
                    return _context4.stop();
            }
        }
    }, _callee4, undefined);
})));

Commander.command('log [type]').description('显示日志').alias('l').action(function () {
    var type = arguments.length <= 0 || arguments[0] === undefined ? 's' : arguments[0];

    if (type in logValues) {
        Exec('tail -f /tmp/log/nest-' + type + 'erver/' + Util.getFormatDate() + '.log').on('message', function (message) {
            return log(message);
        }).on('error', function (err) {
            return log(err, 'error');
        });
    } else {
        log('log 只接受 s/js 两个参数', 'error');
    }
});

Commander.command('lo').description('打开日志所在位置').action(function () {
    Exec('open -a finder "/tmp/log/nest-server/"').on('error', function (err) {
        return log(err, 'error');
    });
});

Commander.command('ls').description('显示工作空间列表').action(function () {
    return WorkSpaceCLI.list();
});

Commander.command('ip').description('显示本机 IP 地址').action(function () {
    log(Util.getIP());
});

Commander.command('mac').description('显示本机 Mac 地址').action((0, _bluebird.coroutine)(regeneratorRuntime.mark(function _callee5() {
    var mac;
    return regeneratorRuntime.wrap(function _callee5$(_context5) {
        while (1) {
            switch (_context5.prev = _context5.next) {
                case 0:
                    _context5.next = 2;
                    return Util.getMac();

                case 2:
                    mac = _context5.sent;

                    log(mac);

                case 4:
                case 'end':
                    return _context5.stop();
            }
        }
    }, _callee5, undefined);
})));

Commander.command('update').description('更新环境配置').alias('u').action((0, _bluebird.coroutine)(regeneratorRuntime.mark(function _callee6() {
    var config, isIPChange;
    return regeneratorRuntime.wrap(function _callee6$(_context6) {
        while (1) {
            switch (_context6.prev = _context6.next) {
                case 0:
                    config = new Config(WorkSpace.current()), isIPChange = config.isIPChange();

                    if (!isIPChange) {
                        _context6.next = 7;
                        break;
                    }

                    _context6.next = 4;
                    return config.updateIP();

                case 4:
                    log('ip 更新成功', 'success');
                    _context6.next = 8;
                    break;

                case 7:
                    log('ip 无变化, 不需要更新.');

                case 8:
                case 'end':
                    return _context6.stop();
            }
        }
    }, _callee6, undefined);
})));

Commander.command('hostlist').description('显示你配置过的域名列表').action((0, _bluebird.coroutine)(regeneratorRuntime.mark(function _callee7() {
    var mac, result, display;
    return regeneratorRuntime.wrap(function _callee7$(_context7) {
        while (1) {
            switch (_context7.prev = _context7.next) {
                case 0:
                    _context7.next = 2;
                    return Util.getMac();

                case 2:
                    mac = _context7.sent;
                    _context7.next = 5;
                    return Request('hostlist?ukey=' + mac);

                case 5:
                    result = _context7.sent;
                    display = '';


                    if (result) {
                        result.data.forEach(function (data) {
                            display += '\n' + data.host + '\n    id: ' + data.id + '\n    ip: ' + data.ip + '\n    port: ' + data.port + '\n    ukey: ' + data.ukey + '\n                ';
                        });
                        log(display);
                    }

                case 8:
                case 'end':
                    return _context7.stop();
            }
        }
    }, _callee7, undefined);
})));

Commander.parse(process.argv);
//# sourceMappingURL=data:application/json;base64,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LDJCQUNlLEtBQUssTUFBTCxFQURmOztBQUFBO0FBQ0QsdUJBREM7QUFBQTtBQUFBLDJCQUVlLFFBQVMsbUJBQW1CLEdBQTVCLENBRmY7O0FBQUE7QUFFRCwwQkFGQztBQUdELDJCQUhDLEdBR1MsRUFIVDs7O0FBS0wsd0JBQUssTUFBTCxFQUFjO0FBQ1YsK0JBQU8sSUFBUCxDQUFZLE9BQVosQ0FBcUIsZ0JBQVE7QUFDekIsOENBQ2QsS0FBSyxJQURTLGtCQUVOLEtBQUssRUFGQyxrQkFHTixLQUFLLEVBSEMsb0JBSUosS0FBSyxJQUpELG9CQUtKLEtBQUssSUFMRDtBQU9ILHlCQVJEO0FBU0EsNEJBQUssT0FBTDtBQUNIOztBQWhCSTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxDQUhiOztBQXNCQSxVQUFVLEtBQVYsQ0FBaUIsUUFBUSxJQUF6QiIsImZpbGUiOiJpbmRleC5qcyIsInNvdXJjZXNDb250ZW50IjpbInJlcXVpcmUoICdiYWJlbC1wb2x5ZmlsbCcgKVxucmVxdWlyZSggJy4vbG9nJyApXG5yZXF1aXJlKCAnLi9wcm9maWxlJyApXG5cbmxldCBDb21tYW5kZXIgICAgICAgICAgPSByZXF1aXJlKCAnY29tbWFuZGVyJyApLFxuICAgIEV4ZWMgICAgICAgICAgICAgICA9IHJlcXVpcmUoICdjaGlsZF9wcm9jZXNzJyApLmV4ZWMsXG4gICAgQ29uZmlnQ0xJICAgICAgICAgID0gcmVxdWlyZSggJy4vY2xpL2NvbmZpZycgKSxcbiAgICBDb25maWcgICAgICAgICAgICAgPSByZXF1aXJlKCAnLi9jb3JlL2NvbmZpZycgKSxcbiAgICBTZXR1cENMSSAgICAgICAgICAgPSByZXF1aXJlKCAnLi9jbGkvc2V0dXAnICksXG4gICAgV29ya1NwYWNlQ0xJICAgICAgID0gcmVxdWlyZSggJy4vY2xpL3dvcmtzcGFjZScgKSxcbiAgICBXb3JrU3BhY2UgICAgICAgICAgPSByZXF1aXJlKCAnLi9jb3JlL3dvcmtzcGFjZScgKSxcbiAgICBSZXF1ZXN0ICAgICAgICAgICAgPSByZXF1aXJlKCAnLi9yZXF1ZXN0JyApLFxuICAgIFV0aWwgICAgICAgICAgICAgICA9IHJlcXVpcmUoICcuL3V0aWwnICksXG4gICAgcGtnICAgICAgICAgICAgICAgID0gcmVxdWlyZSggJy4uL3BhY2thZ2UuanNvbicgKSxcbiAgICBsb2dWYWx1ZXMgICAgICAgICAgPSB7ICdzJyA6IDEsICdqcycgOiAxIH0sXG5cbiAgICBmaW5kVmFsaWRXb3Jrc3BhY2UgPSBhc3luYyggZGlyICkgPT4ge1xuICAgICAgICBsZXQgaXNWYWxpZCA9IGF3YWl0IFdvcmtTcGFjZS5pc1ZhbGlkV29ya1NwYWNlKCBkaXIgKVxuXG4gICAgICAgIGlmICggIWlzVmFsaWQgKSB7XG4gICAgICAgICAgICBkaXIgICAgID0gV29ya1NwYWNlLmN1cnJlbnQoKVxuICAgICAgICAgICAgaXNWYWxpZCA9IGF3YWl0IFdvcmtTcGFjZS5pc1ZhbGlkV29ya1NwYWNlKCBkaXIgKVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCBpc1ZhbGlkICkge1xuICAgICAgICAgICAgcmV0dXJuIHsgaXNWYWxpZCwgZGlyIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGxvZyggJ+aXoOazleaJvuWIsOWPr+i/kOihjOeahOW3peS9nOepuumXtCcsICdlcnJvcicgKVxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yXG4gICAgICAgIH1cbiAgICB9XG5cbkNvbW1hbmRlclxuICAgIC52ZXJzaW9uKCBwa2cudmVyc2lvbiwgJy12LCAtLXZlcnNpb24nIClcblxuQ29tbWFuZGVyXG4gICAgLmNvbW1hbmQoICdzZXR1cCBbZGlyXSBbdXJsXScgKVxuICAgIC5kZXNjcmlwdGlvbiggJ+WcqCBkaXIg5paH5Lu25aS55LiL55Sf5oiQ546v5aKDJyApXG4gICAgLmFjdGlvbiggKCBkaXIgPSAnJywgdXJsID0gJycgKSA9PiBuZXcgU2V0dXBDTEkoIGRpciwgdXJsICkgKVxuXG5Db21tYW5kZXJcbiAgICAuY29tbWFuZCggJ2NvbmZpZyBbZGlyXScgKVxuICAgIC5kZXNjcmlwdGlvbiggJ+mFjee9rueOr+WigycgKVxuICAgIC5hbGlhcyggJ2MnIClcbiAgICAuYWN0aW9uKCAoIGRpciA9IHByb2Nlc3MuY3dkKCkgKSA9PiBuZXcgQ29uZmlnQ0xJKCBkaXIgKSApXG5cbkNvbW1hbmRlclxuICAgIC5jb21tYW5kKCAncnVuJyApXG4gICAgLmRlc2NyaXB0aW9uKCAn6L+Q6KGM5pyN5YqhJyApXG4gICAgLmFsaWFzKCAncicgKVxuICAgIC5hY3Rpb24oIGFzeW5jKCkgPT4ge1xuICAgICAgICBsZXQgcmVzdWx0ID0gYXdhaXQgZmluZFZhbGlkV29ya3NwYWNlKCBwcm9jZXNzLmN3ZCgpIClcbiAgICAgICAgbmV3IFdvcmtTcGFjZSggcmVzdWx0LmRpciApLnN0YXJ0KClcbiAgICB9IClcblxuQ29tbWFuZGVyXG4gICAgLmNvbW1hbmQoICdzdG9wIFtpc0FsbF0nIClcbiAgICAuZGVzY3JpcHRpb24oICflgZzmraLmnI3liqEnIClcbiAgICAuYWxpYXMoICdzJyApXG4gICAgLmFjdGlvbiggYXN5bmMoIGlzQWxsID0gZmFsc2UgKSA9PiB7XG4gICAgICAgIGxldCByZXN1bHQgPSBhd2FpdCBmaW5kVmFsaWRXb3Jrc3BhY2UoIHByb2Nlc3MuY3dkKCkgKVxuICAgICAgICBuZXcgV29ya1NwYWNlKCByZXN1bHQuZGlyICkuc3RvcCggaXNBbGwgKVxuICAgIH0gKVxuXG5Db21tYW5kZXJcbiAgICAuY29tbWFuZCggJ3NhJyApXG4gICAgLmRlc2NyaXB0aW9uKCAn5YGc5q2i5omA5pyJ5pyN5YqhJyApXG4gICAgLmFjdGlvbiggYXN5bmMoKSA9PiB7XG4gICAgICAgIGxldCByZXN1bHQgPSBhd2FpdCBmaW5kVmFsaWRXb3Jrc3BhY2UoIHByb2Nlc3MuY3dkKCkgKVxuICAgICAgICBuZXcgV29ya1NwYWNlKCByZXN1bHQuZGlyICkuc3RvcCggJ2FsbCcgKVxuICAgIH0gKVxuXG5Db21tYW5kZXJcbiAgICAuY29tbWFuZCggJ2xvZyBbdHlwZV0nIClcbiAgICAuZGVzY3JpcHRpb24oICfmmL7npLrml6Xlv5cnIClcbiAgICAuYWxpYXMoICdsJyApXG4gICAgLmFjdGlvbiggKCB0eXBlID0gJ3MnICkgPT4ge1xuICAgICAgICBpZiAoIHR5cGUgaW4gbG9nVmFsdWVzICkge1xuICAgICAgICAgICAgRXhlYyggYHRhaWwgLWYgL3RtcC9sb2cvbmVzdC0ke3R5cGV9ZXJ2ZXIvJHtVdGlsLmdldEZvcm1hdERhdGUoKX0ubG9nYCApXG4gICAgICAgICAgICAgICAgLm9uKCAnbWVzc2FnZScsIG1lc3NhZ2UgPT4gbG9nKCBtZXNzYWdlICkgKVxuICAgICAgICAgICAgICAgIC5vbiggJ2Vycm9yJywgZXJyID0+IGxvZyggZXJyLCAnZXJyb3InICkgKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbG9nKCAnbG9nIOWPquaOpeWPlyBzL2pzIOS4pOS4quWPguaVsCcsICdlcnJvcicgKVxuICAgICAgICB9XG4gICAgfSApXG5cbkNvbW1hbmRlclxuICAgIC5jb21tYW5kKCAnbG8nIClcbiAgICAuZGVzY3JpcHRpb24oICfmiZPlvIDml6Xlv5fmiYDlnKjkvY3nva4nIClcbiAgICAuYWN0aW9uKCAoKSA9PiB7XG4gICAgICAgIEV4ZWMoICdvcGVuIC1hIGZpbmRlciBcIi90bXAvbG9nL25lc3Qtc2VydmVyL1wiJyApXG4gICAgICAgICAgICAub24oICdlcnJvcicsIGVyciA9PiBsb2coIGVyciwgJ2Vycm9yJyApIClcbiAgICB9IClcblxuQ29tbWFuZGVyXG4gICAgLmNvbW1hbmQoICdscycgKVxuICAgIC5kZXNjcmlwdGlvbiggJ+aYvuekuuW3peS9nOepuumXtOWIl+ihqCcgKVxuICAgIC5hY3Rpb24oICgpID0+IFdvcmtTcGFjZUNMSS5saXN0KCkgKVxuXG5Db21tYW5kZXJcbiAgICAuY29tbWFuZCggJ2lwJyApXG4gICAgLmRlc2NyaXB0aW9uKCAn5pi+56S65pys5py6IElQIOWcsOWdgCcgKVxuICAgIC5hY3Rpb24oICgpID0+IHtcbiAgICAgICAgbG9nKCBVdGlsLmdldElQKCkgKVxuICAgIH0gKVxuXG5Db21tYW5kZXJcbiAgICAuY29tbWFuZCggJ21hYycgKVxuICAgIC5kZXNjcmlwdGlvbiggJ+aYvuekuuacrOacuiBNYWMg5Zyw5Z2AJyApXG4gICAgLmFjdGlvbiggYXN5bmMoKSA9PiB7XG4gICAgICAgIHZhciBtYWMgPSBhd2FpdCBVdGlsLmdldE1hYygpXG4gICAgICAgIGxvZyggbWFjIClcbiAgICB9IClcblxuQ29tbWFuZGVyXG4gICAgLmNvbW1hbmQoICd1cGRhdGUnIClcbiAgICAuZGVzY3JpcHRpb24oICfmm7TmlrDnjq/looPphY3nva4nIClcbiAgICAuYWxpYXMoICd1JyApXG4gICAgLmFjdGlvbiggYXN5bmMoKSA9PiB7XG4gICAgICAgIHZhciBjb25maWcgICAgID0gbmV3IENvbmZpZyggV29ya1NwYWNlLmN1cnJlbnQoKSApLFxuICAgICAgICAgICAgaXNJUENoYW5nZSA9IGNvbmZpZy5pc0lQQ2hhbmdlKClcblxuICAgICAgICBpZiAoIGlzSVBDaGFuZ2UgKSB7XG4gICAgICAgICAgICBhd2FpdCBjb25maWcudXBkYXRlSVAoKVxuICAgICAgICAgICAgbG9nKCAnaXAg5pu05paw5oiQ5YqfJywgJ3N1Y2Nlc3MnIClcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGxvZyggJ2lwIOaXoOWPmOWMliwg5LiN6ZyA6KaB5pu05pawLicgKVxuICAgICAgICB9XG4gICAgfSApXG5cbkNvbW1hbmRlclxuICAgIC5jb21tYW5kKCAnaG9zdGxpc3QnIClcbiAgICAuZGVzY3JpcHRpb24oICfmmL7npLrkvaDphY3nva7ov4fnmoTln5/lkI3liJfooagnIClcbiAgICAuYWN0aW9uKCBhc3luYygpID0+IHtcbiAgICAgICAgdmFyIG1hYyAgICAgPSBhd2FpdCBVdGlsLmdldE1hYygpLFxuICAgICAgICAgICAgcmVzdWx0ICA9IGF3YWl0IFJlcXVlc3QoICdob3N0bGlzdD91a2V5PScgKyBtYWMgKSxcbiAgICAgICAgICAgIGRpc3BsYXkgPSAnJ1xuXG4gICAgICAgIGlmICggcmVzdWx0ICkge1xuICAgICAgICAgICAgcmVzdWx0LmRhdGEuZm9yRWFjaCggZGF0YSA9PiB7XG4gICAgICAgICAgICAgICAgZGlzcGxheSArPSBgXG4ke2RhdGEuaG9zdH1cbiAgICBpZDogJHtkYXRhLmlkfVxuICAgIGlwOiAke2RhdGEuaXB9XG4gICAgcG9ydDogJHtkYXRhLnBvcnR9XG4gICAgdWtleTogJHtkYXRhLnVrZXl9XG4gICAgICAgICAgICAgICAgYFxuICAgICAgICAgICAgfSApXG4gICAgICAgICAgICBsb2coIGRpc3BsYXkgKVxuICAgICAgICB9XG4gICAgfSApXG5cbkNvbW1hbmRlci5wYXJzZSggcHJvY2Vzcy5hcmd2IClcbiJdfQ==