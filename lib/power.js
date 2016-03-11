var Util = require('./util'),
    MovingObject = require('./movingObject');

var Power = function (options) {
  this.img = new Image();
  this.img.src = "images/power1.png";
  this.srcX = 0;
  this.srcY = 0;
  this.pos = options.pos;
  this.game = options.game;
  this.vel = [0, 1];
  this.color = options.color || Power.COLOR;
  this.radius = options.radius || Power.RADIUS;
};

Power.COLOR = "#D280F0";
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
