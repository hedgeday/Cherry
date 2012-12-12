//This is one of the two schemas that we have created. This will eventually represent
// the way all the information from playground will be stored. 

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');
console.log("comes to text.js");

var TextMessage = new Schema({
    msg: String,
    date: Date,
    user: String,
    fullName: String,
    userEmail: String,
    photo: Schema.Types.ObjectId, 
    canvasImage: String,
    latitude: String,
    longitude: String,
    audio: String,
    photoStr : String,
    typePhoto: Boolean,
    typeVoice: Boolean,
	typeText: Boolean,
	typeMap: Boolean,
	typeCanvas: Boolean,
	typeRegister: Boolean,
	birthday: String,
	gender: String,
	startDating: String,
	typeMood: Boolean,
	mood: String,
	statuses: String
});

TextMessage.plugin(passportLocalMongoose); 

module.exports = mongoose.model('TextMessage', TextMessage);
