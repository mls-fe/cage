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
        Exec('tail -f /tmp/log/nest-' + type + 'erver/' + Util.getFormatDate() + '.log');
    } else {
        log('log 只接受 s/js 两个参数', 'error');
    }
});

Commander.command('lo').description('打开日志所在位置').action(function () {
    Exec('open -a finder "/tmp/log/nest-server/' + Util.getFormatDate() + '"');
});

Commander.command('ls').description('显示工作空间列表').action(function () {
    return WorkSpaceCLI.list();
});

Commander.command('ip').description('显示本机 IP 地址').action((0, _bluebird.coroutine)(regeneratorRuntime.mark(function _callee5() {
    var ip;
    return regeneratorRuntime.wrap(function _callee5$(_context5) {
        while (1) {
            switch (_context5.prev = _context5.next) {
                case 0:
                    _context5.next = 2;
                    return Util.getIP();

                case 2:
                    ip = _context5.sent;

                    log(ip);

                case 4:
                case 'end':
                    return _context5.stop();
            }
        }
    }, _callee5, undefined);
})));

Commander.command('mac').description('显示本机 Mac 地址').action((0, _bluebird.coroutine)(regeneratorRuntime.mark(function _callee6() {
    var mac;
    return regeneratorRuntime.wrap(function _callee6$(_context6) {
        while (1) {
            switch (_context6.prev = _context6.next) {
                case 0:
                    _context6.next = 2;
                    return Util.getMac();

                case 2:
                    mac = _context6.sent;

                    log(mac);

                case 4:
                case 'end':
                    return _context6.stop();
            }
        }
    }, _callee6, undefined);
})));

Commander.command('update').description('更新环境配置').alias('u').action((0, _bluebird.coroutine)(regeneratorRuntime.mark(function _callee7() {
    var config, isIPChange;
    return regeneratorRuntime.wrap(function _callee7$(_context7) {
        while (1) {
            switch (_context7.prev = _context7.next) {
                case 0:
                    config = new Config(WorkSpace.current());
                    _context7.next = 3;
                    return config.isIPChange();

                case 3:
                    isIPChange = _context7.sent;

                    if (!isIPChange) {
                        _context7.next = 10;
                        break;
                    }

                    _context7.next = 7;
                    return config.updateIP();

                case 7:
                    log('ip 更新成功', 'success');
                    _context7.next = 11;
                    break;

                case 10:
                    log('ip 无变化, 不需要更新.');

                case 11:
                case 'end':
                    return _context7.stop();
            }
        }
    }, _callee7, undefined);
})));

Commander.command('hostlist').description('显示你配置过的域名列表').action((0, _bluebird.coroutine)(regeneratorRuntime.mark(function _callee8() {
    var mac, result, display;
    return regeneratorRuntime.wrap(function _callee8$(_context8) {
        while (1) {
            switch (_context8.prev = _context8.next) {
                case 0:
                    _context8.next = 2;
                    return Util.getMac();

                case 2:
                    mac = _context8.sent;
                    _context8.next = 5;
                    return Request('/hostlist?ukey=' + mac);

                case 5:
                    result = _context8.sent;
                    display = '';


                    if (result) {
                        result.data.forEach(function (data) {
                            display += '\n' + data.host + '\n    id: ' + data.id + '\n    ip: ' + data.ip + '\n    port: ' + data.port + '\n    ukey: ' + data.ukey + '\n                ';
                        });
                        log(display);
                    }

                case 8:
                case 'end':
                    return _context8.stop();
            }
        }
    }, _callee8, undefined);
})));

