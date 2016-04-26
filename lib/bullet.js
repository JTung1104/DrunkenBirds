var Util = require('./util'),
    Text = require('./text'),
    Power = require('./power'),
    MovingObject = require('./movingObject');

var Bullet = function (options) {
  var self = this instanceof Bullet
           ? this
           : Object.create(Bullet.prototype);

  self.pos = options.pos;
  self.vel = options.vel;
  self.color = options.color || Bullet.COLOR;
  self.radius = options.radius || Bullet.RADIUS;
  self.game = options.game;

  return self;
};

Bullet.COLOR = "#A5FCF2";
Bullet.RADIUS = 5;

Util.inherits(Bullet, MovingObject);

Bullet.prototype.handleCollision = function (bird) {
  if (this.hasCollision(bird)) {
    var pos = bird.pos;
    this.relocate();
    bird.handleHit(pos);

    if (this.game.hasLeveledUp()) {
      this.game.handleLevelUp();
    }
  }
};

Bullet.prototype.draw = function (ctx) {
  ctx.fillStyle = this.color;
  ctx.beginPath();
  ctx.arc(
    this.pos[0],
    this.pos[1],
    this.radius,
    0,
    2 * Math.PI
  );
  ctx.fill();

  ctx.strokeStyle = "#000";
  ctx.lineWidth = 1;
  ctx.stroke();
};

module.exports = Bullet;
