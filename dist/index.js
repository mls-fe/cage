'use strict';

var _bluebird = require('bluebird');

var _arguments = arguments;
/**
 * commands:
 *  setup
 *      在当前目录下获取
 *  config(c)
 *  run(r)
 *  stop(s)
 */

require('babel-polyfill');
require('./log');
require('./profile');

var Commander = require('commander'),
    Moment = require('moment'),
    Open = require('open'),
    Tail = require('tail').Tail,
    ConfigCLI = require('./cli/config'),
    SetupCLI = require('./cli/setup'),
    WorkSpaceCLI = require('./cli/workspace'),
    WorkSpace = require('./core/workspace'),
    Update = require('./update'),
    pkg = require('../package.json'),
    logValues = { 's': 1, 'js': 1 },
    findValidWorkspace = (function () {
    var _this = this;

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
        }, _callee, _this);
    }));
    return function findValidWorkspace(_x) {
        return ref.apply(this, arguments);
    };
})();

Commander.version(pkg.version, '-v, --version');

Commander.command('setup [dir] [url]').action(function (dir, url) {
    return new SetupCLI(dir || '', url || '');
});

Commander.command('config [dir]').alias('c').action(function () {
    var dir = arguments.length <= 0 || arguments[0] === undefined ? process.cwd() : arguments[0];
    return new ConfigCLI(dir);
});

Commander.command('run').alias('r').action((0, _bluebird.coroutine)(regeneratorRuntime.mark(function _callee2() {
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

Commander.command('stop [isAll]').alias('s').action((function () {
    var _this2 = this;

    var ref = (0, _bluebird.coroutine)(regeneratorRuntime.mark(function _callee3() {
        var isAll = _arguments.length <= 0 || _arguments[0] === undefined ? false : _arguments[0];
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
        }, _callee3, _this2);
    }));
    return function (_x3) {
        return ref.apply(this, arguments);
    };
})());

Commander.command('sa').action((0, _bluebird.coroutine)(regeneratorRuntime.mark(function _callee4() {
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

Commander.command('log [type]').alias('l').action(function () {
    var type = arguments.length <= 0 || arguments[0] === undefined ? 's' : arguments[0];

    if (type in logValues) {
        (function () {
            var date = Moment().format('YYYY/MM/DD'),
                tail = new Tail('/tmp/log/nest-' + type + 'erver/' + date + '.log');

            tail.on('line', function (data) {
                return log(data);
            }).on('error', function () {
                return tail.unwatch();
            });
        })();
    } else {
        log('log 只接受 s/js 两个参数', 'error');
    }
});

Commander.command('lo').action(function () {
    var date = Moment().format('YYYY/MM/');

    Open('/tmp/log/nest-server/' + date, 'finder');
});

Commander.command('ls').action(function () {
    return WorkSpaceCLI.list();
});

Commander.parse(process.argv);

Update.check();
//# sourceMappingURL=data:application/json;base64,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LDJCQUEwQixJQUFJLEVBQUksUUFBUSxDQUFFLENBQUE7Q0FDbkQsQ0FBRSxDQUFBOztBQUVQLFNBQVMsQ0FDSixPQUFPLENBQUUsSUFBSSxDQUFFLENBQ2YsTUFBTSxDQUFFO1dBQU0sWUFBWSxDQUFDLElBQUksRUFBRTtDQUFBLENBQUUsQ0FBQTs7QUFFeEMsU0FBUyxDQUFDLEtBQUssQ0FBRSxPQUFPLENBQUMsSUFBSSxDQUFFLENBQUE7O0FBRS9CLE1BQU0sQ0FBQyxLQUFLLEVBQUUsQ0FBQSIsImZpbGUiOiJpbmRleC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogY29tbWFuZHM6XG4gKiAgc2V0dXBcbiAqICAgICAg5Zyo5b2T5YmN55uu5b2V5LiL6I635Y+WXG4gKiAgY29uZmlnKGMpXG4gKiAgcnVuKHIpXG4gKiAgc3RvcChzKVxuICovXG5cbnJlcXVpcmUoICdiYWJlbC1wb2x5ZmlsbCcgKVxucmVxdWlyZSggJy4vbG9nJyApXG5yZXF1aXJlKCAnLi9wcm9maWxlJyApXG5cbmxldCBDb21tYW5kZXIgICAgICAgICAgPSByZXF1aXJlKCAnY29tbWFuZGVyJyApLFxuICAgIE1vbWVudCAgICAgICAgICAgICA9IHJlcXVpcmUoICdtb21lbnQnICksXG4gICAgT3BlbiAgICAgICAgICAgICAgID0gcmVxdWlyZSggJ29wZW4nICksXG4gICAgVGFpbCAgICAgICAgICAgICAgID0gcmVxdWlyZSggJ3RhaWwnICkuVGFpbCxcbiAgICBDb25maWdDTEkgICAgICAgICAgPSByZXF1aXJlKCAnLi9jbGkvY29uZmlnJyApLFxuICAgIFNldHVwQ0xJICAgICAgICAgICA9IHJlcXVpcmUoICcuL2NsaS9zZXR1cCcgKSxcbiAgICBXb3JrU3BhY2VDTEkgICAgICAgPSByZXF1aXJlKCAnLi9jbGkvd29ya3NwYWNlJyApLFxuICAgIFdvcmtTcGFjZSAgICAgICAgICA9IHJlcXVpcmUoICcuL2NvcmUvd29ya3NwYWNlJyApLFxuICAgIFVwZGF0ZSAgICAgICAgICAgICA9IHJlcXVpcmUoICcuL3VwZGF0ZScgKSxcbiAgICBwa2cgICAgICAgICAgICAgICAgPSByZXF1aXJlKCAnLi4vcGFja2FnZS5qc29uJyApLFxuICAgIGxvZ1ZhbHVlcyAgICAgICAgICA9IHsgJ3MnOiAxLCAnanMnOiAxIH0sXG5cbiAgICBmaW5kVmFsaWRXb3Jrc3BhY2UgPSBhc3luYyBkaXIgPT4ge1xuICAgICAgICBsZXQgaXNWYWxpZCA9IGF3YWl0IFdvcmtTcGFjZS5pc1ZhbGlkV29ya1NwYWNlKCBkaXIgKVxuXG4gICAgICAgIGlmICggIWlzVmFsaWQgKSB7XG4gICAgICAgICAgICBkaXIgICAgID0gV29ya1NwYWNlLmN1cnJlbnQoKVxuICAgICAgICAgICAgaXNWYWxpZCA9IGF3YWl0IFdvcmtTcGFjZS5pc1ZhbGlkV29ya1NwYWNlKCBkaXIgKVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCBpc1ZhbGlkICkge1xuICAgICAgICAgICAgcmV0dXJuIHsgaXNWYWxpZCwgZGlyIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGxvZyggJ+aXoOazleaJvuWIsOWPr+i/kOihjOeahOW3peS9nOepuumXtCcsICdlcnJvcicgKVxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yXG4gICAgICAgIH1cbiAgICB9XG5cbkNvbW1hbmRlclxuICAgIC52ZXJzaW9uKCBwa2cudmVyc2lvbiwgJy12LCAtLXZlcnNpb24nIClcblxuQ29tbWFuZGVyXG4gICAgLmNvbW1hbmQoICdzZXR1cCBbZGlyXSBbdXJsXScgKVxuICAgIC5hY3Rpb24oICggZGlyLCB1cmwgKSAgPT4gbmV3IFNldHVwQ0xJKCBkaXIgfHwgJycsIHVybCB8fCAnJyApIClcblxuQ29tbWFuZGVyXG4gICAgLmNvbW1hbmQoICdjb25maWcgW2Rpcl0nIClcbiAgICAuYWxpYXMoICdjJyApXG4gICAgLmFjdGlvbiggKCBkaXIgPSBwcm9jZXNzLmN3ZCgpICkgID0+IG5ldyBDb25maWdDTEkoIGRpciApIClcblxuQ29tbWFuZGVyXG4gICAgLmNvbW1hbmQoICdydW4nIClcbiAgICAuYWxpYXMoICdyJyApXG4gICAgLmFjdGlvbiggYXN5bmMgKCkgPT4ge1xuICAgICAgICBsZXQgcmVzdWx0ID0gYXdhaXQgZmluZFZhbGlkV29ya3NwYWNlKCBwcm9jZXNzLmN3ZCgpIClcbiAgICAgICAgbmV3IFdvcmtTcGFjZSggcmVzdWx0LmRpciApLnN0YXJ0KClcbiAgICB9IClcblxuQ29tbWFuZGVyXG4gICAgLmNvbW1hbmQoICdzdG9wIFtpc0FsbF0nIClcbiAgICAuYWxpYXMoICdzJyApXG4gICAgLmFjdGlvbiggYXN5bmMgKCBpc0FsbCA9IGZhbHNlICkgPT4ge1xuICAgICAgICBsZXQgcmVzdWx0ID0gYXdhaXQgZmluZFZhbGlkV29ya3NwYWNlKCBwcm9jZXNzLmN3ZCgpIClcbiAgICAgICAgbmV3IFdvcmtTcGFjZSggcmVzdWx0LmRpciApLnN0b3AoIGlzQWxsIClcbiAgICB9IClcblxuQ29tbWFuZGVyXG4gICAgLmNvbW1hbmQoICdzYScgKVxuICAgIC5hY3Rpb24oIGFzeW5jICgpID0+IHtcbiAgICAgICAgbGV0IHJlc3VsdCA9IGF3YWl0IGZpbmRWYWxpZFdvcmtzcGFjZSggcHJvY2Vzcy5jd2QoKSApXG4gICAgICAgIG5ldyBXb3JrU3BhY2UoIHJlc3VsdC5kaXIgKS5zdG9wKCAnYWxsJyApXG4gICAgfSApXG5cbkNvbW1hbmRlclxuICAgIC5jb21tYW5kKCAnbG9nIFt0eXBlXScgKVxuICAgIC5hbGlhcyggJ2wnIClcbiAgICAuYWN0aW9uKCAoIHR5cGUgPSAncycgKSA9PiB7XG4gICAgICAgIGlmICggdHlwZSBpbiBsb2dWYWx1ZXMgKSB7XG4gICAgICAgICAgICBsZXQgZGF0ZSA9IE1vbWVudCgpLmZvcm1hdCggJ1lZWVkvTU0vREQnICksXG4gICAgICAgICAgICAgICAgdGFpbCA9IG5ldyBUYWlsKCBgL3RtcC9sb2cvbmVzdC0ke3R5cGV9ZXJ2ZXIvJHtkYXRlfS5sb2dgIClcblxuICAgICAgICAgICAgdGFpbFxuICAgICAgICAgICAgICAgIC5vbiggJ2xpbmUnLCBkYXRhID0+IGxvZyggZGF0YSApIClcbiAgICAgICAgICAgICAgICAub24oICdlcnJvcicsICgpID0+IHRhaWwudW53YXRjaCgpIClcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGxvZyggJ2xvZyDlj6rmjqXlj5cgcy9qcyDkuKTkuKrlj4LmlbAnLCAnZXJyb3InIClcbiAgICAgICAgfVxuICAgIH0gKVxuXG5Db21tYW5kZXJcbiAgICAuY29tbWFuZCggJ2xvJyApXG4gICAgLmFjdGlvbiggKCkgPT4ge1xuICAgICAgICBsZXQgZGF0ZSA9IE1vbWVudCgpLmZvcm1hdCggJ1lZWVkvTU0vJyApXG5cbiAgICAgICAgT3BlbiggYC90bXAvbG9nL25lc3Qtc2VydmVyLyR7ZGF0ZX1gLCAnZmluZGVyJyApXG4gICAgfSApXG5cbkNvbW1hbmRlclxuICAgIC5jb21tYW5kKCAnbHMnIClcbiAgICAuYWN0aW9uKCAoKSA9PiBXb3JrU3BhY2VDTEkubGlzdCgpIClcblxuQ29tbWFuZGVyLnBhcnNlKCBwcm9jZXNzLmFyZ3YgKVxuXG5VcGRhdGUuY2hlY2soKVxuIl19