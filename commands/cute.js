//author: jon

const axios = require('axios');
const random = require('random-item');
const ddg = require('duckduckgo-images-api');

async function ddg_is(q){
	do{
	  const results = await ddg.image_search({ query: q });
       	  if(results !== undefined)
	    return random(results.slice(10)).image;
	}while(results === undefined);
}

module.exports = {
  name: ["cat", "dog", 'koala'],
  usage: '!dog | !cat | !koala',
  about: 'shows a random cute cat/dog/koala pic',
  execute(argv, msg) {
    (async () => {
      try {
	let img_url = 'error :(';
	if(argv[0] === '!dog'){
        const req_url = 'https://dog.ceo/api/breeds/image/random';
        const response = await axios.get(req_url);
        img_url = response.data.message;
        msg.channel.send(img_url);
	}
        else if(argv[0] === '!cat'){
        const req_url = 'https://api.thecatapi.com/v1/images/search';
        const response = await axios.get(req_url);
        img_url = response.data[0].url
        msg.channel.send(img_url);
	}
	else if(argv[0] === '!koala'){
        const req_url = 'https://some-random-api.ml/img/koala';
        const response = await axios.get(req_url);
        img_url = response.data.link;
        msg.channel.send(img_url);
	}
	
	//generic image search
	else{
	argv[0] = argv[0].slice(1);
	const query = argv.join(' ');
	const rv = await msg.channel.send(`🦆 is looking for \'${query}\'...`);

	const loading_emoji = msg.guild.emojis.find(emoji => emoji.name == 'fast');
	let loading_react = undefined;
	if(loading_emoji !== undefined){
		loading_react = await rv.react(loading_emoji);
	}

	const img_url = await ddg_is(query);
	console.log(img_url);
	await rv.edit(img_url);
	loading_react.remove();
	}
      } catch (error) {
	if(error.response){
        	console.error(error.message + error.response.statusText);
		msg.reply(error.message + ': ' + error.response.statusText);
	}
	else{
        	console.error(error.message);
		msg.reply(error.message);
	}
      }
    })()
  },
}

