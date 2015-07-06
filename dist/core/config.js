'use strict';

var _bluebird = require('bluebird');

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var Key = require('../key'),
    Util = require('../util'),
    Const = require('../const'),
    Profile = global.Profile;

var DOMAINS = Key.domains,
    RANDOM = Key.random,
    URL_SERVER = Const.URL_SERVER,
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
        value: _bluebird.coroutine(function* () {
            var ip = Profile.get(IP),
                path = this.getPath(),
                port = undefined,
                url = undefined;

            if (this.getPortOption() == RANDOM) {
                port = Math.random() * 1000 | 0 + 6000;
                this.setPort(port);

                url = 'http://' + ip + ':' + (port + 1) + '/';

                yield Util.updateJSONFile(path + Const.FILE_SITE, {
                    'JCSTATIC_BASE': url,
                    'M_JCSTATIC_BASE': url
                });

                yield Util.updateJSONFile(path + Const.FILE_ETC, {
                    onPort: port
                });

                yield Util.updateJSONFile(path + Const.FILE_SERVICE, {
                    onPort: port + 1
                });
            }
        })
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
                domains.push(key);
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
        value: _bluebird.coroutine(function* () {
            var ip = this.param.ip = yield Util.getIP();
            return Profile.get(IP) != ip;
        })
    }, {
        key: 'updateIP',
        value: _bluebird.coroutine(function* () {
            var mac = yield Util.getMac(),
                res = yield Util.updateMac(mac);

            if (res) {
                var port = Util.getPort() + 1,
                    ip = Profile.get(IP),
                    url = 'http://' + ip + ':' + port + '/';

                yield Util.updateJSONFile(this.getPath() + Const.FILE_SITE, {
                    'JCSTATIC_BASE': url,
                    'M_JCSTATIC_BASE': url
                });

                Profile.set(IP, this.param.ip);
                return true;
            }
        })
    }, {
        key: 'updateProxy',
        value: _bluebird.coroutine(function* () {
            var domains = this.getSavedDomains(),
                hosts = {},
                hostParam = [],
                port = undefined;

            domains.forEach(function (domain) {
                hostParam.push('host=' + domain.key);
                hosts[domain.key + Const.SITE_SUFFIX] = domain.value;
            });

            yield this.generatePort();

            port = this.getPort() || Util.getPort();

            yield Util.updateJSONFile(this.getPath() + Const.FILE_VHOST, hosts);
            yield Util.updateProxy(port, hostParam.join('&'));
        })
    }]);

    return Config;
})();

