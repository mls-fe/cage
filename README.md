# Cage

[![npm version](https://badge.fury.io/js/cage.svg)](https://badge.fury.io/js/cage)

## 介绍

whornbill 环境配置。

## 安装/更新
    sudo npm install -g cage

## 命令
*`<>`表示参数可以省略*

*如果一个文件夹下拥有 `apps` 与 `nest` 两个文件夹，Cage 就认为它是 whornbill 环境。*

### 创建环境
    cage setup <文件夹名> <svn url>
    
### 配置环境
    cage config <文件夹名>
    cage c <文件夹名>
    
### 运行服务器
*Cage 会首先检测当前所处文件夹是否为 whornbill 环境，然后会检测默认的工作空间，如果两者检测皆不通过，会提示警告信息。*
    
    cage run
    cage r

### 停止服务器

#### 停止当前环境的服务器
    cage stop
    cage s

#### 停止所有服务器
    cage stop all
    cage s all
    cage sa

### 查看日志

#### 查看 server 日志
    cage log
    cage l
    cage log s
    cage l s
    
#### 查看 jserver 日志(不常用)
    cage log js
    cage l js
    
#### 打开日志所在文件夹
*只打开 server 日志所在的文件夹*

    cage lo
    
### 工作空间
*工作空间(workspace): 每一个 whornbill 环境都可以看做一个工作空间，你可以在不同空间中切换。*

#### 显示工作空间列表
    cage ls
