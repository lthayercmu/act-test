let grid; //the game board
let r; //row
let c; //column
let canvas; //HTML Canvas for the the game
let w; //width of each spot in the grid
let track = false;
let count; //number of bombs
let victory = false; //judges outcome of game
let gameOver = false; //game over
let flagged_bombs = 0; //# of bombs flagged
let bombs_picked = false;
let beginning_count;
let clicked = 0;
let mode = 0;
let empty_spaces;
let myTimer;
let timerclicked = false;
let secret = "hello123!";
let password = "hello123!";

//makes the board for the bombs to be placed in
function makeBoard(c, r) {
  let board = new Array(c);
  for (let i = 0; i < board.length; i++) {
    board[i] = new Array(r);
  }
  return board;
}


//sets up which game you are playing 
function setupGrid() {
  canvas = document.getElementById("GameBoard");
  if (mode == 0) {
    canvas.height = 360;
    canvas.width = 360;
  } else if (mode == 1) {
    canvas.height = 480;
    canvas.width = 480;
  } else if (mode == 2) {
    canvas.height = 480;
    canvas.width = 900;
  }
  c = Math.floor(canvas.width / w);
  r = Math.floor(canvas.height / w);
  empty_spaces = 0;
  grid = makeBoard(c, r);
  for (let i = 0; i < c; i++) {
    for (let j = 0; j < r; j++) {
      grid[i][j] = new bomb(i, j, i * w, j * w, w);
      empty_spaces++;
    }
  }
}

//makes the grid using the canvas
function drawGrid() {
  for (let i = 0; i < c; i++) {
    for (let j = 0; j < r; j++) {
      if (grid[i][j].game == false) {
        canvas.addEventListener("click", onClick, false);
        canvas.addEventListener("contextmenu", onRClick, false);
        grid[i][j].showBomb();
      }
    }
  }
}

//chooses where the bombs are to be randomly placed 
//This happens after the first left click is made
function pickBombs(a, b) {
  let num = 0;
  grid[a][b].allBombs = "";
  for (let x = 0; x < count; x++) {
    while (track == false) {
      let i = Math.floor(Math.random(0) * c);
      let j = Math.floor(Math.random(0) * r);
      if (grid[i][j] != grid[a][b]) {

        if(grid[a][b].allBombs == ""){
          for (let i2 = -1; i2 <= 1; i2++) {
            for (let j2 = -1; j2 <= 1; j2++) {
              if ((i2 + a) > -1 && (i2 + a) < c && (j2 + b) > -1 && (j2 + b) < r) {
                  grid[a + i2][b + j2].keypressed = true;
              }
            }
          }
        }

        if (grid[i][j].thebomb == true || grid[i][j].keypressed == true) {
          track = false;
        } else {
            grid[i][j].thebomb = true;
            track = true;
            empty_spaces--;
            num++;
        }
      }
    }
    track = false;
  }
  document.getElementById("counter").innerHTML = count;
}


//Left click
//Also judges when the game is won or lost
function onClick(e) {
  let element = canvas;
  let offsetX = 0;
  let offsetY = 0
  if (element.offsetParent) {
    do {
      offsetX += element.offsetLeft;
      offsetY += element.offsetTop;
    } while ((element = element.offsetParent));
  }
  x = e.pageX - offsetX;
  y = e.pageY - offsetY;

  if (timerclicked == false && gameOver == false) {
    myTimer = setInterval(myCounter, 1000);
    timerclicked = true;
  }

  if ((grid[Math.floor(x / w)][Math.floor(y / w)]).Rkey == false &&
    (grid[Math.floor(x / w)][Math.floor(y / w)]).game == false) {
    if ((grid[Math.floor(x / w)][Math.floor(y / w)]).thebomb == true) {
      victory = false;
      endGame(victory);
    } else {
      if((grid[Math.floor(x / w)][Math.floor(y / w)]).revealed == false){
        empty_spaces--;
      }
      (grid[Math.floor(x / w)][Math.floor(y / w)]).keypressed = true;
      (grid[Math.floor(x / w)][Math.floor(y / w)]).zeroCalc(Math.floor(x / w), Math.floor(y / w));
      (grid[Math.floor(x / w)][Math.floor(y / w)]).showBomb();
      if (empty_spaces == 0){//count == 0 &&  flagged_bombs == beginning_count
        victory = true;
        endGame(victory);
      }
    }
  }
  clicked++;
}

