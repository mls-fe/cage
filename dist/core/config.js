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

                                port = Util.getPort(this.getPath()) + 1, ip = this.param.ip, url = 'http://' + ip + ':' + port + '/';
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb3JlL2NvbmZpZy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUEsSUFBSSxNQUFVLFFBQVMsUUFBVCxDQUFkO0lBQ0ksT0FBVSxRQUFTLFNBQVQsQ0FEZDtJQUVJLFFBQVUsUUFBUyxVQUFULENBRmQ7SUFHSSxVQUFVLE9BQU8sT0FIckI7O0FBS0EsSUFBTSxVQUFVLElBQUksT0FBcEI7SUFDTSxTQUFVLElBQUksTUFEcEI7SUFFTSxLQUFVLElBQUksRUFGcEI7O0lBSU0sTTtBQUNGLG9CQUFhLElBQWIsRUFBb0I7QUFBQTs7QUFDaEIsYUFBSyxLQUFMLEdBQWEsRUFBRSxVQUFGLEVBQWI7QUFDSDs7OztrQ0FFUztBQUNOLG1CQUFPLEtBQUssS0FBTCxDQUFXLElBQWxCO0FBQ0g7Ozt3Q0FFZTtBQUNaLG1CQUFPLEtBQUssS0FBTCxDQUFXLFVBQWxCO0FBQ0g7OztnQ0FFUSxJLEVBQU87QUFDWixpQkFBSyxLQUFMLENBQVcsSUFBWCxHQUFrQixJQUFsQjtBQUNIOzs7a0NBRVM7QUFDTixtQkFBTyxLQUFLLEtBQUwsQ0FBVyxJQUFsQjtBQUNIOzs7c0NBRWMsSSxFQUFPO0FBQ2xCLGlCQUFLLEtBQUwsQ0FBVyxVQUFYLEdBQXdCLElBQXhCO0FBQ0g7Ozs7O29CQUdPLEUsRUFDQSxJLEVBQ0EsSSxFQUFNLEc7Ozs7O0FBRk4sa0MsR0FBTyxRQUFRLEdBQVIsQ0FBYSxFQUFiLEMsRUFDUCxJLEdBQU8sS0FBSyxPQUFMLEUsRUFDUCxJLFdBQU0sRzs7c0NBRUwsS0FBSyxhQUFMLE1BQXdCLE07Ozs7O0FBQ3pCLHVDQUFPLEtBQUssTUFBTCxLQUFnQixJQUFoQixHQUF1QixJQUFJLElBQWxDO0FBQ0EscUNBQUssT0FBTCxDQUFjLElBQWQ7O0FBRUEsa0RBQWdCLEVBQWhCLFVBQXNCLE9BQU8sQ0FBN0I7Ozt1Q0FFTSxLQUFLLGNBQUwsQ0FBcUIsT0FBTyxNQUFNLFNBQWxDLEVBQTZDO0FBQy9DLHFEQUFtQixHQUQ0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Q0FBTyxPQUFPLEdBQVAsR0FBYSxNQUFNLFdBQTFCLElBQTBDLE9BQU8sS0FBakQ7QUFDSCxpQ0FIRDs7O3VDQUtNLEtBQUssWUFBTCxFOzs7O0FBRU4sdUNBQU8sS0FBSyxPQUFMLE1BQWtCLEtBQUssT0FBTCxDQUFjLEtBQUssT0FBTCxFQUFkLENBQXpCOzs7dUNBRU0sS0FBSyxjQUFMLENBQXFCLEtBQUssT0FBTCxLQUFpQixNQUFNLFVBQTVDLEVBQXdELEtBQXhELEM7Ozs7dUNBQ0EsS0FBSyxXQUFMLENBQWtCLElBQWxCLEVBQXdCLFVBQVUsSUFBVixDQUFnQixHQUFoQixDQUF4QixDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFJZCxPQUFPLE9BQVAsR0FBaUIsTUFBakIiLCJmaWxlIjoiY29uZmlnLmpzIiwic291cmNlc0NvbnRlbnQiOlsibGV0IEtleSAgICAgPSByZXF1aXJlKCAnLi4va2V5JyApLFxuICAgIFV0aWwgICAgPSByZXF1aXJlKCAnLi4vdXRpbCcgKSxcbiAgICBDb25zdCAgID0gcmVxdWlyZSggJy4uL2NvbnN0JyApLFxuICAgIFByb2ZpbGUgPSBnbG9iYWwuUHJvZmlsZVxuXG5jb25zdCBET01BSU5TID0gS2V5LmRvbWFpbnMsXG4gICAgICBSQU5ET00gID0gS2V5LnJhbmRvbSxcbiAgICAgIElQICAgICAgPSBLZXkuaXBcblxuY2xhc3MgQ29uZmlnIHtcbiAgICBjb25zdHJ1Y3RvciggcGF0aCApIHtcbiAgICAgICAgdGhpcy5wYXJhbSA9IHsgcGF0aCB9XG4gICAgfVxuXG4gICAgZ2V0UGF0aCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucGFyYW0ucGF0aFxuICAgIH1cblxuICAgIGdldFBvcnRPcHRpb24oKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnBhcmFtLnBvcnRPcHRpb25cbiAgICB9XG5cbiAgICBzZXRQb3J0KCBwb3J0ICkge1xuICAgICAgICB0aGlzLnBhcmFtLnBvcnQgPSBwb3J0XG4gICAgfVxuXG4gICAgZ2V0UG9ydCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucGFyYW0ucG9ydFxuICAgIH1cblxuICAgIHNldFBvcnRPcHRpb24oIHBvcnQgKSB7XG4gICAgICAgIHRoaXMucGFyYW0ucG9ydE9wdGlvbiA9IHBvcnRcbiAgICB9XG5cbiAgICBhc3luYyBnZW5lcmF0ZVBvcnQoKSB7XG4gICAgICAgIGxldCBpcCAgID0gUHJvZmlsZS5nZXQoIElQICksXG4gICAgICAgICAgICBwYXRoID0gdGhpcy5nZXRQYXRoKCksXG4gICAgICAgICAgICBwb3J0LCB1cmxcblxuICAgICAgICBpZiAoIHRoaXMuZ2V0UG9ydE9wdGlvbigpID09IFJBTkRPTSApIHtcbiAgICAgICAgICAgIHBvcnQgPSBNYXRoLnJhbmRvbSgpICogMTAwMCB8IDAgKyA2MDAwXG4gICAgICAgICAgICB0aGlzLnNldFBvcnQoIHBvcnQgKVxuXG4gICAgICAgICAgICB1cmwgPSBgaHR0cDovLyR7aXB9OiR7cG9ydCArIDF9L2BcblxuICAgICAgICAgICAgYXdhaXQgVXRpbC51cGRhdGVKU09ORmlsZSggcGF0aCArIENvbnN0LkZJTEVfU0lURSwge1xuICAgICAgICAgICAgICAgICdKQ1NUQVRJQ19CQVNFJyAgOiB1cmwsXG4gICAgICAgICAgICAgICAgJ01fSkNTVEFUSUNfQkFTRSc6IHVybFxuICAgICAgICAgICAgfSApXG5cbiAgICAgICAgICAgIGF3YWl0IFV0aWwudXBkYXRlSlNPTkZpbGUoIHBhdGggKyBDb25zdC5GSUxFX0VUQywge1xuICAgICAgICAgICAgICAgIG9uUG9ydDogcG9ydFxuICAgICAgICAgICAgfSApXG5cbiAgICAgICAgICAgIGF3YWl0IFV0aWwudXBkYXRlSlNPTkZpbGUoIHBhdGggKyBDb25zdC5GSUxFX1NFUlZJQ0UsIHtcbiAgICAgICAgICAgICAgICBvblBvcnQ6IHBvcnQgKyAxXG4gICAgICAgICAgICB9IClcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGFkZERvbWFpbiggZG9tYWluICkge1xuICAgICAgICBsZXQgcGFyYW0gICAgICA9IHRoaXMucGFyYW0sXG4gICAgICAgICAgICBkb21haW5zT2JqID0gcGFyYW0uZG9tYWluc09iaixcbiAgICAgICAgICAgIGRvbWFpbnMgICAgPSBwYXJhbS5kb21haW5zXG5cbiAgICAgICAgbGV0IFsga2V5LCB2YWx1ZSBdID0gZG9tYWluXG5cbiAgICAgICAgaWYgKCAhKGtleSBpbiBkb21haW5zT2JqICkgKSB7XG4gICAgICAgICAgICBkb21haW5zT2JqWyBrZXkgXSA9IHZhbHVlXG4gICAgICAgICAgICBkb21haW5zLnB1c2goIHtcbiAgICAgICAgICAgICAgICBrZXksIHZhbHVlXG4gICAgICAgICAgICB9IClcbiAgICAgICAgICAgIFByb2ZpbGUuc2V0KCBET01BSU5TLCBkb21haW5zT2JqIClcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGdldFNhdmVkRG9tYWlucygpIHtcbiAgICAgICAgbGV0IHBhcmFtICAgICAgICAgID0gdGhpcy5wYXJhbSxcbiAgICAgICAgICAgIGRlZmF1bHREb21haW5zID0gcGFyYW0uZG9tYWluc09iaixcbiAgICAgICAgICAgIGRvbWFpbnNBcnIgICAgID0gcGFyYW0uZG9tYWluc1xuXG4gICAgICAgIGlmICggZG9tYWluc0FyciApIHtcbiAgICAgICAgICAgIHJldHVybiBkb21haW5zQXJyXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBkZWZhdWx0RG9tYWlucyA9IFByb2ZpbGUuZ2V0KCBET01BSU5TICkgfHwge31cbiAgICAgICAgICAgIGRvbWFpbnNBcnIgICAgID0gW11cbiAgICAgICAgfVxuXG4gICAgICAgIGZvciAoIGxldCBrZXkgaW4gZGVmYXVsdERvbWFpbnMgKSB7XG4gICAgICAgICAgICBkb21haW5zQXJyLnB1c2goIHtcbiAgICAgICAgICAgICAgICBrZXksXG4gICAgICAgICAgICAgICAgdmFsdWU6IGRlZmF1bHREb21haW5zWyBrZXkgXVxuICAgICAgICAgICAgfSApXG4gICAgICAgIH1cblxuICAgICAgICBwYXJhbS5kb21haW5zT2JqID0gZGVmYXVsdERvbWFpbnNcbiAgICAgICAgcmV0dXJuIHBhcmFtLmRvbWFpbnMgPSBkb21haW5zQXJyXG4gICAgfVxuXG4gICAgZ2V0RG9tYWluc1NpemUoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnBhcmFtLmRvbWFpbnMubGVuZ3RoXG4gICAgfVxuXG4gICAgY2xlYXJEb21haW5zKCkge1xuICAgICAgICBsZXQgcGFyYW0gPSB0aGlzLnBhcmFtXG5cbiAgICAgICAgUHJvZmlsZS5kZWwoIERPTUFJTlMgKVxuICAgICAgICBwYXJhbS5kb21haW5zT2JqID0ge31cbiAgICAgICAgcGFyYW0uZG9tYWlucyAgICA9IFtdXG4gICAgfVxuXG4gICAgYXN5bmMgaXNJUENoYW5nZSgpIHtcbiAgICAgICAgbGV0IGlwID0gdGhpcy5wYXJhbS5pcCA9IGF3YWl0IFV0aWwuZ2V0SVAoKVxuICAgICAgICBsb2coIGlwLCAnZGVidWcnIClcbiAgICAgICAgcmV0dXJuIFByb2ZpbGUuZ2V0KCBJUCApICE9IGlwXG4gICAgfVxuXG4gICAgYXN5bmMgdXBkYXRlSVAoKSB7XG4gICAgICAgIGxldCBtYWMgPSBhd2FpdCBVdGlsLmdldE1hYygpLFxuICAgICAgICAgICAgcmVzID0gYXdhaXQgVXRpbC51cGRhdGVNYWMoIG1hYyApXG5cbiAgICAgICAgaWYgKCByZXMgKSB7XG4gICAgICAgICAgICBsZXQgcG9ydCA9IFV0aWwuZ2V0UG9ydCggdGhpcy5nZXRQYXRoKCkgKSArIDEsXG4gICAgICAgICAgICAgICAgaXAgICA9IHRoaXMucGFyYW0uaXAsXG4gICAgICAgICAgICAgICAgdXJsICA9IGBodHRwOi8vJHtpcH06JHtwb3J0fS9gXG5cbiAgICAgICAgICAgIGF3YWl0IFV0aWwudXBkYXRlSlNPTkZpbGUoIHRoaXMuZ2V0UGF0aCgpICsgQ29uc3QuRklMRV9TSVRFLCB7XG4gICAgICAgICAgICAgICAgJ0pDU1RBVElDX0JBU0UnICA6IHVybCxcbiAgICAgICAgICAgICAgICAnTV9KQ1NUQVRJQ19CQVNFJzogdXJsXG4gICAgICAgICAgICB9IClcblxuICAgICAgICAgICAgUHJvZmlsZS5zZXQoIElQLCB0aGlzLnBhcmFtLmlwIClcbiAgICAgICAgICAgIHJldHVybiB0cnVlXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBhc3luYyB1cGRhdGVQcm94eSgpIHtcbiAgICAgICAgbGV0IGRvbWFpbnMgICA9IHRoaXMuZ2V0U2F2ZWREb21haW5zKCksXG4gICAgICAgICAgICBob3N0cyAgICAgPSB7fSxcbiAgICAgICAgICAgIGhvc3RQYXJhbSA9IFtdLFxuICAgICAgICAgICAgcG9ydFxuXG4gICAgICAgIGRvbWFpbnMuZm9yRWFjaCggZG9tYWluID0+IHtcbiAgICAgICAgICAgIGhvc3RQYXJhbS5wdXNoKCAnaG9zdD0nICsgZG9tYWluLmtleSApXG4gICAgICAgICAgICBob3N0c1sgZG9tYWluLmtleSArIENvbnN0LlNJVEVfU1VGRklYIF0gPSBkb21haW4udmFsdWVcbiAgICAgICAgfSApXG5cbiAgICAgICAgYXdhaXQgdGhpcy5nZW5lcmF0ZVBvcnQoKVxuXG4gICAgICAgIHBvcnQgPSB0aGlzLmdldFBvcnQoKSB8fCBVdGlsLmdldFBvcnQoIHRoaXMuZ2V0UGF0aCgpIClcblxuICAgICAgICBhd2FpdCBVdGlsLnVwZGF0ZUpTT05GaWxlKCB0aGlzLmdldFBhdGgoKSArIENvbnN0LkZJTEVfVkhPU1QsIGhvc3RzIClcbiAgICAgICAgYXdhaXQgVXRpbC51cGRhdGVQcm94eSggcG9ydCwgaG9zdFBhcmFtLmpvaW4oICcmJyApIClcbiAgICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gQ29uZmlnXG4iXX0=