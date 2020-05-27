require('log-timestamp');
const Discord = require("discord.js");
const client = new Discord.Client();
const { prefix, token } = require("./config.json");

const fs = require("fs");
//const splitargs = require("splitargs");
const splitargs = require("split-string");
const cow = require("./commands/cow.js");
const util = require("./core/util.js");

//steam webwooks endpoint
const steam_webhook = require("./core/steam.js");

const commandFiles = fs
  .readdirSync("./commands")
  .filter(file => file.endsWith(".js"));
client.commands = new Discord.Collection();

for (const file of commandFiles) {
  const cmd_module = require(`./commands/${file}`);
  //call set for each command in a file
  for (const name of Array(cmd_module.name).flat()) {
    client.commands.set(name, cmd_module);
  }
}
//cum
client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
  steam_webhook.start(client);
});

client.on("message", msg => {
  // randomly react with a random emoji
  if (Math.floor(Math.random() * 10) > 8) {
    const guild = msg.guild;
    if (guild) {
      var emojis = guild.emojis.array();
    }
    for (let i = 0; emojis && i < 1; i++) {
      const e = emojis[Math.floor(Math.random() * emojis.length)];
      msg.react(e);
    }
  }

  // exit if message not a command
  if (!msg.content.startsWith(prefix) || msg.author.bot) return;

  // use bash-style argument splitting
  // const argv = splitargs(msg.content);
  const argv = splitargs(msg.content, { separator: " ", quotes: '"' });
  console.log(argv);

  //remove prefix from command string
  const cmd_name = argv[0].slice(prefix.length);

  //handle special case command: list all available commands
  if (cmd_name === "commands" || cmd_name === "help") {
    let list = Array.from(client.commands.keys());

    for (let i = 0; i < list.length; i++) {
      list[i] = list[i].concat(": " + client.commands.get(list[i]).about);
    }
    list.push("!{query}: gets a random image,\nuse at your own risk");
    list.push(
      "\ndo '!{command} help' for individual\ncommand usage and options"
    );
    const message = list.join("\n");
    cow.say_dirty(message, msg.channel);
    return;
  }

  // execute command
  try {
    cmd_module = client.commands.get(cmd_name);

    // display any help info
    if (argv.length > 1 && argv[1] === "help") {
      //      msg.reply(util.codeMarkdown(cmd_module.about + '\n' + cmd_module.usage));
      cow.say_dirty(cmd_module.about + "\n" + cmd_module.usage, msg.channel);
    }
    // display any about info
    else if (argv.length > 1 && argv[1] === "about") {
      msg.reply(util.codeMarkdown(cmd_module.about));
    }
    // invoke module
    else if (cmd_module) {
      cmd_module.execute(argv, msg);
    } else {
      cmd_module = client.commands.get("cat");
      cmd_module.execute(argv, msg);
    }
  } catch (error) {
    console.error(error);
    msg.reply("there was an error trying to execute that command!");
  }
  return;
});

client.login(token);

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
