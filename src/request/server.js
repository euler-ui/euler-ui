var webpack = require('webpack')
var webpackDevMiddleware = require('webpack-dev-middleware')
var webpackHotMiddleware = require('webpack-hot-middleware')
var express = require('express');
var path = require('path');
var request = require('request');
var _ = require('lodash');
var confs = require("./RequestConf").getRequestConf();

var configFilePath = confs.webpackConfigFile;
var folderPrefix = "../../../../";
if (_.startsWith("/", configFilePath)) {
  folderPrefix = "../../../.."
}
var config = require(folderPrefix + configFilePath);

var app = new (express)();
var port = 3333;

var compiler = webpack(config);

var bodyParser = require('body-parser');
app.use(bodyParser.json()); // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({ // to support URL-encoded bodies
  extended: true
}));


app.use(webpackDevMiddleware(compiler, {
  noInfo: true,
  publicPath: config.output.publicPath
}))
app.use(webpackHotMiddleware(compiler))

var staticFolders = confs.staticFolders;
_.each(staticFolders, function(staticFolder) {
  folderPrefix = "../../../../";
  if (_.startsWith("/", staticFolder)) {
    folderPrefix = "../../../.."
  }
  app.use('/', express.static(folderPrefix + staticFolder));
})

var requests = confs.requests;
var proxy = confs.proxy;
var urlPrefix = confs.urlPrefix;
var getCookies = function(cookieStr) {
  var query = cookieStr;
  if (!query) {
    return false;
  }
  var pairs = query.split(';');
  var result = {};
  _.each(pairs, function(params) {
    var p = params.split('=');
    var pair = {};
    result[p[0].replace(/\s/g, "")] = p[1]
  })
  return result;
}
var proxyRequest = (req, res, url) => {
  var dispatch = (req, res, url) => {
    var source = url;
    var method = req.method;
    console.log("source is ", source, "method is", method);
    console.log("req.headers", req.headers);
    console.log("req.body", req.body);
    console.log("req.query", req.query);
    console.log("req.params", req.params);
    var cookieObj = getCookies(req.headers.cookie);
    console.log("cookieObj", cookieObj);
    _.each(req.params, (val, key) => {
      var regex = new RegExp(`:${key}(/|$)`, "g");
      source = source.replace(regex, function(match, group) {
        return val + group;
      })
    })
    var j = request.jar();
    var cookie = request.cookie(`JSESSIONID=${cookieObj.JSESSIONID}`);
    j.setCookie(cookie, source);
    console.log("source is ", source);
    if ("GET" === method) {
      console.log("GET");
      request.get({
        url: source,
        qs: req.query,
        headers: req.headers,
        jar: j
      }).pipe(res);
    } else if ("POST" === method) {
      console.log("Post");
      request.post({
        url: source,
        qs: req.query,
        json: req.body,
        headers: req.headers,
        jar: j
      }).pipe(res);
    } else if ("PUT" === method) {
      console.log("PUT");
      request.put({
        url: source,
        qs: req.query,
        json: req.body,
        headers: req.headers,
        jar: j
      }).pipe(res);
    } else if ("DELETE" === method) {
      console.log("DELETE");
      request.del({
        url: source,
        qs: req.query,
        headers: req.headers,
        jar: j
      }).pipe(res);
    }
  }
  try {
    dispatch(req, res, url);
  } catch ( err ) {
    console.log("proxyRequest error: ", err);
  }
}


_.forEach(requests, function(valObj, key) {
  var path = valObj.path || key;
  var method = valObj.method || 'GET';
  method = method.toUpperCase();
  if (!/^(\/|\\)/.test(path)) {
    path = "/" + path;
  }

  app.all(path, function(req, res) {
    proxyRequest(req, res, (valObj.source || path))
  });
});

var index = confs.index;
folderPrefix = "../../../../";
if (_.startsWith("/", index)) {
  folderPrefix = "../../../..";
}
var filePath = path.normalize(path.format({
  dir: __dirname,
  base: folderPrefix + index
}));

if (!/^(\/|\\)/.test(urlPrefix)) {
  urlPrefix = "/" + urlPrefix;
}

var router = express.Router();
router.use(function(req, res, next) {
  var path = proxy + req.path;
  proxyRequest(req, res, path);
});
app.use(urlPrefix, router);

app.get("*", function(req, res) {
  res.sendFile(filePath);
});

app.listen(port, function(error) {
  if (error) {
    console.error(error)
  } else {
    console.info("==> 🌎  Listening on port %s. Open up http://localhost:%s/ in your browser.", port, port)
  }
})

process.on('uncaughtException', (err) => {
  console.log("UnCaught exception", err);
});
