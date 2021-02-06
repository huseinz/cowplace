const cow = require("./cow.js");
const dad = require("../commands/dad.js").dad;
const ObjectID = require('mongodb').ObjectID
const SteamDiscordUser = require("../models/steam_user_map.js").SteamDiscordUser;

let civs = [
  "AmeriKKKa",
  "Arabia",
  "Australia",
  "Aztec",
  "Brazil",
  "Canada",
  "China",
  "Cree",
  "Dutch",
  "Egypt",
  "England",
  "France",
  "Georgia",
  "Germany",
  "Greece",
  "Hungary",
  "Inca",
  "India",
  "Indonesia",
  "Japan",
  "Khmer",
  "Kongo",
  "Korea",
  "Macedon",
  "Mali",
  "Maori",
  "Mapuche",
  "Mongolia",
  "Norway",
  "Nubia",
  "Ottoman",
  "Poland",
  "Persia",
  "Phoenecia",
  "Rome",
  "Russia",
  "Scotland",
  "Scythia",
  "Spain",
  "Sumeria",
  "Sweden",
  "Zulu"
];



shuffleCivs = () => {
  var m = civs.length,
    t,
    i;

  while (m) {
    i = Math.floor(Math.random() * m--);
    t = civs[m];
    civs[m] = civs[i];
    civs[i] = t;
  }
};


get_next_user = async msg_discord_id => {
  var msg_user = await SteamDiscordUser.findOne({discord_id: msg_discord_id});
  var next_user = await SteamDiscordUser.findOne({discord_id: msg_user.next});
  return next_user;
}


const usage =
  "usage: !civ [option]\nlist: list all civs\nroll: get random civ\nroll all: roll civs for everyone in channel";
module.exports = {
  name: ["civ", "next"], 
  usage,
  about: "rolls for Civ VI games",
  execute(argv, msg) {

    if (argv[0] === "!next"){

      get_next_user(msg.author.id).then( user => {
	 msg.channel.send(`${user.civ_icon} it's <@${user.discord_id}>'s turn ${user.civ_icon}`);
         dad().then(res => msg.channel.send(res));
      }); 
      return;
    }
    if (argv.length == 1) {
      cow.say_dirty(usage, msg.channel);
    }
    if (argv[1] === "roll") {
      let s = "";
      shuffleCivs();
      shuffleCivs();
      shuffleCivs();
      if (argv.includes("all")) {
	let members = ['zubir', 'drek', 'nick', 'rod'];
        let matches = [];
        for (let i = 0; i < members.length; i++) {
          matches.push(`${members[i]}: ${civs[i]}`);
        }
        s = matches.join("\n");
      } else {
        s = civs[0];
      }
      cow.say_dirty(s, msg.channel);
    }
    if (argv[1] === "list") {
      cow.say(civs.join(", "), msg.channel);
    }
  }
};
