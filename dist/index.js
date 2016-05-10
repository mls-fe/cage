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
    Key = require('./key'),
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
    var ref = (0, _bluebird.coroutine)(regeneratorRuntime.mark(function _callee6() {
        var type = arguments.length <= 0 || arguments[0] === undefined ? 's' : arguments[0];
        return regeneratorRuntime.wrap(function _callee6$(_context6) {
            while (1) {
                switch (_context6.prev = _context6.next) {
                    case 0:
                        if (!(type in logValues)) {
                            _context6.next = 4;
                            break;
                        }

                        return _context6.delegateYield(regeneratorRuntime.mark(function _callee5() {
                            var displayLog, filepath, isExist, result;
                            return regeneratorRuntime.wrap(function _callee5$(_context5) {
                                while (1) {
                                    switch (_context5.prev = _context5.next) {
                                        case 0:
                                            displayLog = function displayLog() {
                                                var client = Exec('tail -f ' + filepath).on('error', function (err) {
                                                    return log(err, 'error');
                                                });

                                                client.stdout.pipe(process.stdout);
                                            };

                                            filepath = '/tmp/log/nest-' + type + 'erver/' + Util.getFormatDate() + '.log';
                                            _context5.next = 4;
                                            return Util.checkFileExist(filepath);

                                        case 4:
                                            isExist = _context5.sent;

                                            if (!isExist) {
                                                _context5.next = 9;
                                                break;
                                            }

                                            displayLog();
                                            _context5.next = 14;
                                            break;

                                        case 9:
                                            log('日志文件不存在, 正在重启 whornbill 服务...', 'warn');
                                            _context5.next = 12;
                                            return findValidWorkspace(process.cwd());

                                        case 12:
                                            result = _context5.sent;

                                            new WorkSpace(result.dir).start(false).then(displayLog);

                                        case 14:
                                        case 'end':
                                            return _context5.stop();
                                    }
                                }
                            }, _callee5, undefined);
                        })(), 't0', 2);

                    case 2:
                        _context6.next = 5;
                        break;

                    case 4:
                        log('log 只接受 s/js 两个参数', 'error');

                    case 5:
                    case 'end':
                        return _context6.stop();
                }
            }
        }, _callee6, undefined);
    }));
    return function (_x7) {
        return ref.apply(this, arguments);
    };
}());

Commander.command('lo').description('打开日志所在位置').action(function () {
    Exec('open -a finder "/tmp/log/nest-server/"').on('error', function (err) {
        return log(err, 'error');
    });
});

Commander.command('ls').description('显示工作空间列表').action(function () {
    return WorkSpaceCLI.list();
});

Commander.command('ip').description('显示本机 IP 地址').action((0, _bluebird.coroutine)(regeneratorRuntime.mark(function _callee7() {
    var ip;
    return regeneratorRuntime.wrap(function _callee7$(_context7) {
        while (1) {
            switch (_context7.prev = _context7.next) {
                case 0:
                    _context7.next = 2;
                    return Util.getIP();

                case 2:
                    ip = _context7.sent;

                    log(ip);

                case 4:
                case 'end':
                    return _context7.stop();
            }
        }
    }, _callee7, undefined);
})));

Commander.command('mac').description('显示本机 Mac 地址').action((0, _bluebird.coroutine)(regeneratorRuntime.mark(function _callee8() {
    var mac;
    return regeneratorRuntime.wrap(function _callee8$(_context8) {
        while (1) {
            switch (_context8.prev = _context8.next) {
                case 0:
                    _context8.next = 2;
                    return Util.getMac();

                case 2:
                    mac = _context8.sent;

                    log(mac);

                case 4:
                case 'end':
                    return _context8.stop();
            }
        }
    }, _callee8, undefined);
})));

Commander.command('update').description('更新环境配置').alias('u').action((0, _bluebird.coroutine)(regeneratorRuntime.mark(function _callee9() {
    var config, isIPChange, _result, result;

    return regeneratorRuntime.wrap(function _callee9$(_context9) {
        while (1) {
            switch (_context9.prev = _context9.next) {
                case 0:
                    config = new Config(WorkSpace.current());
                    _context9.next = 3;
                    return config.isIPChange();

                case 3:
                    isIPChange = _context9.sent;


                    config.setPortOption(Key.random);
                    _context9.next = 7;
                    return config.updateProxy();

                case 7:
                    log('端口更新成功', 'success');

                    if (!isIPChange) {
                        _context9.next = 15;
                        break;
                    }

                    _context9.next = 11;
                    return config.updateIP();

                case 11:
                    _result = _context9.sent;

                    _result && log('ip 更新成功', 'success');
                    _context9.next = 16;
                    break;

                case 15:
                    log('ip 无变化, 不需要更新');

                case 16:
                    _context9.next = 18;
                    return findValidWorkspace(process.cwd());

                case 18:
                    result = _context9.sent;

                    new WorkSpace(result.dir).start();

                case 20:
                case 'end':
                    return _context9.stop();
            }
        }
    }, _callee9, undefined);
})));

