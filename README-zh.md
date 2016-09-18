# 基于React的Euler UI 部件&实用工具.
[![Build Status](https://api.travis-ci.org/shinxi/euler-ui.png)](https://travis-ci.org/shinxi/euler-ui)
[![Coverage Status](https://coveralls.io/repos/github/shinxi/euler-ui/badge.svg?branch=master)](https://coveralls.io/github/shinxi/euler-ui?branch=master)
[![Dependency Status](https://david-dm.org/shinxi/euler-ui.svg)](https://david-dm.org/shinxi/euler-ui)
[![devDependency Status](https://david-dm.org/shinxi/euler-ui/dev-status.svg)](https://david-dm.org/shinxi/euler-ui#info=devDependencies)
[![Monthly Downloads](https://img.shields.io/npm/dm/euler-ui.svg)](https://packagist.org/packages/euler-ui/euler-ui)
<!--
[![Latest Stable Version](https://poser.pugx.org/shinxi/euler_react/v/stable.png)](https://packagist.org/packages/shinxi/euler)
-->
[![NPM](https://nodei.co/npm/euler-ui.png?downloads=true&downloadRank=true)](https://nodei.co/npm/euler-ui/)

# 简介

Euler UI是一组包括UI小部件和工具的库,它旨在加快前端开发。

# 主题
- [特性](#特性)
- [快速入门](#快速入门)


#快速入门

## Node.js

    npm install euler-ui

Then:

```js
var euler = require("euler-ui");
```
or es6
```js
import * as euler from 'euler-ui'
import { request, i18n, Notification, Select } from 'euler-ui'
```

# 特性

- [Request](#request)
- [Notification](#notification)
- [I18N](#i18n)
- [Spinner](#spinner)
- [Select](#select)

# Request
你是否厌倦了配置nginx服务器和后端服务器的测试?
难道你不厌倦通过创建一个表达服务器来启动你的应用程序? 
通过简单的配置,你可以通过Request模块在无需配置nginx服务器或创建一个express服务器的情况下测试不同的后端服务器.
  * 启动服务器
      1. 在项目根目录创建e_conf/req文件夹.
      2. 在e_conf/req下添加conf.json.

        ```js
        {
            "STATIC_FOLDER": ["/", "/src"], // 请求服务器上使用的静态文件夹
            "WEBPACK_CONF_FILE": "webpack.config.js", // webpack配置文件的路径
            "BUILD_ENV": "DEV", //建立环境，默认选项是DEV, 可以选择的有 DEV, SIT, UAT, PROD, 将与不同的代理文件映射。
            "INDEX_HTML": "src/public/index.html", // 用于请求服务的主页
        }
        ```

      3. 运行

        ```
        npm estart
        ```
        * Sending a request
    1. 在e_conf/req下创建代理(proxy)文件夹
    2.为不同的环境创建不同的请求代理,例如,proxy.json或proxy_dev.json,json,proxy_sit.json, proxy_uat.json, proxy_prod.json

        ```js 
        proxy.json
            [
                "proxy": "http://localhost:8000" // 全局代理设置
            ]
        ```

    3. 请求

        ```js 
        actions/login.js
            import { request } from 'euler-ui'
            export const loginUser = (userName, pwd) => {
                request({
                  url: "/portal/login",
                  method: "post",
                  data: {
                    userName: userName,
                    password: pwd
                  }
                }, (err, response) => {
                  if (err) {
                    error();
                    return;
                  }
                  successs();
                })
            }
        ```

        ```js 
        components/login.js
            import {loginUser} from '../actions/login'
            ...
              login() {
                loginUser();
              }
            ...
        ```

    4. 请求 API
        简单地说,使用以下api发送一个请求,请求将被发送到代理服务器.
        ```js
        request({
            url: "/portal/login",
            method: 'get', //post 或 get 或 put 或 delete
            queryParams: { // 查询参数, 请求地址是 /portal/login?param1=value1&param2=value2
              parma1: 'value1',
              parma2: 'value2'
            },
            restParams: {
              productId: "1000"
              // 如果地址是 '/issues/product/:productId/groupbystatus', 那么绝对路径为 
              // '/issues/product/1000/groupbystatus'
            },
            loadingMask: true,// 显示加载掩码，默认为false
            data: { // post数据
              userName: 'Tom',
              age: 28
            },
            proxy: true, // 默认是true, 如果为false,url将不会被代理, 可用于检索本地资源
            headers: { //头文件
              'Context-type': "text"
            }
        }, (err, response) => { //http://visionmedia.github.io/superagent/#response-properties
            if (err) {
                error()
                return;
            }
            success();
        })
        ```
        此外,你可以通过request发送的相同标识符指定一个请求.
        ```js 
        proxy.json
            [
                "proxy": "http://localhost:8000", //全局代理服务器设置
                "requests": {
                    "LOGIN": {
                        "path": "login", // 路径将被发送请求的浏览器使用
                        "source": "localhost:8001/login"// 发送请求的真正路径
                    }
                }
            ]
        ```
        ```js
        request({
            id: "USER_LOGIN", // e_conf/req/proxy/proxy*.json#requests中的键
            method: 'get', //post 或 get 或 put 或 delete
            queryParams: { // 查询参数, 请求地址为 /portal/login?param1=value1&param2=value2
              parma1: 'value1',
              parma2: 'value2'
            },
            restParams: {
              productId: "1000"
              // 如果地址是'/issues/product/:productId/groupbystatus', 真实地址为 
              // '/issues/product/1000/groupbystatus'
            }
            data: { // 发送的数据
              userName: 'Tom',
              age: 28
            },
            headers: { //头文件
              'Context-type': "text"
            }
        }, (err, response) => { //http://visionmedia.github.io/superagent/#response-properties
            if (err) {
                error()
                return;
            }
            success();
        })
        ```
# Notification

通过information/warning/error/success来为你创建一个简单的Notification.

```js
// 创建一个Hello World notificaiton信息。
Notification.create({
  message: "Hello World!"
})

// 你可以根据配置类型指定notification类型
Notification.create({
  message: "Hello World!",
  type: "warning"// 默认值为info,可选类型有info, warning, success, error
})

// 通过默认设置,通知将在3秒内关闭
// 你可以通过设置timeout值来指定通知关闭的时间
// 如果timeout值小于等于0,通知将不会自动关闭,只能手动关闭
Notification.create({
  message: "Hello World!",
  timeout: -1 // 除非手动点击关闭按钮，否则通知不会关闭
})
```

# I18N

以国际化和本地化为目的模块.在运行时切换不同的环境!

1. 在项目根目录创建e_conf/i18n文件夹.

2. 在e_conf/i18n添加conf.json.

    ```js
    {
        "default": "zh_cn", // 默认本地名, 你可以追加查询地址 "locale=xxx" 来重置设定
        // 本地映射将被用来映射本地文件, 
        // 关键字是本地名称,值是本地文件后缀, 
        // 例如,本地名是 zh, 本地映射是{"zh", "zh_cn"}, i18n/locale_zh_cn.json 将会被调用.
        "locales": {
          "zh": "zh_cn",
          "zh_cn": "zh_cn",
          "en": "en_us",
          "en_us": "en_us"
        }
    }
    ```
3. 添加你的locale*.json.

    ```js 
    locale_en_us.json
        {
          "notification": {
            "success": "Success",
            "error": "Error",
            "info": "Information",
            "warning": "Warning"
          }
        }
    ```
    
    ```js 
    locale_zh_cn.json
        {
          "notification": {
            "success": "成功",
            "error": "错误",
            "info": "通知",
            "warning": "警告"
          }
        }
    ```
    
4.执行以上步骤之后,你现在可以免费使用我们的i18n模块!!

    ```js 

    main.js
        import { i18n} from 'euler-ui'
        console.log(Localization.get("notification.info"));
        
    ```
# Spinner

用来显示或加载mask的小部件.

    ```js

    import {Spinner} from 'euler-ui'
    var spinner = Spinner.show({
      type: 'circle', // spinner类型,默认是circle,可选的有dot, ring
      at: domElement // 指定显示spinner的地方, 默认为document.body
    })
    Spinner.hide([spinner]); // 隐藏spinner,如果spinner未通过, 他将隐藏spinner.show创建的最后一个spinner 
   ```

# Select


# 许可证
The MIT License (MIT)

Copyright (c) 2016 Shin Xi

特此授权，任何人可以免费使用这款软件和该软件相关的文件.不受任何限制.可以对使用
,复制,修改,归并,公开,发布,转发甚至可以出售软件的副本.与此同时,被授权人应遵循以
下条款:

上述版权声明和本许可声明应包括在所有副本或实质性部分的软件之中.

本软件提供的"原版",没有任何形式的保证,明示或暗示,包括但不限于适销性的保证,为特
定的目的和侵权性的行为.无论是在合同,侵权或以其他方式产生的,出于或与软件或使用或
其他交易软件的行动的任何情况下,作者或版权持有人有应承担任何索赔,损害赔偿或其他
责任.
