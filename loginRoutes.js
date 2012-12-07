//The other one of the two servers files that talks to the database.
// Information is sent into this file using ajax calls.

var passport = require('passport');
var User = require('./User');
var MongoClient = require('mongodb').MongoClient,
  Grid = MongoClient.Grid;

module.exports = function (app) {


    app.get('/', function (req, res) {
        res.render("subdir + "/" + index.html");
    });

    //Registers the user name and password into the database. If the username already exists
    // then send an error back stating that user already exists
    app.post('/register', function(req, res) {
        var username = req.body.username;
        console.log("username from register: "+username);
        console.log("request: "+req.body.username);
        console.log("response: "+res);
        User.findOne({username : username }, function(err, existingUser) {
            if (err){
                return res.send({'err': err});
            }
            if (existingUser) {
                return res.send('user exists');
            }

            var user = new User({ username : req.body.username });
            user.registeredTimestamp = new Date();
            user.timeLineObjects = [];
            user.setPassword(req.body.password, function(err) {
                if (err) {
                    return res.send({'err': err});
                }

                user.save(function(err) {
                    if (err) {
                        return res.send({'err': err});
                    }
                    return res.send('success');
                });
            });  
        });
    });
    
    //Takes care of the user login. Can be accessed via '/login' url.
    // In this, the user's password and username is authenticated by
    //passport. Once thats done, we add extra information and then 
    //save it onto the database.
    
    app.post('/login', passport.authenticate('local'), function(req, res) {
        req.user.lastUserAgent = req.headers['user-agent'];
        req.user.lastIp = req.ip;
        req.user.lastHost = req.host;
        req.user.lastLoginTimestamp = new Date();
        req.user.save();
        return res.send('success');
    });

    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

}
