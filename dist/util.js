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
                            log(URL_SERVER + ACTION_UPDATE + mac);

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
//# sourceMappingURL=data:application/json;base64,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LFFBQVEsQ0FBRSxHQUFHLEVBQUU7QUFDWix1Q0FBTyxFQUFFLE9BQU87NkJBQ25CLENBQUU7Ozs7Ozs7OztLQUNWO0NBQ0osQ0FBQSIsImZpbGUiOiJ1dGlsLmpzIiwic291cmNlc0NvbnRlbnQiOlsibGV0IFByb21pc2UgICAgICA9IHJlcXVpcmUoICdibHVlYmlyZCcgKSxcbiAgICBPYmplY3RBc3NpZ24gPSByZXF1aXJlKCAnb2JqZWN0LWFzc2lnbicgKSxcbiAgICBHZXRNYWMgICAgICAgPSBQcm9taXNlLnByb21pc2lmeUFsbCggcmVxdWlyZSggJ2dldG1hYycgKSApLFxuICAgIEdvdCAgICAgICAgICA9IFByb21pc2UucHJvbWlzaWZ5QWxsKCByZXF1aXJlKCAnZ290JyApICksXG4gICAgRlMgICAgICAgICAgID0gUHJvbWlzZS5wcm9taXNpZnlBbGwoIHJlcXVpcmUoICdmcycgKSApLFxuICAgIEtleSAgICAgICAgICA9IHJlcXVpcmUoICcuL2tleScgKSxcbiAgICBDb25zdCAgICAgICAgPSByZXF1aXJlKCAnLi9jb25zdCcgKSxcbiAgICBjb3VudCAgICAgICAgPSAwLFxuICAgIHN0ZG91dCAgICAgICA9IHByb2Nlc3Muc3Rkb3V0LFxuICAgIENhY2hlICAgICAgICA9IHt9LFxuICAgIFV0aWwsIEluZGljYXRvciwgdGltZW91dElEXG5cbmNvbnN0IFVSTF9TRVJWRVIgICAgPSBDb25zdC5VUkxfU0VSVkVSLFxuICAgICAgQUNUSU9OX1VQREFURSA9ICd1cGRhdGU/dWtleT0nLFxuICAgICAgTUFDICAgICAgICAgICA9IEtleS5tYWMsXG4gICAgICBJUCAgICAgICAgICAgID0gS2V5LmlwLFxuICAgICAgVElNRU9VVCAgICAgICA9IDUwMDBcblxuSW5kaWNhdG9yID0ge1xuICAgIHN0YXJ0KCB0ZXh0ID0gJ3dhaXRpbmcnICkge1xuICAgICAgICBjb3VudCAgICAgPSAwXG4gICAgICAgIHRpbWVvdXRJRCA9IHNldEludGVydmFsKCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGNvdW50ICAgID0gKCBjb3VudCArIDEgKSAlIDVcbiAgICAgICAgICAgIGxldCBkb3RzID0gbmV3IEFycmF5KCBjb3VudCApLmpvaW4oICcuJyApXG5cbiAgICAgICAgICAgIHN0ZG91dC5jbGVhckxpbmUoKVxuICAgICAgICAgICAgc3Rkb3V0LmN1cnNvclRvKCAwIClcbiAgICAgICAgICAgIHN0ZG91dC53cml0ZSggdGV4dCArIGRvdHMgKVxuICAgICAgICB9LCAzMDAgKVxuICAgIH0sXG5cbiAgICBzdG9wKCkge1xuICAgICAgICBjbGVhclRpbWVvdXQoIHRpbWVvdXRJRCApXG4gICAgICAgIHN0ZG91dC5jbGVhckxpbmUoKVxuICAgICAgICBzdGRvdXQuY3Vyc29yVG8oIDAgKVxuICAgIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBVdGlsID0ge1xuICAgIGluZGljYXRvcjogSW5kaWNhdG9yLFxuXG4gICAgdXBkYXRlSlNPTkZpbGUoIHBhdGgsIGNvbnRlbnQgKSB7XG4gICAgICAgIGNvbnRlbnQgPSBKU09OLnN0cmluZ2lmeSggT2JqZWN0QXNzaWduKCB7fSwgcmVxdWlyZSggcGF0aCApLCBjb250ZW50ICkgKVxuICAgICAgICByZXR1cm4gRlMud3JpdGVGaWxlQXN5bmMoIHBhdGgsIGNvbnRlbnQgKVxuICAgIH0sXG5cbiAgICBjaGVja0ZpbGVFeGlzdCggcGF0aCApIHtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKCByZXNvbHZlID0+IHtcbiAgICAgICAgICAgIEZTLmV4aXN0cyggcGF0aCwgaXNFeGlzdCA9PiB7XG4gICAgICAgICAgICAgICAgcmVzb2x2ZSggaXNFeGlzdCApXG4gICAgICAgICAgICB9IClcbiAgICAgICAgfSApXG4gICAgfSxcblxuICAgIGdldFBvcnQoIGJhc2VQYXRoICkge1xuICAgICAgICByZXR1cm4gcmVxdWlyZSggYmFzZVBhdGggKyBDb25zdC5GSUxFX0VUQyApLm9uUG9ydFxuICAgIH0sXG5cbiAgICBhc3luYyBnZXRJUCgpIHtcbiAgICAgICAgbGV0IHJlc3VsdCA9IGF3YWl0IEdvdC5nZXRBc3luYyggVVJMX1NFUlZFUiArIElQLCB7XG4gICAgICAgICAgICB0aW1lb3V0OiBUSU1FT1VUXG4gICAgICAgIH0gKVxuXG4gICAgICAgIHJldHVybiByZXN1bHRbIDAgXVxuICAgIH0sXG5cbiAgICBhc3luYyBnZXRNYWMoKSB7XG4gICAgICAgIGxldCBtYWMgPSBDYWNoZVsgTUFDIF0gfHwgYXdhaXQgR2V0TWFjLmdldE1hY0FzeW5jKClcblxuICAgICAgICBpZiAoICFtYWMgKSB7XG4gICAgICAgICAgICBsb2coICfojrflj5YgTUFDIOWcsOWdgOWksei0pScsICdlcnJvcicgKVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIENhY2hlWyBNQUMgXSA9IG1hY1xuICAgIH0sXG5cbiAgICBhc3luYyB1cGRhdGVNYWMoIG1hYyApIHtcbiAgICAgICAgbGV0IHJlcyA9IGF3YWl0IEdvdC5nZXRBc3luYyggVVJMX1NFUlZFUiArIEFDVElPTl9VUERBVEUgKyBtYWMsIHtcbiAgICAgICAgICAgIGpzb246ICAgIHRydWUsXG4gICAgICAgICAgICB0aW1lb3V0OiBUSU1FT1VUXG4gICAgICAgIH0gKVxuXG4gICAgICAgIGlmICggcmVzICYmIHJlc1sgMCBdLnVwZGF0ZWQgKSB7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZVxuICAgICAgICB9XG4gICAgICAgIGxvZyhVUkxfU0VSVkVSICsgQUNUSU9OX1VQREFURSArIG1hYylcblxuICAgICAgICBJbmRpY2F0b3Iuc3RvcCgpXG4gICAgICAgIGxvZyggJ+abtOaWsCBJUCDlnLDlnYDlpLHotKUnLCAnZXJyb3InIClcbiAgICB9LFxuXG4gICAgYXN5bmMgdXBkYXRlUHJveHkoIHBvcnQsIHBhcmFtcyApIHtcbiAgICAgICAgbGV0IG1hYyA9IGF3YWl0IHRoaXMuZ2V0TWFjKCksXG4gICAgICAgICAgICB1cmwgPSBgJHtVUkxfU0VSVkVSfWhvc3Q/cG9ydD0ke3BvcnR9JnVrZXk9JHttYWN9JiR7cGFyYW1zfWBcblxuICAgICAgICByZXR1cm4gR290XG4gICAgICAgICAgICAuZ2V0QXN5bmMoIHVybCwge1xuICAgICAgICAgICAgICAgIHRpbWVvdXQ6IFRJTUVPVVRcbiAgICAgICAgICAgIH0gKVxuICAgIH1cbn1cbiJdfQ==