module.exports = Config;
//# sourceMappingURL=data:application/json;base64,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S0FBSyxDQUFBO2FBQ3pELENBQUUsQ0FBQTs7QUFFSCxrQkFBTSxJQUFJLENBQUMsWUFBWSxFQUFFLENBQUE7O0FBRXpCLGdCQUFJLEdBQUcsSUFBSSxDQUFDLE9BQU8sRUFBRSxJQUFJLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQTs7QUFFdkMsa0JBQU0sSUFBSSxDQUFDLGNBQWMsQ0FBRSxJQUFJLENBQUMsT0FBTyxFQUFFLEdBQUcsS0FBSyxDQUFDLFVBQVUsRUFBRSxLQUFLLENBQUUsQ0FBQTtBQUNyRSxrQkFBTSxJQUFJLENBQUMsV0FBVyxDQUFFLElBQUksRUFBRSxTQUFTLENBQUMsSUFBSSxDQUFFLEdBQUcsQ0FBRSxDQUFFLENBQUE7U0FDeEQ7OztXQTdJQyxNQUFNOzs7QUFnSlosTUFBTSxDQUFDLE9BQU8sR0FBRyxNQUFNLENBQUEiLCJmaWxlIjoiY29yZS9jb25maWcuanMiLCJzb3VyY2VzQ29udGVudCI6WyJsZXQgS2V5ICAgICA9IHJlcXVpcmUoICcuLi9rZXknICksXG4gICAgVXRpbCAgICA9IHJlcXVpcmUoICcuLi91dGlsJyApLFxuICAgIENvbnN0ICAgPSByZXF1aXJlKCAnLi4vY29uc3QnICksXG4gICAgUHJvZmlsZSA9IGdsb2JhbC5Qcm9maWxlXG5cbmNvbnN0IERPTUFJTlMgICAgPSBLZXkuZG9tYWlucyxcbiAgICAgIFJBTkRPTSAgICAgPSBLZXkucmFuZG9tLFxuICAgICAgVVJMX1NFUlZFUiA9IENvbnN0LlVSTF9TRVJWRVIsXG4gICAgICBJUCAgICAgICAgID0gS2V5LmlwXG5cbmNsYXNzIENvbmZpZyB7XG4gICAgY29uc3RydWN0b3IoIHBhdGggKSB7XG4gICAgICAgIHRoaXMucGFyYW0gPSB7IHBhdGggfVxuICAgIH1cblxuICAgIGdldFBhdGgoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnBhcmFtLnBhdGhcbiAgICB9XG5cbiAgICBnZXRQb3J0T3B0aW9uKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5wYXJhbS5wb3J0T3B0aW9uXG4gICAgfVxuXG4gICAgc2V0UG9ydCggcG9ydCApIHtcbiAgICAgICAgdGhpcy5wYXJhbS5wb3J0ID0gcG9ydFxuICAgIH1cblxuICAgIGdldFBvcnQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnBhcmFtLnBvcnRcbiAgICB9XG5cbiAgICBzZXRQb3J0T3B0aW9uKCBwb3J0ICkge1xuICAgICAgICB0aGlzLnBhcmFtLnBvcnRPcHRpb24gPSBwb3J0XG4gICAgfVxuXG4gICAgYXN5bmMgZ2VuZXJhdGVQb3J0KCkge1xuICAgICAgICBsZXQgaXAgICA9IFByb2ZpbGUuZ2V0KCBJUCApLFxuICAgICAgICAgICAgcGF0aCA9IHRoaXMuZ2V0UGF0aCgpLFxuICAgICAgICAgICAgcG9ydCwgdXJsXG5cbiAgICAgICAgaWYgKCB0aGlzLmdldFBvcnRPcHRpb24oKSA9PSBSQU5ET00gKSB7XG4gICAgICAgICAgICBwb3J0ID0gTWF0aC5yYW5kb20oKSAqIDEwMDAgfCAwICsgNjAwMFxuICAgICAgICAgICAgdGhpcy5zZXRQb3J0KCBwb3J0IClcblxuICAgICAgICAgICAgdXJsID0gYGh0dHA6Ly8ke2lwfToke3BvcnQgKyAxfS9gXG5cbiAgICAgICAgICAgIGF3YWl0IFV0aWwudXBkYXRlSlNPTkZpbGUoIHBhdGggKyBDb25zdC5GSUxFX1NJVEUsIHtcbiAgICAgICAgICAgICAgICAnSkNTVEFUSUNfQkFTRSc6IHVybCxcbiAgICAgICAgICAgICAgICAnTV9KQ1NUQVRJQ19CQVNFJzogdXJsXG4gICAgICAgICAgICB9IClcblxuICAgICAgICAgICAgYXdhaXQgVXRpbC51cGRhdGVKU09ORmlsZSggcGF0aCArIENvbnN0LkZJTEVfRVRDLCB7XG4gICAgICAgICAgICAgICAgb25Qb3J0OiBwb3J0XG4gICAgICAgICAgICB9IClcblxuICAgICAgICAgICAgYXdhaXQgVXRpbC51cGRhdGVKU09ORmlsZSggcGF0aCArIENvbnN0LkZJTEVfU0VSVklDRSwge1xuICAgICAgICAgICAgICAgIG9uUG9ydDogcG9ydCArIDFcbiAgICAgICAgICAgIH0gKVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgYWRkRG9tYWluKCBkb21haW4gKSB7XG4gICAgICAgIGxldCBwYXJhbSAgICAgID0gdGhpcy5wYXJhbSxcbiAgICAgICAgICAgIGRvbWFpbnNPYmogPSBwYXJhbS5kb21haW5zT2JqLFxuICAgICAgICAgICAgZG9tYWlucyAgICA9IHBhcmFtLmRvbWFpbnNcblxuICAgICAgICBsZXQgWyBrZXksIHZhbHVlIF0gPSBkb21haW5cblxuICAgICAgICBpZiAoICEoa2V5IGluIGRvbWFpbnNPYmogKSApIHtcbiAgICAgICAgICAgIGRvbWFpbnNPYmpbIGtleSBdID0gdmFsdWVcbiAgICAgICAgICAgIGRvbWFpbnMucHVzaCgga2V5IClcbiAgICAgICAgICAgIFByb2ZpbGUuc2V0KCBET01BSU5TLCBkb21haW5zT2JqIClcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGdldFNhdmVkRG9tYWlucygpIHtcbiAgICAgICAgbGV0IHBhcmFtICAgICAgICAgID0gdGhpcy5wYXJhbSxcbiAgICAgICAgICAgIGRlZmF1bHREb21haW5zID0gcGFyYW0uZG9tYWluc09iaixcbiAgICAgICAgICAgIGRvbWFpbnNBcnIgICAgID0gcGFyYW0uZG9tYWluc1xuXG4gICAgICAgIGlmICggZG9tYWluc0FyciApIHtcbiAgICAgICAgICAgIHJldHVybiBkb21haW5zQXJyXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBkZWZhdWx0RG9tYWlucyA9IFByb2ZpbGUuZ2V0KCBET01BSU5TICkgfHwge31cbiAgICAgICAgICAgIGRvbWFpbnNBcnIgICAgID0gW11cbiAgICAgICAgfVxuXG4gICAgICAgIGZvciAoIGxldCBrZXkgaW4gZGVmYXVsdERvbWFpbnMgKSB7XG4gICAgICAgICAgICBkb21haW5zQXJyLnB1c2goIHtcbiAgICAgICAgICAgICAgICBrZXksXG4gICAgICAgICAgICAgICAgdmFsdWU6IGRlZmF1bHREb21haW5zWyBrZXkgXVxuICAgICAgICAgICAgfSApXG4gICAgICAgIH1cblxuICAgICAgICBwYXJhbS5kb21haW5zT2JqID0gZGVmYXVsdERvbWFpbnNcbiAgICAgICAgcmV0dXJuIHBhcmFtLmRvbWFpbnMgPSBkb21haW5zQXJyXG4gICAgfVxuXG4gICAgZ2V0RG9tYWluc1NpemUoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnBhcmFtLmRvbWFpbnMubGVuZ3RoXG4gICAgfVxuXG4gICAgY2xlYXJEb21haW5zKCkge1xuICAgICAgICBsZXQgcGFyYW0gICAgICAgID0gdGhpcy5wYXJhbVxuXG4gICAgICAgIFByb2ZpbGUuZGVsKCBET01BSU5TIClcbiAgICAgICAgcGFyYW0uZG9tYWluc09iaiA9IHt9XG4gICAgICAgIHBhcmFtLmRvbWFpbnMgICAgPSBbXVxuICAgIH1cblxuICAgIGFzeW5jIGlzSVBDaGFuZ2UoKSB7XG4gICAgICAgIGxldCBpcCA9IHRoaXMucGFyYW0uaXAgPSBhd2FpdCBVdGlsLmdldElQKClcbiAgICAgICAgcmV0dXJuIFByb2ZpbGUuZ2V0KCBJUCApICE9IGlwXG4gICAgfVxuXG4gICAgYXN5bmMgdXBkYXRlSVAoKSB7XG4gICAgICAgIGxldCBtYWMgPSBhd2FpdCBVdGlsLmdldE1hYygpLFxuICAgICAgICAgICAgcmVzID0gYXdhaXQgVXRpbC51cGRhdGVNYWMoIG1hYyApXG5cbiAgICAgICAgaWYgKCByZXMgKSB7XG4gICAgICAgICAgICBsZXQgcG9ydCA9IFV0aWwuZ2V0UG9ydCgpICsgMSxcbiAgICAgICAgICAgICAgICBpcCAgID0gUHJvZmlsZS5nZXQoIElQICksXG4gICAgICAgICAgICAgICAgdXJsICA9IGBodHRwOi8vJHtpcH06JHtwb3J0fS9gXG5cbiAgICAgICAgICAgIGF3YWl0IFV0aWwudXBkYXRlSlNPTkZpbGUoIHRoaXMuZ2V0UGF0aCgpICsgQ29uc3QuRklMRV9TSVRFLCB7XG4gICAgICAgICAgICAgICAgJ0pDU1RBVElDX0JBU0UnOiB1cmwsXG4gICAgICAgICAgICAgICAgJ01fSkNTVEFUSUNfQkFTRSc6IHVybFxuICAgICAgICAgICAgfSApXG5cbiAgICAgICAgICAgIFByb2ZpbGUuc2V0KCBJUCwgdGhpcy5wYXJhbS5pcCApXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgYXN5bmMgdXBkYXRlUHJveHkoKSB7XG4gICAgICAgIGxldCBkb21haW5zICAgPSB0aGlzLmdldFNhdmVkRG9tYWlucygpLFxuICAgICAgICAgICAgaG9zdHMgICAgID0ge30sXG4gICAgICAgICAgICBob3N0UGFyYW0gPSBbXSxcbiAgICAgICAgICAgIHBvcnRcblxuICAgICAgICBkb21haW5zLmZvckVhY2goIGRvbWFpbiA9PiB7XG4gICAgICAgICAgICBob3N0UGFyYW0ucHVzaCggJ2hvc3Q9JyArIGRvbWFpbi5rZXkgKVxuICAgICAgICAgICAgaG9zdHNbIGRvbWFpbi5rZXkgKyBDb25zdC5TSVRFX1NVRkZJWCBdID0gZG9tYWluLnZhbHVlXG4gICAgICAgIH0gKVxuXG4gICAgICAgIGF3YWl0IHRoaXMuZ2VuZXJhdGVQb3J0KClcblxuICAgICAgICBwb3J0ID0gdGhpcy5nZXRQb3J0KCkgfHwgVXRpbC5nZXRQb3J0KClcblxuICAgICAgICBhd2FpdCBVdGlsLnVwZGF0ZUpTT05GaWxlKCB0aGlzLmdldFBhdGgoKSArIENvbnN0LkZJTEVfVkhPU1QsIGhvc3RzIClcbiAgICAgICAgYXdhaXQgVXRpbC51cGRhdGVQcm94eSggcG9ydCwgaG9zdFBhcmFtLmpvaW4oICcmJyApIClcbiAgICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gQ29uZmlnXG4iXX0=