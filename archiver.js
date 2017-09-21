var format = require('date-fns/format');

var path = require('path');
var request = require('request');
var stream = require('stream');

var AWS = require('aws-sdk');

/**
 * These 2 functions were taken from https://github.com/JosephusYang/s3-transload
 * All credit goes to him for these!
 * I just made a slight modification in the urlToS3 function to pass my whole params rather than just bucket & key
 */
var uploadToS3 = function uploadFromStream(s3, cb) {
	var pass = new stream.PassThrough();
	var params = { Body: pass };
	s3.upload(params).
		on('httpUploadProgress', function(evt) { console.log(evt); }).
		send(function(err, data) { 
			console.log(err, data); 
			if (err) cb(err, data);
			cb(null, data.Location);// data.Location is the uploaded location
		});
	return pass;
};
var urlToS3 = function(url, params, callback) {
	var s3 = new AWS.S3({ params: params });
	var req = request.get(url);
	req.pause();
	req.on('response', function(resp) {
		if (resp.statusCode == 200) {
			req.pipe(uploadToS3(s3, callback));
			req.resume();
		} else {
			callback(new Error('request item did not respond with HTTP 200'));
		}
	});
}

var archiver = function () {
	var baseurl = 'http://aod.tokyofmworld.leanstream.co/storage/tunein_ondemand/';
	var today = format(new Date(), 'YYYYMMDD');
	var filename = `dempa_${today}.mp3`;
	var url = `${baseurl}${filename}`;

	var params = {
		Bucket: 'pagu-dempach-archiver',
		Key: `shows/${filename}`,
		ACL: 'public-read',
		ContentType: 'audio/mpeg',
	};

	urlToS3(url, params, function(error, data) {
		if (error) return console.log(error);
		console.log("The resource URL on S3 is:", data);
	});
};

module.exports = archiver;
