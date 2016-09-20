// Initialize Firebase
  var config = {
    apiKey: "AIzaSyDme8VQOnkfv7hkkvsIomLAvjPruv9SVgI",
    authDomain: "rps-ver-2.firebaseapp.com",
    databaseURL: "https://rps-ver-2.firebaseio.com",
    storageBucket: "rps-ver-2.appspot.com",
    messagingSenderId: "613515347725"
  };
  firebase.initializeApp(config);

  var db = firebase.database();
  var connectionsRef = db.ref("/connections");
  var connectedRef = db.ref(".info/connected");

  connectedRef.on("value", function(snap) {
    var successful_connect = snap.val();
  	if(successful_connect) {
  		var con = connectionsRef.push(true);
  		con.onDisconnect().remove();
  	};

  });

  connectionsRef.on("value", function(snap) {
  	console.log(snap.numChildren());
    //Update chat, etc
  });

  var array = {p1: "ninja",versus:"squirrel",p2:"bear"};
  var name = "";
  $(document).ready(function() {
    startGame();

    function startGame() {
      promptName();
      displayImgs();
    }

    function promptName() {
      name = prompt("What is your name?");
    }

    function displayImgs() {
      var img1 = $('<div class="ninja">');
      img1.appendTo('#p1');
      var img2 = $('<div class="squirrel">');
      img2.appendTo('#versus');
      var img3 = $('<div class="bear">');
      img3.appendTo('#p2');
    }

    $('.views').click(function() {
      console.log(array[$(this).attr('id')]);
      db.ref('/bidderData').set({

  		});
    });


    //Display characters
    //User1 clicks choice
    //Data saved in database
    //User2 joins
    //User2 clicks choice
    //Data saved in database
    //Values retrieved from database
    //Winner is displayed, results updated
  });
