let playerNames = [];
let playerScores = {};
let yanivPoints = 0;
let assafPoints = 0;
let selectedPlayer = null;

const translations = {
    en: {
        appTitle: "Yaniv Points App",
        playerNames: "Enter Player Names (max 6 players)",
        playerNameInput: "Player Name",
        addPlayer: "Add Player",
        next: "Next",
        rulesTitle: "Game Rules:",
        rule1: "1. Each player starts with 0 points.",
        rule2: "2. The round ends when a player calls Yaniv and the sum of their cards is ≤ 7.",
        rule3: "3. All other players take one last turn and the round ends.",
        rule4: "4. Players can receive Assaf penalty points if another player has the same or fewer points than the player who called Yaniv.",
        rule5: "5. A player's score resets to 35 if they reach 75 points. (Resets to 75 if they reach 150 in Yaniv 200 mode)",
        rule6: "6. A player's score resets to 50 if they reach exactly 100 points. (Resets to 100 if they reach 200 in Yaniv 200 mode)",
        rule7: "7. A player loses if their score exceeds the set Yaniv points.",
        yanivPoints: "Enter Yaniv and Assaf Points",
        enterPoints: "Enter Points and Select Assaf",
        assaf: "Assaf",
        addPoints: "Add Points",
        results: "Game Results",
        newGame: "New Game",
        alertPlayerName: "Maximum of 6 players allowed or invalid name",
        alertAddPlayer: "Add at least one player",
        alertSetYaniv: "Yaniv points set to ",
        alertSetAssaf: "Assaf points set to ",
        alertSelectPlayer: "Please select a player",
        alertInvalidScore: "Invalid score"
    },
    de: {
        appTitle: "Yaniv Punkte App",
        playerNames: "Spielernamen eintragen (max. 6 Spieler)",
        playerNameInput: "Spielername",
        addPlayer: "Spieler hinzufügen",
        next: "Weiter",
        rulesTitle: "Spielregeln:",
        rule1: "1. Jeder Spieler beginnt mit 0 Punkten.",
        rule2: "2. Die Runde endet, wenn ein Spieler Yaniv ruft und die Summe seiner Karten ≤ 7 ist.",
        rule3: "3. Alle anderen Spieler machen noch einen letzten Zug und die Runde ist zu Ende.",
        rule4: "4. Spieler können durch Assaf Strafpunkte erhalten, wenn ein anderer Spieler weniger oder gleichviel Punkte hat wie der Spieler der Yaniv hat.",
        rule5: "5. Die Punktzahl eines Spielers wird auf 35 zurückgesetzt, wenn er 75 erreicht hat. (Von 150 auf 75 bei Yaniv 200)",
        rule6: "6. Bei genau 100 Punkten wird die Punktzahl auf 50 zurückgesetzt. (Von 200 auf 100 bei Yaniv 200)",
        rule7: "7. Ein Spieler verliert, wenn seine Punktzahl höher als die eingestellten Yaniv-Punkte ist.",
        yanivPoints: "Yaniv und Assaf Punkte eintragen",
        enterPoints: "Punkte eintragen und Assaf auswählen",
        assaf: "Assaf",
        addPoints: "Punkte hinzufügen",
        results: "Spielergebnis",
        newGame: "Neues Spiel",
        alertPlayerName: "Maximal 6 Spieler erlaubt oder ungültiger Name",
        alertAddPlayer: "Füge mindestens einen Spieler hinzu",
        alertSetYaniv: "Yaniv Punkte auf ",
        alertSetAssaf: "Assaf Punkte auf ",
        alertSelectPlayer: "Bitte wähle einen Spieler aus",
        alertInvalidScore: "Ungültige Punktzahl"
    }
};

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
    document.querySelectorAll('#homeButton').forEach(button => {
        button.addEventListener('click', goToPage1);
    });
    document.getElementById('newGameButton').addEventListener('click', startNewGame);
    document.querySelectorAll('.language-buttons button').forEach(button => {
        button.addEventListener('click', () => setLanguage(button.textContent));
    });
    setLanguage('en'); // Set default language
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
        alert(translations[document.documentElement.lang].alertPlayerName);
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

function goToPage1() {
    document.getElementById('page1').classList.remove('hidden');
    document.getElementById('page2').classList.add('hidden');
    document.getElementById('page3').classList.add('hidden');
    document.getElementById('page4').classList.add('hidden');
}

function goToPage2() {
    if (playerNames.length > 0) {
        document.getElementById('page1').classList.add('hidden');
        document.getElementById('page2').classList.remove('hidden');
    } else {
        alert(translations[document.documentElement.lang].alertAddPlayer);
    }
}

function setYanivPoints(points) {
    yanivPoints = parseInt(points);
    alert(translations[document.documentElement.lang].alertSetYaniv + points);
}

function setAssafPoints(points) {
    assafPoints = parseInt(points);
    alert(translations[document.documentElement.lang].alertSetAssaf + points);
}

function goToPage3() {
    if (yanivPoints && assafPoints) {
        document.getElementById('page2').classList.add('hidden');
        document.getElementById('page3').classList.remove('hidden');
        updatePlayerButtons();
    } else {
        alert(translations[document.documentElement.lang].alertAddPlayer);
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
        alert(translations[document.documentElement.lang].alertSelectPlayer);
        return;
    }
    const scoreInput = document.getElementById('scoreInput');
    const score = parseInt(scoreInput.value);
    const assafCheckbox = document.getElementById('assafCheckbox');

    if (isNaN(score)) {
        alert(translations[document.documentElement.lang].alertInvalidScore);
        return;
    }

    let totalScore = score;
    if (assafCheckbox.checked) {
        totalScore += assafPoints;
    }

    playerScores[selectedPlayer] += totalScore;

    adjustScores(selectedPlayer);

    updateScoreList();
    scoreInput.value = '';
    assafCheckbox.checked = false;

    checkForLoser();
}

function adjustScores(player) {
    if (yanivPoints === 100) {
        if (playerScores[player] === 75) {
            playerScores[player] = 35;
        } else if (playerScores[player] === 100) {
            playerScores[player] = 50;
        }
    } else if (yanivPoints === 200) {
        if (playerScores[player] === 150) {
            playerScores[player] = 75;
        } else if (playerScores[player] === 200) {
            playerScores[player] = 100;
        }
    }
}

function updateScoreList() {
    const scoreList = document
