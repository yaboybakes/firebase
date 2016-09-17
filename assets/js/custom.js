console.log("working");

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


  $(document).ready(function() {
    //Display characters
    //User1 clicks choice
    //Data saved in database
    //User2 joins
    //User2 clicks choice
    //Data saved in database
    //Values retrieved from database
    //Winner is displayed, results updated
  });
