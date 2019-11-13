// Your web app's Firebase configuration
var firebaseConfig = {
  apiKey: "AIzaSyDD2T--fKedDwLBRTZKjY0vKmipIIS_iLw",
  authDomain: "charactergenerator-fc673.firebaseapp.com",
  databaseURL: "https://charactergenerator-fc673.firebaseio.com",
  projectId: "charactergenerator-fc673",
  storageBucket: "charactergenerator-fc673.appspot.com",
  messagingSenderId: "987916882241",
  appId: "1:987916882241:web:0805e25e9e5b2059be51c0",
  measurementId: "G-FYJ3LJ44Q1"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();

let database = firebase.database();


let container = document.getElementById('container');
for (let i = 0; i < 8; i++) {
  let newSubcontainer = document.createElement('div')
  newSubcontainer.className = "box";
  for (let j = 0; j < 8; j++) {
    let newElement = document.createElement('div');
    newElement.className = "leds";
    newElement.innerHTML = `${j},${i}`;
    if ((i == 5 || i == 6 || i == 7) && (j == 0)) {
      newElement.classList.add("leftdoor", "deur");
    } else if ((i == 5 || i == 6 || i == 7) && (j == 7)) {
      newElement.classList.add("rightdoor", "deur");
    } else if ((i == 0 || i == 4) && (j == 2 || j == 5)) {
      newElement.classList.add("lichtenUit", "lights");
    } else if (((i == 3) && (j == 0 || j == 7)) || ((i == 7) && ((j == 3) || (j == 4)))) {
      newElement.classList.add("stopcontactUit");
    }
    newSubcontainer.append(newElement);
  }
  container.append(newSubcontainer)
}

// Selected grid
let leds = document.getElementsByClassName("leds");

function doorOpen(item) {
  for (let x = 0; x < item.length; x++) {
    if (item[x].classList.contains("open")) {
      item[x].classList.remove("open");
    } else {
      item[x].classList.add('open');
    }
  }
}



function select(e) {
  let leftdoor = document.getElementsByClassName('leftdoor')
  let rightdoor = document.getElementsByClassName('rightdoor')



  let point = e.target.innerHTML.split(",");
  let j = point[0]
  let i = point[1]
  if ((i == 5 || i == 6 || i == 7) && (j == 0)) {
    doorOpen(leftdoor)
  } else if ((i == 5 || i == 6 || i == 7) && (j == 7)) {
    doorOpen(rightdoor)
  } else if ((i == 0 || i == 4) && (j == 2 || j == 5)) {
    if (e.target.classList.contains("lichtenUit")) {
      e.target.classList.remove("lichtenUit");
      e.target.classList.add("lichtenAan");
    } else {
      e.target.classList.remove("lichtenAan");
      e.target.classList.add("lichtenUit");

    }
  } else if (((i == 3) && (j == 0 || j == 7)) || ((i == 7) && ((j == 3) || (j == 4)))) {
    if (e.target.classList.contains("stopcontactUit")) {
      e.target.classList.remove("stopcontactUit");
      e.target.classList.add("stopcontactAan");
    } else {
      e.target.classList.remove("stopcontactAan");
      e.target.classList.add("stopcontactUit");

    }
  }
  pushData()
}

for (let i = 0; i < leds.length; i++) {
  leds[i].addEventListener('click', select)
}



// Save state in firebase

function getPoints(type, color) {
  for (let y = 0; y < type.length; y++) {
    PointArray.push(`${type[y].innerHTML},${color}`)
  }
}

function pushData() {

  let door = document.getElementsByClassName('deur')
  let closedDoor = [];
  for (let i = 0; i < door.length; i++) {
    if (door[i].classList.contains('open') != true) {
      closedDoor.push(door[i])
    }
  }
  let openDoor = document.getElementsByClassName('open')
  let lightsOn = document.getElementsByClassName('lichtenAan')
  let lightsOff = document.getElementsByClassName('lichtenUit')
  let wallOutletOn = document.getElementsByClassName('stopcontactAan')
  let wallOutletOff = document.getElementsByClassName('stopcontactUit')

  PointArray = []

  getPoints(openDoor, 'green')
  getPoints(closedDoor, 'red')
  getPoints(lightsOn, 'yellow')
  getPoints(lightsOff, 'orange')
  getPoints(wallOutletOff, 'darkBlue')
  getPoints(wallOutletOn, 'lightBlue')



  firebase.database().ref('demotica/points').set(
    PointArray
  );

}
// run
let state = 0;
document.getElementById('run').addEventListener('click', function () {

  if (state == true) {
    state = false;
  } else {
    state = true;
  }
  console.log(state)

  firebase.database().ref('demotica/state').set(
    state
  );


})

// Sensoren
let graden;
let temp = firebase.database().ref('demotica/numbers/temp');
temp.on('value', function (snapshot) {
  graden = snapshot.val()
  console.log(graden);
  document.getElementById('temp').innerHTML = `<h2>${Math.round(graden)} °C</h2>`;
});

let persentage;
let hum = firebase.database().ref('demotica/numbers/hum');
hum.on('value', function (snapshot) {
  persentage = snapshot.val()
  console.log(persentage);
  document.getElementById('hum').setAttribute('stroke-dasharray', `${persentage},100`)
  document.getElementById('procent').innerHTML = `${Math.round(persentage)} %`;

});

setInterval(function () {
  let timer = new Date();
  let currentDate = timer.getDay() + " " + (parseInt(timer.getMonth()) + 1) + " " + timer.getFullYear()

  let time = `${timer.getHours()}.${timer.getMinutes()}.${timer.getSeconds()}`;
  document.getElementById('time').innerHTML = `<h2>${time}</h2> <p>${currentDate}</p>`

}, 1000)



function stopInterval() {
  clearInterval(myInterval);
}

function lightflits() {
  let lights = document.getElementsByClassName('lights');
  for (let i = 0; i < lights.length; i++) {
    if (lights[i].classList.contains('lichtenUit')) {
      lights[i].classList.add('lichtenAan');
      lights[i].classList.remove('lichtenUit');
    } else {
      lights[i].classList.add('lichtenUit');
      lights[i].classList.remove('lichtenAan');
    }
  }
  pushData()

}

let myInterval;
let sound;

function play() {
  var audio = document.getElementById("audio");
  if (sound == "on") {
    audio.pause();
    sound = "off"
    stopInterval()
  } else {
    audio.play();
    sound = "on";
    let doors = document.getElementsByClassName("deur");
    console.log(doors.length)
    for (let d = 0; d < doors.length; d++) {
      if (doors[d].classList.contains('open') != true) {
        doors[d].classList.add('open');
      }
    }
    myInterval = setInterval(lightflits, 1000);
  }
  pushData()



}
document.getElementById('alarm').addEventListener('click', play)



firebase.auth().onAuthStateChanged(function (user) {
  if (user) {
    document.getElementById('dashboardContainer').style.display = "block"
    document.getElementById('account').style.display = "none"


  } else {
    document.getElementById('dashboardContainer').style.display = "none"
    document.getElementById('account').style.display = "block"  }
})