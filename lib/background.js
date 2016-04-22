var Util = require('./util'),
    MovingObject = require('./movingObject');

var Background = function (options) {
  var self = this instanceof Background
           ? this
           : Object.create(DrunkenBird.prototype);

  self.img = new Image();
  self.img.src = "images/sky.jpg";
  self.speed = 1;
  self.DIM_Y = options.DIM_Y;
  self.DIM_X = options.DIM_X;
  self.x = 0;
  self.y = 0;

  return self;
};

Util.inherits(Background, MovingObject);

Background.prototype.draw = function (ctx) {
  ctx.drawImage(
    this.img,
    50, 0, 900, 640,
    this.x, this.y, 700, 700
  );

  ctx.drawImage(
    this.img,
    50, 0, 900, 640,
    this.x, this.y - this.DIM_Y, 700, 700
  );

  if (this.y >= this.DIM_Y) {
    this.y = 0;
  }
};

Background.prototype.move = function () {
  this.y += this.speed;
};

module.exports = Background;
