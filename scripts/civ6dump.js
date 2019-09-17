#!/usr/bin/node

const db = require("../core/db.js");
const mapping = {
  "Sir Flexalot": "238850504493498370",
  "capitalism is bad fellow gamers": "546865404425928727",
  "R8 my R8 M8": "534748953024004103",
  "Hot Bod Rod": "196117736089321474"
};

dumpdb = async () => {
	const latest_turn = await db.findOne("civ6_latest_turn");
	const turnlog = await db.findAll("civ6_turns");

	console.log(latest_turn);
	console.log(turnlog);
};

avg = (turns, discord_id) => {
	let sum = 0;
	let count = 0;
	for(let i = 0; i < turns.length - 1; i++){
		if(turns[i].discord_id === discord_id){
			sum += (turns[i+1].timestamp - turns[i].timestamp) / 1000 / 60;
			count += 1;
		}
	}
	console.log(count);
	return sum / count; //minutes
};

all_avg = async () => {
	const turns = await db.findAll("civ6_turns");
	const nick = avg(turns, mapping["capitalism is bad fellow gamers"]);
	const drek = avg(turns, mapping["R8 my R8 M8"]);
	const zubir = avg(turns, mapping["Sir Flexalot"]);

	console.log(`Nick:  ${nick}`);
	console.log(`Drek:  ${drek}`);
	console.log(`Zubir: ${zubir}`);
};

//get_turns(mapping["capitalism is bad fellow gamers"]).then().catch(err => console.log(err));


//dumpdb().then().catch(err => console.log(err));
all_avg().then().catch(err => console.log(err));
console.log(new Date().toLocaleString());
