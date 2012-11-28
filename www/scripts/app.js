var login = function(){
	console.log(this);
	this.setup(); 	
};

login.prototype.setup = function(){
	setTimeout(function(){$.mobile.changePage($("#home"));}, 500);
	$('#submitSignIn').on('tap', function(){this.validateSignIn()}.bind(this));
	$.mobile.page.prototype.options.backBtnTheme = "d";
	$('#notificationWarn').on('tap', function(){$("#disclaimer").popup()});
	$('#signUpButton').on('tap', function(){$.mobile.changePage($("#signup"));})
	$('#createAccButton').on('tap', function(){$.mobile.changePage("#homescreen")});
	$(document).delegate("#playground", "pageinit", function(){
                    console.log("HERE");
                    new Playground();
                });
	$('#submitFriend').bind('keypress', function(e) {if (e.keyCode == 13) e.preventDefault();});
};

