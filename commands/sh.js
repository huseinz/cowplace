const { spawn } = require("child_process");
const util = require('../core/util.js');
module.exports = {
	name:['sh', 'shit'],
	usage:'!shit COMMAND...',
	about:'just fucks my shit up',
	execute(argv, msg){

    if (argv.length < 1 || argv[1] === "help") {
      msg.reply(usage);
      return;
    }

    const naughty_commands = ['rm', 'kill', 'ping', 'sudo']
    for(let i = 0; i < naughty_commands.length; i++){
	    ///  if (argv.includes(naughty_commands[i])) {
      if (argv[1].includes(naughty_commands[i])) {
        msg.reply("try harder");
        return;
      }
    }

    const command = argv.slice(1).join(" ");
		console.log(command);
    try {
      ps = spawn(command, { shell: true, detached: true });
      let n_chars = 0;
      ps.stdout.on("data", data => {
	if (n_chars > 2000)
             return;
        data = String(data).substring(0, 1850);
	n_chars += data.length;
	console.log(n_chars);
        msg.reply(util.codeMarkdown(`${data}\n`));
      });
    /* 
      ps.stderr.on("data", data => {
        data = String(data).substring(0, 1850);
        msg.reply(util.codeMarkdown(`${data}\n`));
      });
    */
    } catch (err) {
      msg.reply(err);
    }
	}
}
