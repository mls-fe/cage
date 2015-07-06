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
                var port = Util.getPort(this.getPath()) + 1,
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

            port = this.getPort() || Util.getPort(this.getPath());

            yield Util.updateJSONFile(this.getPath() + Const.FILE_VHOST, hosts);
            yield Util.updateProxy(port, hostParam.join('&'));
        })
    }]);

    return Config;
})();

module.exports = Config;
//# sourceMappingURL=data:application/json;base64,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V0FBVyxDQUFFLEdBQUcsTUFBTSxDQUFDLEtBQUssQ0FBQTthQUN6RCxDQUFFLENBQUE7O0FBRUgsa0JBQU0sSUFBSSxDQUFDLFlBQVksRUFBRSxDQUFBOztBQUV6QixnQkFBSSxHQUFHLElBQUksQ0FBQyxPQUFPLEVBQUUsSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFFLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBRSxDQUFBOztBQUV2RCxrQkFBTSxJQUFJLENBQUMsY0FBYyxDQUFFLElBQUksQ0FBQyxPQUFPLEVBQUUsR0FBRyxLQUFLLENBQUMsVUFBVSxFQUFFLEtBQUssQ0FBRSxDQUFBO0FBQ3JFLGtCQUFNLElBQUksQ0FBQyxXQUFXLENBQUUsSUFBSSxFQUFFLFNBQVMsQ0FBQyxJQUFJLENBQUUsR0FBRyxDQUFFLENBQUUsQ0FBQTtTQUN4RDs7O1dBN0lDLE1BQU07OztBQWdKWixNQUFNLENBQUMsT0FBTyxHQUFHLE1BQU0sQ0FBQSIsImZpbGUiOiJjb3JlL2NvbmZpZy5qcyIsInNvdXJjZXNDb250ZW50IjpbImxldCBLZXkgICAgID0gcmVxdWlyZSggJy4uL2tleScgKSxcbiAgICBVdGlsICAgID0gcmVxdWlyZSggJy4uL3V0aWwnICksXG4gICAgQ29uc3QgICA9IHJlcXVpcmUoICcuLi9jb25zdCcgKSxcbiAgICBQcm9maWxlID0gZ2xvYmFsLlByb2ZpbGVcblxuY29uc3QgRE9NQUlOUyAgICA9IEtleS5kb21haW5zLFxuICAgICAgUkFORE9NICAgICA9IEtleS5yYW5kb20sXG4gICAgICBVUkxfU0VSVkVSID0gQ29uc3QuVVJMX1NFUlZFUixcbiAgICAgIElQICAgICAgICAgPSBLZXkuaXBcblxuY2xhc3MgQ29uZmlnIHtcbiAgICBjb25zdHJ1Y3RvciggcGF0aCApIHtcbiAgICAgICAgdGhpcy5wYXJhbSA9IHsgcGF0aCB9XG4gICAgfVxuXG4gICAgZ2V0UGF0aCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucGFyYW0ucGF0aFxuICAgIH1cblxuICAgIGdldFBvcnRPcHRpb24oKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnBhcmFtLnBvcnRPcHRpb25cbiAgICB9XG5cbiAgICBzZXRQb3J0KCBwb3J0ICkge1xuICAgICAgICB0aGlzLnBhcmFtLnBvcnQgPSBwb3J0XG4gICAgfVxuXG4gICAgZ2V0UG9ydCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucGFyYW0ucG9ydFxuICAgIH1cblxuICAgIHNldFBvcnRPcHRpb24oIHBvcnQgKSB7XG4gICAgICAgIHRoaXMucGFyYW0ucG9ydE9wdGlvbiA9IHBvcnRcbiAgICB9XG5cbiAgICBhc3luYyBnZW5lcmF0ZVBvcnQoKSB7XG4gICAgICAgIGxldCBpcCAgID0gUHJvZmlsZS5nZXQoIElQICksXG4gICAgICAgICAgICBwYXRoID0gdGhpcy5nZXRQYXRoKCksXG4gICAgICAgICAgICBwb3J0LCB1cmxcblxuICAgICAgICBpZiAoIHRoaXMuZ2V0UG9ydE9wdGlvbigpID09IFJBTkRPTSApIHtcbiAgICAgICAgICAgIHBvcnQgPSBNYXRoLnJhbmRvbSgpICogMTAwMCB8IDAgKyA2MDAwXG4gICAgICAgICAgICB0aGlzLnNldFBvcnQoIHBvcnQgKVxuXG4gICAgICAgICAgICB1cmwgPSBgaHR0cDovLyR7aXB9OiR7cG9ydCArIDF9L2BcblxuICAgICAgICAgICAgYXdhaXQgVXRpbC51cGRhdGVKU09ORmlsZSggcGF0aCArIENvbnN0LkZJTEVfU0lURSwge1xuICAgICAgICAgICAgICAgICdKQ1NUQVRJQ19CQVNFJzogdXJsLFxuICAgICAgICAgICAgICAgICdNX0pDU1RBVElDX0JBU0UnOiB1cmxcbiAgICAgICAgICAgIH0gKVxuXG4gICAgICAgICAgICBhd2FpdCBVdGlsLnVwZGF0ZUpTT05GaWxlKCBwYXRoICsgQ29uc3QuRklMRV9FVEMsIHtcbiAgICAgICAgICAgICAgICBvblBvcnQ6IHBvcnRcbiAgICAgICAgICAgIH0gKVxuXG4gICAgICAgICAgICBhd2FpdCBVdGlsLnVwZGF0ZUpTT05GaWxlKCBwYXRoICsgQ29uc3QuRklMRV9TRVJWSUNFLCB7XG4gICAgICAgICAgICAgICAgb25Qb3J0OiBwb3J0ICsgMVxuICAgICAgICAgICAgfSApXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBhZGREb21haW4oIGRvbWFpbiApIHtcbiAgICAgICAgbGV0IHBhcmFtICAgICAgPSB0aGlzLnBhcmFtLFxuICAgICAgICAgICAgZG9tYWluc09iaiA9IHBhcmFtLmRvbWFpbnNPYmosXG4gICAgICAgICAgICBkb21haW5zICAgID0gcGFyYW0uZG9tYWluc1xuXG4gICAgICAgIGxldCBbIGtleSwgdmFsdWUgXSA9IGRvbWFpblxuXG4gICAgICAgIGlmICggIShrZXkgaW4gZG9tYWluc09iaiApICkge1xuICAgICAgICAgICAgZG9tYWluc09ialsga2V5IF0gPSB2YWx1ZVxuICAgICAgICAgICAgZG9tYWlucy5wdXNoKCBrZXkgKVxuICAgICAgICAgICAgUHJvZmlsZS5zZXQoIERPTUFJTlMsIGRvbWFpbnNPYmogKVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgZ2V0U2F2ZWREb21haW5zKCkge1xuICAgICAgICBsZXQgcGFyYW0gICAgICAgICAgPSB0aGlzLnBhcmFtLFxuICAgICAgICAgICAgZGVmYXVsdERvbWFpbnMgPSBwYXJhbS5kb21haW5zT2JqLFxuICAgICAgICAgICAgZG9tYWluc0FyciAgICAgPSBwYXJhbS5kb21haW5zXG5cbiAgICAgICAgaWYgKCBkb21haW5zQXJyICkge1xuICAgICAgICAgICAgcmV0dXJuIGRvbWFpbnNBcnJcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGRlZmF1bHREb21haW5zID0gUHJvZmlsZS5nZXQoIERPTUFJTlMgKSB8fCB7fVxuICAgICAgICAgICAgZG9tYWluc0FyciAgICAgPSBbXVxuICAgICAgICB9XG5cbiAgICAgICAgZm9yICggbGV0IGtleSBpbiBkZWZhdWx0RG9tYWlucyApIHtcbiAgICAgICAgICAgIGRvbWFpbnNBcnIucHVzaCgge1xuICAgICAgICAgICAgICAgIGtleSxcbiAgICAgICAgICAgICAgICB2YWx1ZTogZGVmYXVsdERvbWFpbnNbIGtleSBdXG4gICAgICAgICAgICB9IClcbiAgICAgICAgfVxuXG4gICAgICAgIHBhcmFtLmRvbWFpbnNPYmogPSBkZWZhdWx0RG9tYWluc1xuICAgICAgICByZXR1cm4gcGFyYW0uZG9tYWlucyA9IGRvbWFpbnNBcnJcbiAgICB9XG5cbiAgICBnZXREb21haW5zU2l6ZSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucGFyYW0uZG9tYWlucy5sZW5ndGhcbiAgICB9XG5cbiAgICBjbGVhckRvbWFpbnMoKSB7XG4gICAgICAgIGxldCBwYXJhbSAgICAgICAgPSB0aGlzLnBhcmFtXG5cbiAgICAgICAgUHJvZmlsZS5kZWwoIERPTUFJTlMgKVxuICAgICAgICBwYXJhbS5kb21haW5zT2JqID0ge31cbiAgICAgICAgcGFyYW0uZG9tYWlucyAgICA9IFtdXG4gICAgfVxuXG4gICAgYXN5bmMgaXNJUENoYW5nZSgpIHtcbiAgICAgICAgbGV0IGlwID0gdGhpcy5wYXJhbS5pcCA9IGF3YWl0IFV0aWwuZ2V0SVAoKVxuICAgICAgICByZXR1cm4gUHJvZmlsZS5nZXQoIElQICkgIT0gaXBcbiAgICB9XG5cbiAgICBhc3luYyB1cGRhdGVJUCgpIHtcbiAgICAgICAgbGV0IG1hYyA9IGF3YWl0IFV0aWwuZ2V0TWFjKCksXG4gICAgICAgICAgICByZXMgPSBhd2FpdCBVdGlsLnVwZGF0ZU1hYyggbWFjIClcblxuICAgICAgICBpZiAoIHJlcyApIHtcbiAgICAgICAgICAgIGxldCBwb3J0ID0gVXRpbC5nZXRQb3J0KCB0aGlzLmdldFBhdGgoKSApICsgMSxcbiAgICAgICAgICAgICAgICBpcCAgID0gUHJvZmlsZS5nZXQoIElQICksXG4gICAgICAgICAgICAgICAgdXJsICA9IGBodHRwOi8vJHtpcH06JHtwb3J0fS9gXG5cbiAgICAgICAgICAgIGF3YWl0IFV0aWwudXBkYXRlSlNPTkZpbGUoIHRoaXMuZ2V0UGF0aCgpICsgQ29uc3QuRklMRV9TSVRFLCB7XG4gICAgICAgICAgICAgICAgJ0pDU1RBVElDX0JBU0UnOiB1cmwsXG4gICAgICAgICAgICAgICAgJ01fSkNTVEFUSUNfQkFTRSc6IHVybFxuICAgICAgICAgICAgfSApXG5cbiAgICAgICAgICAgIFByb2ZpbGUuc2V0KCBJUCwgdGhpcy5wYXJhbS5pcCApXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgYXN5bmMgdXBkYXRlUHJveHkoKSB7XG4gICAgICAgIGxldCBkb21haW5zICAgPSB0aGlzLmdldFNhdmVkRG9tYWlucygpLFxuICAgICAgICAgICAgaG9zdHMgICAgID0ge30sXG4gICAgICAgICAgICBob3N0UGFyYW0gPSBbXSxcbiAgICAgICAgICAgIHBvcnRcblxuICAgICAgICBkb21haW5zLmZvckVhY2goIGRvbWFpbiA9PiB7XG4gICAgICAgICAgICBob3N0UGFyYW0ucHVzaCggJ2hvc3Q9JyArIGRvbWFpbi5rZXkgKVxuICAgICAgICAgICAgaG9zdHNbIGRvbWFpbi5rZXkgKyBDb25zdC5TSVRFX1NVRkZJWCBdID0gZG9tYWluLnZhbHVlXG4gICAgICAgIH0gKVxuXG4gICAgICAgIGF3YWl0IHRoaXMuZ2VuZXJhdGVQb3J0KClcblxuICAgICAgICBwb3J0ID0gdGhpcy5nZXRQb3J0KCkgfHwgVXRpbC5nZXRQb3J0KCB0aGlzLmdldFBhdGgoKSApXG5cbiAgICAgICAgYXdhaXQgVXRpbC51cGRhdGVKU09ORmlsZSggdGhpcy5nZXRQYXRoKCkgKyBDb25zdC5GSUxFX1ZIT1NULCBob3N0cyApXG4gICAgICAgIGF3YWl0IFV0aWwudXBkYXRlUHJveHkoIHBvcnQsIGhvc3RQYXJhbS5qb2luKCAnJicgKSApXG4gICAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IENvbmZpZ1xuIl19