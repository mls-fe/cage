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
                return results.reduce(function (prev, cur) {
                    return prev && cur;
                });
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
//# sourceMappingURL=data:application/json;base64,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SSxDQUFFLENBQUE7QUFDcEIsbUJBQU8sQ0FBQyxHQUFHLENBQUUsR0FBRyxDQUFDLGNBQWMsRUFBRSxJQUFJLENBQUUsQ0FBQTtBQUN2QyxtQkFBTyxDQUFDLEdBQUcsQ0FBRSxHQUFHLENBQUMsWUFBWSxFQUFFLElBQUksQ0FBRSxDQUFBO1NBQ3hDOzs7V0E5Q0MsU0FBUzs7O0FBK0ZmLE1BQU0sQ0FBQyxPQUFPLEdBQUcsU0FBUyxDQUFBIiwiZmlsZSI6ImNvcmUvd29ya3NwYWNlLmpzIiwic291cmNlc0NvbnRlbnQiOlsibGV0IFByb21pc2UgPSByZXF1aXJlKCAnYmx1ZWJpcmQnICksXG4gICAgRXhlYyAgICA9IHJlcXVpcmUoICdjaGlsZF9wcm9jZXNzJyApLmV4ZWMsXG4gICAgS2V5ICAgICA9IHJlcXVpcmUoICcuLi9rZXknICksXG4gICAgQ29uc3QgICA9IHJlcXVpcmUoICcuLi9jb25zdCcgKSxcbiAgICBVdGlsICAgID0gcmVxdWlyZSggJy4uL3V0aWwnICksXG4gICAgUHJvZmlsZSA9IGdsb2JhbC5Qcm9maWxlXG5cbmNvbnN0IEFQUFMgPSBDb25zdC5BUFBTLFxuICAgICAgTkVTVCA9IENvbnN0Lk5FU1RcblxuY2xhc3MgV29ya1NwYWNlIHtcbiAgICBjb25zdHJ1Y3RvciggcGF0aCApIHtcbiAgICAgICAgdGhpcy5iYXNlUGF0aCA9IHBhdGhcbiAgICB9XG5cbiAgICAvLyBwYXRoIOaYr+WQpuS4uuacieaViOeahOW3peS9nOepuumXtFxuICAgIHN0YXRpYyBpc1ZhbGlkV29ya1NwYWNlKCBwYXRoICkge1xuICAgICAgICByZXR1cm4gUHJvbWlzZS5hbGwoIFtcbiAgICAgICAgICAgIFV0aWwuY2hlY2tGaWxlRXhpc3QoIHBhdGggKyBBUFBTICksXG4gICAgICAgICAgICBVdGlsLmNoZWNrRmlsZUV4aXN0KCBwYXRoICsgTkVTVCApXG4gICAgICAgIF0gKS50aGVuKCByZXN1bHRzID0+IHtcbiAgICAgICAgICAgIHJldHVybiByZXN1bHRzLnJlZHVjZSggKCBwcmV2LCBjdXIgKSA9PiBwcmV2ICYmIGN1ciApXG4gICAgICAgIH0gKVxuICAgIH1cblxuICAgIC8vIOiOt+WPluW9k+WJjeW3peS9nOepuumXtFxuICAgIHN0YXRpYyBjdXJyZW50KCkge1xuICAgICAgICByZXR1cm4gUHJvZmlsZS5nZXQoIEtleS5jdXJyZW50X3BhdGggKVxuICAgIH1cblxuICAgIC8vIOiOt+WPluWFqOmDqOW3peS9nOepuumXtFxuICAgIHN0YXRpYyBsaXN0KCkge1xuICAgICAgICByZXR1cm4gUHJvZmlsZS5nZXQoIEtleS53b3Jrc3BhY2VfbGlzdCApIHx8IFtdXG4gICAgfVxuXG4gICAgLy8g6K6+572uIHBhdGgg5Li65b2T5YmN5bel5L2c56m66Ze0XG4gICAgc3RhdGljIHNldEN1cnJlbnRXb3JrU3BhY2UoIHBhdGggKSB7XG4gICAgICAgIGxldCBsaXN0ICAgICAgICAgPSBQcm9maWxlLmdldCggS2V5LndvcmtzcGFjZV9saXN0ICkgfHwgW10sXG4gICAgICAgICAgICBleGlzdFBhdGgsXG4gICAgICAgICAgICBhbHJlYWR5RXhpc3QgPSBsaXN0LnNvbWUoICggaXRlbSwgaSApID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoIGl0ZW0gPT0gcGF0aCApIHtcbiAgICAgICAgICAgICAgICAgICAgZXhpc3RQYXRoID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFsOiBpdGVtLFxuICAgICAgICAgICAgICAgICAgICAgICAgaW5kZXg6IGlcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gKVxuXG4gICAgICAgIGlmICggYWxyZWFkeUV4aXN0ICkge1xuICAgICAgICAgICAgbGlzdC5zcGxpY2UoIGV4aXN0UGF0aC5pbmRleCwgMSApXG4gICAgICAgIH1cblxuICAgICAgICBsaXN0LnVuc2hpZnQoIHBhdGggKVxuICAgICAgICBQcm9maWxlLnNldCggS2V5LndvcmtzcGFjZV9saXN0LCBsaXN0IClcbiAgICAgICAgUHJvZmlsZS5zZXQoIEtleS5jdXJyZW50X3BhdGgsIHBhdGggKVxuICAgIH1cblxuICAgIGFjdGl2ZSgpIHtcbiAgICAgICAgV29ya1NwYWNlLnNldEN1cnJlbnRXb3JrU3BhY2UoIHRoaXMuYmFzZVBhdGggKVxuICAgIH1cblxuICAgIHN0YXJ0KCkge1xuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoIHJlc29sdmUgPT4ge1xuICAgICAgICAgICAgbGV0IHBhdGggICAgPSB0aGlzLmJhc2VQYXRoLFxuICAgICAgICAgICAgICAgIGNvbW1hbmQgPSBgY2QgJHtwYXRofS9uZXN0L2NtZCAmJiAuL3NlcnZpY2UyLnNoIHJlc3RhcnRgXG5cbiAgICAgICAgICAgIGxvZyggY29tbWFuZCwgJ2RlYnVnJyApXG4gICAgICAgICAgICBFeGVjKCBjb21tYW5kLCBlcnIgPT4gZXJyICYmIGxvZyggZXJyLCAnZXJyb3InICkgKVxuICAgICAgICAgICAgICAgIC5vbiggJ21lc3NhZ2UnLCBtZXNzYWdlID0+IGxvZyggbWVzc2FnZSwgJ2RlYnVnJyApIClcbiAgICAgICAgICAgICAgICAub24oICdleGl0JywgKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBsb2coICfmnI3liqHlmajmraPlnKjov5DooYwnIClcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZSggdHJ1ZSApXG4gICAgICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHByb2Nlc3MuZXhpdCgpXG4gICAgICAgICAgICAgICAgICAgIH0sIDAgKVxuICAgICAgICAgICAgICAgIH0gKVxuICAgICAgICAgICAgICAgIC5vbiggJ2Vycm9yJywgKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKCBmYWxzZSApXG4gICAgICAgICAgICAgICAgfSApXG4gICAgICAgIH0gKVxuICAgIH1cblxuICAgIHN0b3AoIGFsbCApIHtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKCByZXNvbHZlID0+IHtcbiAgICAgICAgICAgIGxldCBwYXRoICAgID0gdGhpcy5iYXNlUGF0aCxcbiAgICAgICAgICAgICAgICBpc0FsbCAgID0gYWxsID09ICdhbGwnID8gJ0FsbCcgOiAnJyxcbiAgICAgICAgICAgICAgICBjb21tYW5kID0gYGNkICR7cGF0aH0vbmVzdC9jbWQgJiYgLi9zZXJ2aWNlMi5zaCBzdG9wJHtpc0FsbH1gXG5cbiAgICAgICAgICAgIGxvZyggY29tbWFuZCwgJ2RlYnVnJyApXG4gICAgICAgICAgICBFeGVjKCBjb21tYW5kLCBlcnIgPT4gZXJyICYmIGxvZyggZXJyLCAnZXJyb3InICkgKVxuICAgICAgICAgICAgICAgIC5vbiggJ2V4aXQnLCAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGxvZyggJ+acjeWKoeWZqOW3suWBnOatoicgKVxuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKCB0cnVlIClcbiAgICAgICAgICAgICAgICAgICAgc2V0VGltZW91dCggKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgcHJvY2Vzcy5leGl0KClcbiAgICAgICAgICAgICAgICAgICAgfSwgMCApXG4gICAgICAgICAgICAgICAgfSApXG4gICAgICAgICAgICAgICAgLm9uKCAnZXJyb3InLCAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUoIGZhbHNlIClcbiAgICAgICAgICAgICAgICB9IClcbiAgICAgICAgfSApXG4gICAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFdvcmtTcGFjZVxuIl19