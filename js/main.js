const directions = ["up", "down", "right", "left"];
let running = false;
let timerInterval;
let startTime = 0;
let reactionTimes = [];
let points = 0;
let direction = "";
let preloadedDirections = preloadDirections();

const dpPhElement = document.querySelector(".game__placeholder");
const keyboardBtns = document.querySelectorAll("[data-key]");
const timerElement = document.querySelector("#timer");
const actionBtn = document.querySelector("#actionBtn");

function startGame() {
  running = true;
  updateActionButton("Stop", stopGame);
  toggleTimerBlink(false);
  getDirection();
  this.blur();
}

function stopGame() {
  running = false;
  clearInterval(timerInterval);
  calculateAvgRT();
  updateActionButton("Start", startGame);
  removeEventListeners();
  toggleTimerBlink(true);
  leaderboard();
  points = 0;
  this.blur();
}

function preloadDirections() {
  return Array.from({ length: 2 }, randomDirection);
}

function updateActionButton(text, handler) {
  actionBtn.textContent = text;
  actionBtn.onclick = handler;
}

function randomDirection() {
  return directions[Math.floor(Math.random() * directions.length)];
}

function getDirection() {
  if (!running) return;
  startTime = Date.now();
  direction = preloadedDirections.shift();
  preloadedDirections.push(randomDirection());
  updateSlider(direction);
  //? If the player reacts, always restart the counting, because then you can play to infinity.
  resetTimer();
  addEventListeners();
}

function handleClick() {
  checkDirection(this.dataset.key);
}

function updateSlider(direction) {
  dpPhElement.innerHTML = `
        <span class="fa6-solid--${direction}-long"></span>
        <span class="fa6-solid--${preloadedDirections[0]}-long"></span>
    `;
}

function handleKeyDown(event) {
  const keyDirection = event.key.toLowerCase().replace("arrow", "");
  if (keyDirection === "escape") stopGame();
  if (directions.includes(keyDirection)) checkDirection(keyDirection);
  highlightButton(keyDirection);
}

function checkDirection(keyDirection) {
  const isCorrect = keyDirection === direction;
  dpPhElement.style.color = isCorrect ? "#00FF00" : "#FF0000";
  if (isCorrect) points++;
  setTimeout(() => {
    dpPhElement.style.color = "#FAF0E6";
    unhighlightButton(keyDirection);
    getDirection();
  }, 100);
  reactionTimes.push(Date.now() - startTime);
}

function highlightButton(keyDirection) {
  const keyElement = document.querySelector(`[data-key="${keyDirection}"]`);
  if (keyElement) {
    keyElement.classList.add("hovered");
  }
}

function unhighlightButton(keyDirection) {
  const keyElement = document.querySelector(`[data-key="${keyDirection}"]`);
  if (keyElement) {
    keyElement.classList.remove("hovered");
  }
}

function startTimer() {
  let time = 20;
  timerElement.textContent = formatTime(time);
  timerInterval = setInterval(() => {
    time -= 0.01;
    timerElement.textContent = formatTime(time);
    if (time <= 0) stopGame();
  }, 10);
}

function resetTimer() {
  clearInterval(timerInterval);
  startTimer();
}

function formatTime(time) {
  return time.toFixed(2).padStart(5, "0");
}

function calculateAvgRT() {
  const avgRT =
    reactionTimes.reduce((acc, curr) => acc + curr, 0) / reactionTimes.length ||
    0;
  const minRT = Math.min(...reactionTimes) || 0;
  const successRate = (points / reactionTimes.length) * 100 || 0;
  const infoBox = document.querySelector(".game__info");
  if (minRT !== 0 && successRate !== 0 && avgRT !== 0) {
    infoBox.innerHTML = `
    <p>Avg RT: ${avgRT.toFixed(2)} ms</p>
    <p>Min RT: ${minRT.toFixed(2)} ms</p>
    <p>Success Rate: ${successRate.toFixed(2)}%</p>
  `;
  } else {
    infoBox.innerHTML = `
    <p>Play the game to see your stats!</p>
  `;
  }
  dpPhElement.innerHTML = `Play again? Press Enter or click the Start button.`;
  reactionTimes = [];
}

function addEventListeners() {
  keyboardBtns.forEach((btn) => {
    btn.removeEventListener("click", handleClick);
    btn.addEventListener("click", handleClick);
  });
  window.removeEventListener("keydown", handleKeyDown);
  window.addEventListener("keydown", handleKeyDown);
}

function removeEventListeners() {
  keyboardBtns.forEach((btn) => btn.removeEventListener("click", handleClick));
  window.removeEventListener("keydown", handleKeyDown);
}

function toggleTimerBlink(shouldBlink) {
  document
    .querySelector(".game__timer")
    .classList.toggle("game__timer--blink", shouldBlink);
}

window.addEventListener("keydown", (event) => {
  if (event.key.toLowerCase() === "enter" && !running) startGame();
});

function leaderboard() {
  const leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [];
  const userName = document.querySelector("#nameInput").value || "Anonymous";
  const userScore = points;
  leaderboard.push({ name: userName, score: userScore });
  leaderboard.sort((a, b) => b.score - a.score);
  localStorage.setItem("leaderboard", JSON.stringify(leaderboard));
  renderLeaderboard(leaderboard);
}

function renderLeaderboard(leaderboard) {
  const leaderboardElement = document.querySelector("#leaderboardList");
  leaderboardElement.innerHTML = "";
  if (leaderboard.length === 0) {
    leaderboardElement.innerHTML = "<p>No scores yet!</p>";
    return;
  }
  leaderboard.slice(0, 5).forEach((user, index) => {
    leaderboardElement.innerHTML += `
      <li>${index + 1}. ${user.name} - ${user.score}</li>
    `;
  });
}

function resetLeaderboard() {
  localStorage.removeItem("leaderboard");
  renderLeaderboard([]);
}

document.addEventListener("DOMContentLoaded", () => {
  renderLeaderboard(JSON.parse(localStorage.getItem("leaderboard")) || []);
});
