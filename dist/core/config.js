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
        value: function isIPChange() {
            var ip = this.param.ip = Util.getIP();
            log(ip, 'debug');
            return Profile.get(IP) != ip;
        }
    }, {
        key: 'updateIP',
        value: function () {
            var ref = (0, _bluebird.coroutine)(regeneratorRuntime.mark(function _callee2() {
                var mac, res, port, ip, url;
                return regeneratorRuntime.wrap(function _callee2$(_context2) {
                    while (1) {
                        switch (_context2.prev = _context2.next) {
                            case 0:
                                _context2.next = 2;
                                return Util.getMac();

                            case 2:
                                mac = _context2.sent;
                                _context2.next = 5;
                                return Util.updateMac(mac);

                            case 5:
                                res = _context2.sent;

                                if (!res) {
                                    _context2.next = 12;
                                    break;
                                }

                                port = Util.getPort(this.getPath()) + 1, ip = this.param.ip, url = 'http://' + ip + ':' + port + '/';
                                _context2.next = 10;
                                return Util.updateJSONFile(this.getPath() + Const.FILE_SITE, {
                                    'JCSTATIC_BASE': url,
                                    'M_JCSTATIC_BASE': url
                                });

                            case 10:

                                Profile.set(IP, this.param.ip);
                                return _context2.abrupt('return', true);

                            case 12:
                            case 'end':
                                return _context2.stop();
                        }
                    }
                }, _callee2, this);
            }));

            function updateIP() {
                return ref.apply(this, arguments);
            }

            return updateIP;
        }()
    }, {
        key: 'updateProxy',
        value: function () {
            var ref = (0, _bluebird.coroutine)(regeneratorRuntime.mark(function _callee3() {
                var domains, hosts, hostParam, port;
                return regeneratorRuntime.wrap(function _callee3$(_context3) {
                    while (1) {
                        switch (_context3.prev = _context3.next) {
                            case 0:
                                domains = this.getSavedDomains(), hosts = {}, hostParam = [], port = void 0;


                                domains.forEach(function (domain) {
                                    hostParam.push('host=' + domain.key);
                                    hosts[domain.key + Const.SITE_SUFFIX] = domain.value;
                                });

                                _context3.next = 4;
                                return this.generatePort();

                            case 4:

                                port = this.getPort() || Util.getPort(this.getPath());

                                _context3.next = 7;
                                return Util.updateJSONFile(this.getPath() + Const.FILE_VHOST, hosts);

                            case 7:
                                _context3.next = 9;
                                return Util.updateProxy(port, hostParam.join('&'));

                            case 9:
                            case 'end':
                                return _context3.stop();
                        }
                    }
                }, _callee3, this);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb3JlL2NvbmZpZy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUEsSUFBSSxNQUFVLFFBQVMsUUFBVCxDQUFkO0lBQ0ksT0FBVSxRQUFTLFNBQVQsQ0FEZDtJQUVJLFFBQVUsUUFBUyxVQUFULENBRmQ7SUFHSSxVQUFVLE9BQU8sT0FIckI7O0FBS0EsSUFBTSxVQUFVLElBQUksT0FBcEI7SUFDTSxTQUFVLElBQUksTUFEcEI7SUFFTSxLQUFVLElBQUksRUFGcEI7O0lBSU0sTTtBQUNGLG9CQUFhLElBQWIsRUFBb0I7QUFBQTs7QUFDaEIsYUFBSyxLQUFMLEdBQWEsRUFBRSxVQUFGLEVBQWI7QUFDSDs7OztrQ0FFUztBQUNOLG1CQUFPLEtBQUssS0FBTCxDQUFXLElBQWxCO0FBQ0g7Ozt3Q0FFZTtBQUNaLG1CQUFPLEtBQUssS0FBTCxDQUFXLFVBQWxCO0FBQ0g7OztnQ0FFUSxJLEVBQU87QUFDWixpQkFBSyxLQUFMLENBQVcsSUFBWCxHQUFrQixJQUFsQjtBQUNIOzs7a0NBRVM7QUFDTixtQkFBTyxLQUFLLEtBQUwsQ0FBVyxJQUFsQjtBQUNIOzs7c0NBRWMsSSxFQUFPO0FBQ2xCLGlCQUFLLEtBQUwsQ0FBVyxVQUFYLEdBQXdCLElBQXhCO0FBQ0g7Ozs7O29CQUdPLEUsRUFDQSxJLEVBQ0EsSSxFQUFNLEc7Ozs7O0FBRk4sa0MsR0FBTyxRQUFRLEdBQVIsQ0FBYSxFQUFiLEMsRUFDUCxJLEdBQU8sS0FBSyxPQUFMLEUsRUFDUCxJLFdBQU0sRzs7c0NBRUwsS0FBSyxhQUFMLE1BQXdCLE07Ozs7O0FBQ3pCLHVDQUFPLEtBQUssTUFBTCxLQUFnQixJQUFoQixHQUF1QixJQUFJLElBQWxDO0FBQ0EscUNBQUssT0FBTCxDQUFjLElBQWQ7O0FBRUEsa0RBQWdCLEVBQWhCLFVBQXNCLE9BQU8sQ0FBN0I7Ozt1Q0FFTSxLQUFLLGNBQUwsQ0FBcUIsT0FBTyxNQUFNLFNBQWxDLEVBQTZDO0FBQy9DLHFEQUFvQixHQUQy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QU8sR0FBUCxHQUFhLE1BQU0sV0FBMUIsSUFBMEMsT0FBTyxLQUFqRDtBQUNILGlDQUhEOzs7dUNBS00sS0FBSyxZQUFMLEU7Ozs7QUFFTix1Q0FBTyxLQUFLLE9BQUwsTUFBa0IsS0FBSyxPQUFMLENBQWMsS0FBSyxPQUFMLEVBQWQsQ0FBekI7Ozt1Q0FFTSxLQUFLLGNBQUwsQ0FBcUIsS0FBSyxPQUFMLEtBQWlCLE1BQU0sVUFBNUMsRUFBd0QsS0FBeEQsQzs7Ozt1Q0FDQSxLQUFLLFdBQUwsQ0FBa0IsSUFBbEIsRUFBd0IsVUFBVSxJQUFWLENBQWdCLEdBQWhCLENBQXhCLEM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUlkLE9BQU8sT0FBUCxHQUFpQixNQUFqQiIsImZpbGUiOiJjb25maWcuanMiLCJzb3VyY2VzQ29udGVudCI6WyJsZXQgS2V5ICAgICA9IHJlcXVpcmUoICcuLi9rZXknICksXG4gICAgVXRpbCAgICA9IHJlcXVpcmUoICcuLi91dGlsJyApLFxuICAgIENvbnN0ICAgPSByZXF1aXJlKCAnLi4vY29uc3QnICksXG4gICAgUHJvZmlsZSA9IGdsb2JhbC5Qcm9maWxlXG5cbmNvbnN0IERPTUFJTlMgPSBLZXkuZG9tYWlucyxcbiAgICAgIFJBTkRPTSAgPSBLZXkucmFuZG9tLFxuICAgICAgSVAgICAgICA9IEtleS5pcFxuXG5jbGFzcyBDb25maWcge1xuICAgIGNvbnN0cnVjdG9yKCBwYXRoICkge1xuICAgICAgICB0aGlzLnBhcmFtID0geyBwYXRoIH1cbiAgICB9XG5cbiAgICBnZXRQYXRoKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5wYXJhbS5wYXRoXG4gICAgfVxuXG4gICAgZ2V0UG9ydE9wdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucGFyYW0ucG9ydE9wdGlvblxuICAgIH1cblxuICAgIHNldFBvcnQoIHBvcnQgKSB7XG4gICAgICAgIHRoaXMucGFyYW0ucG9ydCA9IHBvcnRcbiAgICB9XG5cbiAgICBnZXRQb3J0KCkge1xuICAgICAgICByZXR1cm4gdGhpcy5wYXJhbS5wb3J0XG4gICAgfVxuXG4gICAgc2V0UG9ydE9wdGlvbiggcG9ydCApIHtcbiAgICAgICAgdGhpcy5wYXJhbS5wb3J0T3B0aW9uID0gcG9ydFxuICAgIH1cblxuICAgIGFzeW5jIGdlbmVyYXRlUG9ydCgpIHtcbiAgICAgICAgbGV0IGlwICAgPSBQcm9maWxlLmdldCggSVAgKSxcbiAgICAgICAgICAgIHBhdGggPSB0aGlzLmdldFBhdGgoKSxcbiAgICAgICAgICAgIHBvcnQsIHVybFxuXG4gICAgICAgIGlmICggdGhpcy5nZXRQb3J0T3B0aW9uKCkgPT0gUkFORE9NICkge1xuICAgICAgICAgICAgcG9ydCA9IE1hdGgucmFuZG9tKCkgKiAxMDAwIHwgMCArIDYwMDBcbiAgICAgICAgICAgIHRoaXMuc2V0UG9ydCggcG9ydCApXG5cbiAgICAgICAgICAgIHVybCA9IGBodHRwOi8vJHtpcH06JHtwb3J0ICsgMX0vYFxuXG4gICAgICAgICAgICBhd2FpdCBVdGlsLnVwZGF0ZUpTT05GaWxlKCBwYXRoICsgQ29uc3QuRklMRV9TSVRFLCB7XG4gICAgICAgICAgICAgICAgJ0pDU1RBVElDX0JBU0UnICAgOiB1cmwsXG4gICAgICAgICAgICAgICAgJ01fSkNTVEFUSUNfQkFTRScgOiB1cmxcbiAgICAgICAgICAgIH0gKVxuXG4gICAgICAgICAgICBhd2FpdCBVdGlsLnVwZGF0ZUpTT05GaWxlKCBwYXRoICsgQ29uc3QuRklMRV9FVEMsIHtcbiAgICAgICAgICAgICAgICBvblBvcnQgOiBwb3J0XG4gICAgICAgICAgICB9IClcblxuICAgICAgICAgICAgYXdhaXQgVXRpbC51cGRhdGVKU09ORmlsZSggcGF0aCArIENvbnN0LkZJTEVfU0VSVklDRSwge1xuICAgICAgICAgICAgICAgIG9uUG9ydCA6IHBvcnQgKyAxXG4gICAgICAgICAgICB9IClcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGFkZERvbWFpbiggZG9tYWluICkge1xuICAgICAgICBsZXQgcGFyYW0gICAgICA9IHRoaXMucGFyYW0sXG4gICAgICAgICAgICBkb21haW5zT2JqID0gcGFyYW0uZG9tYWluc09iaixcbiAgICAgICAgICAgIGRvbWFpbnMgICAgPSBwYXJhbS5kb21haW5zXG5cbiAgICAgICAgbGV0IFsga2V5LCB2YWx1ZSBdID0gZG9tYWluXG5cbiAgICAgICAgaWYgKCAhKGtleSBpbiBkb21haW5zT2JqICkgKSB7XG4gICAgICAgICAgICBkb21haW5zT2JqWyBrZXkgXSA9IHZhbHVlXG4gICAgICAgICAgICBkb21haW5zLnB1c2goIHtcbiAgICAgICAgICAgICAgICBrZXksIHZhbHVlXG4gICAgICAgICAgICB9IClcbiAgICAgICAgICAgIFByb2ZpbGUuc2V0KCBET01BSU5TLCBkb21haW5zT2JqIClcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGdldFNhdmVkRG9tYWlucygpIHtcbiAgICAgICAgbGV0IHBhcmFtICAgICAgICAgID0gdGhpcy5wYXJhbSxcbiAgICAgICAgICAgIGRlZmF1bHREb21haW5zID0gcGFyYW0uZG9tYWluc09iaixcbiAgICAgICAgICAgIGRvbWFpbnNBcnIgICAgID0gcGFyYW0uZG9tYWluc1xuXG4gICAgICAgIGlmICggZG9tYWluc0FyciApIHtcbiAgICAgICAgICAgIHJldHVybiBkb21haW5zQXJyXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBkZWZhdWx0RG9tYWlucyA9IFByb2ZpbGUuZ2V0KCBET01BSU5TICkgfHwge31cbiAgICAgICAgICAgIGRvbWFpbnNBcnIgICAgID0gW11cbiAgICAgICAgfVxuXG4gICAgICAgIGZvciAoIGxldCBrZXkgaW4gZGVmYXVsdERvbWFpbnMgKSB7XG4gICAgICAgICAgICBkb21haW5zQXJyLnB1c2goIHtcbiAgICAgICAgICAgICAgICBrZXksXG4gICAgICAgICAgICAgICAgdmFsdWUgOiBkZWZhdWx0RG9tYWluc1sga2V5IF1cbiAgICAgICAgICAgIH0gKVxuICAgICAgICB9XG5cbiAgICAgICAgcGFyYW0uZG9tYWluc09iaiA9IGRlZmF1bHREb21haW5zXG4gICAgICAgIHJldHVybiBwYXJhbS5kb21haW5zID0gZG9tYWluc0FyclxuICAgIH1cblxuICAgIGdldERvbWFpbnNTaXplKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5wYXJhbS5kb21haW5zLmxlbmd0aFxuICAgIH1cblxuICAgIGNsZWFyRG9tYWlucygpIHtcbiAgICAgICAgbGV0IHBhcmFtID0gdGhpcy5wYXJhbVxuXG4gICAgICAgIFByb2ZpbGUuZGVsKCBET01BSU5TIClcbiAgICAgICAgcGFyYW0uZG9tYWluc09iaiA9IHt9XG4gICAgICAgIHBhcmFtLmRvbWFpbnMgICAgPSBbXVxuICAgIH1cblxuICAgIGlzSVBDaGFuZ2UoKSB7XG4gICAgICAgIGxldCBpcCA9IHRoaXMucGFyYW0uaXAgPSBVdGlsLmdldElQKClcbiAgICAgICAgbG9nKCBpcCwgJ2RlYnVnJyApXG4gICAgICAgIHJldHVybiBQcm9maWxlLmdldCggSVAgKSAhPSBpcFxuICAgIH1cblxuICAgIGFzeW5jIHVwZGF0ZUlQKCkge1xuICAgICAgICBsZXQgbWFjID0gYXdhaXQgVXRpbC5nZXRNYWMoKSxcbiAgICAgICAgICAgIHJlcyA9IGF3YWl0IFV0aWwudXBkYXRlTWFjKCBtYWMgKVxuXG4gICAgICAgIGlmICggcmVzICkge1xuICAgICAgICAgICAgbGV0IHBvcnQgPSBVdGlsLmdldFBvcnQoIHRoaXMuZ2V0UGF0aCgpICkgKyAxLFxuICAgICAgICAgICAgICAgIGlwICAgPSB0aGlzLnBhcmFtLmlwLFxuICAgICAgICAgICAgICAgIHVybCAgPSBgaHR0cDovLyR7aXB9OiR7cG9ydH0vYFxuXG4gICAgICAgICAgICBhd2FpdCBVdGlsLnVwZGF0ZUpTT05GaWxlKCB0aGlzLmdldFBhdGgoKSArIENvbnN0LkZJTEVfU0lURSwge1xuICAgICAgICAgICAgICAgICdKQ1NUQVRJQ19CQVNFJyAgIDogdXJsLFxuICAgICAgICAgICAgICAgICdNX0pDU1RBVElDX0JBU0UnIDogdXJsXG4gICAgICAgICAgICB9IClcblxuICAgICAgICAgICAgUHJvZmlsZS5zZXQoIElQLCB0aGlzLnBhcmFtLmlwIClcbiAgICAgICAgICAgIHJldHVybiB0cnVlXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBhc3luYyB1cGRhdGVQcm94eSgpIHtcbiAgICAgICAgbGV0IGRvbWFpbnMgICA9IHRoaXMuZ2V0U2F2ZWREb21haW5zKCksXG4gICAgICAgICAgICBob3N0cyAgICAgPSB7fSxcbiAgICAgICAgICAgIGhvc3RQYXJhbSA9IFtdLFxuICAgICAgICAgICAgcG9ydFxuXG4gICAgICAgIGRvbWFpbnMuZm9yRWFjaCggZG9tYWluID0+IHtcbiAgICAgICAgICAgIGhvc3RQYXJhbS5wdXNoKCAnaG9zdD0nICsgZG9tYWluLmtleSApXG4gICAgICAgICAgICBob3N0c1sgZG9tYWluLmtleSArIENvbnN0LlNJVEVfU1VGRklYIF0gPSBkb21haW4udmFsdWVcbiAgICAgICAgfSApXG5cbiAgICAgICAgYXdhaXQgdGhpcy5nZW5lcmF0ZVBvcnQoKVxuXG4gICAgICAgIHBvcnQgPSB0aGlzLmdldFBvcnQoKSB8fCBVdGlsLmdldFBvcnQoIHRoaXMuZ2V0UGF0aCgpIClcblxuICAgICAgICBhd2FpdCBVdGlsLnVwZGF0ZUpTT05GaWxlKCB0aGlzLmdldFBhdGgoKSArIENvbnN0LkZJTEVfVkhPU1QsIGhvc3RzIClcbiAgICAgICAgYXdhaXQgVXRpbC51cGRhdGVQcm94eSggcG9ydCwgaG9zdFBhcmFtLmpvaW4oICcmJyApIClcbiAgICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gQ29uZmlnXG4iXX0=