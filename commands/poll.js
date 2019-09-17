let polls = [];
let currentpoll = undefined;

require('log-timestamp');
const MongoClient = require("mongodb").MongoClient;
const MONGO_URL = "mongodb://localhost:27017/cowplace";

fetchPolls = () => {
  MongoClient.connect(MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true  }, (err, database) => {
    if (err) console.log(err);
    var db = database.db();
    db.collection("polls")
      .find({})
      .toArray((err, items) => {
        polls = items;
      });
  });
  currentpoll = polls[polls.length - 1];
};

savePoll = poll => {
  MongoClient.connect(MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true }, (err, database) => {
    if (err) console.log(err);
    var db = database.db();
    db.collection("polls").save(poll);
  });
  fetchPolls();
};
showPoll = (poll, n) => {
  if (!poll) {
    msg.reply("no polls active");
    return;
  }
  let s = `\n${n}. ${poll.title}\n`;
  for (let c of poll.choices) {
    s = s.concat(`• ${c.text} : ${c.votes}\n`);
  }
  return s;
};

fetchPolls();

module.exports = {
  name: "poll",
  usage: "",
  about: "",
  execute(argv, msg) {
    if (argv.length <= 1) {
      msg.reply('usage: !poll "poll title" "choice"...');
      return;
    }

    if (argv[1] === "show") {
      fetchPolls();
      console.log(polls);
      msg.reply(showPoll(currentpoll, polls.length));
      return;
    }
    if (cmd[0] === "!vote") {
      if (!currentpoll) {
        msg.reply("no polls active");
        return;
      }
      if (cmd.length === 1) {
        msg.reply("usage: !vote choice");
        return;
      }

      let s = cmd.slice(1).join(" ");
      for (let c of currentpoll.choices) {
        console.log(c);
        if (c.text === s) {
          c.votes = c.votes + 1;
          savePoll(currentpoll);
          msg.reply(`${msg.author.username} voted for ${c.text}`);
          return;
        }
      }
    }

    let newpoll = { title: argv[1], choices: [] };

    const args = argv.slice(2);
    for (let opt of args) {
      newpoll.choices.push({ text: opt, votes: 0 });
    }
    polls.push(newpoll);
    console.log(polls);
    msg.reply(showPoll(currentpoll, polls.length));
    savePoll(newpoll);
    currentpoll = polls[polls.length - 1];
  }
};
