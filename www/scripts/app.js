var login = function(){
	console.log(this);
	this.setup(); 	
};

login.prototype.setup = function(){
	setTimeout(function(){$.mobile.changePage($("#home"));}, 2000);
	$('#submitSignIn').on('click', function(){this.validateSignIn()}.bind(this));
	$.mobile.page.prototype.options.backBtnTheme = "d";
	$('#notificationWarn').on('click', function(){$("#disclaimer").popup()});
	$('#signUpButton').on('tap', function(){$.mobile.changePage($("#signup"));})
	$('#createAccButton').on('click', function(){$.mobile.changePage("homescreen.html")});
};
