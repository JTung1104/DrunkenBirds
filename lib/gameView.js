var Game = require('./game'),
    KeyHandler = require('./keyHandler');

var GameView = function (game, ctx) {
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
  }.bind(this), 5000);

  this.animationToken = requestAnimationFrame(this.animate.bind(this));
};

GameView.prototype.animate = function (currentTime) {
  var timeDelta = currentTime - this.lastTime;

  this.game.step(timeDelta);
  this.game.handlePressedKeys();
  this.game.draw(this.ctx);
  this.lastTime = currentTime;

  this.animationToken = requestAnimationFrame(this.animate.bind(this));

  if (this.game.over) {
    cancelAnimationFrame(this.animationToken);
  }
};
module.exports = GameView;
