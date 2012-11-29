var Playground = function() {
    $('#addText').tap(function(e) {
        $('#newTextMessage').show();
        $('#newTextMessage input').focus();
    });
    
    $('#addVideo').tap(function() {
        $('#newTextMessage').hide();
    });
    
    $('#addVoice').tap(function() {
        $('#newTextMessage').hide();
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
        var destinationType = navigator.Camera.DestinationType;
        alert(destinationType);
        var pictureSource = navigator.camera.PictureSourceType;
    
        navigator.camera.getPicture(success, fail,
            {
                quality: 75,
                destinationType: destinationType.DATA_URL
            }
         );
        
        function success(pic) {
            alert(pic);
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
};