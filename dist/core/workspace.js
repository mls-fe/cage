'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var Promise = require('bluebird'),
    Exec = require('child_process').exec,
    Key = require('../key'),
    Const = require('../const'),
    Util = require('../util'),
    Profile = global.Profile;

var APPS = Const.APPS,
    NEST = Const.NEST;

var WorkSpace = (function () {
    function WorkSpace(path) {
        _classCallCheck(this, WorkSpace);

        this.basePath = path;
    }

    _createClass(WorkSpace, [{
        key: 'active',
        value: function active() {
            WorkSpace.setCurrentWorkSpace(this.basePath);
        }
    }, {
        key: 'start',
        value: function start() {
            var _this = this;

            return new Promise(function (resolve) {
                var path = _this.basePath,
                    command = 'cd ' + path + '/nest/cmd && ./service2.sh restart';

                log(command, 'debug');
                Exec(command, function (err) {
                    return err && log(err, 'error');
                }).on('message', function (message) {
                    return log(message, 'debug');
                }).on('exit', function () {
                    log('服务器正在运行');
                    resolve(true);
                    setTimeout(function () {
                        process.exit();
                    }, 0);
                }).on('error', function () {
                    resolve(false);
                });
            });
        }
    }, {
        key: 'stop',
        value: function stop(all) {
            var _this2 = this;

            return new Promise(function (resolve) {
                var path = _this2.basePath,
                    isAll = all == 'all' ? 'All' : '',
                    command = 'cd ' + path + '/nest/cmd && ./service2.sh stop' + isAll;

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
            });
        }
    }], [{
        key: 'isValidWorkSpace',

        // path 是否为有效的工作空间
        value: function isValidWorkSpace(path) {
            return Promise.all([Util.checkFileExist(path + APPS), Util.checkFileExist(path + NEST)]).then(function (results) {
                return Promise.resolve(results.reduce(function (prev, cur) {
                    return prev && cur;
                }));
            });
        }
    }, {
        key: 'current',

        // 获取当前工作空间
        value: function current() {
            return Profile.get(Key.current_path);
        }
    }, {
        key: 'list',

        // 获取全部工作空间
        value: function list() {
            return Profile.get(Key.workspace_list) || [];
        }
    }, {
        key: 'setCurrentWorkSpace',

        // 设置 path 为当前工作空间
        value: function setCurrentWorkSpace(path) {
            var list = Profile.get(Key.workspace_list) || [],
                existPath = undefined,
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
    }]);

    return WorkSpace;
})();

module.exports = WorkSpace;
//# sourceMappingURL=data:application/json;base64,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LGdCQUFJLENBQUMsT0FBTyxDQUFFLElBQUksQ0FBRSxDQUFBO0FBQ3BCLG1CQUFPLENBQUMsR0FBRyxDQUFFLEdBQUcsQ0FBQyxjQUFjLEVBQUUsSUFBSSxDQUFFLENBQUE7QUFDdkMsbUJBQU8sQ0FBQyxHQUFHLENBQUUsR0FBRyxDQUFDLFlBQVksRUFBRSxJQUFJLENBQUUsQ0FBQTtTQUN4Qzs7O1dBOUNDLFNBQVM7OztBQStGZixNQUFNLENBQUMsT0FBTyxHQUFHLFNBQVMsQ0FBQSIsImZpbGUiOiJjb3JlL3dvcmtzcGFjZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImxldCBQcm9taXNlID0gcmVxdWlyZSggJ2JsdWViaXJkJyApLFxuICAgIEV4ZWMgICAgPSByZXF1aXJlKCAnY2hpbGRfcHJvY2VzcycgKS5leGVjLFxuICAgIEtleSAgICAgPSByZXF1aXJlKCAnLi4va2V5JyApLFxuICAgIENvbnN0ICAgPSByZXF1aXJlKCAnLi4vY29uc3QnICksXG4gICAgVXRpbCAgICA9IHJlcXVpcmUoICcuLi91dGlsJyApLFxuICAgIFByb2ZpbGUgPSBnbG9iYWwuUHJvZmlsZVxuXG5jb25zdCBBUFBTID0gQ29uc3QuQVBQUyxcbiAgICAgIE5FU1QgPSBDb25zdC5ORVNUXG5cbmNsYXNzIFdvcmtTcGFjZSB7XG4gICAgY29uc3RydWN0b3IoIHBhdGggKSB7XG4gICAgICAgIHRoaXMuYmFzZVBhdGggPSBwYXRoXG4gICAgfVxuXG4gICAgLy8gcGF0aCDmmK/lkKbkuLrmnInmlYjnmoTlt6XkvZznqbrpl7RcbiAgICBzdGF0aWMgaXNWYWxpZFdvcmtTcGFjZSggcGF0aCApIHtcbiAgICAgICAgcmV0dXJuIFByb21pc2UuYWxsKCBbXG4gICAgICAgICAgICBVdGlsLmNoZWNrRmlsZUV4aXN0KCBwYXRoICsgQVBQUyApLFxuICAgICAgICAgICAgVXRpbC5jaGVja0ZpbGVFeGlzdCggcGF0aCArIE5FU1QgKVxuICAgICAgICBdICkudGhlbiggcmVzdWx0cyA9PiB7XG4gICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCByZXN1bHRzLnJlZHVjZSggKCBwcmV2LCBjdXIgKSA9PiBwcmV2ICYmIGN1ciApIClcbiAgICAgICAgfSApXG4gICAgfVxuXG4gICAgLy8g6I635Y+W5b2T5YmN5bel5L2c56m66Ze0XG4gICAgc3RhdGljIGN1cnJlbnQoKSB7XG4gICAgICAgIHJldHVybiBQcm9maWxlLmdldCggS2V5LmN1cnJlbnRfcGF0aCApXG4gICAgfVxuXG4gICAgLy8g6I635Y+W5YWo6YOo5bel5L2c56m66Ze0XG4gICAgc3RhdGljIGxpc3QoKSB7XG4gICAgICAgIHJldHVybiBQcm9maWxlLmdldCggS2V5LndvcmtzcGFjZV9saXN0ICkgfHwgW11cbiAgICB9XG5cbiAgICAvLyDorr7nva4gcGF0aCDkuLrlvZPliY3lt6XkvZznqbrpl7RcbiAgICBzdGF0aWMgc2V0Q3VycmVudFdvcmtTcGFjZSggcGF0aCApIHtcbiAgICAgICAgbGV0IGxpc3QgICAgICAgICA9IFByb2ZpbGUuZ2V0KCBLZXkud29ya3NwYWNlX2xpc3QgKSB8fCBbXSxcbiAgICAgICAgICAgIGV4aXN0UGF0aCxcbiAgICAgICAgICAgIGFscmVhZHlFeGlzdCA9IGxpc3Quc29tZSggKCBpdGVtLCBpICkgPT4ge1xuICAgICAgICAgICAgICAgIGlmICggaXRlbSA9PSBwYXRoICkge1xuICAgICAgICAgICAgICAgICAgICBleGlzdFBhdGggPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YWw6IGl0ZW0sXG4gICAgICAgICAgICAgICAgICAgICAgICBpbmRleDogaVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSApXG5cbiAgICAgICAgaWYgKCBhbHJlYWR5RXhpc3QgKSB7XG4gICAgICAgICAgICBsaXN0LnNwbGljZSggZXhpc3RQYXRoLmluZGV4LCAxIClcbiAgICAgICAgfVxuXG4gICAgICAgIGxpc3QudW5zaGlmdCggcGF0aCApXG4gICAgICAgIFByb2ZpbGUuc2V0KCBLZXkud29ya3NwYWNlX2xpc3QsIGxpc3QgKVxuICAgICAgICBQcm9maWxlLnNldCggS2V5LmN1cnJlbnRfcGF0aCwgcGF0aCApXG4gICAgfVxuXG4gICAgYWN0aXZlKCkge1xuICAgICAgICBXb3JrU3BhY2Uuc2V0Q3VycmVudFdvcmtTcGFjZSggdGhpcy5iYXNlUGF0aCApXG4gICAgfVxuXG4gICAgc3RhcnQoKSB7XG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSggcmVzb2x2ZSA9PiB7XG4gICAgICAgICAgICBsZXQgcGF0aCAgICA9IHRoaXMuYmFzZVBhdGgsXG4gICAgICAgICAgICAgICAgY29tbWFuZCA9IGBjZCAke3BhdGh9L25lc3QvY21kICYmIC4vc2VydmljZTIuc2ggcmVzdGFydGBcblxuICAgICAgICAgICAgbG9nKCBjb21tYW5kLCAnZGVidWcnIClcbiAgICAgICAgICAgIEV4ZWMoIGNvbW1hbmQsIGVyciA9PiBlcnIgJiYgbG9nKCBlcnIsICdlcnJvcicgKSApXG4gICAgICAgICAgICAgICAgLm9uKCAnbWVzc2FnZScsIG1lc3NhZ2UgPT4gbG9nKCBtZXNzYWdlLCAnZGVidWcnICkgKVxuICAgICAgICAgICAgICAgIC5vbiggJ2V4aXQnLCAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGxvZyggJ+acjeWKoeWZqOato+WcqOi/kOihjCcgKVxuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKCB0cnVlIClcbiAgICAgICAgICAgICAgICAgICAgc2V0VGltZW91dCggKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgcHJvY2Vzcy5leGl0KClcbiAgICAgICAgICAgICAgICAgICAgfSwgMCApXG4gICAgICAgICAgICAgICAgfSApXG4gICAgICAgICAgICAgICAgLm9uKCAnZXJyb3InLCAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUoIGZhbHNlIClcbiAgICAgICAgICAgICAgICB9IClcbiAgICAgICAgfSApXG4gICAgfVxuXG4gICAgc3RvcCggYWxsICkge1xuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoIHJlc29sdmUgPT4ge1xuICAgICAgICAgICAgbGV0IHBhdGggICAgPSB0aGlzLmJhc2VQYXRoLFxuICAgICAgICAgICAgICAgIGlzQWxsICAgPSBhbGwgPT0gJ2FsbCcgPyAnQWxsJyA6ICcnLFxuICAgICAgICAgICAgICAgIGNvbW1hbmQgPSBgY2QgJHtwYXRofS9uZXN0L2NtZCAmJiAuL3NlcnZpY2UyLnNoIHN0b3Ake2lzQWxsfWBcblxuICAgICAgICAgICAgbG9nKCBjb21tYW5kLCAnZGVidWcnIClcbiAgICAgICAgICAgIEV4ZWMoIGNvbW1hbmQsIGVyciA9PiBlcnIgJiYgbG9nKCBlcnIsICdlcnJvcicgKSApXG4gICAgICAgICAgICAgICAgLm9uKCAnZXhpdCcsICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgbG9nKCAn5pyN5Yqh5Zmo5bey5YGc5q2iJyApXG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUoIHRydWUgKVxuICAgICAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KCAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBwcm9jZXNzLmV4aXQoKVxuICAgICAgICAgICAgICAgICAgICB9LCAwIClcbiAgICAgICAgICAgICAgICB9IClcbiAgICAgICAgICAgICAgICAub24oICdlcnJvcicsICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZSggZmFsc2UgKVxuICAgICAgICAgICAgICAgIH0gKVxuICAgICAgICB9IClcbiAgICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gV29ya1NwYWNlXG4iXX0=