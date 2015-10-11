var mtd = require('mt-downloader');

var downloader = function() {
  this.downloadUrl;
  this.filePath;
};

downloader.options = {
  count: 8,
  method: 'GET',
  port: 80,
  range: '0-100',

  onStart: function(meta) {
    console.log('Download Started for Url = ' + this.downloadUrl + '\nMeta = ' + meta);
  },

  onEnd: function(err, result) {
    if (err) {
      console.error('Error while downloading Url = ' + this.downloadUrl + '\nError: ' + err);
    }
    console.log('Download Completed for Url = ' + this.downloadUrl);
  }
};


downloader.prototype.download = function() {
  var multiThreadDownloader = new mtd(this.filePath, this.downloadUrl, this.options);
  multiThreadDownloader.start();
}

module.exports = new downloader();
