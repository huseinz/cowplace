const mapping = {
	"Sir Flexalot": "238850504493498370",
	"capitalism is bad fellow gamers": "546865404425928727",
	"R8 my R8 M8": "534748953024004103",
	"Hot Bod Rod": "196117736089321474",
};

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

module.exports = {
	steam_webhook,
	start: (discord_client) => {
	  let steam_chan = discord_client.guilds.get('606156719084666943');
	  steam_chan = steam_chan.channels.get('618229340907503667');


	  steam_webhook.on('next_turn', (data) => {
		  console.log('event');
		  console.log(data);
		  if(data.discord_username === "everyone"){
			steam_chan.send(`it's ${data.steam_username}'s turn. steam->discord mapping needs update`);
		  }else{
		  steam_chan.send(`it's <@${data.discord_username}>'s turn`);
		}
	  });

	}
};

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

	const steam_username = req.body.value2;
	let discord_username = 'everyone';


	if(steam_username in mapping){
		discord_username = mapping[steam_username];
	}

	steam_webhook.emit('next_turn', {"steam_username":steam_username, "discord_username":discord_username});
	res.sendStatus(200);
});
