var getQueryParams = function(queryString) {
  var query = (queryString || window.location.search).substring(1);
  if (!query) {
    return false;
  }
  var pairs = query.split('&');
  var result = {};
  _.each(pairs, function(params) {
    var p = params.split('=');
    var pair = {};
    result[p[0]] = p[1]
  })
  return result;
}

var source = {};
var Localization = {
  init: () => {
    console.log("i18n, I'm initilizaing!");
    var localeMap = {
      "zh": "zh_cn",
      "zh_cn": "zh_cn",
      "en": "en_us",
      "en_us": "en_us"
    }
    var conf = require("../../../../e_conf/i18n/conf.json");
    var locale = getQueryParams().locale || conf.default;
    var locales = conf.locales;
    if (!locales || !locale) {
      return
    }
    var i18nConf = require(`../../../../e_conf/i18n/locale_${localeMap[locale]}.json`);
    source = i18nConf;
  },
  get: function(path) {
    var i, len, next, p, pathes;
    pathes = path.split(".");
    next = source;
    for (i = 0, len = pathes.length; i < len; i++) {
      p = pathes[i];
      next = next[p];
    }
    return next;
  }
}
// Localization.init()
export default Localization