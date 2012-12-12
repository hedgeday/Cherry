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
    $("#addVoice").click(this.audioCapture.bind(this));
    $("#addLocation").click(this.locationMap.bind(this));
    $('#submitCanvas').tap(this.canvasPicture.bind(this));
    $('#submitUpdate').tap(this.updateMood.bind(this));

}

App.prototype.updateMood = function()
{
    var mood = '';
    var status = '';
    if (!$('#moodField').val() == '')
    {
        mood = $('#moodField').val();
        $('#myMood').text($('#moodField').val());
    }
    else
        $('#myMood').text('Not set');
    if (!$('#statusField').val() == '')
    {
        status = $('#statusField').val();
        $('#myStatus').text($('#statusField').val());
    }
    else{
        $('#myStatus').text('Not set');
    }
    $('#popupUpdate').popup("close")

    this.ajaxFormJSON(  
    {
        mood: mood,
        statuses: status,
        date: new Date()
    },
    '/db/savedMood',
    function success(data){
        console.log("saved the message");
    },
    function error(xhr, status, err){
        alert(JSON.stringify(err));
    });

}   

App.prototype.post = function()
{
    var message =  $('#newTextMessage input').val();
    console.log("Enters the backend to try and store the text into the database.")
    if (!($('#messageInput').val() == '')){
        var currentDate = new Date();
        console.log(currentDate);
        var myMsg = $("<div class='myMsg block'><div class='ui-grid-a bottomPadding'><div class='ui-block-a left chatPic'><img class='profilePicSmall' src='/images/profilePicF.png' /></div><div class='ui-block-b right chatText'>" + $('#newTextMessage input').val() + "</div></div><p class='center time'>Posted on "+currentDate+"</p></div>");      
        // var otherMsg = $("<div class='otherMsg block'><div class='ui-grid-a bottomPadding'><div class='ui-block-a left chatText'>"+ $('#newTextMessage input').val() + "</div><div class='ui-block-b right chatPic'><img class='profilePicSmall' src='/images/profilePicM.jpg' /></div></div><p class='center time'>Posted on "+currentDate+"</p></div>");      
        // $('#messages').append(otherMsg.hide().fadeIn(500));      
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

App.prototype.locationMap = function()
{
    $('#newTextMessage').hide();
    
    navigator.geolocation.getCurrentPosition(function(pos){
            var lat = pos.coords.latitude;
            var lon = pos.coords.longitude;
            this.ajaxFormJSON(  
            {
                latitude: lat,
                longitude: lon,
                date: new Date()
            },
            '/db/saveMap',
            function success(data){
                var currentDate = new Date();
                $("#messages").append("<div class='block'><p class='center'>You posted your location.</p><div class='imageWrapper center'><img src='http://maps.googleapis.com/maps/api/staticmap?size=400x400&maptype=roadmap&markers="+lat+","+lon+"&sensor=true' class='pgImage'/></div><p class='center time'>Posted on "+currentDate+"</p></div>");           

            },
            function error(xhr, status, err){
                alert(JSON.stringify(err));
            });         
        }.bind(this), function(error){
            alert(error.code);
        }, {maximumAge: 3000, timeout: 50000, enableHighAccuracy: false});  

}

App.prototype.canvasPicture = function()
{
    $('#newTextMessage').hide();
    var currentDate = new Date();
    var img = document.getElementById("drawCanvas").toDataURL("image/png", 0.2);
    var block = $("<div class='block'><p class='center'>You posted a sketch.</p><div class='imageWrapper center'><img src='"+img+"' class='pgImage'/></div><p class='center time'>Posted on "+currentDate+"</p></div>");
    $("#messages").append(block.hide().fadeIn(500));
    $("#submitCanvas").unbind();
    this.ajaxFormJSON(  
    {
        canvasPicture: img,
        date: new Date()
    },
    '/db/canvasSave',
    function success(data){
        alert("saved")
        console.log("saved the message");
    },
    function error(xhr, status, err){
        alert("crap");
        alert(JSON.stringify(err));
    });
    

}

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

App.prototype.audioCapture = function()
{
    $('#newTextMessage').hide();

     navigator.device.capture.captureAudio(function(audioData)
        {
            var currentDate = new Date();
            $("#messages").append("<div class='block'><p class='center'>You posted an audio clip.</p><p class='center playAudio'>Tap here to listen!</p><p class='center time'>Posted on "+currentDate+"</p></div>");
            var file = new Media(audioData[0].fullPath);
            alert(file);
            $(".playAudio").click(function(){
                file.play();
            }); 
            this.ajaxFormJSON(  
            {
                audio: audioData[0].fullPath,
                date: new Date()
            },
            '/db/saveAudio',
            function success(data){
                console.log("audio has been saved in the database")
            },
            function error(xhr, status, err){
                alert(JSON.stringify(err));
            });
        }.bind(this), function(msg){
            //alert(msg);
        },
        {
            limit: 1     
        }   
     );
}

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

App.prototype.registerRegister = function(){
    $('#createAccButton').click(function(){
        var username = $('#unInput').val();
        var password = $('#pwInput').val();
        var email = $('#emailInput').val();
        var othersEmail = $('#otherEmailInput').val();
        var fullName = $('#nInput').val();
        var birthday = $('#birthdayInput').val();
        var startDating = $('#startDateInput').val();
        var gender = $('#genderInput').val(); 

        console.log("comes to register");
        console.log("username: "+username);
        console.log("password: "+password);

        
        this.ajaxFormJSON(  
                {
                    username: username,
                    password: password,
                    email: email,
                    othersEmail: othersEmail,
                    fullName: fullName,
                    birthday: birthday,
                    startDating: startDating,
                    gender: gender,
                    date: new Date()
                },
                '/register',
                function success(data){
                    // alert(JSON.stringify(data));
                    if(data == 'user exists')
                    {
                        alert("user exists");
                      $.mobile.changePage($("#signup"));
                    }
                    else
                    { 
                    alert("swag");
                      $.mobile.changePage($("#home"));
                    }

                },
                function error(xhr, status, err){
                    alert(JSON.stringify(err));
                });
    }.bind(this));
}

function validateInfoForm(){

    var unFlag, gFlag, pFlag, eFlag, bFlag, oeFlag, dFlag = false;
    if ($('#unInput').val() == ""){
        $('#unInput').css('background-color', '#DEE0E0');
        unFlag = true;
    }

    else {
        $('#unInput').css('background-color', 'white');
        unFlag = false;
    }
    
    if (($('#pwInput').val().length < 8)){
        $('#pwInput').css('background-color', '#DEE0E0');
        pFlag = true;
    }
    else {
        $('#pwInput').css('background-color', 'white');
        pFlag = false;
    }

    if ($('#nInput').val() == ""){
        $('#nInput').css('background-color', '#DEE0E0');
        nFlag = true;
    }

    else {
        $('#nInput').css('background-color', 'white');
        nFlag = false;
    }

    if (!isEmail($('#emailInput').val())){
        $('#emailInput').css('background-color', '#DEE0E0');
        eFlag = true;
    }
    else {
        $('#emailInput').css('background-color', 'white');
        eFlag = false;
    }

    if ($('#birthdayInput').val() == ""){
        $('#birthdayInput').css('background-color', '#DEE0E0');
        bFlag = true;
    }
    else {
        $('#birthdayInput').css('background-color', 'white');
        bFlag = false;
    }

    if ($('#genderInput').val() == ""){
        $('#otherEmailInput').css('background-color', '#DEE0E0');
        gFlag = true;
    }
    else {
        $('#otherEmailInput').css('background-color', 'white');
        gFlag = false;
    }

    if (!isEmail($('#otherEmailInput').val())){
        $('#otherEmailInput').css('background-color', '#DEE0E0');
        oeFlag = true;
    }
    else {
        $('#otherEmailInput').css('background-color', 'white');
        oeFlag = false;
    }

    if ($('#startDateInput').val() == ""){
        $('#startDateInput').css('background-color', '#DEE0E0');
        dFlag = true;
    }
    else {
        $('#startDateInput').css('background-color', 'white');
        dFlag = false;
    }

    errorFlag = unFlag || nFlag || gFlag || pFlag || eFlag || bFlag || oeFlag || dFlag; 

    if (!errorFlag) {
        location.replace('./#homescreen');
        errorFlag = false; 
    }

    return (!errorFlag);
}

App.prototype.ajaxFormJSON = function(json, url, onSuccess, onError){
    var data = new FormData();

    console.log("json: "+json.toString());
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

App.prototype.registerLogin = function(){
    $('#submitSignIn').click(function(){
        var username = $('#usernameInput').val();
        var password = $('#passwordInput').val();

        // var data = new FormData();
        // data.append('username', username);
        // data.append('password', password);
        this.ajaxFormJSON(  
                {   
                    username: username,
                    password: password,
                },
                '/login',
                function success(data){
                    console.log("data: "+data);
                    current = 0;
                    partner = 0;
                    // window.location = '/';
                    for(var i = 0; i < data.length; i++)
                    {
                        console.log("user: "+data[i].user + " message: "+data[i].msg);
                        if(data[i].user === username){
                            if(data[i].typeRegister == true)
                            {
                                $('#myName').text(data[i].user);
                                $('#startDating').text(data[i].startDating);
                                $('#timeSpent').text('crap');
                            }
                            else if(data[i].typeMood == true)
                            {
                                var mood = data[i].mood;
                                var status = data[i].statuses;
                                $('#myMood').text(mood);
                                $('#myStatus').text(status);
                            }
                            else if(data[i].typeText == true)
                            {
                                var myMsg = $("<div class='myMsg block'><div class='ui-grid-a bottomPadding'><div class='ui-block-a left chatPic'><img class='profilePicSmall' src='/images/profilePicF.png' /></div><div class='ui-block-b right chatText'>" + data[i].msg + "</div></div><p class='center time'>Posted on "+data[i].date+"</p></div>");      
                                $('#messages').append(myMsg.hide().fadeIn(500));
                            }
                            else if(data[i].typePhoto == true)
                            {
                                var block = $("<div class='block'><p class='center'>You posted a picture.</p><div class='imageWrapper center'><img src='data:image/jpeg;base64,"+data[i].photoStr+"' class='pgImage'/></div><p class='center time'>Posted on "+data[i].date+"</p></div>");
                                $("#messages").append(block.hide().fadeIn(500));
                            }
                            else if(data[i].typeVoice == true)
                            {
                                $("#messages").append("<div class='block'><p class='center'>You posted an audio clip.</p><p class='center playAudio'>Tap here to listen!</p><p class='center time'>Posted on "+data[i].date+"</p></div>");
                                var file = new Media(data[i].audio);
                                $(".playAudio").click(function(){
                                    file.play();
                                });
                            }
                            else if(data[i].typeMap == true)
                            {
                                // alert(data[i].latitude);
                                $("#messages").append("<div class='block'><p class='center'>You posted your location.</p><div class='imageWrapper center'><img src='http://maps.googleapis.com/maps/api/staticmap?size=400x400&maptype=roadmap&markers="+data[i].latitude+","+data[i].longitude+"&sensor=true' class='pgImage'/></div><p class='center time'>Posted on "+data[i].date+"</p></div>");
                            }
                            else if(data[i].typeCanvas == true)
                            {
                                // alert(data[i].canvasImage.length);
                                var block = $("<div class='block'><p class='center'>You posted a sketch.</p><div class='imageWrapper center'><img src='"+data[i].canvasImage+"' class='pgImage'/></div><p class='center time'>Posted on "+data[i].date+"</p></div>");
                                $("#messages").append(block.hide().fadeIn(500));
                            }
                        }
                        //DO IT FOR THE OTHER PERSON
                        else
                        {
                            if(data[i].typeRegister == true)
                            {
                                $('#otherName').text(data[i].user);
                            }
                            else if(data[i].typeMood == true)
                            {
                                var mood = data[i].mood;
                                var status = data[i].statuses;
                                $('#myMood').text(mood);
                                $('#myStatus').text(status);
                            }
                            else if(data[i].typeText == true)
                            {
                                var otherMsg = $("<div class='otherMsg block'><div class='ui-grid-a bottomPadding'><div class='ui-block-a left chatText'>"+ data[i].msg + "</div><div class='ui-block-b right chatPic'><img class='profilePicSmall' src='/images/profilePicM.jpg' /></div></div><p class='center time'>Posted on "+data[i].date+"</p></div>");      
                                $('#messages').append(otherMsg.hide().fadeIn(500));
                            }
                            else if(data[i].typePhoto == true)
                            {
                                var block = $("<div class='block'><p class='center'>Your partner posted a picture.</p><div class='imageWrapper center'><img src='data:image/jpeg;base64,"+data[i].photoStr+"' class='pgImage'/></div><p class='center time'>Posted on "+data[i].date+"</p></div>");
                                $("#messages").append(block.hide().fadeIn(500));
                            }
                            else if(data[i].typeVoice == true)
                            {
                                $("#messages").append("<div class='block'><p class='center'>Your partner posted an audio clip.</p><p class='center playAudio'>Tap here to listen!</p><p class='center time'>Posted on "+data[i].date+"</p></div>");
                                var file = new Media(data[i].audio);
                                $(".playAudio").click(function(){
                                    file.play();
                                });
                            }
                            else if(data[i].typeMap == true)
                            {
                                // alert(data[i].latitude);
                                $("#messages").append("<div class='block'><p class='center'>Your partner posted the location.</p><div class='imageWrapper center'><img src='http://maps.googleapis.com/maps/api/staticmap?size=400x400&maptype=roadmap&markers="+data[i].latitude+","+data[i].longitude+"&sensor=true' class='pgImage'/></div><p class='center time'>Posted on "+data[i].date+"</p></div>");
                            }
                            else if(data[i].typeCanvas == true)
                            {
                                // alert(data[i].canvasImage.length);
                                var block = $("<div class='block'><p class='center'>Your partner posted a sketch.</p><div class='imageWrapper center'><img src='"+data[i].canvasImage+"' class='pgImage'/></div><p class='center time'>Posted on "+data[i].date+"</p></div>");
                                $("#messages").append(block.hide().fadeIn(500));
                            }
                        }
                    }
                    
                    $.mobile.changePage($("#homescreen"));
                    // alert("window.location: "+window.location);
                    
                },
                function error(xhr, status, err){
                    alert(JSON.stringify(err));
                    console.log("error: "+err);
                    $.mobile.changePage($("#home"));
                });
    }.bind(this));


}


