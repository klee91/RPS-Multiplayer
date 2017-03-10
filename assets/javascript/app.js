//PSEUDO CODE
//user enters game page, on page load DOM should display:

//player 1 box, arena box, player 2 box, chatbox
//when both players enter, game will start

//player 1 will choose RPS, once selection is chosen, their box will display
//their choice *Player 2 cannot see choice*
//^ logic for this may be taking a loop (forEach function) and checking if UID is a 
//certain number, and appending info
//player 1 or 2 based on if conditions

//afterwards, it becomes player 2's turn

//after player 2 chooses, the arena box will indicate who won and who lost
//as well as their selection

// Initialize Firebase
var config = {
  apiKey: "AIzaSyBHtLOxwnOWALrL8o4jQpBzfhg4cKMscJA",
  authDomain: "rps-multiplayer-75fd4.firebaseapp.com",
  databaseURL: "https://rps-multiplayer-75fd4.firebaseio.com",
  storageBucket: "rps-multiplayer-75fd4.appspot.com",
  messagingSenderId: "1080262260199"
};

firebase.initializeApp(config);

var database = firebase.database();

var turnCount = 1;
var playerOneChoice = ""
var playerTwoChoice = ""
// var playerOneDisplay = false;
// var playerTwoDisplay = false;
var prevchildkey= "";

//players directory variable declaration
var playersRef = database.ref('players/');

var connectedRef = database.ref(".info/connected");

playersRef.on("value", function(childSnap) {
	var snap = childSnap.val()
	console.log(snap)
	// var player2Num = player1Num === 0 ? 1 : 0;
	// var playerOneChoice = snap[player1Num].rps;
	// var playerTwoChoice = snap[player2Num].rps;
	//Getting an array of each key In the snapshot object
      var keysArray = Object.keys(snap);
      console.log('this is keys array: ');
      console.log(keysArray);
      
      uid1 = keysArray[0];
      uid2 = keysArray[1];

    // if() {

    // }
}, function(errorObject) {
  console.log("The read failed: " + errorObject.code);
});

// // At the initial load, get a snapshot of the current data.
// database.ref().on("value", function(snapshot) {
// 	console.log(snapshot)
// }, function(errorObject) {
//   console.log("The read failed: " + errorObject.code);
// });

connectedRef.on("value", function(snapshot) {
	console.log(snapshot)
  // If they are connected..
  if (snap.val()) {

    // Add user to the connections list.
    var con = playersRef.update(true);

    // Remove user from the connection list when they disconnect or close/leave the page
    con.onDisconnect().remove();
  }
});

//click function for username submission
$(document).on("click", '#submitname', function(event) {
	event.preventDefault();

	userName = $('#player-entry').val().trim();
	winCount = 0;
	lossCount = 0;
	playerCount = 1;

	if ($('#player-one').children().is($('#user-name'))) {
		playerCount = 2;
	}

	//add player to DB
	playersRef.push({
		name: userName,
		wins: winCount,
		losses: lossCount,
		playerCount: playerCount,
	});

	//toggle off name submission
	$('#player-entry').toggle();
	$(this).toggle();
	$('.enter-name').text(" ");

	// playerOneDisplay = true;
});


