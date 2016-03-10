var Text = function (options) {
  this.color = options.color;
  this.font = options.font || (32 + "px Arial");
  this.pos = options.pos;
  this.text = options.text;
};

Text.prototype.draw = function (ctx) {
  ctx.fillStyle = this.color;
  ctx.font = this.font;
  ctx.fillText(this.text, this.pos[0], this.pos[1]);
};

Text.prototype.move = function () {

};

module.exports = Text;
