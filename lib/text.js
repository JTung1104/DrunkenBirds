var Text = function (options) {
  this.color = options.color;
  this.font = options.font;
  this.pos = options.pos;
  this.text = options.text;
};

Text.prototype.draw = function (ctx) {
  ctx.fillStyle = this.color
  ctx.font = 96 + "pt Helvetica Neue";
  ctx.fillText = (this.text, this.pos[0], this.pos[1]);
};

module.exports = Text;
