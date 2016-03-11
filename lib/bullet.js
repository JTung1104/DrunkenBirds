var Util = require('./util'),
    Text = require('./text'),
    Power = require('./power'),
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
    var pos = bird.pos;
    this.relocate();
    bird.durability -= 1;

    if (bird.durability <= 0) {
      bird.relocate();

      if (Math.random() <= 0.05) {
        this.game.powers.push(
          new Power({
            pos: pos,
            game: this.game
          })
        );
      }
    }

    this.game.score += (100 * this.game.level);
    this.game.pointsUntilLevel -= (100 * this.game.level);

    if (this.game.pointsUntilLevel <= 0) {
      this.game.level += 1;
      this.game.pointsUntilLevel += (this.game.score * 1.2);

      if (!this.game.paused) {
        this.game.text = [new Text({
          color: "white",
          pos: [(this.game.DIM_X / 2) - 50, (this.game.DIM_Y / 2) + 16],
          text: "LEVEL " + this.game.level
        })];

        setTimeout(function () {
          if (!this.game.paused) {
            this.game.text = [];
          }
        }.bind(this), 3000);
      }
    }
  }
};

module.exports = Bullet;
