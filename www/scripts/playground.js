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
};