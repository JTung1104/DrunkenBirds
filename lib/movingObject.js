var MovingObject = function (options) {
  this.pos = options.pos;
  this.vel = options.vel;
  this.radius = options.radius;
  this.color = options.color;
  this.strokeColor = options.strokeColor || options.color;
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
  ctx.strokeStyle = this.strokeColor;
  ctx.lineWidth = 2;
  ctx.stroke();
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
  this.pos = [-500, -500];
};

module.exports = MovingObject;
