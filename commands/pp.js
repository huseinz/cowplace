module.exports = {
	name: 'pp',
	usage: '!pp',
	about: 'pp size',
	execute(argv, msg){
		var size = (Math.random() * (10 - 2) + 2).toFixed(2);
		console.log(size);
		msg.channel.send(`Your 8======D size is ${size} inche`);
	}
}
