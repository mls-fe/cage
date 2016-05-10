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
                log(path + ' 文件不存在', 'error');
                return Promise.reject(path + ' 文件不存在');
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy91dGlsLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxJQUFJLEtBQVksUUFBUyxJQUFULENBQWhCO0lBQ0ksS0FBWSxRQUFTLElBQVQsQ0FEaEI7SUFFSSxPQUFZLFFBQVMsZUFBVCxFQUEyQixJQUYzQztJQUdJLFVBQVksUUFBUyxXQUFULENBSGhCO0lBSUksTUFBWSxRQUFTLE9BQVQsQ0FKaEI7SUFLSSxRQUFZLFFBQVMsU0FBVCxDQUxoQjtJQU1JLFFBQVksQ0FOaEI7SUFPSSxTQUFZLFFBQVEsTUFQeEI7SUFRSSxRQUFZLEVBUmhCO0lBU0ksWUFBWSxDQVRoQjtJQVVJLGFBVko7SUFVVSxrQkFWVjtJQVVxQixxQkFWckI7O0FBWUEsSUFBTSxnQkFBZ0IsY0FBdEI7SUFDTSxNQUFnQixJQUFJLEdBRDFCO0lBRU0sS0FBZ0IsSUFBSSxFQUYxQjs7QUFJQSxlQUFlLE9BQU8sTUFBUCxJQUFpQixVQUFXLE1BQVgsRUFBK0I7QUFDdkQsYUFBUyxVQUFVLEVBQW5COztBQUR1RCxzQ0FBVCxNQUFTO0FBQVQsY0FBUztBQUFBOztBQUd2RCxXQUFPLE9BQVAsQ0FBZ0IsZUFBTztBQUNuQixhQUFNLElBQUksR0FBVixJQUFpQixHQUFqQixFQUF1QjtBQUNuQixtQkFBUSxHQUFSLElBQWdCLElBQUssR0FBTCxDQUFoQjtBQUNIO0FBQ0osS0FKRDs7QUFNQSxXQUFPLE1BQVA7QUFDSCxDQVZMOztBQVlBLFlBQVk7QUFDUixTQURRLG1CQUNrQjtBQUFBLFlBQW5CLElBQW1CLHlEQUFaLFNBQVk7O0FBQ3RCLGdCQUFRLENBQVI7QUFDQSxxQkFBYyxTQUFkO0FBQ0Esb0JBQVksWUFBYSxZQUFZO0FBQ2pDLG9CQUFXLENBQUUsUUFBUSxDQUFWLElBQWdCLENBQTNCO0FBQ0EsZ0JBQUksT0FBTyxJQUFJLEtBQUosQ0FBVyxLQUFYLEVBQW1CLElBQW5CLENBQXlCLEdBQXpCLENBQVg7O0FBRUEsbUJBQU8sU0FBUDtBQUNBLG1CQUFPLFFBQVAsQ0FBaUIsQ0FBakI7QUFDQSxtQkFBTyxLQUFQLENBQWMsT0FBTyxJQUFyQjtBQUNILFNBUFcsRUFPVCxHQVBTLENBQVo7QUFRSCxLQVpPO0FBY1IsUUFkUSxrQkFjRDtBQUNILHFCQUFjLFNBQWQ7QUFDQSxlQUFPLFNBQVA7QUFDQSxlQUFPLFFBQVAsQ0FBaUIsQ0FBakI7QUFDSDtBQWxCTyxDQUFaOztBQXFCQSxPQUFPLE9BQVAsR0FBaUIsT0FBTztBQUNwQixlQUFXLFNBRFM7O0FBR3BCLGtCQUhvQiwwQkFHSixJQUhJLEVBR0UsT0FIRixFQUdZO0FBQzVCLGVBQU8sS0FBSyxjQUFMLENBQXFCLElBQXJCLEVBQTRCLElBQTVCLENBQWtDLG1CQUFXO0FBQ2hELGdCQUFLLENBQUMsT0FBTixFQUFnQjtBQUNaLG9CQUFRLElBQVIsYUFBc0IsT0FBdEI7QUFDQSx1QkFBTyxRQUFRLE1BQVIsQ0FBbUIsSUFBbkIsWUFBUDtBQUNILGFBSEQsTUFHTztBQUNILG9CQUFJO0FBQ0EsOEJBQVUsS0FBSyxTQUFMLENBQWdCLGFBQWMsRUFBZCxFQUFrQixRQUFTLElBQVQsQ0FBbEIsRUFBbUMsT0FBbkMsQ0FBaEIsRUFBOEQsSUFBOUQsRUFBb0UsSUFBcEUsQ0FBVjtBQUNILGlCQUZELENBRUUsT0FBUSxDQUFSLEVBQVk7QUFDVixnQ0FBVyxJQUFYO0FBQ0Esd0JBQUssQ0FBTCxFQUFRLE9BQVI7QUFDSDs7QUFFRCx1QkFBTyxJQUFJLE9BQUosQ0FBYSxVQUFFLE9BQUYsRUFBVyxNQUFYLEVBQXVCO0FBQ3ZDLHVCQUFHLFNBQUgsQ0FBYyxJQUFkLEVBQW9CLE9BQXBCLEVBQTZCLGVBQU87QUFDaEMsOEJBQU0sUUFBTixHQUFpQixTQUFqQjtBQUNILHFCQUZEO0FBR0gsaUJBSk0sQ0FBUDtBQUtIO0FBQ0osU0FsQk0sRUFrQkgsS0FsQkcsQ0FrQkk7QUFBQSxtQkFBSyxJQUFLLENBQUwsRUFBUSxPQUFSLENBQUw7QUFBQSxTQWxCSixDQUFQO0FBbUJILEtBdkJtQjtBQXlCcEIsa0JBekJvQiwwQkF5QkosSUF6QkksRUF5Qkc7QUFDbkIsZUFBTyxJQUFJLE9BQUosQ0FBYSxtQkFBVztBQUMzQixlQUFHLE1BQUgsQ0FBVyxJQUFYLEVBQWlCLG1CQUFXO0FBQ3hCLHdCQUFTLE9BQVQ7QUFDSCxhQUZEO0FBR0gsU0FKTSxDQUFQO0FBS0gsS0EvQm1CO0FBaUNwQixXQWpDb0IsbUJBaUNYLFFBakNXLEVBaUNBO0FBQ2hCLGVBQU8sUUFBUyxXQUFXLE1BQU0sUUFBMUIsRUFBcUMsTUFBNUM7QUFDSCxLQW5DbUI7QUFxQ2QsU0FyQ2MsbUJBcUNOO0FBQUE7O0FBQUE7QUFBQSxnQkFDTixNQURNO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLG1DQUNTLFFBQVMsSUFBVCxDQURUOztBQUFBO0FBQ04sa0NBRE07QUFBQSw2REFFSCxPQUFPLElBRko7O0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFHYixLQXhDbUI7QUEwQ2QsVUExQ2Msb0JBMENMO0FBQUE7O0FBQUE7QUFBQSxnQkFDUCxhQURPLEVBU1AsR0FUTztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQ1AseUNBRE8sR0FDUyxTQUFoQixhQUFnQixHQUFNO0FBQ3RCLHVDQUFPLElBQUksT0FBSixDQUFhLFVBQUUsT0FBRixFQUFXLE1BQVgsRUFBdUI7QUFDdkMsMEZBQXFELFVBQUUsR0FBRixFQUFPLE1BQVAsRUFBbUI7QUFDbEUsK0NBQU8sQ0FBQyxNQUFWLEdBQXFCLFFBQXJCLEdBQWdDLFFBQVMsT0FBTyxJQUFQLEVBQVQsQ0FBaEM7QUFDSCxxQ0FGRDtBQUdILGlDQUpNLENBQVA7QUFLSCw2QkFQVTs7QUFBQSwyQ0FTRCxNQUFPLEdBQVAsQ0FUQzs7QUFBQTtBQUFBO0FBQUE7QUFBQTs7QUFBQTtBQUFBLG1DQVNxQixlQVRyQjs7QUFBQTtBQUFBOztBQUFBO0FBU1AsK0JBVE87OztBQVdYLGdDQUFLLENBQUMsR0FBTixFQUFZO0FBQ1Isb0NBQUssYUFBTCxFQUFvQixPQUFwQjtBQUNIOztBQWJVLDhEQWVKLE1BQU8sR0FBUCxJQUFlLEdBZlg7O0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFnQmQsS0ExRG1CO0FBNERkLGFBNURjLHFCQTRESCxHQTVERyxFQTRERztBQUFBOztBQUFBO0FBQUEsZ0JBQ2YsR0FEZTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxtQ0FDSCxRQUFTLGdCQUFnQixHQUF6QixDQURHOztBQUFBO0FBQ2YsK0JBRGU7OztBQUduQixzQ0FBVSxJQUFWOztBQUhtQixrQ0FJZCxPQUFPLElBQUksSUFBSixJQUFZLEdBSkw7QUFBQTtBQUFBO0FBQUE7O0FBQUEsOERBS1IsSUFMUTs7QUFBQTtBQU9uQixnQ0FBSyxZQUFMLEVBQW1CLE9BQW5COztBQVBtQjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQVF0QixLQXBFbUI7QUFzRWQsZUF0RWMsdUJBc0VELElBdEVDLEVBc0VLLE1BdEVMLEVBc0VjO0FBQUE7O0FBQUE7QUFBQSxnQkFDMUIsR0FEMEI7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsbUNBQ2QsT0FBSyxNQUFMLEVBRGM7O0FBQUE7QUFDMUIsK0JBRDBCO0FBQUEsOERBRXZCLHVCQUFzQixJQUF0QixjQUFtQyxHQUFuQyxTQUEwQyxNQUExQyxDQUZ1Qjs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUdqQyxLQXpFbUI7QUEyRXBCLGlCQTNFb0IsMkJBMkVKO0FBQ1osWUFBSSxNQUFRLElBQUksSUFBSixFQUFaO1lBQ0ksT0FBUSxJQUFJLFdBQUosRUFEWjtZQUVJLFFBQVEsT0FBUSxJQUFJLFFBQUosS0FBaUIsQ0FBekIsQ0FGWjtZQUdJLE9BQVEsT0FBUSxJQUFJLE9BQUosRUFBUixDQUhaOztBQUtBLGdCQUFRLE1BQU0sTUFBTixHQUFlLENBQWYsR0FBbUIsS0FBbkIsR0FBNkIsTUFBTSxLQUEzQztBQUNBLGVBQVEsS0FBSyxNQUFMLEdBQWMsQ0FBZCxHQUFrQixJQUFsQixHQUEyQixNQUFNLElBQXpDOztBQUVBLGVBQVUsSUFBVixTQUFrQixLQUFsQixTQUEyQixJQUEzQjtBQUNIO0FBckZtQixDQUF4QiIsImZpbGUiOiJ1dGlsLmpzIiwic291cmNlc0NvbnRlbnQiOlsibGV0IE9TICAgICAgICA9IHJlcXVpcmUoICdvcycgKSxcbiAgICBGUyAgICAgICAgPSByZXF1aXJlKCAnZnMnICksXG4gICAgRXhlYyAgICAgID0gcmVxdWlyZSggJ2NoaWxkX3Byb2Nlc3MnICkuZXhlYyxcbiAgICBSZXF1ZXN0ICAgPSByZXF1aXJlKCAnLi9yZXF1ZXN0JyApLFxuICAgIEtleSAgICAgICA9IHJlcXVpcmUoICcuL2tleScgKSxcbiAgICBDb25zdCAgICAgPSByZXF1aXJlKCAnLi9jb25zdCcgKSxcbiAgICBjb3VudCAgICAgPSAwLFxuICAgIHN0ZG91dCAgICA9IHByb2Nlc3Muc3Rkb3V0LFxuICAgIENhY2hlICAgICA9IHt9LFxuICAgIHRpbWVvdXRJRCA9IDAsXG4gICAgVXRpbCwgSW5kaWNhdG9yLCBPYmplY3RBc3NpZ25cblxuY29uc3QgQUNUSU9OX1VQREFURSA9ICd1cGRhdGU/dWtleT0nLFxuICAgICAgTUFDICAgICAgICAgICA9IEtleS5tYWMsXG4gICAgICBJUCAgICAgICAgICAgID0gS2V5LmlwXG5cbk9iamVjdEFzc2lnbiA9IE9iamVjdC5hc3NpZ24gfHwgZnVuY3Rpb24gKCB0YXJnZXQsIC4uLm1peGlucyApIHtcbiAgICAgICAgdGFyZ2V0ID0gdGFyZ2V0IHx8IHt9XG5cbiAgICAgICAgbWl4aW5zLmZvckVhY2goIG9iaiA9PiB7XG4gICAgICAgICAgICBmb3IgKCB2YXIga2V5IGluIG9iaiApIHtcbiAgICAgICAgICAgICAgICB0YXJnZXRbIGtleSBdID0gb2JqWyBrZXkgXVxuICAgICAgICAgICAgfVxuICAgICAgICB9IClcblxuICAgICAgICByZXR1cm4gdGFyZ2V0XG4gICAgfVxuXG5JbmRpY2F0b3IgPSB7XG4gICAgc3RhcnQoIHRleHQgPSAnd2FpdGluZycgKSB7XG4gICAgICAgIGNvdW50ID0gMFxuICAgICAgICBjbGVhclRpbWVvdXQoIHRpbWVvdXRJRCApXG4gICAgICAgIHRpbWVvdXRJRCA9IHNldEludGVydmFsKCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBjb3VudCAgICA9ICggY291bnQgKyAxICkgJSA1XG4gICAgICAgICAgICBsZXQgZG90cyA9IG5ldyBBcnJheSggY291bnQgKS5qb2luKCAnLicgKVxuXG4gICAgICAgICAgICBzdGRvdXQuY2xlYXJMaW5lKClcbiAgICAgICAgICAgIHN0ZG91dC5jdXJzb3JUbyggMCApXG4gICAgICAgICAgICBzdGRvdXQud3JpdGUoIHRleHQgKyBkb3RzIClcbiAgICAgICAgfSwgMzAwIClcbiAgICB9LFxuXG4gICAgc3RvcCgpIHtcbiAgICAgICAgY2xlYXJUaW1lb3V0KCB0aW1lb3V0SUQgKVxuICAgICAgICBzdGRvdXQuY2xlYXJMaW5lKClcbiAgICAgICAgc3Rkb3V0LmN1cnNvclRvKCAwIClcbiAgICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gVXRpbCA9IHtcbiAgICBpbmRpY2F0b3I6IEluZGljYXRvcixcblxuICAgIHVwZGF0ZUpTT05GaWxlKCBwYXRoLCBjb250ZW50ICkge1xuICAgICAgICByZXR1cm4gdGhpcy5jaGVja0ZpbGVFeGlzdCggcGF0aCApLnRoZW4oIGlzRXhpc3QgPT4ge1xuICAgICAgICAgICAgaWYgKCAhaXNFeGlzdCApIHtcbiAgICAgICAgICAgICAgICBsb2coIGAke3BhdGh9IOaWh+S7tuS4jeWtmOWcqGAsICdlcnJvcicgKVxuICAgICAgICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdCggYCR7cGF0aH0g5paH5Lu25LiN5a2Y5ZyoYCApXG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnRlbnQgPSBKU09OLnN0cmluZ2lmeSggT2JqZWN0QXNzaWduKCB7fSwgcmVxdWlyZSggcGF0aCApLCBjb250ZW50ICksIG51bGwsICcgICcgKVxuICAgICAgICAgICAgICAgIH0gY2F0Y2ggKCBlICkge1xuICAgICAgICAgICAgICAgICAgICBsb2coIGDor7vlj5YgJHtwYXRofSDmlofku7bplJnor68sIOWOn+WboOS4ujpgIClcbiAgICAgICAgICAgICAgICAgICAgbG9nKCBlLCAnZXJyb3InIClcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoICggcmVzb2x2ZSwgcmVqZWN0ICkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBGUy53cml0ZUZpbGUoIHBhdGgsIGNvbnRlbnQsIGVyciA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBlcnIgPyByZWplY3QoKSA6IHJlc29sdmUoKVxuICAgICAgICAgICAgICAgICAgICB9IClcbiAgICAgICAgICAgICAgICB9IClcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSApLmNhdGNoKCBlID0+IGxvZyggZSwgJ2Vycm9yJyApIClcbiAgICB9LFxuXG4gICAgY2hlY2tGaWxlRXhpc3QoIHBhdGggKSB7XG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSggcmVzb2x2ZSA9PiB7XG4gICAgICAgICAgICBGUy5leGlzdHMoIHBhdGgsIGlzRXhpc3QgPT4ge1xuICAgICAgICAgICAgICAgIHJlc29sdmUoIGlzRXhpc3QgKVxuICAgICAgICAgICAgfSApXG4gICAgICAgIH0gKVxuICAgIH0sXG5cbiAgICBnZXRQb3J0KCBiYXNlUGF0aCApIHtcbiAgICAgICAgcmV0dXJuIHJlcXVpcmUoIGJhc2VQYXRoICsgQ29uc3QuRklMRV9FVEMgKS5vblBvcnRcbiAgICB9LFxuXG4gICAgYXN5bmMgZ2V0SVAoKSB7XG4gICAgICAgIHZhciByZXN1bHQgPSBhd2FpdCBSZXF1ZXN0KCAnaXAnIClcbiAgICAgICAgcmV0dXJuIHJlc3VsdC5kYXRhXG4gICAgfSxcblxuICAgIGFzeW5jIGdldE1hYygpIHtcbiAgICAgICAgdmFyIGdldE1hY0FkZHJlc3MgPSAoKSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoICggcmVzb2x2ZSwgcmVqZWN0ICkgPT4ge1xuICAgICAgICAgICAgICAgIEV4ZWMoIGBpZmNvbmZpZyBlbjB8IGdyZXAgZXRoZXJ8IGF3ayAne3ByaW50ICRORn0nYCwgKCBlcnIsIHN0ZG91dCApID0+IHtcbiAgICAgICAgICAgICAgICAgICAgKCBlcnIgfHwgIXN0ZG91dCApID8gcmVqZWN0KCkgOiByZXNvbHZlKCBzdGRvdXQudHJpbSgpIClcbiAgICAgICAgICAgICAgICB9IClcbiAgICAgICAgICAgIH0gKVxuICAgICAgICB9XG5cbiAgICAgICAgbGV0IG1hYyA9IENhY2hlWyBNQUMgXSB8fCBhd2FpdCBnZXRNYWNBZGRyZXNzKClcblxuICAgICAgICBpZiAoICFtYWMgKSB7XG4gICAgICAgICAgICBsb2coICfojrflj5YgTUFDIOWcsOWdgOWksei0pScsICdlcnJvcicgKVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIENhY2hlWyBNQUMgXSA9IG1hY1xuICAgIH0sXG5cbiAgICBhc3luYyB1cGRhdGVNYWMoIG1hYyApIHtcbiAgICAgICAgbGV0IHJlcyA9IGF3YWl0IFJlcXVlc3QoIEFDVElPTl9VUERBVEUgKyBtYWMgKVxuXG4gICAgICAgIEluZGljYXRvci5zdG9wKClcbiAgICAgICAgaWYgKCByZXMgJiYgcmVzLmNvZGUgPT0gJzAnICkge1xuICAgICAgICAgICAgcmV0dXJuIHRydWVcbiAgICAgICAgfVxuICAgICAgICBsb2coICfmm7TmlrAgSVAg5Zyw5Z2A5aSx6LSlJywgJ2Vycm9yJyApXG4gICAgfSxcblxuICAgIGFzeW5jIHVwZGF0ZVByb3h5KCBwb3J0LCBwYXJhbXMgKSB7XG4gICAgICAgIGxldCBtYWMgPSBhd2FpdCB0aGlzLmdldE1hYygpXG4gICAgICAgIHJldHVybiBSZXF1ZXN0KCBgaG9zdD9wb3J0PSR7cG9ydH0mdWtleT0ke21hY30mJHtwYXJhbXN9YCApXG4gICAgfSxcblxuICAgIGdldEZvcm1hdERhdGUoKSB7XG4gICAgICAgIHZhciBub3cgICA9IG5ldyBEYXRlLFxuICAgICAgICAgICAgeWVhciAgPSBub3cuZ2V0RnVsbFllYXIoKSxcbiAgICAgICAgICAgIG1vbnRoID0gU3RyaW5nKCBub3cuZ2V0TW9udGgoKSArIDEgKSxcbiAgICAgICAgICAgIGRhdGUgID0gU3RyaW5nKCBub3cuZ2V0RGF0ZSgpIClcblxuICAgICAgICBtb250aCA9IG1vbnRoLmxlbmd0aCA+IDEgPyBtb250aCA6ICggJzAnICsgbW9udGggKVxuICAgICAgICBkYXRlICA9IGRhdGUubGVuZ3RoID4gMSA/IGRhdGUgOiAoICcwJyArIGRhdGUgKVxuXG4gICAgICAgIHJldHVybiBgJHt5ZWFyfS8ke21vbnRofS8ke2RhdGV9YFxuICAgIH1cbn1cbiJdfQ==