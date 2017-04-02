'use strict';

var _bluebird = require('bluebird');

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ChildProcess = require('child_process'),
    Spawn = ChildProcess.spawn,
    Exec = ChildProcess.exec,
    FS = require('fs'),
    Util = require('../util');

var DIR_APPS = '/apps',
    DIR_NEST = '/nest',
    DIR_TMP = `${DIR_NEST}/tmp`,
    DEPENDENCIES = ['less@1.3.3', 'uglify-js@1.2.6'];

var phases = [{
    name: 'Nest',
    url: 'http://svn.meilishuo.com/repos/meilishuo/fex/hornbill_nest/trunk/',
    dir: DIR_NEST
}, {
    name: 'Apps',
    url: 'http://svn.meilishuo.com/repos/meilishuo/fex/user/trunk/',
    dir: DIR_APPS
}];

function mkdir(path) {
    return new Promise(function (resolve, reject) {
        FS.mkdir(path, function (err) {
            err ? reject() : resolve();
        });
    });
}

var Setup = function () {
    function Setup() {
        _classCallCheck(this, Setup);
    }

    _createClass(Setup, [{
        key: 'init',
        value: function init(path) {
            this._path = path;
            return mkdir(path);
        }
    }, {
        key: 'checkoutSource',
        value: function () {
            var _ref = (0, _bluebird.coroutine)(regeneratorRuntime.mark(function _callee3(username, password, appSvnUrl) {
                var _this = this;

                return regeneratorRuntime.wrap(function _callee3$(_context3) {
                    while (1) {
                        switch (_context3.prev = _context3.next) {
                            case 0:
                                _context3.next = 2;
                                return Promise.all(phases.map(function () {
                                    var _ref2 = (0, _bluebird.coroutine)(regeneratorRuntime.mark(function _callee(phaseObj) {
                                        var name, path;
                                        return regeneratorRuntime.wrap(function _callee$(_context) {
                                            while (1) {
                                                switch (_context.prev = _context.next) {
                                                    case 0:
                                                        name = void 0, path = void 0;


                                                        if (appSvnUrl && phaseObj.name == 'Apps') {
                                                            phaseObj.url = appSvnUrl;
                                                        }

                                                        name = phaseObj.name;
                                                        path = _this._path + phaseObj.dir;
                                                        log(`\n初始化 ${name} 文件夹`);
                                                        _context.next = 7;
                                                        return mkdir(path);

                                                    case 7:
                                                        return _context.abrupt('return', new Promise(function (resolve, reject) {
                                                            Util.indicator.start();
                                                            var args = ['checkout', phaseObj.url, path, '--username', username, '--password', password],
                                                                client = void 0;

                                                            client = Spawn('svn', args, {});

                                                            client.on('err', function (err) {
                                                                Util.indicator.stop();
                                                                log(`${name} 设置失败!`, 'error');
                                                                log(err, 'info');
                                                                reject();
                                                            });

                                                            client.on('exit', function () {
                                                                Util.indicator.stop();
                                                                log(`${name} 设置成功!`, 'success');
                                                                resolve();
                                                            });
                                                        }));

                                                    case 8:
                                                    case 'end':
                                                        return _context.stop();
                                                }
                                            }
                                        }, _callee, _this);
                                    }));

                                    return function (_x4) {
                                        return _ref2.apply(this, arguments);
                                    };
                                }())).then((0, _bluebird.coroutine)(regeneratorRuntime.mark(function _callee2() {
                                    return regeneratorRuntime.wrap(function _callee2$(_context2) {
                                        while (1) {
                                            switch (_context2.prev = _context2.next) {
                                                case 0:
                                                    log('创建 tmp 文件夹');
                                                    _context2.next = 3;
                                                    return mkdir(_this._path + DIR_TMP);

                                                case 3:
                                                    return _context2.abrupt('return', _this.installDependencies());

                                                case 4:
                                                case 'end':
                                                    return _context2.stop();
                                            }
                                        }
                                    }, _callee2, _this);
                                })));

                            case 2:
                                return _context3.abrupt('return', _context3.sent);

                            case 3:
                            case 'end':
                                return _context3.stop();
                        }
                    }
                }, _callee3, this);
            }));

            function checkoutSource(_x, _x2, _x3) {
                return _ref.apply(this, arguments);
            }

            return checkoutSource;
        }()
    }, {
        key: 'installDependencies',
        value: function () {
            var _ref4 = (0, _bluebird.coroutine)(regeneratorRuntime.mark(function _callee4() {
                var deptPath;
                return regeneratorRuntime.wrap(function _callee4$(_context4) {
                    while (1) {
                        switch (_context4.prev = _context4.next) {
                            case 0:
                                deptPath = this._path + DIR_NEST;


                                log('安装 less 与 uglify-js');
                                Util.indicator.start();

                                return _context4.abrupt('return', new Promise(function (resolve) {
                                    var command = `cd ${deptPath} && npm install ${DEPENDENCIES.join(' ')} 	--registry=https://registry.npm.taobao.org`;
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
                                }));

                            case 4:
                            case 'end':
                                return _context4.stop();
                        }
                    }
                }, _callee4, this);
            }));

            function installDependencies() {
                return _ref4.apply(this, arguments);
            }

            return installDependencies;
        }()
    }, {
        key: 'error',
        value: function error(msg) {
            Util.indicator.stop();
            log('下载源码失败，以下为 svn 打印的错误消息', 'error');
            log(msg);
        }
    }]);

    return Setup;
}();

module.exports = Setup;