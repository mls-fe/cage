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
    var _ref = (0, _bluebird.coroutine)(regeneratorRuntime.mark(function _callee(dir) {
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

                        return _context.abrupt('return', { isValid, dir });

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
        return _ref.apply(this, arguments);
    };
}(),
    update = function () {
    var _ref2 = (0, _bluebird.coroutine)(regeneratorRuntime.mark(function _callee2() {
        var config, isIPChange, _result, result;

        return regeneratorRuntime.wrap(function _callee2$(_context2) {
            while (1) {
                switch (_context2.prev = _context2.next) {
                    case 0:
                        config = new Config(WorkSpace.current());
                        _context2.next = 3;
                        return config.isIPChange();

                    case 3:
                        isIPChange = _context2.sent;

                        if (config.isNew) {
                            _context2.next = 9;
                            break;
                        }

                        config.setPortOption(Key.random);
                        _context2.next = 8;
                        return config.updateProxy();

                    case 8:
                        log('端口更新成功', 'success');

                    case 9:
                        if (!isIPChange) {
                            _context2.next = 16;
                            break;
                        }

                        _context2.next = 12;
                        return config.updateIP();

                    case 12:
                        _result = _context2.sent;

                        _result && log('ip 更新成功', 'success');
                        _context2.next = 17;
                        break;

                    case 16:
                        log('ip 无变化, 不需要更新');

                    case 17:
                        _context2.next = 19;
                        return findValidWorkspace(process.cwd());

                    case 19:
                        result = _context2.sent;

                        new WorkSpace(result.dir).start();

                    case 21:
                    case 'end':
                        return _context2.stop();
                }
            }
        }, _callee2, undefined);
    }));

    return function update() {
        return _ref2.apply(this, arguments);
    };
}();

Commander.version(pkg.version, '-v, --version');

Commander.command('setup [dir] [url]').description('在 dir 文件夹下生成环境').action(function () {
    var dir = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    var url = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
    return new SetupCLI(dir, url);
});

Commander.command('config [dir]').description('配置环境').alias('c').action(function () {
    var dir = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : process.cwd();
    return new ConfigCLI(dir);
});

Commander.command('run').description('运行服务').alias('r').action((0, _bluebird.coroutine)(regeneratorRuntime.mark(function _callee3() {
    var result;
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
        while (1) {
            switch (_context3.prev = _context3.next) {
                case 0:
                    _context3.next = 2;
                    return findValidWorkspace(process.cwd());

                case 2:
                    result = _context3.sent;

                    new WorkSpace(result.dir).start();

                case 4:
                case 'end':
                    return _context3.stop();
            }
        }
    }, _callee3, undefined);
})));

Commander.command('stop [isAll]').description('停止服务').alias('s').action(function () {
    var _ref4 = (0, _bluebird.coroutine)(regeneratorRuntime.mark(function _callee4() {
        var isAll = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
        var result;
        return regeneratorRuntime.wrap(function _callee4$(_context4) {
            while (1) {
                switch (_context4.prev = _context4.next) {
                    case 0:
                        _context4.next = 2;
                        return findValidWorkspace(process.cwd());

                    case 2:
                        result = _context4.sent;

                        new WorkSpace(result.dir).stop(isAll);

                    case 4:
                    case 'end':
                        return _context4.stop();
                }
            }
        }, _callee4, undefined);
    }));

    return function () {
        return _ref4.apply(this, arguments);
    };
}());

Commander.command('sa').description('停止所有服务').action((0, _bluebird.coroutine)(regeneratorRuntime.mark(function _callee5() {
    var result;
    return regeneratorRuntime.wrap(function _callee5$(_context5) {
        while (1) {
            switch (_context5.prev = _context5.next) {
                case 0:
                    _context5.next = 2;
                    return findValidWorkspace(process.cwd());

                case 2:
                    result = _context5.sent;

                    new WorkSpace(result.dir).stop('all');

                case 4:
                case 'end':
                    return _context5.stop();
            }
        }
    }, _callee5, undefined);
})));

Commander.command('log [type]').description('显示日志').alias('l').action(function () {
    var _ref6 = (0, _bluebird.coroutine)(regeneratorRuntime.mark(function _callee6() {
        var type = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 's';

        var displayLog, isNew, _filepath, isExist, result;

        return regeneratorRuntime.wrap(function _callee6$(_context6) {
            while (1) {
                switch (_context6.prev = _context6.next) {
                    case 0:
                        if (!(type in logValues)) {
                            _context6.next = 20;
                            break;
                        }

                        displayLog = function displayLog() {
                            var client = Exec(`tail -f ${_filepath}`).on('error', function (err) {
                                return log(err, 'error');
                            });

                            client.stdout.pipe(process.stdout);
                        };

                        _context6.next = 4;
                        return WorkSpace.isNew(WorkSpace.current());

                    case 4:
                        isNew = _context6.sent;
                        _filepath = `/tmp/log/${isNew ? 'hornbill' : 'nest'}-${type}erver/${Util.getFormatDate()}.log`;
                        _context6.next = 8;
                        return Util.checkFileExist(_filepath);

                    case 8:
                        isExist = _context6.sent;

                        if (!isExist) {
                            _context6.next = 13;
                            break;
                        }

                        displayLog();
                        _context6.next = 18;
                        break;

                    case 13:
                        log('日志文件不存在, 正在重启 whornbill 服务...', 'warn');
                        _context6.next = 16;
                        return findValidWorkspace(process.cwd());

                    case 16:
                        result = _context6.sent;

                        new WorkSpace(result.dir).start(false).then(displayLog);

                    case 18:
                        _context6.next = 21;
                        break;

                    case 20:
                        log('log 只接受 s/js 两个参数', 'error');

                    case 21:
                    case 'end':
                        return _context6.stop();
                }
            }
        }, _callee6, undefined);
    }));

    return function () {
        return _ref6.apply(this, arguments);
    };
}());

Commander.command('lo').description('打开日志所在位置').action(function () {
    Exec('open -a finder "/tmp/log/nest-server/"').on('error', function (err) {
        return log(err, 'error');
    });
});

Commander.command('ls').description('显示工作空间列表').action(function () {
    WorkSpaceCLI.list(update);
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

Commander.command('update').description('更新环境配置').alias('u').action(update);

Commander.command('hostlist').description('显示你配置过的域名列表').action((0, _bluebird.coroutine)(regeneratorRuntime.mark(function _callee9() {
    var mac, result, display;
    return regeneratorRuntime.wrap(function _callee9$(_context9) {
        while (1) {
            switch (_context9.prev = _context9.next) {
                case 0:
                    _context9.next = 2;
                    return Util.getMac();

                case 2:
                    mac = _context9.sent;
                    _context9.next = 5;
                    return Request('hostlist?ukey=' + mac);

                case 5:
                    result = _context9.sent;
                    display = '';


                    if (result) {
                        result.data.forEach(function (data) {
                            display += `
${data.host}
    id: ${data.id}
    ip: ${data.ip}
    port: ${data.port}
    ukey: ${data.ukey}
                `;
                        });
                        log(display);
                    }

                case 8:
                case 'end':
                    return _context9.stop();
            }
        }
    }, _callee9, undefined);
})));

Commander.parse(process.argv);