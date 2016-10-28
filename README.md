# Euler UI widgets & utilities, powered by React.
[![Build Status](https://api.travis-ci.org/shinxi/euler-ui.png)](https://travis-ci.org/shinxi/euler-ui)
[![Coverage Status](https://coveralls.io/repos/github/shinxi/euler-ui/badge.svg?branch=master)](https://coveralls.io/github/shinxi/euler-ui?branch=master)
[![Dependency Status](https://david-dm.org/shinxi/euler-ui.svg)](https://david-dm.org/shinxi/euler-ui)
[![devDependency Status](https://david-dm.org/shinxi/euler-ui/dev-status.svg)](https://david-dm.org/shinxi/euler-ui#info=devDependencies)
[![Monthly Downloads](https://img.shields.io/npm/dm/euler-ui.svg)](https://packagist.org/packages/euler-ui/euler-ui)
<!--
[![Latest Stable Version](https://poser.pugx.org/shinxi/euler_react/v/stable.png)](https://packagist.org/packages/shinxi/euler)
-->
[![NPM](https://nodei.co/npm/euler-ui.png?downloads=true&downloadRank=true)](https://nodei.co/npm/euler-ui/)

# Introduction

Euler UI is a library including a set of UI widgets & utilities, it aims to speed up front end development.

# Topics
- [Features](#features)
- [Quick start](#quick-start)


# Quick start

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

# Features

- [Request](#request)
- [Notification](#notification)
- [I18N](#i18n)
- [Spinner](#spinner)
- [Select](#select)

# Request
Aren't you tired of configuring nginx server to test with different back-end server?  
Aren't you tired of creating an express server to start your app?  
With simple configuration, you can count on Request module and be able to test with different back-end server, without configuring nginx server or creating an express server.  
  * Start server
      1. create e_conf/req folder at your project root
      2. add conf.json at e_conf/req.

        ```js
        {
            "STATIC_FOLDER": ["/", "/src"], // static folders that be used at request server
            "WEBPACK_CONF_FILE": "webpack.config.js", // webpack config file path
            "BUILD_ENV": "DEV", // build env, default is DEV, options are DEV, SIT, UAT, PROD, it will be mapped with different proxy file.
            "INDEX_HTML": "src/public/index.html", // index html that be used at request server
        }
        ```

      3. run 

        ```
        npm estart
        ```
  * Sending a request
    1. create proxy folder at e_conf/req
    2. create differnt request proxy for different environment, e.g., proxy.json or proxy_dev.json, proxy_sit.json, proxy_uat.json, proxy_prod.json

        ```js 
        proxy.json
            [
                "proxy": "http://localhost:8000" // global proxy setting
            ]
        ```

    3. request

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

    4. request API
        Simply speaking, use below api to send a request, the request will be sent to the proxy server.
        ```js
        request({
            url: "/portal/login",
            method: 'get', //post or get or put or delete
            queryParams: { // query parameters, the request url will be /portal/login?param1=value1&param2=value2
              parma1: 'value1',
              parma2: 'value2'
            },
            restParams: {
              productId: "1000"
              // if url path is '/issues/product/:productId/groupbystatus', the real path will be 
              // '/issues/product/1000/groupbystatus'
            },
            loadingMask: true,// display load mask, default is false
            data: { // post data
              userName: 'Tom',
              age: 28
            },
            proxy: true, // default is true, if set as false, the url won't get proxied, useful for retrieving local resources
            headers: { //header data
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
        Moreover, you can specify a request at proxy.json with the same identifier sent by request
        ```js 
        proxy.json
            [
                "proxy": "http://localhost:8000", // global proxy setting
                "requests": {
                    "LOGIN": {
                        "path": "login", // path will be used to send request by browser
                        "source": "localhost:8001/login"// real path the request will be sent to
                    }
                }
            ]
        ```
        ```js
        request({
            id: "USER_LOGIN", // key at e_conf/req/proxy/proxy*.json#requests
            method: 'get', //post or get or put or delete
            queryParams: { // query parameters, the request url will be /portal/login?param1=value1&param2=value2
              parma1: 'value1',
              parma2: 'value2'
            },
            restParams: {
              productId: "1000"
              // if url path is '/issues/product/:productId/groupbystatus', the real path will be 
              // '/issues/product/1000/groupbystatus'
            }
            data: { // post data
              userName: 'Tom',
              age: 28
            },
            headers: { //header data
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

A simple notification creator for you to create information/warning/error/success notificaiton.

```js
// Create a hello world notificaiton as information.
Notification.create({
  message: "Hello World!"
})

// you can specify notification type with type configuraiton
Notification.create({
  message: "Hello World!",
  type: "warning"// default is info, options are info, warning, success, error
})

// By default, the notification will be automatically closed in 3 seconds
// you can use timeout configuration to specify the time before the notificaiton be closed
// if timeout is smaller than or equal 0, the notificaiton will just keep still, and only can be closed manually.
Notification.create({
  message: "Hello World!",
  timeout: -1 // this notificaiton won't get closed unless manully click its close button.
})
```

# I18N

Module for internationalization and localization purpose. Switch differnt locale at runtime!

1. create e_conf/i18n folder at your project root.

2. add conf.json at e_conf/i18n.

    ```js
    {
        "default": "zh_cn", // default locale name, you can append url query "locale=xxx" to overwrite this settings
        // locale maps will be used to map locale file, 
        // the key is local name, the value is local file suffix, 
        // e.g., if locale is zh, locales map is {"zh", "zh_cn"}, i18n/locale_zh_cn.json will be used.
        "locales": {
          "zh": "zh_cn",
          "zh_cn": "zh_cn",
          "en": "en_us",
          "en_us": "en_us"
        }
    }
    ```
3. add your locale*.json.

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
    
4. After above steps, you are now free to use our i18n module!
    ```js 
    main.js
        import { i18n} from 'euler-ui'
        console.log(Localization.get("notification.info"));
    ```

# Spinner

Widget for show or display loading mask.

```js 
    import {Spinner} from 'euler-ui'
    var spinner = Spinner.show({
      type: 'circle', // spinner type, default is circle, options are dot, ring
      at: domElement // specify where to show the spinner, default is document.body
    })
    Spinner.hide([spinner]); // hide the spinner, if the spinner is not passed in, it will just hide last spinner created by spinner.show.
```

# Select


# License
The MIT License (MIT)

Copyright (c) 2016 Shin Xi

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.