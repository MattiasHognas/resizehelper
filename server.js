var express = require('express');
var mongoose = require('mongoose');
var uuid = require('node-uuid');
var bodyParser = require('body-parser');
var app = express();
mongoose.connect('mongodb://localhost/resizehelper_localdev');

app.use(bodyParser.json());

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

function respondToSave(response, err, model) {
	if (err) {
		console.log(err);
		response.status(500).send({ error: err });
	} else if (!model) {
		console.log('model not found');
		response.status(500).send({ error: 'model not found' });
	} else {
		console.log('saved:' + model);
		response.status(200).send(model);
	}
}

app.post('/load/:id', function(request, response, next) {
	var id = request.params.id;
	UsageModel.findOne({ '_id': id }, usage, function(err, model) {
		if (err) {
			console.log(err);
			response.status(500).send({ error: err });
		} else if (!model) {
			console.log('model not found');
			response.status(500).send({ error: 'model not found' });
		} else {
			console.log('loaded:' + model);
			response.status(200).send(model);
		}
	});
});

app.post('/save', function(request, response, next) {
	var values = request.body;
	if (!values) {
		console.log('no usage posted');
		response.status(500).send({ error: 'no usage posted' });
	}
	var usage = new UsageModel({
		images: values.images,
		flagedDevices: values.flagedDevices
	});
	if (values.id) 
		UsageModel.findOneAndUpdate({ '_id': values.id }, usage, function(err, model) {
			respondToSave(response, err, model)
		});
	else {
		usage.save(function(err, model) {
			console.log(model._id);
			respondToSave(response, err, model)
		});
	}
});

var SizeSchema = mongoose.Schema({
	_id: { type: String, default: uuid.v1 },
    name: String,
	width: Number
});
var BreakpointSchema = mongoose.Schema({
	_id: { type: String, default: uuid.v1 },
	type: Number,
	breakWidth: Number,
	displayWidth: Number,
	unit: String
});
var ImageSchema = mongoose.Schema({
	_id: { type: String, default: uuid.v1 },
    name: String,
	sizes: [SizeSchema],
	breakpoints: [BreakpointSchema]
});
var DeviceSchema = mongoose.Schema({
	_id: { type: String, default: uuid.v1 },
	name: String,
	flagged: String
});
var UsageSchema = mongoose.Schema({
	_id: { type: String, default: uuid.v1 },
	images: [ImageSchema],
	flagedDevices: [DeviceSchema],
});
var UsageModel = mongoose.model('Usage', UsageSchema);