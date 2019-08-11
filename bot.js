const Discord = require("discord.js");
const client = new Discord.Client();
const fetch = require("node-fetch");
const splitargs = require("splitargs");

/*
const schedule = require("node-schedule");
const j = schedule.scheduleJob('* * 8 * * *', () => {
  let w = getWeather(0);
  const ch = client.channels.find('name', 'wetty-spaghetti');
  if (ch){
  	w.then((weather) => {
      const { spawn } = require("child_process"),
        ps = spawn(`echo "${weather}" | cowsay -f bong.cow -n`, [], { shell: true });
      ps.stdout.on("data", data => {
        data = String(data).substring(0, 1850);
        ch.send(`\`\`\`\n${data}\n\`\`\``);
      });
       });
  }
});
*/
const formatTextWrap = (text, maxLineLength) => {
  const words = text.replace(/[\r\n]+/g, " ").split(" ");
  let lineLength = 0;

  // use functional reduce, instead of for loop
  return words.reduce((result, word) => {
    if (lineLength + word.length >= maxLineLength) {
      lineLength = word.length;
      return result + `\n${word}`; // don't add spaces upfront
    } else {
      lineLength += word.length + (result ? 1 : 0);
      return result ? result + ` ${word}` : `${word}`; // add space only when needed
    }
  }, "");
};


async function getBotMessages(channel, filter){
	
	cmp = (a, b) => { return a.createdTimestamp - b.createdTimestamp; }

	let msgs = await channel.fetchMessages({limit: 100});
	msgs = msgs.sort(cmp);

	if(filter) msgs = msgs.filter(filter);

	return msgs;
}

async function deleteBotMessages(channel, n){
	filter = (msg) => {
		return msg.author.bot;
	}
	let total = 0;
	while(true){
	let msgs = await getBotMessages(channel, filter);
	let size = msgs.size;

	if(n){ 
		msgs = msgs.array().slice(-n);
		size = msgs.length;
	}
	
	total += size;
	if (size > 0){
		console.log(`found ${size} bot messages to delete`);
     		await channel.bulkDelete(msgs);
		n = n - size;
	}else{
		return;
	}
	if(n <= 0 || n >= total) return; 
	}
}

let civs = [
	'AmeriKKKa',
	'Arabia',
	'Australia',
	'Aztec',
	'Brazil',
	'China',
	'Egypt',
	'England',
	'France',
	'Germany',
	'Greece',
	'India',
	'Indonesia',
	'Japan',
	'Khmer',
	'Kongo',
	'Macedon',
	'Norway',
	'Nubia',
	'Poland',
	'Persia',
	'Rome',
	'Russia',
	'Scythia',
	'Spain',
	'Sumeria'
];

shuffleCivs = () => {
/*	for(let i = civs.length - 1; i > 0; i--){
	  const j = Math.floor(Math.random() * civs.length)
	  const temp = civs[i];
	  civs[i] = civs[j];
	  civs[j] = temp;
	}*/
var m = civs.length, t, i;

  // While there remain elements to shuffle…
  while (m) {

    // Pick a remaining element…
    i = Math.floor(Math.random() * m--);

    // And swap it with the current element.
    t = civs[m];
    civs[m] = civs[i];
    civs[i] = t;
  }
}

shuffleCivs();

let polls = [];
let currentpoll = undefined;

const MongoClient = require("mongodb").MongoClient;
const MONGO_URL = "mongodb://localhost:27017/cowplace";

