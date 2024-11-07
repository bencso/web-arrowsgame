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
}

function stopGame() {
  running = false;
  clearInterval(timerInterval);
  calculateAvgRT();
  updateActionButton("Start", startGame);
  removeEventListeners();
  toggleTimerBlink(true);
  points = 0;
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
}

function checkDirection(keyDirection) {
  const isCorrect = keyDirection === direction;
  dpPhElement.style.color = isCorrect ? "#00FF00" : "#FF0000";
  if (isCorrect) points++;
  highlightButton(keyDirection);
  setTimeout(() => {
    dpPhElement.style.color = "#FAF0E6";
    unhighlightButton(keyDirection);
    getDirection();
  }, 100);
  reactionTimes.push(Date.now() - startTime);
}

function highlightButton(keyDirection) {
  document
    .querySelector(`[data-key="${keyDirection}"]`)
    .classList.add("hovered");
}

function unhighlightButton(keyDirection) {
  document
    .querySelector(`[data-key="${keyDirection}"]`)
    .classList.remove("hovered");
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
    reactionTimes.reduce((acc, curr) => acc + curr, 0) / reactionTimes.length;
  const minRT = Math.min(...reactionTimes);
  const successRate = (points / reactionTimes.length) * 100;
  dpPhElement.textContent =
    reactionTimes.length > 0
      ? `AVG reaction time: ${avgRT.toFixed(
          2
        )}ms, Fastest reaction: ${minRT} ms, Score: ${
          reactionTimes.length
        }/${points}, Success rate: ${successRate.toFixed(2)}%`
      : `AVG reaction time: 0ms, Fastest reaction: 0 ms, Score: 0/0, Success rate: 0%`;
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
