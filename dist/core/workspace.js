'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvcmUvd29ya3NwYWNlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLElBQUksT0FBTyxHQUFHLE9BQU8sQ0FBRSxVQUFVLENBQUU7SUFDL0IsSUFBSSxHQUFNLE9BQU8sQ0FBRSxlQUFlLENBQUUsQ0FBQyxJQUFJO0lBQ3pDLEdBQUcsR0FBTyxPQUFPLENBQUUsUUFBUSxDQUFFO0lBQzdCLEtBQUssR0FBSyxPQUFPLENBQUUsVUFBVSxDQUFFO0lBQy9CLElBQUksR0FBTSxPQUFPLENBQUUsU0FBUyxDQUFFO0lBQzlCLE9BQU8sR0FBRyxNQUFNLENBQUMsT0FBTyxDQUFBOztBQUU1QixJQUFNLElBQUksR0FBRyxLQUFLLENBQUMsSUFBSTtJQUNqQixJQUFJLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQTs7SUFFakIsU0FBUztBQUNYLGFBREUsU0FBUyxDQUNFLElBQUksRUFBRzs4QkFEbEIsU0FBUzs7QUFFUCxZQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQTtLQUN2Qjs7O0FBQUE7aUJBSEMsU0FBUzs7aUNBZ0RGO0FBQ0wscUJBQVMsQ0FBQyxtQkFBbUIsQ0FBRSxJQUFJLENBQUMsUUFBUSxDQUFFLENBQUE7U0FDakQ7OztnQ0FFTzs7O0FBQ0osbUJBQU8sSUFBSSxPQUFPLENBQUUsVUFBQSxPQUFPLEVBQUk7QUFDM0Isb0JBQUksSUFBSSxHQUFNLE1BQUssUUFBUTtvQkFDdkIsT0FBTyxXQUFTLElBQUksdUNBQW9DLENBQUE7O0FBRTVELG1CQUFHLENBQUUsT0FBTyxFQUFFLE9BQU8sQ0FBRSxDQUFBO0FBQ3ZCLG9CQUFJLENBQUUsT0FBTyxFQUFFLFVBQUEsR0FBRzsyQkFBSSxHQUFHLElBQUksR0FBRyxDQUFFLEdBQUcsRUFBRSxPQUFPLENBQUU7aUJBQUEsQ0FBRSxDQUM3QyxFQUFFLENBQUUsU0FBUyxFQUFFLFVBQUEsT0FBTzsyQkFBSSxHQUFHLENBQUUsT0FBTyxFQUFFLE9BQU8sQ0FBRTtpQkFBQSxDQUFFLENBQ25ELEVBQUUsQ0FBRSxNQUFNLEVBQUUsWUFBTTtBQUNmLHVCQUFHLENBQUUsU0FBUyxDQUFFLENBQUE7QUFDaEIsMkJBQU8sQ0FBRSxJQUFJLENBQUUsQ0FBQTtBQUNmLDhCQUFVLENBQUUsWUFBTTtBQUNkLCtCQUFPLENBQUMsSUFBSSxFQUFFLENBQUE7cUJBQ2pCLEVBQUUsQ0FBQyxDQUFFLENBQUE7aUJBQ1QsQ0FBRSxDQUNGLEVBQUUsQ0FBRSxPQUFPLEVBQUUsWUFBTTtBQUNoQiwyQkFBTyxDQUFFLEtBQUssQ0FBRSxDQUFBO2lCQUNuQixDQUFFLENBQUE7YUFDVixDQUFFLENBQUE7U0FDTjs7OzZCQUVLLEdBQUcsRUFBRzs7O0FBQ1IsbUJBQU8sSUFBSSxPQUFPLENBQUUsVUFBQSxPQUFPLEVBQUk7QUFDM0Isb0JBQUksSUFBSSxHQUFNLE9BQUssUUFBUTtvQkFDdkIsS0FBSyxHQUFLLEdBQUcsSUFBSSxLQUFLLEdBQUcsS0FBSyxHQUFHLEVBQUU7b0JBQ25DLE9BQU8sV0FBUyxJQUFJLHVDQUFrQyxLQUFLLEFBQUUsQ0FBQTs7QUFFakUsbUJBQUcsQ0FBRSxPQUFPLEVBQUUsT0FBTyxDQUFFLENBQUE7QUFDdkIsb0JBQUksQ0FBRSxPQUFPLEVBQUUsVUFBQSxHQUFHOzJCQUFJLEdBQUcsSUFBSSxHQUFHLENBQUUsR0FBRyxFQUFFLE9BQU8sQ0FBRTtpQkFBQSxDQUFFLENBQzdDLEVBQUUsQ0FBRSxNQUFNLEVBQUUsWUFBTTtBQUNmLHVCQUFHLENBQUUsUUFBUSxDQUFFLENBQUE7QUFDZiwyQkFBTyxDQUFFLElBQUksQ0FBRSxDQUFBO0FBQ2YsOEJBQVUsQ0FBRSxZQUFNO0FBQ2QsK0JBQU8sQ0FBQyxJQUFJLEVBQUUsQ0FBQTtxQkFDakIsRUFBRSxDQUFDLENBQUUsQ0FBQTtpQkFDVCxDQUFFLENBQ0YsRUFBRSxDQUFFLE9BQU8sRUFBRSxZQUFNO0FBQ2hCLDJCQUFPLENBQUUsS0FBSyxDQUFFLENBQUE7aUJBQ25CLENBQUUsQ0FBQTthQUNWLENBQUUsQ0FBQTtTQUNOOzs7eUNBdEZ3QixJQUFJLEVBQUc7QUFDNUIsbUJBQU8sT0FBTyxDQUFDLEdBQUcsQ0FBRSxDQUNoQixJQUFJLENBQUMsY0FBYyxDQUFFLElBQUksR0FBRyxJQUFJLENBQUUsRUFDbEMsSUFBSSxDQUFDLGNBQWMsQ0FBRSxJQUFJLEdBQUcsSUFBSSxDQUFFLENBQ3JDLENBQUUsQ0FBQyxJQUFJLENBQUUsVUFBQSxPQUFPLEVBQUk7QUFDakIsdUJBQU8sT0FBTyxDQUFDLE9BQU8sQ0FBRSxPQUFPLENBQUMsTUFBTSxDQUFFLFVBQUUsSUFBSSxFQUFFLEdBQUc7MkJBQU0sSUFBSSxJQUFJLEdBQUc7aUJBQUEsQ0FBRSxDQUFFLENBQUE7YUFDM0UsQ0FBRSxDQUFBO1NBQ047Ozs7OztrQ0FHZ0I7QUFDYixtQkFBTyxPQUFPLENBQUMsR0FBRyxDQUFFLEdBQUcsQ0FBQyxZQUFZLENBQUUsQ0FBQTtTQUN6Qzs7Ozs7OytCQUdhO0FBQ1YsbUJBQU8sT0FBTyxDQUFDLEdBQUcsQ0FBRSxHQUFHLENBQUMsY0FBYyxDQUFFLElBQUksRUFBRSxDQUFBO1NBQ2pEOzs7Ozs7NENBRzJCLElBQUksRUFBRztBQUMvQixnQkFBSSxJQUFJLEdBQVcsT0FBTyxDQUFDLEdBQUcsQ0FBRSxHQUFHLENBQUMsY0FBYyxDQUFFLElBQUksRUFBRTtnQkFDdEQsU0FBUyxZQUFBO2dCQUNULFlBQVksR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFFLFVBQUUsSUFBSSxFQUFFLENBQUMsRUFBTTtBQUNyQyxvQkFBSyxJQUFJLElBQUksSUFBSSxFQUFHO0FBQ2hCLDZCQUFTLEdBQUc7QUFDUiwyQkFBRyxFQUFFLElBQUk7QUFDVCw2QkFBSyxFQUFFLENBQUM7cUJBQ1gsQ0FBQTtBQUNELDJCQUFPLElBQUksQ0FBQTtpQkFDZDthQUNKLENBQUUsQ0FBQTs7QUFFUCxnQkFBSyxZQUFZLEVBQUc7QUFDaEIsb0JBQUksQ0FBQyxNQUFNLENBQUUsU0FBUyxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUUsQ0FBQTthQUNwQzs7QUFFRCxnQkFBSSxDQUFDLE9BQU8sQ0FBRSxJQUFJLENBQUUsQ0FBQTtBQUNwQixtQkFBTyxDQUFDLEdBQUcsQ0FBRSxHQUFHLENBQUMsY0FBYyxFQUFFLElBQUksQ0FBRSxDQUFBO0FBQ3ZDLG1CQUFPLENBQUMsR0FBRyxDQUFFLEdBQUcsQ0FBQyxZQUFZLEVBQUUsSUFBSSxDQUFFLENBQUE7U0FDeEM7OztXQTlDQyxTQUFTOzs7QUErRmYsTUFBTSxDQUFDLE9BQU8sR0FBRyxTQUFTLENBQUEiLCJmaWxlIjoiY29yZS93b3Jrc3BhY2UuanMiLCJzb3VyY2VzQ29udGVudCI6WyJsZXQgUHJvbWlzZSA9IHJlcXVpcmUoICdibHVlYmlyZCcgKSxcbiAgICBFeGVjICAgID0gcmVxdWlyZSggJ2NoaWxkX3Byb2Nlc3MnICkuZXhlYyxcbiAgICBLZXkgICAgID0gcmVxdWlyZSggJy4uL2tleScgKSxcbiAgICBDb25zdCAgID0gcmVxdWlyZSggJy4uL2NvbnN0JyApLFxuICAgIFV0aWwgICAgPSByZXF1aXJlKCAnLi4vdXRpbCcgKSxcbiAgICBQcm9maWxlID0gZ2xvYmFsLlByb2ZpbGVcblxuY29uc3QgQVBQUyA9IENvbnN0LkFQUFMsXG4gICAgICBORVNUID0gQ29uc3QuTkVTVFxuXG5jbGFzcyBXb3JrU3BhY2Uge1xuICAgIGNvbnN0cnVjdG9yKCBwYXRoICkge1xuICAgICAgICB0aGlzLmJhc2VQYXRoID0gcGF0aFxuICAgIH1cblxuICAgIC8vIHBhdGgg5piv5ZCm5Li65pyJ5pWI55qE5bel5L2c56m66Ze0XG4gICAgc3RhdGljIGlzVmFsaWRXb3JrU3BhY2UoIHBhdGggKSB7XG4gICAgICAgIHJldHVybiBQcm9taXNlLmFsbCggW1xuICAgICAgICAgICAgVXRpbC5jaGVja0ZpbGVFeGlzdCggcGF0aCArIEFQUFMgKSxcbiAgICAgICAgICAgIFV0aWwuY2hlY2tGaWxlRXhpc3QoIHBhdGggKyBORVNUIClcbiAgICAgICAgXSApLnRoZW4oIHJlc3VsdHMgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSggcmVzdWx0cy5yZWR1Y2UoICggcHJldiwgY3VyICkgPT4gcHJldiAmJiBjdXIgKSApXG4gICAgICAgIH0gKVxuICAgIH1cblxuICAgIC8vIOiOt+WPluW9k+WJjeW3peS9nOepuumXtFxuICAgIHN0YXRpYyBjdXJyZW50KCkge1xuICAgICAgICByZXR1cm4gUHJvZmlsZS5nZXQoIEtleS5jdXJyZW50X3BhdGggKVxuICAgIH1cblxuICAgIC8vIOiOt+WPluWFqOmDqOW3peS9nOepuumXtFxuICAgIHN0YXRpYyBsaXN0KCkge1xuICAgICAgICByZXR1cm4gUHJvZmlsZS5nZXQoIEtleS53b3Jrc3BhY2VfbGlzdCApIHx8IFtdXG4gICAgfVxuXG4gICAgLy8g6K6+572uIHBhdGgg5Li65b2T5YmN5bel5L2c56m66Ze0XG4gICAgc3RhdGljIHNldEN1cnJlbnRXb3JrU3BhY2UoIHBhdGggKSB7XG4gICAgICAgIGxldCBsaXN0ICAgICAgICAgPSBQcm9maWxlLmdldCggS2V5LndvcmtzcGFjZV9saXN0ICkgfHwgW10sXG4gICAgICAgICAgICBleGlzdFBhdGgsXG4gICAgICAgICAgICBhbHJlYWR5RXhpc3QgPSBsaXN0LnNvbWUoICggaXRlbSwgaSApID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoIGl0ZW0gPT0gcGF0aCApIHtcbiAgICAgICAgICAgICAgICAgICAgZXhpc3RQYXRoID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFsOiBpdGVtLFxuICAgICAgICAgICAgICAgICAgICAgICAgaW5kZXg6IGlcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gKVxuXG4gICAgICAgIGlmICggYWxyZWFkeUV4aXN0ICkge1xuICAgICAgICAgICAgbGlzdC5zcGxpY2UoIGV4aXN0UGF0aC5pbmRleCwgMSApXG4gICAgICAgIH1cblxuICAgICAgICBsaXN0LnVuc2hpZnQoIHBhdGggKVxuICAgICAgICBQcm9maWxlLnNldCggS2V5LndvcmtzcGFjZV9saXN0LCBsaXN0IClcbiAgICAgICAgUHJvZmlsZS5zZXQoIEtleS5jdXJyZW50X3BhdGgsIHBhdGggKVxuICAgIH1cblxuICAgIGFjdGl2ZSgpIHtcbiAgICAgICAgV29ya1NwYWNlLnNldEN1cnJlbnRXb3JrU3BhY2UoIHRoaXMuYmFzZVBhdGggKVxuICAgIH1cblxuICAgIHN0YXJ0KCkge1xuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoIHJlc29sdmUgPT4ge1xuICAgICAgICAgICAgbGV0IHBhdGggICAgPSB0aGlzLmJhc2VQYXRoLFxuICAgICAgICAgICAgICAgIGNvbW1hbmQgPSBgY2QgJHtwYXRofS9uZXN0L2NtZCAmJiAuL3NlcnZpY2UyLnNoIHJlc3RhcnRgXG5cbiAgICAgICAgICAgIGxvZyggY29tbWFuZCwgJ2RlYnVnJyApXG4gICAgICAgICAgICBFeGVjKCBjb21tYW5kLCBlcnIgPT4gZXJyICYmIGxvZyggZXJyLCAnZXJyb3InICkgKVxuICAgICAgICAgICAgICAgIC5vbiggJ21lc3NhZ2UnLCBtZXNzYWdlID0+IGxvZyggbWVzc2FnZSwgJ2RlYnVnJyApIClcbiAgICAgICAgICAgICAgICAub24oICdleGl0JywgKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBsb2coICfmnI3liqHlmajmraPlnKjov5DooYwnIClcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZSggdHJ1ZSApXG4gICAgICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHByb2Nlc3MuZXhpdCgpXG4gICAgICAgICAgICAgICAgICAgIH0sIDAgKVxuICAgICAgICAgICAgICAgIH0gKVxuICAgICAgICAgICAgICAgIC5vbiggJ2Vycm9yJywgKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKCBmYWxzZSApXG4gICAgICAgICAgICAgICAgfSApXG4gICAgICAgIH0gKVxuICAgIH1cblxuICAgIHN0b3AoIGFsbCApIHtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKCByZXNvbHZlID0+IHtcbiAgICAgICAgICAgIGxldCBwYXRoICAgID0gdGhpcy5iYXNlUGF0aCxcbiAgICAgICAgICAgICAgICBpc0FsbCAgID0gYWxsID09ICdhbGwnID8gJ0FsbCcgOiAnJyxcbiAgICAgICAgICAgICAgICBjb21tYW5kID0gYGNkICR7cGF0aH0vbmVzdC9jbWQgJiYgLi9zZXJ2aWNlMi5zaCBzdG9wJHtpc0FsbH1gXG5cbiAgICAgICAgICAgIGxvZyggY29tbWFuZCwgJ2RlYnVnJyApXG4gICAgICAgICAgICBFeGVjKCBjb21tYW5kLCBlcnIgPT4gZXJyICYmIGxvZyggZXJyLCAnZXJyb3InICkgKVxuICAgICAgICAgICAgICAgIC5vbiggJ2V4aXQnLCAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGxvZyggJ+acjeWKoeWZqOW3suWBnOatoicgKVxuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKCB0cnVlIClcbiAgICAgICAgICAgICAgICAgICAgc2V0VGltZW91dCggKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgcHJvY2Vzcy5leGl0KClcbiAgICAgICAgICAgICAgICAgICAgfSwgMCApXG4gICAgICAgICAgICAgICAgfSApXG4gICAgICAgICAgICAgICAgLm9uKCAnZXJyb3InLCAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUoIGZhbHNlIClcbiAgICAgICAgICAgICAgICB9IClcbiAgICAgICAgfSApXG4gICAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFdvcmtTcGFjZVxuIl19