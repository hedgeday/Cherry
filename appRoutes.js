//One of the two server files that connects to the database. This file will take in information such as 
// username, messages, photos, audio files and then store it in the database. This file is access
// through AJAX calls that are made from the client side. Once the information comes here, 
// it is stored into the mongo database. Then we send information back to the client stating whether
// information was stored successfully or not. 

var User = require('./User');
var TextMessage = require('./TextMessage');
var request = require("request");
var mongoose = require('mongoose');


module.exports = function (app) {

var Grid = mongoose.mongo.Grid;
var ObjectID = mongoose.mongo.BSONPure.ObjectID;

    //saves pictures onto the database. Currently, saves the picture in the 
    // database using gridfs, and returns it back as response.
    //This is to make sure that the picture can be got out of the database
    // and displayed on the dom. We tested and it seeems to be succesful.
    app.post('/db/savePic', function(req, res){
        var db;
        console.log("trying to save the picture to the database");
        db = mongoose.connection.db;
        var grid = new Grid(db, 'fs');
        var buffer = new Buffer(req.body.picture);
        grid.put(buffer, {metadata:{category:'text'}, content_type: 'text'}, function(err, fileInfo) {
            var textMsg = new TextMessage({typeCanvas: false, msg: "", photoStr: req.body.picture, date: req.body.date, user: req.user.username, fullName: req.user.fullName, userEmail: req.user.email, typeText: false, typePhoto: true, typeVoice: false,typeMap: false, photo: fileInfo._id});
            console.log("username: "+req.user.username);
            console.log("user's email: "+req.user.email);
            textMsg.save(function(err){
                if(err)
                {
                    console.log("didnt store the picture information");
                }
            });
            grid.get(fileInfo._id, function(err, data) {
                  
                  grid.delete(fileInfo._id, function(err, result) {
              });
                  return res.send(data.toString());
            });
        });


    });

    app.post('/db/saveAudio', function(req, res){
        console.log("saving the audio in the database");
        var textMsg = new TextMessage({typeCanvas: false, date: req.body.date, user: req.user.username, fullName: req.user.fullName, userEmail: req.user.email, audio: req.body.audio, typePhoto: false, typeText: false, typeVoice: true, typeMap: false});
        textMsg.save(function(err){
            if(err)
            {
                console.log("didnt store the audio information");
            }
        });
        return res.send('success');
    });

    app.post('/db/saveMap', function(req, res){
        console.log("saving the map in the database");
        // console.log("latitude: "+req.body.latitude);
        // console.log("longitude: "+req.body.longitude);
        var textMsg = new TextMessage({typeCanvas: false, date: req.body.date, user: req.user.username, fullName: req.user.fullName, latitude: req.body.latitude, longitude: req.body.longitude, userEmail: req.user.email,  typePhoto: false, typeText: false, typeVoice: false, typeMap: true});
        textMsg.save(function(err){
            if(err)
            {
                console.log("didnt store the mmap information");
            }
        });
        return res.send('success');
    });


    // Stores the texts that is posted onto the playbground. Once the text has been taken and 
    // put into the database. Currently, I have a code inside this function that tests whether
    // the information actually gets stored the way we want to. 
    app.post('/db/post', function(req, res)
    {
        console.log("trying to save the post in the database" );
        var textMsg = new TextMessage({typeCanvas: false, msg: req.body.message, date: req.body.date, user: req.user.username,  fullName: req.user.fullName, userEmail: req.user.email, typeText: true, typePhoto: false, typeVoice: false, typeMap: false});
        textMsg.save(function(err) {
            if (err) {
                console.log("didnt store the text");
            }

        });
        //testing purposes: make sure that out of all the instances of TextMessage that have been created, 
        // we can query them, filter the ones with the username as req.user.username, and then 
        // sort them based on date and print out the messages
        // TextMessage.find({user: req.user.username}, 'msg',
        //     {
        //         sort: [['date', 1]]
        //     },
        //     function(err, textMsgs)
        //     {
        //         if(err)
        //         {
        //             console.log("error");
        //         }
        //         else
        //         {
        //             res.send(textMsgs);
        //             console.log("number of messages: "+textMsgs.length);
        //              for (var i = 0; i < textMsgs.length; i++){
        //                 console.log("texts: "+textMsgs[i].msg);
        //              }
        //         }
        //     }
        // );
        return res.send('success');

    });

    app.post('/db/canvasSave', function(req, res)
    {
        console.log("saving the canvas picture in the database");
        console.log("length of the string: "+req.body.canvasPicture.length)
        var textMsg = new TextMessage({typeCanvas: true, canvasImage: req.body.canvasPicture, date: req.body.date, user: req.user.username, fullName: req.user.fullName, userEmail: req.user.email,  typePhoto: false, typeText: false, typeVoice: false, typeMap: false});
        textMsg.save(function(err){
            if(err)
            {
                console.log("didnt store the mmap information");
            }
        });
        return res.send('success');

    });

}
