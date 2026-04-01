// ============================================================
//  State
// ============================================================
let playerNames  = [];
let playerScores = {};
let yanivPoints  = 0;
let assafPoints  = 0;
let selectedPlayer = null;

const AVATAR_COLORS = ['#e05252','#3d8be0','#e09a3d','#9b59b6','#3dbe6e','#e06d3d'];

// ============================================================
//  Initialization
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
  // Page 1
  document.getElementById('addPlayerButton').addEventListener('click', addPlayer);
  document.getElementById('playerNameInput').addEventListener('keydown', e => {
    if (e.key === 'Enter') addPlayer();
  });
  document.getElementById('goToPage2Button').addEventListener('click', goToPage2);

  // Page 2
  document.getElementById('backBtn2').addEventListener('click', () => navigateTo('page1'));
  document.getElementById('homeBtn2').addEventListener('click', () => navigateTo('page1'));
  document.querySelectorAll('.yaniv-btn').forEach(btn => {
    btn.addEventListener('click', () => setYanivPoints(parseInt(btn.dataset.points), btn));
  });
  document.querySelectorAll('.assaf-btn').forEach(btn => {
    btn.addEventListener('click', () => setAssafPoints(parseInt(btn.dataset.points), btn));
  });
  document.getElementById('goToPage3Button').addEventListener('click', goToPage3);

  // Page 3
  document.getElementById('homeBtn3').addEventListener('click', () => navigateTo('page1'));
  document.getElementById('scoreMinus').addEventListener('click', () => stepScore(-1));
  document.getElementById('scorePlus').addEventListener('click',  () => stepScore(1));
  document.getElementById('addScoreButton').addEventListener('click', addScore);
  document.getElementById('scoreInput').addEventListener('keydown', e => {
    if (e.key === 'Enter') addScore();
  });

  // Page 4
  document.getElementById('newGameButton').addEventListener('click', startNewGame);
});

// ============================================================
//  Navigation
// ============================================================
function navigateTo(toId) {
  const from = document.querySelector('.page.active');
  const to   = document.getElementById(toId);
  if (!from || from === to) return;
  from.classList.remove('active');
  to.classList.add('active');
  // Scroll target page to top
  to.scrollTop = 0;
}

// ============================================================
//  Page 1 — Player Management
// ============================================================
function addPlayer() {
  const input = document.getElementById('playerNameInput');
  const name  = input.value.trim();
  const err   = document.getElementById('playerError');

  if (!name) {
    showError(err, 'Bitte einen Namen eingeben.');
    input.classList.add('has-error');
    return;
  }
  if (playerNames.length >= 6) {
    showError(err, 'Maximal 6 Spieler erlaubt.');
    return;
  }
  if (playerNames.includes(name)) {
    showError(err, 'Dieser Name existiert bereits.');
    input.classList.add('has-error');
    return;
  }

  hideError(err);
  input.classList.remove('has-error');
  playerNames.push(name);
  playerScores[name] = 0;
  input.value = '';
  input.focus();
  renderPlayerChips();
}

function removePlayer(name) {
  playerNames   = playerNames.filter(n => n !== name);
  delete playerScores[name];
  renderPlayerChips();
}

function renderPlayerChips() {
  const container = document.getElementById('playerChips');
  container.innerHTML = '';
  playerNames.forEach((name, idx) => {
    const chip = document.createElement('div');
    chip.className = 'chip';
    chip.style.animationDelay = '0ms'; // already animated on creation

    const avatar = document.createElement('div');
    avatar.className = 'chip-avatar';
    avatar.style.background = AVATAR_COLORS[idx % AVATAR_COLORS.length];
    avatar.textContent = name[0].toUpperCase();

    const label = document.createElement('span');
    label.textContent = name;

    const rm = document.createElement('div');
    rm.className = 'chip-rm';
    rm.innerHTML = '✕';
    rm.setAttribute('role', 'button');
    rm.setAttribute('aria-label', `${name} entfernen`);
    rm.addEventListener('click', e => {
      e.stopPropagation();
      removePlayer(name);
    });

    chip.appendChild(avatar);
    chip.appendChild(label);
    chip.appendChild(rm);
    container.appendChild(chip);
  });
}

// ============================================================
//  Page 2 — Settings
// ============================================================
function goToPage2() {
  if (playerNames.length === 0) {
    showError(document.getElementById('playerError'), 'Füge mindestens einen Spieler hinzu.');
    return;
  }
  hideError(document.getElementById('playerError'));
  navigateTo('page2');
}

function setYanivPoints(points, btn) {
  yanivPoints = points;
  document.querySelectorAll('.yaniv-btn').forEach(b => b.classList.remove('selected'));
  btn.classList.add('selected');
  updateSettingsStatus();
}

