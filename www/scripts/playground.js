var Playground = function() {

    document.addEventListener('deviceReady', function(){

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
        
        $('#addPicture').tap(function() {
            $('#newTextMessage').hide();
            
            var destinationType = navigator.camera.DestinationType;
            var pictureSource = navigator.camera.PictureSourceType;
        
            navigator.camera.getPicture(success, fail,
                {
                    quality: 75,
                    destinationType: destinationType.DATA_URL,
                    sourceType: pictureSource
                }
             );
            
            function success(pic) {
                var picture = $("#pictureTest")
                picture.attr('src', 'data:image/jpeg;base64,' + pic);
            };
            
            function fail(msg) {
                alert(msg);
            };
        });
        
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
                alert(msg);
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
                var file = new Media(audioData[0].fullPath); 
                $("#audioHolder").click(function(){
                    file.play();
                });         
            };
            
            function fail(msg) {
                alert(msg);
            };            
            
        });
    
        function submitPost(){
            $('#messages').append("<div class='otherMsg'>"+ $('#newTextMessage input').val() + "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<img class='profilePic' src='/images/profilePicM.png' /> </div>");
            $('#messages').append("<div class='myMsg'><img class='profilePic' src='/images/profilePicF.png' />" + $('#newTextMessage input').val() + "</div>");
            $('#messageInput').val("");
        };
    });
};