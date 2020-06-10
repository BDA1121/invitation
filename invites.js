    var mongoose = require("mongoose"),
	passportLocalMongoose = require("passport-local-mongoose");;

var inviteschema = new mongoose.Schema({
	event : String,
	Date : String,
	Name : Array,
	name : Array,
	rej : Number,
	food: Array,
	content : String,
	style   : String,
	user    : String,
	usern : String,
	strength: Number,
	url : String,
	image : String,
	imgx : String,
	imgy : String,
	dead : String,
	notifya : Array,
	notifyd : Array,
	venue : String,
	time : String
});
module.exports = mongoose.model("Invite", inviteschema);