# Cage ChangeLog

## 2017-06-28, Version 2.5.0

## Improvement

- add more thorough hints for host config.
- only update workspace when it's changed.

### Fix

- fix `inquirer`'s outdated api.

## 2016-07-29, Version 2.3.2

## Improvement

- use new shell script

## Fix

- fix old project's script name

## 2016-07-28, Version 2.3.0

## Improvement

- adopt new config scheme.

## 2016-07-20, Version 2.2.4

## Fix

- fix log file's path

## 2016-07-18, Version 2.2.3

## Improvement

- change workspace will trigger update.

## Fix

- fix Inquirer's invoke problem.
- correctly update config file

## 2016-07-18, Version 2.2.0

### Improvement

- adapt to hornbill's newest version.

## 2016-05-10, Version 2.1.0

### Improvement

- `cage u` can change port

## 2016-05-05, Version 2.0.0

### Improvement

- add unit test(not complete)

### Fix

- fix `cage l`, add extra infomation.
- when there's no ip config, first run would generate a undefined value.

## 2016-04-27, Version 2.0.0-beta-2

### Fix

- fix `cage setup`
- fix `cage hostlist`'s format
- fix date format
- use a domain name instead of ip address
- change `getIP()` to sync function

## 2016-04-25, Version 2.0.0-beta-1

### Notable changes

- 去掉多余依赖: `chalk`, `getmac`, `keymirror`, `moment`, `npm`, `object-assign`, `open`, `string-width`, `svn-interface`, `tail`, `yosay`, `update-notifier`, `got`
- 去掉 `gulp` 编译依赖

### Improvement

- 增加 `cage ip` 命令, 用于显示 `ip` 地址.
- 增加 `cage mac` 命令, 用于显示 `mac` 地址.
- 增加 `cage update` 命令, 暂时用于更新 `ip` 地址.
- 增加 `cage hostlist` 命令, 显示曾经配置的域名列表

## 2016-04-18, Version 1.3.8

### Improvement

- 增加了额外的打印信息

### Fix

- 修改服务器 IP 地址。

## 2015-12-21, Version 1.3.6

### Improvement

- 调整配置代理与 IP 的顺序

## 2015-12-21, Version 1.3.5

### Improvement

- 升级 `Babel` 到 6.x

### Fix

- IP 地址更新失败后, 终止流程, 给出提示

## 2015-09-14, Version 1.3.3

### Fix

- 修改服务器 IP 地址。

## 2015-08-17, Version 1.3.2

### Fix

- 忘了修改 `update.js` 里对 `string-length` 的引用了。

## 2015-08-14, Version 1.3.1

### Improvement

- `setup` 命令可以自定义 svn 地址，用于除主站以外的环境部署。

### Fix

- 更新依赖 `string-width`，解决汉字显示问题
- 解决 `setup` 参数问题

## 2015-07-30, Version 1.2.6

### Fix

- 增加异常处理

## 2015-07-13, Version 1.2.5

### Fix

- 修复 `setup`。

## 2015-07-08, Version 1.2.4

### Fix

- `cage config` 执行完毕后，会打开错误的 url
- npm 安装的包位置错误
- svn 用户名或密码输入错误给出提示

### Improvement

- 改进 `setup` 命令覆盖已存在文件夹的选择方式

## 2015-07-08, Version 1.2.0

### Notable changes

- 增加 `cage sa` 停止所有服务器
- 增加 `cage lo` 命令打开日志所在文件夹

### Improvement

- 将是否覆盖域名的设置修改为列表
- 文案及文档链接修改

## 2015-07-06, Version 1.0.4

### Fix

- 修复 update 功能
- 修复 `findValidWorkspace()` 异步代码的错误
- 修复 `Util.getPort()` 的路径参数无法获取
- 修复 `cage ls` 在工作空间列表为空的报错

## 2015-07-06, Version 1.0.0

### Notable changes

- 首次提交
