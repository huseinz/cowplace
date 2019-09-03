//author: jon

const axios = require('axios');
const random = require('random-item');
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
	}
        else if(argv[0] === '!cat'){
        const req_url = 'https://api.thecatapi.com/v1/images/search';
        const response = await axios.get(req_url);
        img_url = response.data[0].url
	}
	else if(argv[0] === '!koala'){
        const req_url = 'https://some-random-api.ml/img/koala';
        const response = await axios.get(req_url);
        img_url = response.data.link;
	}
	
	//generic image search
	else{
	const req_url = 'https://api.qwant.com/api/search/images';
	argv[0] = argv[0].slice(1);
	const query = argv.join(' ');
	const response = await axios.get(req_url, 
		{params:{
			count:'10',
			'q':query,
			't':'images',
			'locale':'en_US',
			'uiv': 4
		 }
		}
	);
	const result = response.data.data.result.items;
	let urls = [];
	for (let i = 0; i < result.length; i++){
		let media = result[i].media;
		if(media) urls.push(media);
	}
		//	console.log(urls);
	console.log(urls.length);
	img_url = random(urls);
	}
	      console.log(img_url);
        msg.channel.send(img_url);
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

