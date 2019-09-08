const mapping = {
	"Sir Flexalot": "238850504493498370",
	"capitalism is bad fellow gamers": "546865404425928727",
	"R8 my R8 M8": "534748953024004103",
	"Hot Bod Rod": "196117736089321474",
};

const port = 3000;
const emitter = require('events').EventEmitter;
const discord_hook = new emitter();
const db = require('./db.js');

const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const server = require('http').Server(app);
const helmet = require('helmet');
const scheduler = require('node-schedule');

app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
	res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8080');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
	res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Accept');
	next();
});



let latest_turn = null;
module.exports = {
	discord_hook,
	latest_turn,
	start: (discord_client) => {
	  
	  db.findOne('civ6', {_id:'latest_turn'})
	  .then(res => {latest_turn = res;})
	  .catch(err => console.log(err));

	  let steam_chan = discord_client.guilds.get('606156719084666943');
	  steam_chan = steam_chan.channels.get('618229340907503667');


	  discord_hook.on('next_turn', (data) => {
		  console.log('event');
		  console.log(data);
		  if(data.discord_username === "everyone"){
			steam_chan.send(`it's ${data.steam_username}'s turn. steam->discord mapping needs update`);
		  }else{
		  steam_chan.send(`it's <@${data.discord_username}>'s turn`);
		}
	  });
	
	turn_reminder = (fire_time) => {
		if (latest_turn === null)
			return;
		const latest_turn_timestamp = new Date(latest_turn.timestamp);
		const elapsed_ms = fire_time - latest_turn_timestamp;
		console.log('civ 6 turn elapsed ms: ' + elapsed_ms);
		if(elapsed_ms > 1000 * 60 * 60){
			const steam_username = latest_turn.value2;
			let discord_username = steam_username;
			if(steam_username in mapping){
				discord_username = mapping[steam_username];
			}
			const minutes = Math.floor(elapsed_ms / 1000 / 60);
			steam_chan.send(`Turn reminder: it has been ${minutes} minutes since <@${discord_username}>'s turn`);
		}
	}
	const j = scheduler.scheduleJob('0 20 * * *', function(fire_time){
		turn_reminder(fire_time);
	});
	const k = scheduler.scheduleJob('0 21 * * *', function(fire_time){
		turn_reminder(fire_time);
	});
	const l = scheduler.scheduleJob('0 22 * * *', function(fire_time){
		turn_reminder(fire_time);
	});
	const m = scheduler.scheduleJob('0 23 * * *', function(fire_time){
		turn_reminder(fire_time);
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
	res.sendStatus(200);
});

app.post('/butterboys', (req, res) => {
	console.log('post');
	console.log(req.body);

	let turn = req.body;
	const steam_username = turn.value2;
	let discord_username = 'everyone';

	if(steam_username in mapping){
		discord_username = mapping[steam_username];
	}

	discord_hook.emit('next_turn', 
		{"steam_username":steam_username, 
		"discord_username":discord_username});

	res.sendStatus(200);

	turn.timestamp = Date.now();
	turn._id = 'latest_turn';
	latest_turn = turn;

	db_callback = res => {
		console.log(res);
	};
	db.save('civ6', turn, {_id: 'latest_turn'}).then(db_callback);
});
