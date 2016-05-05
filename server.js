var express = require('express');
var app = express();

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/dist'));

app.get('/', function(request, response) {
	response.render('dist/index');
});

/*
app.get('/egg', function(request, response) {
	response.sendFile(__dirname + '/dist/egg.html');
})*/

app.listen(app.get('port'), function() {
	console.log('Node app is running on port', app.get('port'));
});