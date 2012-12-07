var Playground = function() {

    //Add text message
    $('#addText').tap(function(e) {
        $('#newTextMessage').show();
        $('#newTextMessage input').focus();
    });
   
   //cancels text message    
   $('.cancelPost').tap(function() {
        $('#newTextMessage input').val("");
        $('#newTextMessage').hide();
    });
    
    $('#newTextMessagePost').tap(function() {
        submitPost();
    }); 

    //submit on 'enter'
    $('#messageInput').bind('keypress', function(e) {
        if (e.keyCode == 13) submitPost();
    });

    //submits new text message and creates card on DOM
    function submitPost(){
        if (!($('#messageInput').val() === '')){
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

    //draws canvas
    $("#addCanvas").on('tap',function(){
        var width = $('#drawCanvas').width();
        var height = $('#drawCanvas').height();
        var canvas = $('#drawCanvas'); 
        var ctx = document.getElementById('drawCanvas').getContext('2d');
        ctx.fillStyle = 'rgb(255,255,255)';
        
        ctx.fillRect(0,0,350,350);
        ctx.strokeStyle = 'rgb(0,0,0)';
        
        //returns user's xy coordinates on canvas
        function getXY(ev){
            return {
                x: ev.pageX,
                y: ev.pageY
            };
        };
        
        //allow user to draw line
        canvas.bind('touchstart', function (event) {   
            var xy = getXY(event.originalEvent.touches[0]);  
            ctx.beginPath();
            ctx.moveTo(xy.x, xy.y - 60);
            event.preventDefault();
            return false;  
        });
        
        canvas.bind('touchmove', function (event) {
            var xy = getXY(event.originalEvent.touches[0]);
            ctx.lineTo(xy.x, xy.y -60);
            ctx.stroke();
            event.preventDefault();
            return false;
        }); 
        
        canvas.bind('touchend', function(event) {
            ctx.closePath(); 
            event.preventDefault();
            return false;
        });
        
        //saves current canvas as image and adds to DOM on card
        $("#submitCanvas").tap(function() {
            var currentDate = new Date();
            var img = document.getElementById("drawCanvas").toDataURL("image/png");
            var block = $("<div class='block'><p class='center'>You posted a sketch.</p><div class='imageWrapper center'><img src='"+img+"' class='pgImage'/></div><p class='center time'>Posted on "+currentDate+"</p></div>");
            $("#messages").append(block.hide().fadeIn(500));
            $("#submitCanvas").unbind();    
        });
                        
        //allow user to change color of canvas stroke
        $("#colorPicker input").change(function(e) {
            //remove old listeners
            $("#drawCanvas").unbind();
        
            ctx.strokeStyle = e.target.value.toString();
            
            //add new listeners to draw lines
            canvas.bind('touchstart', function (event) {
                var xy = getXY(event.originalEvent.touches[0]);
                ctx.beginPath();
                ctx.moveTo(xy.x, xy.y - 60);
                event.preventDefault();
                return false;
            });
            
            canvas.bind('touchmove', function (event) {
                var xy = getXY(event.originalEvent.touches[0]); 
                ctx.lineTo(xy.x, xy.y -60);
                ctx.stroke();
                event.preventDefault();
                return false;
            }); 
            
            canvas.bind('touchend', function(event) {
                ctx.closePath(); 
                event.preventDefault();
                return false;
            });
        });    
    });


    /*PHONEGAP STUFF*/
    document.addEventListener('deviceReady', function(){
        
        //gets user's current location and adds to DOM on card
        $("#addLocation").tap(function() {
            $('#newTextMessage').hide();
            
            navigator.geolocation.getCurrentPosition(success, fail, {maximumAge: 3000, timeout: 50000, enableHighAccuracy: true});
            
            function success(pos){
                var lat = pos.coords.latitude;
                var lon = pos.coords.longitude;
                drawMap(lat, lon);
            };
            
            function fail(error){
                alert(error.code);
            };   
            
            //request to Google Maps    
            function drawMap(lat, lon) {
                var currentDate = new Date();
                $("#messages").append("<div class='block'><p class='center'>You posted your location.</p><div class='imageWrapper center'><img src='http://maps.googleapis.com/maps/api/staticmap?size=400x400&maptype=roadmap&markers="+lat+","+lon+"&sensor=true' class='pgImage'/></div><p class='center time'>Posted on "+currentDate+"</p></div>");         
            };
        });
        
        //allows user to take new photo with camera
        $('#cameraSource').tap(function() {
            $('#newTextMessage').hide();
            
            getPhoto(navigator.camera.PictureSourceType.CAMERA);
        }); 
        
        //allows user to select photo from library
        $('#librarySource').tap(function() {
            $('#newTextMessage').hide();
            
            getPhoto(navigator.camera.PictureSourceType.PHOTOLIBRARY);
        }); 
        
        //retrieves photo based on user's input selection
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
        
        //allows user to record audio message        
        $('#addVoice').tap(function() {
            $('#newTextMessage').hide();

             navigator.device.capture.captureAudio(success, fail,
                {
                    limit: 1     
                }   
             );
            
            //adds audio to the DOM on card
            function success(audioData){
                var currentDate = new Date();
                $("#messages").append("<div class='block'><p class='center'>You posted an audio clip.</p><p class='center playAudio'>Tap here to listen!</p><p class='center time'>Posted on "+currentDate+"</p></div>");
                var file = new Media(audioData[0].fullPath); 
                $(".playAudio").tap(function(){
                    file.play();
                });         
            };
            
            function fail(msg) {
                alert(msg);
            };            
            
        });
        
    }, false);          
    
};