let snake;
let food;
let gridSize = 20;
let gameEnded = false;
let isPaused = false;
let score = 0;

function setup() {
  createCanvas(400, 400);
  frameRate(10);
  snake = new Snake();
  createFood();
}

function draw() {
  background(51);

  if (!gameEnded) {
    if (!isPaused) {
      snake.update();
      snake.show();

      if (snake.eat(food)) {
        createFood();
        score++; // Increment the score when the snake eats the food
      }

      fill(255, 0, 0);
      rect(food.x, food.y, gridSize, gridSize);

      // Display the score
      fill(255);
      textSize(16);
      textAlign(LEFT, TOP);
      text(`Score: ${score}`, 10, 10);

      if (snake.endGame()) {
        endGame();
      }
    } else {
      displayPauseMenu();
    }
  } else {
    displayGameOver();
  }
}

function keyPressed() {
  if (!gameEnded) {
    handleGameKeyPresses();
  } else {
    // If the game has ended, allow only 'R' to restart
    if (key === 'R' || key === 'r') {
      restartGame();
    }
  }
}

function handleGameKeyPresses() {
  if (keyCode === UP_ARROW) {
    snake.setDirection(0, -1);
  } else if (keyCode === DOWN_ARROW) {
    snake.setDirection(0, 1);
  } else if (keyCode === RIGHT_ARROW) {
    snake.setDirection(1, 0);
  } else if (keyCode === LEFT_ARROW) {
    snake.setDirection(-1, 0);
  } else if ((key === 'P' || key === 'p') && !isPaused) {
    isPaused = true;
    noLoop();
  } else if ((key === 'P' || key === 'p') && isPaused) {
    isPaused = false;
    loop();
  }
}

function displayPauseMenu() {
  fill(255, 0, 0);
  textSize(32);
  textAlign(CENTER, CENTER);
  text("Paused", width / 2, height / 2);
  text("Press 'P' to Resume", width / 2, height / 2 + 40);
}

function displayGameOver() {
  fill(255, 0, 0);
  textSize(32);
  textAlign(CENTER, CENTER);
  text("Game Over", width / 2, height / 2);
  text("Press 'R' to Restart", width / 2, height / 2 + 40);
}

function createFood() {
  let cols = floor(width / gridSize);
  let rows = floor(height / gridSize);

  // Create a temporary variable to store the new food position
  let newFood = createVector(floor(random(cols)), floor(random(rows)));
  newFood.mult(gridSize);

  // Check if the new food position coincides with the snake's body
  while (snake.intersects(newFood)) {
    newFood = createVector(floor(random(cols)), floor(random(rows)));
    newFood.mult(gridSize);
  }

  // Assign the new food position to the global 'food' variable
  food = newFood;
}

function endGame() {
  gameEnded = true;
  fill(255, 0, 0);
  textSize(32);
  textAlign(CENTER, CENTER);
  text("Game Over", width / 2, height / 2);
  text("Press 'R' to Restart", width / 2, height / 2 + 40);
}

function restartGame() {
  gameEnded = false;
  score = 0; // Reset the score
  snake = new Snake();
  createFood();
  loop();
}

class Snake {
  constructor() {
    this.body = [];
    this.body[0] = createVector(floor(width / 2), floor(height / 2));
    this.xdir = 0;
    this.ydir = 0;
  }

  setDirection(x, y) {
    this.xdir = x;
    this.ydir = y;
  }

  update() {
    let head = this.body[this.body.length - 1].copy();
    this.body.shift();
    head.x += this.xdir * gridSize;
    head.y += this.ydir * gridSize;
    this.body.push(head);
  }

  show() {
    for (let i = 0; i < this.body.length; i++) {
      fill(0, 255, 0);
      noStroke();
      rect(this.body[i].x, this.body[i].y, gridSize, gridSize);
    }
  }

  eat(pos) {
    let head = this.body[this.body.length - 1];
    if (head.x === pos.x && head.y === pos.y) {
      // Extend the snake's body in the direction it is currently moving
      this.body.push(createVector(head.x + this.xdir * gridSize, head.y + this.ydir * gridSize));
      return true;
    }
    return false;
  }

  intersects(pos) {
    for (let i = 0; i < this.body.length; i++) {
      if (pos.x === this.body[i].x && pos.y === this.body[i].y) {
        return true;
      }
    }
    return false;
  }

  endGame() {
    let head = this.body[this.body.length - 1];
    if (head.x >= width || head.x < 0 || head.y >= height || head.y < 0) {
      return true;
    }
    for (let i = 0; i < this.body.length - 1; i++) {
      let part = this.body[i];
      if (part.x === head.x && part.y === head.y) {
        return true;
      }
    }
    return false;
  }
}

//Made by Arnie Verma :)