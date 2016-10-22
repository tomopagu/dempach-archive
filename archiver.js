var path = require('path');
var request = require('request');

var AWS = require('aws-sdk');
var s3 = new AWS.S3();

var archiver = function () {
	var url = 'http://tunein.com/radio/DEMPA-ch-TOKYO-DEMPA-INTERNATIONAL-p762248/';

	console.log('Starting Archive: ' + url);

	request(url, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			var re = /"StreamUrl":"([a-z.A-Z/?=0-9&%]*)/g;
			var streamurl = re.exec(body)[1];

			console.log('Got StreamUrl: ' + streamurl);

			request('http:' + streamurl, function (error, response, body) {
				body = body.replace('{ "Streams": [', '');
				body = body.replace('] }', '');

				var json = JSON.parse(body);
				var directMP3 = json.Url;
				var filename = path.basename(directMP3);

				console.log('Got the DirectMP3 URL: ' + directMP3);

				request(directMP3, function(error, response, body) {
					if (error || response.statusCode !== 200) { 
						console.log("failed to get stream");
						console.log(error);
					} else {
						console.log('Starting to upload to s3');
						var params = {
							Bucket: 'pagu-dempach-archiver',
							Key: `shows/${filename}`,
							ACL: 'public-read',
							Body: body,
						};
						s3.upload(params, function(error, data) { 
							if (error) {
								console.log("error downloading image to s3");
							} else {
								console.log("success uploading to s3");
							}
						}); 
					}   
				});
			});
		}
	});
};

module.exports = archiver;
