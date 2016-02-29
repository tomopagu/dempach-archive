var fs = require('fs');
var _ = require('lodash');
var moment = require('moment');

var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
	fs.readdir('./public/shows', function (err, files) {
		var shows = [];

		_.forEach(files, function (file) {
			if (file !== '.DS_Store' || file !== '.gitignore') {
				var date = file.replace('.mp3', '');
				date = date.split('_')[1];
				date = moment(date).format('MMMM Do YYYY');
				var show = {
					date: date,
					link: file,
				};
				shows.push(show);
			}
		});

		shows.reverse();

		res.render('index', { shows: shows });
	});
});

module.exports = router;
