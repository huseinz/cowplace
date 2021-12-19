const axios = require("axios");
require('log-timestamp');

dad = async function() {
  try {
    const url = "https://icanhazdadjoke.com/";
    const response = await axios({
      method: "get",
      url: url,
      headers: { "Accept": "text/plain", "User-Agent": "Zubir" }
    });
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

module.exports = {
  name: "dad",
  usage: "!dad",
  about: "random shitty dad joke",
  dad,
  execute(argv, msg) {
    //		console.log(msg.channel);
    (async () => {
      try {
          data = await dad();
          msg.channel.send(data);
      } catch (error) {console.log(error);}
    })().catch();
  }
};
