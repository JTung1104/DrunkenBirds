var Util = require('./util'),
    MovingObject = require('./movingObject');

var Power = function (options) {
  var self = this instanceof Power
           ? this
           : Object.create(Power.prototype);

  self.img = new Image();
  self.img.src = "images/power1.png";
  self.srcX = 0;
  self.srcY = 0;
  self.pos = options.pos;
  self.game = options.game;
  self.vel = [0, 1];
  self.radius = options.radius || Power.RADIUS;

  return self;
};

Power.RADIUS = 20;

Util.inherits(Power, MovingObject);

Power.prototype.draw = function (ctx) {
  var frame = Math.floor((this.game.tick / 10)) % 4;
  this.img.src = "images/power" + (frame + 1) + ".png";

  ctx.drawImage(
    this.img,
    this.srcX, this.srcY, 30, 30,
    this.pos[0] - 20, this.pos[1] - 20, 40, 40
  );
};

module.exports = Power;
