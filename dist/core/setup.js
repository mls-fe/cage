'use strict';

var _bluebird = require('bluebird');

let ChildProcess = require('child_process'),
    Spawn = ChildProcess.spawn,
    Exec = ChildProcess.exec,
    FS = require('fs'),
    Util = require('../util');

const DIR_APPS = '/apps',
      DIR_NEST = '/nest',
      DIR_TMP = `${ DIR_NEST }/tmp`,
      DEPENDENCIES = ['less@1.3.3', 'uglify-js@1.2.6'];

let phases = [{
    name: 'Nest',
    url: 'http://svn.meilishuo.com/repos/meilishuo/fex/hornbill_nest/trunk/',
    dir: DIR_NEST
}, {
    name: 'Apps',
    url: 'http://svn.meilishuo.com/repos/meilishuo/fex/user/trunk/',
    dir: DIR_APPS
}];

function mkdir(path) {
    return new Promise((resolve, reject) => {
        FS.mkdir(path, err => {
            err ? reject() : resolve();
        });
    });
}

class Setup {
    init(path) {
        this._path = path;
        return mkdir(path);
    }

    checkoutSource(username, password, appSvnUrl) {
        var _this = this;

        return (0, _bluebird.coroutine)(function* () {
            return yield Promise.all(phases.map((() => {
                var ref = (0, _bluebird.coroutine)(function* (phaseObj) {
                    let name, path;

                    if (appSvnUrl && phaseObj.name == 'Apps') {
                        phaseObj.url = appSvnUrl;
                    }

                    name = phaseObj.name;
                    path = _this._path + phaseObj.dir;
                    log(`\n初始化 ${ name } 文件夹`);
                    yield mkdir(path);

                    return new Promise(function (resolve, reject) {
                        Util.indicator.start();
                        let args = ['checkout', phaseObj.url, path, '--username', username, '--password', password],
                            client;

                        client = Spawn('svn', args, {});

                        client.on('err', function (err) {
                            Util.indicator.stop();
                            log(`${ name } 设置失败!`, 'error');
                            log(err, 'info');
                            reject();
                        });

                        client.on('exit', function () {
                            Util.indicator.stop();
                            log(`${ name } 设置成功!`, 'success');
                            resolve();
                        });
                    });
                });
                return function (_x) {
                    return ref.apply(this, arguments);
                };
            })())).then((0, _bluebird.coroutine)(function* () {
                log('创建 tmp 文件夹');
                yield mkdir(_this._path + DIR_TMP);
                return _this.installDependencies();
            }));
        })();
    }

    installDependencies() {
        var _this2 = this;

        return (0, _bluebird.coroutine)(function* () {
            let deptPath = _this2._path + DIR_NEST;

            log('安装 less 与 uglify-js');
            Util.indicator.start();

            return new Promise(function (resolve) {
                let command = `cd ${ deptPath } && npm install ${ DEPENDENCIES.join(' ') } 	--registry=https://registry.npm.taobao.org`;
                log(command, 'debug');
                Exec(command, function (err, stdout) {
                    Util.indicator.stop();

                    if (err) {
                        log(err, 'error');
                        log('\n依赖库安装失败!', 'error');
                    } else {
                        log(stdout, 'info');
                        log('\n依赖库安装成功!', 'success');
                        resolve();
                    }
                }).stdout.pipe(process.stdout);
            });
        })();
    }

    error(msg) {
        Util.indicator.stop();
        log('下载源码失败，以下为 svn 打印的错误消息', 'error');
        log(msg);
    }
}

module.exports = Setup;