const cow = require("./cow.js");
const dad = require("../commands/dad.js").dad;

let civs = [
  "AmeriKKKa",
  "Arabia",
//  "Australia",
  "Aztec",
  "Brazil",
  "China",
  "Egypt",
  "England",
  "France",
  "Germany",
  "Greece",
  "India",
  "Indonesia",
  "Japan",
//  "Khmer",
  "Kongo",
  "Macedon",
  "Norway",
//  "Nubia",
  "Poland",
  "Persia",
  "Rome",
  "Russia",
  "Scythia",
  "Spain",
  "Sumeria"
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

const usage =
  "usage: !civ [option]\nlist: list all civs\nroll: get random civ\nroll all: roll civs for everyone in channel";
module.exports = {
  name: ["civ", "next"], 
  usage,
  about: "rolls for Civ VI games",
  execute(argv, msg) {

    if (argv[0] === "!next"){

      const players = ['238850504493498370', '546865404425928727', '534748953024004103'];
      const person = msg.author.id;
      const pi = players.indexOf(person);
      if (pi === -1){
      	cow.say_dirty("whomst??", msg.channel);
	return;
      }
      const ni = (pi + 1) % players.length;
      console.log(ni);
      console.log(msg.client.users);
      const next = players[ni];
      //const next = msg.client.users.find("username", players[ni]);
//      if (next.id === undefined){
//     	cow.say_dirty("ya fucked up", msg.channel);
//        return;
//      }
      
      msg.channel.send(`it's <@${next}>'s turn`);
      dad().then(res => msg.channel.send(res));
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
        let members = msg.guild.members.filterArray(m => {
          return !m.user.bot;
        });
        let matches = [];
        for (let i = 0; i < members.length; i++) {
          matches.push(`${members[i].user.username}: ${civs[i]}`);
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
