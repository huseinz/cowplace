const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const server = require('http').Server(app);
const port = 3000;
const helmet = require('helmet');
const emitter = require('events').EventEmitter;
let steam_webhook = new emitter();

app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
	res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8080');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
	res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Accept');
	next();
});

//pre-flight requests
app.options('*', function(req, res) {
	res.send(200);
});

server.listen(port, '0.0.0.0', (err) => {
	if (err) {
		throw err;
	}
	/* eslint-disable no-console */
	console.log('steam endpoint enabled :)');
});
app.get('/butterboys', (req, res) => {
	console.log('get');
//	console.log(req);
	res.sendStatus(200);
});
app.post('/butterboys', (req, res) => {
	console.log('post');
	console.log(req.body);
	steam_webhook.emit('next_turn', req.body);
	res.sendStatus(200);
});
module.exports = server;
