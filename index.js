var fetch = require('./src/fetch');
var downloader = require('./src/downloader');
var fs = require('fs');
var cheerio = require('cheerio');
var url = require('url');
var path = require('path');

// global variables
sample_url =
  'http://www.allmacwallpaper.com/retina-macbook-pro-wallpapers/Views/1';
base_url = 'http://www.allmacwallpaper.com/';

// init
if (process.argv.length > 2) {
  download_path = process.argv[2];
}
else {
  console.error("Invalid download path");
  return;
}

getUrl(sample_url);

// functions
function getUrl(url) {
  fetch.checkUrlValidity = false;
  fetch.getUrl(url, function(err, html) {
    if (err) {
      console.log('Error while fetching url = ' + url +
        '\nError: ' + err.message);
      return;
    }
    getWallpaperLinks(html);
  });
}

function getWallpaperLinks(html) {
  $ = cheerio.load(html);

  $('.lists .clearfix a').each(function() {
    var href = $(this).attr('href');
    var wallpaperUrl = url.resolve(base_url, href);
    console.log('Wallpaper url : ' + wallpaperUrl);
    fetchWallpaperHtml(wallpaperUrl);
  });
}

function fetchWallpaperHtml(wallpaperLink) {
  fetch.checkUrlValidity = false;
  fetch.getUrl(wallpaperLink, function(err, html) {
    if (err) {
      console.log('Error while downloading wallpaperUrl = ' + wallpaperLink +
        '\nError: ' + err.message);
      return;
    }
    extractWallpaperDownloadUrl(html);
  });
}

function extractWallpaperDownloadUrl(html) {
  $ = cheerio.load(html);
  var title = $('.pageHeader .title').text();

  $('.downloadList a').each(function() {
    var imageName = $(this).text();
    if (imageName === 'Retina MacBook Pro 15-inch (2880x1800)') {
      var downloadHref = $(this).attr('href');
      var downloadUrl = url.resolve(base_url, downloadHref);
      console.log('Download wallpaper url : ' + downloadUrl);
      downloadWallpaper(title, downloadUrl);
    }
  });
}

function downloadWallpaper(title, downloadLink) {
  // construct file path
  var urlParse = url.parse(downloadLink);
  var fileExt = '.jpg';
  if (urlParse.pathname) {
    fileExt = path.extname(urlParse.pathname);
  }
  var fileName = title.replace(/ /g,"_");
  var filePath = path.normalize(download_path + '/' + fileName + fileExt);
  console.log("Normalized filePath = " + filePath);

  // start downloading the file;
  /*var fileDownloader = new downloader.downloader();
  fileDownloader.filePath = filePath;
  fileDownloader.downloadUrl = downloadLink;
  fileDownloader.download();*/
  downloader.filePath = filePath;
  downloader.downloadUrl = downloadLink;
  downloader.download();
}
