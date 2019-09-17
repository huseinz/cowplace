require('log-timestamp');

roll = (ub, lb = 1) => {
	ub = ub - lb;
	return Math.floor(Math.random() * ub) + lb; 
};

module.exports = {
	name: 'roll',
	usage: '!roll [n]',
	about: 'self explanatory',
	execute(argv, msg){
		if(argv.length === 1){
			msg.channel.send(roll(6));
		}
		if(argv.length > 1){
		  try{
		    const n = parseInt(argv[1], 10);
		    if (!isNaN(n)) {
			msg.channel.send(roll(n));
		    }else{
		   	msg.channel.send('gimme a number'); 
		    }
		  }catch(err){
		  	console.log(err);
		  }
		}
	}
}
