'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Exec = require('child_process').exec,
    Key = require('../key'),
    Const = require('../const'),
    Util = require('../util'),
    Profile = global.Profile;

var APPS = Const.APPS,
    NEST = Const.NEST;

var WorkSpace = function () {
    function WorkSpace(path) {
        _classCallCheck(this, WorkSpace);

        this.basePath = path;
    }

    // path 是否为有效的工作空间


    _createClass(WorkSpace, [{
        key: 'active',
        value: function active() {
            WorkSpace.setCurrentWorkSpace(this.basePath);
        }
    }, {
        key: 'start',
        value: function start() {
            var _this = this;

            var autoExit = arguments.length <= 0 || arguments[0] === undefined ? true : arguments[0];

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
                    process.nextTick(function () {
                        autoExit && process.exit();
                    });
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
        value: function isValidWorkSpace(path) {
            return Promise.all([Util.checkFileExist(path + APPS), Util.checkFileExist(path + NEST)]).then(function (results) {
                return Promise.resolve(results.reduce(function (prev, cur) {
                    return prev && cur;
                }));
            });
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
    }]);

    return WorkSpace;
}();

module.exports = WorkSpace;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb3JlL3dvcmtzcGFjZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSxJQUFJLE9BQVUsUUFBUyxlQUFULEVBQTJCLElBQXpDO0lBQ0ksTUFBVSxRQUFTLFFBQVQsQ0FEZDtJQUVJLFFBQVUsUUFBUyxVQUFULENBRmQ7SUFHSSxPQUFVLFFBQVMsU0FBVCxDQUhkO0lBSUksVUFBVSxPQUFPLE9BSnJCOztBQU1BLElBQU0sT0FBTyxNQUFNLElBQW5CO0lBQ00sT0FBTyxNQUFNLElBRG5COztJQUdNLFM7QUFDRix1QkFBYSxJQUFiLEVBQW9CO0FBQUE7O0FBQ2hCLGFBQUssUUFBTCxHQUFnQixJQUFoQjtBQUNIOzs7Ozs7O2lDQTZDUTtBQUNMLHNCQUFVLG1CQUFWLENBQStCLEtBQUssUUFBcEM7QUFDSDs7O2dDQUV3QjtBQUFBOztBQUFBLGdCQUFsQixRQUFrQix5REFBUCxJQUFPOztBQUNyQixtQkFBTyxJQUFJLE9BQUosQ0FBYSxtQkFBVztBQUMzQixvQkFBSSxPQUFVLE1BQUssUUFBbkI7b0JBQ0ksa0JBQWdCLElBQWhCLHVDQURKOztBQUdBLG9CQUFLLE9BQUwsRUFBYyxPQUFkO0FBQ0EscUJBQU0sT0FBTixFQUFlO0FBQUEsMkJBQU8sT0FBTyxJQUFLLEdBQUwsRUFBVSxPQUFWLENBQWQ7QUFBQSxpQkFBZixFQUNLLEVBREwsQ0FDUyxTQURULEVBQ29CO0FBQUEsMkJBQVcsSUFBSyxPQUFMLEVBQWMsT0FBZCxDQUFYO0FBQUEsaUJBRHBCLEVBRUssRUFGTCxDQUVTLE1BRlQsRUFFaUIsWUFBTTtBQUNmLHdCQUFLLFNBQUw7QUFDQSw0QkFBUyxJQUFUO0FBQ0EsNEJBQVEsUUFBUixDQUFrQixZQUFNO0FBQ3BCLG9DQUFZLFFBQVEsSUFBUixFQUFaO0FBQ0gscUJBRkQ7QUFHSCxpQkFSTCxFQVNLLEVBVEwsQ0FTUyxPQVRULEVBU2tCLFlBQU07QUFDaEIsNEJBQVMsS0FBVDtBQUNILGlCQVhMO0FBWUgsYUFqQk0sQ0FBUDtBQWtCSDs7OzZCQUVLLEcsRUFBTTtBQUFBOztBQUNSLG1CQUFPLElBQUksT0FBSixDQUFhLG1CQUFXO0FBQzNCLG9CQUFJLE9BQVUsT0FBSyxRQUFuQjtvQkFDSSxRQUFVLE9BQU8sS0FBUCxHQUFlLEtBQWYsR0FBdUIsRUFEckM7b0JBRUksa0JBQWdCLElBQWhCLHVDQUFzRCxLQUYxRDs7QUFJQSxvQkFBSyxPQUFMLEVBQWMsT0FBZDtBQUNBLHFCQUFNLE9BQU4sRUFBZTtBQUFBLDJCQUFPLE9BQU8sSUFBSyxHQUFMLEVBQVUsT0FBVixDQUFkO0FBQUEsaUJBQWYsRUFDSyxFQURMLENBQ1MsTUFEVCxFQUNpQixZQUFNO0FBQ2Ysd0JBQUssUUFBTDtBQUNBLDRCQUFTLElBQVQ7QUFDQSwrQkFBWSxZQUFNO0FBQ2QsZ0NBQVEsSUFBUjtBQUNILHFCQUZELEVBRUcsQ0FGSDtBQUdILGlCQVBMLEVBUUssRUFSTCxDQVFTLE9BUlQsRUFRa0IsWUFBTTtBQUNoQiw0QkFBUyxLQUFUO0FBQ0gsaUJBVkw7QUFXSCxhQWpCTSxDQUFQO0FBa0JIOzs7eUNBdEZ3QixJLEVBQU87QUFDNUIsbUJBQU8sUUFBUSxHQUFSLENBQWEsQ0FDaEIsS0FBSyxjQUFMLENBQXFCLE9BQU8sSUFBNUIsQ0FEZ0IsRUFFaEIsS0FBSyxjQUFMLENBQXFCLE9BQU8sSUFBNUIsQ0FGZ0IsQ0FBYixFQUdILElBSEcsQ0FHRyxtQkFBVztBQUNqQix1QkFBTyxRQUFRLE9BQVIsQ0FBaUIsUUFBUSxNQUFSLENBQWdCLFVBQUUsSUFBRixFQUFRLEdBQVI7QUFBQSwyQkFBaUIsUUFBUSxHQUF6QjtBQUFBLGlCQUFoQixDQUFqQixDQUFQO0FBQ0gsYUFMTSxDQUFQO0FBTUg7Ozs7OztrQ0FHZ0I7QUFDYixtQkFBTyxRQUFRLEdBQVIsQ0FBYSxJQUFJLFlBQWpCLENBQVA7QUFDSDs7Ozs7OytCQUdhO0FBQ1YsbUJBQU8sUUFBUSxHQUFSLENBQWEsSUFBSSxjQUFqQixLQUFxQyxFQUE1QztBQUNIOzs7Ozs7NENBRzJCLEksRUFBTztBQUMvQixnQkFBSSxPQUFlLFFBQVEsR0FBUixDQUFhLElBQUksY0FBakIsS0FBcUMsRUFBeEQ7Z0JBQ0ksa0JBREo7Z0JBRUksZUFBZSxLQUFLLElBQUwsQ0FBVyxVQUFFLElBQUYsRUFBUSxDQUFSLEVBQWU7QUFDckMsb0JBQUssUUFBUSxJQUFiLEVBQW9CO0FBQ2hCLGdDQUFZO0FBQ1IsNkJBQU8sSUFEQztBQUVSLCtCQUFPO0FBRkMscUJBQVo7QUFJQSwyQkFBTyxJQUFQO0FBQ0g7QUFDSixhQVJjLENBRm5COztBQVlBLGdCQUFLLFlBQUwsRUFBb0I7QUFDaEIscUJBQUssTUFBTCxDQUFhLFVBQVUsS0FBdkIsRUFBOEIsQ0FBOUI7QUFDSDs7QUFFRCxpQkFBSyxPQUFMLENBQWMsSUFBZDtBQUNBLG9CQUFRLEdBQVIsQ0FBYSxJQUFJLGNBQWpCLEVBQWlDLElBQWpDO0FBQ0Esb0JBQVEsR0FBUixDQUFhLElBQUksWUFBakIsRUFBK0IsSUFBL0I7QUFDSDs7Ozs7O0FBaURMLE9BQU8sT0FBUCxHQUFpQixTQUFqQiIsImZpbGUiOiJ3b3Jrc3BhY2UuanMiLCJzb3VyY2VzQ29udGVudCI6WyJsZXQgRXhlYyAgICA9IHJlcXVpcmUoICdjaGlsZF9wcm9jZXNzJyApLmV4ZWMsXG4gICAgS2V5ICAgICA9IHJlcXVpcmUoICcuLi9rZXknICksXG4gICAgQ29uc3QgICA9IHJlcXVpcmUoICcuLi9jb25zdCcgKSxcbiAgICBVdGlsICAgID0gcmVxdWlyZSggJy4uL3V0aWwnICksXG4gICAgUHJvZmlsZSA9IGdsb2JhbC5Qcm9maWxlXG5cbmNvbnN0IEFQUFMgPSBDb25zdC5BUFBTLFxuICAgICAgTkVTVCA9IENvbnN0Lk5FU1RcblxuY2xhc3MgV29ya1NwYWNlIHtcbiAgICBjb25zdHJ1Y3RvciggcGF0aCApIHtcbiAgICAgICAgdGhpcy5iYXNlUGF0aCA9IHBhdGhcbiAgICB9XG5cbiAgICAvLyBwYXRoIOaYr+WQpuS4uuacieaViOeahOW3peS9nOepuumXtFxuICAgIHN0YXRpYyBpc1ZhbGlkV29ya1NwYWNlKCBwYXRoICkge1xuICAgICAgICByZXR1cm4gUHJvbWlzZS5hbGwoIFtcbiAgICAgICAgICAgIFV0aWwuY2hlY2tGaWxlRXhpc3QoIHBhdGggKyBBUFBTICksXG4gICAgICAgICAgICBVdGlsLmNoZWNrRmlsZUV4aXN0KCBwYXRoICsgTkVTVCApXG4gICAgICAgIF0gKS50aGVuKCByZXN1bHRzID0+IHtcbiAgICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoIHJlc3VsdHMucmVkdWNlKCAoIHByZXYsIGN1ciApID0+IHByZXYgJiYgY3VyICkgKVxuICAgICAgICB9IClcbiAgICB9XG5cbiAgICAvLyDojrflj5blvZPliY3lt6XkvZznqbrpl7RcbiAgICBzdGF0aWMgY3VycmVudCgpIHtcbiAgICAgICAgcmV0dXJuIFByb2ZpbGUuZ2V0KCBLZXkuY3VycmVudF9wYXRoIClcbiAgICB9XG5cbiAgICAvLyDojrflj5blhajpg6jlt6XkvZznqbrpl7RcbiAgICBzdGF0aWMgbGlzdCgpIHtcbiAgICAgICAgcmV0dXJuIFByb2ZpbGUuZ2V0KCBLZXkud29ya3NwYWNlX2xpc3QgKSB8fCBbXVxuICAgIH1cblxuICAgIC8vIOiuvue9riBwYXRoIOS4uuW9k+WJjeW3peS9nOepuumXtFxuICAgIHN0YXRpYyBzZXRDdXJyZW50V29ya1NwYWNlKCBwYXRoICkge1xuICAgICAgICBsZXQgbGlzdCAgICAgICAgID0gUHJvZmlsZS5nZXQoIEtleS53b3Jrc3BhY2VfbGlzdCApIHx8IFtdLFxuICAgICAgICAgICAgZXhpc3RQYXRoLFxuICAgICAgICAgICAgYWxyZWFkeUV4aXN0ID0gbGlzdC5zb21lKCAoIGl0ZW0sIGkgKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKCBpdGVtID09IHBhdGggKSB7XG4gICAgICAgICAgICAgICAgICAgIGV4aXN0UGF0aCA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbCAgOiBpdGVtLFxuICAgICAgICAgICAgICAgICAgICAgICAgaW5kZXg6IGlcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gKVxuXG4gICAgICAgIGlmICggYWxyZWFkeUV4aXN0ICkge1xuICAgICAgICAgICAgbGlzdC5zcGxpY2UoIGV4aXN0UGF0aC5pbmRleCwgMSApXG4gICAgICAgIH1cblxuICAgICAgICBsaXN0LnVuc2hpZnQoIHBhdGggKVxuICAgICAgICBQcm9maWxlLnNldCggS2V5LndvcmtzcGFjZV9saXN0LCBsaXN0IClcbiAgICAgICAgUHJvZmlsZS5zZXQoIEtleS5jdXJyZW50X3BhdGgsIHBhdGggKVxuICAgIH1cblxuICAgIGFjdGl2ZSgpIHtcbiAgICAgICAgV29ya1NwYWNlLnNldEN1cnJlbnRXb3JrU3BhY2UoIHRoaXMuYmFzZVBhdGggKVxuICAgIH1cblxuICAgIHN0YXJ0KCBhdXRvRXhpdCA9IHRydWUgKSB7XG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSggcmVzb2x2ZSA9PiB7XG4gICAgICAgICAgICBsZXQgcGF0aCAgICA9IHRoaXMuYmFzZVBhdGgsXG4gICAgICAgICAgICAgICAgY29tbWFuZCA9IGBjZCAke3BhdGh9L25lc3QvY21kICYmIC4vc2VydmljZTIuc2ggcmVzdGFydGBcblxuICAgICAgICAgICAgbG9nKCBjb21tYW5kLCAnZGVidWcnIClcbiAgICAgICAgICAgIEV4ZWMoIGNvbW1hbmQsIGVyciA9PiBlcnIgJiYgbG9nKCBlcnIsICdlcnJvcicgKSApXG4gICAgICAgICAgICAgICAgLm9uKCAnbWVzc2FnZScsIG1lc3NhZ2UgPT4gbG9nKCBtZXNzYWdlLCAnZGVidWcnICkgKVxuICAgICAgICAgICAgICAgIC5vbiggJ2V4aXQnLCAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGxvZyggJ+acjeWKoeWZqOato+WcqOi/kOihjCcgKVxuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKCB0cnVlIClcbiAgICAgICAgICAgICAgICAgICAgcHJvY2Vzcy5uZXh0VGljayggKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgYXV0b0V4aXQgJiYgcHJvY2Vzcy5leGl0KClcbiAgICAgICAgICAgICAgICAgICAgfSApXG4gICAgICAgICAgICAgICAgfSApXG4gICAgICAgICAgICAgICAgLm9uKCAnZXJyb3InLCAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUoIGZhbHNlIClcbiAgICAgICAgICAgICAgICB9IClcbiAgICAgICAgfSApXG4gICAgfVxuXG4gICAgc3RvcCggYWxsICkge1xuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoIHJlc29sdmUgPT4ge1xuICAgICAgICAgICAgbGV0IHBhdGggICAgPSB0aGlzLmJhc2VQYXRoLFxuICAgICAgICAgICAgICAgIGlzQWxsICAgPSBhbGwgPT0gJ2FsbCcgPyAnQWxsJyA6ICcnLFxuICAgICAgICAgICAgICAgIGNvbW1hbmQgPSBgY2QgJHtwYXRofS9uZXN0L2NtZCAmJiAuL3NlcnZpY2UyLnNoIHN0b3Ake2lzQWxsfWBcblxuICAgICAgICAgICAgbG9nKCBjb21tYW5kLCAnZGVidWcnIClcbiAgICAgICAgICAgIEV4ZWMoIGNvbW1hbmQsIGVyciA9PiBlcnIgJiYgbG9nKCBlcnIsICdlcnJvcicgKSApXG4gICAgICAgICAgICAgICAgLm9uKCAnZXhpdCcsICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgbG9nKCAn5pyN5Yqh5Zmo5bey5YGc5q2iJyApXG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUoIHRydWUgKVxuICAgICAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KCAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBwcm9jZXNzLmV4aXQoKVxuICAgICAgICAgICAgICAgICAgICB9LCAwIClcbiAgICAgICAgICAgICAgICB9IClcbiAgICAgICAgICAgICAgICAub24oICdlcnJvcicsICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZSggZmFsc2UgKVxuICAgICAgICAgICAgICAgIH0gKVxuICAgICAgICB9IClcbiAgICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gV29ya1NwYWNlXG4iXX0=