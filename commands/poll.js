let polls = [];
let currentpoll = undefined;

require('log-timestamp');
const MongoClient = require("mongodb").MongoClient;
const MONGO_URL = "mongodb://localhost:27017/cowplace";
let guild = null;

loadPolls = (items) => {
  polls = items;
  console.log(polls);
}

fetchPolls = () => {
  MongoClient.connect(MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true  }, (err, database) => {
    if (err) console.log(err);
    var db = database.db();
    db.collection("polls")
      .find({})
      .toArray((err, items) => {loadPolls(items);});
  });
  currentpoll = polls[polls.length - 1];
};

savePoll = (poll) => {
  MongoClient.connect(MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true }, (err, database) => {
    if (err) console.log(err);
    var db = database.db();
    db.collection("polls").save(poll);
  });
  fetchPolls();
};

showPolls = () => {
  var text = 'Polls';
  for(const poll of polls){
    let s = `\n${poll.title}\n`;
    if(poll.choices && Symbol.iterator in Object(poll.choices)){
      console.log(poll.choices);
      for (let c of poll.choices) {
        s = s.concat(`• ${c.text} : ${c.votes}\n`);
      }
      console.log(s);
    }
    text = text.concat(s);
  }
  return text;
};

prefixEmoji = (str, emoji = null) => {
  if(!emoji){
    let emojis = guild.emojis.array();
    emoji = emojis[Math.floor(Math.random() * emojis.length)];
  }
  return {str: emoji.toString() + ' ' + str, emoji};
}

module.exports = {
  name: "poll",
  usage: "",
  about: "",
  execute(argv, msg) {
    guild = msg.guild;
    fetchPolls();
    if (argv.length > 1 && argv[1] === "help"){
      msg.reply('usage: !poll "poll title" "choice"...');
      return;
    }
    if (argv.length > 1 && argv[1] === "list"){
      msg.reply(showPolls());
      return;
    }
    if (argv.length > 2){
      const title = argv[1];
      const options = argv.slice(2);
      console.log(title, options);
      
      let message = title + '\n';
      let result = prefixEmoji(title);
	    msg.channel.send(result.str);
    }    
  }
};
