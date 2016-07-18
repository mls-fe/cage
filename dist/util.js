'use strict';

var _bluebird = require('bluebird');

let FS = require('fs'),
    Exec = require('child_process').exec,
    Request = require('./request'),
    Key = require('./key'),
    Const = require('./const'),
    count = 0,
    stdout = process.stdout,
    Cache = {},
    timeoutID = 0,
    Util,
    Indicator,
    ObjectAssign;

const ACTION_UPDATE = 'update?ukey=',
      MAC = Key.mac,
      IP = Key.ip;

ObjectAssign = Object.assign || function (target) {
    target = target || {};

    for (var _len = arguments.length, mixins = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        mixins[_key - 1] = arguments[_key];
    }

    mixins.forEach(obj => {
        for (var key in obj) {
            target[key] = obj[key];
        }
    });

    return target;
};

Indicator = {
    start() {
        let text = arguments.length <= 0 || arguments[0] === undefined ? 'waiting' : arguments[0];

        count = 0;
        clearTimeout(timeoutID);
        timeoutID = setInterval(function () {
            count = (count + 1) % 5;
            let dots = new Array(count).join('.');

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
        return this.checkFileExist(path).then(isExist => {
            if (!isExist) {
                log(`${ path } 文件不存在`, 'error');
                return Promise.reject(`${ path } 文件不存在`);
            } else {
                try {
                    content = JSON.stringify(ObjectAssign({}, require(path), content), null, '  ');
                } catch (e) {
                    log(`读取 ${ path } 文件错误, 原因为:`);
                    log(e, 'error');
                }

                return new Promise((resolve, reject) => {
                    FS.writeFile(path, content, err => {
                        err ? reject() : resolve();
                    });
                });
            }
        }).catch(e => log(e, 'error'));
    },

    checkFileExist(path) {
        return new Promise(resolve => {
            FS.exists(path, isExist => {
                resolve(isExist);
            });
        });
    },

    getPort(basePath) {
        return require(basePath + Const.FILE_ETC).onPort;
    },

    getIP() {
        return (0, _bluebird.coroutine)(function* () {
            var result = yield Request('ip');
            return result && result.data;
        })();
    },

    getMac() {
        return (0, _bluebird.coroutine)(function* () {
            var getMacAddress = function () {
                return new Promise(function (resolve, reject) {
                    Exec(`ifconfig en0| grep ether| awk '{print $NF}'`, function (err, stdout) {
                        err || !stdout ? reject() : resolve(stdout.trim());
                    });
                });
            };

            let mac = Cache[MAC] || (yield getMacAddress());

            if (!mac) {
                log('获取 MAC 地址失败', 'error');
            }

            return Cache[MAC] = mac;
        })();
    },

    updateMac(mac) {
        return (0, _bluebird.coroutine)(function* () {
            let res = yield Request(ACTION_UPDATE + mac);

            Indicator.stop();
            if (res && res.code == '0') {
                return true;
            }
            log('更新 IP 地址失败', 'error');
        })();
    },

    updateProxy(port, params) {
        var _this = this;

        return (0, _bluebird.coroutine)(function* () {
            let mac = yield _this.getMac();
            return Request(`host?port=${ port }&ukey=${ mac }&${ params }`);
        })();
    },

    getFormatDate() {
        var now = new Date(),
            year = now.getFullYear(),
            month = String(now.getMonth() + 1),
            date = String(now.getDate());

        month = month.length > 1 ? month : '0' + month;
        date = date.length > 1 ? date : '0' + date;

        return `${ year }/${ month }/${ date }`;
    }
};