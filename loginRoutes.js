//The other one of the two servers files that talks to the database.
// Information is sent into this file using ajax calls.

var passport = require('passport');
var User = require('./User');
var TextMessage = require('./TextMessage');
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
                console.log("user exists");
                return res.send('user exists');

            }

            var user = new User({ username : req.body.username, email: req.body.email, othersEmail: req.body.othersEmail, fullName: req.body.fullName, birthday: req.body.birthday, startDating: req.body.startDating, gender: req.body.gender});
            var textMsg = new TextMessage({typeRegister: true, birthday: req.body.birthday, gender: req.body.gender, startDating: req.body.startDating, typeCanvas: false, date: req.body.date, user: req.body.username, fullName: req.body.fullName, userEmail: req.body.email, typeText: false, typePhoto: false, typeVoice: false,typeMap: false});

            console.log("creates a new one");
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
                    textMsg.save(function(err){
                        if(err)
                        {
                            console.log("didnt store the picture information");
                        }
                    });
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
        console.log("User's email: "+req.user.email);
        console.log("Other's email: "+req.user.othersEmail);

        TextMessage.find({$or : [{userEmail: req.user.email}, {userEmail: req.user.othersEmail}]}, 'user msg date photo typePhoto typeText typeVoice audio photoStr typeMap latitude longitude typeCanvas canvasImage typeRegister birthday gender startDating typeMood mood statuses',
            {
                sort: [['date', 1]]
            },
            function(err, textMsgs)
            {
                if(err)
                {
                    console.log("error");
                }
                else
                {
                    console.log("going to return all the messages from loginRoutes to clientSide")
                    console.log(textMsgs);
                    return res.send(textMsgs);
                    //PRINT OUT THE TEXTS
                }
            }
        );


        // return res.send('success');
    });

    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

}
