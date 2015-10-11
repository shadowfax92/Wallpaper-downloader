var MultiThreadedDownloader = require('mt-files-downloader');

var downloader = function() {
  this.downloadUrl;
  this.filePath;
};


downloader.prototype.download = function() {
  var dl = new MultiThreadedDownloader();
  var dl = dl.download(this.downloadUrl, this.filePath);

  // Set retry options
  dl.setRetryOptions({
    maxRetries: 3, // Default: 5
    retryInterval: 1000 // Default: 2000
  });

  // Set download options
  dl.setOptions({
    threadsCount: 2, // Default: 2, Set the total number of download threads
    method: 'GET', // Default: GET, HTTP method
    port: 80, // Default: 80, HTTP port
    timeout: 5000, // Default: 5000, If no data is received, the download times out (milliseconds)
    range: '0-100', // Default: 0-100, Control the part of file that needs to be downloaded.
  });

  var num = this.filePath;

  var timer = setInterval(function() {
		if(dl.status == 0) {
			console.log('Download '+ num +' not started.');
		} else if(dl.status == 1) {
			var stats = dl.getStats();
			console.log('Download '+ num +' is downloading:');
			console.log('Download progress: '+ stats.total.completed +' %');
			console.log('Download speed: '+ MultiThreadedDownloader.Formatters.speed(stats.present.speed));
			console.log('Download time: '+ MultiThreadedDownloader.Formatters.elapsedTime(stats.present.time));
			console.log('Download ETA: '+ MultiThreadedDownloader.Formatters.remainingTime(stats.future.eta));
		} else if(dl.status == 2) {
			console.log('Download '+ num +' error... retrying');
		} else if(dl.status == 3) {
			console.log('Download '+ num +' completed !');
		} else if(dl.status == -1) {
			console.log('Download '+ num +' error : '+ dl.error);
		} else if(dl.status == -2) {
			console.log('Download '+ num +' stopped.');
		} else if(dl.status == -3) {
			console.log('Download '+ num +' destroyed.');
		}

		console.log('------------------------------------------------');

		if(dl.status === -1 || dl.status === 3 || dl.status === -3) {
			clearInterval(timer);
			timer = null;
		}
	}, 1000);

  // event handlers
  dl.on('end', function() {
		console.log('EVENT - Download '+ num +' finished !');

		console.log(dl.getStats());
	});
  dl.on('error', function() {
		console.log('EVENT - Download '+ num +' error !');
		console.log(dl.error);
	});
  dl.on('retry', function() {
		console.log('EVENT - Download '+ num +' error, retrying...');
	});

	dl.on('stopped', function() {
		console.log('EVENT - Download '+ num +' stopped...');
	});

	dl.on('destroyed', function() {
		console.log('EVENT - Download '+ num +' destroyed...');
	});

  dl.start();
}

module.exports = new downloader();
