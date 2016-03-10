var GameView = require("./gameView"),
    Game = require("./game");

var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

canvas.height = new Game().DIM_Y;
canvas.width = new Game().DIM_X;

new GameView(new Game(), ctx).start();
