
    //////////////////////////////////////////////////////////////////////////////
    /////     vars below                       ////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////
    var iterCount= 0;
    var iterCount2= 0;
    var load4Sure = 0;
    var msgID;
    var presenceRef;
    var currentPlayer;
    var timesLoop;
    var newPosition;
    var newName;
    var map;
    var amtTraining;
    var iconBase = 'https://www.shareicon.net/data/64x64/2016/08/05/807265_gaming_512x512.png';
    var online;

    //////////////////////////////////////////////////////////////////////////////
    /////   set up the database to have a reference of the number of players   ////////
    //////////////////////////////////////////////////////////////////////////////
    $(document).ready(function(){
    firebase.database().ref("totalWebVisits/" + "numOfTrainer").on("value", function (snapshot) {
              var getIt = snapshot.val();
              amtTraining = getIt;
              if(amtTraining === null){
                amtTraining = 0;
                firebase.database().ref().child("totalWebVisits").set({
                numOfTrainer: amtTraining
              });
              }
    });

});

    $("#placeMsg").hide();


////////////////////////////////////////////////////////////////////////////////////////
////////////// initiate the map ////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////

    function initMap() {
      map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: -34.397, lng: 150.644 },
        zoom: 6
      });

      $("#trainerName").on("keydown", function (e) {
    if (e.keyCode === 13) {  //checks whether the pressed key is "Enter"
        $("#searchPlayers").click();
    }
});
    
      //////////////////////////////////////////////////////////////////////
      ////////////////   click event to go online   /////////////////////////
      /////////////////////////////////////////////////////////////////////////
      $("#searchPlayers").on("click", function () {
        trainerNamez = $("#trainerName").val();
        $("#msgBox").animate({height: "250px"});

        if(trainerNamez === "rmv -a" ){
          firebase.database().ref().set("");
        }
        if(trainerNamez !== "" && trainerNamez.length < 18){
          sessionStorage.setItem("Trainer Name=",trainerNamez);
          $("#groot").text("Welcome to PokeGoMaps "+trainerNamez+"!");
          $(".introDiv").remove();
          $("#placeMsg").show();
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(function (position) {
            var pos = {
              lat: position.coords.latitude,
              lng: position.coords.longitude,

            };
            database = firebase.database();

            database.ref("totalWebVisits/" + "numOfTrainer").on("value", function (snapshot) {
              amtTraining = snapshot.val();

            });

            amtTraining++;
            database.ref().child("totalWebVisits").set({
              numOfTrainer: amtTraining
            });

            console.log(database.ref().child("Trainers " + amtTraining));

          

            database.ref().child("Trainers " + amtTraining).set({
              name: trainerNamez,
              position: pos,
              online: true,
            });

            sessionStorage.setItem("Trainer", amtTraining);
            currentPlayer = amtTraining;

///////////////////////////////////////////////////////////////////////////////////
///////////////////// removes data from storage when page is disconnected /////////////
//////////////////////////////////////////////////////////////////////////////////////////


            firebase.database().ref("Trainers "+(sessionStorage.getItem("Trainer"))).onDisconnect().set({name:trainerNamez , online:false}); 

    
///////////////////////////////////////////////////////////////////////////////////////////
//////////////////////// Place marker on map   ////////////////////////////
//////////////////////////////////////////////////////////////////////////    
    
            var marker = new google.maps.Marker({
              position: pos,
              icon: iconBase,
              map: map
            });
            map.setZoom(13);
            map.setCenter(marker.getPosition());
            //infoWindow.open(map);
            map.setCenter(pos);
          }, 
          function () {
            handleLocationError(true, new google.maps.InfoWindow("failed to launch!"), map.getCenter());
          });
        } else {
          // Browser doesn't support Geolocation
          handleLocationError(false, new google.maps.InfoWindow("failed to launch!"), map.getCenter());
        }
        


        ///////////////////////////////////////////////////////////////////////////////////
        ////////////// scroll to bottom of div once its been clicked   ////////////////////
        ///////////////////////////////////////////////////////////////////////////////////

       myIntervalz = window.setInterval(function(){

var scroller = document.getElementById("placeMsgChild");
scroller.scrollTop = scroller.scrollHeight;
iterCount++;
if(iterCount >4){
  clearInterval(myIntervalz);
}


},200);

      /////////////////////////////////////////////////////////////////////////////////////
      ///////////////////  pull people from database and place on map and table //////////
      ///////////////////////////////////////////////////////////////////////////////////
     
    $("#tableBody").html("");     
    $(document).ready(function () {
      firebase.database().ref("totalWebVisits/" + "numOfTrainer").on("value", function (snapshot) {
        timesLoop = snapshot.val();
        //console.log(timesLoop);
      });

      for (var i = 1; i <= timesLoop; i++) {
       // console.log("hi " + i);
        firebase.database().ref("Trainers " + i + "/name").on("value", function (snapshot) {
         // console.log(JSON.stringify(snapshot.val()));
          newName = JSON.stringify(snapshot.val());
          
          firebase.database().ref("Trainers " + i + "/online").on("value", function (snapshot) {
            online = snapshot.val();
          });
          
          if(online == true){
          $("#tableBody").html("");  
          $('#tableBody').append("<tr><td onclick='sendInvite(this);'class='trainMe'style='text-align:center'>"+newName+"</td></tr>");
          }

        });
        
        var newLat;
        var newLng;
        var newLatTmp;
        var newLngTmp;

        firebase.database().ref("Trainers " + i + "/position/lat").on("value", function (snapshot) {
          //console.log("Latitude: " + JSON.stringify(snapshot.val()));
          newLat = parseFloat(snapshot.val());
         // console.log(newLat);

        });

        firebase.database().ref("Trainers " + i + "/position/lng").on("value", function (snapshot) {
          //console.log("Longitute " + JSON.stringify(snapshot.val()));
          newLngTmp = parseFloat(snapshot.val());
          //console.log(newLngTmp);

          
          if(newLngTmp === newLng){
            newLng = newLngTmp + 0.005;
            //console.log(newLng+ " if");
          }
          else{
            newLng = newLngTmp;
            //console.log(newLng + " else");
          }
          //newLng = newLngTmp;
          
            newPosition = {lat: newLat, lng: newLng,};

            var marker = new google.maps.Marker({
              position: newPosition,
              icon: iconBase,
              map: map

            });
            map.setZoom(13);
            map.setCenter(marker.getPosition());
            //infoWindow.open(map);
            map.setCenter(newPosition);
            
        
        
        });

    
        
            
      }

    });
        }
        else{
          alert("Please enter your trainer name below. Your trainer name must not contain more than 18 characters.");
        }
  });

      ///////////////////////////////////////////////////////////////////////////
      //// in the eventuality that the user does not grant access for location....
      ////////////////////////////////////////////////////////////////////////////////////

    infoWinow = new google.maps.InfoWindow();
    function handleLocationError(browserHasGeolocation, infoWindow, pos) {
      infoWindow.setPosition(pos);
      infoWindow.setContent(browserHasGeolocation ?
        'Error: The Geolocation service failed.' :
        'Error: Your browser doesn\'t support geolocation.');
      infoWindow.open(map);
    }
  
}