function setAssafPoints(points, btn) {
  assafPoints = points;
  document.querySelectorAll('.assaf-btn').forEach(b => b.classList.remove('selected'));
  btn.classList.add('selected');
  updateSettingsStatus();
}

function updateSettingsStatus() {
  const status = document.getElementById('settingsStatus');
  const goBtn  = document.getElementById('goToPage3Button');

  if (yanivPoints && assafPoints) {
    status.textContent   = `Yaniv ${yanivPoints} · Assaf ${assafPoints} — bereit ✓`;
    status.style.color   = 'var(--green)';
    goBtn.disabled       = false;
  } else if (yanivPoints) {
    status.textContent = `Yaniv ${yanivPoints} gewählt — bitte Assaf-Punkte wählen`;
    status.style.color = '';
    goBtn.disabled = true;
  } else if (assafPoints) {
    status.textContent = `Assaf ${assafPoints} gewählt — bitte Yaniv-Punkte wählen`;
    status.style.color = '';
    goBtn.disabled = true;
  } else {
    status.textContent = '';
    goBtn.disabled = true;
  }
}

// ============================================================
//  Page 3 — Score Tracking
// ============================================================
function goToPage3() {
  renderScoreCards();
  renderPlayerButtons();
  updateGameBadge();
  updateAssafLabel();
  navigateTo('page3');
}

function updateGameBadge() {
  const el = document.getElementById('gameBadge');
  if (el) el.textContent = `Yaniv ${yanivPoints} · Assaf ${assafPoints}`;
}

function updateAssafLabel() {
  const el = document.getElementById('assafLabel');
  if (el) el.textContent = assafPoints || '?';
}

function renderPlayerButtons() {
  const container = document.getElementById('playerButtons');
  container.innerHTML = '';
  playerNames.forEach((name, idx) => {
    const chip = document.createElement('div');
    chip.className = 'chip';
    chip.dataset.player = name;

    const avatar = document.createElement('div');
    avatar.className = 'chip-avatar';
    avatar.style.background = AVATAR_COLORS[idx % AVATAR_COLORS.length];
    avatar.textContent = name[0].toUpperCase();

    const label = document.createElement('span');
    label.textContent = name;

    chip.appendChild(avatar);
    chip.appendChild(label);
    chip.addEventListener('click', () => selectPlayer(name));
    container.appendChild(chip);
  });
}

function selectPlayer(name) {
  selectedPlayer = name;
  document.querySelectorAll('#playerButtons .chip').forEach(chip => {
    chip.classList.toggle('selected', chip.dataset.player === name);
  });
  hideError(document.getElementById('playerSelectError'));
}

function stepScore(delta) {
  const input = document.getElementById('scoreInput');
  const current = parseInt(input.value) || 0;
  const next = Math.max(0, current + delta);
  input.value = next;
  input.classList.remove('has-error');
  hideError(document.getElementById('scoreError'));
}

function addScore() {
  const playerErr = document.getElementById('playerSelectError');
  const scoreErr  = document.getElementById('scoreError');
  const input     = document.getElementById('scoreInput');
  const assafCb   = document.getElementById('assafCheckbox');

  if (!selectedPlayer) {
    showError(playerErr, 'Bitte erst einen Spieler auswählen.');
    return;
  }
  hideError(playerErr);

  const rawScore = parseInt(input.value);
  if (isNaN(rawScore) || rawScore < 0) {
    showError(scoreErr, 'Bitte eine gültige Punktzahl eingeben (≥ 0).');
    input.classList.add('has-error');
    return;
  }
  hideError(scoreErr);
  input.classList.remove('has-error');

  let totalScore = rawScore;
  if (assafCb.checked) totalScore += assafPoints;

  playerScores[selectedPlayer] += totalScore;
  const resetInfo = adjustScores(selectedPlayer);

  renderScoreCards();
  animateScoreDelta(selectedPlayer, totalScore);
  if (resetInfo.wasReset) showResetBadge(selectedPlayer, resetInfo.from, resetInfo.to);

  // Reset input UI
  input.value     = '';
  assafCb.checked = false;
  selectedPlayer  = null;
  document.querySelectorAll('#playerButtons .chip').forEach(c => c.classList.remove('selected'));

  checkForLoser();
}

function adjustScores(player) {
  const score = playerScores[player];
  if (yanivPoints === 100) {
    if (score === 75)  { playerScores[player] = 35;  return { wasReset: true, from: 75,  to: 35  }; }
    if (score === 100) { playerScores[player] = 50;  return { wasReset: true, from: 100, to: 50  }; }
  } else if (yanivPoints === 200) {
    if (score === 150) { playerScores[player] = 75;  return { wasReset: true, from: 150, to: 75  }; }
    if (score === 200) { playerScores[player] = 100; return { wasReset: true, from: 200, to: 100 }; }
  }
  return { wasReset: false };
}

