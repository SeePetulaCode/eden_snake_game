/* game.js

This code handles the game elements and interactions on game.html. 
Most of your work will be here!
*/

/***INITIALIZING VARIABLES AND OBJECTS***/
var canvas = document.getElementById("game");
var context = canvas.getContext("2d");
var grid = 40;
var count = 0;
var score = 0;
var snake = {
  x: 160,
  y: 160,
  color: "#94b800",
  x_step: grid, //snake velocity. moves one grid length every frame in either the x or y direction
  y_step: 0,
  cells: [], //an array that keeps track of all grids the snake body occupies
  currentLength: 4 //current length of the snake. grows when eating an apple.
};

// Snake skin Direction
let snakeSkinDir = 1;

/* TO DO: create apple object below */

var apple = {
  x: 0,
  y: 0,
  color: "rgba(255, 0, 0, 0.0)"
};

/***MAIN FUNCTIONS***/

/* start the game */
requestAnimationFrame(snakeSquadLoop);

/* Listen to keyboard events to move the snake */
document.addEventListener("keydown", function(e) {
  // prevent snake from backtracking on itself by checking that it's
  // not already moving on the same axis (pressing left while moving
  // left won't do anything, and pressing right while moving left
  // shouldn't let you collide with your own body)

  // left arrow key
  if (e.which === 37 && snake.x_step === 0) {
    snake.x_step = -grid;
    snake.y_step = 0;
    snakeSkinDir = 1;
  }
  // up arrow key
  else if (e.which === 38 && snake.y_step === 0) {
    snake.y_step = -grid;
    snake.x_step = 0;
    snakeSkinDir = 2;
  }
  // right arrow key
  else if (e.which === 39 && snake.x_step === 0) {
    snake.x_step = grid;
    snake.y_step = 0;
    snakeSkinDir = 1;
  }
  // down arrow key
  else if (e.which === 40 && snake.y_step === 0) {
    snake.y_step = grid;
    snake.x_step = 0;
    snakeSkinDir = 2;
  }
   // spacebar key
  else if (e.which === 32 && snake.y_step === 0) {
    snake.y_step = 0;
    snake.x_step = 0;
  }
});

/***HELPER FUNCTIONS***/

/*snakeSquadLoop: This is the main code that is run each time the game loops*/
function snakeSquadLoop() {
  requestAnimationFrame(snakeSquadLoop);
  // if count < 16, then keep looping. Don't animate until you get to the 16th frame. This controls the speed of the animation.
  if (count < 16) {
    count++;
    return;
  }
  //Otherwise, it's time to animate. add some

  count = 0;
  context.clearRect(0, 0, canvas.width, canvas.height);

  /*************************************************************************************/
  /* TO DO:which functions do we need to run for this game to work, and in what order?*/
  /*************************************************************************************/

  //  Draw Elements - Apple, Snake and Bitmoji
  checkCrashItself();
  calculateSnakeMove(); // Snake image moves - working

  drawApple(); // Create Apple image - working
  drawSnake(); // Create Snake image - working
  
  
  //  Score
  context.font = "italic 30pt Calibri";
  context.fillStyle = "white";
  let text = "Score: " + score;
  context.fillText(text, 450, 50);

  //  Plan: Draw Elements - Apple, Snake and Bitmoji

  //  Animation/Extra Stuff/Plans
  //  Pause Game
  //  End Game Screen
  //  Leader Board
  //  Music

  /*************************************************************************************/
  /* END: helper functions                                                            */
  /*************************************************************************************/

  if (snakeTouchesApple()) {
    lengthenSnakeByOne();
    randomlyGenerateApple();

    console.log(lengthenSnakeByOne());
  } else if (checkCrashItself() == true) {
    endGame();
  }
}

function calculateSnakeMove() {
  // move snake by its velocity
  snake.x += snake.x_step;
  snake.y += snake.y_step;

  // wrap snake position horizontally on edge of screen
  if (snake.x < 0) {
    snake.x = canvas.width - grid;
  } else if (snake.x >= canvas.width) {
    snake.x = 0;
  }
  // wrap snake position vertically on edge of screen
  if (snake.y < 0) {
    snake.y = canvas.height - grid;
  } else if (snake.y >= canvas.height) {
    snake.y = 0;
  }
  // keep track of where snake has been. front of the array is always the head
  snake.cells.unshift({ x: snake.x, y: snake.y });

  // remove cells as we move away from them
  if (snake.cells.length > snake.currentLength) {
    snake.cells.pop();
  }
}

