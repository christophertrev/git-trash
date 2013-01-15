var express = require('express'),
	app = express(),
	jade = require('jade');

app.set('views', __dirname . '/views');
app.set('view engine', 'jade');

app.get('/', function (req, res) {
	var body = 'Hello World';
	  res.setHeader('Content-Type', 'text/plain');
	  res.setHeader('Content-Length', body.length);
	  res.end(body);


});

app.get('/about', function (req, res) {
	res.sendfile(__dirname + '/public/about.html');	
});

app.get('/git', function (req, res) {
	res.render('git');
});

app.listen(3000);
console.log('Listening on port 3000');