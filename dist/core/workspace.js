'use strict';

var _bluebird = require('bluebird');

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Exec = require('child_process').exec,
    Key = require('../key'),
    Const = require('../const'),
    Util = require('../util'),
    Profile = global.Profile;

var HORNBILL = Const.HORNBILL;

var WorkSpace = function () {
    function WorkSpace(path) {
        _classCallCheck(this, WorkSpace);

        this.basePath = path;
    }

    // path 是否为有效的工作空间


    _createClass(WorkSpace, [{
        key: 'getCommandPath',
        value: function () {
            var _ref = (0, _bluebird.coroutine)(regeneratorRuntime.mark(function _callee(path) {
                return regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                return _context.abrupt('return', `${path}${HORNBILL}/cmd/`);

                            case 1:
                            case 'end':
                                return _context.stop();
                        }
                    }
                }, _callee, this);
            }));

            function getCommandPath(_x) {
                return _ref.apply(this, arguments);
            }

            return getCommandPath;
        }()
    }, {
        key: 'active',
        value: function active() {
            WorkSpace.setCurrentWorkSpace(this.basePath);
        }
    }, {
        key: 'start',
        value: function start() {
            var _this = this;

            var autoExit = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;

            return new Promise(function () {
                var _ref2 = (0, _bluebird.coroutine)(regeneratorRuntime.mark(function _callee2(resolve) {
                    var path, command;
                    return regeneratorRuntime.wrap(function _callee2$(_context2) {
                        while (1) {
                            switch (_context2.prev = _context2.next) {
                                case 0:
                                    path = void 0, command = void 0;
                                    _context2.next = 3;
                                    return _this.getCommandPath(_this.basePath);

                                case 3:
                                    path = _context2.sent;

                                    command = `cd ${path} && ./service3.sh restart`;

                                    log(command, 'debug');
                                    Exec(command, function (err) {
                                        return err && log(err, 'error');
                                    }).on('message', function (message) {
                                        return log(message, 'debug');
                                    }).on('exit', function () {
                                        log('服务器正在运行');
                                        resolve(true);
                                        process.nextTick(function () {
                                            autoExit && process.exit();
                                        });
                                    }).on('error', function () {
                                        resolve(false);
                                    });

                                case 7:
                                case 'end':
                                    return _context2.stop();
                            }
                        }
                    }, _callee2, _this);
                }));

                return function (_x3) {
                    return _ref2.apply(this, arguments);
                };
            }());
        }
    }, {
        key: 'stop',
        value: function stop(all) {
            var _this2 = this;

            return new Promise(function () {
                var _ref3 = (0, _bluebird.coroutine)(regeneratorRuntime.mark(function _callee3(resolve) {
                    var path, isAll, command;
                    return regeneratorRuntime.wrap(function _callee3$(_context3) {
                        while (1) {
                            switch (_context3.prev = _context3.next) {
                                case 0:
                                    path = void 0, isAll = void 0, command = void 0;


                                    isAll = all == 'all' ? 'All' : '';
                                    _context3.next = 4;
                                    return _this2.getCommandPath(_this2.basePath);

                                case 4:
                                    path = _context3.sent;

                                    command = `cd ${path} && ./service3.sh stop${isAll}`;

                                    log(command, 'debug');
                                    Exec(command, function (err) {
                                        return err && log(err, 'error');
                                    }).on('exit', function () {
                                        log('服务器已停止');
                                        resolve(true);
                                        setTimeout(function () {
                                            process.exit();
                                        }, 0);
                                    }).on('error', function () {
                                        resolve(false);
                                    });

                                case 8:
                                case 'end':
                                    return _context3.stop();
                            }
                        }
                    }, _callee3, _this2);
                }));

                return function (_x4) {
                    return _ref3.apply(this, arguments);
                };
            }());
        }
    }], [{
        key: 'isValidWorkSpace',
        value: function isValidWorkSpace(path) {
            return Promise.resolve(Util.checkFileExist(path + HORNBILL));
        }

        // 获取当前工作空间

    }, {
        key: 'current',
        value: function current() {
            return Profile.get(Key.current_path);
        }

        // 获取全部工作空间

    }, {
        key: 'list',
        value: function list() {
            return Profile.get(Key.workspace_list) || [];
        }

        // 设置 path 为当前工作空间

    }, {
        key: 'setCurrentWorkSpace',
        value: function setCurrentWorkSpace(path) {
            var list = Profile.get(Key.workspace_list) || [],
                existPath = void 0,
                alreadyExist = list.some(function (item, i) {
                if (item == path) {
                    existPath = {
                        val: item,
                        index: i
                    };
                    return true;
                }
            });

            if (alreadyExist) {
                list.splice(existPath.index, 1);
            }

            list.unshift(path);
            Profile.set(Key.workspace_list, list);
            Profile.set(Key.current_path, path);
        }
    }, {
        key: 'isNew',
        value: function isNew(path) {
            return Util.checkFileExist(path + HORNBILL);
        }
    }]);

    return WorkSpace;
}();

module.exports = WorkSpace;