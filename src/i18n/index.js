
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
var L10nFacotry = {
  create(settings) {
    return new Localization(settings);
  }
}
var locale = "";
var locales = "";

var Localization = (settings = {}) => {
  var source = {};

  return {
    init() {
      var conf = {};
      if (settings.isLocal) {
        conf = require(`./i18nConf/conf.json`);
      } else {
        conf = require(`../../../../e_conf/i18n/conf.json`)
      }
      locale = locale || getQueryParams().locale || conf.default;
      locales = locales || conf.locales;
      if (!locales || !locale) {
        return
      }
      if (settings.isLocal) {
        source = require(`./i18nConf/locale_${locales[locale]}.json`);
      } else {
        source = require(`../../../../e_conf/i18n/locale_${locales[locale]}.json`)
      }
      return this;
    },
    get(path) {
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
}
export default L10nFacotry