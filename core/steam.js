const steam_usernames = ["Sir Flexalot", "capitalism is bad fellow gamers", "R8 my R8 M8", "Hot Bod Rod"];
const discord_ids = ["238850504493498370","546865404425928727","534748953024004103","196117736089321474"];
let user_map = {};
steam_usernames.forEach((key, idx) => user_map[key] = discord_ids[idx]);

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

let latest_turn = null;
module.exports = {
  discord_hook,
  latest_turn,
  start: discord_client => {

    // init latest turn
    db.findOne("civ6_latest_turn", { _id: "latest_turn" })
      .then(res => {
        latest_turn = res;
      })
      .catch(err => console.log(err));

    // init channel
    let steam_chan = discord_client.guilds.get("606156719084666943");
    steam_chan = steam_chan.channels.get("618229340907503667");

    // set up post request hook
    discord_hook.on("next_turn", data => {
 //     console.log("event");
 //     console.log(data);
      if (data.discord_id === data.steam_username){
        steam_chan.send(
          "steam username changed, steam->discord user_map needs update"
        );
      }

      if(data.discord_id === user_map['Sir Flexalot']){
      	steam_chan.send(`🇷🇺 it's <@${data.discord_id}>'s turn 🇷🇺`);
      }
      if(data.discord_id === user_map['capitalism is bad fellow gamers']){
      	steam_chan.send(`🇯🇵 it's <@${data.discord_id}>'s turn 🇯🇵`);
      }
      if(data.discord_id === user_map['R8 my R8 M8']){
      	steam_chan.send(`🇪🇸 it's <@${data.discord_id}>'s turn 🇪🇸`);
      }
//      steam_chan.send(`it's <@${data.discord_id}>'s turn`);
      dad().then(res => steam_chan.send(res));
    });

    // turn reminder function
    turn_reminder = fire_time => {
      if (latest_turn === null) return;
      const latest_turn_timestamp = new Date(latest_turn.timestamp);
      const elapsed_ms = fire_time - latest_turn_timestamp;
      const elapsed_minutes = Math.floor(elapsed_ms / 1000 / 60);
      if (elapsed_minutes > 90) {
        const steam_username = latest_turn.value2;
        let discord_id = steam_username;
        if (steam_username in user_map) {
          discord_id = user_map[steam_username];
        }
        steam_chan.send(
          `Turn reminder: it has been ${elapsed_minutes} minutes since <@${discord_id}>'s turn`
        );
      }
    };
    const j = scheduler.scheduleJob("0 20-23 * * 1-5", fire_time => turn_reminder(fire_time));
  }
};

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
  console.log("post");
  console.log(req.body);

  let turn = req.body;
  const steam_username = turn.value2;
  let discord_id = steam_username;

  if (steam_username in user_map) {
    discord_id = user_map[steam_username];
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
