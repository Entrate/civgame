

const btn1 = document.querySelector('.btn-1')
const btn2 = document.querySelector('.btn-2')
const player1Div = document.querySelector('.player-1')
const player2Div = document.querySelector('.player-2')
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
  let player1Uid
  let player2Uid
  let player1Name
  let player2Name
  const db = firebase.database()
  let stage = 1

  const update2screen = async () => {
    let listOfNames = await db.ref('players').orderByKey().once('value')
    let i = 0
      listOfNames.forEach(snapshot => {
        if(i == 0){
          player1Uid = snapshot.key
          player2Uid = ''
        } else if (i == 1){
          player2Uid = snapshot.key
        }
        i++
    })
    db.ref(`players/${player1Uid}`).once('value').then(snapshot => {
      player1Name = snapshot.child("name").val()
      waitinglist1.innerHTML = player1Name
    })
    db.ref(`players/${player2Uid}`).once('value').then(snapshot => {
    player2Name = snapshot.child("name").val()
        waitinglist2.innerHTML = player2Name
    })
  }

const whichTeam = async () => {
  let listOfNames = await db.ref('players').orderByKey().once('value')
  listOfNames.forEach(snapshot =>{
    if(snapshot.child("currentPlace").val() == 1){
      player1Div.innerHTML = snapshot.child("name").val()
    } else if(snapshot.child("currentPlace").val() == 2){
      player2Div.innerHTML = snapshot.child("name").val()
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
  player1Div.innerHTML = ''
  player2Div.innerHTML = ''
  update2screen()
  whichTeam()
  showReadyness()
  } else if(stage == 2){

  }

})
btn1.onclick = () => {
  if(player1Div.innerHTML == playerName){
    db.ref(`players/${playerId}/currentPlace`).set(0)
    player1Div.innerHTML = ''
    readyButton1.classList.toggle('hidden')
  }else if(player1Div.innerHTML != ''){
    db.ref(`players/${playerId}/currentPlace`).set(0)
    readyButton2.classList.add('hidden')
  } else {
    if(player2Div.innerHTML == playerName){
      player2Div.innerHTML = ''
      readyButton2.classList.toggle('hidden')
    }
    db.ref(`players/${playerId}/currentPlace`).set(1)
    readyButton1.classList.toggle('hidden')
  }
  db.ref(`players/${playerId}/isReady`).set(false)
}
btn2.onclick = () => {
  if(player2Div.innerHTML == playerName){
    db.ref(`players/${playerId}/currentPlace`).set(0)
    player2Div.innerHTML = ''
    readyButton2.classList.toggle('hidden')
  }else if(player2Div.innerHTML != ''){
    db.ref(`players/${playerId}/currentPlace`).set(0)
    readyButton1.classList.add('hidden')
  } else {
    if(player1Div.innerHTML == playerName){
      player1Div.innerHTML = ''
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
    const procentageX = (maxdeltaX / window.innerWidth) * -50 + lastPercentage[0]
    const procentageY = (maxdeltaY / window.innerHeight) * -50 + lastPercentage[1]
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
 const resetGame = () => {
  const tiles = document.querySelectorAll('.tiles')
  tiles.forEach(tile => {
    let tileRef = db.ref(`tiles/${tiles.indexof(tile) + 1}`).remove()
  })
 }

const initGame = () => {
  console.log('gameHasStarted')
  stage = 2
  document.querySelector('.main').classList.add('hidden')
  document.querySelector('.container').classList.remove('hidden')
  document.querySelector('.control-panel').classList.remove('hidden')
  document.querySelector('.name').innerHTML = `NAME: ${playerName}`
  let tileRef
  const rows = document.querySelectorAll('.rows')
  const tiles = document.querySelectorAll('.tiles')

  const getTargetTile = (x,y) => {
    return x + (y - 1)  * 20 - 1
  }
  const generateTroop = (tile) => {
    tile.innerHTML = `<div class="army-img"><img src="images/solgers.png" alt="an army"></div>`
    tile.classList.add('has-troop')
  }
  const removeTroop = tile => {
    if(tile.innerHTML == '') return
    tile.innerHTML = '' 
    tile.classList.remove('has-troop')
  }
  const updateValuesToMap = async () => {
    const tileRefs = await db.ref('tiles').orderByKey().once("value")
    let i = 0
    tileRefs.forEach(snapshot => {
      if(snapshot.child("contains").val() == 'troop' && tiles[i].innerHTML == ''){
      generateTroop(tiles[i])
      }else if(snapshot.child("contains").val() == '' && tiles[i].innerHTML != ''){
        removeTroop(tiles[i])
      }
      i++
    })
  }
  tiles.forEach((tile, i) => {
    tileRef = db.ref(`tiles/${i + 1}`)
    tileRef.set({
      ownedBy: '0',
      contains: ''
    })
    tile.addEventListener('click',() => {
      if(tile.innerHTML == ''){
        db.ref(`tiles/${i + 1}`).update({
          "contains": "troop"
        })
      } else {
        db.ref(`tiles/${i + 1}`).update({
          "contains": ""
        })
      }

    })

  })
  db.ref(`tiles`).on("value", () => {
    updateValuesToMap()
  })
  if(player1Uid == playerId && player1Name == playerName){
    console.log('is Player 1 id:' + player1Uid)
    tiles[getTargetTile(3,3)].classList.add('bg-green')
    tiles[getTargetTile(18,18)].classList.add('bg-red')
  } else if(player2Uid == playerId && player2Name == playerName){
    tiles[getTargetTile(3,3)].classList.add('bg-red')
    tiles[getTargetTile(18,18)].classList.add('bg-green')
    console.log('is Player 2 id:' + player2Uid)
  } else {
    console.log('what are you')
  }
}