const { spawn } = require("child_process");

module.exports = {
    name: 'fortune',
    usage:'!fortune',
    about:'self explanatory',
    execute(argv, msg){
    const command = "fortune | cowsay -f bong";
    ls = spawn(command, [], { shell: true });

    ls.stdout.on("data", data => {
      data = String(data).substring(0, 1850);
      msg.channel.send(util.codeMarkdown(`${data}\n`));
    });
    }
}
