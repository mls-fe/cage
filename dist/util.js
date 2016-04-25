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
        var ifaces = OS.networkInterfaces(),
            ret = [];

        for (var dev in ifaces) {
            ifaces[dev].forEach(function (details) {
                if (details.family == 'IPv4' && !details.internal) {
                    ret.push(details.address);
                }
            });
        }
        return ret.length ? ret[0] : null;
    },
    getMac: function getMac() {
        var _this = this;

        return (0, _bluebird.coroutine)(regeneratorRuntime.mark(function _callee() {
            var getMacAddress, mac;
            return regeneratorRuntime.wrap(function _callee$(_context) {
                while (1) {
                    switch (_context.prev = _context.next) {
                        case 0:
                            getMacAddress = function getMacAddress() {
                                return new Promise(function (resolve, reject) {
                                    Exec('ifconfig en0| grep ether| awk \'{print $NF}\'', function (err, stdout) {
                                        err || !stdout ? reject() : resolve(stdout);
                                    });
                                });
                            };

                            _context.t0 = Cache[MAC];

                            if (_context.t0) {
                                _context.next = 6;
                                break;
                            }

                            _context.next = 5;
                            return getMacAddress();

                        case 5:
                            _context.t0 = _context.sent;

                        case 6:
                            mac = _context.t0;


                            if (!mac) {
                                log('获取 MAC 地址失败', 'error');
                            }

                            return _context.abrupt('return', Cache[MAC] = mac);

                        case 9:
                        case 'end':
                            return _context.stop();
                    }
                }
            }, _callee, _this);
        }))();
    },
    updateMac: function updateMac(mac) {
        var _this2 = this;

        return (0, _bluebird.coroutine)(regeneratorRuntime.mark(function _callee2() {
            var res;
            return regeneratorRuntime.wrap(function _callee2$(_context2) {
                while (1) {
                    switch (_context2.prev = _context2.next) {
                        case 0:
                            _context2.next = 2;
                            return Request(ACTION_UPDATE + mac);

                        case 2:
                            res = _context2.sent;


                            Indicator.stop();

                            if (!(res && res.code == '0')) {
                                _context2.next = 6;
                                break;
                            }

                            return _context2.abrupt('return', true);

                        case 6:
                            log('更新 IP 地址失败', 'error');

                        case 7:
                        case 'end':
                            return _context2.stop();
                    }
                }
            }, _callee2, _this2);
        }))();
    },
    updateProxy: function updateProxy(port, params) {
        var _this3 = this;

        return (0, _bluebird.coroutine)(regeneratorRuntime.mark(function _callee3() {
            var mac;
            return regeneratorRuntime.wrap(function _callee3$(_context3) {
                while (1) {
                    switch (_context3.prev = _context3.next) {
                        case 0:
                            _context3.next = 2;
                            return _this3.getMac();

                        case 2:
                            mac = _context3.sent;
                            return _context3.abrupt('return', Request('host?port=' + port + '&ukey=' + mac + '&' + params));

                        case 4:
                        case 'end':
                            return _context3.stop();
                    }
                }
            }, _callee3, _this3);
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
//# sourceMappingURL=data:application/json;base64,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bnQiOlsibGV0IE9TICAgICAgICA9IHJlcXVpcmUoICdvcycgKSxcbiAgICBGUyAgICAgICAgPSByZXF1aXJlKCAnZnMnICksXG4gICAgRXhlYyAgICAgID0gcmVxdWlyZSggJ2NoaWxkX3Byb2Nlc3MnICkuZXhlYyxcbiAgICBSZXF1ZXN0ICAgPSByZXF1aXJlKCAnLi9yZXF1ZXN0JyApLFxuICAgIEtleSAgICAgICA9IHJlcXVpcmUoICcuL2tleScgKSxcbiAgICBDb25zdCAgICAgPSByZXF1aXJlKCAnLi9jb25zdCcgKSxcbiAgICBjb3VudCAgICAgPSAwLFxuICAgIHN0ZG91dCAgICA9IHByb2Nlc3Muc3Rkb3V0LFxuICAgIENhY2hlICAgICA9IHt9LFxuICAgIHRpbWVvdXRJRCA9IDAsXG4gICAgVXRpbCwgSW5kaWNhdG9yLCBPYmplY3RBc3NpZ25cblxuY29uc3QgQUNUSU9OX1VQREFURSA9ICd1cGRhdGU/dWtleT0nLFxuICAgICAgTUFDICAgICAgICAgICA9IEtleS5tYWMsXG4gICAgICBJUCAgICAgICAgICAgID0gS2V5LmlwXG5cbk9iamVjdEFzc2lnbiA9IE9iamVjdC5hc3NpZ24gfHwgZnVuY3Rpb24gKCB0YXJnZXQsIC4uLm1peGlucyApIHtcbiAgICAgICAgdGFyZ2V0ID0gdGFyZ2V0IHx8IHt9XG5cbiAgICAgICAgbWl4aW5zLmZvckVhY2goIG9iaiA9PiB7XG4gICAgICAgICAgICBmb3IgKCB2YXIga2V5IGluIG9iaiApIHtcbiAgICAgICAgICAgICAgICB0YXJnZXRbIGtleSBdID0gb2JqWyBrZXkgXVxuICAgICAgICAgICAgfVxuICAgICAgICB9IClcblxuICAgICAgICByZXR1cm4gdGFyZ2V0XG4gICAgfVxuXG5JbmRpY2F0b3IgPSB7XG4gICAgc3RhcnQoIHRleHQgPSAnd2FpdGluZycgKSB7XG4gICAgICAgIGNvdW50ID0gMFxuICAgICAgICBjbGVhclRpbWVvdXQoIHRpbWVvdXRJRCApXG4gICAgICAgIHRpbWVvdXRJRCA9IHNldEludGVydmFsKCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBjb3VudCAgICA9ICggY291bnQgKyAxICkgJSA1XG4gICAgICAgICAgICBsZXQgZG90cyA9IG5ldyBBcnJheSggY291bnQgKS5qb2luKCAnLicgKVxuXG4gICAgICAgICAgICBzdGRvdXQuY2xlYXJMaW5lKClcbiAgICAgICAgICAgIHN0ZG91dC5jdXJzb3JUbyggMCApXG4gICAgICAgICAgICBzdGRvdXQud3JpdGUoIHRleHQgKyBkb3RzIClcbiAgICAgICAgfSwgMzAwIClcbiAgICB9LFxuXG4gICAgc3RvcCgpIHtcbiAgICAgICAgY2xlYXJUaW1lb3V0KCB0aW1lb3V0SUQgKVxuICAgICAgICBzdGRvdXQuY2xlYXJMaW5lKClcbiAgICAgICAgc3Rkb3V0LmN1cnNvclRvKCAwIClcbiAgICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gVXRpbCA9IHtcbiAgICBpbmRpY2F0b3IgOiBJbmRpY2F0b3IsXG5cbiAgICB1cGRhdGVKU09ORmlsZSggcGF0aCwgY29udGVudCApIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNvbnRlbnQgPSBKU09OLnN0cmluZ2lmeSggT2JqZWN0QXNzaWduKCB7fSwgcmVxdWlyZSggcGF0aCApLCBjb250ZW50ICksIG51bGwsICcgICcgKVxuICAgICAgICB9IGNhdGNoICggZSApIHtcbiAgICAgICAgICAgIGxvZyggYOivu+WPliAke3BhdGh9IOaWh+S7tumUmeivrywg5Y6f5Zug5Li6OmAgKVxuICAgICAgICAgICAgbG9nKCBlLCAnZXJyb3InIClcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSggKCByZXNvbHZlLCByZWplY3QgKSA9PiB7XG4gICAgICAgICAgICBGUy53cml0ZUZpbGUoIHBhdGgsIGNvbnRlbnQsIGVyciA9PiB7XG4gICAgICAgICAgICAgICAgZXJyID8gcmVqZWN0KCkgOiByZXNvbHZlKClcbiAgICAgICAgICAgIH0gKVxuICAgICAgICB9ICkuY2F0Y2goIGUgPT4gbG9nKCBlLCAnZXJyb3InICkgKVxuICAgIH0sXG5cbiAgICBjaGVja0ZpbGVFeGlzdCggcGF0aCApIHtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKCByZXNvbHZlID0+IHtcbiAgICAgICAgICAgIEZTLmV4aXN0cyggcGF0aCwgaXNFeGlzdCA9PiB7XG4gICAgICAgICAgICAgICAgcmVzb2x2ZSggaXNFeGlzdCApXG4gICAgICAgICAgICB9IClcbiAgICAgICAgfSApXG4gICAgfSxcblxuICAgIGdldFBvcnQoIGJhc2VQYXRoICkge1xuICAgICAgICByZXR1cm4gcmVxdWlyZSggYmFzZVBhdGggKyBDb25zdC5GSUxFX0VUQyApLm9uUG9ydFxuICAgIH0sXG5cbiAgICBnZXRJUCgpIHtcbiAgICAgICAgdmFyIGlmYWNlcyA9IE9TLm5ldHdvcmtJbnRlcmZhY2VzKCksXG4gICAgICAgICAgICByZXQgICAgPSBbXVxuXG4gICAgICAgIGZvciAoIHZhciBkZXYgaW4gaWZhY2VzICkge1xuICAgICAgICAgICAgaWZhY2VzWyBkZXYgXS5mb3JFYWNoKCBkZXRhaWxzID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoIGRldGFpbHMuZmFtaWx5ID09ICdJUHY0JyAmJiAhZGV0YWlscy5pbnRlcm5hbCApIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0LnB1c2goIGRldGFpbHMuYWRkcmVzcyApXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSApXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJldC5sZW5ndGggPyByZXRbIDAgXSA6IG51bGxcbiAgICB9LFxuXG4gICAgYXN5bmMgZ2V0TWFjKCkge1xuICAgICAgICB2YXIgZ2V0TWFjQWRkcmVzcyA9ICgpID0+IHtcbiAgICAgICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSggKCByZXNvbHZlLCByZWplY3QgKSA9PiB7XG4gICAgICAgICAgICAgICAgRXhlYyggYGlmY29uZmlnIGVuMHwgZ3JlcCBldGhlcnwgYXdrICd7cHJpbnQgJE5GfSdgLCAoIGVyciwgc3Rkb3V0ICkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAoIGVyciB8fCAhc3Rkb3V0ICkgPyByZWplY3QoKSA6IHJlc29sdmUoIHN0ZG91dCApXG4gICAgICAgICAgICAgICAgfSApXG4gICAgICAgICAgICB9IClcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBtYWMgPSBDYWNoZVsgTUFDIF0gfHwgYXdhaXQgZ2V0TWFjQWRkcmVzcygpXG5cbiAgICAgICAgaWYgKCAhbWFjICkge1xuICAgICAgICAgICAgbG9nKCAn6I635Y+WIE1BQyDlnLDlnYDlpLHotKUnLCAnZXJyb3InIClcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBDYWNoZVsgTUFDIF0gPSBtYWNcbiAgICB9LFxuXG4gICAgYXN5bmMgdXBkYXRlTWFjKCBtYWMgKSB7XG4gICAgICAgIGxldCByZXMgPSBhd2FpdCBSZXF1ZXN0KCBBQ1RJT05fVVBEQVRFICsgbWFjIClcblxuICAgICAgICBJbmRpY2F0b3Iuc3RvcCgpXG4gICAgICAgIGlmICggcmVzICYmIHJlcy5jb2RlID09ICcwJyApIHtcbiAgICAgICAgICAgIHJldHVybiB0cnVlXG4gICAgICAgIH1cbiAgICAgICAgbG9nKCAn5pu05pawIElQIOWcsOWdgOWksei0pScsICdlcnJvcicgKVxuICAgIH0sXG5cbiAgICBhc3luYyB1cGRhdGVQcm94eSggcG9ydCwgcGFyYW1zICkge1xuICAgICAgICBsZXQgbWFjID0gYXdhaXQgdGhpcy5nZXRNYWMoKVxuXG4gICAgICAgIHJldHVybiBSZXF1ZXN0KCBgaG9zdD9wb3J0PSR7cG9ydH0mdWtleT0ke21hY30mJHtwYXJhbXN9YCApXG4gICAgfSxcblxuICAgIGdldEZvcm1hdERhdGUoKSB7XG4gICAgICAgIHZhciBub3cgICA9IG5ldyBEYXRlLFxuICAgICAgICAgICAgeWVhciAgPSBub3cuZ2V0RnVsbFllYXIoKSxcbiAgICAgICAgICAgIG1vbnRoID0gU3RyaW5nKCBub3cuZ2V0TW9udGgoKSArIDEgKSxcbiAgICAgICAgICAgIGRhdGUgID0gU3RyaW5nKCBub3cuZ2V0RGF0ZSgpIClcblxuICAgICAgICBtb250aCA9IG1vbnRoLmxlbmd0aCA+IDEgPyBtb250aCA6ICggJzAnICsgbW9udGggKVxuICAgICAgICBkYXRlICA9IGRhdGUubGVuZ3RoID4gMSA/IGRhdGUgOiAoICcwJyArIGRhdGUgKVxuXG4gICAgICAgIHJldHVybiBgJHt5ZWFyfS8ke21vbnRofS8ke2RhdGV9YFxuICAgIH1cbn1cbiJdfQ==