'use strict';

var _bluebird = require('bluebird');

var OS = require('os'),
    FS = require('fs'),
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
    start: function start() {
        var text = arguments.length <= 0 || arguments[0] === undefined ? 'waiting' : arguments[0];

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
    stop: function stop() {
        clearTimeout(timeoutID);
        stdout.clearLine();
        stdout.cursorTo(0);
    }
};

module.exports = Util = {
    indicator: Indicator,

    updateJSONFile: function updateJSONFile(path, content) {
        return this.checkFileExist(path).then(function (isExist) {
            if (!isExist) {
                return Promise.reject('文件不存在');
            } else {
                try {
                    content = JSON.stringify(ObjectAssign({}, require(path), content), null, '  ');
                } catch (e) {
                    log('读取 ' + path + ' 文件错误, 原因为:');
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
    checkFileExist: function checkFileExist(path) {
        return new Promise(function (resolve) {
            FS.exists(path, function (isExist) {
                resolve(isExist);
            });
        });
    },
    getPort: function getPort(basePath) {
        return require(basePath + Const.FILE_ETC).onPort;
    },
    getIP: function getIP() {
        var _this = this;

        return (0, _bluebird.coroutine)(regeneratorRuntime.mark(function _callee() {
            var result;
            return regeneratorRuntime.wrap(function _callee$(_context) {
                while (1) {
                    switch (_context.prev = _context.next) {
                        case 0:
                            _context.next = 2;
                            return Request('ip');

                        case 2:
                            result = _context.sent;
                            return _context.abrupt('return', result.data);

                        case 4:
                        case 'end':
                            return _context.stop();
                    }
                }
            }, _callee, _this);
        }))();
    },
    getMac: function getMac() {
        var _this2 = this;

        return (0, _bluebird.coroutine)(regeneratorRuntime.mark(function _callee2() {
            var getMacAddress, mac;
            return regeneratorRuntime.wrap(function _callee2$(_context2) {
                while (1) {
                    switch (_context2.prev = _context2.next) {
                        case 0:
                            getMacAddress = function getMacAddress() {
                                return new Promise(function (resolve, reject) {
                                    Exec('ifconfig en0| grep ether| awk \'{print $NF}\'', function (err, stdout) {
                                        err || !stdout ? reject() : resolve(stdout.trim());
                                    });
                                });
                            };

                            _context2.t0 = Cache[MAC];

                            if (_context2.t0) {
                                _context2.next = 6;
                                break;
                            }

                            _context2.next = 5;
                            return getMacAddress();

                        case 5:
                            _context2.t0 = _context2.sent;

                        case 6:
                            mac = _context2.t0;


                            if (!mac) {
                                log('获取 MAC 地址失败', 'error');
                            }

                            return _context2.abrupt('return', Cache[MAC] = mac);

                        case 9:
                        case 'end':
                            return _context2.stop();
                    }
                }
            }, _callee2, _this2);
        }))();
    },
    updateMac: function updateMac(mac) {
        var _this3 = this;

        return (0, _bluebird.coroutine)(regeneratorRuntime.mark(function _callee3() {
            var res;
            return regeneratorRuntime.wrap(function _callee3$(_context3) {
                while (1) {
                    switch (_context3.prev = _context3.next) {
                        case 0:
                            _context3.next = 2;
                            return Request(ACTION_UPDATE + mac);

                        case 2:
                            res = _context3.sent;


                            Indicator.stop();

                            if (!(res && res.code == '0')) {
                                _context3.next = 6;
                                break;
                            }

                            return _context3.abrupt('return', true);

                        case 6:
                            log('更新 IP 地址失败', 'error');

                        case 7:
                        case 'end':
                            return _context3.stop();
                    }
                }
            }, _callee3, _this3);
        }))();
    },
    updateProxy: function updateProxy(port, params) {
        var _this4 = this;

        return (0, _bluebird.coroutine)(regeneratorRuntime.mark(function _callee4() {
            var mac;
            return regeneratorRuntime.wrap(function _callee4$(_context4) {
                while (1) {
                    switch (_context4.prev = _context4.next) {
                        case 0:
                            _context4.next = 2;
                            return _this4.getMac();

                        case 2:
                            mac = _context4.sent;
                            return _context4.abrupt('return', Request('host?port=' + port + '&ukey=' + mac + '&' + params));

                        case 4:
                        case 'end':
                            return _context4.stop();
                    }
                }
            }, _callee4, _this4);
        }))();
    },
    getFormatDate: function getFormatDate() {
        var now = new Date(),
            year = now.getFullYear(),
            month = String(now.getMonth() + 1),
            date = String(now.getDate());

        month = month.length > 1 ? month : '0' + month;
        date = date.length > 1 ? date : '0' + date;

        return year + '/' + month + '/' + date;
    }
};
//# sourceMappingURL=data:application/json;base64,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LENBQXhCIiwiZmlsZSI6InV0aWwuanMiLCJzb3VyY2VzQ29udGVudCI6WyJsZXQgT1MgICAgICAgID0gcmVxdWlyZSggJ29zJyApLFxuICAgIEZTICAgICAgICA9IHJlcXVpcmUoICdmcycgKSxcbiAgICBFeGVjICAgICAgPSByZXF1aXJlKCAnY2hpbGRfcHJvY2VzcycgKS5leGVjLFxuICAgIFJlcXVlc3QgICA9IHJlcXVpcmUoICcuL3JlcXVlc3QnICksXG4gICAgS2V5ICAgICAgID0gcmVxdWlyZSggJy4va2V5JyApLFxuICAgIENvbnN0ICAgICA9IHJlcXVpcmUoICcuL2NvbnN0JyApLFxuICAgIGNvdW50ICAgICA9IDAsXG4gICAgc3Rkb3V0ICAgID0gcHJvY2Vzcy5zdGRvdXQsXG4gICAgQ2FjaGUgICAgID0ge30sXG4gICAgdGltZW91dElEID0gMCxcbiAgICBVdGlsLCBJbmRpY2F0b3IsIE9iamVjdEFzc2lnblxuXG5jb25zdCBBQ1RJT05fVVBEQVRFID0gJ3VwZGF0ZT91a2V5PScsXG4gICAgICBNQUMgICAgICAgICAgID0gS2V5Lm1hYyxcbiAgICAgIElQICAgICAgICAgICAgPSBLZXkuaXBcblxuT2JqZWN0QXNzaWduID0gT2JqZWN0LmFzc2lnbiB8fCBmdW5jdGlvbiAoIHRhcmdldCwgLi4ubWl4aW5zICkge1xuICAgICAgICB0YXJnZXQgPSB0YXJnZXQgfHwge31cblxuICAgICAgICBtaXhpbnMuZm9yRWFjaCggb2JqID0+IHtcbiAgICAgICAgICAgIGZvciAoIHZhciBrZXkgaW4gb2JqICkge1xuICAgICAgICAgICAgICAgIHRhcmdldFsga2V5IF0gPSBvYmpbIGtleSBdXG4gICAgICAgICAgICB9XG4gICAgICAgIH0gKVxuXG4gICAgICAgIHJldHVybiB0YXJnZXRcbiAgICB9XG5cbkluZGljYXRvciA9IHtcbiAgICBzdGFydCggdGV4dCA9ICd3YWl0aW5nJyApIHtcbiAgICAgICAgY291bnQgPSAwXG4gICAgICAgIGNsZWFyVGltZW91dCggdGltZW91dElEIClcbiAgICAgICAgdGltZW91dElEID0gc2V0SW50ZXJ2YWwoIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGNvdW50ICAgID0gKCBjb3VudCArIDEgKSAlIDVcbiAgICAgICAgICAgIGxldCBkb3RzID0gbmV3IEFycmF5KCBjb3VudCApLmpvaW4oICcuJyApXG5cbiAgICAgICAgICAgIHN0ZG91dC5jbGVhckxpbmUoKVxuICAgICAgICAgICAgc3Rkb3V0LmN1cnNvclRvKCAwIClcbiAgICAgICAgICAgIHN0ZG91dC53cml0ZSggdGV4dCArIGRvdHMgKVxuICAgICAgICB9LCAzMDAgKVxuICAgIH0sXG5cbiAgICBzdG9wKCkge1xuICAgICAgICBjbGVhclRpbWVvdXQoIHRpbWVvdXRJRCApXG4gICAgICAgIHN0ZG91dC5jbGVhckxpbmUoKVxuICAgICAgICBzdGRvdXQuY3Vyc29yVG8oIDAgKVxuICAgIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBVdGlsID0ge1xuICAgIGluZGljYXRvcjogSW5kaWNhdG9yLFxuXG4gICAgdXBkYXRlSlNPTkZpbGUoIHBhdGgsIGNvbnRlbnQgKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNoZWNrRmlsZUV4aXN0KCBwYXRoICkudGhlbiggaXNFeGlzdCA9PiB7XG4gICAgICAgICAgICBpZiAoICFpc0V4aXN0ICkge1xuICAgICAgICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdCggJ+aWh+S7tuS4jeWtmOWcqCcgKVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICBjb250ZW50ID0gSlNPTi5zdHJpbmdpZnkoIE9iamVjdEFzc2lnbigge30sIHJlcXVpcmUoIHBhdGggKSwgY29udGVudCApLCBudWxsLCAnICAnIClcbiAgICAgICAgICAgICAgICB9IGNhdGNoICggZSApIHtcbiAgICAgICAgICAgICAgICAgICAgbG9nKCBg6K+75Y+WICR7cGF0aH0g5paH5Lu26ZSZ6K+vLCDljp/lm6DkuLo6YCApXG4gICAgICAgICAgICAgICAgICAgIGxvZyggZSwgJ2Vycm9yJyApXG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKCAoIHJlc29sdmUsIHJlamVjdCApID0+IHtcbiAgICAgICAgICAgICAgICAgICAgRlMud3JpdGVGaWxlKCBwYXRoLCBjb250ZW50LCBlcnIgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgZXJyID8gcmVqZWN0KCkgOiByZXNvbHZlKClcbiAgICAgICAgICAgICAgICAgICAgfSApXG4gICAgICAgICAgICAgICAgfSApXG4gICAgICAgICAgICB9XG4gICAgICAgIH0gKS5jYXRjaCggZSA9PiBsb2coIGUsICdlcnJvcicgKSApXG4gICAgfSxcblxuICAgIGNoZWNrRmlsZUV4aXN0KCBwYXRoICkge1xuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoIHJlc29sdmUgPT4ge1xuICAgICAgICAgICAgRlMuZXhpc3RzKCBwYXRoLCBpc0V4aXN0ID0+IHtcbiAgICAgICAgICAgICAgICByZXNvbHZlKCBpc0V4aXN0IClcbiAgICAgICAgICAgIH0gKVxuICAgICAgICB9IClcbiAgICB9LFxuXG4gICAgZ2V0UG9ydCggYmFzZVBhdGggKSB7XG4gICAgICAgIHJldHVybiByZXF1aXJlKCBiYXNlUGF0aCArIENvbnN0LkZJTEVfRVRDICkub25Qb3J0XG4gICAgfSxcblxuICAgIGFzeW5jIGdldElQKCkge1xuICAgICAgICB2YXIgcmVzdWx0ID0gYXdhaXQgUmVxdWVzdCggJ2lwJyApXG4gICAgICAgIHJldHVybiByZXN1bHQuZGF0YVxuICAgIH0sXG5cbiAgICBhc3luYyBnZXRNYWMoKSB7XG4gICAgICAgIHZhciBnZXRNYWNBZGRyZXNzID0gKCkgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKCAoIHJlc29sdmUsIHJlamVjdCApID0+IHtcbiAgICAgICAgICAgICAgICBFeGVjKCBgaWZjb25maWcgZW4wfCBncmVwIGV0aGVyfCBhd2sgJ3twcmludCAkTkZ9J2AsICggZXJyLCBzdGRvdXQgKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICggZXJyIHx8ICFzdGRvdXQgKSA/IHJlamVjdCgpIDogcmVzb2x2ZSggc3Rkb3V0LnRyaW0oKSApXG4gICAgICAgICAgICAgICAgfSApXG4gICAgICAgICAgICB9IClcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBtYWMgPSBDYWNoZVsgTUFDIF0gfHwgYXdhaXQgZ2V0TWFjQWRkcmVzcygpXG5cbiAgICAgICAgaWYgKCAhbWFjICkge1xuICAgICAgICAgICAgbG9nKCAn6I635Y+WIE1BQyDlnLDlnYDlpLHotKUnLCAnZXJyb3InIClcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBDYWNoZVsgTUFDIF0gPSBtYWNcbiAgICB9LFxuXG4gICAgYXN5bmMgdXBkYXRlTWFjKCBtYWMgKSB7XG4gICAgICAgIGxldCByZXMgPSBhd2FpdCBSZXF1ZXN0KCBBQ1RJT05fVVBEQVRFICsgbWFjIClcblxuICAgICAgICBJbmRpY2F0b3Iuc3RvcCgpXG4gICAgICAgIGlmICggcmVzICYmIHJlcy5jb2RlID09ICcwJyApIHtcbiAgICAgICAgICAgIHJldHVybiB0cnVlXG4gICAgICAgIH1cbiAgICAgICAgbG9nKCAn5pu05pawIElQIOWcsOWdgOWksei0pScsICdlcnJvcicgKVxuICAgIH0sXG5cbiAgICBhc3luYyB1cGRhdGVQcm94eSggcG9ydCwgcGFyYW1zICkge1xuICAgICAgICBsZXQgbWFjID0gYXdhaXQgdGhpcy5nZXRNYWMoKVxuXG4gICAgICAgIHJldHVybiBSZXF1ZXN0KCBgaG9zdD9wb3J0PSR7cG9ydH0mdWtleT0ke21hY30mJHtwYXJhbXN9YCApXG4gICAgfSxcblxuICAgIGdldEZvcm1hdERhdGUoKSB7XG4gICAgICAgIHZhciBub3cgICA9IG5ldyBEYXRlLFxuICAgICAgICAgICAgeWVhciAgPSBub3cuZ2V0RnVsbFllYXIoKSxcbiAgICAgICAgICAgIG1vbnRoID0gU3RyaW5nKCBub3cuZ2V0TW9udGgoKSArIDEgKSxcbiAgICAgICAgICAgIGRhdGUgID0gU3RyaW5nKCBub3cuZ2V0RGF0ZSgpIClcblxuICAgICAgICBtb250aCA9IG1vbnRoLmxlbmd0aCA+IDEgPyBtb250aCA6ICggJzAnICsgbW9udGggKVxuICAgICAgICBkYXRlICA9IGRhdGUubGVuZ3RoID4gMSA/IGRhdGUgOiAoICcwJyArIGRhdGUgKVxuXG4gICAgICAgIHJldHVybiBgJHt5ZWFyfS8ke21vbnRofS8ke2RhdGV9YFxuICAgIH1cbn1cbiJdfQ==