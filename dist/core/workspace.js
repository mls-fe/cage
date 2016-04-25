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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb3JlL3dvcmtzcGFjZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSxJQUFJLE9BQVUsUUFBUyxlQUFULEVBQTJCLElBQXpDO0lBQ0ksTUFBVSxRQUFTLFFBQVQsQ0FEZDtJQUVJLFFBQVUsUUFBUyxVQUFULENBRmQ7SUFHSSxPQUFVLFFBQVMsU0FBVCxDQUhkO0lBSUksVUFBVSxPQUFPLE9BSnJCOztBQU1BLElBQU0sT0FBTyxNQUFNLElBQW5CO0lBQ00sT0FBTyxNQUFNLElBRG5COztJQUdNLFM7QUFDRix1QkFBYSxJQUFiLEVBQW9CO0FBQUE7O0FBQ2hCLGFBQUssUUFBTCxHQUFnQixJQUFoQjtBQUNIOzs7Ozs7O2lDQTZDUTtBQUNMLHNCQUFVLG1CQUFWLENBQStCLEtBQUssUUFBcEM7QUFDSDs7O2dDQUVPO0FBQUE7O0FBQ0osbUJBQU8sSUFBSSxPQUFKLENBQWEsbUJBQVc7QUFDM0Isb0JBQUksT0FBVSxNQUFLLFFBQW5CO29CQUNJLGtCQUFnQixJQUFoQix1Q0FESjs7QUFHQSxvQkFBSyxPQUFMLEVBQWMsT0FBZDtBQUNBLHFCQUFNLE9BQU4sRUFBZTtBQUFBLDJCQUFPLE9BQU8sSUFBSyxHQUFMLEVBQVUsT0FBVixDQUFkO0FBQUEsaUJBQWYsRUFDSyxFQURMLENBQ1MsU0FEVCxFQUNvQjtBQUFBLDJCQUFXLElBQUssT0FBTCxFQUFjLE9BQWQsQ0FBWDtBQUFBLGlCQURwQixFQUVLLEVBRkwsQ0FFUyxNQUZULEVBRWlCLFlBQU07QUFDZix3QkFBSyxTQUFMO0FBQ0EsNEJBQVMsSUFBVDtBQUNBLCtCQUFZLFlBQU07QUFDZCxnQ0FBUSxJQUFSO0FBQ0gscUJBRkQsRUFFRyxDQUZIO0FBR0gsaUJBUkwsRUFTSyxFQVRMLENBU1MsT0FUVCxFQVNrQixZQUFNO0FBQ2hCLDRCQUFTLEtBQVQ7QUFDSCxpQkFYTDtBQVlILGFBakJNLENBQVA7QUFrQkg7Ozs2QkFFSyxHLEVBQU07QUFBQTs7QUFDUixtQkFBTyxJQUFJLE9BQUosQ0FBYSxtQkFBVztBQUMzQixvQkFBSSxPQUFVLE9BQUssUUFBbkI7b0JBQ0ksUUFBVSxPQUFPLEtBQVAsR0FBZSxLQUFmLEdBQXVCLEVBRHJDO29CQUVJLGtCQUFnQixJQUFoQix1Q0FBc0QsS0FGMUQ7O0FBSUEsb0JBQUssT0FBTCxFQUFjLE9BQWQ7QUFDQSxxQkFBTSxPQUFOLEVBQWU7QUFBQSwyQkFBTyxPQUFPLElBQUssR0FBTCxFQUFVLE9BQVYsQ0FBZDtBQUFBLGlCQUFmLEVBQ0ssRUFETCxDQUNTLE1BRFQsRUFDaUIsWUFBTTtBQUNmLHdCQUFLLFFBQUw7QUFDQSw0QkFBUyxJQUFUO0FBQ0EsK0JBQVksWUFBTTtBQUNkLGdDQUFRLElBQVI7QUFDSCxxQkFGRCxFQUVHLENBRkg7QUFHSCxpQkFQTCxFQVFLLEVBUkwsQ0FRUyxPQVJULEVBUWtCLFlBQU07QUFDaEIsNEJBQVMsS0FBVDtBQUNILGlCQVZMO0FBV0gsYUFqQk0sQ0FBUDtBQWtCSDs7O3lDQXRGd0IsSSxFQUFPO0FBQzVCLG1CQUFPLFFBQVEsR0FBUixDQUFhLENBQ2hCLEtBQUssY0FBTCxDQUFxQixPQUFPLElBQTVCLENBRGdCLEVBRWhCLEtBQUssY0FBTCxDQUFxQixPQUFPLElBQTVCLENBRmdCLENBQWIsRUFHSCxJQUhHLENBR0csbUJBQVc7QUFDakIsdUJBQU8sUUFBUSxPQUFSLENBQWlCLFFBQVEsTUFBUixDQUFnQixVQUFFLElBQUYsRUFBUSxHQUFSO0FBQUEsMkJBQWlCLFFBQVEsR0FBekI7QUFBQSxpQkFBaEIsQ0FBakIsQ0FBUDtBQUNILGFBTE0sQ0FBUDtBQU1IOzs7Ozs7a0NBR2dCO0FBQ2IsbUJBQU8sUUFBUSxHQUFSLENBQWEsSUFBSSxZQUFqQixDQUFQO0FBQ0g7Ozs7OzsrQkFHYTtBQUNWLG1CQUFPLFFBQVEsR0FBUixDQUFhLElBQUksY0FBakIsS0FBcUMsRUFBNUM7QUFDSDs7Ozs7OzRDQUcyQixJLEVBQU87QUFDL0IsZ0JBQUksT0FBZSxRQUFRLEdBQVIsQ0FBYSxJQUFJLGNBQWpCLEtBQXFDLEVBQXhEO2dCQUNJLGtCQURKO2dCQUVJLGVBQWUsS0FBSyxJQUFMLENBQVcsVUFBRSxJQUFGLEVBQVEsQ0FBUixFQUFlO0FBQ3JDLG9CQUFLLFFBQVEsSUFBYixFQUFvQjtBQUNoQixnQ0FBWTtBQUNSLDZCQUFRLElBREE7QUFFUiwrQkFBUTtBQUZBLHFCQUFaO0FBSUEsMkJBQU8sSUFBUDtBQUNIO0FBQ0osYUFSYyxDQUZuQjs7QUFZQSxnQkFBSyxZQUFMLEVBQW9CO0FBQ2hCLHFCQUFLLE1BQUwsQ0FBYSxVQUFVLEtBQXZCLEVBQThCLENBQTlCO0FBQ0g7O0FBRUQsaUJBQUssT0FBTCxDQUFjLElBQWQ7QUFDQSxvQkFBUSxHQUFSLENBQWEsSUFBSSxjQUFqQixFQUFpQyxJQUFqQztBQUNBLG9CQUFRLEdBQVIsQ0FBYSxJQUFJLFlBQWpCLEVBQStCLElBQS9CO0FBQ0g7Ozs7OztBQWlETCxPQUFPLE9BQVAsR0FBaUIsU0FBakIiLCJmaWxlIjoid29ya3NwYWNlLmpzIiwic291cmNlc0NvbnRlbnQiOlsibGV0IEV4ZWMgICAgPSByZXF1aXJlKCAnY2hpbGRfcHJvY2VzcycgKS5leGVjLFxuICAgIEtleSAgICAgPSByZXF1aXJlKCAnLi4va2V5JyApLFxuICAgIENvbnN0ICAgPSByZXF1aXJlKCAnLi4vY29uc3QnICksXG4gICAgVXRpbCAgICA9IHJlcXVpcmUoICcuLi91dGlsJyApLFxuICAgIFByb2ZpbGUgPSBnbG9iYWwuUHJvZmlsZVxuXG5jb25zdCBBUFBTID0gQ29uc3QuQVBQUyxcbiAgICAgIE5FU1QgPSBDb25zdC5ORVNUXG5cbmNsYXNzIFdvcmtTcGFjZSB7XG4gICAgY29uc3RydWN0b3IoIHBhdGggKSB7XG4gICAgICAgIHRoaXMuYmFzZVBhdGggPSBwYXRoXG4gICAgfVxuXG4gICAgLy8gcGF0aCDmmK/lkKbkuLrmnInmlYjnmoTlt6XkvZznqbrpl7RcbiAgICBzdGF0aWMgaXNWYWxpZFdvcmtTcGFjZSggcGF0aCApIHtcbiAgICAgICAgcmV0dXJuIFByb21pc2UuYWxsKCBbXG4gICAgICAgICAgICBVdGlsLmNoZWNrRmlsZUV4aXN0KCBwYXRoICsgQVBQUyApLFxuICAgICAgICAgICAgVXRpbC5jaGVja0ZpbGVFeGlzdCggcGF0aCArIE5FU1QgKVxuICAgICAgICBdICkudGhlbiggcmVzdWx0cyA9PiB7XG4gICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCByZXN1bHRzLnJlZHVjZSggKCBwcmV2LCBjdXIgKSA9PiBwcmV2ICYmIGN1ciApIClcbiAgICAgICAgfSApXG4gICAgfVxuXG4gICAgLy8g6I635Y+W5b2T5YmN5bel5L2c56m66Ze0XG4gICAgc3RhdGljIGN1cnJlbnQoKSB7XG4gICAgICAgIHJldHVybiBQcm9maWxlLmdldCggS2V5LmN1cnJlbnRfcGF0aCApXG4gICAgfVxuXG4gICAgLy8g6I635Y+W5YWo6YOo5bel5L2c56m66Ze0XG4gICAgc3RhdGljIGxpc3QoKSB7XG4gICAgICAgIHJldHVybiBQcm9maWxlLmdldCggS2V5LndvcmtzcGFjZV9saXN0ICkgfHwgW11cbiAgICB9XG5cbiAgICAvLyDorr7nva4gcGF0aCDkuLrlvZPliY3lt6XkvZznqbrpl7RcbiAgICBzdGF0aWMgc2V0Q3VycmVudFdvcmtTcGFjZSggcGF0aCApIHtcbiAgICAgICAgbGV0IGxpc3QgICAgICAgICA9IFByb2ZpbGUuZ2V0KCBLZXkud29ya3NwYWNlX2xpc3QgKSB8fCBbXSxcbiAgICAgICAgICAgIGV4aXN0UGF0aCxcbiAgICAgICAgICAgIGFscmVhZHlFeGlzdCA9IGxpc3Quc29tZSggKCBpdGVtLCBpICkgPT4ge1xuICAgICAgICAgICAgICAgIGlmICggaXRlbSA9PSBwYXRoICkge1xuICAgICAgICAgICAgICAgICAgICBleGlzdFBhdGggPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YWwgICA6IGl0ZW0sXG4gICAgICAgICAgICAgICAgICAgICAgICBpbmRleCA6IGlcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gKVxuXG4gICAgICAgIGlmICggYWxyZWFkeUV4aXN0ICkge1xuICAgICAgICAgICAgbGlzdC5zcGxpY2UoIGV4aXN0UGF0aC5pbmRleCwgMSApXG4gICAgICAgIH1cblxuICAgICAgICBsaXN0LnVuc2hpZnQoIHBhdGggKVxuICAgICAgICBQcm9maWxlLnNldCggS2V5LndvcmtzcGFjZV9saXN0LCBsaXN0IClcbiAgICAgICAgUHJvZmlsZS5zZXQoIEtleS5jdXJyZW50X3BhdGgsIHBhdGggKVxuICAgIH1cblxuICAgIGFjdGl2ZSgpIHtcbiAgICAgICAgV29ya1NwYWNlLnNldEN1cnJlbnRXb3JrU3BhY2UoIHRoaXMuYmFzZVBhdGggKVxuICAgIH1cblxuICAgIHN0YXJ0KCkge1xuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoIHJlc29sdmUgPT4ge1xuICAgICAgICAgICAgbGV0IHBhdGggICAgPSB0aGlzLmJhc2VQYXRoLFxuICAgICAgICAgICAgICAgIGNvbW1hbmQgPSBgY2QgJHtwYXRofS9uZXN0L2NtZCAmJiAuL3NlcnZpY2UyLnNoIHJlc3RhcnRgXG5cbiAgICAgICAgICAgIGxvZyggY29tbWFuZCwgJ2RlYnVnJyApXG4gICAgICAgICAgICBFeGVjKCBjb21tYW5kLCBlcnIgPT4gZXJyICYmIGxvZyggZXJyLCAnZXJyb3InICkgKVxuICAgICAgICAgICAgICAgIC5vbiggJ21lc3NhZ2UnLCBtZXNzYWdlID0+IGxvZyggbWVzc2FnZSwgJ2RlYnVnJyApIClcbiAgICAgICAgICAgICAgICAub24oICdleGl0JywgKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBsb2coICfmnI3liqHlmajmraPlnKjov5DooYwnIClcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZSggdHJ1ZSApXG4gICAgICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHByb2Nlc3MuZXhpdCgpXG4gICAgICAgICAgICAgICAgICAgIH0sIDAgKVxuICAgICAgICAgICAgICAgIH0gKVxuICAgICAgICAgICAgICAgIC5vbiggJ2Vycm9yJywgKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKCBmYWxzZSApXG4gICAgICAgICAgICAgICAgfSApXG4gICAgICAgIH0gKVxuICAgIH1cblxuICAgIHN0b3AoIGFsbCApIHtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKCByZXNvbHZlID0+IHtcbiAgICAgICAgICAgIGxldCBwYXRoICAgID0gdGhpcy5iYXNlUGF0aCxcbiAgICAgICAgICAgICAgICBpc0FsbCAgID0gYWxsID09ICdhbGwnID8gJ0FsbCcgOiAnJyxcbiAgICAgICAgICAgICAgICBjb21tYW5kID0gYGNkICR7cGF0aH0vbmVzdC9jbWQgJiYgLi9zZXJ2aWNlMi5zaCBzdG9wJHtpc0FsbH1gXG5cbiAgICAgICAgICAgIGxvZyggY29tbWFuZCwgJ2RlYnVnJyApXG4gICAgICAgICAgICBFeGVjKCBjb21tYW5kLCBlcnIgPT4gZXJyICYmIGxvZyggZXJyLCAnZXJyb3InICkgKVxuICAgICAgICAgICAgICAgIC5vbiggJ2V4aXQnLCAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGxvZyggJ+acjeWKoeWZqOW3suWBnOatoicgKVxuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKCB0cnVlIClcbiAgICAgICAgICAgICAgICAgICAgc2V0VGltZW91dCggKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgcHJvY2Vzcy5leGl0KClcbiAgICAgICAgICAgICAgICAgICAgfSwgMCApXG4gICAgICAgICAgICAgICAgfSApXG4gICAgICAgICAgICAgICAgLm9uKCAnZXJyb3InLCAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUoIGZhbHNlIClcbiAgICAgICAgICAgICAgICB9IClcbiAgICAgICAgfSApXG4gICAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFdvcmtTcGFjZVxuIl19