var Util = require('./util'),
    MovingObject = require('./movingObject');

var Background = function (options) {
  var self = this instanceof Background
           ? this
           : Object.create(DrunkenBird.prototype);

  self.img = new Image();
  self.img.src = "images/sky.png";
  self.speed = 1;
  self.DIM_Y = options.DIM_Y;
  self.DIM_X = options.DIM_X;
  self.x = 0;
  self.y = 0;

  return self;
};

Util.inherits(Background, MovingObject);

Background.prototype.draw = function (ctx) {
  // Pan background
  this.y += this.speed;
  ctx.drawImage(this.img, this.x, this.y);
  // Draw another image at the top edge of the first image
  ctx.drawImage(this.img, this.x, this.y - this.DIM_Y);
  // If the image scrolled off the screen, reset
  if (this.y >= this.DIM_Y)
    this.y = 0;
};

module.exports = Background;
