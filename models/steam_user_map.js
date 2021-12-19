//Require Mongoose
var mongoose = require('mongoose');

//Define a schema
var Schema = mongoose.Schema;

var steam_discord_user_schema = new Schema({
  steam_id: String,
  discord_id: String,
  civ_icon: String,
  next: String,
});

var SteamDiscordUser = mongoose.model('steam_discord_user', steam_discord_user_schema );


module.exports = {
  SteamDiscordUser
}