Commander.command('hostlist').description('显示你配置过的域名列表').action((0, _bluebird.coroutine)(regeneratorRuntime.mark(function _callee10() {
    var mac, result, display;
    return regeneratorRuntime.wrap(function _callee10$(_context10) {
        while (1) {
            switch (_context10.prev = _context10.next) {
                case 0:
                    _context10.next = 2;
                    return Util.getMac();

                case 2:
                    mac = _context10.sent;
                    _context10.next = 5;
                    return Request('hostlist?ukey=' + mac);

                case 5:
                    result = _context10.sent;
                    display = '';


                    if (result) {
                        result.data.forEach(function (data) {
                            display += '\n' + data.host + '\n    id: ' + data.id + '\n    ip: ' + data.ip + '\n    port: ' + data.port + '\n    ukey: ' + data.ukey + '\n                ';
                        });
                        log(display);
                    }

                case 8:
                case 'end':
                    return _context10.stop();
            }
        }
    }, _callee10, undefined);
})));

Commander.parse(process.argv);
//# sourceMappingURL=data:application/json;base64,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QUZDLEVBR0QsT0FIQztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSwyQkFDZSxLQUFLLE1BQUwsRUFEZjs7QUFBQTtBQUNELHVCQURDO0FBQUE7QUFBQSwyQkFFZSxRQUFTLG1CQUFtQixHQUE1QixDQUZmOztBQUFBO0FBRUQsMEJBRkM7QUFHRCwyQkFIQyxHQUdTLEVBSFQ7OztBQUtMLHdCQUFLLE1BQUwsRUFBYztBQUNWLCtCQUFPLElBQVAsQ0FBWSxPQUFaLENBQXFCLGdCQUFRO0FBQ3pCLDhDQUNkLEtBQUssSUFEUyxrQkFFTixLQUFLLEVBRkMsa0JBR04sS0FBSyxFQUhDLG9CQUlKLEtBQUssSUFKRCxvQkFLSixLQUFLLElBTEQ7QUFPSCx5QkFSRDtBQVNBLDRCQUFLLE9BQUw7QUFDSDs7QUFoQkk7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsQ0FIYjs7QUFzQkEsVUFBVSxLQUFWLENBQWlCLFFBQVEsSUFBekIiLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzQ29udGVudCI6WyJyZXF1aXJlKCAnYmFiZWwtcG9seWZpbGwnIClcbnJlcXVpcmUoICcuL2xvZycgKVxucmVxdWlyZSggJy4vcHJvZmlsZScgKVxuXG5sZXQgQ29tbWFuZGVyICAgICAgICAgID0gcmVxdWlyZSggJ2NvbW1hbmRlcicgKSxcbiAgICBFeGVjICAgICAgICAgICAgICAgPSByZXF1aXJlKCAnY2hpbGRfcHJvY2VzcycgKS5leGVjLFxuICAgIENvbmZpZ0NMSSAgICAgICAgICA9IHJlcXVpcmUoICcuL2NsaS9jb25maWcnICksXG4gICAgQ29uZmlnICAgICAgICAgICAgID0gcmVxdWlyZSggJy4vY29yZS9jb25maWcnICksXG4gICAgU2V0dXBDTEkgICAgICAgICAgID0gcmVxdWlyZSggJy4vY2xpL3NldHVwJyApLFxuICAgIFdvcmtTcGFjZUNMSSAgICAgICA9IHJlcXVpcmUoICcuL2NsaS93b3Jrc3BhY2UnICksXG4gICAgV29ya1NwYWNlICAgICAgICAgID0gcmVxdWlyZSggJy4vY29yZS93b3Jrc3BhY2UnICksXG4gICAgUmVxdWVzdCAgICAgICAgICAgID0gcmVxdWlyZSggJy4vcmVxdWVzdCcgKSxcbiAgICBVdGlsICAgICAgICAgICAgICAgPSByZXF1aXJlKCAnLi91dGlsJyApLFxuICAgIEtleSAgICAgICAgICAgICAgICA9IHJlcXVpcmUoICcuL2tleScgKSxcbiAgICBwa2cgICAgICAgICAgICAgICAgPSByZXF1aXJlKCAnLi4vcGFja2FnZS5qc29uJyApLFxuICAgIGxvZ1ZhbHVlcyAgICAgICAgICA9IHsgJ3MnOiAxLCAnanMnOiAxIH0sXG5cbiAgICBmaW5kVmFsaWRXb3Jrc3BhY2UgPSBhc3luYyggZGlyICkgPT4ge1xuICAgICAgICBsZXQgaXNWYWxpZCA9IGF3YWl0IFdvcmtTcGFjZS5pc1ZhbGlkV29ya1NwYWNlKCBkaXIgKVxuXG4gICAgICAgIGlmICggIWlzVmFsaWQgKSB7XG4gICAgICAgICAgICBkaXIgICAgID0gV29ya1NwYWNlLmN1cnJlbnQoKVxuICAgICAgICAgICAgaXNWYWxpZCA9IGF3YWl0IFdvcmtTcGFjZS5pc1ZhbGlkV29ya1NwYWNlKCBkaXIgKVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCBpc1ZhbGlkICkge1xuICAgICAgICAgICAgcmV0dXJuIHsgaXNWYWxpZCwgZGlyIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGxvZyggJ+aXoOazleaJvuWIsOWPr+i/kOihjOeahOW3peS9nOepuumXtCcsICdlcnJvcicgKVxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yXG4gICAgICAgIH1cbiAgICB9XG5cbkNvbW1hbmRlclxuICAgIC52ZXJzaW9uKCBwa2cudmVyc2lvbiwgJy12LCAtLXZlcnNpb24nIClcblxuQ29tbWFuZGVyXG4gICAgLmNvbW1hbmQoICdzZXR1cCBbZGlyXSBbdXJsXScgKVxuICAgIC5kZXNjcmlwdGlvbiggJ+WcqCBkaXIg5paH5Lu25aS55LiL55Sf5oiQ546v5aKDJyApXG4gICAgLmFjdGlvbiggKCBkaXIgPSAnJywgdXJsID0gJycgKSA9PiBuZXcgU2V0dXBDTEkoIGRpciwgdXJsICkgKVxuXG5Db21tYW5kZXJcbiAgICAuY29tbWFuZCggJ2NvbmZpZyBbZGlyXScgKVxuICAgIC5kZXNjcmlwdGlvbiggJ+mFjee9rueOr+WigycgKVxuICAgIC5hbGlhcyggJ2MnIClcbiAgICAuYWN0aW9uKCAoIGRpciA9IHByb2Nlc3MuY3dkKCkgKSA9PiBuZXcgQ29uZmlnQ0xJKCBkaXIgKSApXG5cbkNvbW1hbmRlclxuICAgIC5jb21tYW5kKCAncnVuJyApXG4gICAgLmRlc2NyaXB0aW9uKCAn6L+Q6KGM5pyN5YqhJyApXG4gICAgLmFsaWFzKCAncicgKVxuICAgIC5hY3Rpb24oIGFzeW5jKCkgPT4ge1xuICAgICAgICBsZXQgcmVzdWx0ID0gYXdhaXQgZmluZFZhbGlkV29ya3NwYWNlKCBwcm9jZXNzLmN3ZCgpIClcbiAgICAgICAgbmV3IFdvcmtTcGFjZSggcmVzdWx0LmRpciApLnN0YXJ0KClcbiAgICB9IClcblxuQ29tbWFuZGVyXG4gICAgLmNvbW1hbmQoICdzdG9wIFtpc0FsbF0nIClcbiAgICAuZGVzY3JpcHRpb24oICflgZzmraLmnI3liqEnIClcbiAgICAuYWxpYXMoICdzJyApXG4gICAgLmFjdGlvbiggYXN5bmMoIGlzQWxsID0gZmFsc2UgKSA9PiB7XG4gICAgICAgIGxldCByZXN1bHQgPSBhd2FpdCBmaW5kVmFsaWRXb3Jrc3BhY2UoIHByb2Nlc3MuY3dkKCkgKVxuICAgICAgICBuZXcgV29ya1NwYWNlKCByZXN1bHQuZGlyICkuc3RvcCggaXNBbGwgKVxuICAgIH0gKVxuXG5Db21tYW5kZXJcbiAgICAuY29tbWFuZCggJ3NhJyApXG4gICAgLmRlc2NyaXB0aW9uKCAn5YGc5q2i5omA5pyJ5pyN5YqhJyApXG4gICAgLmFjdGlvbiggYXN5bmMoKSA9PiB7XG4gICAgICAgIGxldCByZXN1bHQgPSBhd2FpdCBmaW5kVmFsaWRXb3Jrc3BhY2UoIHByb2Nlc3MuY3dkKCkgKVxuICAgICAgICBuZXcgV29ya1NwYWNlKCByZXN1bHQuZGlyICkuc3RvcCggJ2FsbCcgKVxuICAgIH0gKVxuXG5Db21tYW5kZXJcbiAgICAuY29tbWFuZCggJ2xvZyBbdHlwZV0nIClcbiAgICAuZGVzY3JpcHRpb24oICfmmL7npLrml6Xlv5cnIClcbiAgICAuYWxpYXMoICdsJyApXG4gICAgLmFjdGlvbiggYXN5bmMoIHR5cGUgPSAncycgKSA9PiB7XG4gICAgICAgIGlmICggdHlwZSBpbiBsb2dWYWx1ZXMgKSB7XG4gICAgICAgICAgICBsZXQgZGlzcGxheUxvZyA9ICgpID0+IHtcbiAgICAgICAgICAgICAgICBsZXQgY2xpZW50ID0gRXhlYyggYHRhaWwgLWYgJHtmaWxlcGF0aH1gIClcbiAgICAgICAgICAgICAgICAgICAgLm9uKCAnZXJyb3InLCBlcnIgPT4gbG9nKCBlcnIsICdlcnJvcicgKSApXG5cbiAgICAgICAgICAgICAgICBjbGllbnQuc3Rkb3V0LnBpcGUoIHByb2Nlc3Muc3Rkb3V0IClcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGxldCBmaWxlcGF0aCAgID0gYC90bXAvbG9nL25lc3QtJHt0eXBlfWVydmVyLyR7VXRpbC5nZXRGb3JtYXREYXRlKCl9LmxvZ2AsXG4gICAgICAgICAgICAgICAgaXNFeGlzdCAgICA9IGF3YWl0IFV0aWwuY2hlY2tGaWxlRXhpc3QoIGZpbGVwYXRoIClcblxuICAgICAgICAgICAgaWYgKCBpc0V4aXN0ICkge1xuICAgICAgICAgICAgICAgIGRpc3BsYXlMb2coKVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBsb2coICfml6Xlv5fmlofku7bkuI3lrZjlnKgsIOato+WcqOmHjeWQryB3aG9ybmJpbGwg5pyN5YqhLi4uJywgJ3dhcm4nIClcbiAgICAgICAgICAgICAgICBsZXQgcmVzdWx0ID0gYXdhaXQgZmluZFZhbGlkV29ya3NwYWNlKCBwcm9jZXNzLmN3ZCgpIClcbiAgICAgICAgICAgICAgICBuZXcgV29ya1NwYWNlKCByZXN1bHQuZGlyIClcbiAgICAgICAgICAgICAgICAgICAgLnN0YXJ0KCBmYWxzZSApXG4gICAgICAgICAgICAgICAgICAgIC50aGVuKCBkaXNwbGF5TG9nIClcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGxvZyggJ2xvZyDlj6rmjqXlj5cgcy9qcyDkuKTkuKrlj4LmlbAnLCAnZXJyb3InIClcbiAgICAgICAgfVxuICAgIH0gKVxuXG5Db21tYW5kZXJcbiAgICAuY29tbWFuZCggJ2xvJyApXG4gICAgLmRlc2NyaXB0aW9uKCAn5omT5byA5pel5b+X5omA5Zyo5L2N572uJyApXG4gICAgLmFjdGlvbiggKCkgPT4ge1xuICAgICAgICBFeGVjKCAnb3BlbiAtYSBmaW5kZXIgXCIvdG1wL2xvZy9uZXN0LXNlcnZlci9cIicgKVxuICAgICAgICAgICAgLm9uKCAnZXJyb3InLCBlcnIgPT4gbG9nKCBlcnIsICdlcnJvcicgKSApXG4gICAgfSApXG5cbkNvbW1hbmRlclxuICAgIC5jb21tYW5kKCAnbHMnIClcbiAgICAuZGVzY3JpcHRpb24oICfmmL7npLrlt6XkvZznqbrpl7TliJfooagnIClcbiAgICAuYWN0aW9uKCAoKSA9PiBXb3JrU3BhY2VDTEkubGlzdCgpIClcblxuQ29tbWFuZGVyXG4gICAgLmNvbW1hbmQoICdpcCcgKVxuICAgIC5kZXNjcmlwdGlvbiggJ+aYvuekuuacrOacuiBJUCDlnLDlnYAnIClcbiAgICAuYWN0aW9uKCBhc3luYygpID0+IHtcbiAgICAgICAgdmFyIGlwID0gYXdhaXQgVXRpbC5nZXRJUCgpXG4gICAgICAgIGxvZyggaXAgKVxuICAgIH0gKVxuXG5Db21tYW5kZXJcbiAgICAuY29tbWFuZCggJ21hYycgKVxuICAgIC5kZXNjcmlwdGlvbiggJ+aYvuekuuacrOacuiBNYWMg5Zyw5Z2AJyApXG4gICAgLmFjdGlvbiggYXN5bmMoKSA9PiB7XG4gICAgICAgIHZhciBtYWMgPSBhd2FpdCBVdGlsLmdldE1hYygpXG4gICAgICAgIGxvZyggbWFjIClcbiAgICB9IClcblxuQ29tbWFuZGVyXG4gICAgLmNvbW1hbmQoICd1cGRhdGUnIClcbiAgICAuZGVzY3JpcHRpb24oICfmm7TmlrDnjq/looPphY3nva4nIClcbiAgICAuYWxpYXMoICd1JyApXG4gICAgLmFjdGlvbiggYXN5bmMoKSA9PiB7XG4gICAgICAgIGxldCBjb25maWcgICAgID0gbmV3IENvbmZpZyggV29ya1NwYWNlLmN1cnJlbnQoKSApLFxuICAgICAgICAgICAgaXNJUENoYW5nZSA9IGF3YWl0IGNvbmZpZy5pc0lQQ2hhbmdlKClcblxuICAgICAgICBjb25maWcuc2V0UG9ydE9wdGlvbiggS2V5LnJhbmRvbSApXG4gICAgICAgIGF3YWl0IGNvbmZpZy51cGRhdGVQcm94eSgpXG4gICAgICAgIGxvZyggJ+err+WPo+abtOaWsOaIkOWKnycsICdzdWNjZXNzJyApXG5cbiAgICAgICAgaWYgKCBpc0lQQ2hhbmdlICkge1xuICAgICAgICAgICAgbGV0IHJlc3VsdCA9IGF3YWl0IGNvbmZpZy51cGRhdGVJUCgpXG4gICAgICAgICAgICByZXN1bHQgJiYgbG9nKCAnaXAg5pu05paw5oiQ5YqfJywgJ3N1Y2Nlc3MnIClcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGxvZyggJ2lwIOaXoOWPmOWMliwg5LiN6ZyA6KaB5pu05pawJyApXG4gICAgICAgIH1cblxuICAgICAgICBsZXQgcmVzdWx0ID0gYXdhaXQgZmluZFZhbGlkV29ya3NwYWNlKCBwcm9jZXNzLmN3ZCgpIClcbiAgICAgICAgbmV3IFdvcmtTcGFjZSggcmVzdWx0LmRpciApLnN0YXJ0KClcbiAgICB9IClcblxuQ29tbWFuZGVyXG4gICAgLmNvbW1hbmQoICdob3N0bGlzdCcgKVxuICAgIC5kZXNjcmlwdGlvbiggJ+aYvuekuuS9oOmFjee9rui/h+eahOWfn+WQjeWIl+ihqCcgKVxuICAgIC5hY3Rpb24oIGFzeW5jKCkgPT4ge1xuICAgICAgICB2YXIgbWFjICAgICA9IGF3YWl0IFV0aWwuZ2V0TWFjKCksXG4gICAgICAgICAgICByZXN1bHQgID0gYXdhaXQgUmVxdWVzdCggJ2hvc3RsaXN0P3VrZXk9JyArIG1hYyApLFxuICAgICAgICAgICAgZGlzcGxheSA9ICcnXG5cbiAgICAgICAgaWYgKCByZXN1bHQgKSB7XG4gICAgICAgICAgICByZXN1bHQuZGF0YS5mb3JFYWNoKCBkYXRhID0+IHtcbiAgICAgICAgICAgICAgICBkaXNwbGF5ICs9IGBcbiR7ZGF0YS5ob3N0fVxuICAgIGlkOiAke2RhdGEuaWR9XG4gICAgaXA6ICR7ZGF0YS5pcH1cbiAgICBwb3J0OiAke2RhdGEucG9ydH1cbiAgICB1a2V5OiAke2RhdGEudWtleX1cbiAgICAgICAgICAgICAgICBgXG4gICAgICAgICAgICB9IClcbiAgICAgICAgICAgIGxvZyggZGlzcGxheSApXG4gICAgICAgIH1cbiAgICB9IClcblxuQ29tbWFuZGVyLnBhcnNlKCBwcm9jZXNzLmFyZ3YgKVxuIl19