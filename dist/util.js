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
        content = JSON.stringify(ObjectAssign({}, require(path), content), null, '  ');
        return new Promise(function (resolve, reject) {
            FS.writeFile(path, content, function (err) {
                err ? reject() : resolve();
            });
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
//# sourceMappingURL=data:application/json;base64,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QUFJLElBQUosSUFBWSxHQUpMO0FBQUE7QUFBQTtBQUFBOztBQUFBLDhEQUtSLElBTFE7O0FBQUE7QUFPbkIsZ0NBQUssWUFBTCxFQUFtQixPQUFuQjs7QUFQbUI7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFRdEIsS0FoRW1CO0FBa0VkLGVBbEVjLHVCQWtFRCxJQWxFQyxFQWtFSyxNQWxFTCxFQWtFYztBQUFBOztBQUFBO0FBQUEsZ0JBQzFCLEdBRDBCO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLG1DQUNkLE9BQUssTUFBTCxFQURjOztBQUFBO0FBQzFCLCtCQUQwQjtBQUFBLDhEQUd2Qix1QkFBc0IsSUFBdEIsY0FBbUMsR0FBbkMsU0FBMEMsTUFBMUMsQ0FIdUI7O0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFJakMsS0F0RW1CO0FBd0VwQixpQkF4RW9CLDJCQXdFSjtBQUNaLFlBQUksTUFBUSxJQUFJLElBQUosRUFBWjtZQUNJLE9BQVEsSUFBSSxXQUFKLEVBRFo7WUFFSSxRQUFRLE9BQVEsSUFBSSxRQUFKLEtBQWlCLENBQXpCLENBRlo7WUFHSSxPQUFRLE9BQVEsSUFBSSxPQUFKLEVBQVIsQ0FIWjs7QUFLQSxnQkFBUSxNQUFNLE1BQU4sR0FBZSxDQUFmLEdBQW1CLEtBQW5CLEdBQTZCLE1BQU0sS0FBM0M7QUFDQSxlQUFRLEtBQUssTUFBTCxHQUFjLENBQWQsR0FBa0IsSUFBbEIsR0FBMkIsTUFBTSxJQUF6Qzs7QUFFQSxlQUFVLElBQVYsU0FBa0IsS0FBbEIsU0FBMkIsSUFBM0I7QUFDSDtBQWxGbUIsQ0FBeEIiLCJmaWxlIjoidXRpbC5qcyIsInNvdXJjZXNDb250ZW50IjpbImxldCBPUyAgICAgICAgPSByZXF1aXJlKCAnb3MnICksXG4gICAgRlMgICAgICAgID0gcmVxdWlyZSggJ2ZzJyApLFxuICAgIEV4ZWMgICAgICA9IHJlcXVpcmUoICdjaGlsZF9wcm9jZXNzJyApLmV4ZWMsXG4gICAgUmVxdWVzdCAgID0gcmVxdWlyZSggJy4vcmVxdWVzdCcgKSxcbiAgICBLZXkgICAgICAgPSByZXF1aXJlKCAnLi9rZXknICksXG4gICAgQ29uc3QgICAgID0gcmVxdWlyZSggJy4vY29uc3QnICksXG4gICAgY291bnQgICAgID0gMCxcbiAgICBzdGRvdXQgICAgPSBwcm9jZXNzLnN0ZG91dCxcbiAgICBDYWNoZSAgICAgPSB7fSxcbiAgICB0aW1lb3V0SUQgPSAwLFxuICAgIFV0aWwsIEluZGljYXRvciwgT2JqZWN0QXNzaWduXG5cbmNvbnN0IEFDVElPTl9VUERBVEUgPSAndXBkYXRlP3VrZXk9JyxcbiAgICAgIE1BQyAgICAgICAgICAgPSBLZXkubWFjLFxuICAgICAgSVAgICAgICAgICAgICA9IEtleS5pcFxuXG5PYmplY3RBc3NpZ24gPSBPYmplY3QuYXNzaWduIHx8IGZ1bmN0aW9uICggdGFyZ2V0LCAuLi5taXhpbnMgKSB7XG4gICAgICAgIHRhcmdldCA9IHRhcmdldCB8fCB7fVxuXG4gICAgICAgIG1peGlucy5mb3JFYWNoKCBvYmogPT4ge1xuICAgICAgICAgICAgZm9yICggdmFyIGtleSBpbiBvYmogKSB7XG4gICAgICAgICAgICAgICAgdGFyZ2V0WyBrZXkgXSA9IG9ialsga2V5IF1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSApXG5cbiAgICAgICAgcmV0dXJuIHRhcmdldFxuICAgIH1cblxuSW5kaWNhdG9yID0ge1xuICAgIHN0YXJ0KCB0ZXh0ID0gJ3dhaXRpbmcnICkge1xuICAgICAgICBjb3VudCA9IDBcbiAgICAgICAgY2xlYXJUaW1lb3V0KCB0aW1lb3V0SUQgKVxuICAgICAgICB0aW1lb3V0SUQgPSBzZXRJbnRlcnZhbCggZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgY291bnQgICAgPSAoIGNvdW50ICsgMSApICUgNVxuICAgICAgICAgICAgbGV0IGRvdHMgPSBuZXcgQXJyYXkoIGNvdW50ICkuam9pbiggJy4nIClcblxuICAgICAgICAgICAgc3Rkb3V0LmNsZWFyTGluZSgpXG4gICAgICAgICAgICBzdGRvdXQuY3Vyc29yVG8oIDAgKVxuICAgICAgICAgICAgc3Rkb3V0LndyaXRlKCB0ZXh0ICsgZG90cyApXG4gICAgICAgIH0sIDMwMCApXG4gICAgfSxcblxuICAgIHN0b3AoKSB7XG4gICAgICAgIGNsZWFyVGltZW91dCggdGltZW91dElEIClcbiAgICAgICAgc3Rkb3V0LmNsZWFyTGluZSgpXG4gICAgICAgIHN0ZG91dC5jdXJzb3JUbyggMCApXG4gICAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFV0aWwgPSB7XG4gICAgaW5kaWNhdG9yIDogSW5kaWNhdG9yLFxuXG4gICAgdXBkYXRlSlNPTkZpbGUoIHBhdGgsIGNvbnRlbnQgKSB7XG4gICAgICAgIGNvbnRlbnQgPSBKU09OLnN0cmluZ2lmeSggT2JqZWN0QXNzaWduKCB7fSwgcmVxdWlyZSggcGF0aCApLCBjb250ZW50ICksIG51bGwsICcgICcgKVxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoICggcmVzb2x2ZSwgcmVqZWN0ICkgPT4ge1xuICAgICAgICAgICAgRlMud3JpdGVGaWxlKCBwYXRoLCBjb250ZW50LCBlcnIgPT4ge1xuICAgICAgICAgICAgICAgIGVyciA/IHJlamVjdCgpIDogcmVzb2x2ZSgpXG4gICAgICAgICAgICB9IClcbiAgICAgICAgfSApXG4gICAgfSxcblxuICAgIGNoZWNrRmlsZUV4aXN0KCBwYXRoICkge1xuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoIHJlc29sdmUgPT4ge1xuICAgICAgICAgICAgRlMuZXhpc3RzKCBwYXRoLCBpc0V4aXN0ID0+IHtcbiAgICAgICAgICAgICAgICByZXNvbHZlKCBpc0V4aXN0IClcbiAgICAgICAgICAgIH0gKVxuICAgICAgICB9IClcbiAgICB9LFxuXG4gICAgZ2V0UG9ydCggYmFzZVBhdGggKSB7XG4gICAgICAgIHJldHVybiByZXF1aXJlKCBiYXNlUGF0aCArIENvbnN0LkZJTEVfRVRDICkub25Qb3J0XG4gICAgfSxcblxuICAgIGdldElQKCkge1xuICAgICAgICB2YXIgaWZhY2VzID0gT1MubmV0d29ya0ludGVyZmFjZXMoKSxcbiAgICAgICAgICAgIHJldCAgICA9IFtdXG5cbiAgICAgICAgZm9yICggdmFyIGRldiBpbiBpZmFjZXMgKSB7XG4gICAgICAgICAgICBpZmFjZXNbIGRldiBdLmZvckVhY2goIGRldGFpbHMgPT4ge1xuICAgICAgICAgICAgICAgIGlmICggZGV0YWlscy5mYW1pbHkgPT0gJ0lQdjQnICYmICFkZXRhaWxzLmludGVybmFsICkge1xuICAgICAgICAgICAgICAgICAgICByZXQucHVzaCggZGV0YWlscy5hZGRyZXNzIClcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IClcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmV0Lmxlbmd0aCA/IHJldFsgMCBdIDogbnVsbFxuICAgIH0sXG5cbiAgICBhc3luYyBnZXRNYWMoKSB7XG4gICAgICAgIHZhciBnZXRNYWNBZGRyZXNzID0gKCkgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKCAoIHJlc29sdmUsIHJlamVjdCApID0+IHtcbiAgICAgICAgICAgICAgICBFeGVjKCBgaWZjb25maWcgZW4wfCBncmVwIGV0aGVyfCBhd2sgJ3twcmludCAkTkZ9J2AsICggZXJyLCBzdGRvdXQgKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICggZXJyIHx8ICFzdGRvdXQgKSA/IHJlamVjdCgpIDogcmVzb2x2ZSggc3Rkb3V0IClcbiAgICAgICAgICAgICAgICB9IClcbiAgICAgICAgICAgIH0gKVxuICAgICAgICB9XG5cbiAgICAgICAgbGV0IG1hYyA9IENhY2hlWyBNQUMgXSB8fCBhd2FpdCBnZXRNYWNBZGRyZXNzKClcblxuICAgICAgICBpZiAoICFtYWMgKSB7XG4gICAgICAgICAgICBsb2coICfojrflj5YgTUFDIOWcsOWdgOWksei0pScsICdlcnJvcicgKVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIENhY2hlWyBNQUMgXSA9IG1hY1xuICAgIH0sXG5cbiAgICBhc3luYyB1cGRhdGVNYWMoIG1hYyApIHtcbiAgICAgICAgbGV0IHJlcyA9IGF3YWl0IFJlcXVlc3QoIEFDVElPTl9VUERBVEUgKyBtYWMgKVxuXG4gICAgICAgIEluZGljYXRvci5zdG9wKClcbiAgICAgICAgaWYgKCByZXMgJiYgcmVzLmNvZGUgPT0gJzAnICkge1xuICAgICAgICAgICAgcmV0dXJuIHRydWVcbiAgICAgICAgfVxuICAgICAgICBsb2coICfmm7TmlrAgSVAg5Zyw5Z2A5aSx6LSlJywgJ2Vycm9yJyApXG4gICAgfSxcblxuICAgIGFzeW5jIHVwZGF0ZVByb3h5KCBwb3J0LCBwYXJhbXMgKSB7XG4gICAgICAgIGxldCBtYWMgPSBhd2FpdCB0aGlzLmdldE1hYygpXG5cbiAgICAgICAgcmV0dXJuIFJlcXVlc3QoIGBob3N0P3BvcnQ9JHtwb3J0fSZ1a2V5PSR7bWFjfSYke3BhcmFtc31gIClcbiAgICB9LFxuXG4gICAgZ2V0Rm9ybWF0RGF0ZSgpIHtcbiAgICAgICAgdmFyIG5vdyAgID0gbmV3IERhdGUsXG4gICAgICAgICAgICB5ZWFyICA9IG5vdy5nZXRGdWxsWWVhcigpLFxuICAgICAgICAgICAgbW9udGggPSBTdHJpbmcoIG5vdy5nZXRNb250aCgpICsgMSApLFxuICAgICAgICAgICAgZGF0ZSAgPSBTdHJpbmcoIG5vdy5nZXREYXRlKCkgKVxuXG4gICAgICAgIG1vbnRoID0gbW9udGgubGVuZ3RoID4gMSA/IG1vbnRoIDogKCAnMCcgKyBtb250aCApXG4gICAgICAgIGRhdGUgID0gZGF0ZS5sZW5ndGggPiAxID8gZGF0ZSA6ICggJzAnICsgZGF0ZSApXG5cbiAgICAgICAgcmV0dXJuIGAke3llYXJ9LyR7bW9udGh9LyR7ZGF0ZX1gXG4gICAgfVxufVxuIl19