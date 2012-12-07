var App = function(){
    //fires register events as soon as the app has been initialized. This creates certain functions
    // such as checking for pictures, and the functions that take care of registration and 
    //login 
    this.registerEvents();
    console.log("enters client side")
    this.usersDiv = $('#usersList');
    
    $('#addText').click(function() {
        $('#newTextMessage').show();
        $('#newTextMessage input').focus();
    });
    $('#newTextMessagePost').click(this.post.bind(this));

}

App.prototype.registerEvents = function(){
    this.registerRegister();
    this.registerLogin();
    $('#cameraSource').click(this.pictureCamera.bind(this));
    $('#librarySource').click(this.pictureLibrary.bind(this));
}

// Once a new post is created, the client calls /db/post and sends 
// all the information over to the server. After thats done,
//we currently populate the dom
App.prototype.post = function()
{
    var message =  $('#newTextMessage input').val();
    console.log("Enters the backend to try and store the text into the database.")
    if (!($('#messageInput').val() == '')){
        var currentDate = new Date();
        console.log(currentDate);
        var myMsg = $("<div class='myMsg block'><div class='ui-grid-a bottomPadding'><div class='ui-block-a left chatPic'><img class='profilePicSmall' src='/images/profilePicF.png' /></div><div class='ui-block-b right chatText'>" + $('#newTextMessage input').val() + "</div></div><p class='center time'>Posted on "+currentDate+"</p></div>");      
        var otherMsg = $("<div class='otherMsg block'><div class='ui-grid-a bottomPadding'><div class='ui-block-a left chatText'>"+ $('#newTextMessage input').val() + "</div><div class='ui-block-b right chatPic'><img class='profilePicSmall' src='/images/profilePicM.jpg' /></div></div><p class='center time'>Posted on "+currentDate+"</p></div>");      
        $('#messages').append(otherMsg.hide().fadeIn(500));      
        $('#messages').append(myMsg.hide().fadeIn(500));
        $('#messageInput').val("");
        $('#newTextMessage').hide();
    }

        this.ajaxFormJSON(  
        {
            message: message,
            date: new Date()
        },
        '/db/post',
        function success(data){
            console.log("saved the message");
        },
        function error(xhr, status, err){
            alert(JSON.stringify(err));
        });

}

//This is the place which sends the camera picture onto the server.
// On the server side, its stored in grid fs, gets it out of there and '
// sends it back to the client. It is populated on the dom right after.'
App.prototype.pictureCamera = function()
{   
        $('#newTextMessage').hide();

        var picture = "";
        navigator.camera.getPicture(function(pic)
            {
                this.ajaxFormJSON(  
                {
                    picture: pic,
                    date: new Date()
                },
                '/db/savePic',
                function success(data){
                    var currentDate = new Date();
                    var block = $("<div class='block'><p class='center'>You posted a picture.</p><div class='imageWrapper center'><img src='data:image/jpeg;base64,"+data.toString()+"' class='pgImage'/></div><p class='center time'>Posted on "+currentDate+"</p></div>");
                    $("#messages").append(block.hide().fadeIn(500));

                },
                function error(xhr, status, err){
                    alert(JSON.stringify(err));
                });

            }.bind(this), function(msg)
            {
                alert(msg);

            },
            {
                quality: 20,
                destinationType: navigator.camera.DestinationType.DATA_URL,
                sourceType: navigator.camera.PictureSourceType.CAMERA
            }
         );
}

//This is the place which sends the pictures from the library onto the server.
// On the server side, its stored in grid fs, gets it out of there and '
// sends it back to the client. It is populated on the dom right after.'
App.prototype.pictureLibrary = function()
{   
        $('#newTextMessage').hide();

        var picture = "";
        navigator.camera.getPicture(function(pic)
            {
                this.ajaxFormJSON(  
                {
                    picture: pic,
                    date: new Date()
                },
                '/db/savePic',
                function success(data){
                    var currentDate = new Date();
                    var block = $("<div class='block'><p class='center'>You posted a picture.</p><div class='imageWrapper center'><img src='data:image/jpeg;base64,"+data.toString()+"' class='pgImage'/></div><p class='center time'>Posted on "+currentDate+"</p></div>");
                    $("#messages").append(block.hide().fadeIn(500));
                },
                function error(xhr, status, err){
                    alert(JSON.stringify(err));
                });

            }.bind(this), function(msg)
            {
                alert(msg);
            },
            {
                quality: 20,
                destinationType: navigator.camera.DestinationType.DATA_URL,
                sourceType: navigator.camera.PictureSourceType.PHOTOLIBRARY
            }
         );
}

// register a new user. Sends the username and password onto the server 
// where it checks if a user exists with the same user name. 
// If it doesnt, then a new instance of the user schema is created and 
//saved in the database. 
App.prototype.registerRegister = function(){
    $('#createAccButton').click(function(){
        var username = $('#unInput').val();
        var password = $('#pwInput').val();
        
        this.ajaxFormJSON(  
                {
                    username: username,
                    password: password
                },
                '/register',
                function success(data){
                    if(data == 'user exists')
                    {
                      $.mobile.changePage($("#home"));
                    }
                    else
                    { 
                      $.mobile.changePage($("#home"));
                    }

                },
                function error(xhr, status, err){
                    alert(JSON.stringify(err));
                });
    }.bind(this));
}

App.prototype.ajaxFormJSON = function(json, url, onSuccess, onError){
    var data = new FormData();

    for (var key in json){
        console.log("key: "+key+ " cla: "+json[key]);
        data.append(key, json[key]);
    }

        $.ajax({
            url: url,
            data: data,
            cache: false,
            contentType: false,
            processData: false,
            type: 'POST',
            success: onSuccess,
            error: onError});
}

//once the user enters the login info, takes the information,
// sends it to the server using ajax. Then, it gets authenticated,
// and the dom gets manipulated based ont he response.
App.prototype.registerLogin = function(){
    $('#submitSignIn').tap(function(){
        var username = $('#usernameInput').val();
        var password = $('#passwordInput').val();

        this.ajaxFormJSON(  
                {   
                    username: username,
                    password: password,
                },
                '/login',
                function success(data){

                    if (data === 'success'){

                         $.mobile.changePage($("#homescreen"));

                    }
                    else {
                        alert(JSON.stringify(data));
                    }
                },
                function error(xhr, status, err){
                    alert(JSON.stringify(err));
                    console.log("error: "+err);
                    $.mobile.changePage($("#home"));
                });
    }.bind(this));
}