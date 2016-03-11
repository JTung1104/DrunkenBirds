var GameView = require("./gameView"),
    Game = require("./game"),
    KeyHandler = require('./keyHandler');

var el = document.getElementsByTagName("body")[0],
    canvas = document.getElementById("myCanvas"),
    ctx = canvas.getContext("2d"),
    scoreEl = document.getElementById("score-container"),
    startEl = document.getElementById("start"),
    newGame = true;

var token = setInterval(function () {
  if (isKeyPressed(83) && newGame) {
    scoreEl.className = "visible";
    startEl.className = "hidden";
    canvas.className = "visible";
    canvas.height = new Game().DIM_Y;
    canvas.width = new Game().DIM_X;
    new GameView(new Game(), ctx).start();
    newGame = false;
    clearInterval(token);
  }
}, 30)
