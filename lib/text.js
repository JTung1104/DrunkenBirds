var Text = function (options) {
  var self = this instanceof Power
           ? this
           : Object.create(Text.prototype);

  self.color = options.color;
  self.font = options.font || (32 + "px Arial");
  self.pos = options.pos;
  self.text = options.text;

  return self;
};

Text.prototype.draw = function (ctx) {
  ctx.fillStyle = this.color;
  ctx.font = this.font;
  ctx.fillText(this.text, this.pos[0], this.pos[1]);
};

Text.prototype.move = function () {

};

module.exports = Text;
