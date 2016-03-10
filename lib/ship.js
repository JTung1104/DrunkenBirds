var Util = require('./util'),
    Bullet = require('./bullet'),
    MovingObject = require('./movingObject'),
    Game = require('./game');

var Ship = function (options) {
  this.pos = options.pos;
  this.vel = [0, 0];
  this.color = options.color || Ship.COLOR;
  this.radius = options.radius || Ship.RADIUS;
  this.game = options.game;
  this.lives = 3;
  this.maxSpeed = 6;
  this.invulnerable = false;
};

Ship.COLOR = "#8BDAFC";
Ship.RADIUS = 50;

Util.inherits(Ship, MovingObject);

Ship.prototype.fireBullet = function (game) {
  game.bullets.push(
    new Bullet({
      pos: [game.ship.pos[0], game.ship.pos[1] - 50],
      vel: [0, -8],
      game: game
    })
  );
};

Ship.prototype.collideWith = function (bird) {
  if (this.hasCollision(bird)) {
    if (!this.invulnerable) {
      this.lives -= 1;
      this.invulnerable = true;
      this.color = "#FF9AD7";

      setTimeout(function () {
        this.color = "#8BDAFC";
        this.invulnerable = false;
      }.bind(this), 3000);
    }

    if (this.lives <= 0) {
      this.game.over = true;
    }
  }
};

Ship.prototype.move = function (timeDelta) {
  timeDelta = timeDelta || 1;
  var velX = (this.vel[0] * (timeDelta / 10)),
      velY = (this.vel[1] * (timeDelta / 10)),
      newX = (this.pos[0] + velX),
      newY = (this.pos[1] + velY);

  if ((newX < (this.game.DIM_X - 50)) && (newX >= 50)) {
    this.pos[0] = newX;
  }
  if ((newY < (this.game.DIM_Y - 50)) && (newY >= 50)) {
    this.pos[1] = newY;
  }
};
module.exports = Ship;
