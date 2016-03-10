var keys = {};

window.addEventListener("keydown", function (e) {
  keys[e.keyCode] = true;
});

window.addEventListener("keyup", function (e) {
  keys[e.keyCode] = false;
});

window.isKeyPressed = function (key) {
  return (keys[key]);
};
