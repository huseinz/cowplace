const { spawn } = require("child_process");
const util = require('../util.js');
const usage = util.codeMarkdown('!shit COMMAND...');
module.exports = {
	name:['sh', 'shit'],
	usage,
	about:'just fucks my shit up',
	execute(argv, msg){
    if (argv.length < 1 || argv[1] === "help") {
      msg.reply(usage);
      return;
    }
    if (argv.includes("rm") || argv.includes("kill")) {
      msg.reply("try harder");
      return;
    }
    const command = argv.slice(1).join(" ");

    try {
      const { spawn } = require("child_process"),
        ps = spawn(command, [], { shell: true, detached: true });
      ps.stdout.on("data", data => {
        data = String(data).substring(0, 1850);
        msg.reply(util.codeMarkdown(`${data}\n`));
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
}
