var Util = require('./util'),
    Text = require('./text'),
    MovingObject = require('./movingObject');

var Bullet = function (options) {
  this.pos = options.pos;
  this.vel = options.vel;
  this.color = options.color || Bullet.COLOR;
  this.radius = options.radius || Bullet.RADIUS;
  this.game = options.game;
};

Bullet.COLOR = "#A5FCF2";
Bullet.RADIUS = 5;

Util.inherits(Bullet, MovingObject);

Bullet.prototype.collideWith = function (bird) {
  if (this.hasCollision(bird)) {
    this.relocate();
    bird.durability -= 1;
    if (bird.durability <= 0) {bird.relocate();}

    var pos = bird.pos;
    this.game.score += (100 * this.game.level);
    this.game.pointsUntilLevel -= (100 * this.game.level);

    if (this.game.pointsUntilLevel <= 0) {
      this.game.level += 1;
      this.game.pointsUntilLevel += (this.game.score * 1.2);

      var intervalToken = setInterval(function () {
        this.game.birds = [];

        if (!this.game.paused) {
          this.game.text = [new Text({
            color: "white",
            pos: [(this.game.DIM_X / 2) - 50, (this.game.DIM_Y / 2) + 16],
            text: "LEVEL " + this.game.level
          })];
        }
      }.bind(this), 10)

      setTimeout(function () {
        clearInterval(intervalToken);
        if (!this.game.paused) {
          this.game.text = [];
        }
      }.bind(this), 3000);
    }

    if (Math.random() <= 0.05 && bird.durability <= 0) {
      this.game.powers.push(new Power({pos: pos, game: this.game}));
    }
  }
};

module.exports = Bullet;