//right click
function onRClick(e) {
  let element = canvas;
  let offsetX = 0;
  let offsetY = 0
  if (element.offsetParent) {
    do {
      offsetX += element.offsetLeft;
      offsetY += element.offsetTop;
    } while ((element = element.offsetParent));
  }
  x = e.pageX - offsetX;
  y = e.pageY - offsetY;
  if ((grid[Math.floor(x / w)][Math.floor(y / w)]).flagged == false &&
    (grid[Math.floor(x / w)][Math.floor(y / w)]).revealed == false &&
    (grid[Math.floor(x / w)][Math.floor(y / w)]).game == false) {

    if ((grid[Math.floor(x / w)][Math.floor(y / w)]).thebomb == true) {
      flagged_bombs++;
    }

    (grid[Math.floor(x / w)][Math.floor(y / w)]).flagged = true;
    (grid[Math.floor(x / w)][Math.floor(y / w)]).Rkey = true;
    (grid[Math.floor(x / w)][Math.floor(y / w)]).showBomb();
    count--;
    document.getElementById("counter").innerHTML = count;

    if ((empty_spaces == 0)) {//count == 0 && flagged_bombs == beginning_count &&
      victory = true;
      endGame(victory);
    }

  } else {

    if ((grid[Math.floor(x / w)][Math.floor(y / w)]).thebomb == true) {
      flagged_bombs--;
    }

    (grid[Math.floor(x / w)][Math.floor(y / w)]).flagged = false;
    (grid[Math.floor(x / w)][Math.floor(y / w)]).Rkey = false;
    (grid[Math.floor(x / w)][Math.floor(y / w)]).showBomb();

    if((grid[Math.floor(x / w)][Math.floor(y / w)]).game == false && (grid[Math.floor(x / w)][Math.floor(y / w)]).revealed == false){
      count++;
      document.getElementById("counter").innerHTML = count;
    }
  }
}

//counts the number of bombs
function countBombs() {
  for (let i = 0; i < c; i++) {
    for (let j = 0; j < r; j++) {
      grid[i][j].bombCount();
    }
  }
}

//for clearing the first click
function initialClearSpace(x,y){
  clearSpace(x,y);
}

//clears space when you click on a cell with no connection to a bomb
function clearSpace(a, b) {
  let spotA = a;
  let spotB = b;

  if (bombs_picked == false) {
    pickBombs(spotA, spotB);
    countBombs();
    bombs_picked = true;
  }

  if ((grid[a][b]).allBombs == 0) {
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        if ((i + a) > -1 && (i + a) < c && (j + b) > -1 && (j + b) < r) {
          if (grid[a + i][b + j].thebomb == false && grid[a + i][b + j].revealed == false) {
            if (grid[a + i][b + j].flagged == false) {
              empty_spaces--;
              grid[a + i][b + j].zeroCalc();
              grid[a + i][b + j].showBomb();
            }
          }
        }
      }
    }
  }
}

let ctime = 0;

function myCounter() {
  document.getElementById("timer").innerHTML = ++ctime;
  let min = Math.floor(ctime/60);
  let sec = ctime - min * 60;
  if(min < 10){min = "0" + min;}
  if(sec < 10){sec = "0" + sec;}
  document.getElementById("timer").innerHTML = min + ":" + sec;
}

