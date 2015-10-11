var request = require('request');
var validUrl = require('valid-url');
var http = require('http');

// module
var fetch = function() {
  this.checkUrlValidity = true;
};

fetch.prototype.getUrl = function(url, callback) {
  var self = this;
  (function(url, callback) {

    if (self.checkUrlValidity) {
      // check if url is valid
      self.isValidUrl(url, new function(err, isUrlValid) {
        if (err) {
          callback(err, null);
        }
        // if url is valid, fetch the url data
        self.fetchUrl(url, callback);
      });
    } else {
      self.fetchUrl(url, callback);
    }
  })(url, callback);
}

fetch.prototype.fetchUrl = function(url, callback) {
  var resultCallback = callback;
  request(url, function(error, response, html) {
    if (error) {
      resultCallback(err, null);
    } else if (!error && response.statusCode == 200) {
      resultCallback(null, html);
    } else {
      resultCallback(new Error('Non-200 status code', null));
    }
  });
}

fetch.prototype.isValidUrl = function(url, callback) {
  // first, verify if url format looks proper
  if (validUrl.isUri(url)) {
    console.log(url +
      'looks valid. Will ping it once to check if it\'s reachable for me!');

    // now check if url is accessible
    (function(url, callback) {
      options = {
          method: 'HEAD',
          host: url,
          port: 80,
          path: '/'
        },
        req = http.request(options, function(res) {
          res.end();
          var err = null;

          if (res.statusCode == 200) {
            callback(err, true);
          } else {
            err = new Error('url is not reachable');
            callback(err, false);
          }
        });
    })(url, callback);
  } else {
    callback(new Error('url is not a valid url format', false));
  }
}

module.exports = new fetch();
