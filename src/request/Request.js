import promisedRequest from './PromisedRequest'
import _ from 'lodash'
import Notify from "../notification"
import Spinner from '../Spinner'

var check = function(regex) {
  return regex.test(window.navigator.userAgent.toLowerCase());
}
var isOpera = check(/opera/);
var isIE = !isOpera && (check(/msie/) || check(/trident/));

var prefix = "";
var REQUEST_MAPS;
var globalProxy;

function init() {
  var requestConf = require("./RequestConf").getRequestConf();
  var buildEnv = requestConf.BUILD_ENV || '';
  prefix = requestConf.urlPrefix;
  REQUEST_MAPS = requestConf.requests;
  globalProxy = requestConf.proxy;
}

/**
dispatch => {
  myRequest({
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
    },
    data: { // post data
      userName: 'Tom',
      age: 28
    },
    beforeSend() {
    },
    loadingMask: true,// display load mask, default is false
    headers: { //header data
      'Context-type': "text"
    }
  }, (err, response) => { //http://visionmedia.github.io/superagent/#response-properties
    dispatch({
      type: types.USER_LOGIN,
      response: response.body
    })
  })
}**/
var XMLDOMParser = DOMParser ? new DOMParser() : "";
var Request = function(options, cb) {
  if (!REQUEST_MAPS) {
    init();
  }

  var url = options.url;
  var method = options.method || 'GET'; // get, post, get, put
  method = method.toUpperCase();
  var data = options.data || {}; //key, value
  var dataType = options.dataType; //xml, json, script, html
  var headers = options.headers || {}; // key, value
  var valMap = REQUEST_MAPS[url] || {};
  url = valMap.path || url;
  var source = valMap.source;
  var queryParams = options.queryParams;
  var restParams = options.restParams;
  var proxy = true;
  if (options.hasOwnProperty("proxy")) {
    proxy = options.proxy;
  }


  // TODO what does below codes do?
  if (/^(\/|\\)/.test(source)) {
    url = source;
    method = "GET";
  }

  _.each(restParams, (val, key) => {
    var regex = new RegExp(`:${key}(/|$)`, "g");
    url = url.replace(regex, function(match, group) {
      return val + group;
    })
  })

  if (proxy && prefix) {
    if (/^(\/|\\)/.test(url)) {
      url = prefix + url;
    } else {
      url = prefix + "/" + url;
    }
    if (!/^(\/|\\)/.test(prefix)) {
      url = "/" + url;
    }
  }
  if (isIE) {
    if (/\?/.test(url)) {
      url = url + "&ts=" + new Date().getTime();
    } else {
      url = url + "?ts=" + new Date().getTime();
    }
  }

  if (options.loadingMask) {
    Spinner.show();
  }

  options.beforeSend && options.beforeSend();

  var newRequest;
  if ("GET" === method) {
    newRequest = promisedRequest.get(url);
  } else if ("POST" === method) {
    newRequest = promisedRequest.post(url).send(data);
  } else if ("PUT" === method) {
    newRequest = promisedRequest.put(url).send(data);
  } else if ("DELETE" === method) {
    newRequest = promisedRequest.del(url);
  }
  if (queryParams && _.isPlainObject(queryParams)) {
    newRequest.query(queryParams);
  }
  newRequest = newRequest.set(headers);
  if (cb) {
    var handleError = function(err, res) {
      console.error('oh no. err at Request.js', err);
      if (err && err.statusCode === 404) {
        console.log('404', res.body);
      // TODO rethink best approach.
      // fix uuid parse as json issue.
      } else if (err && err.statusCode === 200) {
        if (!res) {
          res = {}
        }
        res.body = err.rawResponse || "";
      } else {
        console.log('Other errors', err);
        var errText = err && err.response && err.response.text;
        var errObj = errText && JSON.parse(errText);
        if (errObj && errObj.errorCode === "IAM_00013") {
          // TODO i18n
          Notify.create({
            message: "当前会话已失效，请重新登录!"
          })
          sessionStorage.setItem("userInfo", "");
          // TODO bad code, backend should handel session timeout!
          setTimeout(() => {
            window.location = "/"
          }, 2000)
        }
      }
      cb(err, res)
    }
    newRequest.end(function(error, response) {
      if (options.loadingMask) {
        Spinner.hide();
      }
      if (error) {
        handleError(error, response);
        return;
      }

      if (cb) {
        if (!response.body && response.text && (response.req.getHeader("accept") === 'application/xml')) {
          response.body = XMLDOMParser.parseFromString(response.text, "application/xml");
        }
        cb(error, response);
      }
    });
  }
  return newRequest;
}

export default Request