function renderScoreCards() {
  const container = document.getElementById('scoreList');
  const sorted    = [...playerNames].sort((a, b) => playerScores[a] - playerScores[b]);

  container.innerHTML = '';
  sorted.forEach((name, idx) => {
    const score = playerScores[name];
    const pct   = yanivPoints > 0 ? Math.min(100, Math.round((score / yanivPoints) * 100)) : 0;
    const isLeading = idx === 0 && sorted.length > 1;
    const isDanger  = pct >= 80;
    const isWarning = pct >= 60 && !isDanger;

    let cls = 'score-card';
    if (isLeading) cls += ' leading';
    else if (isDanger)  cls += ' danger';
    else if (isWarning) cls += ' warning';

    const rank = idx + 1;
    const rankIcon = rank === 1 ? '👑' : rank === sorted.length && sorted.length > 1 ? '⚠️' : rank + '.';

    const card = document.createElement('div');
    card.className = cls;
    card.dataset.player = name;
    card.innerHTML = `
      <div class="sc-top">
        <span class="sc-name"><span class="sc-rank">${rankIcon}</span> ${name}</span>
        <span class="sc-score">${score}</span>
      </div>
      <div class="prog-bar">
        <div class="prog-fill" style="width:${pct}%"></div>
      </div>`;
    container.appendChild(card);
  });
}

function animateScoreDelta(playerName, delta) {
  const card = document.querySelector(`#scoreList .score-card[data-player="${CSS.escape(playerName)}"]`);
  if (!card) return;
  const el = document.createElement('span');
  el.className  = 'score-delta';
  el.textContent = `+${delta}`;
  card.appendChild(el);
  setTimeout(() => el.remove(), 1000);
}

function showResetBadge(playerName, from, to) {
  const card = document.querySelector(`#scoreList .score-card[data-player="${CSS.escape(playerName)}"]`);
  if (!card) return;
  const el = document.createElement('span');
  el.className  = 'reset-badge';
  el.textContent = `↩ ${from} → ${to}`;
  card.appendChild(el);
  setTimeout(() => el.remove(), 2100);
}

// ============================================================
//  Game Over
// ============================================================
function checkForLoser() {
  let loser    = null;
  let minScore = Infinity;
  let winner   = null;

  for (const [name, score] of Object.entries(playerScores)) {
    if (score > yanivPoints) loser = name;
    if (score < minScore) { minScore = score; winner = name; }
  }

  if (loser) {
    document.getElementById('loserCard').innerHTML = `
      <span class="result-icon">❌</span>
      <div class="result-label">Verlierer</div>
      <div class="result-name">${loser}</div>`;

    document.getElementById('winnerCard').innerHTML = `
      <span class="result-icon">🏆</span>
      <div class="result-label">Gewinner</div>
      <div class="result-name">${winner}</div>
      <div class="result-score">${minScore} Punkte</div>`;

    const sorted = [...playerNames].sort((a, b) => playerScores[a] - playerScores[b]);
    document.getElementById('finalScores').innerHTML =
      '<h3>Endstand</h3>' +
      sorted.map(name => `
        <div class="fs-row">
          <span>${name}</span>
          <span class="fs-pts">${playerScores[name]}</span>
        </div>`).join('');

    navigateTo('page4');
  }
}

// ============================================================
//  New Game
// ============================================================
function startNewGame() {
  playerNames    = [];
  playerScores   = {};
  yanivPoints    = 0;
  assafPoints    = 0;
  selectedPlayer = null;

  document.getElementById('playerChips').innerHTML   = '';
  document.getElementById('scoreList').innerHTML     = '';
  document.getElementById('playerButtons').innerHTML = '';
  document.getElementById('playerNameInput').value  = '';
  document.getElementById('scoreInput').value       = '';
  document.getElementById('assafCheckbox').checked  = false;
  document.getElementById('settingsStatus').textContent = '';
  document.getElementById('goToPage3Button').disabled  = true;
  document.querySelectorAll('.yaniv-btn, .assaf-btn')
    .forEach(b => b.classList.remove('selected'));

  navigateTo('page1');
}

// ============================================================
//  Utilities
// ============================================================
function showError(el, msg) {
  el.textContent   = msg;
  el.style.display = 'block';
}

function hideError(el) {
  el.style.display = 'none';
  el.textContent   = '';
}

function showToast(msg, type = 'info') {
  const container = document.getElementById('toasts');
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = msg;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.animation = 'toastOut 0.22s ease both';
    setTimeout(() => toast.remove(), 230);
  }, 2500);
}
