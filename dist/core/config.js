'use strict';

var _bluebird = require('bluebird');

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

let Key = require('../key'),
    Util = require('../util'),
    Const = require('../const'),
    WorkSpace = require('./workspace'),
    Profile = global.Profile;

const DOMAINS = Key.domains,
      RANDOM = Key.random,
      IP = Key.ip;

class Config {
    constructor(path) {
        WorkSpace.isNew(path).then(isNew => {
            this.isNew = isNew;
            isNew && Const.changeToNewPath(path);
        });
        this.param = { path };
    }

    getPath() {
        return this.param.path;
    }

    getPortOption() {
        return this.param.portOption;
    }

    setPort(port) {
        this.param.port = port;
    }

    getPort() {
        return this.param.port;
    }

    setPortOption(port) {
        this.param.portOption = port;
    }

    generatePort() {
        var _this = this;

        return (0, _bluebird.coroutine)(function* () {
            let ip = Profile.get(IP),
                path = _this.getPath(),
                isNew = _this.isNew,
                port,
                url;

            if (_this.getPortOption() == RANDOM) {
                port = Math.random() * 1000 | 0 + 6000;
                _this.setPort(port);

                url = `http://${ ip }:${ port + 1 }/`;

                yield Util.updateJSONFile(path + Const.FILE_SITE, {
                    'JCSTATIC_BASE': isNew ? url + 'pc/' : url,
                    'M_JCSTATIC_BASE': isNew ? url + 'wap/' : url
                });

                yield Util.updateJSONFile(path + Const.FILE_ETC, {
                    onPort: port
                });

                yield Util.updateJSONFile(path + Const.FILE_SERVICE, {
                    onPort: port + 1
                });
            }
        })();
    }

    addDomain(domains) {
        let param = this.param,
            domainsObj = param.domainsObj,
            ds = param.domains;

        domains.forEach(domain => {
            var _domain = _slicedToArray(domain, 2);

            let key = _domain[0];
            let value = _domain[1];


            domainsObj[key] = value;

            ds.push({
                key, value
            });
        });

        Profile.set(DOMAINS, domainsObj);
    }

    getSavedDomains() {
        let param = this.param,
            defaultDomains = param.domainsObj,
            domainsArr = param.domains;

        if (domainsArr) {
            return domainsArr;
        } else {
            defaultDomains = Profile.get(DOMAINS) || {};
            domainsArr = [];
        }

        for (let key in defaultDomains) {
            domainsArr.push({
                key,
                value: defaultDomains[key]
            });
        }

        param.domainsObj = defaultDomains;
        return param.domains = domainsArr;
    }

    getDomainsSize() {
        return this.param.domains.length;
    }

    clearDomains() {
        let param = this.param;

        Profile.del(DOMAINS);
        param.domainsObj = {};
        param.domains = [];
    }

    isIPChange() {
        var _this2 = this;

        return (0, _bluebird.coroutine)(function* () {
            let ip = _this2.param.ip = yield Util.getIP();
            log(ip, 'debug');
            return Profile.get(IP) != ip;
        })();
    }

    updateIP() {
        var _this3 = this;

        return (0, _bluebird.coroutine)(function* () {
            let mac = yield Util.getMac(),
                res = yield Util.updateMac(mac),
                isNew = _this3.isNew;

            if (res) {
                let port = Util.getPort(_this3.getPath()) + 1,
                    ip = _this3.param.ip,
                    url = `http://${ ip }:${ port }/`;

                yield Util.updateJSONFile(_this3.getPath() + Const.FILE_SITE, {
                    'JCSTATIC_BASE': isNew ? url + 'pc/' : url,
                    'M_JCSTATIC_BASE': isNew ? url + 'wap/' : url
                });

                Profile.set(IP, _this3.param.ip);
                return true;
            }
        })();
    }

    updateProxy() {
        var _this4 = this;

        return (0, _bluebird.coroutine)(function* () {
            let domains = _this4.getSavedDomains(),
                hosts = {},
                hostParam = [],
                port;

            domains.forEach(function (domain) {
                hostParam.push('host=' + domain.key);
                hosts[domain.key + Const.SITE_SUFFIX] = domain.value;
            });

            yield _this4.generatePort();

            port = _this4.getPort() || Util.getPort(_this4.getPath());

            yield Util.updateJSONFile(_this4.getPath() + Const.FILE_VHOST, hosts);
            yield Util.updateProxy(port, hostParam.join('&'));
        })();
    }
}

module.exports = Config;