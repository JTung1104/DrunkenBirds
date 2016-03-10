var Game = require('./game'),
    Text = require('./text'),
    KeyHandler = require('./keyHandler');

var GameView = function (game, ctx) {
  this.game = game;
  game.gameView = this;
  this.ctx = ctx;
  this.lastTime = this.lastTime || 0;
};

GameView.prototype.start = function () {
  this.lastTime = 0;

  setInterval(function () {
    if (!this.game.paused) {
      this.game.birds = this.game.birds.concat(this.game.addBirds());
    }
  }.bind(this), 5000);

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
      color: "#CF4B2A",
      pos: [20, (this.game.DIM_Y / 2) + 16],
      text: "Wow! Good Game! Press Enter To Play Again"
    })];

    this.game.paused = true;
  }
};
module.exports = GameView;
