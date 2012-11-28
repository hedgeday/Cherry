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
        $('#newTextMessage input').val("");
        $('#newTextMessage').hide();
    });
    
    $('#newTextMessagePost').tap(function() {
        submitPost();
    });

    $('#messageInput').bind('keypress', function(e) {
        if (e.keyCode == 13) submitPost();
    });

    function submitPost(){
        $('#messages').append("<div class='otherMsg'>"+ $('#newTextMessage input').val() + "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<img class='profilePic' src='/images/profilePicM.png' /> </div>");
        $('#messages').append("<div class='myMsg'><img class='profilePic' src='/images/profilePicF.png' />" + $('#newTextMessage input').val() + "</div>");
        $('#messageInput').val("");
    }
};