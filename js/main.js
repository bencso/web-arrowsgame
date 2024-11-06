const directions = ["up", "down", "right", "left"];
let running = false;
let points = 0;

function startGame() {
    running = true;
    getDirection();
}

function stopGame() {
    running = false;
}

function randomDirection() {
    const randomIndex = Math.floor(Math.random() * directions.length);
    return directions[randomIndex];
}

function getDirection() {
    if (!running) {
        return;
    }
    const direction = randomDirection();
    document.querySelector(".dp-ph").textContent = direction;
    console.log(direction);
    const keyboardBtns = document.querySelectorAll("[data-key]");
    keyboardBtns.forEach(btn => {
        btn.removeEventListener("click", handleClick);
        btn.addEventListener("click", handleClick);
    });
    window.removeEventListener("keydown", handleKeyDown);
    window.addEventListener("keydown", handleKeyDown);
}

function handleClick() {
    const keyDirection = this.dataset.key;
    checkDirection(keyDirection);
}

function handleKeyDown(event) {
    const keyDirection = event.key.toLowerCase();
    checkDirection(keyDirection);
}
function checkDirection(keyDirection) {
    const direction = randomDirection();
    if (keyDirection.includes("arrow")) {
        keyDirection = keyDirection.replace("arrow", "").toLowerCase();
    }
    console.table({ keyDirection, direction });
    const dpPhElement = document.querySelector(".dp-ph");
    if (direction === keyDirection) {
        dpPhElement.style.color = "green";
    } else {
        dpPhElement.style.color = "red";
    }
    getDirection();
}
