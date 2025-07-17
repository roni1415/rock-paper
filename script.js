// --- State ---
let userScore = 0;
let computerScore = 0;
let round = 0;
let history = [];
let bestOf = 3;
let isGameOver = false;

// --- DOM Elements ---
const userScoreDisplay = document.getElementById('user-score');
const computerScoreDisplay = document.getElementById('computer-score');
const result = document.getElementById('result');
const userChoiceDisplay = document.getElementById('user-choice');
const computerChoiceDisplay = document.getElementById('computer-choice');
const rockBtn = document.getElementById('rock');
const paperBtn = document.getElementById('paper');
const scissorsBtn = document.getElementById('scissors');
const resetBtn = document.getElementById('reset');
const bestOfSelect = document.getElementById('best-of');
const historyList = document.getElementById('history-list');
const themeToggle = document.getElementById('theme-toggle');
const modal = document.getElementById('modal');
const modalTitle = document.getElementById('modal-title');
const modalMessage = document.getElementById('modal-message');
const playAgainBtn = document.getElementById('play-again-btn');
const audioWin = document.getElementById('audio-win');
const audioLose = document.getElementById('audio-lose');
const audioDraw = document.getElementById('audio-draw');
const helpBtn = document.getElementById('help-btn');
const helpModal = document.getElementById('help-modal');
const helpCloseBtn = document.getElementById('help-close-btn');
const shareBtn = document.getElementById('share-btn');
const nicknameInput = document.getElementById('nickname-input');
const saveNicknameBtn = document.getElementById('save-nickname-btn');
const nicknameLabel = document.getElementById('nickname-label');
const leaderboardList = document.getElementById('leaderboard-list');

const choices = [
    { name: 'rock', emoji: '✊' },
    { name: 'paper', emoji: '🖐' },
    { name: 'scissors', emoji: '✌️' }
];

