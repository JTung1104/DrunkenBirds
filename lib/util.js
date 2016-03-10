var Util = function () {};

Util.inherits = function (ChildClass, ParentClass) {
  function Surrogate () { this.constructor = ChildClass };
  Surrogate.prototype = ParentClass.prototype;
  ChildClass.prototype = new Surrogate();
};

Util.randomVel = function (min, max) {
  // var velX = (Math.random() * max) * (Math.random() < 0.5 ? 1 : -1);
  var velY = (Math.random() * max);

  // velX = (velX < min ? min : velX);
  velY = (velY < min ? min : velY);

  return [0, velY];
};

module.exports = Util;