function endGame(v) {
  if (v == false) {
    for (let i = 0; i < c; i++) {
      for (let j = 0; j < r; j++) {
        if (grid[i][j].thebomb == true) {
          grid[i][j].revealed = true;
          grid[i][j].keypressed = true;
          grid[i][j].Rkey = true;
          grid[i][j].showBomb();
        }
        grid[i][j].game = true;
      }
    }
  } else {
    for (let i = 0; i < c; i++) {
      for (let j = 0; j < r; j++) {
        if (grid[i][j].thebomb == false) {
          grid[i][j].showBomb();
        }else{
          grid[i][j].flagged = true;
          grid[i][j].showBomb();
        }
        grid[i][j].game = true;
      }
    }
  }
  gameOver = true;
  let done = setTimeout(newGame, 500);
  timerclicked = false;
}

function newGame() {
  timerclicked = false;
  start_timer = false;
  timer_count = 0;
  let ifDoneWithStart = false;
  if (start == true) {
    if (mode == 0) {
      count = 10;
      w = 40;
      beginning_count = count;
    } else if (mode == 1) {
      count = 40;
      w = 30;
      beginning_count = count;
    } else if (mode == 2) {
      count = 99;
      w = 30;
      beginning_count = count;
    }
    ctime = 0;
    clearInterval(myTimer);
    document.getElementById("timer").innerHTML = null;
    document.getElementById("counter").innerHTML = count;
    r = 0; //row
    c = 0; //column
    track = false;
    victory = false;
    gameOver = false;
    flagged_bombs = 0;
    bombs_picked = false;
    setupGrid();
    drawGrid();
    start = false;
    ifDoneWithStart = true;
  }
  if (ifDoneWithStart == false) {
    if (victory == false) {
      let min = Math.floor(ctime/60);
      let sec = ctime - min * 60;
      if(min < 10){min = "0" + min;}
      if(sec < 10){sec = "0" + sec;}
      if (confirm("You Lost!\nDo you want to start a new game?\n" + "Time Spent  " +
          min + ":" + sec + "\nNumber of bombs cleared: " + flagged_bombs)) {
        if (mode == 0) {
          count = 10;
          w = 40;
          beginning_count = count;
        } else if (mode == 1) {
          count = 40;
          w = 30;
          beginning_count = count;
        } else if (mode == 2) {
          count = 99;
          w = 30;
          beginning_count = count;
        }
        ctime = 0;
        clearInterval(myTimer);
        document.getElementById("timer").innerHTML = 0;
        document.getElementById("counter").innerHTML = count;
        r = 0; //row
        c = 0; //column
        track = false;
        victory = false;
        gameOver = false;
        flagged_bombs = 0;
        bombs_picked = false;
        setupGrid();
        drawGrid();
      } else {
        ctime = 0;
        clearInterval(myTimer);
        document.getElementById("timer").innerHTML = 0;
      }
    } else if (victory == true) {

      if(count > 0){
        count = 0;
        document.getElementById("counter").innerHTML = count;
      }



      let min = Math.floor(ctime/60);
      let sec = ctime - min * 60;
      if(min < 10){min = "0" + min;}
      if(sec < 10){sec = "0" + sec;}
      if (prompt("You Won!\nDo you want to start a new game?\n" + "Time Spent   " +
          min + ":" + sec +  "\nNumber of bombs cleared: " + beginning_count +
          "\n\nEnter your name for the leaderboards:","Your Name")) {
        if (mode == 0) {
          count = 10;
          w = 40;
          beginning_count = count;
        } else if (mode == 1) {
          count = 40;
          w = 30;
          beginning_count = count;
        } else if (mode == 2) {
          count = 99;
          w = 30;
          beginning_count = count;
        }
        ctime = 0;
        clearInterval(myTimer);
        document.getElementById("timer").innerHTML = null;
        document.getElementById("counter").innerHTML = count;
        r = 0; //row
        c = 0; //column
        track = false;
        victory = false;
        gameOver = false;
        flagged_bombs = 0;
        bombs_picked = false;
        setupGrid();
        drawGrid();
      } else {
        ctime = 0;
        clearInterval(myTimer);
        document.getElementById("timer").innerHTML = 0;
      }
    } else {
      ctime = 0;
      clearInterval(myTimer);
      document.getElementById("timer").innerHTML = 0;
    }
  }
}
