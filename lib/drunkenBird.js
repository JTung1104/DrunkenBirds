var Util = require('./util'),
    MovingObject = require('./movingObject');

var DrunkenBird = function (options) {
  this.pos = options.pos;
  this.color = options.color || DrunkenBird.COLOR;
  this.radius = options.radius || DrunkenBird.RADIUS;
  this.game = options.game;
  this.vel = options.vel || Util.randomVel(1, 3);
}

DrunkenBird.COLOR = "#125688";
DrunkenBird.RADIUS = 50;

Util.inherits(DrunkenBird, MovingObject);

module.exports = DrunkenBird;
