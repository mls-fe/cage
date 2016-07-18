'use strict';

var _bluebird = require('bluebird');

require('./log');
require('./profile');

let Commander = require('commander'),
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
    findValidWorkspace = (() => {
    var ref = (0, _bluebird.coroutine)(function* (dir) {
        let isValid = yield WorkSpace.isValidWorkSpace(dir);

        if (!isValid) {
            dir = WorkSpace.current();
            isValid = yield WorkSpace.isValidWorkSpace(dir);
        }

        if (isValid) {
            return { isValid, dir };
        } else {
            log('无法找到可运行的工作空间', 'error');
            throw new Error();
        }
    });
    return function findValidWorkspace(_x) {
        return ref.apply(this, arguments);
    };
})(),
    update = (() => {
    var ref = (0, _bluebird.coroutine)(function* () {
        let config = new Config(WorkSpace.current()),
            isIPChange = yield config.isIPChange();

        config.setPortOption(Key.random);
        yield config.updateProxy();
        log('端口更新成功', 'success');

        if (isIPChange) {
            let result = yield config.updateIP();
            result && log('ip 更新成功', 'success');
        } else {
            log('ip 无变化, 不需要更新');
        }

        let result = yield findValidWorkspace(process.cwd());
        new WorkSpace(result.dir).start();
    });
    return function update() {
        return ref.apply(this, arguments);
    };
})();

Commander.version(pkg.version, '-v, --version');

Commander.command('setup [dir] [url]').description('在 dir 文件夹下生成环境').action(function () {
    let dir = arguments.length <= 0 || arguments[0] === undefined ? '' : arguments[0];
    let url = arguments.length <= 1 || arguments[1] === undefined ? '' : arguments[1];
    return new SetupCLI(dir, url);
});

Commander.command('config [dir]').description('配置环境').alias('c').action(function () {
    let dir = arguments.length <= 0 || arguments[0] === undefined ? process.cwd() : arguments[0];
    return new ConfigCLI(dir);
});

Commander.command('run').description('运行服务').alias('r').action((0, _bluebird.coroutine)(function* () {
    let result = yield findValidWorkspace(process.cwd());
    new WorkSpace(result.dir).start();
}));

Commander.command('stop [isAll]').description('停止服务').alias('s').action((() => {
    var ref = (0, _bluebird.coroutine)(function* () {
        let isAll = arguments.length <= 0 || arguments[0] === undefined ? false : arguments[0];

        let result = yield findValidWorkspace(process.cwd());
        new WorkSpace(result.dir).stop(isAll);
    });
    return function (_x5) {
        return ref.apply(this, arguments);
    };
})());

Commander.command('sa').description('停止所有服务').action((0, _bluebird.coroutine)(function* () {
    let result = yield findValidWorkspace(process.cwd());
    new WorkSpace(result.dir).stop('all');
}));

Commander.command('log [type]').description('显示日志').alias('l').action((() => {
    var ref = (0, _bluebird.coroutine)(function* () {
        let type = arguments.length <= 0 || arguments[0] === undefined ? 's' : arguments[0];

        if (type in logValues) {
            let displayLog = function () {
                let client = Exec(`tail -f ${ filepath }`).on('error', function (err) {
                    return log(err, 'error');
                });

                client.stdout.pipe(process.stdout);
            };
            let filepath = `/tmp/log/nest-${ type }erver/${ Util.getFormatDate() }.log`,
                isExist = yield Util.checkFileExist(filepath);

            if (isExist) {
                displayLog();
            } else {
                log('日志文件不存在, 正在重启 whornbill 服务...', 'warn');
                let result = yield findValidWorkspace(process.cwd());
                new WorkSpace(result.dir).start(false).then(displayLog);
            }
        } else {
            log('log 只接受 s/js 两个参数', 'error');
        }
    });
    return function (_x7) {
        return ref.apply(this, arguments);
    };
})());

Commander.command('lo').description('打开日志所在位置').action(() => {
    Exec('open -a finder "/tmp/log/nest-server/"').on('error', err => log(err, 'error'));
});

Commander.command('ls').description('显示工作空间列表').action(() => {
    WorkSpaceCLI.list(() => {
        update();
    });
});

Commander.command('ip').description('显示本机 IP 地址').action((0, _bluebird.coroutine)(function* () {
    var ip = yield Util.getIP();
    log(ip);
}));

Commander.command('mac').description('显示本机 Mac 地址').action((0, _bluebird.coroutine)(function* () {
    var mac = yield Util.getMac();
    log(mac);
}));

Commander.command('update').description('更新环境配置').alias('u').action(update);

Commander.command('hostlist').description('显示你配置过的域名列表').action((0, _bluebird.coroutine)(function* () {
    var mac = yield Util.getMac(),
        result = yield Request('hostlist?ukey=' + mac),
        display = '';

    if (result) {
        result.data.forEach(function (data) {
            display += `
${ data.host }
    id: ${ data.id }
    ip: ${ data.ip }
    port: ${ data.port }
    ukey: ${ data.ukey }
                `;
        });
        log(display);
    }
}));

Commander.parse(process.argv);