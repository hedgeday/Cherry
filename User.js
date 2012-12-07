//One of the two schemas. This is the schema that stores 
// the username password, and a bunch of other information that 
// can be used in authenticating, and storing information
//into instances of the text message schema

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');
console.log("comes to user.js");
var User = new Schema({
    msg: String,
    email: String,
    othersEmail: String,
    timelineMessages: [{body: String, date: Date}],
    timeLineObjects: [Schema.Types.ObjectId],
    registeredTimestamp: Date,
    lastLoginTimestamp: Date,
    lastIp: String,	
    lastHost: String,
    lastUserAgent: String,
    lastMsgTimestamp: Date,
    superuser: Boolean
});



User.plugin(passportLocalMongoose); //adds username, password to schema

module.exports = mongoose.model('User', User);
