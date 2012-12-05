var login = function(){
	console.log(this);
	this.setup(); 	
};

login.prototype.setup = function(){
	var notificationFlag = true;

	setTimeout(function(){$.mobile.changePage($("#home"));}, 500);
	$.mobile.page.prototype.options.backBtnTheme = "d";
	$('#signUpButton').on('tap', function(){$.mobile.changePage($("#signup"));})
	
	$(document).delegate("#playground", "pageinit", function(){
                    console.log("HERE");
                    new Playground();
                });
	
	$('#createAccButton').on('tap', function(){
		if (validateInfoForm())$.mobile.changePage("#homescreen");
		loadProfPage();
	});
	
	function loadProfPage(){
		$('#myName').text($('#nInput').val());
		$('#myBD').text($('#birthdayInput').val());
	}

	$('.notificationsBox').swiperight(function(){
		if (notificationFlag){
			$('.notificationContent').fadeOut(100,function(){
				var item = $('<div class="noNew"><p class="center">No new notifications.</p></div>');
				$('.notificationsBox').append(item.hide().fadeIn(500));
			});
			notificationFlag = false;
		}
	});

	/* Update Mood/Status */
	$('#submitUpdate').on('tap', function(){
		updateProfPage();
	});

	$('#statusField').bind('keypress', function(e) {if (e.keyCode == 13) {
		e.preventDefault();
		if (!($('#statusField').val() == ''))
			updateProfPage();
	}});

	function updateProfPage(){
		if (!$('#moodField').val() == '')
			$('#myMood').text($('#moodField').val());
		else
			$('#myMood').text('Not set');
		if (!$('#statusField').val() == '')
			$('#myStatus').text($('#statusField').val());
		$('#popupUpdate').popup("close")
	}
	/* End of section*/

	function validateInfoForm(){

		var unFlag, gFlag, pFlag, eFlag, bFlag, oeFlag, dFlag = false;
		if ($('#unInput').val() == ""){
			$('#unInput').css('background-color', '#DEE0E0');
			unFlag = true;
		}

		else {
			$('#unInput').css('background-color', 'white');
			unFlag = false;
		}
		
		if (($('#pwInput').val().length < 8)){
			$('#pwInput').css('background-color', '#DEE0E0');
			pFlag = true;
		}
		else {
			$('#pwInput').css('background-color', 'white');
			pFlag = false;
		}

		if ($('#nInput').val() == ""){
			$('#nInput').css('background-color', '#DEE0E0');
			nFlag = true;
		}

		else {
			$('#nInput').css('background-color', 'white');
			nFlag = false;
		}

		if (!isEmail($('#emailInput').val())){
			$('#emailInput').css('background-color', '#DEE0E0');
			eFlag = true;
		}
		else {
			$('#emailInput').css('background-color', 'white');
			eFlag = false;
		}

		if ($('#birthdayInput').val() == ""){
			$('#birthdayInput').css('background-color', '#DEE0E0');
			bFlag = true;
		}
		else {
			$('#birthdayInput').css('background-color', 'white');
			bFlag = false;
		}

		if ($('#genderInput').val() == ""){
			$('#otherEmailInput').css('background-color', '#DEE0E0');
			gFlag = true;
		}
		else {
			$('#otherEmailInput').css('background-color', 'white');
			gFlag = false;
		}

		if (!isEmail($('#otherEmailInput').val())){
			$('#otherEmailInput').css('background-color', '#DEE0E0');
			oeFlag = true;
		}
		else {
			$('#otherEmailInput').css('background-color', 'white');
			oeFlag = false;
		}

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

	function isEmail(str){
		if (!str) return false;
		if (str.indexOf('@') < 0) return false; 
		str = str.substring(str.indexOf('@'));
		if (str.indexOf('.') < 0) return false; 
		return true;
	}


};


	function timeSpentTogether(){
		var mins=1000*60;
		var hrs=mins*60;
		var dys=hrs*24;
		var yrs=dys*365;
		if (!($('#startDateInput').val() == "")){
			var sdInput = $('#startDateInput').val();
			var year = parseInt(sdInput.substring(0,4));
			console.log('years:' + year);
			var month = parseInt(sdInput.substring(5,7));
			console.log('months:' + month);
			var date = parseInt(sdInput.substring(8));
			console.log('days:' + date);
			var startDate = new Date(year, month+1, date, 0, 0);
			console.log('startDate:' + startDate);
			var current = new Date();
			console.log('current:'+ current);
			console.log(current.getTime());
			var diff = current.getTime() - startDate.getTime();
			alert(diff/dys);
		}
	}