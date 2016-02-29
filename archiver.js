var fs = require('fs');
var path = require('path');
var request = require('request');

var archiver = function () {
	var url = 'http://tunein.com/radio/DEMPA-ch-TOKYO-DEMPA-INTERNATIONAL-p762248/';

	console.log('Starting Archive: ' + url);

	request(url, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			var re = /"StreamUrl":"([a-z.A-Z/?=0-9&%]*)/g;
			var streamurl = re.exec(body)[1];

			console.log('Got StreamUrl: ' + streamurl);

			request('http:' + streamurl, function (error, response, body) {
				body = body.replace('( {"Streams": [', '');
				body = body.replace('] });', '');

				var json = JSON.parse(body);
				var directMP3 = json.Url;
				var filename = path.basename(directMP3);

				console.log('Got the DirectMP3 URL: ' + directMP3);

				var downloadStream = fs.createWriteStream('./public/shows/' + filename);
				request(directMP3).pipe(downloadStream);
				downloadStream.on('finish', function () {
					console.log('Completed!');
				});
			});
		}
	});
};

module.exports = archiver;
