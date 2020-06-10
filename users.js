var mongoose = require("mongoose");
var usrschema = new mongoose.Schema({
	username : String,
	email : String,
});
module.exports = mongoose.model("Usr", usrschema);