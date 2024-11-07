const directions = ["up", "down", "right", "left"];
let running = false;
const dpPhElement = document.querySelector(".dp-ph");
const keyboardBtns = document.querySelectorAll("[data-key]");
const timerElement = document.querySelector("#timer");
const actionBtn = document.querySelector("#actionBtn");
let timerInterval;
let startTime = 0;
let reactionTimes = [];
let points = 0;

function startGame() {
    running = true;
    getDirection();
    startTimer();
    actionBtn.textContent = "Stop";
    actionBtn.removeEventListener("click", startGame);
    actionBtn.addEventListener("click", stopGame);
    document.querySelector(".timer").classList.remove("blink");
}

function stopGame() {
    running = false;
    clearInterval(timerInterval);
    calculateAvgRT();
    actionBtn.textContent = "Start";
    actionBtn.removeEventListener("click", stopGame);
    actionBtn.addEventListener("click", startGame);
    keyboardBtns.forEach((btn) => {
        btn.removeEventListener("click", handleClick);
    });
    window.removeEventListener("keydown", handleKeyDown);
    document.querySelector(".timer").classList.add("blink");
    points = 0;
}

function randomDirection() {
    const randomIndex = Math.floor(Math.random() * directions.length);
    return directions[randomIndex];
}

function getDirection() {
    if (!running) return;
    startTime = new Date().getTime();
    const direction = randomDirection();
    dpPhElement.textContent = direction;
    keyboardBtns.forEach((btn) => {
        btn.removeEventListener("click", handleClick);
        btn.addEventListener("click", handleClick);
    });
    window.removeEventListener("keydown", handleKeyDown);
    window.addEventListener("keydown", handleKeyDown);
}

function handleClick() {
    const keyDirection = this.dataset.key;
    checkDirection(keyDirection, dpPhElement.textContent);
}

function handleKeyDown(event) {
    let keyDirection = event.key.toLowerCase();
    if (keyDirection.includes("arrow")) {
        keyDirection = keyDirection.replace("arrow", "").toLowerCase();
    }
    if (keyDirection === "escape") {
        stopGame();
    }
    if (keyDirection === "enter") {
        startGame();
    }
    if (directions.includes(keyDirection)) {
        checkDirection(keyDirection, dpPhElement.textContent);
    }
}

function checkDirection(keyDirection, direction) {
    console.table({ key: keyDirection, random: direction, isEqual: keyDirection === direction });
    document.querySelector(`[data-key="${keyDirection}"]`).classList.add("hovered");
    if (keyDirection === direction) {
        dpPhElement.style.color = "green";
        points++;
    } else {
        dpPhElement.style.color = "red";
    }
    setTimeout(() => {
        dpPhElement.style.color = "black";
        document.querySelector(`[data-key="${keyDirection}"]`).classList.remove("hovered");
        getDirection();
    }, 100);
    const reactionTime = new Date().getTime() - startTime;
    reactionTimes.push(reactionTime);
}

function startTimer() {
    let time = 20;
    timerElement.textContent = time.toFixed(2).padStart(5, '0');
    timerInterval = setInterval(() => {
        time -= 0.01;
        timerElement.textContent = time.toFixed(2).padStart(5, '0');
        if (time <= 0) {
            stopGame();
        }
    }, 10);
}


function calculateAvgRT() {
    const avgRT = reactionTimes.reduce((acc, curr) => acc + curr, 0) / reactionTimes.length;
    const minRT = Math.min(...reactionTimes);
    const successRate = (points / reactionTimes.length) * 100;
    dpPhElement.textContent = `AVG reaction time: ${avgRT.toFixed(2)}ms, Fastest reaction: ${minRT}ms, Score: ${reactionTimes.length}/${points}, Success rate: ${successRate.toFixed(2)}%`;
    reactionTimes = [];
}
