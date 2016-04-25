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
                            display += '\n' + data.host + '\n    id: ' + data.id + '\n    ip: ' + data.ip + '\n    ukey: ' + data.ukey + '\n                ';
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
//# sourceMappingURL=data:application/json;base64,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QUZmOztBQUFBO0FBRUQsMEJBRkM7QUFHRCwyQkFIQyxHQUdTLEVBSFQ7OztBQUtMLHdCQUFLLE1BQUwsRUFBYztBQUNWLCtCQUFPLElBQVAsQ0FBWSxPQUFaLENBQXFCLGdCQUFRO0FBQ3pCLDhDQUNkLEtBQUssSUFEUyxrQkFFTixLQUFLLEVBRkMsa0JBR04sS0FBSyxFQUhDLG9CQUlKLEtBQUssSUFKRDtBQU1ILHlCQVBEO0FBUUEsNEJBQUssT0FBTDtBQUNIOztBQWZJO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLENBSGI7O0FBcUJBLFVBQVUsS0FBVixDQUFpQixRQUFRLElBQXpCIiwiZmlsZSI6ImluZGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsicmVxdWlyZSggJ2JhYmVsLXBvbHlmaWxsJyApXG5yZXF1aXJlKCAnLi9sb2cnIClcbnJlcXVpcmUoICcuL3Byb2ZpbGUnIClcblxubGV0IENvbW1hbmRlciAgICAgICAgICA9IHJlcXVpcmUoICdjb21tYW5kZXInICksXG4gICAgRXhlYyAgICAgICAgICAgICAgID0gcmVxdWlyZSggJ2NoaWxkX3Byb2Nlc3MnICkuZXhlYyxcbiAgICBDb25maWdDTEkgICAgICAgICAgPSByZXF1aXJlKCAnLi9jbGkvY29uZmlnJyApLFxuICAgIENvbmZpZyAgICAgICAgICAgICA9IHJlcXVpcmUoICcuL2NvcmUvY29uZmlnJyApLFxuICAgIFNldHVwQ0xJICAgICAgICAgICA9IHJlcXVpcmUoICcuL2NsaS9zZXR1cCcgKSxcbiAgICBXb3JrU3BhY2VDTEkgICAgICAgPSByZXF1aXJlKCAnLi9jbGkvd29ya3NwYWNlJyApLFxuICAgIFdvcmtTcGFjZSAgICAgICAgICA9IHJlcXVpcmUoICcuL2NvcmUvd29ya3NwYWNlJyApLFxuICAgIFJlcXVlc3QgICAgICAgICAgICA9IHJlcXVpcmUoICcuL3JlcXVlc3QnICksXG4gICAgVXRpbCAgICAgICAgICAgICAgID0gcmVxdWlyZSggJy4vdXRpbCcgKSxcbiAgICBwa2cgICAgICAgICAgICAgICAgPSByZXF1aXJlKCAnLi4vcGFja2FnZS5qc29uJyApLFxuICAgIGxvZ1ZhbHVlcyAgICAgICAgICA9IHsgJ3MnIDogMSwgJ2pzJyA6IDEgfSxcblxuICAgIGZpbmRWYWxpZFdvcmtzcGFjZSA9IGFzeW5jKCBkaXIgKSA9PiB7XG4gICAgICAgIGxldCBpc1ZhbGlkID0gYXdhaXQgV29ya1NwYWNlLmlzVmFsaWRXb3JrU3BhY2UoIGRpciApXG5cbiAgICAgICAgaWYgKCAhaXNWYWxpZCApIHtcbiAgICAgICAgICAgIGRpciAgICAgPSBXb3JrU3BhY2UuY3VycmVudCgpXG4gICAgICAgICAgICBpc1ZhbGlkID0gYXdhaXQgV29ya1NwYWNlLmlzVmFsaWRXb3JrU3BhY2UoIGRpciApXG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIGlzVmFsaWQgKSB7XG4gICAgICAgICAgICByZXR1cm4geyBpc1ZhbGlkLCBkaXIgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbG9nKCAn5peg5rOV5om+5Yiw5Y+v6L+Q6KGM55qE5bel5L2c56m66Ze0JywgJ2Vycm9yJyApXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3JcbiAgICAgICAgfVxuICAgIH1cblxuQ29tbWFuZGVyXG4gICAgLnZlcnNpb24oIHBrZy52ZXJzaW9uLCAnLXYsIC0tdmVyc2lvbicgKVxuXG5Db21tYW5kZXJcbiAgICAuY29tbWFuZCggJ3NldHVwIFtkaXJdIFt1cmxdJyApXG4gICAgLmRlc2NyaXB0aW9uKCAn5ZyoIGRpciDmlofku7blpLnkuIvnlJ/miJDnjq/looMnIClcbiAgICAuYWN0aW9uKCAoIGRpciA9ICcnLCB1cmwgPSAnJyApID0+IG5ldyBTZXR1cENMSSggZGlyLCB1cmwgKSApXG5cbkNvbW1hbmRlclxuICAgIC5jb21tYW5kKCAnY29uZmlnIFtkaXJdJyApXG4gICAgLmRlc2NyaXB0aW9uKCAn6YWN572u546v5aKDJyApXG4gICAgLmFsaWFzKCAnYycgKVxuICAgIC5hY3Rpb24oICggZGlyID0gcHJvY2Vzcy5jd2QoKSApID0+IG5ldyBDb25maWdDTEkoIGRpciApIClcblxuQ29tbWFuZGVyXG4gICAgLmNvbW1hbmQoICdydW4nIClcbiAgICAuZGVzY3JpcHRpb24oICfov5DooYzmnI3liqEnIClcbiAgICAuYWxpYXMoICdyJyApXG4gICAgLmFjdGlvbiggYXN5bmMoKSA9PiB7XG4gICAgICAgIGxldCByZXN1bHQgPSBhd2FpdCBmaW5kVmFsaWRXb3Jrc3BhY2UoIHByb2Nlc3MuY3dkKCkgKVxuICAgICAgICBuZXcgV29ya1NwYWNlKCByZXN1bHQuZGlyICkuc3RhcnQoKVxuICAgIH0gKVxuXG5Db21tYW5kZXJcbiAgICAuY29tbWFuZCggJ3N0b3AgW2lzQWxsXScgKVxuICAgIC5kZXNjcmlwdGlvbiggJ+WBnOatouacjeWKoScgKVxuICAgIC5hbGlhcyggJ3MnIClcbiAgICAuYWN0aW9uKCBhc3luYyggaXNBbGwgPSBmYWxzZSApID0+IHtcbiAgICAgICAgbGV0IHJlc3VsdCA9IGF3YWl0IGZpbmRWYWxpZFdvcmtzcGFjZSggcHJvY2Vzcy5jd2QoKSApXG4gICAgICAgIG5ldyBXb3JrU3BhY2UoIHJlc3VsdC5kaXIgKS5zdG9wKCBpc0FsbCApXG4gICAgfSApXG5cbkNvbW1hbmRlclxuICAgIC5jb21tYW5kKCAnc2EnIClcbiAgICAuZGVzY3JpcHRpb24oICflgZzmraLmiYDmnInmnI3liqEnIClcbiAgICAuYWN0aW9uKCBhc3luYygpID0+IHtcbiAgICAgICAgbGV0IHJlc3VsdCA9IGF3YWl0IGZpbmRWYWxpZFdvcmtzcGFjZSggcHJvY2Vzcy5jd2QoKSApXG4gICAgICAgIG5ldyBXb3JrU3BhY2UoIHJlc3VsdC5kaXIgKS5zdG9wKCAnYWxsJyApXG4gICAgfSApXG5cbkNvbW1hbmRlclxuICAgIC5jb21tYW5kKCAnbG9nIFt0eXBlXScgKVxuICAgIC5kZXNjcmlwdGlvbiggJ+aYvuekuuaXpeW/lycgKVxuICAgIC5hbGlhcyggJ2wnIClcbiAgICAuYWN0aW9uKCAoIHR5cGUgPSAncycgKSA9PiB7XG4gICAgICAgIGlmICggdHlwZSBpbiBsb2dWYWx1ZXMgKSB7XG4gICAgICAgICAgICBFeGVjKCBgdGFpbCAtZiAvdG1wL2xvZy9uZXN0LSR7dHlwZX1lcnZlci8ke1V0aWwuZ2V0Rm9ybWF0RGF0ZSgpfS5sb2dgIClcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGxvZyggJ2xvZyDlj6rmjqXlj5cgcy9qcyDkuKTkuKrlj4LmlbAnLCAnZXJyb3InIClcbiAgICAgICAgfVxuICAgIH0gKVxuXG5Db21tYW5kZXJcbiAgICAuY29tbWFuZCggJ2xvJyApXG4gICAgLmRlc2NyaXB0aW9uKCAn5omT5byA5pel5b+X5omA5Zyo5L2N572uJyApXG4gICAgLmFjdGlvbiggKCkgPT4ge1xuICAgICAgICBFeGVjKCBgb3BlbiAtYSBmaW5kZXIgXCIvdG1wL2xvZy9uZXN0LXNlcnZlci8ke1V0aWwuZ2V0Rm9ybWF0RGF0ZSgpfVwiYCApXG4gICAgfSApXG5cbkNvbW1hbmRlclxuICAgIC5jb21tYW5kKCAnbHMnIClcbiAgICAuZGVzY3JpcHRpb24oICfmmL7npLrlt6XkvZznqbrpl7TliJfooagnIClcbiAgICAuYWN0aW9uKCAoKSA9PiBXb3JrU3BhY2VDTEkubGlzdCgpIClcblxuQ29tbWFuZGVyXG4gICAgLmNvbW1hbmQoICdpcCcgKVxuICAgIC5kZXNjcmlwdGlvbiggJ+aYvuekuuacrOacuiBJUCDlnLDlnYAnIClcbiAgICAuYWN0aW9uKCBhc3luYygpID0+IHtcbiAgICAgICAgdmFyIGlwID0gYXdhaXQgVXRpbC5nZXRJUCgpXG4gICAgICAgIGxvZyggaXAgKVxuICAgIH0gKVxuXG5Db21tYW5kZXJcbiAgICAuY29tbWFuZCggJ21hYycgKVxuICAgIC5kZXNjcmlwdGlvbiggJ+aYvuekuuacrOacuiBNYWMg5Zyw5Z2AJyApXG4gICAgLmFjdGlvbiggYXN5bmMoKSA9PiB7XG4gICAgICAgIHZhciBtYWMgPSBhd2FpdCBVdGlsLmdldE1hYygpXG4gICAgICAgIGxvZyggbWFjIClcbiAgICB9IClcblxuQ29tbWFuZGVyXG4gICAgLmNvbW1hbmQoICd1cGRhdGUnIClcbiAgICAuZGVzY3JpcHRpb24oICfmm7TmlrDnjq/looPphY3nva4nIClcbiAgICAuYWxpYXMoICd1JyApXG4gICAgLmFjdGlvbiggYXN5bmMoKSA9PiB7XG4gICAgICAgIHZhciBjb25maWcgICAgID0gbmV3IENvbmZpZyggV29ya1NwYWNlLmN1cnJlbnQoKSApLFxuICAgICAgICAgICAgaXNJUENoYW5nZSA9IGF3YWl0IGNvbmZpZy5pc0lQQ2hhbmdlKClcblxuICAgICAgICBpZiAoIGlzSVBDaGFuZ2UgKSB7XG4gICAgICAgICAgICBhd2FpdCBjb25maWcudXBkYXRlSVAoKVxuICAgICAgICAgICAgbG9nKCAnaXAg5pu05paw5oiQ5YqfJywgJ3N1Y2Nlc3MnIClcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGxvZyggJ2lwIOaXoOWPmOWMliwg5LiN6ZyA6KaB5pu05pawLicgKVxuICAgICAgICB9XG4gICAgfSApXG5cbkNvbW1hbmRlclxuICAgIC5jb21tYW5kKCAnaG9zdGxpc3QnIClcbiAgICAuZGVzY3JpcHRpb24oICfmmL7npLrkvaDphY3nva7ov4fnmoTln5/lkI3liJfooagnIClcbiAgICAuYWN0aW9uKCBhc3luYygpID0+IHtcbiAgICAgICAgdmFyIG1hYyAgICAgPSBhd2FpdCBVdGlsLmdldE1hYygpLFxuICAgICAgICAgICAgcmVzdWx0ICA9IGF3YWl0IFJlcXVlc3QoICcvaG9zdGxpc3Q/dWtleT0nICsgbWFjICksXG4gICAgICAgICAgICBkaXNwbGF5ID0gJydcblxuICAgICAgICBpZiAoIHJlc3VsdCApIHtcbiAgICAgICAgICAgIHJlc3VsdC5kYXRhLmZvckVhY2goIGRhdGEgPT4ge1xuICAgICAgICAgICAgICAgIGRpc3BsYXkgKz0gYFxuJHtkYXRhLmhvc3R9XG4gICAgaWQ6ICR7ZGF0YS5pZH1cbiAgICBpcDogJHtkYXRhLmlwfVxuICAgIHVrZXk6ICR7ZGF0YS51a2V5fVxuICAgICAgICAgICAgICAgIGBcbiAgICAgICAgICAgIH0gKVxuICAgICAgICAgICAgbG9nKCBkaXNwbGF5IClcbiAgICAgICAgfVxuICAgIH0gKVxuXG5Db21tYW5kZXIucGFyc2UoIHByb2Nlc3MuYXJndiApXG4iXX0=