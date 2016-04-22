var Game = require('./game'),
    Text = require('./text'),
    KeyHandler = require('./keyHandler');

var GameView = function (game, ctx) {
  var self = this instanceof GameView
           ? this
           : Object.create(GameView.prototype);

  game.gameView = self;
  self.game = game;
  self.ctx = ctx;
  self.lastTime = self.lastTime || 0;

  return self;
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
      color: "#000",
      pos: [160, (this.game.DIM_Y / 2) + 16],
      text: "Press Enter To Play Again"
    })];

    this.game.paused = true;
  }
  if (!this.game.paused) {
    this.game.tick++;
  }
};

module.exports = GameView;
