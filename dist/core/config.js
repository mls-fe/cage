'use strict';

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; })();

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _bluebird = require('bluebird');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Key = require('../key'),
    Util = require('../util'),
    Const = require('../const'),
    Profile = global.Profile;

var DOMAINS = Key.domains,
    RANDOM = Key.random,
    IP = Key.ip;

var Config = (function () {
    function Config(path) {
        _classCallCheck(this, Config);

        this.param = { path: path };
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
        value: (function () {
            var ref = (0, _bluebird.coroutine)(regeneratorRuntime.mark(function _callee() {
                var ip, path, port, url;
                return regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                ip = Profile.get(IP), path = this.getPath(), port = undefined, url = undefined;

                                if (!(this.getPortOption() == RANDOM)) {
                                    _context.next = 11;
                                    break;
                                }

                                port = Math.random() * 1000 | 0 + 6000;
                                this.setPort(port);

                                url = 'http://' + ip + ':' + (port + 1) + '/';

                                _context.next = 7;
                                return Util.updateJSONFile(path + Const.FILE_SITE, {
                                    'JCSTATIC_BASE': url,
                                    'M_JCSTATIC_BASE': url
                                });

                            case 7:
                                _context.next = 9;
                                return Util.updateJSONFile(path + Const.FILE_ETC, {
                                    onPort: port
                                });

                            case 9:
                                _context.next = 11;
                                return Util.updateJSONFile(path + Const.FILE_SERVICE, {
                                    onPort: port + 1
                                });

                            case 11:
                            case 'end':
                                return _context.stop();
                        }
                    }
                }, _callee, this);
            }));
            return function generatePort() {
                return ref.apply(this, arguments);
            };
        })()
    }, {
        key: 'addDomain',
        value: function addDomain(domain) {
            var param = this.param,
                domainsObj = param.domainsObj,
                domains = param.domains;

            var _domain = _slicedToArray(domain, 2);

            var key = _domain[0];
            var value = _domain[1];

            if (!(key in domainsObj)) {
                domainsObj[key] = value;
                domains.push({
                    key: key, value: value
                });
                Profile.set(DOMAINS, domainsObj);
            }
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
                    key: key,
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
        value: (function () {
            var ref = (0, _bluebird.coroutine)(regeneratorRuntime.mark(function _callee2() {
                var ip;
                return regeneratorRuntime.wrap(function _callee2$(_context2) {
                    while (1) {
                        switch (_context2.prev = _context2.next) {
                            case 0:
                                _context2.next = 2;
                                return Util.getIP();

                            case 2:
                                ip = this.param.ip = _context2.sent;
                                return _context2.abrupt('return', Profile.get(IP) != ip);

                            case 4:
                            case 'end':
                                return _context2.stop();
                        }
                    }
                }, _callee2, this);
            }));
            return function isIPChange() {
                return ref.apply(this, arguments);
            };
        })()
    }, {
        key: 'updateIP',
        value: (function () {
            var ref = (0, _bluebird.coroutine)(regeneratorRuntime.mark(function _callee3() {
                var mac, res, port, ip, url;
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

                                if (!res) {
                                    _context3.next = 12;
                                    break;
                                }

                                port = Util.getPort(this.getPath()) + 1, ip = Profile.get(IP), url = 'http://' + ip + ':' + port + '/';
                                _context3.next = 10;
                                return Util.updateJSONFile(this.getPath() + Const.FILE_SITE, {
                                    'JCSTATIC_BASE': url,
                                    'M_JCSTATIC_BASE': url
                                });

                            case 10:

                                Profile.set(IP, this.param.ip);
                                return _context3.abrupt('return', true);

                            case 12:
                            case 'end':
                                return _context3.stop();
                        }
                    }
                }, _callee3, this);
            }));
            return function updateIP() {
                return ref.apply(this, arguments);
            };
        })()
    }, {
        key: 'updateProxy',
        value: (function () {
            var ref = (0, _bluebird.coroutine)(regeneratorRuntime.mark(function _callee4() {
                var domains, hosts, hostParam, port;
                return regeneratorRuntime.wrap(function _callee4$(_context4) {
                    while (1) {
                        switch (_context4.prev = _context4.next) {
                            case 0:
                                domains = this.getSavedDomains(), hosts = {}, hostParam = [], port = undefined;

                                domains.forEach(function (domain) {
                                    hostParam.push('host=' + domain.key);
                                    hosts[domain.key + Const.SITE_SUFFIX] = domain.value;
                                });

                                _context4.next = 4;
                                return this.generatePort();

                            case 4:

                                port = this.getPort() || Util.getPort(this.getPath());

                                _context4.next = 7;
                                return Util.updateJSONFile(this.getPath() + Const.FILE_VHOST, hosts);

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
            return function updateProxy() {
                return ref.apply(this, arguments);
            };
        })()
    }]);

    return Config;
})();

module.exports = Config;
//# sourceMappingURL=data:application/json;base64,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Q0FBRSxDQUFBOzs7dUNBRUcsSUFBSSxDQUFDLFlBQVksRUFBRTs7OztBQUV6QixvQ0FBSSxHQUFHLElBQUksQ0FBQyxPQUFPLEVBQUUsSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFFLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBRSxDQUFBOzs7dUNBRWpELElBQUksQ0FBQyxjQUFjLENBQUUsSUFBSSxDQUFDLE9BQU8sRUFBRSxHQUFHLEtBQUssQ0FBQyxVQUFVLEVBQUUsS0FBSyxDQUFFOzs7O3VDQUMvRCxJQUFJLENBQUMsV0FBVyxDQUFFLElBQUksRUFBRSxTQUFTLENBQUMsSUFBSSxDQUFFLEdBQUcsQ0FBRSxDQUFFOzs7Ozs7Ozs7Ozs7Ozs7V0E5SXZELE1BQU07OztBQWtKWixNQUFNLENBQUMsT0FBTyxHQUFHLE1BQU0sQ0FBQSIsImZpbGUiOiJjb3JlL2NvbmZpZy5qcyIsInNvdXJjZXNDb250ZW50IjpbImxldCBLZXkgICAgID0gcmVxdWlyZSggJy4uL2tleScgKSxcbiAgICBVdGlsICAgID0gcmVxdWlyZSggJy4uL3V0aWwnICksXG4gICAgQ29uc3QgICA9IHJlcXVpcmUoICcuLi9jb25zdCcgKSxcbiAgICBQcm9maWxlID0gZ2xvYmFsLlByb2ZpbGVcblxuY29uc3QgRE9NQUlOUyA9IEtleS5kb21haW5zLFxuICAgICAgUkFORE9NICA9IEtleS5yYW5kb20sXG4gICAgICBJUCAgICAgID0gS2V5LmlwXG5cbmNsYXNzIENvbmZpZyB7XG4gICAgY29uc3RydWN0b3IoIHBhdGggKSB7XG4gICAgICAgIHRoaXMucGFyYW0gPSB7IHBhdGggfVxuICAgIH1cblxuICAgIGdldFBhdGgoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnBhcmFtLnBhdGhcbiAgICB9XG5cbiAgICBnZXRQb3J0T3B0aW9uKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5wYXJhbS5wb3J0T3B0aW9uXG4gICAgfVxuXG4gICAgc2V0UG9ydCggcG9ydCApIHtcbiAgICAgICAgdGhpcy5wYXJhbS5wb3J0ID0gcG9ydFxuICAgIH1cblxuICAgIGdldFBvcnQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnBhcmFtLnBvcnRcbiAgICB9XG5cbiAgICBzZXRQb3J0T3B0aW9uKCBwb3J0ICkge1xuICAgICAgICB0aGlzLnBhcmFtLnBvcnRPcHRpb24gPSBwb3J0XG4gICAgfVxuXG4gICAgYXN5bmMgZ2VuZXJhdGVQb3J0KCkge1xuICAgICAgICBsZXQgaXAgICA9IFByb2ZpbGUuZ2V0KCBJUCApLFxuICAgICAgICAgICAgcGF0aCA9IHRoaXMuZ2V0UGF0aCgpLFxuICAgICAgICAgICAgcG9ydCwgdXJsXG5cbiAgICAgICAgaWYgKCB0aGlzLmdldFBvcnRPcHRpb24oKSA9PSBSQU5ET00gKSB7XG4gICAgICAgICAgICBwb3J0ID0gTWF0aC5yYW5kb20oKSAqIDEwMDAgfCAwICsgNjAwMFxuICAgICAgICAgICAgdGhpcy5zZXRQb3J0KCBwb3J0IClcblxuICAgICAgICAgICAgdXJsID0gYGh0dHA6Ly8ke2lwfToke3BvcnQgKyAxfS9gXG5cbiAgICAgICAgICAgIGF3YWl0IFV0aWwudXBkYXRlSlNPTkZpbGUoIHBhdGggKyBDb25zdC5GSUxFX1NJVEUsIHtcbiAgICAgICAgICAgICAgICAnSkNTVEFUSUNfQkFTRSc6ICAgdXJsLFxuICAgICAgICAgICAgICAgICdNX0pDU1RBVElDX0JBU0UnOiB1cmxcbiAgICAgICAgICAgIH0gKVxuXG4gICAgICAgICAgICBhd2FpdCBVdGlsLnVwZGF0ZUpTT05GaWxlKCBwYXRoICsgQ29uc3QuRklMRV9FVEMsIHtcbiAgICAgICAgICAgICAgICBvblBvcnQ6IHBvcnRcbiAgICAgICAgICAgIH0gKVxuXG4gICAgICAgICAgICBhd2FpdCBVdGlsLnVwZGF0ZUpTT05GaWxlKCBwYXRoICsgQ29uc3QuRklMRV9TRVJWSUNFLCB7XG4gICAgICAgICAgICAgICAgb25Qb3J0OiBwb3J0ICsgMVxuICAgICAgICAgICAgfSApXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBhZGREb21haW4oIGRvbWFpbiApIHtcbiAgICAgICAgbGV0IHBhcmFtICAgICAgPSB0aGlzLnBhcmFtLFxuICAgICAgICAgICAgZG9tYWluc09iaiA9IHBhcmFtLmRvbWFpbnNPYmosXG4gICAgICAgICAgICBkb21haW5zICAgID0gcGFyYW0uZG9tYWluc1xuXG4gICAgICAgIGxldCBbIGtleSwgdmFsdWUgXSA9IGRvbWFpblxuXG4gICAgICAgIGlmICggIShrZXkgaW4gZG9tYWluc09iaiApICkge1xuICAgICAgICAgICAgZG9tYWluc09ialsga2V5IF0gPSB2YWx1ZVxuICAgICAgICAgICAgZG9tYWlucy5wdXNoKCB7XG4gICAgICAgICAgICAgICAga2V5LCB2YWx1ZVxuICAgICAgICAgICAgfSApXG4gICAgICAgICAgICBQcm9maWxlLnNldCggRE9NQUlOUywgZG9tYWluc09iaiApXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBnZXRTYXZlZERvbWFpbnMoKSB7XG4gICAgICAgIGxldCBwYXJhbSAgICAgICAgICA9IHRoaXMucGFyYW0sXG4gICAgICAgICAgICBkZWZhdWx0RG9tYWlucyA9IHBhcmFtLmRvbWFpbnNPYmosXG4gICAgICAgICAgICBkb21haW5zQXJyICAgICA9IHBhcmFtLmRvbWFpbnNcblxuICAgICAgICBpZiAoIGRvbWFpbnNBcnIgKSB7XG4gICAgICAgICAgICByZXR1cm4gZG9tYWluc0FyclxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZGVmYXVsdERvbWFpbnMgPSBQcm9maWxlLmdldCggRE9NQUlOUyApIHx8IHt9XG4gICAgICAgICAgICBkb21haW5zQXJyICAgICA9IFtdXG4gICAgICAgIH1cblxuICAgICAgICBmb3IgKCBsZXQga2V5IGluIGRlZmF1bHREb21haW5zICkge1xuICAgICAgICAgICAgZG9tYWluc0Fyci5wdXNoKCB7XG4gICAgICAgICAgICAgICAgICAgICAgIGtleSxcbiAgICAgICAgICAgICAgICB2YWx1ZTogZGVmYXVsdERvbWFpbnNbIGtleSBdXG4gICAgICAgICAgICB9IClcbiAgICAgICAgfVxuXG4gICAgICAgIHBhcmFtLmRvbWFpbnNPYmogPSBkZWZhdWx0RG9tYWluc1xuICAgICAgICByZXR1cm4gcGFyYW0uZG9tYWlucyA9IGRvbWFpbnNBcnJcbiAgICB9XG5cbiAgICBnZXREb21haW5zU2l6ZSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucGFyYW0uZG9tYWlucy5sZW5ndGhcbiAgICB9XG5cbiAgICBjbGVhckRvbWFpbnMoKSB7XG4gICAgICAgIGxldCBwYXJhbSA9IHRoaXMucGFyYW1cblxuICAgICAgICBQcm9maWxlLmRlbCggRE9NQUlOUyApXG4gICAgICAgIHBhcmFtLmRvbWFpbnNPYmogPSB7fVxuICAgICAgICBwYXJhbS5kb21haW5zICAgID0gW11cbiAgICB9XG5cbiAgICBhc3luYyBpc0lQQ2hhbmdlKCkge1xuICAgICAgICBsZXQgaXAgPSB0aGlzLnBhcmFtLmlwID0gYXdhaXQgVXRpbC5nZXRJUCgpXG4gICAgICAgIHJldHVybiBQcm9maWxlLmdldCggSVAgKSAhPSBpcFxuICAgIH1cblxuICAgIGFzeW5jIHVwZGF0ZUlQKCkge1xuICAgICAgICBsZXQgbWFjID0gYXdhaXQgVXRpbC5nZXRNYWMoKSxcbiAgICAgICAgICAgIHJlcyA9IGF3YWl0IFV0aWwudXBkYXRlTWFjKCBtYWMgKVxuXG4gICAgICAgIGlmICggcmVzICkge1xuICAgICAgICAgICAgbGV0IHBvcnQgPSBVdGlsLmdldFBvcnQoIHRoaXMuZ2V0UGF0aCgpICkgKyAxLFxuICAgICAgICAgICAgICAgIGlwICAgPSBQcm9maWxlLmdldCggSVAgKSxcbiAgICAgICAgICAgICAgICB1cmwgID0gYGh0dHA6Ly8ke2lwfToke3BvcnR9L2BcblxuICAgICAgICAgICAgYXdhaXQgVXRpbC51cGRhdGVKU09ORmlsZSggdGhpcy5nZXRQYXRoKCkgKyBDb25zdC5GSUxFX1NJVEUsIHtcbiAgICAgICAgICAgICAgICAnSkNTVEFUSUNfQkFTRSc6ICAgdXJsLFxuICAgICAgICAgICAgICAgICdNX0pDU1RBVElDX0JBU0UnOiB1cmxcbiAgICAgICAgICAgIH0gKVxuXG4gICAgICAgICAgICBQcm9maWxlLnNldCggSVAsIHRoaXMucGFyYW0uaXAgKVxuICAgICAgICAgICAgcmV0dXJuIHRydWVcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGFzeW5jIHVwZGF0ZVByb3h5KCkge1xuICAgICAgICBsZXQgZG9tYWlucyAgID0gdGhpcy5nZXRTYXZlZERvbWFpbnMoKSxcbiAgICAgICAgICAgIGhvc3RzICAgICA9IHt9LFxuICAgICAgICAgICAgaG9zdFBhcmFtID0gW10sXG4gICAgICAgICAgICBwb3J0XG5cbiAgICAgICAgZG9tYWlucy5mb3JFYWNoKCBkb21haW4gPT4ge1xuICAgICAgICAgICAgaG9zdFBhcmFtLnB1c2goICdob3N0PScgKyBkb21haW4ua2V5IClcbiAgICAgICAgICAgIGhvc3RzWyBkb21haW4ua2V5ICsgQ29uc3QuU0lURV9TVUZGSVggXSA9IGRvbWFpbi52YWx1ZVxuICAgICAgICB9IClcblxuICAgICAgICBhd2FpdCB0aGlzLmdlbmVyYXRlUG9ydCgpXG5cbiAgICAgICAgcG9ydCA9IHRoaXMuZ2V0UG9ydCgpIHx8IFV0aWwuZ2V0UG9ydCggdGhpcy5nZXRQYXRoKCkgKVxuXG4gICAgICAgIGF3YWl0IFV0aWwudXBkYXRlSlNPTkZpbGUoIHRoaXMuZ2V0UGF0aCgpICsgQ29uc3QuRklMRV9WSE9TVCwgaG9zdHMgKVxuICAgICAgICBhd2FpdCBVdGlsLnVwZGF0ZVByb3h5KCBwb3J0LCBob3N0UGFyYW0uam9pbiggJyYnICkgKVxuICAgIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBDb25maWdcbiJdfQ==