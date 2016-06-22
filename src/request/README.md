* Request
```js

```
npm install euler-ui

import {Request} from 'euler-ui'

Request({
  url: "USER_LOGIN", // key at conf*.json
  method: 'get', //post or get or put or delete
  queryParams: { // query parameters
    parma1: 'value1',
    parma2: 'value2'
  },
  restParams: {
    productId: "1000"
    // if path at conf*.json is '/issues/product/:productId/groupbystatus', the real path will be 
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
  dispatch({
    type: types.USER_LOGIN,
    response: response.body
  })
})

proxy.json
[{
  "url": "http://127.0.0.1:8000"
}, {
  "USER_LOGIN": {
    "path": "login",
    "url": "/public/mockResponse/login_success.json", //file path or server url, source
    "method": "get"
  }
}]

if url is not found at conf.json,
get the url and send it to the browser, server will get the center url and map it with the path
;
if url is found at conf.json
get the path and send it to browser, express server will get the source and map it with the path


Request({
  url: 'foo' // http://127.0.0.1:8000/foo
})

Request({
  url: '/foo' // http://127.0.0.1:8000/foo
})

Request({
  url: 'foo/' // http://127.0.0.1:8000/foo/
})

Request({
  url: '/foo/' // http://127.0.0.1:8000/foo/
})

Request({
  url: 'theplatform.ai', // theplatform.ai
  proxy: false
})

Request({
  url: 'USER_LOGIN' // /public/mockResponse/login_success.json
})

request().then()

request().timeout(60s).then()

request.delay(10s).then()

Promise.delay(2000, function(){
console.log("wow");
return "wow"
}).timeout(3000).then(function(fileContents) {
console.log(fileContents);
}).catch(Promise.TimeoutError, function(e) {
    console.log("could not read file within 1000ms");
});

var timeout = function(fn, ts) {
return new Promise(function(resolve) {
setTimeout(function(){
  resolve(fn());
}, ts)
})
}

timeout(function() {
console.log("hahahah");
return "hahaha"
}, 1000).then(function(val) {
console.log("heiehie", val);
})

var timeout = function(fn, ts) {
return new Promise(function(resolve) {
resolve(fn);
}).delay(ts).then(function(){
return fn();
})
}

var timeout = function(fn, ts) {
return Promise.delay(ts).then(fn)
}



console.log("haha, I'm mounting!")
    var cssRequire = require('./test.json');
    console.log("css require", cssRequire);
    var url = "../../../src/test.json";
    var cssRequire2 = require("../../../src/test.json");

    console.log("css require2", cssRequire2);
    // var fContent = fs.readFileSync(url);
    // console.log("css require3", fContent);
    var conf = require.context("../../../src", true, /\.json$/);
    var data = conf("./test.json");
    console.log("conf.resolve require3", data);
