import request from 'superagent'
import _ from 'lodash'

var conf;

function init() {
  console.error("I'm requiring");
  var confs = require("../../../../e_conf/req/conf.json");

  var buildEnv = confs.BUILD_ENV || '';
  var __DEV__ = buildEnv === 'DEV' || buildEnv === '';
  var __SIT__ = buildEnv === 'SIT';
  var __UAT__ = buildEnv === 'UAT';
  var __PROD__ = buildEnv === 'PROD';
  var proxySettings = {};
  if (__DEV__) {
    proxySettings = require("../../../../e_conf/req/proxy/proxy.json");
  } else if (__SIT__) {
    proxySettings = require("../../../../e_conf/req/proxy/proxy_sit.json");
  } else if (__UAT__) {
    proxySettings = require("../../../../e_conf/req/proxy/proxy_uat.json");
  } else if (__PROD__) {
    proxySettings = require("../../../../e_conf/req/proxy/proxy_prod.json");
  }
  conf = {
    settings: proxySettings[1] || proxySettings,
    global: proxySettings[0],
    staticFolders: confs.STATIC_FOLDER,
    webpackConfigFile: confs.WEBPACK_CONF_FILE,
    env: confs.BUILD_ENV,
    index: confs.INDEX_HTML
  }
}


function getRequestConf() {
  if (!conf) {
    init();
  }
  return conf
}
module.exports = {
  getRequestConf: getRequestConf
};