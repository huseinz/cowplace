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

get_turns = async discord_id => {
	const turnlog = await db.findAll("civ6_turns", {discord_id});
	return turnlog;
};

avg = (turns) => {
	let sum = 0;
	for(let i = 1; i < turns.length; i++){
		sum += turns[i].timestamp - turns[i-1].timestamp;
	}
	return sum / turns.length / 1000 / 60;
};

all_avg = async () => {
	const nick = await get_turns(mapping["capitalism is bad fellow gamers"]);
	const drek = await get_turns(mapping["R8 my R8 M8"]);
	const zubir = await get_turns(mapping["Sir Flexalot"]);

	console.log(`Nick:  ${avg(nick)}`);
	console.log(`Drek:  ${avg(drek)}`);
	console.log(`Zubir: ${avg(zubir)}`);
};

//get_turns(mapping["capitalism is bad fellow gamers"]).then().catch(err => console.log(err));


//dumpdb().then().catch(err => console.log(err));
all_avg().then().catch(err => console.log(err));
