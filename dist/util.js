'use strict';

var _bluebird = require('bluebird');

var Promise = require('bluebird'),
    ObjectAssign = require('object-assign'),
    GetMac = Promise.promisifyAll(require('getmac')),
    Got = Promise.promisifyAll(require('got')),
    FS = Promise.promisifyAll(require('fs')),
    Key = require('./key'),
    Const = require('./const'),
    count = 0,
    stdout = process.stdout,
    Cache = {},
    Util = undefined,
    Indicator = undefined,
    timeoutID = undefined;

var URL_SERVER = Const.URL_SERVER,
    ACTION_UPDATE = 'update?ukey=',
    MAC = Key.mac,
    IP = Key.ip,
    TIMEOUT = 5000;

Indicator = {
    start: function start() {
        var text = arguments.length <= 0 || arguments[0] === undefined ? 'waiting' : arguments[0];

        count = 0;
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
        return FS.writeFileAsync(path, content);
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
                            return Got.getAsync(URL_SERVER + IP, {
                                timeout: TIMEOUT
                            });

                        case 2:
                            result = _context.sent;
                            return _context.abrupt('return', result[0]);

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
            var mac;
            return regeneratorRuntime.wrap(function _callee2$(_context2) {
                while (1) {
                    switch (_context2.prev = _context2.next) {
                        case 0:
                            _context2.t0 = Cache[MAC];

                            if (_context2.t0) {
                                _context2.next = 5;
                                break;
                            }

                            _context2.next = 4;
                            return GetMac.getMacAsync();

                        case 4:
                            _context2.t0 = _context2.sent;

                        case 5:
                            mac = _context2.t0;

                            if (!mac) {
                                log('获取 MAC 地址失败', 'error');
                            }

                            return _context2.abrupt('return', Cache[MAC] = mac);

                        case 8:
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
                            return Got.getAsync(URL_SERVER + ACTION_UPDATE + mac, {
                                json: true,
                                timeout: TIMEOUT
                            });

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
            var mac, url;
            return regeneratorRuntime.wrap(function _callee4$(_context4) {
                while (1) {
                    switch (_context4.prev = _context4.next) {
                        case 0:
                            _context4.next = 2;
                            return _this4.getMac();

                        case 2:
                            mac = _context4.sent;
                            url = URL_SERVER + 'host?port=' + port + '&ukey=' + mac + '&' + params;
                            return _context4.abrupt('return', Got.getAsync(url, {
                                timeout: TIMEOUT
                            }));

                        case 5:
                        case 'end':
                            return _context4.stop();
                    }
                }
            }, _callee4, _this4);
        }))();
    }
};
//# sourceMappingURL=data:application/json;base64,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RTs7Ozs7Ozs7O0tBQ1Y7Q0FDSixDQUFBIiwiZmlsZSI6InV0aWwuanMiLCJzb3VyY2VzQ29udGVudCI6WyJsZXQgUHJvbWlzZSAgICAgID0gcmVxdWlyZSggJ2JsdWViaXJkJyApLFxuICAgIE9iamVjdEFzc2lnbiA9IHJlcXVpcmUoICdvYmplY3QtYXNzaWduJyApLFxuICAgIEdldE1hYyAgICAgICA9IFByb21pc2UucHJvbWlzaWZ5QWxsKCByZXF1aXJlKCAnZ2V0bWFjJyApICksXG4gICAgR290ICAgICAgICAgID0gUHJvbWlzZS5wcm9taXNpZnlBbGwoIHJlcXVpcmUoICdnb3QnICkgKSxcbiAgICBGUyAgICAgICAgICAgPSBQcm9taXNlLnByb21pc2lmeUFsbCggcmVxdWlyZSggJ2ZzJyApICksXG4gICAgS2V5ICAgICAgICAgID0gcmVxdWlyZSggJy4va2V5JyApLFxuICAgIENvbnN0ICAgICAgICA9IHJlcXVpcmUoICcuL2NvbnN0JyApLFxuICAgIGNvdW50ICAgICAgICA9IDAsXG4gICAgc3Rkb3V0ICAgICAgID0gcHJvY2Vzcy5zdGRvdXQsXG4gICAgQ2FjaGUgICAgICAgID0ge30sXG4gICAgVXRpbCwgSW5kaWNhdG9yLCB0aW1lb3V0SURcblxuY29uc3QgVVJMX1NFUlZFUiAgICA9IENvbnN0LlVSTF9TRVJWRVIsXG4gICAgICBBQ1RJT05fVVBEQVRFID0gJ3VwZGF0ZT91a2V5PScsXG4gICAgICBNQUMgICAgICAgICAgID0gS2V5Lm1hYyxcbiAgICAgIElQICAgICAgICAgICAgPSBLZXkuaXAsXG4gICAgICBUSU1FT1VUICAgICAgID0gNTAwMFxuXG5JbmRpY2F0b3IgPSB7XG4gICAgc3RhcnQoIHRleHQgPSAnd2FpdGluZycgKSB7XG4gICAgICAgIGNvdW50ICAgICA9IDBcbiAgICAgICAgdGltZW91dElEID0gc2V0SW50ZXJ2YWwoIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgY291bnQgICAgPSAoIGNvdW50ICsgMSApICUgNVxuICAgICAgICAgICAgbGV0IGRvdHMgPSBuZXcgQXJyYXkoIGNvdW50ICkuam9pbiggJy4nIClcblxuICAgICAgICAgICAgc3Rkb3V0LmNsZWFyTGluZSgpXG4gICAgICAgICAgICBzdGRvdXQuY3Vyc29yVG8oIDAgKVxuICAgICAgICAgICAgc3Rkb3V0LndyaXRlKCB0ZXh0ICsgZG90cyApXG4gICAgICAgIH0sIDMwMCApXG4gICAgfSxcblxuICAgIHN0b3AoKSB7XG4gICAgICAgIGNsZWFyVGltZW91dCggdGltZW91dElEIClcbiAgICAgICAgc3Rkb3V0LmNsZWFyTGluZSgpXG4gICAgICAgIHN0ZG91dC5jdXJzb3JUbyggMCApXG4gICAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFV0aWwgPSB7XG4gICAgaW5kaWNhdG9yOiBJbmRpY2F0b3IsXG5cbiAgICB1cGRhdGVKU09ORmlsZSggcGF0aCwgY29udGVudCApIHtcbiAgICAgICAgY29udGVudCA9IEpTT04uc3RyaW5naWZ5KCBPYmplY3RBc3NpZ24oIHt9LCByZXF1aXJlKCBwYXRoICksIGNvbnRlbnQgKSApXG4gICAgICAgIHJldHVybiBGUy53cml0ZUZpbGVBc3luYyggcGF0aCwgY29udGVudCApXG4gICAgfSxcblxuICAgIGNoZWNrRmlsZUV4aXN0KCBwYXRoICkge1xuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoIHJlc29sdmUgPT4ge1xuICAgICAgICAgICAgRlMuZXhpc3RzKCBwYXRoLCBpc0V4aXN0ID0+IHtcbiAgICAgICAgICAgICAgICByZXNvbHZlKCBpc0V4aXN0IClcbiAgICAgICAgICAgIH0gKVxuICAgICAgICB9IClcbiAgICB9LFxuXG4gICAgZ2V0UG9ydCggYmFzZVBhdGggKSB7XG4gICAgICAgIHJldHVybiByZXF1aXJlKCBiYXNlUGF0aCArIENvbnN0LkZJTEVfRVRDICkub25Qb3J0XG4gICAgfSxcblxuICAgIGFzeW5jIGdldElQKCkge1xuICAgICAgICBsZXQgcmVzdWx0ID0gYXdhaXQgR290LmdldEFzeW5jKCBVUkxfU0VSVkVSICsgSVAsIHtcbiAgICAgICAgICAgIHRpbWVvdXQ6IFRJTUVPVVRcbiAgICAgICAgfSApXG5cbiAgICAgICAgcmV0dXJuIHJlc3VsdFsgMCBdXG4gICAgfSxcblxuICAgIGFzeW5jIGdldE1hYygpIHtcbiAgICAgICAgbGV0IG1hYyA9IENhY2hlWyBNQUMgXSB8fCBhd2FpdCBHZXRNYWMuZ2V0TWFjQXN5bmMoKVxuXG4gICAgICAgIGlmICggIW1hYyApIHtcbiAgICAgICAgICAgIGxvZyggJ+iOt+WPliBNQUMg5Zyw5Z2A5aSx6LSlJywgJ2Vycm9yJyApXG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gQ2FjaGVbIE1BQyBdID0gbWFjXG4gICAgfSxcblxuICAgIGFzeW5jIHVwZGF0ZU1hYyggbWFjICkge1xuICAgICAgICBsZXQgcmVzID0gYXdhaXQgR290LmdldEFzeW5jKCBVUkxfU0VSVkVSICsgQUNUSU9OX1VQREFURSArIG1hYywge1xuICAgICAgICAgICAganNvbjogICAgdHJ1ZSxcbiAgICAgICAgICAgIHRpbWVvdXQ6IFRJTUVPVVRcbiAgICAgICAgfSApXG5cbiAgICAgICAgaWYgKCByZXMgJiYgcmVzWyAwIF0udXBkYXRlZCApIHtcbiAgICAgICAgICAgIHJldHVybiB0cnVlXG4gICAgICAgIH1cblxuICAgICAgICBJbmRpY2F0b3Iuc3RvcCgpXG4gICAgICAgIGxvZyggJ+abtOaWsCBJUCDlnLDlnYDlpLHotKUnLCAnZXJyb3InIClcbiAgICB9LFxuXG4gICAgYXN5bmMgdXBkYXRlUHJveHkoIHBvcnQsIHBhcmFtcyApIHtcbiAgICAgICAgbGV0IG1hYyA9IGF3YWl0IHRoaXMuZ2V0TWFjKCksXG4gICAgICAgICAgICB1cmwgPSBgJHtVUkxfU0VSVkVSfWhvc3Q/cG9ydD0ke3BvcnR9JnVrZXk9JHttYWN9JiR7cGFyYW1zfWBcblxuICAgICAgICByZXR1cm4gR290XG4gICAgICAgICAgICAuZ2V0QXN5bmMoIHVybCwge1xuICAgICAgICAgICAgICAgIHRpbWVvdXQ6IFRJTUVPVVRcbiAgICAgICAgICAgIH0gKVxuICAgIH1cbn1cbiJdfQ==