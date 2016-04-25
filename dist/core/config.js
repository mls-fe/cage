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
    IP = Key.ip;

var Config = function () {
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
        value: function () {
            var ref = (0, _bluebird.coroutine)(regeneratorRuntime.mark(function _callee() {
                var ip, path, port, url;
                return regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                ip = Profile.get(IP), path = this.getPath(), port = void 0, url = void 0;

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

            function generatePort() {
                return ref.apply(this, arguments);
            }

            return generatePort;
        }()
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
        value: function () {
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
                return ref.apply(this, arguments);
            }

            return isIPChange;
        }()
    }, {
        key: 'updateIP',
        value: function () {
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

            function updateIP() {
                return ref.apply(this, arguments);
            }

            return updateIP;
        }()
    }, {
        key: 'updateProxy',
        value: function () {
            var ref = (0, _bluebird.coroutine)(regeneratorRuntime.mark(function _callee4() {
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

            function updateProxy() {
                return ref.apply(this, arguments);
            }

            return updateProxy;
        }()
    }]);

    return Config;
}();

module.exports = Config;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb3JlL2NvbmZpZy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUEsSUFBSSxNQUFVLFFBQVMsUUFBVCxDQUFkO0lBQ0ksT0FBVSxRQUFTLFNBQVQsQ0FEZDtJQUVJLFFBQVUsUUFBUyxVQUFULENBRmQ7SUFHSSxVQUFVLE9BQU8sT0FIckI7O0FBS0EsSUFBTSxVQUFVLElBQUksT0FBcEI7SUFDTSxTQUFVLElBQUksTUFEcEI7SUFFTSxLQUFVLElBQUksRUFGcEI7O0lBSU0sTTtBQUNGLG9CQUFhLElBQWIsRUFBb0I7QUFBQTs7QUFDaEIsYUFBSyxLQUFMLEdBQWEsRUFBRSxVQUFGLEVBQWI7QUFDSDs7OztrQ0FFUztBQUNOLG1CQUFPLEtBQUssS0FBTCxDQUFXLElBQWxCO0FBQ0g7Ozt3Q0FFZTtBQUNaLG1CQUFPLEtBQUssS0FBTCxDQUFXLFVBQWxCO0FBQ0g7OztnQ0FFUSxJLEVBQU87QUFDWixpQkFBSyxLQUFMLENBQVcsSUFBWCxHQUFrQixJQUFsQjtBQUNIOzs7a0NBRVM7QUFDTixtQkFBTyxLQUFLLEtBQUwsQ0FBVyxJQUFsQjtBQUNIOzs7c0NBRWMsSSxFQUFPO0FBQ2xCLGlCQUFLLEtBQUwsQ0FBVyxVQUFYLEdBQXdCLElBQXhCO0FBQ0g7Ozs7O29CQUdPLEUsRUFDQSxJLEVBQ0EsSSxFQUFNLEc7Ozs7O0FBRk4sa0MsR0FBTyxRQUFRLEdBQVIsQ0FBYSxFQUFiLEMsRUFDUCxJLEdBQU8sS0FBSyxPQUFMLEUsRUFDUCxJLFdBQU0sRzs7c0NBRUwsS0FBSyxhQUFMLE1BQXdCLE07Ozs7O0FBQ3pCLHVDQUFPLEtBQUssTUFBTCxLQUFnQixJQUFoQixHQUF1QixJQUFJLElBQWxDO0FBQ0EscUNBQUssT0FBTCxDQUFjLElBQWQ7O0FBRUEsa0RBQWdCLEVBQWhCLFVBQXNCLE9BQU8sQ0FBN0I7Ozt1Q0FFTSxLQUFLLGNBQUwsQ0FBcUIsT0FBTyxNQUFNLFNBQWxDLEVBQTZDO0FBQy9DLHFEQUFvQixHQUQy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Q0EsMENBQU8sT0FBTyxHQUFQLEdBQWEsTUFBTSxXQUExQixJQUEwQyxPQUFPLEtBQWpEO0FBQ0gsaUNBSEQ7Ozt1Q0FLTSxLQUFLLFlBQUwsRTs7OztBQUVOLHVDQUFPLEtBQUssT0FBTCxNQUFrQixLQUFLLE9BQUwsQ0FBYyxLQUFLLE9BQUwsRUFBZCxDQUF6Qjs7O3VDQUVNLEtBQUssY0FBTCxDQUFxQixLQUFLLE9BQUwsS0FBaUIsTUFBTSxVQUE1QyxFQUF3RCxLQUF4RCxDOzs7O3VDQUNBLEtBQUssV0FBTCxDQUFrQixJQUFsQixFQUF3QixVQUFVLElBQVYsQ0FBZ0IsR0FBaEIsQ0FBeEIsQzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBSWQsT0FBTyxPQUFQLEdBQWlCLE1BQWpCIiwiZmlsZSI6ImNvbmZpZy5qcyIsInNvdXJjZXNDb250ZW50IjpbImxldCBLZXkgICAgID0gcmVxdWlyZSggJy4uL2tleScgKSxcbiAgICBVdGlsICAgID0gcmVxdWlyZSggJy4uL3V0aWwnICksXG4gICAgQ29uc3QgICA9IHJlcXVpcmUoICcuLi9jb25zdCcgKSxcbiAgICBQcm9maWxlID0gZ2xvYmFsLlByb2ZpbGVcblxuY29uc3QgRE9NQUlOUyA9IEtleS5kb21haW5zLFxuICAgICAgUkFORE9NICA9IEtleS5yYW5kb20sXG4gICAgICBJUCAgICAgID0gS2V5LmlwXG5cbmNsYXNzIENvbmZpZyB7XG4gICAgY29uc3RydWN0b3IoIHBhdGggKSB7XG4gICAgICAgIHRoaXMucGFyYW0gPSB7IHBhdGggfVxuICAgIH1cblxuICAgIGdldFBhdGgoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnBhcmFtLnBhdGhcbiAgICB9XG5cbiAgICBnZXRQb3J0T3B0aW9uKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5wYXJhbS5wb3J0T3B0aW9uXG4gICAgfVxuXG4gICAgc2V0UG9ydCggcG9ydCApIHtcbiAgICAgICAgdGhpcy5wYXJhbS5wb3J0ID0gcG9ydFxuICAgIH1cblxuICAgIGdldFBvcnQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnBhcmFtLnBvcnRcbiAgICB9XG5cbiAgICBzZXRQb3J0T3B0aW9uKCBwb3J0ICkge1xuICAgICAgICB0aGlzLnBhcmFtLnBvcnRPcHRpb24gPSBwb3J0XG4gICAgfVxuXG4gICAgYXN5bmMgZ2VuZXJhdGVQb3J0KCkge1xuICAgICAgICBsZXQgaXAgICA9IFByb2ZpbGUuZ2V0KCBJUCApLFxuICAgICAgICAgICAgcGF0aCA9IHRoaXMuZ2V0UGF0aCgpLFxuICAgICAgICAgICAgcG9ydCwgdXJsXG5cbiAgICAgICAgaWYgKCB0aGlzLmdldFBvcnRPcHRpb24oKSA9PSBSQU5ET00gKSB7XG4gICAgICAgICAgICBwb3J0ID0gTWF0aC5yYW5kb20oKSAqIDEwMDAgfCAwICsgNjAwMFxuICAgICAgICAgICAgdGhpcy5zZXRQb3J0KCBwb3J0IClcblxuICAgICAgICAgICAgdXJsID0gYGh0dHA6Ly8ke2lwfToke3BvcnQgKyAxfS9gXG5cbiAgICAgICAgICAgIGF3YWl0IFV0aWwudXBkYXRlSlNPTkZpbGUoIHBhdGggKyBDb25zdC5GSUxFX1NJVEUsIHtcbiAgICAgICAgICAgICAgICAnSkNTVEFUSUNfQkFTRScgICA6IHVybCxcbiAgICAgICAgICAgICAgICAnTV9KQ1NUQVRJQ19CQVNFJyA6IHVybFxuICAgICAgICAgICAgfSApXG5cbiAgICAgICAgICAgIGF3YWl0IFV0aWwudXBkYXRlSlNPTkZpbGUoIHBhdGggKyBDb25zdC5GSUxFX0VUQywge1xuICAgICAgICAgICAgICAgIG9uUG9ydCA6IHBvcnRcbiAgICAgICAgICAgIH0gKVxuXG4gICAgICAgICAgICBhd2FpdCBVdGlsLnVwZGF0ZUpTT05GaWxlKCBwYXRoICsgQ29uc3QuRklMRV9TRVJWSUNFLCB7XG4gICAgICAgICAgICAgICAgb25Qb3J0IDogcG9ydCArIDFcbiAgICAgICAgICAgIH0gKVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgYWRkRG9tYWluKCBkb21haW4gKSB7XG4gICAgICAgIGxldCBwYXJhbSAgICAgID0gdGhpcy5wYXJhbSxcbiAgICAgICAgICAgIGRvbWFpbnNPYmogPSBwYXJhbS5kb21haW5zT2JqLFxuICAgICAgICAgICAgZG9tYWlucyAgICA9IHBhcmFtLmRvbWFpbnNcblxuICAgICAgICBsZXQgWyBrZXksIHZhbHVlIF0gPSBkb21haW5cblxuICAgICAgICBpZiAoICEoa2V5IGluIGRvbWFpbnNPYmogKSApIHtcbiAgICAgICAgICAgIGRvbWFpbnNPYmpbIGtleSBdID0gdmFsdWVcbiAgICAgICAgICAgIGRvbWFpbnMucHVzaCgge1xuICAgICAgICAgICAgICAgIGtleSwgdmFsdWVcbiAgICAgICAgICAgIH0gKVxuICAgICAgICAgICAgUHJvZmlsZS5zZXQoIERPTUFJTlMsIGRvbWFpbnNPYmogKVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgZ2V0U2F2ZWREb21haW5zKCkge1xuICAgICAgICBsZXQgcGFyYW0gICAgICAgICAgPSB0aGlzLnBhcmFtLFxuICAgICAgICAgICAgZGVmYXVsdERvbWFpbnMgPSBwYXJhbS5kb21haW5zT2JqLFxuICAgICAgICAgICAgZG9tYWluc0FyciAgICAgPSBwYXJhbS5kb21haW5zXG5cbiAgICAgICAgaWYgKCBkb21haW5zQXJyICkge1xuICAgICAgICAgICAgcmV0dXJuIGRvbWFpbnNBcnJcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGRlZmF1bHREb21haW5zID0gUHJvZmlsZS5nZXQoIERPTUFJTlMgKSB8fCB7fVxuICAgICAgICAgICAgZG9tYWluc0FyciAgICAgPSBbXVxuICAgICAgICB9XG5cbiAgICAgICAgZm9yICggbGV0IGtleSBpbiBkZWZhdWx0RG9tYWlucyApIHtcbiAgICAgICAgICAgIGRvbWFpbnNBcnIucHVzaCgge1xuICAgICAgICAgICAgICAgIGtleSxcbiAgICAgICAgICAgICAgICB2YWx1ZSA6IGRlZmF1bHREb21haW5zWyBrZXkgXVxuICAgICAgICAgICAgfSApXG4gICAgICAgIH1cblxuICAgICAgICBwYXJhbS5kb21haW5zT2JqID0gZGVmYXVsdERvbWFpbnNcbiAgICAgICAgcmV0dXJuIHBhcmFtLmRvbWFpbnMgPSBkb21haW5zQXJyXG4gICAgfVxuXG4gICAgZ2V0RG9tYWluc1NpemUoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnBhcmFtLmRvbWFpbnMubGVuZ3RoXG4gICAgfVxuXG4gICAgY2xlYXJEb21haW5zKCkge1xuICAgICAgICBsZXQgcGFyYW0gPSB0aGlzLnBhcmFtXG5cbiAgICAgICAgUHJvZmlsZS5kZWwoIERPTUFJTlMgKVxuICAgICAgICBwYXJhbS5kb21haW5zT2JqID0ge31cbiAgICAgICAgcGFyYW0uZG9tYWlucyAgICA9IFtdXG4gICAgfVxuXG4gICAgYXN5bmMgaXNJUENoYW5nZSgpIHtcbiAgICAgICAgbGV0IGlwID0gdGhpcy5wYXJhbS5pcCA9IGF3YWl0IFV0aWwuZ2V0SVAoKVxuICAgICAgICBsb2coIGlwLCAnZGVidWcnIClcbiAgICAgICAgcmV0dXJuIFByb2ZpbGUuZ2V0KCBJUCApICE9IGlwXG4gICAgfVxuXG4gICAgYXN5bmMgdXBkYXRlSVAoKSB7XG4gICAgICAgIGxldCBtYWMgPSBhd2FpdCBVdGlsLmdldE1hYygpLFxuICAgICAgICAgICAgcmVzID0gYXdhaXQgVXRpbC51cGRhdGVNYWMoIG1hYyApXG5cbiAgICAgICAgaWYgKCByZXMgKSB7XG4gICAgICAgICAgICBsZXQgcG9ydCA9IFV0aWwuZ2V0UG9ydCggdGhpcy5nZXRQYXRoKCkgKSArIDEsXG4gICAgICAgICAgICAgICAgaXAgICA9IFByb2ZpbGUuZ2V0KCBJUCApLFxuICAgICAgICAgICAgICAgIHVybCAgPSBgaHR0cDovLyR7aXB9OiR7cG9ydH0vYFxuXG4gICAgICAgICAgICBhd2FpdCBVdGlsLnVwZGF0ZUpTT05GaWxlKCB0aGlzLmdldFBhdGgoKSArIENvbnN0LkZJTEVfU0lURSwge1xuICAgICAgICAgICAgICAgICdKQ1NUQVRJQ19CQVNFJyAgIDogdXJsLFxuICAgICAgICAgICAgICAgICdNX0pDU1RBVElDX0JBU0UnIDogdXJsXG4gICAgICAgICAgICB9IClcblxuICAgICAgICAgICAgUHJvZmlsZS5zZXQoIElQLCB0aGlzLnBhcmFtLmlwIClcbiAgICAgICAgICAgIHJldHVybiB0cnVlXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBhc3luYyB1cGRhdGVQcm94eSgpIHtcbiAgICAgICAgbGV0IGRvbWFpbnMgICA9IHRoaXMuZ2V0U2F2ZWREb21haW5zKCksXG4gICAgICAgICAgICBob3N0cyAgICAgPSB7fSxcbiAgICAgICAgICAgIGhvc3RQYXJhbSA9IFtdLFxuICAgICAgICAgICAgcG9ydFxuXG4gICAgICAgIGRvbWFpbnMuZm9yRWFjaCggZG9tYWluID0+IHtcbiAgICAgICAgICAgIGhvc3RQYXJhbS5wdXNoKCAnaG9zdD0nICsgZG9tYWluLmtleSApXG4gICAgICAgICAgICBob3N0c1sgZG9tYWluLmtleSArIENvbnN0LlNJVEVfU1VGRklYIF0gPSBkb21haW4udmFsdWVcbiAgICAgICAgfSApXG5cbiAgICAgICAgYXdhaXQgdGhpcy5nZW5lcmF0ZVBvcnQoKVxuXG4gICAgICAgIHBvcnQgPSB0aGlzLmdldFBvcnQoKSB8fCBVdGlsLmdldFBvcnQoIHRoaXMuZ2V0UGF0aCgpIClcblxuICAgICAgICBhd2FpdCBVdGlsLnVwZGF0ZUpTT05GaWxlKCB0aGlzLmdldFBhdGgoKSArIENvbnN0LkZJTEVfVkhPU1QsIGhvc3RzIClcbiAgICAgICAgYXdhaXQgVXRpbC51cGRhdGVQcm94eSggcG9ydCwgaG9zdFBhcmFtLmpvaW4oICcmJyApIClcbiAgICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gQ29uZmlnXG4iXX0=