var login = function(){
	this.setup(); 	
};

login.prototype.setup = function(){
	var notificationFlag = true;

	//display splash screen 
	setTimeout(function(){$.mobile.changePage($("#home"));}, 500);

	$('#signUpButton').on('tap', function(){$.mobile.changePage($("#signup"));})	

	/* Set up playground on load*/
	$(document).delegate("#playground", "pageinit", function(){
        console.log("HERE");
        new Playground();
    });

	/* Validate form and load profile page */
	$('#createAccButton').on('tap', function(){
		if (validateInfoForm())
			$.mobile.changePage("#homescreen");
		loadProfPage();
	});

	/* Load name based on sign up (until server fully merged) */
	function loadProfPage(){
		$('#myName').text($('#nInput').val());
	}

	/* Swipe away notifications */
	$('.notificationsBox').swiperight(function(){
		if (notificationFlag){
			$('.notificationContent').fadeOut(100,function(){
				var item = $('<div class="noNew"><p class="center">No new notifications.</p></div>');
				$('.notificationsBox').append(item.hide().fadeIn(500));
			});
			notificationFlag = false;
		}
	});

	/* Update Mood */
	$('#submitUpdate').on('tap', function(){
		updateProfPage();
	});

	/* Update Status */
	$('#statusField').bind('keypress', function(e) {
		if (e.keyCode == 13) {
			e.preventDefault();
			if (!($('#statusField').val() == ''))
				updateProfPage();
		}
	});

	/* Update profile page (mood,status)*/
	function updateProfPage(){
		if (!$('#moodField').val() == '')
			$('#myMood').text($('#moodField').val());
		else
			$('#myMood').text('Not set');
		if (!$('#statusField').val() == '')
			$('#myStatus').text($('#statusField').val());
		$('#popupUpdate').popup("close")
	}

	/* Validate Sign up Form */
	function validateInfoForm(){

		var unFlag, gFlag, pFlag, eFlag, bFlag, oeFlag, dFlag = false;
		
		/* Username */
		if ($('#unInput').val() == ""){
			$('#unInput').css('background-color', '#DEE0E0');
			unFlag = true;
		}
		else {
			$('#unInput').css('background-color', 'white');
			unFlag = false;
		}
		
		/* Password */
		if (($('#pwInput').val().length < 8)){
			$('#pwInput').css('background-color', '#DEE0E0');
			pFlag = true;
		}
		else {
			$('#pwInput').css('background-color', 'white');
			pFlag = false;
		}

		/* Name */
		if ($('#nInput').val() == ""){
			$('#nInput').css('background-color', '#DEE0E0');
			nFlag = true;
		}
		else {
			$('#nInput').css('background-color', 'white');
			nFlag = false;
		}

		/* Email */
		if (!isEmail($('#emailInput').val())){
			$('#emailInput').css('background-color', '#DEE0E0');
			eFlag = true;
		}
		else {
			$('#emailInput').css('background-color', 'white');
			eFlag = false;
		}

		/* Birthday */
		if ($('#birthdayInput').val() == ""){
			$('#birthdayInput').css('background-color', '#DEE0E0');
			bFlag = true;
		}
		else {
			$('#birthdayInput').css('background-color', 'white');
			bFlag = false;
		}

		/* Gender */
		if ($('#genderInput').val() == ""){
			$('#otherEmailInput').css('background-color', '#DEE0E0');
			gFlag = true;
		}
		else {
			$('#otherEmailInput').css('background-color', 'white');
			gFlag = false;
		}

		/* Significant other's email */
		if (!isEmail($('#otherEmailInput').val())){
			$('#otherEmailInput').css('background-color', '#DEE0E0');
			oeFlag = true;
		}
		else {
			$('#otherEmailInput').css('background-color', 'white');
			oeFlag = false;
		}

		/* Dating since */
		if ($('#startDateInput').val() == ""){
			$('#startDateInput').css('background-color', '#DEE0E0');
			dFlag = true;
		}
		else {
			$('#startDateInput').css('background-color', 'white');
			dFlag = false;
		}

		errorFlag = unFlag || nFlag || gFlag || pFlag || eFlag || bFlag || oeFlag || dFlag; 

		if (!errorFlag) {
			location.replace('./#homescreen');
			errorFlag = false; 
		}

		return (!errorFlag);
	}

	/* Basic email validation : Checks for '@' and '.' */
	function isEmail(str){
		if (!str) return false;
		if (str.indexOf('@') < 0) return false; 
		str = str.substring(str.indexOf('@'));
		if (str.indexOf('.') < 0) return false; 
		return true;
	}

};