var Playground = function() {
    $('#addText').tap(function() {
        $('#newTextMessage').show();
        $('#newTextMessage input').focus();
    });
    
    $('#addVideo').tap(function() {
        $('#newTextMessage').hide();
    });
    
    $('#addVoice').tap(function() {
        $('#newTextMessage').hide();
    });
    
    $('#addPicture').tap(function() {
        $('#newTextMessage').hide();
    });
    
    $('.cancelPost').tap(function() {
        $('#newTextMessage').hide();
    });
    
    $('#newTextMessagePost').tap(function() {
        $('#newTextMessage').hide();
        $('#messages').prepend("<div><img src='/images/profilePicF.png' />" + $('#newTextMessage input').val() + "</div>");
        $('#newTextMessage input').val("");
        
    });
    
    $('#addPicture').tap(function() {
        alert(navigator.camera);
        var destinationType = navigator.camera.DestinationType;
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
};