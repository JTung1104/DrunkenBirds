var Util = require('./util'),
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
    bird.relocate();
  }
};

module.exports = Bullet;
