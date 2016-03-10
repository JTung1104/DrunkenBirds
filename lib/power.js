var Util = require('./util'),
    MovingObject = require('./movingObject');

var Power = function (options) {
  this.pos = options.pos;
  this.vel = [0, 1];
  this.color = options.color || Power.COLOR;
  this.radius = options.radius || Power.RADIUS;
};

Power.COLOR = "#D280F0";
Power.RADIUS = 15;

Util.inherits(Power, MovingObject);

module.exports = Power;
