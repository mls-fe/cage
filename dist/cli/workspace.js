'use strict';

var Inquirer = require('inquirer'),
    WorkSpace = require('../core/workspace');

module.exports = {
    list(callback) {
        var list = WorkSpace.list(),
            current = WorkSpace.current();

        if (list.length) {
            Inquirer.prompt([{
                type: 'list',
                name: 'workspace',
                message: '工作空间列表',
                choices: list,
                default: current
            }]).then(function (answer) {
                if (answer.workspace === current) {
                    return log('工作空间没有变化，不需要更新。');
                }

                WorkSpace.setCurrentWorkSpace(answer.workspace);
                log('切换工作空间成功！');
                callback && callback();
            });
        } else {
            log('没有检测到工作空间，请使用 cage config 设置', 'warn');
        }
    }
};