'use strict';

var _bluebird = require('bluebird');

var FS = require('fs'),
    Exec = require('child_process').exec,
    Request = require('./request'),
    Key = require('./key'),
    Const = require('./const'),
    count = 0,
    stdout = process.stdout,
    Cache = {},
    timeoutID = 0,
    Util = void 0,
    Indicator = void 0,
    ObjectAssign = void 0;

var ACTION_UPDATE = 'update?ukey=',
    MAC = Key.mac,
    IP = Key.ip;

ObjectAssign = Object.assign || function (target) {
    target = target || {};

    for (var _len = arguments.length, mixins = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        mixins[_key - 1] = arguments[_key];
    }

    mixins.forEach(function (obj) {
        for (var key in obj) {
            target[key] = obj[key];
        }
    });

    return target;
};

Indicator = {
    start() {
        var text = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'waiting';

        count = 0;
        clearTimeout(timeoutID);
        timeoutID = setInterval(function () {
            count = (count + 1) % 5;
            var dots = new Array(count).join('.');

            stdout.clearLine();
            stdout.cursorTo(0);
            stdout.write(text + dots);
        }, 300);
    },

    stop() {
        clearTimeout(timeoutID);
        stdout.clearLine();
        stdout.cursorTo(0);
    }
};

module.exports = Util = {
    indicator: Indicator,

    updateJSONFile(path, content) {
        return this.checkFileExist(path).then(function (isExist) {
            if (!isExist) {
                log(`${path} 文件不存在`, 'error');
                return Promise.reject(`${path} 文件不存在`);
            } else {
                try {
                    content = JSON.stringify(ObjectAssign({}, require(path), content), null, '  ');
                } catch (e) {
                    log(`读取 ${path} 文件错误, 原因为:`);
                    log(e, 'error');
                }

                return new Promise(function (resolve, reject) {
                    FS.writeFile(path, content, function (err) {
                        err ? reject() : resolve();
                    });
                });
            }
        }).catch(function (e) {
            return log(e, 'error');
        });
    },

    checkFileExist(path) {
        return new Promise(function (resolve) {
            FS.exists(path, function (isExist) {
                resolve(isExist);
            });
        });
    },

    getPort(basePath) {
        var _this = this;

        return (0, _bluebird.coroutine)(regeneratorRuntime.mark(function _callee() {
            return regeneratorRuntime.wrap(function _callee$(_context) {
                while (1) {
                    switch (_context.prev = _context.next) {
                        case 0:
                            return _context.abrupt('return', require(basePath + Const.RUNTIME_CONFIG).etc.port);

                        case 1:
                        case 'end':
                            return _context.stop();
                    }
                }
            }, _callee, _this);
        }))();
    },

    getIP() {
        var _this2 = this;

        return (0, _bluebird.coroutine)(regeneratorRuntime.mark(function _callee2() {
            var result;
            return regeneratorRuntime.wrap(function _callee2$(_context2) {
                while (1) {
                    switch (_context2.prev = _context2.next) {
                        case 0:
                            _context2.next = 2;
                            return Request('ip');

                        case 2:
                            result = _context2.sent;
                            return _context2.abrupt('return', result && result.data);

                        case 4:
                        case 'end':
                            return _context2.stop();
                    }
                }
            }, _callee2, _this2);
        }))();
    },

    getMac() {
        var _this3 = this;

        return (0, _bluebird.coroutine)(regeneratorRuntime.mark(function _callee3() {
            var getMacAddress, mac;
            return regeneratorRuntime.wrap(function _callee3$(_context3) {
                while (1) {
                    switch (_context3.prev = _context3.next) {
                        case 0:
                            getMacAddress = function getMacAddress() {
                                return new Promise(function (resolve, reject) {
                                    Exec(`ifconfig en0| grep ether| awk '{print $NF}'`, function (err, stdout) {
                                        err || !stdout ? reject() : resolve(stdout.trim());
                                    });
                                });
                            };

                            _context3.t0 = Cache[MAC];

                            if (_context3.t0) {
                                _context3.next = 6;
                                break;
                            }

                            _context3.next = 5;
                            return getMacAddress();

                        case 5:
                            _context3.t0 = _context3.sent;

                        case 6:
                            mac = _context3.t0;


                            if (!mac) {
                                log('获取 MAC 地址失败', 'error');
                            }

                            return _context3.abrupt('return', Cache[MAC] = mac);

                        case 9:
                        case 'end':
                            return _context3.stop();
                    }
                }
            }, _callee3, _this3);
        }))();
    },

    updateMac(mac) {
        var _this4 = this;

        return (0, _bluebird.coroutine)(regeneratorRuntime.mark(function _callee4() {
            var res;
            return regeneratorRuntime.wrap(function _callee4$(_context4) {
                while (1) {
                    switch (_context4.prev = _context4.next) {
                        case 0:
                            _context4.next = 2;
                            return Request(ACTION_UPDATE + mac);

                        case 2:
                            res = _context4.sent;


                            Indicator.stop();

                            if (!(res && res.code == '0')) {
                                _context4.next = 6;
                                break;
                            }

                            return _context4.abrupt('return', true);

                        case 6:
                            log('更新 Mac 地址失败', 'error');

                        case 7:
                        case 'end':
                            return _context4.stop();
                    }
                }
            }, _callee4, _this4);
        }))();
    },

    updateProxy(port, params) {
        var _this5 = this;

        return (0, _bluebird.coroutine)(regeneratorRuntime.mark(function _callee5() {
            var mac;
            return regeneratorRuntime.wrap(function _callee5$(_context5) {
                while (1) {
                    switch (_context5.prev = _context5.next) {
                        case 0:
                            _context5.next = 2;
                            return _this5.getMac();

                        case 2:
                            mac = _context5.sent;
                            return _context5.abrupt('return', Request(`host?port=${port}&ukey=${mac}&${params}`));

                        case 4:
                        case 'end':
                            return _context5.stop();
                    }
                }
            }, _callee5, _this5);
        }))();
    },

    getFormatDate() {
        var now = new Date(),
            year = now.getFullYear(),
            month = String(now.getMonth() + 1),
            date = String(now.getDate());

        month = month.length > 1 ? month : '0' + month;
        date = date.length > 1 ? date : '0' + date;

        return `${year}/${month}/${date}`;
    },

    /**
     * 更新运行时配置
     * 如果配置文件不存在, 默认读取 dev.conf.js
     */
    updateRuntimeConfig(path, fn) {
        var _this6 = this;

        return (0, _bluebird.coroutine)(regeneratorRuntime.mark(function _callee6() {
            var isExist, data, isDirExist;
            return regeneratorRuntime.wrap(function _callee6$(_context6) {
                while (1) {
                    switch (_context6.prev = _context6.next) {
                        case 0:
                            _context6.next = 2;
                            return _this6.checkFileExist(path + Const.RUNTIME_CONFIG);

                        case 2:
                            isExist = _context6.sent;
                            data = void 0;

                            if (isExist) {
                                _context6.next = 13;
                                break;
                            }

                            data = require(path + Const.DEV_CONFIG);
                            _context6.next = 8;
                            return _this6.checkFileExist(path + Const.CONFIG_DIR);

                        case 8:
                            isDirExist = _context6.sent;


                            if (!isDirExist) {
                                FS.mkdirSync(path + Const.CONFIG_DIR);
                            }
                            FS.writeFileSync(path + Const.RUNTIME_CONFIG, JSON.stringify(data));
                            _context6.next = 14;
                            break;

                        case 13:
                            data = require(path + Const.RUNTIME_CONFIG);

                        case 14:

                            data = fn(data);

                            _this6.updateJSONFile(path + Const.RUNTIME_CONFIG, data);

                        case 16:
                        case 'end':
                            return _context6.stop();
                    }
                }
            }, _callee6, _this6);
        }))();
    }
};