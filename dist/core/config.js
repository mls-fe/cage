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
//# sourceMappingURL=data:application/json;base64,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cUJBQUssQ0FBRSxNQUFNLENBQUMsR0FBRyxHQUFHLEtBQUssQ0FBQyxXQUFXLENBQUUsR0FBRyxNQUFNLENBQUMsS0FBSyxDQUFBO2FBQ3pELENBQUUsQ0FBQTs7QUFFSCxrQkFBTSxJQUFJLENBQUMsWUFBWSxFQUFFLENBQUE7O0FBRXpCLGdCQUFJLEdBQUcsSUFBSSxDQUFDLE9BQU8sRUFBRSxJQUFJLElBQUksQ0FBQyxPQUFPLENBQUUsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFFLENBQUE7O0FBRXZELGtCQUFNLElBQUksQ0FBQyxjQUFjLENBQUUsSUFBSSxDQUFDLE9BQU8sRUFBRSxHQUFHLEtBQUssQ0FBQyxVQUFVLEVBQUUsS0FBSyxDQUFFLENBQUE7QUFDckUsa0JBQU0sSUFBSSxDQUFDLFdBQVcsQ0FBRSxJQUFJLEVBQUUsU0FBUyxDQUFDLElBQUksQ0FBRSxHQUFHLENBQUUsQ0FBRSxDQUFBO1NBQ3hEOzs7V0EvSUMsTUFBTTs7O0FBa0paLE1BQU0sQ0FBQyxPQUFPLEdBQUcsTUFBTSxDQUFBIiwiZmlsZSI6ImNvcmUvY29uZmlnLmpzIiwic291cmNlc0NvbnRlbnQiOlsibGV0IEtleSAgICAgPSByZXF1aXJlKCAnLi4va2V5JyApLFxuICAgIFV0aWwgICAgPSByZXF1aXJlKCAnLi4vdXRpbCcgKSxcbiAgICBDb25zdCAgID0gcmVxdWlyZSggJy4uL2NvbnN0JyApLFxuICAgIFByb2ZpbGUgPSBnbG9iYWwuUHJvZmlsZVxuXG5jb25zdCBET01BSU5TICAgID0gS2V5LmRvbWFpbnMsXG4gICAgICBSQU5ET00gICAgID0gS2V5LnJhbmRvbSxcbiAgICAgIFVSTF9TRVJWRVIgPSBDb25zdC5VUkxfU0VSVkVSLFxuICAgICAgSVAgICAgICAgICA9IEtleS5pcFxuXG5jbGFzcyBDb25maWcge1xuICAgIGNvbnN0cnVjdG9yKCBwYXRoICkge1xuICAgICAgICB0aGlzLnBhcmFtID0geyBwYXRoIH1cbiAgICB9XG5cbiAgICBnZXRQYXRoKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5wYXJhbS5wYXRoXG4gICAgfVxuXG4gICAgZ2V0UG9ydE9wdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucGFyYW0ucG9ydE9wdGlvblxuICAgIH1cblxuICAgIHNldFBvcnQoIHBvcnQgKSB7XG4gICAgICAgIHRoaXMucGFyYW0ucG9ydCA9IHBvcnRcbiAgICB9XG5cbiAgICBnZXRQb3J0KCkge1xuICAgICAgICByZXR1cm4gdGhpcy5wYXJhbS5wb3J0XG4gICAgfVxuXG4gICAgc2V0UG9ydE9wdGlvbiggcG9ydCApIHtcbiAgICAgICAgdGhpcy5wYXJhbS5wb3J0T3B0aW9uID0gcG9ydFxuICAgIH1cblxuICAgIGFzeW5jIGdlbmVyYXRlUG9ydCgpIHtcbiAgICAgICAgbGV0IGlwICAgPSBQcm9maWxlLmdldCggSVAgKSxcbiAgICAgICAgICAgIHBhdGggPSB0aGlzLmdldFBhdGgoKSxcbiAgICAgICAgICAgIHBvcnQsIHVybFxuXG4gICAgICAgIGlmICggdGhpcy5nZXRQb3J0T3B0aW9uKCkgPT0gUkFORE9NICkge1xuICAgICAgICAgICAgcG9ydCA9IE1hdGgucmFuZG9tKCkgKiAxMDAwIHwgMCArIDYwMDBcbiAgICAgICAgICAgIHRoaXMuc2V0UG9ydCggcG9ydCApXG5cbiAgICAgICAgICAgIHVybCA9IGBodHRwOi8vJHtpcH06JHtwb3J0ICsgMX0vYFxuXG4gICAgICAgICAgICBhd2FpdCBVdGlsLnVwZGF0ZUpTT05GaWxlKCBwYXRoICsgQ29uc3QuRklMRV9TSVRFLCB7XG4gICAgICAgICAgICAgICAgJ0pDU1RBVElDX0JBU0UnOiB1cmwsXG4gICAgICAgICAgICAgICAgJ01fSkNTVEFUSUNfQkFTRSc6IHVybFxuICAgICAgICAgICAgfSApXG5cbiAgICAgICAgICAgIGF3YWl0IFV0aWwudXBkYXRlSlNPTkZpbGUoIHBhdGggKyBDb25zdC5GSUxFX0VUQywge1xuICAgICAgICAgICAgICAgIG9uUG9ydDogcG9ydFxuICAgICAgICAgICAgfSApXG5cbiAgICAgICAgICAgIGF3YWl0IFV0aWwudXBkYXRlSlNPTkZpbGUoIHBhdGggKyBDb25zdC5GSUxFX1NFUlZJQ0UsIHtcbiAgICAgICAgICAgICAgICBvblBvcnQ6IHBvcnQgKyAxXG4gICAgICAgICAgICB9IClcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGFkZERvbWFpbiggZG9tYWluICkge1xuICAgICAgICBsZXQgcGFyYW0gICAgICA9IHRoaXMucGFyYW0sXG4gICAgICAgICAgICBkb21haW5zT2JqID0gcGFyYW0uZG9tYWluc09iaixcbiAgICAgICAgICAgIGRvbWFpbnMgICAgPSBwYXJhbS5kb21haW5zXG5cbiAgICAgICAgbGV0IFsga2V5LCB2YWx1ZSBdID0gZG9tYWluXG5cbiAgICAgICAgaWYgKCAhKGtleSBpbiBkb21haW5zT2JqICkgKSB7XG4gICAgICAgICAgICBkb21haW5zT2JqWyBrZXkgXSA9IHZhbHVlXG4gICAgICAgICAgICBkb21haW5zLnB1c2goIHtcbiAgICAgICAgICAgICAgICBrZXksIHZhbHVlXG4gICAgICAgICAgICB9IClcbiAgICAgICAgICAgIFByb2ZpbGUuc2V0KCBET01BSU5TLCBkb21haW5zT2JqIClcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGdldFNhdmVkRG9tYWlucygpIHtcbiAgICAgICAgbGV0IHBhcmFtICAgICAgICAgID0gdGhpcy5wYXJhbSxcbiAgICAgICAgICAgIGRlZmF1bHREb21haW5zID0gcGFyYW0uZG9tYWluc09iaixcbiAgICAgICAgICAgIGRvbWFpbnNBcnIgICAgID0gcGFyYW0uZG9tYWluc1xuXG4gICAgICAgIGlmICggZG9tYWluc0FyciApIHtcbiAgICAgICAgICAgIHJldHVybiBkb21haW5zQXJyXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBkZWZhdWx0RG9tYWlucyA9IFByb2ZpbGUuZ2V0KCBET01BSU5TICkgfHwge31cbiAgICAgICAgICAgIGRvbWFpbnNBcnIgICAgID0gW11cbiAgICAgICAgfVxuXG4gICAgICAgIGZvciAoIGxldCBrZXkgaW4gZGVmYXVsdERvbWFpbnMgKSB7XG4gICAgICAgICAgICBkb21haW5zQXJyLnB1c2goIHtcbiAgICAgICAgICAgICAgICBrZXksXG4gICAgICAgICAgICAgICAgdmFsdWU6IGRlZmF1bHREb21haW5zWyBrZXkgXVxuICAgICAgICAgICAgfSApXG4gICAgICAgIH1cblxuICAgICAgICBwYXJhbS5kb21haW5zT2JqID0gZGVmYXVsdERvbWFpbnNcbiAgICAgICAgcmV0dXJuIHBhcmFtLmRvbWFpbnMgPSBkb21haW5zQXJyXG4gICAgfVxuXG4gICAgZ2V0RG9tYWluc1NpemUoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnBhcmFtLmRvbWFpbnMubGVuZ3RoXG4gICAgfVxuXG4gICAgY2xlYXJEb21haW5zKCkge1xuICAgICAgICBsZXQgcGFyYW0gICAgICAgID0gdGhpcy5wYXJhbVxuXG4gICAgICAgIFByb2ZpbGUuZGVsKCBET01BSU5TIClcbiAgICAgICAgcGFyYW0uZG9tYWluc09iaiA9IHt9XG4gICAgICAgIHBhcmFtLmRvbWFpbnMgICAgPSBbXVxuICAgIH1cblxuICAgIGFzeW5jIGlzSVBDaGFuZ2UoKSB7XG4gICAgICAgIGxldCBpcCA9IHRoaXMucGFyYW0uaXAgPSBhd2FpdCBVdGlsLmdldElQKClcbiAgICAgICAgcmV0dXJuIFByb2ZpbGUuZ2V0KCBJUCApICE9IGlwXG4gICAgfVxuXG4gICAgYXN5bmMgdXBkYXRlSVAoKSB7XG4gICAgICAgIGxldCBtYWMgPSBhd2FpdCBVdGlsLmdldE1hYygpLFxuICAgICAgICAgICAgcmVzID0gYXdhaXQgVXRpbC51cGRhdGVNYWMoIG1hYyApXG5cbiAgICAgICAgaWYgKCByZXMgKSB7XG4gICAgICAgICAgICBsZXQgcG9ydCA9IFV0aWwuZ2V0UG9ydCggdGhpcy5nZXRQYXRoKCkgKSArIDEsXG4gICAgICAgICAgICAgICAgaXAgICA9IFByb2ZpbGUuZ2V0KCBJUCApLFxuICAgICAgICAgICAgICAgIHVybCAgPSBgaHR0cDovLyR7aXB9OiR7cG9ydH0vYFxuXG4gICAgICAgICAgICBhd2FpdCBVdGlsLnVwZGF0ZUpTT05GaWxlKCB0aGlzLmdldFBhdGgoKSArIENvbnN0LkZJTEVfU0lURSwge1xuICAgICAgICAgICAgICAgICdKQ1NUQVRJQ19CQVNFJzogdXJsLFxuICAgICAgICAgICAgICAgICdNX0pDU1RBVElDX0JBU0UnOiB1cmxcbiAgICAgICAgICAgIH0gKVxuXG4gICAgICAgICAgICBQcm9maWxlLnNldCggSVAsIHRoaXMucGFyYW0uaXAgKVxuICAgICAgICAgICAgcmV0dXJuIHRydWVcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGFzeW5jIHVwZGF0ZVByb3h5KCkge1xuICAgICAgICBsZXQgZG9tYWlucyAgID0gdGhpcy5nZXRTYXZlZERvbWFpbnMoKSxcbiAgICAgICAgICAgIGhvc3RzICAgICA9IHt9LFxuICAgICAgICAgICAgaG9zdFBhcmFtID0gW10sXG4gICAgICAgICAgICBwb3J0XG5cbiAgICAgICAgZG9tYWlucy5mb3JFYWNoKCBkb21haW4gPT4ge1xuICAgICAgICAgICAgaG9zdFBhcmFtLnB1c2goICdob3N0PScgKyBkb21haW4ua2V5IClcbiAgICAgICAgICAgIGhvc3RzWyBkb21haW4ua2V5ICsgQ29uc3QuU0lURV9TVUZGSVggXSA9IGRvbWFpbi52YWx1ZVxuICAgICAgICB9IClcblxuICAgICAgICBhd2FpdCB0aGlzLmdlbmVyYXRlUG9ydCgpXG5cbiAgICAgICAgcG9ydCA9IHRoaXMuZ2V0UG9ydCgpIHx8IFV0aWwuZ2V0UG9ydCggdGhpcy5nZXRQYXRoKCkgKVxuXG4gICAgICAgIGF3YWl0IFV0aWwudXBkYXRlSlNPTkZpbGUoIHRoaXMuZ2V0UGF0aCgpICsgQ29uc3QuRklMRV9WSE9TVCwgaG9zdHMgKVxuICAgICAgICBhd2FpdCBVdGlsLnVwZGF0ZVByb3h5KCBwb3J0LCBob3N0UGFyYW0uam9pbiggJyYnICkgKVxuICAgIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBDb25maWdcbiJdfQ==