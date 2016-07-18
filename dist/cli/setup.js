'use strict';

var _bluebird = require('bluebird');

let Inquirer = require('inquirer'),
    Path = require('path'),
    Promise = require('bluebird'),
    Rimraf = require('rimraf'),
    FS = Promise.promisifyAll(require('fs')),
    Setup = require('../core/setup'),
    ConfigCLI = require('./config'),
    Key = require('../key');

const USERNAME = Key.username,
      PASSWORD = Key.password,
      YES = '是',
      NO = '否';

let notNull = content => !!content || '内容不能为空！';

class SetupCLI {
    constructor(dir, url) {
        let tmp;

        if (dir || url) {
            if (dir.indexOf('http') !== -1) {
                tmp = url;
                url = dir;
                dir = tmp;
            }
        }

        this._dir = dir;
        this._url = url;

        this.init();
    }

    init() {
        var _this = this;

        Inquirer.prompt([{
            name: 'dir',
            message: '设置目录',
            default: this._dir || 'master'
        }], (() => {
            var ref = (0, _bluebird.coroutine)(function* (answer) {
                let path = Path.resolve(answer.dir),
                    isExist = false;

                try {
                    //https://github.com/petkaantonov/bluebird/blob/master/API.md#promisification
                    isExist = yield FS.statAsync(path);
                } catch (e) {}

                _this._path = path;

                log(`目录地址:${ path }`, 'debug');

                if (isExist) {
                    _this.cleanup();
                } else {
                    _this._setup = new Setup();
                    yield _this._setup.init(path);
                    _this.checkout();
                }
            });
            return function (_x) {
                return ref.apply(this, arguments);
            };
        })());
    }

    checkout() {
        var _this2 = this;

        Inquirer.prompt([{
            name: USERNAME,
            message: 'SVN 用户名',
            default: Profile.get(USERNAME) || '',
            validate: notNull
        }, {
            type: PASSWORD,
            name: PASSWORD,
            message: 'SVN 密码',
            validate: notNull
        }], (() => {
            var ref = (0, _bluebird.coroutine)(function* (answer) {
                let username = answer[USERNAME],
                    password = answer[PASSWORD];

                Profile.set(USERNAME, username);
                yield _this2._setup.checkoutSource(username, password, _this2._url);
                new ConfigCLI(_this2._path);
            });
            return function (_x2) {
                return ref.apply(this, arguments);
            };
        })());
    }

    cleanup() {
        var _this3 = this;

        Inquirer.prompt([{
            type: 'list',
            name: 'override',
            message: '文件夹已存在，是否覆盖',
            choices: [YES, NO],
            default: NO
        }], answer => {
            let path = this._path;

            if (answer.override === YES) {
                Rimraf(path, (() => {
                    var ref = (0, _bluebird.coroutine)(function* (err) {
                        if (!err) {
                            _this3._setup = new Setup();
                            yield _this3._setup.init(path);
                            _this3.checkout();
                        }
                    });
                    return function (_x3) {
                        return ref.apply(this, arguments);
                    };
                })());
            } else {
                new ConfigCLI(path);
            }
        });
    }
}

module.exports = SetupCLI;