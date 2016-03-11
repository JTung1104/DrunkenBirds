var Util = require('./util'),
    MovingObject = require('./movingObject');

var DrunkenBird = function (options) {
  this.img = new Image();
  this.img.src = "images/bird_sheet.png";
  this.srcX = 0;
  this.srcY = 0;
  this.level = options.level || 1;
  this.durability = this.level;
  this.pos = options.pos;
  this.color = options.color || DrunkenBird.COLOR;
  this.strokeColor = options.strokeColor || DrunkenBird.STROKE_COLOR;
  this.radius = options.radius || DrunkenBird.RADIUS;
  this.game = options.game;
  this.vel = options.vel || Util.randomVel(1, 3);
}

DrunkenBird.COLOR = "#125688";
DrunkenBird.STROKE_COLOR = "#EDEEEE";
DrunkenBird.RADIUS = 48;

Util.inherits(DrunkenBird, MovingObject);

DrunkenBird.prototype.draw = function (ctx) {
  if (this.level === 1) {
    var frame = Math.floor((this.game.tick / 10)) % 3;
    this.srcY = (frame * 100);

    ctx.drawImage(
      this.img,
      this.srcX, this.srcY, 100, 100,
      this.pos[0] - 50, this.pos[1] - 50, 100, 100
    );
  } else if (this.level === 2) {
    var frame = Math.floor((this.game.tick / 10)) % 5;
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
