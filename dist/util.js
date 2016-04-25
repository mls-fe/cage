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

var ACTION_UPDATE = '/update?ukey=',
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
        content = JSON.stringify(ObjectAssign({}, require(path), content));
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
        var _this = this;

        return (0, _bluebird.coroutine)(regeneratorRuntime.mark(function _callee() {
            return regeneratorRuntime.wrap(function _callee$(_context) {
                while (1) {
                    switch (_context.prev = _context.next) {
                        case 0:
                            return _context.abrupt('return', new Promise(function (resolve, reject) {
                                Exec('ifconfig en0| grep inet| awk \'{print $NF}\'', function (err, stdout) {
                                    err || !stdout ? reject() : resolve(stdout);
                                });
                            }).then(function (str) {
                                var ips = str.trim().split(/\s/m),
                                    rip = /(?:\d{1,3}\.){3}\d{1,3}/;

                                return ips.filter(function (ip) {
                                    return rip.test(ip);
                                })[0];
                            }));

                        case 1:
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
                                        err || !stdout ? reject() : resolve(stdout);
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
            month = String(now.getMonth()),
            date = String(now.getDate());

        month = month.length > 1 ? month : '0' + month;
        date = date.length > 1 ? date : '0' + date;

        return year + '/' + month + '/' + date;
    }
};
//# sourceMappingURL=data:application/json;base64,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QUFBQTtBQUFBLG1DQUNILFFBQVMsZ0JBQWdCLEdBQXpCLENBREc7O0FBQUE7QUFDZiwrQkFEZTs7O0FBR25CLHNDQUFVLElBQVY7O0FBSG1CLGtDQUlkLE9BQU8sSUFBSSxJQUFKLElBQVksR0FKTDtBQUFBO0FBQUE7QUFBQTs7QUFBQSw4REFLUixJQUxROztBQUFBO0FBT25CLGdDQUFLLFlBQUwsRUFBbUIsT0FBbkI7O0FBUG1CO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBUXRCLEtBakVtQjtBQW1FZCxlQW5FYyx1QkFtRUQsSUFuRUMsRUFtRUssTUFuRUwsRUFtRWM7QUFBQTs7QUFBQTtBQUFBLGdCQUMxQixHQUQwQjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxtQ0FDZCxPQUFLLE1BQUwsRUFEYzs7QUFBQTtBQUMxQiwrQkFEMEI7QUFBQSw4REFHdkIsdUJBQXNCLElBQXRCLGNBQW1DLEdBQW5DLFNBQTBDLE1BQTFDLENBSHVCOztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBSWpDLEtBdkVtQjtBQXlFcEIsaUJBekVvQiwyQkF5RUo7QUFDWixZQUFJLE1BQVEsSUFBSSxJQUFKLEVBQVo7WUFDSSxPQUFRLElBQUksV0FBSixFQURaO1lBRUksUUFBUSxPQUFRLElBQUksUUFBSixFQUFSLENBRlo7WUFHSSxPQUFRLE9BQVEsSUFBSSxPQUFKLEVBQVIsQ0FIWjs7QUFLQSxnQkFBUSxNQUFNLE1BQU4sR0FBZSxDQUFmLEdBQW1CLEtBQW5CLEdBQTZCLE1BQU0sS0FBM0M7QUFDQSxlQUFRLEtBQUssTUFBTCxHQUFjLENBQWQsR0FBa0IsSUFBbEIsR0FBMkIsTUFBTSxJQUF6Qzs7QUFFQSxlQUFVLElBQVYsU0FBa0IsS0FBbEIsU0FBMkIsSUFBM0I7QUFDSDtBQW5GbUIsQ0FBeEIiLCJmaWxlIjoidXRpbC5qcyIsInNvdXJjZXNDb250ZW50IjpbImxldCBGUyAgICAgICAgPSByZXF1aXJlKCAnZnMnICksXG4gICAgRXhlYyAgICAgID0gcmVxdWlyZSggJ2NoaWxkX3Byb2Nlc3MnICkuZXhlYyxcbiAgICBSZXF1ZXN0ICAgPSByZXF1aXJlKCAnLi9yZXF1ZXN0JyApLFxuICAgIEtleSAgICAgICA9IHJlcXVpcmUoICcuL2tleScgKSxcbiAgICBDb25zdCAgICAgPSByZXF1aXJlKCAnLi9jb25zdCcgKSxcbiAgICBjb3VudCAgICAgPSAwLFxuICAgIHN0ZG91dCAgICA9IHByb2Nlc3Muc3Rkb3V0LFxuICAgIENhY2hlICAgICA9IHt9LFxuICAgIHRpbWVvdXRJRCA9IDAsXG4gICAgVXRpbCwgSW5kaWNhdG9yLCBPYmplY3RBc3NpZ25cblxuY29uc3QgQUNUSU9OX1VQREFURSA9ICcvdXBkYXRlP3VrZXk9JyxcbiAgICAgIE1BQyAgICAgICAgICAgPSBLZXkubWFjLFxuICAgICAgSVAgICAgICAgICAgICA9IEtleS5pcFxuXG5PYmplY3RBc3NpZ24gPSBPYmplY3QuYXNzaWduIHx8IGZ1bmN0aW9uICggdGFyZ2V0LCAuLi5taXhpbnMgKSB7XG4gICAgICAgIHRhcmdldCA9IHRhcmdldCB8fCB7fVxuXG4gICAgICAgIG1peGlucy5mb3JFYWNoKCBvYmogPT4ge1xuICAgICAgICAgICAgZm9yICggdmFyIGtleSBpbiBvYmogKSB7XG4gICAgICAgICAgICAgICAgdGFyZ2V0WyBrZXkgXSA9IG9ialsga2V5IF1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSApXG5cbiAgICAgICAgcmV0dXJuIHRhcmdldFxuICAgIH1cblxuSW5kaWNhdG9yID0ge1xuICAgIHN0YXJ0KCB0ZXh0ID0gJ3dhaXRpbmcnICkge1xuICAgICAgICBjb3VudCA9IDBcbiAgICAgICAgY2xlYXJUaW1lb3V0KCB0aW1lb3V0SUQgKVxuICAgICAgICB0aW1lb3V0SUQgPSBzZXRJbnRlcnZhbCggZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgY291bnQgICAgPSAoIGNvdW50ICsgMSApICUgNVxuICAgICAgICAgICAgbGV0IGRvdHMgPSBuZXcgQXJyYXkoIGNvdW50ICkuam9pbiggJy4nIClcblxuICAgICAgICAgICAgc3Rkb3V0LmNsZWFyTGluZSgpXG4gICAgICAgICAgICBzdGRvdXQuY3Vyc29yVG8oIDAgKVxuICAgICAgICAgICAgc3Rkb3V0LndyaXRlKCB0ZXh0ICsgZG90cyApXG4gICAgICAgIH0sIDMwMCApXG4gICAgfSxcblxuICAgIHN0b3AoKSB7XG4gICAgICAgIGNsZWFyVGltZW91dCggdGltZW91dElEIClcbiAgICAgICAgc3Rkb3V0LmNsZWFyTGluZSgpXG4gICAgICAgIHN0ZG91dC5jdXJzb3JUbyggMCApXG4gICAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFV0aWwgPSB7XG4gICAgaW5kaWNhdG9yIDogSW5kaWNhdG9yLFxuXG4gICAgdXBkYXRlSlNPTkZpbGUoIHBhdGgsIGNvbnRlbnQgKSB7XG4gICAgICAgIGNvbnRlbnQgPSBKU09OLnN0cmluZ2lmeSggT2JqZWN0QXNzaWduKCB7fSwgcmVxdWlyZSggcGF0aCApLCBjb250ZW50ICkgKVxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoICggcmVzb2x2ZSwgcmVqZWN0ICkgPT4ge1xuICAgICAgICAgICAgRlMud3JpdGVGaWxlKCBwYXRoLCBjb250ZW50LCBlcnIgPT4ge1xuICAgICAgICAgICAgICAgIGVyciA/IHJlamVjdCgpIDogcmVzb2x2ZSgpXG4gICAgICAgICAgICB9IClcbiAgICAgICAgfSApXG4gICAgfSxcblxuICAgIGNoZWNrRmlsZUV4aXN0KCBwYXRoICkge1xuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoIHJlc29sdmUgPT4ge1xuICAgICAgICAgICAgRlMuZXhpc3RzKCBwYXRoLCBpc0V4aXN0ID0+IHtcbiAgICAgICAgICAgICAgICByZXNvbHZlKCBpc0V4aXN0IClcbiAgICAgICAgICAgIH0gKVxuICAgICAgICB9IClcbiAgICB9LFxuXG4gICAgZ2V0UG9ydCggYmFzZVBhdGggKSB7XG4gICAgICAgIHJldHVybiByZXF1aXJlKCBiYXNlUGF0aCArIENvbnN0LkZJTEVfRVRDICkub25Qb3J0XG4gICAgfSxcblxuICAgIGFzeW5jIGdldElQKCkge1xuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoICggcmVzb2x2ZSwgcmVqZWN0ICkgPT4ge1xuICAgICAgICAgICAgRXhlYyggYGlmY29uZmlnIGVuMHwgZ3JlcCBpbmV0fCBhd2sgJ3twcmludCAkTkZ9J2AsICggZXJyLCBzdGRvdXQgKSA9PiB7XG4gICAgICAgICAgICAgICAgKCBlcnIgfHwgIXN0ZG91dCApID8gcmVqZWN0KCkgOiByZXNvbHZlKCBzdGRvdXQgKVxuICAgICAgICAgICAgfSApXG4gICAgICAgIH0gKS50aGVuKCBzdHIgPT4ge1xuICAgICAgICAgICAgdmFyIGlwcyA9IHN0ci50cmltKCkuc3BsaXQoIC9cXHMvbSApLFxuICAgICAgICAgICAgICAgIHJpcCA9IC8oPzpcXGR7MSwzfVxcLil7M31cXGR7MSwzfS9cblxuICAgICAgICAgICAgcmV0dXJuIGlwcy5maWx0ZXIoIGlwID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmlwLnRlc3QoIGlwIClcbiAgICAgICAgICAgIH0gKVsgMCBdXG4gICAgICAgIH0gKVxuICAgIH0sXG5cbiAgICBhc3luYyBnZXRNYWMoKSB7XG4gICAgICAgIHZhciBnZXRNYWNBZGRyZXNzID0gKCkgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKCAoIHJlc29sdmUsIHJlamVjdCApID0+IHtcbiAgICAgICAgICAgICAgICBFeGVjKCBgaWZjb25maWcgZW4wfCBncmVwIGV0aGVyfCBhd2sgJ3twcmludCAkTkZ9J2AsICggZXJyLCBzdGRvdXQgKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICggZXJyIHx8ICFzdGRvdXQgKSA/IHJlamVjdCgpIDogcmVzb2x2ZSggc3Rkb3V0IClcbiAgICAgICAgICAgICAgICB9IClcbiAgICAgICAgICAgIH0gKVxuICAgICAgICB9XG5cbiAgICAgICAgbGV0IG1hYyA9IENhY2hlWyBNQUMgXSB8fCBhd2FpdCBnZXRNYWNBZGRyZXNzKClcblxuICAgICAgICBpZiAoICFtYWMgKSB7XG4gICAgICAgICAgICBsb2coICfojrflj5YgTUFDIOWcsOWdgOWksei0pScsICdlcnJvcicgKVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIENhY2hlWyBNQUMgXSA9IG1hY1xuICAgIH0sXG5cbiAgICBhc3luYyB1cGRhdGVNYWMoIG1hYyApIHtcbiAgICAgICAgbGV0IHJlcyA9IGF3YWl0IFJlcXVlc3QoIEFDVElPTl9VUERBVEUgKyBtYWMgKVxuXG4gICAgICAgIEluZGljYXRvci5zdG9wKClcbiAgICAgICAgaWYgKCByZXMgJiYgcmVzLmNvZGUgPT0gJzAnICkge1xuICAgICAgICAgICAgcmV0dXJuIHRydWVcbiAgICAgICAgfVxuICAgICAgICBsb2coICfmm7TmlrAgSVAg5Zyw5Z2A5aSx6LSlJywgJ2Vycm9yJyApXG4gICAgfSxcblxuICAgIGFzeW5jIHVwZGF0ZVByb3h5KCBwb3J0LCBwYXJhbXMgKSB7XG4gICAgICAgIGxldCBtYWMgPSBhd2FpdCB0aGlzLmdldE1hYygpXG5cbiAgICAgICAgcmV0dXJuIFJlcXVlc3QoIGBob3N0P3BvcnQ9JHtwb3J0fSZ1a2V5PSR7bWFjfSYke3BhcmFtc31gIClcbiAgICB9LFxuXG4gICAgZ2V0Rm9ybWF0RGF0ZSgpIHtcbiAgICAgICAgdmFyIG5vdyAgID0gbmV3IERhdGUsXG4gICAgICAgICAgICB5ZWFyICA9IG5vdy5nZXRGdWxsWWVhcigpLFxuICAgICAgICAgICAgbW9udGggPSBTdHJpbmcoIG5vdy5nZXRNb250aCgpICksXG4gICAgICAgICAgICBkYXRlICA9IFN0cmluZyggbm93LmdldERhdGUoKSApXG5cbiAgICAgICAgbW9udGggPSBtb250aC5sZW5ndGggPiAxID8gbW9udGggOiAoICcwJyArIG1vbnRoIClcbiAgICAgICAgZGF0ZSAgPSBkYXRlLmxlbmd0aCA+IDEgPyBkYXRlIDogKCAnMCcgKyBkYXRlIClcblxuICAgICAgICByZXR1cm4gYCR7eWVhcn0vJHttb250aH0vJHtkYXRlfWBcbiAgICB9XG59XG4iXX0=