var axios = require("axios").default;

module.exports = {
	name: 'math',
	usage: '!math',
	about: 'fun with math',
	execute(argv, msg){
		var options = {
			  method: 'GET',
			  url: 'https://numbersapi.p.rapidapi.com/random/trivia',
			  params: {max: '20', fragment: 'true', min: '10', json: 'true'},
			  headers: {
				      'x-rapidapi-key': '7d7f0048afmsh4a4008b6be9ed75p11fcf1jsn75795fe917a6',
				      'x-rapidapi-host': 'numbersapi.p.rapidapi.com'
				    }
		};
		axios.request(options).then(function (response) {
			msg.channel.send(`${response.data.number}: ${response.data.text}`);	
		}).catch(function (error) {
				console.error(error);
		});
	}
}
