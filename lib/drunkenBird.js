var Util = require('./util'),
    MovingObject = require('./movingObject');

var DrunkenBird = function (options) {
  this.img = new Image();
  this.img.src = "images/angry_birds.png";
  this.srcX = 20;
  this.srcY = 20;
  this.pos = options.pos;
  this.color = options.color || DrunkenBird.COLOR;
  this.strokeColor = options.strokeColor || DrunkenBird.STROKE_COLOR;
  this.radius = options.radius || DrunkenBird.RADIUS;
  this.game = options.game;
  this.vel = options.vel || Util.randomVel(1, 3);
}

DrunkenBird.COLOR = "#125688";
DrunkenBird.STROKE_COLOR = "#EDEEEE";
DrunkenBird.RADIUS = 30;

Util.inherits(DrunkenBird, MovingObject);

// DrunkenBird.prototype.draw = function (ctx) {
//   var frame = Math.floor((this.game.tick / 20)) % 2;
//   this.srcX = (frame * 100) + 20;
//   this.srcY = (Math.random() <= 0.5 ? 20 : 120);
//
//   ctx.drawImage(
//     this.img,
//     this.srcX, this.srcY, 80, 80,
//     this.pos[0] - 50, this.pos[1] - 50, 80, 80
//   );
// };

module.exports = DrunkenBird;