//database event function for when player is added to firebase
playersRef.on("child_added" , function(childSnap, prevChildKey) {
	var snap = childSnap.val()
	console.log(snap)
	console.log(prevChildKey)
	parentkey = prevChildKey;
	
	//snapshot.val().keysArray[index] (?) where array has to be 0 or 1, depending on user
	playersRef.once('value', function(snapshot) {
		console.log(snapshot.val().userId);
	});

	//condition for appending to 1 + 2 boxes
	if (snap.playerCount == 1) {
		$('#player-one').empty();

		var nameDiv1 = $('<div>');
		nameDiv1.attr('id', 'user-name').html(snap.name);
		nameDiv1.appendTo($('#player-one'));

		var scoreDiv1 = $('<div>');
		scoreDiv1.attr('id', 'userscore1').html("Wins : " + snap.wins + " " + 
		"Losses : " + snap.losses).appendTo($('#player-one'));	
		
	} else if (snap.playerCount == 2) {
		$('#player-two').empty();

		var nameDiv2 = $('<div>');
		nameDiv2.attr('id', 'user-name').html(snap.name);
		nameDiv2.appendTo($('#player-two'));
		
		var scoreDiv2 = $('<div>');
		scoreDiv2.attr('id', 'userscore2').html("Wins : " + snap.wins + " " + 
		"Losses : " + snap.losses).appendTo($('#player-two'));

		console.log(snap);
		$('#player-one').css({"border" : "solid 1px yellow"});
		playerOneTurn()
		playerTwoTurn()
		// if (prevChildKey == null) {
		// 	playerOneTurn()
		// 	$('#player-one').css({"border" : "solid 1px yellow"});
		// } else if (prevChildKey == uid1){
		// 	$('#player-one').css({"border" : "solid 1px yellow"});
		// }
	}

	playersRef.onDisconnect().remove();
});

//database event function for when player node is altered/updated
// playersRef.on("child_changed" , function(childSnap, prevChildKey) {

// 	if (database.ref('players/' + uid1).val().choice && database.ref('players/' + uid2).val().choice) {
// 		game();
// 	}
// });

//RPS game start for player one
function playerOneTurn() {
	database.ref('/turn').set({turnCount})

	//RPS selections display to player div(s)
	var rock = $("<div>");
	rock.addClass("rock1 text-center").attr("data-val", "Rock").html("Rock");
	
	var paper = $("<div>");
	paper.addClass("paper1 text-center").attr("data-val", "Paper").html("Paper");

	var scissors = $("<div>");
	scissors.addClass("scissors1 text-center").attr("data-val", "Scissors").html("Scissors");

	$('#user-name + #userscore1').before(rock);
	$('.rock1').after(paper);
	$('.paper1').after(scissors);

	// if (database.ref('players/' + uid1).playerCount == 1) {
	// 	$('#user-name + #userscore1').before(rock);
	// 	$('.rock1').after(paper);
	// 	$('.paper1').after(scissors);
	// } else if(database.ref('players/' + uid2).playerCount == 2) {
	// 	$('#user-name + #userscore1').before(rock);
	// 	$('.rock1').after(paper);
	// 	$('.paper1').after(scissors);
	// }

	//click functions for RPS selection
$(document).on('click', '.rock1', function(){
	var val = $(this).attr('data-val');
	var div = $("<div>")
	div.addClass('selected').text(val);
	$('#userscore1').before(div);
		
	playerOneChoice = val;

	//push player choice to player data
	database.ref('players/' + uid1).update({choice: playerOneChoice})
		
	$('.rock1').remove();
	$('.paper1').remove();
	$('.scissors1').remove();
	// playerTwoTurn()
	
});

$(document).on('click', '.paper1', function(){
	var val = $(this).attr('data-val');
	var div = $("<div>")
	div.addClass('selected').text(val);
	$('#userscore1').before(div);
		
	playerOneChoice = val;
	database.ref('players/' + uid1).update({choice: playerOneChoice})
		
	$('.rock1').remove();
	$('.paper1').remove();
	$('.scissors1').remove();
	// playerTwoTurn()
});

$(document).on('click', '.scissors1', function(){
	var val = $(this).attr('data-val');
	var div = $("<div>")
	div.addClass('selected').text(val);
	$('#userscore1').before(div);
		
	playerOneChoice = val;
	database.ref('players/' + uid1).update({choice: playerOneChoice})
		
	$('.rock1').remove();
	$('.paper1').remove();
	$('.scissors1').remove();
	// playerTwoTurn()
});
}


