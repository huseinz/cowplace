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

const SteamDiscordUser = require("../models/steam_user_map.js").SteamDiscordUser;

//debounce shitty webhook api
global.ts_last_request = new Date();

module.exports = {
  discord_hook,
  latest_turn,
  start: async discord_client => {
    // init discord channel
    steam_chan = discord_client.guilds.get("606156719084666943");
    steam_chan = steam_chan.channels.get("618229340907503667");

    // set up post request hook
    discord_hook.on("next_turn", steam_id => {

      var ts_elapsed = (new Date()) - global.ts_last_request;
      global.ts_last_request = new Date();
      if (ts_elapsed < 500) {
      	return;
      }
      SteamDiscordUser.findOne({steam_id: steam_id}).then(user => {
      	steam_chan.send(`${user.civ_icon} it's <@${user.discord_id}>'s turn ${user.civ_icon}`);
        dad().then(res => steam_chan.send(res));
      });
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

app.use(express.static('files'));
app.use('/files', express.static('/files'));
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

   discord_hook.emit("next_turn", steam_username);

  res.sendStatus(200);

});
