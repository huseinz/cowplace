const fetch = require("node-fetch");
const cow = require('./cow.js');
const util = require('../util.js');

async function getWeather(day){
  let data = await fetch(
    "https://api.darksky.net/forecast/9962efa6ec3252fd47e15720113eb4bf/28.594853,%20-81.228421"
  ).then(res => {
    return res.json();
  }).catch(e => console.log(e));
    //console.log(data);
    if(!data) return 'error';
    const temp = data.currently.temperature;
    const humidity = data.currently.humidity * 100;
    const today = data.daily.data[day];
    const minute_summary = data.minutely.summary;
    const daily_summary = data.hourly.summary.concat(" ");
    const weekly_summary = data.daily.summary.concat(" ");
    const high = today.temperatureHigh;
    const low = today.temperatureLow;
    const precip = today.precipProbability * 100;
    //const precip_hours = data.DailyForecasts[0].Day.HoursOfPrecipitation;
    let desc = util.formatTextWrap(
      daily_summary.concat(weekly_summary).concat(minute_summary),
      30
    );
    return `Orlando Weather:\nHigh    : ${high}°F\nLow     : ${low}°F\nCurrent : ${temp}°F\nPrecip  : ${precip}%\nHumidity: ${humidity}%\n${desc}`;
};

module.exports = {
	name: 'weather',
	usage: util.codeMarkdown('!weather'),
	about: 'shows u the weather',
	execute(argv, msg){
	    let s = undefined;
	    if (argv.length > 1 && argv[1] === "tomorrow") {
	      s = getWeather(1);
	    } else {
	      s = getWeather(0);
	    }
	    s.then(weather => { cow.say_dirty(weather, msg.channel)});
	}
}