/*drawApple
uses context functions to fill the cell at apple.x and apple.y with apple.color 
*/

/* Thu 11:59 - Might change */
function drawApple() {
  /* TO DO */

  context.fillStyle = apple.color;
  context.fillRect(apple.x, apple.y, grid, grid);

  let img = document.getElementById("appleimg");
  context.drawImage(img, apple.x, apple.y);

  
}

/*drawSnake
For each cell of the snake, fill in the grid at the location (cell.x, cell.y) with the snake.color 
If the cell is the first cell in the array, use the drawCellWithBitmoji function to draw that cell as the user's bitmoji 
*/
function drawSnake() {
  /* TO DO */

  for (let i = 1; i < snake.cells.length; i++) {
    let current_cell = snake.cells[i];
    drawCellWithBitmoji(snake.cells[0]);
    context.fillStyle = snake.color;
    context.fillRect(current_cell.x, current_cell.y, grid, grid);
    let img1 = document.getElementById("snakeimg");
    let img2 = document.getElementById("snakeimg2");
    
    //if moving up or down change snake body image
    if (snakeSkinDir === 1) {
    context.drawImage(img1, current_cell.x, current_cell.y);
  } else {
    context.drawImage(img2, current_cell.x, current_cell.y);
  }
    
  }
}

/*drawCellWithBitmoji
Takes a cell (with an x and y property) and fills the cell with a bitmoji instead of a square
*/

function drawCellWithBitmoji(cell) {
  var avatar_url = localStorage.getItem("avatarurl");
  document.getElementById("avatar").src = avatar_url;
  context.drawImage(
    document.getElementById("avatar"),
    0,
    0,
    200,
    200,
    cell.x,
    cell.y,
    grid,
    grid
  );
}

/*snakeTouchesApple
checks if any cell in the snake is at the same x and y location of the apple
returns true (the snake is eating the apple) or false (the snake is not eating the apple)
*/
function snakeTouchesApple() {
  let head = snake.cells[0];
  if (head.x === apple.x && head.y === apple.y) {
    score++;
    return true;
  } else {
    return false;
  }
}

/*lengthenSnakeByOne
increments the currentLength property of the snake object by one to show that the snake has eaten an apple
*/
function lengthenSnakeByOne() {
  snake.currentLength = snake.currentLength + 1;
  return snake.currentLength;
}

/*randomlyGenerateApple
uses getRandomInt to generate a new x and y location for the apple within the grid
this function does not draw the apple itself, it only stores the new locations in the apple object
*/
function randomlyGenerateApple() {
  apple.x = getRandomInt(0, 15) * grid;
  apple.y = getRandomInt(0, 15) * grid;
}

/*checkCrashItself
checks if any cell in the snake is at the same x and y location of the any other cell of the snake
returns true (the snake crashed into itself) or false (the snake is not crashing) 
*/

function checkCrashItself() {
  // loop to give existing snake array
  for (let i = 0; i < snake.cells.length; i++) {
    // loop to give existing snake array of body not head
    for (let k = i + 1; k < snake.cells.length; k++) {
      if (
        // if overlap; Gameover
        snake.cells[i].x === snake.cells[k].x &&
        snake.cells[i].y === snake.cells[k].y
      ) {
        return true;
      }
    }
  }
}

/*endGame
displays an alert and reloads the page
*/
function endGame() {
  //alert("GAME OVER");
  let text = "";
  context.font = "italic 30pt Calibri";
  context.fillStyle = "white";
  let text2 = "Game Over";
  text2 = "";
  text2 = "Game Over";
  text2 = "";
  context.fillText(text2, 240, 100);
  document.location.reload();
}

/*getRandomInt
takes a mininum and maximum integer
returns a whole number randomly in that range, inclusive of the mininum and maximum
see https://stackoverflow.com/a/1527820/2124254
*/
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}
