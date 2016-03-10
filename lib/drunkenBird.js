var Util = require('./util'),
    MovingObject = require('./movingObject');

var DrunkenBird = function (options) {
  this.img = new Image();
  this.img.src = "images/bird_sheet.png";
  this.srcX = 0;
  this.srcY = 0;
  this.pos = options.pos;
  this.color = options.color || DrunkenBird.COLOR;
  this.strokeColor = options.strokeColor || DrunkenBird.STROKE_COLOR;
  this.radius = options.radius || DrunkenBird.RADIUS;
  this.game = options.game;
  this.vel = options.vel || Util.randomVel(1, 3);
}

DrunkenBird.COLOR = "#125688";
DrunkenBird.STROKE_COLOR = "#EDEEEE";
DrunkenBird.RADIUS = 50;

Util.inherits(DrunkenBird, MovingObject);

DrunkenBird.prototype.draw = function (ctx) {
  var frame = Math.floor((this.game.tick / 10)) % 3;
  this.srcY = (frame * 100);

  ctx.drawImage(
    this.img,
    this.srcX, this.srcY, 100, 100,
    this.pos[0] - 50, this.pos[1] - 50, 100, 100
  );
};

module.exports = DrunkenBird;
