var DrunkenBird = require('./drunkenBird'),
    Ship = require('./ship');

var Game = function () {
  this.DIM_X = 700;
  this.DIM_Y = window.innerHeight - 100;
  this.MAX_NUM_BIRDS = 3;
  this.over = false;
  this.level = 1;
  this.birds = this.addBirds();
  this.bullets = [];
  this.ship = new Ship({game: this, pos: [(this.DIM_X / 2), (this.DIM_Y - 75)]});
};


Game.prototype.addBirds = function () {
  var birds = [];

  for (var i = 0; i < this.MAX_NUM_BIRDS; i++) {
    birds.push(
      new DrunkenBird({
        pos: this.randomPosition(),
        game: this
      })
    );
  }

  return birds;
};

Game.prototype.randomPosition = function () {
  var posX = (Math.floor(Math.random() * this.DIM_X)) - 50;
  if (posX < 0) { posX = 50; }
  return [posX, 0];
};

Game.prototype.draw = function (ctx) {
  this.ctx = ctx;
  this.ctx.clearRect(0, 0, this.DIM_X, this.DIM_Y);
  this.allObjects().forEach(function (object) {
    object.draw(ctx);
  });
};

Game.prototype.moveObjects = function (timeDelta) {
  this.allObjects().forEach(function (object) {
    object.move(timeDelta);
  });
};

Game.prototype.removeObjects = function () {
  this.birds.forEach(function (bird, i) {
    if (bird.pos[0] < -50 || bird.pos[0] > (this.DIM_X + 50)) {
      this.birds.splice(i, 1);
    }
    else if (bird.pos[1] > (this.DIM_Y + 50)) {
      this.birds.splice(i, 1);
    }
  }.bind(this));

  this.bullets.forEach(function (bullet, i) {
    if (bullet.pos[0] < -3 || bullet.pos[0] > (Game.DIM_X + 3)) {
      this.bullets.splice(i, 1);
    }
    else if (bullet.pos[1] > (this.DIM_Y + 50) || bullet.pos[1] < 0) {
      this.bullets.splice(i, 1);
    }
  }.bind(this));
};

Game.prototype.allObjects = function () {
  return this.birds.concat([this.ship], this.bullets);
};

Game.prototype.checkCollisions = function () {
  for (var i = 0; i < this.bullets.length; i++) {
    for (var j = 0; j < this.birds.length; j++) {
      if (this.bullets[i].hasCollision(this.birds[j])) {
        this.bullets[i].collideWith(this.birds[j]);
      }
    }
  }

  for (var k = 0; k < this.birds.length; k++) {
    if (this.ship.hasCollision(this.birds[k])) {
      this.ship.collideWith(this.birds[k]);
    }
  }
};

Game.prototype.step = function (timeDelta) {
  this.moveObjects(timeDelta);
  this.checkCollisions();
  this.removeObjects();
};

Game.prototype.handlePressedKeys = function () {
  if (window.isKeyPressed(37)) {
    if (this.ship.vel[0] > -(this.ship.maxSpeed)) {
      this.ship.vel[0] -= 0.5;
    }
  }
  if (window.isKeyPressed(38)) {
    if (this.ship.vel[1] > -(this.ship.maxSpeed)) {
      this.ship.vel[1] -= 0.5;
    }
  }
  if (window.isKeyPressed(39)) {
    if (this.ship.vel[0] < (this.ship.maxSpeed)) {
      this.ship.vel[0] += 0.5;
    }
  }
  if (window.isKeyPressed(40)) {
    if (this.ship.vel[1] < this.ship.maxSpeed) {
      this.ship.vel[1] += 0.5;
    }
  }
  if (window.isKeyPressed(32)) {
    if (this.bullets.length < 5) {
      this.ship.fireBullet(this);
    }
  }
  if (!window.isKeyPressed(37) && !window.isKeyPressed(39)) {
    this.ship.vel[0] = 0;
  }
  if (!window.isKeyPressed(38) && !window.isKeyPressed(40)) {
    this.ship.vel[1] = 0;
  }
};

module.exports = Game;