function playerTwoTurn() {

	//RPS selections display to player div(s)
	var rock = $("<div>");
	rock.addClass("rock2 text-center").attr("data-val", "Rock").html("Rock");
	
	var paper = $("<div>");
	paper.addClass("paper2 text-center").attr("data-val", "Paper").html("Paper");

	var scissors = $("<div>");
	scissors.addClass("scissors2 text-center").attr("data-val", "Scissors").html("Scissors");

	$('#user-name + #userscore2').before(rock);
	$('.rock2').after(paper);
	$('.paper2').after(scissors);

	//click functions for RPS selection
	$(document).on('click', '.rock2', function(){
		var val = $(this).attr('data-val');
		var div = $("<div>")
		div.addClass('selected').text(val);
		$('#userscore2').before(div);

		playerTwoChoice = val;
		database.ref('players/' + uid2).update({choice: playerTwoChoice})
		
		$('.rock2').remove();
		$('.paper2').remove();
		$('.scissors2').remove();
		// game()
	});

	$(document).on('click', '.paper2', function(){
		var val = $(this).attr('data-val');
		var div = $("<div>")
		div.addClass('selected').text(val);
		$('#userscore2').before(div);
			
		playerTwoChoice = val;
		database.ref('players/' + uid2).update({choice: playerTwoChoice})
			
		$('.rock2').remove();
		$('.paper2').remove();
		$('.scissors2').remove();
		// game()
	});

	$(document).on('click', '.scissors2', function(){
		var val = $(this).attr('data-val');
		var div = $("<div>")
		div.addClass('selected').text(val);
		$('#userscore2').before(div);
			
		playerTwoChoice = val;
		database.ref('players/' + uid2).update({choice: playerTwoChoice})
			
		$('.rock2').remove();
		$('.paper2').remove();
		$('.scissors2').remove();
		// game()
	});
}



//function that checks choices and decides winner/loser
function game() {
	if (playerOneChoice === playerTwoChoice) {
		$('#arena').html("DRAW")
	} else if (playerOneChoice === "Rock" && playerTwoChoice === "Paper") {
		$('#arena').html("Player 2 Wins!")
		//player 2 winCount++
		//player 1 lossCount++
	} else if (playerOneChoice === "Rock" && playerTwoChoice === "Scissors") {
		$('#arena').html("Player 1 Wins!")
		//player 1 winCount++
		//player 2 lossCount++
	} else if (playerOneChoice === "Paper" && playerTwoChoice === "Rock") {
		$('#arena').html("Player 1 Wins!")
		//player 1 winCount++
		//player 2 lossCount++
	} else if (playerOneChoice === "Paper" && playerTwoChoice === "Scissors") {
		$('#arena').html("Player 2 Wins!")
		//player 2 winCount++
		//player 1 lossCount++
	} else if (playerOneChoice === "Scissors" && playerTwoChoice === "Paper") {
		$('#arena').html("Player 1 Wins!")
		//player 1 winCount++
		//player 2 lossCount++
	} else {
		$('#arena').html("Player 2 Wins!")
		//player 2 winCount++
		//player 1 lossCount++
	}
	turnCount++
	playerOneTurn();
	playerTwoTurn();
}

//click function for message submission
$(document).on('click', '#submitmsg', function(event) {
	event.preventDefault();
	
	var userMessage = $('#usermsg').val().trim();
	var post = $('<div>')
	
	post.html(userMessage);
	$('#messages').append(post);
	$('#usermsg').val(" ")
});


// var player1Dis = true;
// var player2Dis = true;

// playersRef.on('value' , function(snap) {


// });
// //player 1 click function for RPS selection
// player2Dis = false;
// player1Dis = true;

// if (player1Dis && player2Dis = false) {
// 	//show on playerOne div
// 	//do not show to player2 user
// }

// //player 2 click function for RPS selection
// player1Dis = false;
// player2Dis = true;

// if (player1Dis = false && player2Dis) {
// 	//show on playerTwo div
// 	//do not show on player1 user
	
// }

// ____________________________________

// OR

// //when names are both entered...
// //display to player one their choices, and not to player 2
// database.ref('players/' + uid1).on('value', function(snap) {
// 	//append RPS to player 1 div for player 1
// 	//append "player's one turn" to player 1 div for player 2
// }
