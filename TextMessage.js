//This is one of the two schemas that we have created. This will eventually represent
// the way all the information from playground will be stored. 

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');
console.log("comes to text.js");

var TextMessage = new Schema({
    msg: String,
    photo: String,
    audio: String,
    date: Date,
    user: String,
    typePhoto: Boolean,
    typeVoice: Boolean,
    typeText: Boolean
});

TextMessage.plugin(passportLocalMongoose); 

module.exports = mongoose.model('TextMessage', TextMessage);
