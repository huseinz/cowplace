const { spawn } = require("child_process");
const util = require("../core/util.js");
const dad = require("./dad.js");

say = (s, channel) => {
  ps = spawn("cowsay", ["-f", "bong.cow", s]);
  ps.stdout.on("data", data => {
    channel.send(util.codeMarkdown(`\n${data}\n`));
  });
};

say_dirty = (s, channel) => {
  ps = spawn(`echo "${s}" | cowsay -f bong.cow -n`, [], { shell: true });
  ps.stdout.on("data", data => {
    channel.send(util.codeMarkdown(`\n${data}\n`));
  });
};
module.exports = {
  name: "cow",
  usage: "!cow message\ndad: shitty dad joke",
  about: "cow smokes weed",
  execute(argv, msg) {
    if (argv.length > 1 && argv[1] === "dad") {
      dad.dad().then(data => say(data, msg.channel));
      return;
    }
    if (argv.length === 1) {
      const command = "fortune | cowsay -f bong";
      ls = spawn(command, [], { shell: true });

      ls.stdout.on("data", data => {
        data = String(data).substring(0, 1850);
        msg.channel.send(util.codeMarkdown(`${data}\n`));
      });
      return;
    }
    let s = msg.content;
    s = s.replace("!cow ", "");
    say(s, msg.channel);
  },
  say,
  say_dirty
};
