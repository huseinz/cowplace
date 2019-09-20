//globals 
let steam_usernames = null;
let discord_ids = null;
let user_map = null;
let steam_chan = null;
let latest_turn = null;
const reminder_interval = 70;

require('log-timestamp');
const port = 3000;
const emitter = require("events").EventEmitter;
const discord_hook = new emitter();
const db = require("./db.js");
const dad = require("../commands/dad.js").dad;

const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const server = require("http").Server(app);
const helmet = require("helmet");
const scheduler = require("node-schedule");

update_steam_mapping = async new_steamname => {
  let lastN = await db.lastN('civ6_turns', steam_usernames.length - 1);
  if(lastN.length !== steam_usernames.length - 1){
	console.log("res.length bad!!!!!!");
	return;
  }
  lastN = lastN.map(e => {return e.value2});
  console.log(lastN);
 
  let changed = steam_usernames.filter(e => !lastN.includes(e));
  if(changed.length != 1){
  	console.log('UPDATE_STEAM_MAPPING filter failed');
	return;
  }
  changed = changed[0];
  db.findAll('steammap').then(res => {
    if(res.length != 1){
    	console.log('UPDATE_STEAM_MAPPING db lookup failed');
	return;
    }
    res = res[0];
    res[changed] = new_steamname;
    return db.save('steammap', res);
  }).then(res => console.log(res)).catch(err => console.log(err)); 
}
module.exports = {
  discord_hook,
  latest_turn,
  start: discord_client => {
    // init user mapping
    db.findOne('steammap')
	.then(res => {
	  delete res._id;
	  user_map = res;
	  steam_usernames = Object.keys(user_map);
	  discord_ids = Object.values(user_map);
		//  update_steam_mapping('dick');
	})
	.catch(err => console.log(err));
    
    // init latest turn
    db.findOne("civ6_latest_turn", { _id: "latest_turn" })
      .then(res => {
        latest_turn = res;
      })
      .catch(err => console.log(err));

    // init discord channel
    steam_chan = discord_client.guilds.get("606156719084666943");
    steam_chan = steam_chan.channels.get("618229340907503667");

    // set up post request hook
    discord_hook.on("next_turn", data => {
      if(data.discord_id === user_map['Sir Flexalot']){
      	steam_chan.send(`🇷🇺 it's <@${data.discord_id}>'s turn 🇷🇺`);
      }
      if(data.discord_id === user_map['capitalism is bad fellow gamers']){
      	steam_chan.send(`🇯🇵 it's <@${data.discord_id}>'s turn 🇯🇵`);
      }
      if(data.discord_id === user_map['R8 my R8 M8']){
      	steam_chan.send(`🇪🇸 it's <@${data.discord_id}>'s turn 🇪🇸`);
      }
      dad().then(res => steam_chan.send(res));
    });

    // turn reminder function
    turn_reminder = fire_time => {
      if (latest_turn === null) return;
      const latest_turn_timestamp = new Date(latest_turn.timestamp);
      const elapsed_ms = fire_time - latest_turn_timestamp;
      const elapsed_minutes = Math.floor(elapsed_ms / 1000 / 60);
      if (elapsed_minutes >= reminder_interval) {
        const discord_id = user_map[latest_turn.value2];
        steam_chan.send(
          `Turn reminder: it has been ${elapsed_minutes} minutes since <@${discord_id}>'s turn`
        );
      }
    };
    const j = scheduler.scheduleJob("40 20-23 * * 1-5", fire_time => turn_reminder(fire_time));
  }
};

app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:8080");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With, Content-Type, Accept"
  );
  next();
});

//pre-flight requests
app.options("*", function(req, res) {
  res.send(200);
});

server.listen(port, "0.0.0.0", err => {
  if (err) {
    throw err;
  }
  /* eslint-disable no-console */
  console.log("steam endpoint enabled :)");
});
app.get("/butterboys", (req, res) => {
  res.sendStatus(200);
});

app.post("/butterboys", (req, res) => {
  console.log(req.body);

  let turn = req.body;
  const steam_username = turn.value2;
  let discord_id = user_map[steam_username];

  if (discord_id === undefined){
	steam_chan.send(`${steam_username} not recognized, updating steam->discord mapping`);
  }
  // call post message handler
  discord_hook.emit("next_turn", {
    steam_username,
    discord_id
  });

  res.sendStatus(200);

  turn.timestamp = Date.now();
  turn.discord_id = discord_id;

  db_callback = res => {
    console.log(res);
  };
  // save turn to db
  db.save("civ6_turns", turn)
    .then((res) => {
	  // update latest turn
	  latest_turn = turn;
	  turn._id = "latest_turn";
	  db.save("civ6_latest_turn", turn, { _id: "latest_turn" })
	    .then()
	    .catch(db_callback);
          }
    )
    .catch(db_callback);

});
