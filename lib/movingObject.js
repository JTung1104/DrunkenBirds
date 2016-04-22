var MovingObject = function (options) {
  var self = this instanceof MovingObject
           ? this
           : Object.create(MovingObject.prototype);

  self.pos = options.pos;
  self.vel = options.vel;
  self.radius = options.radius;
  self.color = options.color;

  return self;
};

MovingObject.prototype.draw = function (ctx) {
  ctx.fillStyle = this.color;
  ctx.beginPath();
  ctx.arc(
    this.pos[0],
    this.pos[1],
    this.radius,
    0,
    2 * Math.PI
  );
  ctx.fill();
};

MovingObject.prototype.move = function (timeDelta) {
  timeDelta = timeDelta || 1;
  this.pos[0] += (this.vel[0] * (timeDelta / 10));
  this.pos[1] += (this.vel[1] * (timeDelta / 10));
};

MovingObject.prototype.hasCollision = function (object) {
  var deltaX = this.pos[0] - object.pos[0];
  var deltaY = this.pos[1] - object.pos[1];
  var sumRadii = this.radius + object.radius;
  var distance = Math.sqrt((deltaX * deltaX) + (deltaY * deltaY));
  return (distance <= sumRadii);
};

MovingObject.prototype.relocate = function () {
  this.pos = [-5000, 5000];
};

module.exports = MovingObject;
