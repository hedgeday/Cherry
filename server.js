

var path = require('path');
var express = require('express');
var http = require('http');
var mongoose = require('mongoose');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

//Server.js: This initializes the server which runs all the code. It also
// starts the database where all the information from our playground will 
// be stored in.

//initialize the server. Creates the server
function init(){
    var app = express();
    configureExpress(app);


    var User = initPassportUser();

    mongoose.connect('mongodb://localhost/firstSubmit');

    require('./loginRoutes')(app);
    require('./appRoutes')(app);
   
    http.createServer(app).listen(7000, function() {
        console.log("Express server listening on port %d", 7000);
    });

}

init();

//configures Express. 
function configureExpress(app){
    app.configure(function(){
        app.use(express.bodyParser());
        app.use(express.methodOverride());


        app.use(express.cookieParser('your secret here'));
        app.use(express.session());
        app.use(express.limit('30mb'));
        app.use(passport.initialize());
        app.use(passport.session());

        // app.use(app.router);
        var subdir = "/www";
        app.use("/", express.static(__dirname + subdir));
    });
}

//intialize the passport for the User schema.
function initPassportUser(){
    var User = require('./User');

    passport.use(new LocalStrategy(User.authenticate()));

    passport.serializeUser(User.serializeUser());
    passport.deserializeUser(User.deserializeUser());

    return User;
}

