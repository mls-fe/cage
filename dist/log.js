'use strict';

//https://github.com/chalk/ansi-styles/blob/master/index
var levels = [{
    name: 'info',
    color: 'white'
}, {
    name: 'debug',
    color: 'gray'
}, {
    name: 'error',
    color: 'red',
    bold: true
}, {
    name: 'warn',
    color: 'yellow',
    bold: true
}, {
    name: 'success',
    color: 'green'
}],
    bold = [1, 22],
    colors = {
    red: [31, 39],
    green: [32, 39],
    yellow: [33, 39],
    white: [37, 39],
    gray: [90, 39]
},
    edge = '\u001b[',
    style = {},
    helper = function helper(content) {
    return `${edge}${content}m`;
};

levels.forEach(function (level) {
    var color = colors[level.color],
        isBold = !!level.bold;

    style[level.name] = function (content) {
        var str = [content];

        str.unshift(helper(color[0]));
        str.push(helper(color[1]));

        if (isBold) {
            str.unshift(helper(bold[0]));
            str.push(helper(bold[1]));
        }

        return str.join('');
    };
});

global.log = function (content) {
    var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'info';

    if (type in style) {
        console.log(style[type](content));
    }
};