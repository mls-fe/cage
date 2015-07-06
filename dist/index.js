/**
 * commands:
 *  setup
 *      在当前目录下获取
 *  config(c)
 *  run(r)
 *  stop(s)
 */

'use strict';

var _bluebird = require('bluebird');

require('./log');
require('./profile');

var Commander = require('commander'),
    Moment = require('moment'),
    Tail = require('tail').Tail,
    ConfigCLI = require('./cli/config'),
    SetupCLI = require('./cli/setup'),
    WorkSpaceCLI = require('./cli/workspace'),
    WorkSpace = require('./core/workspace'),
    Update = require('./update'),
    pkg = require('../package.json'),
    logValues = { 's': 1, 'js': 1 },
    findValidWorkspace = _bluebird.coroutine(function* (dir) {
    var isValid = yield WorkSpace.isValidWorkSpace(dir);

    if (!isValid) {
        dir = WorkSpace.current();
        isValid = yield WorkSpace.isValidWorkSpace(dir);
    }

    if (isValid) {
        return { isValid: isValid, dir: dir };
    } else {
        log('无法找到可运行的工作空间', 'error');
        throw new Error();
    }
});

Commander.version(pkg.version, '-v, --version');

Commander.command('setup').action(function () {
    return new SetupCLI();
});

Commander.command('config [dir]').alias('c').action(function () {
    var dir = arguments[0] === undefined ? process.cwd() : arguments[0];
    return new ConfigCLI(dir);
});

Commander.command('run').alias('r').action(function () {
    var result = findValidWorkspace(process.cwd());
    new WorkSpace(result.dir).start();
});

Commander.command('stop [isAll]').alias('s').action(function () {
    var isAll = arguments[0] === undefined ? false : arguments[0];

    var result = findValidWorkspace(process.cwd());
    new WorkSpace(result.dir).stop(isAll);
});

