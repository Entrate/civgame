

const btn1 = document.querySelector('.btn-1')
const btn2 = document.querySelector('.btn-2')
const player1 = document.querySelector('.player-1')
const player2 = document.querySelector('.player-2')
const waitinglist1 = document.querySelector('.waiting-list1')
const waitinglist2 = document.querySelector('.waiting-list2')
const readyButton1 = document.querySelector('.ready-btn-1')
const readyButton2 = document.querySelector('.ready-btn-2')
const readyDisplay = document.querySelector('.ready-display')


const firebaseConfig = {
  apiKey: "AIzaSyC4T3ai8cmbX7HynD1AD1bSCQa8PYw8oHw",
  authDomain: "game-ece2d.firebaseapp.com",
  projectId: "game-ece2d",
  storageBucket: "game-ece2d.appspot.com",
  messagingSenderId: "1007315196902",
  appId: "1:1007315196902:web:2bb20e005d3a4b70ef5427",
  databaseURL: 'https://game-ece2d-default-rtdb.europe-west1.firebasedatabase.app'
};
firebase.initializeApp(firebaseConfig);
  let playerId;
  let playerRef;
  let playerName;
  let players1
  let players2
  let players1Name
  let players2Name
  const db = firebase.database()
  let stage = 1

  const update2screen = async () => {
    let listOfNames = await db.ref('players').orderByKey().once('value')
    let i = 0
      listOfNames.forEach(snapshot => {
        if(i == 0){
          players1 = snapshot.key
          players2 = ''
          players2Name = ''
        } else if (i == 1){
          players2 = snapshot.key
        }
        i++
    })
    db.ref(`players/${players1}`).once('value').then(snapshot => {
      players1Name = snapshot.child("name").val()
      waitinglist1.innerHTML = players1Name
    })
    if(players2 != ''){
        db.ref(`players/${players2}`).once('value').then(snapshot => {
        players2Name = snapshot.child("name").val()
        waitinglist2.innerHTML = players2Name
    })
    }
  }

const whichTeam = async () => {
  let listOfNames = await db.ref('players').orderByKey().once('value')
  listOfNames.forEach(snapshot =>{
    if(snapshot.child("currentPlace").val() == 1){
      player1.innerHTML = snapshot.child("name").val()
    } else if(snapshot.child("currentPlace").val() == 2){
      player2.innerHTML = snapshot.child("name").val()
    }
  })
}
const showReadyness = async () => {
  let listOfNames = await db.ref('players').orderByKey().once('value')
  let i = 0
  listOfNames.forEach(snapshot =>{
    if(snapshot.child("currentPlace").val() != 0 && snapshot.child("isReady").val() == true){
      i++
      readyDisplay.innerHTML = `${i} / 2`
    } else if(snapshot.child("isReady").val() == false) {
      readyDisplay.innerHTML = `${i} / 2`
    }
    if(i == 2){
      initGame()
    }
  })
}
  
const chooseName = () => {
  if(document.querySelector('.name-place').value != ''){
  document.querySelector('.name-chooser').classList.add('hidden')
  document.querySelector('.main').classList.remove('hidden')
  playerName = document.querySelector('.name-place').value.toUpperCase()
  db.ref(`players/${playerId}/name`).set(playerName)
  }
}
db.ref(`players`).on("value",(snapshot) => {
  if(stage == 1){
  waitinglist1.innerHTML = ''
  waitinglist2.innerHTML = ''
  player1.innerHTML = ''
  player2.innerHTML = ''
  update2screen()
  whichTeam()
  showReadyness()
  } else if(stage == 2){

  }

})
btn1.onclick = () => {
  if(player1.innerHTML == playerName){
    db.ref(`players/${playerId}/currentPlace`).set(0)
    player1.innerHTML = ''
    readyButton1.classList.toggle('hidden')
  }else if(player1.innerHTML != ''){
    db.ref(`players/${playerId}/currentPlace`).set(0)
    readyButton2.classList.add('hidden')
  } else {
    if(player2.innerHTML == playerName){
      player2.innerHTML = ''
      readyButton2.classList.toggle('hidden')
    }
    db.ref(`players/${playerId}/currentPlace`).set(1)
    readyButton1.classList.toggle('hidden')
  }
  db.ref(`players/${playerId}/isReady`).set(false)
}
btn2.onclick = () => {
  if(player2.innerHTML == playerName){
    db.ref(`players/${playerId}/currentPlace`).set(0)
    player2.innerHTML = ''
    readyButton2.classList.toggle('hidden')
  }else if(player2.innerHTML != ''){
    db.ref(`players/${playerId}/currentPlace`).set(0)
    readyButton1.classList.add('hidden')
  } else {
    if(player1.innerHTML == playerName){
      player1.innerHTML = ''
      readyButton1.classList.toggle('hidden')
    }
    db.ref(`players/${playerId}/currentPlace`).set(2)
    readyButton2.classList.toggle('hidden')
  }
  db.ref(`players/${playerId}/isReady`).set(false)
}
readyButton1.onclick = () => {
  db.ref(`players/${playerId}`).once('value').then(snapshot => {
    if(snapshot.child('isReady').val() == false){
      db.ref(`players/${playerId}/isReady`).set(true)
    } else {
      db.ref(`players/${playerId}/isReady`).set(false)
    }
  })
}
readyButton2.onclick = () => {
  db.ref(`players/${playerId}`).once('value').then(snapshot => {
    if(snapshot.child('isReady').val() == false){
      db.ref(`players/${playerId}/isReady`).set(true)
    } else {
      db.ref(`players/${playerId}/isReady`).set(false)
    }
  })
}


firebase.auth().onAuthStateChanged((user) => {
    if(user){
    playerId = user.uid
    playerRef = db.ref(`players/${playerId}`);

    playerRef.set({
      id: playerId,
      name:"CHOOSING NAME",
      isReady: false,
      currentPlace: 0
    })
    playerRef.onDisconnect().remove()
    }
})

firebase.auth().signInAnonymously().catch((error) => {
    var errorCode = error.code;
    var errorMessage = error.message;
    console.log(errorCode, errorMessage)
});


  let panningX = 0
  let panningY = 0
  let currentTransform = [0,0]
  let lastPercentage = [0,0]
  window.onmousedown = e => {
    if(stage == 2){
    panningY = e.clientY
    panningX = e.clientX
    }
  }
  window.onmouseup = () => {
    if(stage == 2){
      panningX = 0
      panningY = 0
      lastPercentage[0] = currentTransform[0]
      lastPercentage[1] = currentTransform[1]
    }
  }
 window.onmousemove = e => {
  if(stage == 2){
    if(panningX == 0 && panningY == 0) return
    const maxdeltaX = panningX - e.clientX
    const maxdeltaY = panningY - e.clientY
    const procentageX = (maxdeltaX / window.innerWidth) * -75 + lastPercentage[0]
    const procentageY = (maxdeltaY / window.innerHeight) * -75 + lastPercentage[1]
    currentTransform[0] = procentageX
    currentTransform[1] = procentageY
    document.querySelector('.board').style.transform = `translate(${procentageX}%,${procentageY}%)`;
  }
 }
 window.ondragstart = e => {
  if(stage == 2){
    e.preventDefault()
  }
 }

const initGame = () => {
  console.log('gameHasStarted')
  stage = 2
  document.querySelector('.main').classList.add('hidden')
  document.querySelector('.container').classList.remove('hidden')
}