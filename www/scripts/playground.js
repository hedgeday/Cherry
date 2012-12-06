var Playground = function() {

    /*TEXTS*/
    $('#addText').tap(function(e) {
        $('#newTextMessage').show();
        $('#newTextMessage input').focus();
    });
       
   $('.cancelPost').tap(function() {
        $('#newTextMessage input').val("");
        $('#newTextMessage').hide();
    });
    
    $('#newTextMessagePost').tap(function() {
        submitPost();
    }); 

    $('#messageInput').bind('keypress', function(e) {
        if (e.keyCode == 13) submitPost();
    });

    // $("[data-role=header]").fixedtoolbar({ tapToggle: true });
    // $("[data-role=footer]").fixedtoolbar({ tapToggle: true });

    function submitPost(){
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
    };


    /*PHONE STUFF*/
    document.addEventListener('deviceReady', function(){
                
            //google maps
        $("#addLocation").tap(function() {
            $('#newTextMessage').hide();
            
            navigator.geolocation.getCurrentPosition(success, fail, {maximumAge: 3000, timeout: 5000, enableHighAccuracy: true});
            
            function success(pos){
                var lat = pos.coords.latitude;
                var lon = pos.coords.longitude;
                drawMap(lat, lon);
            };
            
            function fail(error){
                $("#map_canvas").html("<p>Code:" + error.code + "</p>");
            };   
            
                
            function drawMap(lat, lon) {
                var currentDate = new Date();
                $("#messages").append("<div class='block'><p class='center'>You posted your location.</p><div class='imageWrapper center'><img src='http://maps.googleapis.com/maps/api/staticmap?size=400x400&maptype=roadmap&markers="+lat+","+lon+"&sensor=true' class='pgImage'/></div><p class='center time'>Posted on "+currentDate+"</p></div>");           
            };
        });
        
        $('#cameraSource').tap(function() {
            $('#newTextMessage').hide();
            
            getPhoto(navigator.camera.PictureSourceType.CAMERA);
        }); 
        
        $('#librarySource').tap(function() {
            $('#newTextMessage').hide();
            
            getPhoto(navigator.camera.PictureSourceType.PHOTOLIBRARY);
        }); 
        
        function getPhoto(source){
          
            navigator.camera.getPicture(success, fail,
                {
                    quality: 75,
                    destinationType: navigator.camera.DestinationType.DATA_URL,
                    sourceType: source
                }
             );
            
            function success(pic) {
                var currentDate = new Date();
                var block = $("<div class='block'><p class='center'>You posted a picture.</p><div class='imageWrapper center'><img src='data:image/jpeg;base64,"+pic+"' class='pgImage'/></div><p class='center time'>Posted on "+currentDate+"</p></div>");
                $("#messages").append(block.hide().fadeIn(500));
            };
            
            function fail(msg) {
                alert(msg);
            };
        };
        
        $('#addVideo').tap(function() {
            $('#newTextMessage').hide();
            
             navigator.device.capture.captureVideo(success, fail,
                {
                    limit: 1     
                }   
             );
            
            function success(vidData){
                alert(vidData[0].type);
                $("#videoHolder").html("<video width='250' height='300' controls='controls'><source src='" + vidData[0].fullPath + "' type='" + vidData[0].type + "'></video>");                
            };
            
            function fail(msg) {
                // alert(msg);
            };
        });
        
        $('#addVoice').tap(function() {
            $('#newTextMessage').hide();

             navigator.device.capture.captureAudio(success, fail,
                {
                    limit: 1     
                }   
             );
            
            function success(audioData){
                var currentDate = new Date();
                $("#messages").append("<div class='block'><p class='center'>You posted an audio clip.</p><p class='center playAudio'>Tap here to listen!</p><p class='center time'>Posted on "+currentDate+"</p></div>");
                var file = new Media(audioData[0].fullPath); 
                $(".playAudio").click(function(){
                    file.play();
                });         
            };
            
            function fail(msg) {
                // alert(msg);
            };            
            
        });
        
    }, false);//event listener           
    
};