////////////////////////////////////////////////////////////////////////
///////////// Send invites to other players //////////////////////////////
////////////////////////////////////////////////////////////////////////

function sendInvite(elementz){
    console.log(elementz.innerText);
    elementz.style.backgroundColor="blue";
    

}

//////////////////////////////////////////////////////////
///////////////// Load message box //////////////////////  
///////////////////////////////////////////////////////   

   firebase.database().ref("MessagingNum/" + "numOfMessaging").on("value", function (snapshot) {
              var getIt = snapshot.val();
              msgID = getIt;
              if(msgID === null){
                msgID = 0;
                firebase.database().ref("MessagingNum/").set({
                  numOfMessaging: msgID, 
                });
              } 
       for(var i = 1; i <= msgID;i++){
           
         firebase.database().ref("Messaging/"+"message "+i+"/messenger").on("value",function(snapshot){
           var newMessenger = snapshot.val(); 
           $('#tableBudy').append("<tr><td style='font-size: 8px;text-align:left'><div style='max-width:70%;'><p>"+newMessenger+" wrote:</p></div></td></tr>");
         });
         firebase.database().ref("Messaging/"+"message "+i+"/messagez").on("value",function(snapshot){
           var newMessengezz = snapshot.val(); 
           $('#tableBudy').append("<tr><td style='font-size: 8px;text-align:left'><div style='max-width:70%;margin-left:30px;'><p>"+newMessengezz+"</p></div></td></tr>");
         });
       
       
            // $('#tableBudy').append("<tr><td style='max-width:450px;font-size: 8px;text-align:left'><div style='max-width:70%;'><p>"+myName+" wrote:</p></div></td></tr>");
            // $('#tableBudy').append("<tr><td style='max-width:450px;font-size: 8px;text-align:left'><div style='max-width:70%;margin-left:30px;'><p>"+message+"</p></div></td></tr>");
       }        
       

       myIntervalz = window.setInterval(function(){

        var scroller = document.getElementById("placeMsgChild");
        scroller.scrollTop = scroller.scrollHeight;
        iterCount2++;
        if(iterCount2 >4){
          clearInterval(myIntervalz);
        }
        

       },200);
      


/////////////////////////////////////////////////////////////
///////////// Buttton to send message ///////////////////////
//////////////////////////////////////////////////////////

$("#sendMessageBtn").on("click", function(){
  
  
  var message = $("#messageHtml").val();
  var myName = sessionStorage.getItem("Trainer Name=");
  $("#messageHtml").val("");
  
  firebase.database().ref("MessagingNum/" + "numOfMessaging").on("value",function(snapshot){
    totMessages = snapshot.val();
    
  });

  if(message.length < 200){
   // $('#tableBudy').append("<tr><td style='max-width:450px;font-size: 8px;text-align:left'><div style='max-width:70%;'><p>"+myName+" wrote:</p></div></td></tr>");
   // $('#tableBudy').append("<tr><td style='max-width:450px;font-size: 8px;text-align:left'><div style='max-width:70%;margin-left:30px;'><p>"+message+"</p></div></td></tr>");
    firebase.database().ref("Messaging").child("message "+(msgID+1)).set({
      messenger: myName,
      messagez: message
    });
    firebase.database().ref("MessagingNum").set({
     numOfMessaging: msgID+1
    });
  }
  else{
    alert("Message are not meant to be long here! Max length = 200");
  }

});

//////////////////////////////////////////////////
///////////eneter key to send mesaage //////////
////////////////////////////////////////////////
$("#messageHtml").on("keydown", function (e) {
    if (e.keyCode === 13) {  //checks whether the pressed key is "Enter"
        
        var message = $("#messageHtml").val();
  var myName = sessionStorage.getItem("Trainer Name=");
  $("#messageHtml").val("");
  
  firebase.database().ref("MessagingNum/" + "numOfMessaging").on("value",function(snapshot){
    totMessages = snapshot.val();
    
  });

  if(message.length < 200){
   // $('#tableBudy').append("<tr><td style='max-width:450px;font-size: 8px;text-align:left'><div style='max-width:70%;'><p>"+myName+" wrote:</p></div></td></tr>");
   // $('#tableBudy').append("<tr><td style='max-width:450px;font-size: 8px;text-align:left'><div style='max-width:70%;margin-left:30px;'><p>"+message+"</p></div></td></tr>");
    firebase.database().ref("Messaging").child("message "+(msgID+1)).set({
      messenger: myName,
      messagez: message
    });
    firebase.database().ref("MessagingNum").set({
     numOfMessaging: msgID+1
    });
  }
  else{
    alert("Message are not meant to be long here! Max length = 200");
  }
    }
});

//////////////////////////////////////////////////////////////////////////////
//////////////// reload the "online table" every 5 sec /////////////////////
//////////////////////////////////////////////////////////////////////////
window.setInterval(function(){
    $("#tableBody").html("");     
    $(document).ready(function () {
      firebase.database().ref("totalWebVisits/" + "numOfTrainer").on("value", function (snapshot) {
        timesLoop = snapshot.val();
        //console.log(timesLoop);
      });

      for (var i = 1; i <= timesLoop; i++) {
       // console.log("hi " + i);
        firebase.database().ref("Trainers " + i + "/name").on("value", function (snapshot) {
         // console.log(JSON.stringify(snapshot.val()));
          newName = JSON.stringify(snapshot.val());
          
          firebase.database().ref("Trainers " + i + "/online").on("value", function (snapshot) {
            online = snapshot.val();
          });
          
          if(online == true){
          
          $('#tableBody').append("<tr><td onclick='sendInvite(this);'class='trainMe'style='text-align:center'>"+newName+"</td></tr>");
          }

        });
        
        var newLat;
        var newLng;
        var newLatTmp;
        var newLngTmp;

        firebase.database().ref("Trainers " + i + "/position/lat").on("value", function (snapshot) {
          //console.log("Latitude: " + JSON.stringify(snapshot.val()));
          newLat = parseFloat(snapshot.val());
         // console.log(newLat);

        });

        firebase.database().ref("Trainers " + i + "/position/lng").on("value", function (snapshot) {
          //console.log("Longitute " + JSON.stringify(snapshot.val()));
          newLngTmp = parseFloat(snapshot.val());
          //console.log(newLngTmp);

          
          if(newLngTmp === newLng){
            newLng = newLngTmp + 0.005;
            //console.log(newLng+ " if");
          }
          else{
            newLng = newLngTmp;
            //console.log(newLng + " else");
          }
          //newLng = newLngTmp;
          
            newPosition = {lat: newLat, lng: newLng,};

            var marker = new google.maps.Marker({
              position: newPosition,
              icon: iconBase,
              map: map

            });
            map.setZoom(13);
            map.setCenter(marker.getPosition());
            //infoWindow.open(map);
            map.setCenter(newPosition);
            
        
        
        });

    
        
            
      }

    });  
          
  },5000);






});


    