fetchPolls = () => {
  MongoClient.connect(MONGO_URL, (err, database) => {
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
  MongoClient.connect(MONGO_URL, (err, database) => {
    if (err) console.log(err);
    var db = database.db();
    db.collection("polls").save(poll);
  });
  fetchPolls();
};

fetchPolls();

async function getWeather(day){
  let data = await fetch(
    "https://api.darksky.net/forecast/9962efa6ec3252fd47e15720113eb4bf/28.594853,%20-81.228421"
  ).then(res => {
    return res.json();
  }).catch(e => console.log(e));
    //console.log(data);
    if(!data) return 'error';
    const temp = data.currently.temperature;
    const humidity = data.currently.humidity * 100;
    const today = data.daily.data[day];
    const minute_summary = data.minutely.summary;
    const daily_summary = data.hourly.summary.concat(" ");
    const weekly_summary = data.daily.summary.concat(" ");
    const high = today.temperatureHigh;
    const low = today.temperatureLow;
    const precip = today.precipProbability * 100;
    //const precip_hours = data.DailyForecasts[0].Day.HoursOfPrecipitation;
    let desc = formatTextWrap(
      daily_summary.concat(weekly_summary).concat(minute_summary),
      30
    );
    return `Orlando Weather:\nHigh    : ${high}°F\nLow     : ${low}°F\nCurrent : ${temp}°F\nPrecip  : ${precip}%\nHumidity: ${humidity}%\n${desc}`;
};

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on("message", msg => {
  if (Math.floor(Math.random() * 10) > 8) {
    const emojis = msg.guild.emojis.array();
    for (let i = 0; i < 1; i++) {
      var e = emojis[Math.floor(Math.random() * emojis.length)];
      msg.react(e);
    }
  } 
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

  // user specific
  /*	if (msg.author.username === "Boxman5"){
		msg.reply("you have consented to have your ip logged. have an nice day");
	}*/

  // commands
  if (!msg.content.startsWith("!")) {
    return;
  }

  const cmd = splitargs(msg.content);
  console.log(cmd);


  if(cmd[0] === '!civ'){
	if(cmd.length == 1){
		msg.reply('usage: !civ roll|list');
	}
	if(cmd[1] === 'roll'){
		let s = '';
		shuffleCivs(); shuffleCivs(); shuffleCivs();
		if (cmd.includes('all')){	
			let members = msg.guild.members.filterArray(m => {return !m.user.bot});
			for(let i = 0; i < members.length; i++){
				s = s.concat(`${members[i].user.username}: ${civs[i]}\n`);
			}
		}else{
			s = civs[0];
		}//
	    const { spawn } = require("child_process"),
        ps = spawn(`echo "${s}" | cowsay -f bong.cow -n`, [], { shell: true });

	    ps.stdout.on("data", data => {
	      msg.reply(`\`\`\`\n${data}\n\`\`\``);
	    });
	}
	 if(cmd[1] === 'list'){
	    const { spawn } = require("child_process"),
	      ls = spawn("cowsay", ["-f", "bong.cow", civs.toString()]);

	    ls.stdout.on("data", data => {
	      msg.reply(`\`\`\`\n${data}\n\`\`\``);
	    });
	 }
  }
  if (cmd[0] === "!purge"){
    if(cmd.length == 1){
       msg.reply('\`\`\`usage: !purge options\nn\nall\`\`\`');
    }
    
    if(cmd[1] === 'all' ){
	    deleteBotMessages(msg.channel);
    }
    const n = parseInt(cmd[1], 10);
    if(n !== NaN){
	    deleteBotMessages(msg.channel, n);
    }
  }

  if (cmd[0] === "!cow") {
    let s = msg.content;
    s = s.replace("!cow ", "");

    const { spawn } = require("child_process"),
      ls = spawn("cowsay", ["-f", "bong.cow", s]);

    ls.stdout.on("data", data => {
      data = String(data).substring(0, 1850);
      msg.reply(`\`\`\`\n${data}\n\`\`\``);
    });
  }

  if (cmd[0] === "!poll") {
    if (cmd.length <= 1) {
      msg.reply('usage: !poll "poll title" "choice"...');
      return;
    }

    if (cmd[1] === "show") {
      fetchPolls();
      console.log(polls);
      msg.reply(showPoll(currentpoll, polls.length));
      return;
    }

    let newpoll = { title: cmd[1], choices: [] };

    const args = cmd.slice(2);
    for (let opt of args) {
      newpoll.choices.push({ text: opt, votes: 0 });
    }
    polls.push(newpoll);
    console.log(polls);
    msg.reply(showPoll(currentpoll, polls.length));
    savePoll(newpoll);
    currentpoll = polls[polls.length - 1];
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
  if (cmd[0] === "!fortune") {
    const command = "fortune | cowsay -f bong";
    const { spawn } = require("child_process"),
      ls = spawn(command, [], { shell: true });

    ls.stdout.on("data", data => {
      data = String(data).substring(0, 1850);
      msg.reply(`\`\`\`${data}\n\`\`\``);
    });
  }
  if (cmd[0] === "!sh" || cmd[0] === "!shit") {
    if (cmd.length < 1 || cmd[1] === "help") {
      msg.reply("just fuck my shit up\n!sh command");
      return;
    }
    if (cmd.includes("rm") || cmd.includes("kill")) {
      msg.reply("try harder");
      return;
    }
    const command = cmd.slice(1).join(" ");

    try {
      const { spawn } = require("child_process"),
        ps = spawn(command, [], { shell: true, detached: true });
      ps.stdout.on("data", data => {
        data = String(data).substring(0, 1850);
        msg.reply(`\`\`\`${data}\n\`\`\``);
      });
    /*  
        ps.stderr.on("data", data => {
        data = String(data).substring(0, 1850);
        msg.reply(`\`\`\`just fuck my shit up\n${data}\n\`\`\``);
      });
    */
    } catch (err) {
      msg.reply(err);
    }
  }

  if (cmd[0] === "!weather") {
    let s = undefined;
    if (cmd.length > 1 && cmd[1] === "tomorrow") {
      s = getWeather(1);
    } else {
      s = getWeather(0);
    }
    s.then(weather => {
      const { spawn } = require("child_process"),
        ps = spawn(`echo "${weather}" | cowsay -f bong.cow -n`, [], { shell: true });
      ps.stdout.on("data", data => {
        data = String(data).substring(0, 1850);
        msg.reply(`\`\`\`\n${data}\n\`\`\``);
	
      /*  const ch = client.channels.find('name', 'wetty-spaghetti');
	if(ch){
        	ch.send(`\`\`\`\n${data}\n\`\`\``);
	}*/
      });
    });
  }
});

client.login("NjA4NDg4ODc2MTk3MDE5Njcy.XUo9AA.SINOfto7JqBWTqQEXngMYSphmgY");
