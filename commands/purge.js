const util = require("../core/util.js");

async function getBotMessages(channel, filter) {
  cmp = (a, b) => {
    return a.createdTimestamp - b.createdTimestamp;
  };

  let msgs = await channel.fetchMessages({ limit: 100 });
  msgs = msgs.sort(cmp);

  if (filter) msgs = msgs.filter(filter);

  return msgs;
}

async function deleteBotMessages(channel, n) {
  filter = msg => {
    return msg.author.bot;
  };
  let total = 0;
  while (true) {
    let msgs = await getBotMessages(channel, filter);
    let size = msgs.size;

    if (n) {
      msgs = msgs.array().slice(-n);
      size = msgs.length;
    }

    total += size;
    if (size > 0) {
      console.log(`found ${size} bot messages to delete`);
      await channel.bulkDelete(msgs);
      n = n - size;
    } else {
      return;
    }
    if (n <= 0 || n >= total) return;
  }
}
const usage = util.codeMarkdown(
  "usage: !purge [option]\n\noptions:\nn: deletes n previous messages\nall"
);
module.exports = {
  name: "purge",
  usage,
  about: "removes bot messages",
  execute(argv, msg) {
    if (argv.length == 1) {
      msg.channel.send(usage);
      return;
    }
    if (argv[1] === "all") {
      deleteBotMessages(msg.channel);
      return;
    }
    const n = parseInt(argv[1], 10);
    if (n !== NaN) {
      deleteBotMessages(msg.channel, n);
    }
    msg.delete();
  },
  getBotMessages,
  deleteBotMessages
};