Commander.parse(process.argv);
//# sourceMappingURL=data:application/json;base64,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QUZmOztBQUFBO0FBRUQsMEJBRkM7QUFHRCwyQkFIQyxHQUdTLEVBSFQ7OztBQUtMLHdCQUFLLE1BQUwsRUFBYztBQUNWLCtCQUFPLElBQVAsQ0FBWSxPQUFaLENBQXFCLGdCQUFRO0FBQ3pCLDhDQUNkLEtBQUssSUFEUyxrQkFFTixLQUFLLEVBRkMsa0JBR04sS0FBSyxFQUhDLG9CQUlKLEtBQUssSUFKRCxvQkFLSixLQUFLLElBTEQ7QUFPSCx5QkFSRDtBQVNBLDRCQUFLLE9BQUw7QUFDSDs7QUFoQkk7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsQ0FIYjs7QUFzQkEsVUFBVSxLQUFWLENBQWlCLFFBQVEsSUFBekIiLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzQ29udGVudCI6WyJyZXF1aXJlKCAnYmFiZWwtcG9seWZpbGwnIClcbnJlcXVpcmUoICcuL2xvZycgKVxucmVxdWlyZSggJy4vcHJvZmlsZScgKVxuXG5sZXQgQ29tbWFuZGVyICAgICAgICAgID0gcmVxdWlyZSggJ2NvbW1hbmRlcicgKSxcbiAgICBFeGVjICAgICAgICAgICAgICAgPSByZXF1aXJlKCAnY2hpbGRfcHJvY2VzcycgKS5leGVjLFxuICAgIENvbmZpZ0NMSSAgICAgICAgICA9IHJlcXVpcmUoICcuL2NsaS9jb25maWcnICksXG4gICAgQ29uZmlnICAgICAgICAgICAgID0gcmVxdWlyZSggJy4vY29yZS9jb25maWcnICksXG4gICAgU2V0dXBDTEkgICAgICAgICAgID0gcmVxdWlyZSggJy4vY2xpL3NldHVwJyApLFxuICAgIFdvcmtTcGFjZUNMSSAgICAgICA9IHJlcXVpcmUoICcuL2NsaS93b3Jrc3BhY2UnICksXG4gICAgV29ya1NwYWNlICAgICAgICAgID0gcmVxdWlyZSggJy4vY29yZS93b3Jrc3BhY2UnICksXG4gICAgUmVxdWVzdCAgICAgICAgICAgID0gcmVxdWlyZSggJy4vcmVxdWVzdCcgKSxcbiAgICBVdGlsICAgICAgICAgICAgICAgPSByZXF1aXJlKCAnLi91dGlsJyApLFxuICAgIHBrZyAgICAgICAgICAgICAgICA9IHJlcXVpcmUoICcuLi9wYWNrYWdlLmpzb24nICksXG4gICAgbG9nVmFsdWVzICAgICAgICAgID0geyAncycgOiAxLCAnanMnIDogMSB9LFxuXG4gICAgZmluZFZhbGlkV29ya3NwYWNlID0gYXN5bmMoIGRpciApID0+IHtcbiAgICAgICAgbGV0IGlzVmFsaWQgPSBhd2FpdCBXb3JrU3BhY2UuaXNWYWxpZFdvcmtTcGFjZSggZGlyIClcblxuICAgICAgICBpZiAoICFpc1ZhbGlkICkge1xuICAgICAgICAgICAgZGlyICAgICA9IFdvcmtTcGFjZS5jdXJyZW50KClcbiAgICAgICAgICAgIGlzVmFsaWQgPSBhd2FpdCBXb3JrU3BhY2UuaXNWYWxpZFdvcmtTcGFjZSggZGlyIClcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICggaXNWYWxpZCApIHtcbiAgICAgICAgICAgIHJldHVybiB7IGlzVmFsaWQsIGRpciB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBsb2coICfml6Dms5Xmib7liLDlj6/ov5DooYznmoTlt6XkvZznqbrpl7QnLCAnZXJyb3InIClcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvclxuICAgICAgICB9XG4gICAgfVxuXG5Db21tYW5kZXJcbiAgICAudmVyc2lvbiggcGtnLnZlcnNpb24sICctdiwgLS12ZXJzaW9uJyApXG5cbkNvbW1hbmRlclxuICAgIC5jb21tYW5kKCAnc2V0dXAgW2Rpcl0gW3VybF0nIClcbiAgICAuZGVzY3JpcHRpb24oICflnKggZGlyIOaWh+S7tuWkueS4i+eUn+aIkOeOr+WigycgKVxuICAgIC5hY3Rpb24oICggZGlyID0gJycsIHVybCA9ICcnICkgPT4gbmV3IFNldHVwQ0xJKCBkaXIsIHVybCApIClcblxuQ29tbWFuZGVyXG4gICAgLmNvbW1hbmQoICdjb25maWcgW2Rpcl0nIClcbiAgICAuZGVzY3JpcHRpb24oICfphY3nva7njq/looMnIClcbiAgICAuYWxpYXMoICdjJyApXG4gICAgLmFjdGlvbiggKCBkaXIgPSBwcm9jZXNzLmN3ZCgpICkgPT4gbmV3IENvbmZpZ0NMSSggZGlyICkgKVxuXG5Db21tYW5kZXJcbiAgICAuY29tbWFuZCggJ3J1bicgKVxuICAgIC5kZXNjcmlwdGlvbiggJ+i/kOihjOacjeWKoScgKVxuICAgIC5hbGlhcyggJ3InIClcbiAgICAuYWN0aW9uKCBhc3luYygpID0+IHtcbiAgICAgICAgbGV0IHJlc3VsdCA9IGF3YWl0IGZpbmRWYWxpZFdvcmtzcGFjZSggcHJvY2Vzcy5jd2QoKSApXG4gICAgICAgIG5ldyBXb3JrU3BhY2UoIHJlc3VsdC5kaXIgKS5zdGFydCgpXG4gICAgfSApXG5cbkNvbW1hbmRlclxuICAgIC5jb21tYW5kKCAnc3RvcCBbaXNBbGxdJyApXG4gICAgLmRlc2NyaXB0aW9uKCAn5YGc5q2i5pyN5YqhJyApXG4gICAgLmFsaWFzKCAncycgKVxuICAgIC5hY3Rpb24oIGFzeW5jKCBpc0FsbCA9IGZhbHNlICkgPT4ge1xuICAgICAgICBsZXQgcmVzdWx0ID0gYXdhaXQgZmluZFZhbGlkV29ya3NwYWNlKCBwcm9jZXNzLmN3ZCgpIClcbiAgICAgICAgbmV3IFdvcmtTcGFjZSggcmVzdWx0LmRpciApLnN0b3AoIGlzQWxsIClcbiAgICB9IClcblxuQ29tbWFuZGVyXG4gICAgLmNvbW1hbmQoICdzYScgKVxuICAgIC5kZXNjcmlwdGlvbiggJ+WBnOatouaJgOacieacjeWKoScgKVxuICAgIC5hY3Rpb24oIGFzeW5jKCkgPT4ge1xuICAgICAgICBsZXQgcmVzdWx0ID0gYXdhaXQgZmluZFZhbGlkV29ya3NwYWNlKCBwcm9jZXNzLmN3ZCgpIClcbiAgICAgICAgbmV3IFdvcmtTcGFjZSggcmVzdWx0LmRpciApLnN0b3AoICdhbGwnIClcbiAgICB9IClcblxuQ29tbWFuZGVyXG4gICAgLmNvbW1hbmQoICdsb2cgW3R5cGVdJyApXG4gICAgLmRlc2NyaXB0aW9uKCAn5pi+56S65pel5b+XJyApXG4gICAgLmFsaWFzKCAnbCcgKVxuICAgIC5hY3Rpb24oICggdHlwZSA9ICdzJyApID0+IHtcbiAgICAgICAgaWYgKCB0eXBlIGluIGxvZ1ZhbHVlcyApIHtcbiAgICAgICAgICAgIEV4ZWMoIGB0YWlsIC1mIC90bXAvbG9nL25lc3QtJHt0eXBlfWVydmVyLyR7VXRpbC5nZXRGb3JtYXREYXRlKCl9LmxvZ2AgKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbG9nKCAnbG9nIOWPquaOpeWPlyBzL2pzIOS4pOS4quWPguaVsCcsICdlcnJvcicgKVxuICAgICAgICB9XG4gICAgfSApXG5cbkNvbW1hbmRlclxuICAgIC5jb21tYW5kKCAnbG8nIClcbiAgICAuZGVzY3JpcHRpb24oICfmiZPlvIDml6Xlv5fmiYDlnKjkvY3nva4nIClcbiAgICAuYWN0aW9uKCAoKSA9PiB7XG4gICAgICAgIEV4ZWMoIGBvcGVuIC1hIGZpbmRlciBcIi90bXAvbG9nL25lc3Qtc2VydmVyLyR7VXRpbC5nZXRGb3JtYXREYXRlKCl9XCJgIClcbiAgICB9IClcblxuQ29tbWFuZGVyXG4gICAgLmNvbW1hbmQoICdscycgKVxuICAgIC5kZXNjcmlwdGlvbiggJ+aYvuekuuW3peS9nOepuumXtOWIl+ihqCcgKVxuICAgIC5hY3Rpb24oICgpID0+IFdvcmtTcGFjZUNMSS5saXN0KCkgKVxuXG5Db21tYW5kZXJcbiAgICAuY29tbWFuZCggJ2lwJyApXG4gICAgLmRlc2NyaXB0aW9uKCAn5pi+56S65pys5py6IElQIOWcsOWdgCcgKVxuICAgIC5hY3Rpb24oIGFzeW5jKCkgPT4ge1xuICAgICAgICB2YXIgaXAgPSBhd2FpdCBVdGlsLmdldElQKClcbiAgICAgICAgbG9nKCBpcCApXG4gICAgfSApXG5cbkNvbW1hbmRlclxuICAgIC5jb21tYW5kKCAnbWFjJyApXG4gICAgLmRlc2NyaXB0aW9uKCAn5pi+56S65pys5py6IE1hYyDlnLDlnYAnIClcbiAgICAuYWN0aW9uKCBhc3luYygpID0+IHtcbiAgICAgICAgdmFyIG1hYyA9IGF3YWl0IFV0aWwuZ2V0TWFjKClcbiAgICAgICAgbG9nKCBtYWMgKVxuICAgIH0gKVxuXG5Db21tYW5kZXJcbiAgICAuY29tbWFuZCggJ3VwZGF0ZScgKVxuICAgIC5kZXNjcmlwdGlvbiggJ+abtOaWsOeOr+Wig+mFjee9ricgKVxuICAgIC5hbGlhcyggJ3UnIClcbiAgICAuYWN0aW9uKCBhc3luYygpID0+IHtcbiAgICAgICAgdmFyIGNvbmZpZyAgICAgPSBuZXcgQ29uZmlnKCBXb3JrU3BhY2UuY3VycmVudCgpICksXG4gICAgICAgICAgICBpc0lQQ2hhbmdlID0gYXdhaXQgY29uZmlnLmlzSVBDaGFuZ2UoKVxuXG4gICAgICAgIGlmICggaXNJUENoYW5nZSApIHtcbiAgICAgICAgICAgIGF3YWl0IGNvbmZpZy51cGRhdGVJUCgpXG4gICAgICAgICAgICBsb2coICdpcCDmm7TmlrDmiJDlip8nLCAnc3VjY2VzcycgKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbG9nKCAnaXAg5peg5Y+Y5YyWLCDkuI3pnIDopoHmm7TmlrAuJyApXG4gICAgICAgIH1cbiAgICB9IClcblxuQ29tbWFuZGVyXG4gICAgLmNvbW1hbmQoICdob3N0bGlzdCcgKVxuICAgIC5kZXNjcmlwdGlvbiggJ+aYvuekuuS9oOmFjee9rui/h+eahOWfn+WQjeWIl+ihqCcgKVxuICAgIC5hY3Rpb24oIGFzeW5jKCkgPT4ge1xuICAgICAgICB2YXIgbWFjICAgICA9IGF3YWl0IFV0aWwuZ2V0TWFjKCksXG4gICAgICAgICAgICByZXN1bHQgID0gYXdhaXQgUmVxdWVzdCggJy9ob3N0bGlzdD91a2V5PScgKyBtYWMgKSxcbiAgICAgICAgICAgIGRpc3BsYXkgPSAnJ1xuXG4gICAgICAgIGlmICggcmVzdWx0ICkge1xuICAgICAgICAgICAgcmVzdWx0LmRhdGEuZm9yRWFjaCggZGF0YSA9PiB7XG4gICAgICAgICAgICAgICAgZGlzcGxheSArPSBgXG4ke2RhdGEuaG9zdH1cbiAgICBpZDogJHtkYXRhLmlkfVxuICAgIGlwOiAke2RhdGEuaXB9XG4gICAgcG9ydDogJHtkYXRhLnBvcnR9XG4gICAgdWtleTogJHtkYXRhLnVrZXl9XG4gICAgICAgICAgICAgICAgYFxuICAgICAgICAgICAgfSApXG4gICAgICAgICAgICBsb2coIGRpc3BsYXkgKVxuICAgICAgICB9XG4gICAgfSApXG5cbkNvbW1hbmRlci5wYXJzZSggcHJvY2Vzcy5hcmd2IClcbiJdfQ==