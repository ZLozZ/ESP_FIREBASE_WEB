var firebaseConfig = {
  apiKey: "AIzaSyA0Z2fEdMaHqdVDejS5hV4JYEa_sC-NwH0",
  authDomain: "smart-home-54e2a.firebaseapp.com",
  databaseURL: "https://smart-home-54e2a-default-rtdb.firebaseio.com",
  projectId: "smart-home-54e2a",
  storageBucket: "smart-home-54e2a.appspot.com",
  messagingSenderId: "693781631609",
  appId: "1:693781631609:web:041263e48dbecaff94baa8",
  measurementId: "G-7NXZ4ECP44"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

var database = firebase.database();

var toggle = document.querySelector(".toggle");
var toggle2 = document.querySelector(".toggle2");
var toggle3 = document.querySelector(".toggle3");
var text = document.querySelector(".text");
var text2 = document.querySelector(".text2");
var text3 = document.querySelector(".text3");
window.Animatedtoggle = Animatedtoggle;
window.Animatedtoggle2 = Animatedtoggle2;
window.Animatedtoggle3 = Animatedtoggle3;
function Animatedtoggle()
{
  toggle.classList.toggle("active");
  if(toggle.classList.contains("active"))
  {
    // text.innerHTML = "ON"
    database.ref("/SMART_HOME/PHONG_KHACH").update({
      "DEN": 1
    })
  }
  else
  {
    // text.innerHTML = "OFF"
    database.ref("/SMART_HOME/PHONG_KHACH").update({
      "DEN": 0
    })
  }
}

function Animatedtoggle2()
{
  toggle2.classList.toggle("active");
  if(toggle2.classList.contains("active"))
  {
    // text2.innerHTML = "ON"
    database.ref("/SMART_HOME/PHONG_KHACH").update({
      "QUAT": 1
    })
  }
  else
  {
    // text2.innerHTML = "OFF"
    database.ref("/SMART_HOME/PHONG_KHACH").update({
      "QUAT": 0
    })
  }
}

function Animatedtoggle3()
{
  toggle3.classList.toggle("active");
  if(toggle3.classList.contains("active"))
  {
    // text3.innerHTML = "ON"
  }
  else
  {
    // text3.innerHTML = "OFF"
  }
}

  database.ref("/SMART_HOME/PHONG_KHACH/ND").on("value", function(snapshot){
    var temp = snapshot.val();
    document.getElementById("temp").innerHTML = temp;
  });
  database.ref("/SMART_HOME/PHONG_KHACH/DA").on("value", function(snapshot){
    var hum = snapshot.val();
    document.getElementById("hum").innerHTML = hum;
  });
  let air;
  database.ref("/SMART_HOME/PHONG_KHACH/AIR").on("value", function(snapshot){
    air = snapshot.val();
    charts(air)
  });

  // database.ref("/SMART_HOME/PHONG_KHACH/DEN").on("value", function(snapshot){
  //   var den = snapshot.val();
  //   if(den == 1)
  //   {
      
  //   }
  //   else{
  //   }
  // });
  $(document).ready(function(){
    var Led1Status;
    database.ref("/SMART_HOME/PHONG_KHACH/DEN").on("value", function(snap){
      Led1Status = snap.val();
      if(Led1Status == "1"){
        document.getElementById("unact").style.display = "none";
        document.getElementById("act").style.display = "block";
      } else {
        document.getElementById("unact").style.display = "block";
        document.getElementById("act").style.display = "none";
      }
    });
  
    $(".toggle-btn").click(function(){
      if(Led1Status == "1"){
        database.ref("/SMART_HOME/PHONG_KHACH").update({
          "DEN": 0
        })
        Led1Status = "0";
      } else {
        database.ref("/SMART_HOME/PHONG_KHACH").update({
          "DEN": 1
        })
        Led1Status = "1";
      }
    })
  });

  $(document).ready(function(){
    var Led2Status;
    database.ref("/SMART_HOME/PHONG_KHACH/QUAT").on("value", function(snap){
      Led2Status = snap.val();
      if(Led2Status == "1"){
        document.getElementById("unact1").style.display = "none";
        document.getElementById("act1").style.display = "block";
      } else {
        document.getElementById("unact1").style.display = "block";
        document.getElementById("act1").style.display = "none";
      }
    });
  
    $(".toggle-btn1").click(function(){
      if(Led2Status == "1"){
        database.ref("/SMART_HOME/PHONG_KHACH").update({
          "QUAT": 0
        })
        Led2Status = "0";
      } else {
        database.ref("/SMART_HOME/PHONG_KHACH").update({
          "QUAT": 1
        })
        Led2Status = "1";
      }
    })
  });
  
  $(document).ready(function(){
    var Led3Status;
    database.ref("/SMART_HOME/PHONG_KHACH/DEN2").on("value", function(snap){
      Led3Status = snap.val();
      if(Led3Status == "1"){
        document.getElementById("unact2").style.display = "none";
        document.getElementById("act2").style.display = "block";
      } else {
        document.getElementById("unact2").style.display = "block";
        document.getElementById("act2").style.display = "none";
      }
    });
  
    $(".toggle-btn2").click(function(){
      if(Led3Status == "1"){
        database.ref("/SMART_HOME/PHONG_KHACH").update({
          "DEN2": 0
        })
        Led3Status = "0";
      } else {
        database.ref("/SMART_HOME/PHONG_KHACH").update({
          "DEN2": 1
        })
        Led3Status = "1";
      }
    })
  });

  console.log(air)
function charts(air){
  var xValues = ["Air", "None",];
  var yValues = [air, 1000-air];
  var barColors = [
    "#00aba9",
    "#b91d47"
  ];

  new Chart("myChart1", {
    type: "doughnut",
    data: {
      labels: xValues,
      datasets: [{
        backgroundColor: barColors,
        data: yValues
      }]
    },
    options: {
      title: {
        display: true,
        text: "Chất lương không khí"
      }
    }
  });
}

