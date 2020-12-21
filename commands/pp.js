module.exports = {
	name: 'pp',
	usage: '!pp',
	about: 'pp size',
	execute(argv, msg){
		var size = (Math.random() * (10 - 2) + 2).toFixed(2);
		var girth = (Math.random() * 3).toFixed(2);
		var cm_size = (size * 2.54).toFixed(1);
		console.log(size);
		var shaft = "=";
		var i;
		for (i = 0; i < size-2; i++) {
			  shaft += "=";
		}
		msg.channel.send(`Your 8${shaft}D size is ${size} inches (${cm_size} cm)`);
	}
}
