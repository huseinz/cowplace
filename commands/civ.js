const cow = require("./cow.js");

let civs = [
  "AmeriKKKa",
  "Arabia",
  "Australia",
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
  "Khmer",
  "Kongo",
  "Macedon",
  "Norway",
  "Nubia",
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
  name: "civ",
  usage,
  about: "rolls for Civ VI games",
  execute(argv, msg) {
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
