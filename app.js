let playerNames = [];
let playerScores = {};
let yanivPoints = 0;
let assafPoints = 0;
let selectedPlayer = null;

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById('addPlayerButton').addEventListener('click', addPlayer);
    document.getElementById('goToPage2Button').addEventListener('click', goToPage2);
    document.querySelectorAll('.yanivButton').forEach(button => {
        button.addEventListener('click', () => setYanivPoints(button.dataset.points));
    });
    document.querySelectorAll('.assafButton').forEach(button => {
        button.addEventListener('click', () => setAssafPoints(button.dataset.points));
    });
    document.getElementById('goToPage3Button').addEventListener('click', goToPage3);
    document.getElementById('addScoreButton').addEventListener('click', addScore);
});

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
    yanivPoints = parseInt(points);
    alert(`Yaniv Punkte auf ${points} gesetzt`);
}

function setAssafPoints(points) {
    assafPoints = parseInt(points);
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
        button.addEventListener('click', () => selectPlayer(name));
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
            playerScores[selectedPlayer] = 75;
        } else if (playerScores[selectedPlayer] === 200) {
            playerScores[selectedPlayer] = 100;
        }
    }

    updateScoreList();
    scoreInput.value = '';
    assafCheckbox.checked = false;

    checkForLoser();
}

function updateScoreList() {
    const scoreList = document.getElementById('scoreList');
    scoreList.innerHTML = '';
    for (const [name, score] of Object.entries(playerScores)) {
        const li = document.createElement('li');
        li.textContent = `${name}: ${score}`;
        scoreList.appendChild(li);
    }
}

function checkForLoser() {
    let loser = null;
    let minScore = Infinity;
    let winner = null;

    for (const [name, score] of Object.entries(playerScores)) {
        if (score > yanivPoints) {
            loser = name;
        }
        if (score < minScore) {
            minScore = score;
            winner = name;
        }
    }

    if (loser) {
        document.getElementById('page3').classList.add('hidden');
        document.getElementById('page4').classList.remove('hidden');

        const result = document.getElementById('result');
        result.innerHTML = `${loser} hat verloren!<br>Gewinner: ❤️ ${winner} ❤️`;
    }
}
