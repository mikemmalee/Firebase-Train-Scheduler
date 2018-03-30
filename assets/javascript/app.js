var config = {
  apiKey: "AIzaSyBKB-KWL1M0hQ_49oYEApXZJXddIDFL7Z8",
  authDomain: "train-scheduler-97517.firebaseapp.com",
  databaseURL: "https://train-scheduler-97517.firebaseio.com",
  projectId: "train-scheduler-97517",
  storageBucket: "train-scheduler-97517.appspot.com",
  messagingSenderId: "541410276384"
};

firebase.initializeApp(config);

var database = firebase.database();


$("#submit").on("click", function(event){
    event.preventDefault();

    //takes in user input and assigns to variables
    var trainName = $("#train-name").val().trim();
    var destination = $("#destination").val().trim();
    var firstTrain = $("#train-time").val().trim();
    var frequency = $("#frequency").val().trim();


    var data = {
      train: trainName,
      destination: destination,
      trainTime: firstTrain,
      frequency: frequency
    };
    //data is pushed to firebase
    database.ref().push(data);
    
    $("#train-name").val('');
    $("#destination").val('');
    $("#train-time").val('');
    $("#frequency").val('');

});


var createRow = function(data) {

    console.log("data: "+data);
  
    //calculates next arrival time and minutes away
    var firstTimeConverted = moment(data.trainTime, "HH:mm").subtract(1, "years");
    var currentTime = moment();
    var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
    var tRemainder = diffTime % data.frequency;
    var tMinutesTillTrain = data.frequency - tRemainder;
    var nextTrain = moment().add(tMinutesTillTrain, "minutes");


    //dynamically create row with table data
    var tBody = $("tbody");
    var tRow = $("<tr>");
    var nameTd = $("<td>").text(data.train);
    var destinationTd = $("<td>").text(data.destination);
    var frequencyTd = $("<td>").text(data.frequency);
    var nextArrivalTd = $("<td>").text(nextTrain.format('hh:mm A'));
    var minutesAwayTd = $("<td>").text(tMinutesTillTrain);
   
    tRow.append(nameTd, destinationTd, frequencyTd, nextArrivalTd, minutesAwayTd);
    
    tBody.append(tRow);
  };

//references stored data in firebase to display in table
database.ref().on("child_added", function(snapshot) {
    console.log(snapshot.val());
    createRow(snapshot.val());
  
  }, function(errorObject) {
    console.log("The read failed: " + errorObject.code);
  });