// --- Utility Functions ---
function getComputerChoice() {
    const idx = Math.floor(Math.random() * 3);
    return choices[idx];
}
function getWinner(user, computer) {
    if (user.name === computer.name) return 'draw';
    if (
        (user.name === 'rock' && computer.name === 'scissors') ||
        (user.name === 'paper' && computer.name === 'rock') ||
        (user.name === 'scissors' && computer.name === 'paper')
    ) return 'user';
    return 'computer';
}
function updateScores() {
    userScoreDisplay.textContent = userScore;
    computerScoreDisplay.textContent = computerScore;
}
function updateHistory() {
    historyList.innerHTML = '';
    history.slice(-10).forEach(item => {
        const li = document.createElement('li');
        li.innerHTML = `
            <span class="history-emoji">${item.user.emoji}</span>
            <span>vs</span>
            <span class="history-emoji">${item.computer.emoji}</span>
            <span class="history-winner ${item.result}">
                ${item.result === 'user' ? 'You' : item.result === 'computer' ? 'Computer' : 'Draw'}
            </span>
        `;
        historyList.appendChild(li);
    });
}
function playSound(result) {
    if (result === 'user') audioWin.play();
    else if (result === 'computer') audioLose.play();
    else audioDraw.play();
}
function showModal(title, message) {
    modalTitle.textContent = title;
    modalMessage.textContent = message;
    modal.style.display = 'flex';
    playAgainBtn.focus();
}
function closeModal() {
    modal.style.display = 'none';
}
function showHelpModal() {
    helpModal.style.display = 'flex';
    helpCloseBtn.focus();
}
function closeHelpModal() {
    helpModal.style.display = 'none';
}
function resetGame() {
    userScore = 0;
    computerScore = 0;
    round = 0;
    history = [];
    isGameOver = false;
    updateScores();
    updateHistory();
    userChoiceDisplay.textContent = '';
    computerChoiceDisplay.textContent = '';
    result.textContent = 'Choose your weapon!';
    result.className = 'result';
    enableChoiceButtons(true);
}
function enableChoiceButtons(enable) {
    rockBtn.disabled = !enable;
    paperBtn.disabled = !enable;
    scissorsBtn.disabled = !enable;
}
function checkGameOver() {
    const needed = Math.ceil(bestOf / 2);
    if (userScore === needed || computerScore === needed) {
        isGameOver = true;
        enableChoiceButtons(false);
        if (userScore === needed) {
            showModal('You Win!', `Congratulations! You won best of ${bestOf}.`);
            updateLeaderboard();
        } else {
            showModal('Computer Wins!', `Sorry, the computer won best of ${bestOf}.`);
            updateLeaderboard();
        }
    }
}
function play(userChoiceName) {
    if (isGameOver) return;
    enableChoiceButtons(false);
    userChoiceDisplay.textContent = '';
    computerChoiceDisplay.textContent = '';
    result.textContent = 'Rock...Paper...Scissors!';
    result.className = 'result';
    setTimeout(() => {
        const userChoice = choices.find(c => c.name === userChoiceName);
        const computerChoice = getComputerChoice();
        userChoiceDisplay.textContent = userChoice.emoji;
        computerChoiceDisplay.textContent = computerChoice.emoji;
        const winner = getWinner(userChoice, computerChoice);
        let resultText = '';
        if (winner === 'user') {
            userScore++;
            resultText = 'You win this round!';
            result.className = 'result win';
        } else if (winner === 'computer') {
            computerScore++;
            resultText = 'Computer wins this round!';
            result.className = 'result lose';
        } else {
            resultText = "It's a draw!";
            result.className = 'result draw';
        }
        playSound(winner);
        updateScores();
        history.push({ user: userChoice, computer: computerChoice, result: winner });
        updateHistory();
        result.textContent = resultText;
        round++;
        checkGameOver();
        if (!isGameOver) enableChoiceButtons(true);
    }, 800);
}
rockBtn.addEventListener('click', () => play('rock'));
paperBtn.addEventListener('click', () => play('paper'));
scissorsBtn.addEventListener('click', () => play('scissors'));
resetBtn.addEventListener('click', resetGame);
bestOfSelect.addEventListener('change', e => {
    bestOf = parseInt(e.target.value, 10);
    resetGame();
});
playAgainBtn.addEventListener('click', () => {
    closeModal();
    resetGame();
});
window.addEventListener('keydown', e => {
    if (modal.style.display === 'flex' && (e.key === 'Enter' || e.key === 'Escape')) {
        closeModal();
        resetGame();
    }
    if (helpModal.style.display === 'flex' && (e.key === 'Enter' || e.key === 'Escape')) {
        closeHelpModal();
    }
});
themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark');
    themeToggle.textContent = document.body.classList.contains('dark') ? '☀️' : '🌙';
});
helpBtn.addEventListener('click', showHelpModal);
helpCloseBtn.addEventListener('click', closeHelpModal);
shareBtn.addEventListener('click', () => {
    const url = 'http://silly-wisp-70a2fe.netlify.app/';
    if (navigator.clipboard) {
        navigator.clipboard.writeText(url).then(() => {
            shareBtn.textContent = '✅ Copied!';
            setTimeout(() => { shareBtn.textContent = '🔗 Share'; }, 1200);
        });
    } else {
        window.prompt('Copy this link:', url);
    }
});
// --- Nickname and Leaderboard ---
function saveNickname() {
    const nick = nicknameInput.value.trim().slice(0,16);
    if (nick) {
        localStorage.setItem('rps_nickname', nick);
        nicknameInput.value = nick;
        nicknameLabel.textContent = nick;
        updateLeaderboard();
    }
}
saveNicknameBtn.addEventListener('click', saveNickname);
nicknameInput.addEventListener('keydown', e => { if (e.key === 'Enter') saveNickname(); });
function getLeaderboard() {
    // Local leaderboard: array of {nick, wins}
    return JSON.parse(localStorage.getItem('rps_leaderboard') || '[]');
}
function setLeaderboard(lb) {
    localStorage.setItem('rps_leaderboard', JSON.stringify(lb));
}
function updateLeaderboard() {
    let lb = getLeaderboard();
    const nick = localStorage.getItem('rps_nickname') || 'You';
    // Update or add current user
    let found = false;
    for (let i=0; i<lb.length; ++i) {
        if (lb[i].nick === nick) {
            lb[i].wins = Math.max(lb[i].wins, userScore);
            found = true;
        }
    }
    if (!found && userScore > 0) lb.push({nick, wins: userScore});
    lb = lb.sort((a,b) => b.wins - a.wins).slice(0,10);
    setLeaderboard(lb);
    leaderboardList.innerHTML = '';
    lb.forEach((entry, i) => {
        const li = document.createElement('li');
        li.innerHTML = `<span class="leaderboard-rank">${i+1}.</span> <span class="leaderboard-name">${entry.nick}</span> <span class="leaderboard-score">${entry.wins}</span>`;
        leaderboardList.appendChild(li);
    });
}
window.addEventListener('DOMContentLoaded', () => {
    nicknameInput.value = localStorage.getItem('rps_nickname') || '';
    nicknameLabel.textContent = localStorage.getItem('rps_nickname') || 'You';
    updateLeaderboard();
});
document.addEventListener('keydown', e => {
    if (isGameOver) return;
    if (e.key === '1') rockBtn.click();
    if (e.key === '2') paperBtn.click();
    if (e.key === '3') scissorsBtn.click();
});
// --- Initialize ---
resetGame(); 