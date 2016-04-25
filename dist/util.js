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
                                });
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

                            if (!(res && res[0].updated)) {
                                _context3.next = 5;
                                break;
                            }

                            return _context3.abrupt('return', true);

                        case 5:

                            Indicator.stop();
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
//# sourceMappingURL=data:application/json;base64,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bUNBQ0gsUUFBUyxnQkFBZ0IsR0FBekIsQ0FERzs7QUFBQTtBQUNmLCtCQURlOztBQUFBLGtDQUdkLE9BQU8sSUFBSyxDQUFMLEVBQVMsT0FIRjtBQUFBO0FBQUE7QUFBQTs7QUFBQSw4REFJUixJQUpROztBQUFBOztBQU9uQixzQ0FBVSxJQUFWO0FBQ0EsZ0NBQUssWUFBTCxFQUFtQixPQUFuQjs7QUFSbUI7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFTdEIsS0FsRW1CO0FBb0VkLGVBcEVjLHVCQW9FRCxJQXBFQyxFQW9FSyxNQXBFTCxFQW9FYztBQUFBOztBQUFBO0FBQUEsZ0JBQzFCLEdBRDBCO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLG1DQUNkLE9BQUssTUFBTCxFQURjOztBQUFBO0FBQzFCLCtCQUQwQjtBQUFBLDhEQUd2Qix1QkFBc0IsSUFBdEIsY0FBbUMsR0FBbkMsU0FBMEMsTUFBMUMsQ0FIdUI7O0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFJakMsS0F4RW1CO0FBMEVwQixpQkExRW9CLDJCQTBFSjtBQUNaLFlBQUksTUFBUSxJQUFJLElBQUosRUFBWjtZQUNJLE9BQVEsSUFBSSxXQUFKLEVBRFo7WUFFSSxRQUFRLE9BQVEsSUFBSSxRQUFKLEVBQVIsQ0FGWjtZQUdJLE9BQVEsT0FBUSxJQUFJLE9BQUosRUFBUixDQUhaOztBQUtBLGdCQUFRLE1BQU0sTUFBTixHQUFlLENBQWYsR0FBbUIsS0FBbkIsR0FBNkIsTUFBTSxLQUEzQztBQUNBLGVBQVEsS0FBSyxNQUFMLEdBQWMsQ0FBZCxHQUFrQixJQUFsQixHQUEyQixNQUFNLElBQXpDOztBQUVBLGVBQVUsSUFBVixTQUFrQixLQUFsQixTQUEyQixJQUEzQjtBQUNIO0FBcEZtQixDQUF4QiIsImZpbGUiOiJ1dGlsLmpzIiwic291cmNlc0NvbnRlbnQiOlsibGV0IEZTICAgICAgICA9IHJlcXVpcmUoICdmcycgKSxcbiAgICBFeGVjICAgICAgPSByZXF1aXJlKCAnY2hpbGRfcHJvY2VzcycgKS5leGVjLFxuICAgIFJlcXVlc3QgICA9IHJlcXVpcmUoICcuL3JlcXVlc3QnICksXG4gICAgS2V5ICAgICAgID0gcmVxdWlyZSggJy4va2V5JyApLFxuICAgIENvbnN0ICAgICA9IHJlcXVpcmUoICcuL2NvbnN0JyApLFxuICAgIGNvdW50ICAgICA9IDAsXG4gICAgc3Rkb3V0ICAgID0gcHJvY2Vzcy5zdGRvdXQsXG4gICAgQ2FjaGUgICAgID0ge30sXG4gICAgdGltZW91dElEID0gMCxcbiAgICBVdGlsLCBJbmRpY2F0b3IsIE9iamVjdEFzc2lnblxuXG5jb25zdCBBQ1RJT05fVVBEQVRFID0gJ3VwZGF0ZT91a2V5PScsXG4gICAgICBNQUMgICAgICAgICAgID0gS2V5Lm1hYyxcbiAgICAgIElQICAgICAgICAgICAgPSBLZXkuaXBcblxuT2JqZWN0QXNzaWduID0gT2JqZWN0LmFzc2lnbiB8fCBmdW5jdGlvbiAoIHRhcmdldCwgLi4ubWl4aW5zICkge1xuICAgICAgICB0YXJnZXQgPSB0YXJnZXQgfHwge31cblxuICAgICAgICBtaXhpbnMuZm9yRWFjaCggb2JqID0+IHtcbiAgICAgICAgICAgIGZvciAoIHZhciBrZXkgaW4gb2JqICkge1xuICAgICAgICAgICAgICAgIHRhcmdldFsga2V5IF0gPSBvYmpbIGtleSBdXG4gICAgICAgICAgICB9XG4gICAgICAgIH0gKVxuXG4gICAgICAgIHJldHVybiB0YXJnZXRcbiAgICB9XG5cbkluZGljYXRvciA9IHtcbiAgICBzdGFydCggdGV4dCA9ICd3YWl0aW5nJyApIHtcbiAgICAgICAgY291bnQgPSAwXG4gICAgICAgIGNsZWFyVGltZW91dCggdGltZW91dElEIClcbiAgICAgICAgdGltZW91dElEID0gc2V0SW50ZXJ2YWwoIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGNvdW50ICAgID0gKCBjb3VudCArIDEgKSAlIDVcbiAgICAgICAgICAgIGxldCBkb3RzID0gbmV3IEFycmF5KCBjb3VudCApLmpvaW4oICcuJyApXG5cbiAgICAgICAgICAgIHN0ZG91dC5jbGVhckxpbmUoKVxuICAgICAgICAgICAgc3Rkb3V0LmN1cnNvclRvKCAwIClcbiAgICAgICAgICAgIHN0ZG91dC53cml0ZSggdGV4dCArIGRvdHMgKVxuICAgICAgICB9LCAzMDAgKVxuICAgIH0sXG5cbiAgICBzdG9wKCkge1xuICAgICAgICBjbGVhclRpbWVvdXQoIHRpbWVvdXRJRCApXG4gICAgICAgIHN0ZG91dC5jbGVhckxpbmUoKVxuICAgICAgICBzdGRvdXQuY3Vyc29yVG8oIDAgKVxuICAgIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBVdGlsID0ge1xuICAgIGluZGljYXRvciA6IEluZGljYXRvcixcblxuICAgIHVwZGF0ZUpTT05GaWxlKCBwYXRoLCBjb250ZW50ICkge1xuICAgICAgICBjb250ZW50ID0gSlNPTi5zdHJpbmdpZnkoIE9iamVjdEFzc2lnbigge30sIHJlcXVpcmUoIHBhdGggKSwgY29udGVudCApIClcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKCAoIHJlc29sdmUsIHJlamVjdCApID0+IHtcbiAgICAgICAgICAgIEZTLndyaXRlRmlsZSggcGF0aCwgY29udGVudCwgZXJyID0+IHtcbiAgICAgICAgICAgICAgICBlcnIgPyByZWplY3QoKSA6IHJlc29sdmUoKVxuICAgICAgICAgICAgfSApXG4gICAgICAgIH0gKVxuICAgIH0sXG5cbiAgICBjaGVja0ZpbGVFeGlzdCggcGF0aCApIHtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKCByZXNvbHZlID0+IHtcbiAgICAgICAgICAgIEZTLmV4aXN0cyggcGF0aCwgaXNFeGlzdCA9PiB7XG4gICAgICAgICAgICAgICAgcmVzb2x2ZSggaXNFeGlzdCApXG4gICAgICAgICAgICB9IClcbiAgICAgICAgfSApXG4gICAgfSxcblxuICAgIGdldFBvcnQoIGJhc2VQYXRoICkge1xuICAgICAgICByZXR1cm4gcmVxdWlyZSggYmFzZVBhdGggKyBDb25zdC5GSUxFX0VUQyApLm9uUG9ydFxuICAgIH0sXG5cbiAgICBhc3luYyBnZXRJUCgpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKCAoIHJlc29sdmUsIHJlamVjdCApID0+IHtcbiAgICAgICAgICAgIEV4ZWMoIGBpZmNvbmZpZyBlbjB8IGdyZXAgaW5ldHwgYXdrICd7cHJpbnQgJE5GfSdgLCAoIGVyciwgc3Rkb3V0ICkgPT4ge1xuICAgICAgICAgICAgICAgICggZXJyIHx8ICFzdGRvdXQgKSA/IHJlamVjdCgpIDogcmVzb2x2ZSggc3Rkb3V0IClcbiAgICAgICAgICAgIH0gKVxuICAgICAgICB9ICkudGhlbiggc3RyID0+IHtcbiAgICAgICAgICAgIHZhciBpcHMgPSBzdHIudHJpbSgpLnNwbGl0KCAvXFxzL20gKSxcbiAgICAgICAgICAgICAgICByaXAgPSAvKD86XFxkezEsM31cXC4pezN9XFxkezEsM30vXG5cbiAgICAgICAgICAgIHJldHVybiBpcHMuZmlsdGVyKCBpcCA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJpcC50ZXN0KCBpcCApXG4gICAgICAgICAgICB9IClcbiAgICAgICAgfSApXG4gICAgfSxcblxuICAgIGFzeW5jIGdldE1hYygpIHtcbiAgICAgICAgdmFyIGdldE1hY0FkZHJlc3MgPSAoKSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoICggcmVzb2x2ZSwgcmVqZWN0ICkgPT4ge1xuICAgICAgICAgICAgICAgIEV4ZWMoIGBpZmNvbmZpZyBlbjB8IGdyZXAgZXRoZXJ8IGF3ayAne3ByaW50ICRORn0nYCwgKCBlcnIsIHN0ZG91dCApID0+IHtcbiAgICAgICAgICAgICAgICAgICAgKCBlcnIgfHwgIXN0ZG91dCApID8gcmVqZWN0KCkgOiByZXNvbHZlKCBzdGRvdXQgKVxuICAgICAgICAgICAgICAgIH0gKVxuICAgICAgICAgICAgfSApXG4gICAgICAgIH1cblxuICAgICAgICBsZXQgbWFjID0gQ2FjaGVbIE1BQyBdIHx8IGF3YWl0IGdldE1hY0FkZHJlc3MoKVxuXG4gICAgICAgIGlmICggIW1hYyApIHtcbiAgICAgICAgICAgIGxvZyggJ+iOt+WPliBNQUMg5Zyw5Z2A5aSx6LSlJywgJ2Vycm9yJyApXG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gQ2FjaGVbIE1BQyBdID0gbWFjXG4gICAgfSxcblxuICAgIGFzeW5jIHVwZGF0ZU1hYyggbWFjICkge1xuICAgICAgICBsZXQgcmVzID0gYXdhaXQgUmVxdWVzdCggQUNUSU9OX1VQREFURSArIG1hYyApXG5cbiAgICAgICAgaWYgKCByZXMgJiYgcmVzWyAwIF0udXBkYXRlZCApIHtcbiAgICAgICAgICAgIHJldHVybiB0cnVlXG4gICAgICAgIH1cblxuICAgICAgICBJbmRpY2F0b3Iuc3RvcCgpXG4gICAgICAgIGxvZyggJ+abtOaWsCBJUCDlnLDlnYDlpLHotKUnLCAnZXJyb3InIClcbiAgICB9LFxuXG4gICAgYXN5bmMgdXBkYXRlUHJveHkoIHBvcnQsIHBhcmFtcyApIHtcbiAgICAgICAgbGV0IG1hYyA9IGF3YWl0IHRoaXMuZ2V0TWFjKClcblxuICAgICAgICByZXR1cm4gUmVxdWVzdCggYGhvc3Q/cG9ydD0ke3BvcnR9JnVrZXk9JHttYWN9JiR7cGFyYW1zfWAgKVxuICAgIH0sXG5cbiAgICBnZXRGb3JtYXREYXRlKCkge1xuICAgICAgICB2YXIgbm93ICAgPSBuZXcgRGF0ZSxcbiAgICAgICAgICAgIHllYXIgID0gbm93LmdldEZ1bGxZZWFyKCksXG4gICAgICAgICAgICBtb250aCA9IFN0cmluZyggbm93LmdldE1vbnRoKCkgKSxcbiAgICAgICAgICAgIGRhdGUgID0gU3RyaW5nKCBub3cuZ2V0RGF0ZSgpIClcblxuICAgICAgICBtb250aCA9IG1vbnRoLmxlbmd0aCA+IDEgPyBtb250aCA6ICggJzAnICsgbW9udGggKVxuICAgICAgICBkYXRlICA9IGRhdGUubGVuZ3RoID4gMSA/IGRhdGUgOiAoICcwJyArIGRhdGUgKVxuXG4gICAgICAgIHJldHVybiBgJHt5ZWFyfS8ke21vbnRofS8ke2RhdGV9YFxuICAgIH1cbn1cbiJdfQ==