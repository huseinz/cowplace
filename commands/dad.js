const axios = require("axios");

dad = async function() {
  try {
    const url = "https://icanhazdadjoke.com/";
    const response = await axios({
      method: "get",
      url: url,
      headers: { Accept: "text/plain" }
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
      data = await dad();
      msg.channel.send(data);
    })();
  }
};
