'use strict';

var _bluebird = require('bluebird');

var Promise = require('bluebird'),
    ObjectAssign = require('object-assign'),
    FS_ORIGIN = require('fs'),
    GetMac = Promise.promisifyAll(require('getmac')),
    Got = Promise.promisifyAll(require('got')),
    FS = Promise.promisifyAll(FS_ORIGIN),
    Key = require('./key'),
    Const = require('./const'),
    count = 0,
    stdout = process.stdout,
    Cache = {},
    timeoutID = 0,
    Util = undefined,
    Indicator = undefined;

var URL_SERVER = Const.URL_SERVER,
    ACTION_UPDATE = 'update?ukey=',
    MAC = Key.mac,
    IP = Key.ip,
    TIMEOUT = 5000;

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
                            log(URL_SERVER + IP, 'debug');
                            _context.next = 3;
                            return Got.getAsync(URL_SERVER + IP, {
                                timeout: TIMEOUT
                            });

                        case 3:
                            result = _context.sent;
                            return _context.abrupt('return', result[0]);

                        case 5:
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
                            log(URL_SERVER + ACTION_UPDATE + mac, 'debug');
                            _context3.next = 3;
                            return Got.getAsync(URL_SERVER + ACTION_UPDATE + mac, {
                                json: true,
                                timeout: TIMEOUT
                            });

                        case 3:
                            res = _context3.sent;

                            if (!(res && res[0].updated)) {
                                _context3.next = 6;
                                break;
                            }

                            return _context3.abrupt('return', true);

                        case 6:

                            Indicator.stop();
                            log('更新 IP 地址失败', 'error');

                        case 8:
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

                            log(url, 'debug');

                            return _context4.abrupt('return', Got.getAsync(url, {
                                timeout: TIMEOUT
                            }));

                        case 6:
                        case 'end':
                            return _context4.stop();
                    }
                }
            }, _callee4, _this4);
        }))();
    }
};
//# sourceMappingURL=data:application/json;base64,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RyxFQUNILEdBQUc7Ozs7OzttQ0FEUyxPQUFLLE1BQU0sRUFBRTs7O0FBQXpCLCtCQUFHO0FBQ0gsK0JBQUcsR0FBTSxVQUFVLGtCQUFhLElBQUksY0FBUyxHQUFHLFNBQUksTUFBTTs7QUFFOUQsK0JBQUcsQ0FBRSxHQUFHLEVBQUUsT0FBTyxDQUFFLENBQUE7OzhEQUVaLEdBQUcsQ0FDTCxRQUFRLENBQUUsR0FBRyxFQUFFO0FBQ1osdUNBQU8sRUFBRyxPQUFPOzZCQUNwQixDQUFFOzs7Ozs7Ozs7S0FDVjtDQUNKLENBQUEiLCJmaWxlIjoidXRpbC5qcyIsInNvdXJjZXNDb250ZW50IjpbImxldCBQcm9taXNlICAgICAgPSByZXF1aXJlKCAnYmx1ZWJpcmQnICksXG4gICAgT2JqZWN0QXNzaWduID0gcmVxdWlyZSggJ29iamVjdC1hc3NpZ24nICksXG4gICAgRlNfT1JJR0lOICAgID0gcmVxdWlyZSggJ2ZzJyApLFxuICAgIEdldE1hYyAgICAgICA9IFByb21pc2UucHJvbWlzaWZ5QWxsKCByZXF1aXJlKCAnZ2V0bWFjJyApICksXG4gICAgR290ICAgICAgICAgID0gUHJvbWlzZS5wcm9taXNpZnlBbGwoIHJlcXVpcmUoICdnb3QnICkgKSxcbiAgICBGUyAgICAgICAgICAgPSBQcm9taXNlLnByb21pc2lmeUFsbCggRlNfT1JJR0lOICksXG4gICAgS2V5ICAgICAgICAgID0gcmVxdWlyZSggJy4va2V5JyApLFxuICAgIENvbnN0ICAgICAgICA9IHJlcXVpcmUoICcuL2NvbnN0JyApLFxuICAgIGNvdW50ICAgICAgICA9IDAsXG4gICAgc3Rkb3V0ICAgICAgID0gcHJvY2Vzcy5zdGRvdXQsXG4gICAgQ2FjaGUgICAgICAgID0ge30sXG4gICAgdGltZW91dElEICAgID0gMCxcbiAgICBVdGlsLCBJbmRpY2F0b3JcblxuY29uc3QgVVJMX1NFUlZFUiAgICA9IENvbnN0LlVSTF9TRVJWRVIsXG4gICAgICBBQ1RJT05fVVBEQVRFID0gJ3VwZGF0ZT91a2V5PScsXG4gICAgICBNQUMgICAgICAgICAgID0gS2V5Lm1hYyxcbiAgICAgIElQICAgICAgICAgICAgPSBLZXkuaXAsXG4gICAgICBUSU1FT1VUICAgICAgID0gNTAwMFxuXG5JbmRpY2F0b3IgPSB7XG4gICAgc3RhcnQoIHRleHQgPSAnd2FpdGluZycgKSB7XG4gICAgICAgIGNvdW50ID0gMFxuICAgICAgICBjbGVhclRpbWVvdXQoIHRpbWVvdXRJRCApXG4gICAgICAgIHRpbWVvdXRJRCA9IHNldEludGVydmFsKCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBjb3VudCAgICA9ICggY291bnQgKyAxICkgJSA1XG4gICAgICAgICAgICBsZXQgZG90cyA9IG5ldyBBcnJheSggY291bnQgKS5qb2luKCAnLicgKVxuXG4gICAgICAgICAgICBzdGRvdXQuY2xlYXJMaW5lKClcbiAgICAgICAgICAgIHN0ZG91dC5jdXJzb3JUbyggMCApXG4gICAgICAgICAgICBzdGRvdXQud3JpdGUoIHRleHQgKyBkb3RzIClcbiAgICAgICAgfSwgMzAwIClcbiAgICB9LFxuXG4gICAgc3RvcCgpIHtcbiAgICAgICAgY2xlYXJUaW1lb3V0KCB0aW1lb3V0SUQgKVxuICAgICAgICBzdGRvdXQuY2xlYXJMaW5lKClcbiAgICAgICAgc3Rkb3V0LmN1cnNvclRvKCAwIClcbiAgICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gVXRpbCA9IHtcbiAgICBpbmRpY2F0b3IgOiBJbmRpY2F0b3IsXG5cbiAgICB1cGRhdGVKU09ORmlsZSggcGF0aCwgY29udGVudCApIHtcbiAgICAgICAgY29udGVudCA9IEpTT04uc3RyaW5naWZ5KCBPYmplY3RBc3NpZ24oIHt9LCByZXF1aXJlKCBwYXRoICksIGNvbnRlbnQgKSApXG4gICAgICAgIHJldHVybiBGUy53cml0ZUZpbGVBc3luYyggcGF0aCwgY29udGVudCApXG4gICAgfSxcblxuICAgIGNoZWNrRmlsZUV4aXN0KCBwYXRoICkge1xuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoIHJlc29sdmUgPT4ge1xuICAgICAgICAgICAgRlMuZXhpc3RzKCBwYXRoLCBpc0V4aXN0ID0+IHtcbiAgICAgICAgICAgICAgICByZXNvbHZlKCBpc0V4aXN0IClcbiAgICAgICAgICAgIH0gKVxuICAgICAgICB9IClcbiAgICB9LFxuXG4gICAgZ2V0UG9ydCggYmFzZVBhdGggKSB7XG4gICAgICAgIHJldHVybiByZXF1aXJlKCBiYXNlUGF0aCArIENvbnN0LkZJTEVfRVRDICkub25Qb3J0XG4gICAgfSxcblxuICAgIGFzeW5jIGdldElQKCkge1xuICAgICAgICBsb2coIFVSTF9TRVJWRVIgKyBJUCwgJ2RlYnVnJyApXG4gICAgICAgIGxldCByZXN1bHQgPSBhd2FpdCBHb3QuZ2V0QXN5bmMoIFVSTF9TRVJWRVIgKyBJUCwge1xuICAgICAgICAgICAgdGltZW91dCA6IFRJTUVPVVRcbiAgICAgICAgfSApXG5cbiAgICAgICAgcmV0dXJuIHJlc3VsdFsgMCBdXG4gICAgfSxcblxuICAgIGFzeW5jIGdldE1hYygpIHtcbiAgICAgICAgbGV0IG1hYyA9IENhY2hlWyBNQUMgXSB8fCBhd2FpdCBHZXRNYWMuZ2V0TWFjQXN5bmMoKVxuXG4gICAgICAgIGlmICggIW1hYyApIHtcbiAgICAgICAgICAgIGxvZyggJ+iOt+WPliBNQUMg5Zyw5Z2A5aSx6LSlJywgJ2Vycm9yJyApXG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gQ2FjaGVbIE1BQyBdID0gbWFjXG4gICAgfSxcblxuICAgIGFzeW5jIHVwZGF0ZU1hYyggbWFjICkge1xuICAgICAgICBsb2coIFVSTF9TRVJWRVIgKyBBQ1RJT05fVVBEQVRFICsgbWFjLCAnZGVidWcnIClcbiAgICAgICAgbGV0IHJlcyA9IGF3YWl0IEdvdC5nZXRBc3luYyggVVJMX1NFUlZFUiArIEFDVElPTl9VUERBVEUgKyBtYWMsIHtcbiAgICAgICAgICAgIGpzb24gICAgOiB0cnVlLFxuICAgICAgICAgICAgdGltZW91dCA6IFRJTUVPVVRcbiAgICAgICAgfSApXG5cbiAgICAgICAgaWYgKCByZXMgJiYgcmVzWyAwIF0udXBkYXRlZCApIHtcbiAgICAgICAgICAgIHJldHVybiB0cnVlXG4gICAgICAgIH1cblxuICAgICAgICBJbmRpY2F0b3Iuc3RvcCgpXG4gICAgICAgIGxvZyggJ+abtOaWsCBJUCDlnLDlnYDlpLHotKUnLCAnZXJyb3InIClcbiAgICB9LFxuXG4gICAgYXN5bmMgdXBkYXRlUHJveHkoIHBvcnQsIHBhcmFtcyApIHtcbiAgICAgICAgbGV0IG1hYyA9IGF3YWl0IHRoaXMuZ2V0TWFjKCksXG4gICAgICAgICAgICB1cmwgPSBgJHtVUkxfU0VSVkVSfWhvc3Q/cG9ydD0ke3BvcnR9JnVrZXk9JHttYWN9JiR7cGFyYW1zfWBcblxuICAgICAgICBsb2coIHVybCwgJ2RlYnVnJyApXG5cbiAgICAgICAgcmV0dXJuIEdvdFxuICAgICAgICAgICAgLmdldEFzeW5jKCB1cmwsIHtcbiAgICAgICAgICAgICAgICB0aW1lb3V0IDogVElNRU9VVFxuICAgICAgICAgICAgfSApXG4gICAgfVxufVxuIl19