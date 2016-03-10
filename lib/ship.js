var Util = require('./util'),
    Bullet = require('./bullet'),
    DrunkenBird = require('./drunkenBird'),
    MovingObject = require('./movingObject'),
    Power = require('./power'),
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
  this.gunLevel = 1;
};

Ship.COLOR = "#8BDAFC";
Ship.RADIUS = 25;

Util.inherits(Ship, MovingObject);

Ship.prototype.fireBullet = function (game) {
  var max = (this.gunLevel * 10) > 200 ? 200 : (this.gunLevel * 10);

  if (this.fireBullet._lastFire + (350 - max) < Date.now()) {
    if (this.gunLevel <= 2) {
      game.bullets.push(
        new Bullet({
          pos: [game.ship.pos[0], game.ship.pos[1] - 30],
          vel: [0, -8],
          game: game
        })
      );
    } else if (this.gunLevel >= 3) {
      game.bullets.push(
        new Bullet({
          pos: [game.ship.pos[0], game.ship.pos[1] - 30],
          vel: [0, -8],
          game: game,
          color: "#FFD394",
          radius: 5
        })
      );
      game.bullets.push(
        new Bullet({
          pos: [game.ship.pos[0], game.ship.pos[1] - 30],
          vel: [-4, -8],
          game: game,
          color: "#FFD394",
          radius: 5
        })
      );
      game.bullets.push(
        new Bullet({
          pos: [game.ship.pos[0], game.ship.pos[1] - 30],
          vel: [4, -8],
          game: game,
          color: "#FFD394",
          radius: 5
        })
      );
    }
    this.fireBullet._lastFire = Date.now();
  }
};

Ship.prototype.fireBullet._lastFire = Date.now();

Ship.prototype.collideWith = function (object) {
  if (this.hasCollision(object)) {
    if (object instanceof DrunkenBird) {
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
    } else if (object instanceof Power) {
      object.relocate();
      this.gunLevel += 1;
    }
  }
};

Ship.prototype.move = function (timeDelta) {
  timeDelta = timeDelta || 1;
  var velX = (this.vel[0] * (timeDelta / 10)),
      velY = (this.vel[1] * (timeDelta / 10)),
      newX = (this.pos[0] + velX),
      newY = (this.pos[1] + velY);

  if ((newX < (this.game.DIM_X - this.radius)) && (newX >= this.radius)) {
    this.pos[0] = newX;
  }
  if ((newY < (this.game.DIM_Y - this.radius)) && (newY >= this.radius)) {
    this.pos[1] = newY;
  }
};
module.exports = Ship;
