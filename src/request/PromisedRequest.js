import superagent from 'superagent'
import Promise from 'bluebird'
import Spinner from '../spinner'
var PromisedRequest = superagent.Request;
Promise.config({
  // Enable cancellation.
  cancellation: true
});
var XMLDOMParser = DOMParser ? new DOMParser() : "";
PromisedRequest.prototype.promise = function() {
  var req = this;
  var error = {};
  return new Promise(function(resolve, reject, onCancel) {
    req.end(function(err, res) {
      if (req.options.loadingMask) {
        Spinner.hide();
      }
      if (typeof res !== "undefined" && res.status >= 400) {
        var msg = 'cannot ' + req.method + ' ' + req.url + ' (' + res.status + ')';
        error.message = msg;
        error.status = res.status;
        error.body = res.body;
        error.res = res;
        reject(error);
      } else if (err) {
        reject(err);
      } else {
        if (!res.body && res.text && (res.req.getHeader("accept") === 'application/xml')) {
          res.body = XMLDOMParser.parseFromString(res.text, "application/xml");
        }
        resolve(res);
      }
    });
    onCancel(function() {
      req.abort();
    });
  });
}

PromisedRequest.prototype.then = function() {
  var promise = this.promise();
  return promise.then.apply(promise, arguments);
};

export default superagent