Commander.command('log [type]').action(function () {
    var type = arguments[0] === undefined ? 's' : arguments[0];

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

Commander.command('ls').action(function () {
    return WorkSpaceCLI.list();
});

Commander.parse(process.argv);

Update.check();
//# sourceMappingURL=data:application/json;base64,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QWhCLElBQUksZ0NBQUcsR0FBRzs7QUFDakIsUUFBSyxJQUFJLElBQUksU0FBUyxFQUFHOztBQUNyQixnQkFBSSxJQUFJLEdBQUcsTUFBTSxFQUFFLENBQUMsTUFBTSxDQUFFLFlBQVksQ0FBRTtnQkFDdEMsSUFBSSxHQUFHLElBQUksSUFBSSxvQkFBbUIsSUFBSSxjQUFTLElBQUksVUFBUSxDQUFBOztBQUUvRCxnQkFBSSxDQUNDLEVBQUUsQ0FBRSxNQUFNLEVBQUUsVUFBQSxJQUFJO3VCQUFJLEdBQUcsQ0FBRSxJQUFJLENBQUU7YUFBQSxDQUFFLENBQ2pDLEVBQUUsQ0FBRSxPQUFPLEVBQUU7dUJBQU0sSUFBSSxDQUFDLE9BQU8sRUFBRTthQUFBLENBQUUsQ0FBQTs7S0FDM0MsTUFBTTtBQUNILFdBQUcsQ0FBRSxtQkFBbUIsRUFBRSxPQUFPLENBQUUsQ0FBQTtLQUN0QztDQUNKLENBQUUsQ0FBQTs7QUFFUCxTQUFTLENBQ0osT0FBTyxDQUFFLElBQUksQ0FBRSxDQUNmLE1BQU0sQ0FBRTtXQUFNLFlBQVksQ0FBQyxJQUFJLEVBQUU7Q0FBQSxDQUFFLENBQUE7O0FBRXhDLFNBQVMsQ0FBQyxLQUFLLENBQUUsT0FBTyxDQUFDLElBQUksQ0FBRSxDQUFBOztBQUUvQixNQUFNLENBQUMsS0FBSyxFQUFFLENBQUEiLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIGNvbW1hbmRzOlxuICogIHNldHVwXG4gKiAgICAgIOWcqOW9k+WJjeebruW9leS4i+iOt+WPllxuICogIGNvbmZpZyhjKVxuICogIHJ1bihyKVxuICogIHN0b3AocylcbiAqL1xuXG5yZXF1aXJlKCAnLi9sb2cnIClcbnJlcXVpcmUoICcuL3Byb2ZpbGUnIClcblxubGV0IENvbW1hbmRlciAgICAgICAgICA9IHJlcXVpcmUoICdjb21tYW5kZXInICksXG4gICAgTW9tZW50ICAgICAgICAgICAgID0gcmVxdWlyZSggJ21vbWVudCcgKSxcbiAgICBUYWlsICAgICAgICAgICAgICAgPSByZXF1aXJlKCAndGFpbCcgKS5UYWlsLFxuICAgIENvbmZpZ0NMSSAgICAgICAgICA9IHJlcXVpcmUoICcuL2NsaS9jb25maWcnICksXG4gICAgU2V0dXBDTEkgICAgICAgICAgID0gcmVxdWlyZSggJy4vY2xpL3NldHVwJyApLFxuICAgIFdvcmtTcGFjZUNMSSAgICAgICA9IHJlcXVpcmUoICcuL2NsaS93b3Jrc3BhY2UnICksXG4gICAgV29ya1NwYWNlICAgICAgICAgID0gcmVxdWlyZSggJy4vY29yZS93b3Jrc3BhY2UnICksXG4gICAgVXBkYXRlICAgICAgICAgICAgID0gcmVxdWlyZSggJy4vdXBkYXRlJyApLFxuICAgIHBrZyAgICAgICAgICAgICAgICA9IHJlcXVpcmUoICcuLi9wYWNrYWdlLmpzb24nICksXG4gICAgbG9nVmFsdWVzICAgICAgICAgID0geyAncyc6IDEsICdqcyc6IDEgfSxcblxuICAgIGZpbmRWYWxpZFdvcmtzcGFjZSA9IGFzeW5jIGRpciA9PiB7XG4gICAgICAgIGxldCBpc1ZhbGlkID0gYXdhaXQgV29ya1NwYWNlLmlzVmFsaWRXb3JrU3BhY2UoIGRpciApXG5cbiAgICAgICAgaWYgKCAhaXNWYWxpZCApIHtcbiAgICAgICAgICAgIGRpciAgICAgPSBXb3JrU3BhY2UuY3VycmVudCgpXG4gICAgICAgICAgICBpc1ZhbGlkID0gYXdhaXQgV29ya1NwYWNlLmlzVmFsaWRXb3JrU3BhY2UoIGRpciApXG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIGlzVmFsaWQgKSB7XG4gICAgICAgICAgICByZXR1cm4geyBpc1ZhbGlkLCBkaXIgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbG9nKCAn5peg5rOV5om+5Yiw5Y+v6L+Q6KGM55qE5bel5L2c56m66Ze0JywgJ2Vycm9yJyApXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3JcbiAgICAgICAgfVxuICAgIH1cblxuQ29tbWFuZGVyXG4gICAgLnZlcnNpb24oIHBrZy52ZXJzaW9uLCAnLXYsIC0tdmVyc2lvbicgKVxuXG5Db21tYW5kZXJcbiAgICAuY29tbWFuZCggJ3NldHVwJyApXG4gICAgLmFjdGlvbiggKCkgID0+IG5ldyBTZXR1cENMSSApXG5cbkNvbW1hbmRlclxuICAgIC5jb21tYW5kKCAnY29uZmlnIFtkaXJdJyApXG4gICAgLmFsaWFzKCAnYycgKVxuICAgIC5hY3Rpb24oICggZGlyID0gcHJvY2Vzcy5jd2QoKSApICA9PiBuZXcgQ29uZmlnQ0xJKCBkaXIgKSApXG5cbkNvbW1hbmRlclxuICAgIC5jb21tYW5kKCAncnVuJyApXG4gICAgLmFsaWFzKCAncicgKVxuICAgIC5hY3Rpb24oICgpID0+IHtcbiAgICAgICAgbGV0IHJlc3VsdCA9IGZpbmRWYWxpZFdvcmtzcGFjZSggcHJvY2Vzcy5jd2QoKSApXG4gICAgICAgIG5ldyBXb3JrU3BhY2UoIHJlc3VsdC5kaXIgKS5zdGFydCgpXG4gICAgfSApXG5cbkNvbW1hbmRlclxuICAgIC5jb21tYW5kKCAnc3RvcCBbaXNBbGxdJyApXG4gICAgLmFsaWFzKCAncycgKVxuICAgIC5hY3Rpb24oICggaXNBbGwgPSBmYWxzZSApID0+IHtcbiAgICAgICAgbGV0IHJlc3VsdCA9IGZpbmRWYWxpZFdvcmtzcGFjZSggcHJvY2Vzcy5jd2QoKSApXG4gICAgICAgIG5ldyBXb3JrU3BhY2UoIHJlc3VsdC5kaXIgKS5zdG9wKCBpc0FsbCApXG4gICAgfSApXG5cbkNvbW1hbmRlclxuICAgIC5jb21tYW5kKCAnbG9nIFt0eXBlXScgKVxuICAgIC5hY3Rpb24oICggdHlwZSA9ICdzJyApID0+IHtcbiAgICAgICAgaWYgKCB0eXBlIGluIGxvZ1ZhbHVlcyApIHtcbiAgICAgICAgICAgIGxldCBkYXRlID0gTW9tZW50KCkuZm9ybWF0KCAnWVlZWS9NTS9ERCcgKSxcbiAgICAgICAgICAgICAgICB0YWlsID0gbmV3IFRhaWwoIGAvdG1wL2xvZy9uZXN0LSR7dHlwZX1lcnZlci8ke2RhdGV9LmxvZ2AgKVxuXG4gICAgICAgICAgICB0YWlsXG4gICAgICAgICAgICAgICAgLm9uKCAnbGluZScsIGRhdGEgPT4gbG9nKCBkYXRhICkgKVxuICAgICAgICAgICAgICAgIC5vbiggJ2Vycm9yJywgKCkgPT4gdGFpbC51bndhdGNoKCkgKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbG9nKCAnbG9nIOWPquaOpeWPlyBzL2pzIOS4pOS4quWPguaVsCcsICdlcnJvcicgKVxuICAgICAgICB9XG4gICAgfSApXG5cbkNvbW1hbmRlclxuICAgIC5jb21tYW5kKCAnbHMnIClcbiAgICAuYWN0aW9uKCAoKSA9PiBXb3JrU3BhY2VDTEkubGlzdCgpIClcblxuQ29tbWFuZGVyLnBhcnNlKCBwcm9jZXNzLmFyZ3YgKVxuXG5VcGRhdGUuY2hlY2soKVxuIl19