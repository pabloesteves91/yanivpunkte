let playerNames = [];
let playerScores = {};
let yanivPoints = 0;
let assafPoints = 0;
let selectedPlayer = null;

function addPlayer() {
    const playerNameInput = document.getElementById('playerNameInput');
    const playerName = playerNameInput.value.trim();

    if (playerName && playerNames.length < 6) {
        playerNames.push(playerName);
        playerScores[playerName] = 0;
        updatePlayerList();
        playerNameInput.value = '';
    } else {
        alert('Maximal 6 Spieler erlaubt oder ungültiger Name');
    }
}

function updatePlayerList() {
    const playerList = document.getElementById('playerList');
    playerList.innerHTML = '';
    playerNames.forEach(name => {
        const li = document.createElement('li');
        li.textContent = name;
        playerList.appendChild(li);
    });
}

function goToPage2() {
    if (playerNames.length > 0) {
        document.getElementById('page1').classList.add('hidden');
        document.getElementById('page2').classList.remove('hidden');
    } else {
        alert('Füge mindestens einen Spieler hinzu');
    }
}

function setYanivPoints(points) {
    yanivPoints = points;
    alert(`Yaniv Punkte auf ${points} gesetzt`);
}

function setAssafPoints(points) {
    assafPoints = points;
    alert(`Assaf Punkte auf ${points} gesetzt`);
}

function goToPage3() {
    if (yanivPoints && assafPoints) {
        document.getElementById('page2').classList.add('hidden');
        document.getElementById('page3').classList.remove('hidden');
        updatePlayerButtons();
    } else {
        alert('Bitte wähle Yaniv und Assaf Punkte');
    }
}

function updatePlayerButtons() {
    const playerButtons = document.getElementById('playerButtons');
    playerButtons.innerHTML = '';
    playerNames.forEach(name => {
        const button = document.createElement('button');
        button.textContent = name;
        button.onclick = () => selectPlayer(name);
        playerButtons.appendChild(button);
    });
}

function selectPlayer(name) {
    selectedPlayer = name;
    document.querySelectorAll('#playerButtons button').forEach(button => {
        if (button.textContent === name) {
            button.style.backgroundColor = '#9fe1a2'; // Neue Farbe für ausgewählten Spieler
        } else {
            button.style.backgroundColor = '#4CAF50'; // Standardgrün für nicht ausgewählte Spieler
        }
    });
}

function addScore() {
    if (!selectedPlayer) {
        alert('Bitte wähle einen Spieler aus');
        return;
    }
    const scoreInput = document.getElementById('scoreInput');
    const score = parseInt(scoreInput.value);
    const assafCheckbox = document.getElementById('assafCheckbox');

    if (isNaN(score)) {
        alert('Ungültige Punktzahl');
        return;
    }

    let totalScore = score;
    if (assafCheckbox.checked) {
        totalScore += assafPoints;
    }

    playerScores[selectedPlayer] += totalScore;

    if (yanivPoints === 100) {
        if (playerScores[selectedPlayer] === 75) {
            playerScores[selectedPlayer] = 35;
        } else if (playerScores[selectedPlayer] === 100) {
            playerScores[selectedPlayer] = 50;
        }
    } else if (yanivPoints === 200) {
        if (playerScores[selectedPlayer] === 150) {
            playerScores[selectedPlayer]
