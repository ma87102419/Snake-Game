const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");
// return 一個 canvas 的 drawing context，drawing context 可在 canvas 內畫圖
const unit = 20;
const column = canvas.width / unit; // 320 / 20 = 16
const row = canvas.height / unit; // 320 / 20 = 16

let snake = [];
function createSnake() {
  snake[0] = {
    x: 80,
    y: 0,
  };
  snake[1] = {
    x: 60,
    y: 0,
  };
  snake[2] = {
    x: 40,
    y: 0,
  };
  snake[3] = {
    x: 20,
    y: 0,
  };
}

class Fruit {
  constructor() {
    this.x = Math.floor(Math.random() * column) * unit;
    this.y = Math.floor(Math.random() * row) * unit;
  }
  drawFruit() {
    ctx.fillStyle = "yellow";
    ctx.fillRect(this.x, this.y, unit, unit);
  }

  pickALocation() {
    let overlapping = false;
    let new_x;
    let new_y;

    function checkOverlap(new_x, new_y) {
      for (let i = 0; i < snake.length; i++) {
        if (new_x == snake[i].x && new_y == snake[i].y) {
          overlapping = true;
          return;
        } else {
          overlapping = false;
        }
      }
    }

    do {
      new_x = Math.floor(Math.random() * column) * unit;
      new_y = Math.floor(Math.random() * row) * unit;
      checkOverlap(new_x, new_y);
    } while (overlapping);

    this.x = new_x;
    this.y = new_y;
  }
}

let direction = "Right";
function changeDirection(e) {
  if (e.key == "ArrowLeft" && direction != "Right") {
    direction = "Left";
  } else if (e.key == "ArrowRight" && direction != "Left") {
    direction = "Right";
  } else if (e.key == "ArrowDown" && direction != "Up") {
    direction = "Down";
  } else if (e.key == "ArrowUp" && direction != "Down") {
    direction = "Up";
  }
  window.removeEventListener("keydown", changeDirection);
}

function loadHighestScore() {
  if (!localStorage.getItem("highestScore")) {
    highestScore = 0;
  } else {
    highestScore = Number(localStorage.getItem("highestScore"));
  }
}

function setHighestScore(score) {
  if (score > highestScore) {
    localStorage.setItem("highestScore", score);
    highestScore = score;
  }
}

let myFruit = new Fruit();
function draw() {
  // check snake 有沒有咬到自己
  for (let i = 1; i < snake.length; i++) {
    if (snake[i].x == snake[0].x && snake[i].y == snake[0].y) {
      clearInterval(myGame);
      alert("Game Over!");
      return;
    }
  }
  // 每次畫之前都要先 refresh canvas
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  myFruit.drawFruit();
  for (let i = 0; i < snake.length; i++) {
    if (i == 0) {
      ctx.fillStyle = "lightgreen";
    } else {
      ctx.fillStyle = "lightblue";
    }
    ctx.strokeStyle = "white";
    snake[i].x = snake[i].x % canvas.width;
    snake[i].y = snake[i].y % canvas.height;
    if (snake[i].x < 0) {
      snake[i].x += canvas.width;
    }
    if (snake[i].y < 0) {
      snake[i].y += canvas.height;
    }
    ctx.fillRect(snake[i].x, snake[i].y, unit, unit);
    ctx.strokeRect(snake[i].x, snake[i].y, unit, unit);
  }

  let snakeX = snake[0].x;
  let snakeY = snake[0].y;
  if (direction == "Left") {
    snakeX -= unit;
  } else if (direction == "Right") {
    snakeX += unit;
  } else if (direction == "Down") {
    snakeY += unit;
  } else if (direction == "Up") {
    snakeY -= unit;
  }

  let newHead = {
    x: snakeX,
    y: snakeY,
  };
  if (snake[0].x == myFruit.x && snake[0].y == myFruit.y) {
    myFruit.pickALocation();
    score += 1;
    setHighestScore(score);
    document.getElementById("currentScore").innerHTML =
      "Current Score: " + score;
    document.getElementById("highestScore").innerHTML =
      "Highest Score: " + highestScore;
  } else {
    snake.pop();
  }
  snake.unshift(newHead);
  window.addEventListener("keydown", changeDirection);
}

// main
let highestScore;
loadHighestScore();
let score = 0;
document.getElementById("currentScore").innerHTML = "Current Score: " + score;
document.getElementById("highestScore").innerHTML =
  "Highest Score: " + highestScore;

createSnake();
window.addEventListener("keydown", changeDirection);

let myGame = setInterval(draw, 100);
