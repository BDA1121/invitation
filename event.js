var mongoose = require("mongoose"),
	passportLocalMongoose = require("passport-local-mongoose");;

var eventschema = new mongoose.Schema({
	Name : String,
	Date : String,
	id   : String
});
module.exports = mongoose.model("Event", eventschema);