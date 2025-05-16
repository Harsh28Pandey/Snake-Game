const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scoreDisplay = document.getElementById("score");
const gameOverScreen = document.getElementById("gameOverScreen");
const leftBtn = document.getElementById("leftBtn");
const rightBtn = document.getElementById("rightBtn");
const upBtn = document.getElementById("upBtn");
const downBtn = document.getElementById("downBtn");

const gridSize = 20;
const canvasSize = 400;
let snake = [{ x: 9 * gridSize, y: 9 * gridSize }];
let food = { x: 5 * gridSize, y: 5 * gridSize };
let dx = gridSize;
let dy = 0;
let score = 0;
let gameInterval;
let isPaused = false;

function drawGame() {
    ctx.clearRect(0, 0, canvasSize, canvasSize);

    // Draw snake
    snake.forEach((segment, index) => {
        ctx.fillStyle = index === 0 ? "#4CAF50" : "#228B22"; // Head is dark green
        ctx.fillRect(segment.x, segment.y, gridSize, gridSize);
    });

    // Draw food
    ctx.fillStyle = "#FF6347";
    ctx.fillRect(food.x, food.y, gridSize, gridSize);

    // Update score
    scoreDisplay.textContent = `Score: ${score}`;

    // Move the snake
    const newHead = { x: snake[0].x + dx, y: snake[0].y + dy };

    if (newHead.x < 0) newHead.x = canvasSize - gridSize;
    if (newHead.x >= canvasSize) newHead.x = 0;
    if (newHead.y < 0) newHead.y = canvasSize - gridSize;
    if (newHead.y >= canvasSize) newHead.y = 0;

    snake.unshift(newHead);

    // Check for collision with food
    if (newHead.x === food.x && newHead.y === food.y) {
        score++;
        playEatSound();
        generateFood();
    } else {
        snake.pop();
    }

    // Check for collision with itself
    for (let i = 1; i < snake.length; i++) {
        if (newHead.x === snake[i].x && newHead.y === snake[i].y) {
            gameOver();
            return;
        }
    }
}

function generateFood() {
    food = {
        x: Math.floor(Math.random() * (canvasSize / gridSize)) * gridSize,
        y: Math.floor(Math.random() * (canvasSize / gridSize)) * gridSize
    };
}

function playEatSound() {
    const eatSound = new Audio();
    eatSound.src = "data:audio/wav;base64,UklGRvKXAgBXQVZFZmNkZWZnaGhpa3ZyIWM0FZ+R0do7ivMeGzS3prky99RzFZB2pfATvV0cDWqcpaFgHZAOKREDCmqGHwrpW2V1uwmHvpxqlpg4kIhxo0LrlsVTo9F4WOkM1BmnGbP95N1E7onob8XVo98d5tnF5po5dfn3QNjrQIRF6RrJ+JtrV6U7E3ybOpZI5bMcJtGJ4wpfVShgqeqVn8nqM=";
    eatSound.play();
}

function gameOver() {
    clearInterval(gameInterval);
    gameOverScreen.style.display = "block";
}

function restartGame() {
    snake = [{ x: 9 * gridSize, y: 9 * gridSize }];
    dx = gridSize;
    dy = 0;
    score = 0;
    gameOverScreen.style.display = "none";
    gameInterval = setInterval(drawGame, 100);
}

function pauseGame() {
    if (isPaused) {
        gameInterval = setInterval(drawGame, 100);
        isPaused = false;
    } else {
        clearInterval(gameInterval);
        isPaused = true;
    }
}

// Prevent 180 degree turns
function setDirection(newDx, newDy) {
    if (dx === -newDx || dy === -newDy) return; // Prevent opposite directions
    dx = newDx;
    dy = newDy;
}

// Control buttons
leftBtn.addEventListener("click", () => setDirection(-gridSize, 0));
rightBtn.addEventListener("click", () => setDirection(gridSize, 0));
upBtn.addEventListener("click", () => setDirection(0, -gridSize));
downBtn.addEventListener("click", () => setDirection(0, gridSize));

// Keyboard controls
document.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") setDirection(-gridSize, 0);
    if (event.key === "ArrowRight") setDirection(gridSize, 0);
    if (event.key === "ArrowUp") setDirection(0, -gridSize);
    if (event.key === "ArrowDown") setDirection(0, gridSize);
});

gameInterval = setInterval(drawGame, 100);