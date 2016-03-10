var Util = function () {};

Util.inherits = function (ChildClass, ParentClass) {
  function Surrogate () { this.constructor = ChildClass };
  Surrogate.prototype = ParentClass.prototype;
  ChildClass.prototype = new Surrogate();
};

Util.randomVel = function (min, max) {
  var velY = (Math.random() * max);
  velY = (velY < min ? min : velY);

  return [0, velY];
};

module.exports = Util;
