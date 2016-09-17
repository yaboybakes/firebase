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
  var connectionsRef = database.ref("/connections");
  var connectedRef = database.ref(".info/connected");
