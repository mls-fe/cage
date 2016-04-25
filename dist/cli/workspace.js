'use strict';

var Inquirer = require('inquirer'),
    WorkSpace = require('../core/workspace');

module.exports = {
    list: function list() {
        var list = WorkSpace.list();

        if (list.length) {
            Inquirer.prompt([{
                type: 'list',
                name: 'workspace',
                message: '工作空间列表',
                choices: list,
                default: WorkSpace.current()
            }], function (answer) {
                WorkSpace.setCurrentWorkSpace(answer.workspace);
                log('切换工作空间成功！');
            });
        } else {
            log('没有检测到工作空间，请使用 cage config 设置', 'warn');
        }
    }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jbGkvd29ya3NwYWNlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsSUFBSSxXQUFZLFFBQVMsVUFBVCxDQUFoQjtJQUNJLFlBQVksUUFBUyxtQkFBVCxDQURoQjs7QUFHQSxPQUFPLE9BQVAsR0FBaUI7QUFDYixRQURhLGtCQUNOO0FBQ0gsWUFBSSxPQUFPLFVBQVUsSUFBVixFQUFYOztBQUVBLFlBQUssS0FBSyxNQUFWLEVBQW1CO0FBQ2YscUJBQ0ssTUFETCxDQUNhLENBQUU7QUFDUCxzQkFBTSxNQURDO0FBRVAsc0JBQU0sV0FGQztBQUdQLHlCQUFTLFFBSEY7QUFJUCx5QkFBUyxJQUpGO0FBS1AseUJBQVMsVUFBVSxPQUFWO0FBTEYsYUFBRixDQURiLEVBT1Msa0JBQVU7QUFDWCwwQkFBVSxtQkFBVixDQUErQixPQUFPLFNBQXRDO0FBQ0Esb0JBQUssV0FBTDtBQUNILGFBVkw7QUFXSCxTQVpELE1BWU87QUFDSCxnQkFBSyw4QkFBTCxFQUFxQyxNQUFyQztBQUNIO0FBQ0o7QUFuQlksQ0FBakIiLCJmaWxlIjoid29ya3NwYWNlLmpzIiwic291cmNlc0NvbnRlbnQiOlsibGV0IElucXVpcmVyICA9IHJlcXVpcmUoICdpbnF1aXJlcicgKSxcbiAgICBXb3JrU3BhY2UgPSByZXF1aXJlKCAnLi4vY29yZS93b3Jrc3BhY2UnIClcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gICAgbGlzdCgpIHtcbiAgICAgICAgbGV0IGxpc3QgPSBXb3JrU3BhY2UubGlzdCgpXG5cbiAgICAgICAgaWYgKCBsaXN0Lmxlbmd0aCApIHtcbiAgICAgICAgICAgIElucXVpcmVyXG4gICAgICAgICAgICAgICAgLnByb21wdCggWyB7XG4gICAgICAgICAgICAgICAgICAgIHR5cGU6ICdsaXN0JyxcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogJ3dvcmtzcGFjZScsXG4gICAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6ICflt6XkvZznqbrpl7TliJfooagnLFxuICAgICAgICAgICAgICAgICAgICBjaG9pY2VzOiBsaXN0LFxuICAgICAgICAgICAgICAgICAgICBkZWZhdWx0OiBXb3JrU3BhY2UuY3VycmVudCgpXG4gICAgICAgICAgICAgICAgfSBdLCBhbnN3ZXIgPT4ge1xuICAgICAgICAgICAgICAgICAgICBXb3JrU3BhY2Uuc2V0Q3VycmVudFdvcmtTcGFjZSggYW5zd2VyLndvcmtzcGFjZSApXG4gICAgICAgICAgICAgICAgICAgIGxvZyggJ+WIh+aNouW3peS9nOepuumXtOaIkOWKn++8gScgKVxuICAgICAgICAgICAgICAgIH0gKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbG9nKCAn5rKh5pyJ5qOA5rWL5Yiw5bel5L2c56m66Ze077yM6K+35L2/55SoIGNhZ2UgY29uZmlnIOiuvue9ricsICd3YXJuJyApXG4gICAgICAgIH1cbiAgICB9XG59XG4iXX0=