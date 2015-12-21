'use strict';

var _arguments = arguments;

var _bluebird = require('bluebird');

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
//# sourceMappingURL=data:application/json;base64,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SSwyQkFBMEIsSUFBSSxFQUFJLFFBQVEsQ0FBRSxDQUFBO0NBQ25ELENBQUUsQ0FBQTs7QUFFUCxTQUFTLENBQ0osT0FBTyxDQUFFLElBQUksQ0FBRSxDQUNmLE1BQU0sQ0FBRTtXQUFNLFlBQVksQ0FBQyxJQUFJLEVBQUU7Q0FBQSxDQUFFLENBQUE7O0FBRXhDLFNBQVMsQ0FBQyxLQUFLLENBQUUsT0FBTyxDQUFDLElBQUksQ0FBRSxDQUFBOztBQUUvQixNQUFNLENBQUMsS0FBSyxFQUFFLENBQUEiLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIGNvbW1hbmRzOlxuICogIHNldHVwXG4gKiAgICAgIOWcqOW9k+WJjeebruW9leS4i+iOt+WPllxuICogIGNvbmZpZyhjKVxuICogIHJ1bihyKVxuICogIHN0b3AocylcbiAqL1xuXG5yZXF1aXJlKCAnYmFiZWwtcG9seWZpbGwnIClcbnJlcXVpcmUoICcuL2xvZycgKVxucmVxdWlyZSggJy4vcHJvZmlsZScgKVxuXG5sZXQgQ29tbWFuZGVyICAgICAgICAgID0gcmVxdWlyZSggJ2NvbW1hbmRlcicgKSxcbiAgICBNb21lbnQgICAgICAgICAgICAgPSByZXF1aXJlKCAnbW9tZW50JyApLFxuICAgIE9wZW4gICAgICAgICAgICAgICA9IHJlcXVpcmUoICdvcGVuJyApLFxuICAgIFRhaWwgICAgICAgICAgICAgICA9IHJlcXVpcmUoICd0YWlsJyApLlRhaWwsXG4gICAgQ29uZmlnQ0xJICAgICAgICAgID0gcmVxdWlyZSggJy4vY2xpL2NvbmZpZycgKSxcbiAgICBTZXR1cENMSSAgICAgICAgICAgPSByZXF1aXJlKCAnLi9jbGkvc2V0dXAnICksXG4gICAgV29ya1NwYWNlQ0xJICAgICAgID0gcmVxdWlyZSggJy4vY2xpL3dvcmtzcGFjZScgKSxcbiAgICBXb3JrU3BhY2UgICAgICAgICAgPSByZXF1aXJlKCAnLi9jb3JlL3dvcmtzcGFjZScgKSxcbiAgICBVcGRhdGUgICAgICAgICAgICAgPSByZXF1aXJlKCAnLi91cGRhdGUnICksXG4gICAgcGtnICAgICAgICAgICAgICAgID0gcmVxdWlyZSggJy4uL3BhY2thZ2UuanNvbicgKSxcbiAgICBsb2dWYWx1ZXMgICAgICAgICAgPSB7ICdzJzogMSwgJ2pzJzogMSB9LFxuXG4gICAgZmluZFZhbGlkV29ya3NwYWNlID0gYXN5bmMgZGlyID0+IHtcbiAgICAgICAgbGV0IGlzVmFsaWQgPSBhd2FpdCBXb3JrU3BhY2UuaXNWYWxpZFdvcmtTcGFjZSggZGlyIClcblxuICAgICAgICBpZiAoICFpc1ZhbGlkICkge1xuICAgICAgICAgICAgZGlyICAgICA9IFdvcmtTcGFjZS5jdXJyZW50KClcbiAgICAgICAgICAgIGlzVmFsaWQgPSBhd2FpdCBXb3JrU3BhY2UuaXNWYWxpZFdvcmtTcGFjZSggZGlyIClcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICggaXNWYWxpZCApIHtcbiAgICAgICAgICAgIHJldHVybiB7IGlzVmFsaWQsIGRpciB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBsb2coICfml6Dms5Xmib7liLDlj6/ov5DooYznmoTlt6XkvZznqbrpl7QnLCAnZXJyb3InIClcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvclxuICAgICAgICB9XG4gICAgfVxuXG5Db21tYW5kZXJcbiAgICAudmVyc2lvbiggcGtnLnZlcnNpb24sICctdiwgLS12ZXJzaW9uJyApXG5cbkNvbW1hbmRlclxuICAgIC5jb21tYW5kKCAnc2V0dXAgW2Rpcl0gW3VybF0nIClcbiAgICAuYWN0aW9uKCAoIGRpciwgdXJsICkgID0+IG5ldyBTZXR1cENMSSggZGlyIHx8ICcnLCB1cmwgfHwgJycgKSApXG5cbkNvbW1hbmRlclxuICAgIC5jb21tYW5kKCAnY29uZmlnIFtkaXJdJyApXG4gICAgLmFsaWFzKCAnYycgKVxuICAgIC5hY3Rpb24oICggZGlyID0gcHJvY2Vzcy5jd2QoKSApICA9PiBuZXcgQ29uZmlnQ0xJKCBkaXIgKSApXG5cbkNvbW1hbmRlclxuICAgIC5jb21tYW5kKCAncnVuJyApXG4gICAgLmFsaWFzKCAncicgKVxuICAgIC5hY3Rpb24oIGFzeW5jICgpID0+IHtcbiAgICAgICAgbGV0IHJlc3VsdCA9IGF3YWl0IGZpbmRWYWxpZFdvcmtzcGFjZSggcHJvY2Vzcy5jd2QoKSApXG4gICAgICAgIG5ldyBXb3JrU3BhY2UoIHJlc3VsdC5kaXIgKS5zdGFydCgpXG4gICAgfSApXG5cbkNvbW1hbmRlclxuICAgIC5jb21tYW5kKCAnc3RvcCBbaXNBbGxdJyApXG4gICAgLmFsaWFzKCAncycgKVxuICAgIC5hY3Rpb24oIGFzeW5jICggaXNBbGwgPSBmYWxzZSApID0+IHtcbiAgICAgICAgbGV0IHJlc3VsdCA9IGF3YWl0IGZpbmRWYWxpZFdvcmtzcGFjZSggcHJvY2Vzcy5jd2QoKSApXG4gICAgICAgIG5ldyBXb3JrU3BhY2UoIHJlc3VsdC5kaXIgKS5zdG9wKCBpc0FsbCApXG4gICAgfSApXG5cbkNvbW1hbmRlclxuICAgIC5jb21tYW5kKCAnc2EnIClcbiAgICAuYWN0aW9uKCBhc3luYyAoKSA9PiB7XG4gICAgICAgIGxldCByZXN1bHQgPSBhd2FpdCBmaW5kVmFsaWRXb3Jrc3BhY2UoIHByb2Nlc3MuY3dkKCkgKVxuICAgICAgICBuZXcgV29ya1NwYWNlKCByZXN1bHQuZGlyICkuc3RvcCggJ2FsbCcgKVxuICAgIH0gKVxuXG5Db21tYW5kZXJcbiAgICAuY29tbWFuZCggJ2xvZyBbdHlwZV0nIClcbiAgICAuYWxpYXMoICdsJyApXG4gICAgLmFjdGlvbiggKCB0eXBlID0gJ3MnICkgPT4ge1xuICAgICAgICBpZiAoIHR5cGUgaW4gbG9nVmFsdWVzICkge1xuICAgICAgICAgICAgbGV0IGRhdGUgPSBNb21lbnQoKS5mb3JtYXQoICdZWVlZL01NL0REJyApLFxuICAgICAgICAgICAgICAgIHRhaWwgPSBuZXcgVGFpbCggYC90bXAvbG9nL25lc3QtJHt0eXBlfWVydmVyLyR7ZGF0ZX0ubG9nYCApXG5cbiAgICAgICAgICAgIHRhaWxcbiAgICAgICAgICAgICAgICAub24oICdsaW5lJywgZGF0YSA9PiBsb2coIGRhdGEgKSApXG4gICAgICAgICAgICAgICAgLm9uKCAnZXJyb3InLCAoKSA9PiB0YWlsLnVud2F0Y2goKSApXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBsb2coICdsb2cg5Y+q5o6l5Y+XIHMvanMg5Lik5Liq5Y+C5pWwJywgJ2Vycm9yJyApXG4gICAgICAgIH1cbiAgICB9IClcblxuQ29tbWFuZGVyXG4gICAgLmNvbW1hbmQoICdsbycgKVxuICAgIC5hY3Rpb24oICgpID0+IHtcbiAgICAgICAgbGV0IGRhdGUgPSBNb21lbnQoKS5mb3JtYXQoICdZWVlZL01NLycgKVxuXG4gICAgICAgIE9wZW4oIGAvdG1wL2xvZy9uZXN0LXNlcnZlci8ke2RhdGV9YCwgJ2ZpbmRlcicgKVxuICAgIH0gKVxuXG5Db21tYW5kZXJcbiAgICAuY29tbWFuZCggJ2xzJyApXG4gICAgLmFjdGlvbiggKCkgPT4gV29ya1NwYWNlQ0xJLmxpc3QoKSApXG5cbkNvbW1hbmRlci5wYXJzZSggcHJvY2Vzcy5hcmd2IClcblxuVXBkYXRlLmNoZWNrKClcbiJdfQ==