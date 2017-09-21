var _ = require('lodash');
var format = require('date-fns/format');

var express = require('express');
var router = express.Router();

var AWS = require('aws-sdk');
var s3 = new AWS.S3();
var params = {
	Bucket: 'pagu-dempach-archiver',
	Prefix: 'shows'
};

var archiver = require('./../archiver');

/* GET home page. */
router.get('/', function (req, res, next) {
	s3.listObjectsV2(params, function(err, data) {
		if (err) console.log(err, err.stack); // an error occurred
		else {
			var shows = [];
			_.forEach(data.Contents, function (fileData) {
				if (fileData.Key === 'shows/') {
					// Don't Add to Shows
				} else {
					var file = fileData.Key;
					var date = file.replace('.mp3', '');
					date = date.split('_')[1];
					date = format(date, 'MMMM Do YYYY');
					var show = {
						date: date,
						link: `https://s3-eu-west-1.amazonaws.com/${params.Bucket}/${file}`,
					};
					shows.push(show);
				}
			});

			shows.reverse();

			res.render('index', { shows: shows });
		}
	});
});

router.get('/archive', function (req, res, next) {
	archiver();
	res.render('archiver');
})

module.exports = router;
