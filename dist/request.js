'use strict';

var HTTP = require('http'),
    Const = require('./const'),
    timeoutLimit = 5000,
    host = Const.URL_SERVER,
    Request = void 0;

Request = function Request(path) {
    return new Promise(function (resolve, reject) {
        path = path.replace(/\s+/g, '');

        if (path.indexOf('/') != 0) {
            path = '/' + path;
        }

        var result = '',
            option = {
            host, path
        },
            timeoutID = void 0,
            req = void 0;

        req = HTTP.request(option, function (res) {
            clearTimeout(timeoutID);
            res.setEncoding('utf8');

            res.on('data', function (data) {
                result += data;
            });

            res.on('end', function () {
                try {
                    result = JSON.parse(result);
                } catch (e) {
                    result = {
                        code: -1,
                        msg: `服务器端返回的不是有效的 JSON 格式:
                            ${result}`
                    };
                } finally {
                    resolve(result);
                }
            });
        });

        log(`http://${host}${path}`, 'debug');

        req.setTimeout(timeoutLimit, function () {
            reject({
                code: -1,
                msg: '网络请求超时.'
            });
        });

        req.on('error', function (err) {
            reject({
                code: -1,
                msg: `网络请求失败, 失败原因:\n${err.code}`
            });
        });

        req.end();
    }).catch(function (e) {
        log(e.msg, 'error');
    });
};

module.exports = Request;