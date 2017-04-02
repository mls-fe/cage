'use strict';

var _bluebird = require('bluebird');

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Key = require('../key'),
    Util = require('../util'),
    Const = require('../const'),
    Profile = global.Profile;

var DOMAINS = Key.domains,
    RANDOM = Key.random,
    IP = Key.ip,
    LOCAL_IP = '127.0.0.1';

var Config = function () {
    function Config(path) {
        _classCallCheck(this, Config);

        this.param = { path };
    }

    _createClass(Config, [{
        key: 'getPath',
        value: function getPath() {
            return this.param.path;
        }
    }, {
        key: 'getPortOption',
        value: function getPortOption() {
            return this.param.portOption;
        }
    }, {
        key: 'setPort',
        value: function setPort(port) {
            this.param.port = port;
        }
    }, {
        key: 'getPort',
        value: function getPort() {
            return this.param.port;
        }
    }, {
        key: 'setPortOption',
        value: function setPortOption(port) {
            this.param.portOption = port;
        }
    }, {
        key: 'generatePort',
        value: function () {
            var _ref = (0, _bluebird.coroutine)(regeneratorRuntime.mark(function _callee() {
                var ip, path, port, url;
                return regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                ip = Profile.get(IP), path = this.getPath(), port = void 0, url = void 0;

                                if (!(this.getPortOption() == RANDOM)) {
                                    _context.next = 7;
                                    break;
                                }

                                port = Math.random() * 1000 | 0 + 6000;
                                this.setPort(port);

                                url = `http://${ip}:${port + 1}/`;

                                _context.next = 7;
                                return Util.updateRuntimeConfig(path, function (data) {
                                    data.site.JCSTATIC_BASE = url + 'pc/';
                                    data.site.M_JCSTATIC_BASE = url + 'wap/';
                                    data.etc.onPort = port;
                                    data.service.onPort = port + 1;
                                    return data;
                                });

                            case 7:
                            case 'end':
                                return _context.stop();
                        }
                    }
                }, _callee, this);
            }));

            function generatePort() {
                return _ref.apply(this, arguments);
            }

            return generatePort;
        }()
    }, {
        key: 'addDomain',
        value: function addDomain(domains) {
            var param = this.param,
                domainsObj = param.domainsObj,
                ds = param.domains;

            domains.forEach(function (domain) {
                var _domain = _slicedToArray(domain, 2),
                    key = _domain[0],
                    value = _domain[1];

                domainsObj[key] = value;

                ds.push({
                    key, value
                });
            });

            Profile.set(DOMAINS, domainsObj);
        }
    }, {
        key: 'getSavedDomains',
        value: function getSavedDomains() {
            var param = this.param,
                defaultDomains = param.domainsObj,
                domainsArr = param.domains;

            if (domainsArr) {
                return domainsArr;
            } else {
                defaultDomains = Profile.get(DOMAINS) || {};
                domainsArr = [];
            }

            for (var key in defaultDomains) {
                domainsArr.push({
                    key,
                    value: defaultDomains[key]
                });
            }

            param.domainsObj = defaultDomains;
            return param.domains = domainsArr;
        }
    }, {
        key: 'getDomainsSize',
        value: function getDomainsSize() {
            return this.param.domains.length;
        }
    }, {
        key: 'clearDomains',
        value: function clearDomains() {
            var param = this.param;

            Profile.del(DOMAINS);
            param.domainsObj = {};
            param.domains = [];
        }
    }, {
        key: 'isIPChange',
        value: function () {
            var _ref2 = (0, _bluebird.coroutine)(regeneratorRuntime.mark(function _callee2() {
                var ip;
                return regeneratorRuntime.wrap(function _callee2$(_context2) {
                    while (1) {
                        switch (_context2.prev = _context2.next) {
                            case 0:
                                _context2.next = 2;
                                return Util.getIP();

                            case 2:
                                ip = this.param.ip = _context2.sent;

                                log(ip, 'debug');
                                return _context2.abrupt('return', Profile.get(IP) != ip);

                            case 5:
                            case 'end':
                                return _context2.stop();
                        }
                    }
                }, _callee2, this);
            }));

            function isIPChange() {
                return _ref2.apply(this, arguments);
            }

            return isIPChange;
        }()
    }, {
        key: 'updateIP',
        value: function () {
            var _ref3 = (0, _bluebird.coroutine)(regeneratorRuntime.mark(function _callee3() {
                var mac, res;
                return regeneratorRuntime.wrap(function _callee3$(_context3) {
                    while (1) {
                        switch (_context3.prev = _context3.next) {
                            case 0:
                                _context3.next = 2;
                                return Util.getMac();

                            case 2:
                                mac = _context3.sent;
                                _context3.next = 5;
                                return Util.updateMac(mac);

                            case 5:
                                res = _context3.sent;


                                Profile.set(IP, res ? this.param.ip : LOCAL_IP);
                                return _context3.abrupt('return', !!res);

                            case 8:
                            case 'end':
                                return _context3.stop();
                        }
                    }
                }, _callee3, this);
            }));

            function updateIP() {
                return _ref3.apply(this, arguments);
            }

            return updateIP;
        }()
    }, {
        key: 'updateProxy',
        value: function () {
            var _ref4 = (0, _bluebird.coroutine)(regeneratorRuntime.mark(function _callee4() {
                var domains, hosts, hostParam, port;
                return regeneratorRuntime.wrap(function _callee4$(_context4) {
                    while (1) {
                        switch (_context4.prev = _context4.next) {
                            case 0:
                                domains = this.getSavedDomains(), hosts = {}, hostParam = [], port = void 0;


                                domains.forEach(function (domain) {
                                    hostParam.push('host=' + domain.key);
                                    hosts[domain.key + Const.SITE_SUFFIX] = domain.value;
                                });

                                _context4.next = 4;
                                return this.generatePort();

                            case 4:

                                port = this.getPort() || Util.getPort(this.getPath());

                                _context4.next = 7;
                                return Util.updateRuntimeConfig(this.getPath(), function (data) {
                                    data.virtualHost = hosts;
                                    return data;
                                });

                            case 7:
                                _context4.next = 9;
                                return Util.updateProxy(port, hostParam.join('&'));

                            case 9:
                            case 'end':
                                return _context4.stop();
                        }
                    }
                }, _callee4, this);
            }));

            function updateProxy() {
                return _ref4.apply(this, arguments);
            }

            return updateProxy;
        }()
    }]);

    return Config;
}();

module.exports = Config;