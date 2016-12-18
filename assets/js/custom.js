// Initialize Firebase
  var config = {
    apiKey: "AIzaSyDme8VQOnkfv7hkkvsIomLAvjPruv9SVgI",
    authDomain: "rps-ver-2.firebaseapp.com",
    databaseURL: "https://rps-ver-2.firebaseio.com",
    storageBucket: "rps-ver-2.appspot.com",
    messagingSenderId: "613515347725"
  };
  firebase.initializeApp(config);

  var database = firebase.database();
  var chatData = database.ref("/chat")
  var playersRef = database.ref("players")
  var currentTurnRef = database.ref("turn")

  var username = "Guest";
  var currentPlayers = null;
  var currentTurn = null;
  var playerNum = false;
  var playerOneExists = false;
  var playerTwoExists = false;
  var playerOneData = null;
  var playerTwoData = null;

  $('#start').click(function() {
    if ($('#username').val() !== "") {
      username = capitalize($('#username').val());
      getInGame();
    }
  });

  $('#username').keypress(function(e) {
    if (e.keyCode == 13 && $('#username').val() !== "") {
      username = capitalize($('#username').val());
      getInGame();
    }
  });

  function capitalize(name) {
    return name.charAt(0).toUpperCase() + name.slice(1);
  }

  $('#chatsend').click(function() {
    if ($('#chatinput').val() !== "") {
      var message = $('#chatinput').val();
      chatData.push({
        name: username,
        message: message,
        time: firebase.database.ServerValue.TIMESTAMP,
        idNum: playerNum
      });
      $('#chatinput').val("");
    }
  });

  $('#chatinput').keypress(function(e) {
    if (e.keyCode == 13 && $('#chatinput').val() !== "") {
      var message = $('#chatinput').val();
      chatData.push({
        name: username,
        message: message,
        time: firebase.database.ServerValue.TIMESTAMP,
        idNum: playerNum
      });
      $('#chatinput').val("");

    }
  });


  $(document).on('click', 'li', function() {
    console.log('click');

    var clickChoice = $(this).text();
    console.log(playerRef)

    playerRef.child('choice').set(clickChoice);

    $('#player' + playerNum + ' ul').empty();
    $('#player' + playerNum + 'chosen').html(clickChoice);

    currentTurnRef.transaction(function(turn) {
      return turn + 1;
    });
  });

  chatData.orderByChild("time").on('child_added', function(snapshot) {


    if (snapshot.val().idNum === 0) {
      $('#chatmessages').append('<p class=player' + snapshot.val().idNum + '><span>' + snapshot.val().name + '</span>' + ' ' + snapshot.val().message + '</p>');
    } else {
      $('#chatmessages').append('<p class=player' + snapshot.val().idNum + '><span>' + snapshot.val().name + '</span>' + ': ' + snapshot.val().message + '</p>');
    }

    $('#chatmessages').scrollTop($("#chatmessages")[0].scrollHeight);
  });


  playersRef.on('value', function(snapshot) {

    currentPlayers = snapshot.numChildren();


    playerOneExists = snapshot.child('1').exists();
    playerTwoExists = snapshot.child('2').exists();


    playerOneData = snapshot.child('1').val();
    playerTwoData = snapshot.child('2').val();


    if (playerOneExists) {
      $('#player1name').text(playerOneData.name);
      $('#player1wins').text("Wins: " + playerOneData.wins);
      $('#player1losses').text("Losses: " + playerOneData.losses);

    } else {

      $('#player1name').text("Waiting for Player 1");
      $('#player1wins').empty();
      $('#player1losses').empty();
    }

    if (playerTwoExists) {
      $('#player2name').text(playerTwoData.name);
      $('#player2wins').text("Wins: " + playerTwoData.wins);
      $('#player2losses').text("Losses: " + playerTwoData.losses);
    } else {
      $('#player2name').text("Waiting for Player 2");
      $('#player2wins').empty();
      $('#player2losses').empty();
    }
  });


  currentTurnRef.on('value', function(snapshot) {

    currentTurn = snapshot.val();

    if (playerNum) {

      if (currentTurn == 1) {

        if (currentTurn == playerNum) {
          $('#currentturn').html('<h2>It\'s Your Turn!</h2>');
          $('#player' + playerNum + ' ul').append('<li>Rock</li><li>Paper</li><li>Scissors</li>');
        } else {
          $('#currentturn').html('<h2>Waiting for ' + playerOneData.name + ' to choose.</h2>');
        }

        $('#player1').css('border', '2px solid yellow');
        $('#player2').css('border', '1px solid black');
      } else if (currentTurn == 2) {

        if (currentTurn == playerNum) {
          $('#currentturn').html('<h2>It\'s Your Turn!</h2>');
          $('#player' + playerNum + ' ul').append('<li>Rock</li><li>Paper</li><li>Scissors</li>');
        } else {
          $('#currentturn').html('<h2>Waiting for ' + playerTwoData.name + ' to choose.</h2>');
        }

        $('#player2').css('border', '2px solid yellow');
        $('#player1').css('border', '1px solid black');
      } else if (currentTurn == 3) {

        gameLogic(playerOneData.choice, playerTwoData.choice);

        $('#player1chosen').html(playerOneData.choice);
        $('#player2chosen').html(playerTwoData.choice);

        var moveOn = function() {
          $('#player1chosen').empty();
          $('#player2chosen').empty();
          $('#result').empty();

          if (playerOneExists && playerTwoExists) {
            currentTurnRef.set(1);
          }
        };

        setTimeout(moveOn, 2000);

      } else {

        $('#player1 ul').empty();
        $('#player2 ul').empty();

        $('#currentturn').html('<h2>Waiting for another player to join.</h2>');
        $('#player2').css('border', '1px solid black');
        $('#player1').css('border', '1px solid black');
      }
    }
  });

  playersRef.on('child_added', function(snapshot) {

      currentTurnRef.set(1);
  });

  function getInGame() {
    var chatDataDisc = database.ref("/chat/" + Date.now());

    if (currentPlayers < 2) {
      if (playerOneExists) {
        playerNum = 2;
      } else {
        playerNum = 1;
      }

      playerRef = database.ref("/players/" + playerNum);

      playerRef.set({
        name: username,
        wins: 0,
        losses: 0,
        choice: null
      });

      //on disconnect remove this user's player object
      playerRef.onDisconnect().remove();

      //if a user disconnects, set the current turn to 'null' so the game does not continue
      currentTurnRef.onDisconnect().remove();

      //send disconnect message to chat with Firebase server generated timestamp and id of '0' to denote system message
      chatDataDisc.onDisconnect().set({
        name: username,
        time: firebase.database.ServerValue.TIMESTAMP,
        message: 'has disconnected.',
        idNum: 0
      });


      $('#swapzone').html('<h2>Hi ' + username + '! You are Player ' + playerNum + '</h2>');

    } else {

      alert('Sorry, Game Full! Try Again Later!');
    }
  }
  function gameLogic(player1choice, player2choice) {
    var playerOneWon = function(){
      $('#result').html('<h2>' + playerOneData.name + '</h2>' + '<h2>Wins!</h2>');

      if(playerNum === 1){
        playersRef.child('1').child('wins').set(playerOneData.wins + 1);
        playersRef.child('2').child('losses').set(playerTwoData.losses + 1);
      }
    };

    var playerTwoWon = function(){
      $('#result').html('<h2>' + playerTwoData.name + '</h2>' + '<h2>Wins!</h2>');

      if(playerNum === 2){
        playersRef.child('2').child('wins').set(playerTwoData.wins + 1);
        playersRef.child('1').child('losses').set(playerOneData.losses + 1);
      }
    };
    var tie = function(){
      $('#result').html('<h2>Tie Game!</h2>');
    };

    if (player1choice == 'Rock' && player2choice == 'Rock') {
      tie();
    } else if (player1choice == 'Paper' && player2choice == 'Paper') {
      tie();
    } else if (player1choice == 'Scissors' && player2choice == 'Scissors') {
      tie();
    } else if (player1choice == 'Rock' && player2choice == 'Paper') {
      playerTwoWon();
    } else if (player1choice == 'Rock' && player2choice == 'Scissors') {
      playerOneWon();
    } else if (player1choice == 'Paper' && player2choice == 'Rock') {
      playerOneWon();
    } else if (player1choice == 'Paper' && player2choice == 'Scissors') {
      playerTwoWon();
    } else if (player1choice == 'Scissors' && player2choice == 'Rock') {
      playerTwoWon();
    } else if (player1choice == 'Scissors' && player2choice == 'Paper') {
      playerOneWon();
    }
  }


    //Display characters
    //User1 clicks choice
    //Data saved in database
    //User2 joins
    //User2 clicks choice
    //Data saved in database
    //Values retrieved from database
    //Winner is displayed, results updated
