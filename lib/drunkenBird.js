var Util = require('./util'),
    MovingObject = require('./movingObject');

var DrunkenBird = function (options) {
  var self = this instanceof DrunkenBird
           ? this
           : Object.create(DrunkenBird.prototype);

  self.img = new Image();
  self.img.src = "images/bird_sheet.png";
  self.srcX = 0;
  self.srcY = 0;
  self.level = options.level || 1;
  self.durability = self.level;
  self.pos = options.pos;
  self.radius = options.radius || DrunkenBird.RADIUS;
  self.game = options.game;
  self.vel = options.vel || Util.randomVel(1, 3);

  return self;
}

DrunkenBird.RADIUS = 48;

Util.inherits(DrunkenBird, MovingObject);
var frame;

DrunkenBird.prototype.draw = function (ctx) {
  if (this.level === 1) {
    frame = Math.floor((this.game.tick / 10)) % 3;
    this.srcY = (frame * 100);

    ctx.drawImage(
      this.img,
      this.srcX, this.srcY, 100, 100,
      this.pos[0] - 50, this.pos[1] - 50, 100, 100
    );
  } else if (this.level === 2) {
    frame = Math.floor((this.game.tick / 10)) % 5;
    this.srcY = (frame * 108);
    this.img.src = "images/bird_sheet2.png";

    ctx.drawImage(
      this.img,
      this.srcX, this.srcY, 90, 108,
      this.pos[0] - 50, this.pos[1] - 50, 100, 100
    );
  }
};

module.exports = DrunkenBird;
