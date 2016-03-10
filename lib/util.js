var Util = function () {};

Util.inherits = function (ChildClass, ParentClass) {
  function Surrogate () { this.constructor = ChildClass };
  Surrogate.prototype = ParentClass.prototype;
  ChildClass.prototype = new Surrogate();
};

Util.randomVel = function (min, max) {
  var velY = (Math.random() * max);
  var velX = (Math.random() * (max / 4))

  velY = (velY < min ? min : velY);
  velX = (velX < min ? min : velX) * (Math.random() <= 0.5 ? -1 : 1);

  return [velX, velY];
};

module.exports = Util;
