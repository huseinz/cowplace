const {spawn}  = require("child_process");
const util = require('../util.js'); 

say = (s, channel) => {
ps = spawn("cowsay", ["-f", "bong.cow", s]);
ps.stdout.on("data", data => {
  channel.send(util.codeMarkdown(`\n${data}\n`));
});
}

say_dirty = (s, channel) => {
ps = spawn(`echo "${s}" | cowsay -f bong.cow -n`, [], { shell: true });
ps.stdout.on("data", data => {
  channel.send(util.codeMarkdown(`\n${data}\n`));
});
}

module.exports = {
   name: 'cow',
   usage:util.codeMarkdown('!cow message'),
   about: 'hehe',
   execute(argv, msg){
    let s = msg.content;
    s = s.replace("!cow ", "");
    say(s, msg.channel);
   },
   say,
   say_dirty
}
