# DempaCh Archiver

A site that will scrape the Tunein Site for International DempaCh (http://tunein.com/radio/DEMPA-ch-TOKYO-DEMPA-INTERNATIONAL-p762248/), download the latest show and show an archive of previous shows.

Currently it will scrape the site at 22:00 BST on Monday every week so should get it every week, I'll adjust it if need be.

The archiver script goes to the Tunein Site and parses it for the StreamUrl, when it finds that it does a request on that to get the direct link to the mp3. This appears to be something like: `http://podcasts.tfm.co.jp/tunein_ondemand/dempa_{yyyymmdd}.mp3`. Once it gets that it uploads it to Amazon S3 to serve on the site.
