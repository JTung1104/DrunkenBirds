var Game = require('./game'),
    Text = require('./text'),
    KeyHandler = require('./keyHandler');

var GameView = function (game, ctx) {
  game.gameView = this;
  this.game = game;
  this.ctx = ctx;
  this.lastTime = this.lastTime || 0;
};

GameView.prototype.start = function () {
  this.lastTime = 0;

  setInterval(function () {
    if (!this.game.paused) {
      this.game.birds = this.game.birds.concat(this.game.addBirds());
    }
  }.bind(this), 1000);

  this.animationToken = requestAnimationFrame(this.animate.bind(this));
};

GameView.prototype.animate = function (currentTime) {
  var timeDelta = currentTime - this.lastTime;

  this.game.step(timeDelta);
  this.game.handlePressedKeys();
  this.game.draw(this.ctx);
  this.lastTime = currentTime;

  requestAnimationFrame(this.animate.bind(this));

  if (this.game.over) {
    this.game.text = [new Text({
      color: "#7CE7FB",
      pos: [20, (this.game.DIM_Y / 2) + 16],
      text: "Wow! Good Game! Press Enter To Play Again"
    })];

    this.game.paused = true;
  }
  if (!this.game.paused) {
    this.game.tick++;
  }
};

module.exports = GameView;
