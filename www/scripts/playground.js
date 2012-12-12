var Playground = function() {

    /*TEXTS*/
    // $('#addText').tap(function(e) {
    //     alert("crap");
    //     $('#newTextMessage').show();
    //     $('#newTextMessage input').focus();
    // });
       
   $('.cancelPost').tap(function() {
        $('#newTextMessage input').val("");
        $('#newTextMessage').hide();
    });


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
};