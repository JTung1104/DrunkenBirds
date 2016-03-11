var Util = require('./util'),
    Bullet = require('./bullet'),
    DrunkenBird = require('./drunkenBird'),
    MovingObject = require('./movingObject'),
    Power = require('./power'),
    Game = require('./game');

var Ship = function (options) {
  this.img = new Image();
  this.tick = 0;
  this.img.src = "images/bird.png";
  this.srcX;
  this.srcY = 3;
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
Ship.RADIUS = 30;

Util.inherits(Ship, MovingObject);

Ship.prototype.fireBullet = function (game) {
  var max = (this.gunLevel * 10)
  if (this.gunLevel === 20) {max += 50;}

  if (this.fireBullet._lastFire + (350 - max) < Date.now()) {
    if (this.gunLevel <= 2) {
      game.bullets.push(
        new Bullet({
          pos: [game.ship.pos[0], game.ship.pos[1] - 30],
          vel: [0, -8],
          game: game
        })
      );
    } else if (this.gunLevel >= 3 && this.gunLevel < 20) {
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
    } else if (this.gunLevel >= 20) {
      game.bullets.push(
        new Bullet({
          pos: [game.ship.pos[0], game.ship.pos[1] - 30],
          vel: [0, -8],
          game: game,
          color: "#FFD394",
          radius: 10
        })
      );
      game.bullets.push(
        new Bullet({
          pos: [game.ship.pos[0], game.ship.pos[1] - 30],
          vel: [-4, -8],
          game: game,
          color: "#FFD394",
          radius: 10
        })
      );
      game.bullets.push(
        new Bullet({
          pos: [game.ship.pos[0], game.ship.pos[1] - 30],
          vel: [4, -8],
          game: game,
          color: "#FFD394",
          radius: 10
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
        this.img.src = "images/redbird.png";

        setTimeout(function () {
          this.invulnerable = false;
          this.img.src = "images/bird.png";
        }.bind(this), 3000);
      }

      if (this.lives <= 0) {
        this.game.over = true;
      }
    } else if (object instanceof Power) {
      object.relocate();
      if (this.gunLevel < 20) {
        this.gunLevel += 1;
      }
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

Ship.prototype.draw = function (ctx) {
  var frame = Math.floor((this.game.tick / 10)) % 4;
  this.srcX = (frame * 64);

  ctx.drawImage(
    this.img,
    this.srcX, this.srcY * 64, 64, 64,
    this.pos[0]-32, this.pos[1]-32, 64, 64
  );
};

module.exports = Ship;
