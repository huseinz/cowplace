//author: jon

const axios = require('axios');
const util = require('../util.js');

module.exports = {
  name: 'cat',
  usage: util.codeMarkdown('!cat'),
  about: 'Get a random cat pic',
  execute(argv, msg) {
    (async () => {
      try {
        const url = 'https://api.thecatapi.com/v1/images/search'
        const response = await axios.get(url)
        const cat_url = response.data[0].url
        msg.channel.send(cat_url)
      } catch (error) {
        console.error(error)
      }
    })()
  },
}

