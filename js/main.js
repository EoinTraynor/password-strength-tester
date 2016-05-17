$(document).ready(function() {

	// create global variables
	var score, complexity, uppercase, lowercase, numbers, symbols, overEightChar;
	// identify url for AJAX requests
	var rootURL = "http://localhost:3000/stats";
	// AJAX GET request for all data in database
	getAll();

	// allows drag and drop functionality to the table
	$('tbody').sortable();

	// monitor the password input field
	// select element by attribute
	var input = $( "input" );
	// event keyup is placed on input object
	// each time event takes place handler will be called
	input.keyup(function() {
		//stores the value of the input
		var value = $( this ).val();

		// select element by ID
		// pass the input value to calculate the score
		// manipulate the DOM: insert result in appropriate table column
		score = scorePassword(value);
		$("#score_value").text(score);

		// pass the score to calculate the complexity
		// manipulate the DOM: insert result in appropriate table column
		complexity = checkPassStrength(score);
		$("#complexity_value").text(complexity);

		// pass the input value to calculate the num of uppercase
		// manipulate the DOM: insert result in appropriate table column
		uppercase = checkUppercase(value);
		$("#uppercase_value").text(uppercase);

		// pass the input value to calculate the num of uppercase
		// manipulate the DOM: insert result in appropriate table column
		lowercase = checkLowercase(value);
		$("#lowercase_value").text(lowercase);

		// pass the input value to calculate the num of uppercase
		// manipulate the DOM: insert result in appropriate table column
		numbers = checkNumbers(value);
		$("#numbers_value").text(numbers);

		// pass the input value to calculate the num of uppercase
		// manipulate the DOM: insert result in appropriate table column
		symbols = checkSymbols(value);
		$("#symbols_value").text(symbols);

		// pass the input value to calculate the num of uppercase
		// manipulate the DOM: insert result in appropriate table column
		overEightChar = checkCharLength(value);
		$("#char_length_value").text(overEightChar);
	})
	.keyup();

	// each function calculatea and returna result
	function scorePassword(pass) {
		var score = 0;
		if (!pass)
			return score;

		// award every unique letter until 5 repetitions
		var letters = new Object();
		for (var i=0; i<pass.length; i++) {
			letters[pass[i]] = (letters[pass[i]] || 0) + 1;
			score += 5.0 / letters[pass[i]];
		}

		// bonus points for mixing it up
		var variations = {
			digits: /\d/.test(pass),
			lower: /[a-z]/.test(pass),
			upper: /[A-Z]/.test(pass),
			nonWords: /\W/.test(pass),
		}

		variationCount = 0;
		for (var check in variations) {
			variationCount += (variations[check] == true) ? 1 : 0;
		}
		score += (variationCount - 1) * 10;

		return parseInt(score);
	}

	function checkPassStrength(score) {
		if (score > 80)
			return "very strong";
		if (score > 60)
			return "strong";
		if (score > 40)
			return "good";
		if (score > 20)
			return "weak";
		if (score >= 0)
			return "very weak";

		return "";
	}

	function checkUppercase(pass) {
		return (/[A-Z]/.test(pass));
	}

	function checkLowercase(pass) {
		return (/[a-z]/.test(pass));
	}

	function checkNumbers(pass) {
		return (/\d/.test(pass));
	}

	function checkSymbols(pass) {
		return (/\W/.test(pass));
	}

	function checkCharLength(pass) {
		if (pass.length > 7) {
			return true;
		}
		else {
			return false;
		}
	}

	// event click is placed on DOM element button
	// each time event takes place handler will be called
	$('#submit_button').click(function() {
		console.log(uppercase ? 1:0, lowercase ? 1:0, numbers ? 1:0, symbols ? 1:0, overEightChar ? 1:0);
		console.log(dataToJSON());
		// validates if there is a value in the input field
		if (input.val()) {
			// AJAX request
			// on button click 'POST' request will be sent
			// containing current values within the table
			$.ajax({
				type: "POST",
				contentType: 'application/json',
				url: rootURL,
				dataType: "json",
				data: dataToJSON(),
				// if request is successful sent
				success: function(data, textStatus, jqXHR){
					alert('Stats Added');
				},
				// if request is unsuccessful
				error: function(jqXHR, textStatus, errorThrow){
					alert('error: ' + errorThrow);
				}
			});
			getAll();
			$("#showhide").hide();
		}
		// if no value, insert feedback into span element 'require_input'
		else {
			$('#require_input').text('* Requires Input');
		}
	});

	function getAll() {
		console.log("get All");
		// AJAX request
		// when getAll function is called a 'GET' request
		// will be sent retrieving the contents of the database table
		$.ajax({
			type: 'GET',
			url: rootURL,
			// specify the response type
			dataType: "json",
			// log the returned json upon successful recipt
			success: responseHandler
		});
	}

	function responseHandler(json) {
		console.log("responseHandler");
		console.log(json.site);


		$.each(json.site, function(i, item) {
			var $tr = $('<tr>').append(
				$('<td>').text(item.score),
				$('<td>').text(item.complexity),
				$('<td>').text(boolIntToString(item.uppercase)),
				$('<td>').text(boolIntToString(item.lowercase)),
				$('<td>').text(boolIntToString(item.numbers)),
				$('<td>').text(boolIntToString(item.symbols)),
				$('<td>').text(boolIntToString(item.over_eight_char))
			);
			$('#display_stats').append($tr);
		});
	};

	function boolIntToString(value) {
		if (value == 1) {
			return true;
		}
		else {
			return false;
		}
	}

	// converts data from value table to a JSON string
	function dataToJSON() {
		return JSON.stringify({
			"score": score,
			"complexity": complexity,
			// ? 1:0 convert boolean string to either 1 or 0
			"uppercase": uppercase ? 1:0,
			"lowercase": lowercase ? 1:0,
			"numbers": numbers ? 1:0,
			"symbols": symbols ? 1:0,
			"over_eight_char": overEightChar ? 1:0
		});
	};
});
