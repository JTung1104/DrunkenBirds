var DrunkenBird = require('./drunkenBird'),
    Ship = require('./ship'),
    Text = require('./text'),
    Util = require('./util'),
    Background = require('./background'),
    Bullet = require('./bullet'),
    Power = require('./power');

var Game = function () {
  var self = this instanceof Game
           ? this
           : Object.create(Game.prototype);

  self.DIM_X = 700;
  self.DIM_Y = 700;
  self.MAX_NUM_BIRDS = 6;
  self.background = new Background({DIM_X: self.DIM_X, DIM_Y: self.DIM_Y});
  self.bullets = [];
  self.powers = [];
  self.text = [];
  self.ship = new Ship({game: self, pos: [(self.DIM_X / 2), (self.DIM_Y - 75)]});
  self.level = 1;
  self.score = 0;
  self.pointsUntilLevel = 5000;
  self.over = false;
  self.paused = false;
  self.tick = 0;
  self.birds = this.addBirds();

  return self;
};

var scoreEl = document.getElementById("score");
var livesEl = document.getElementById("lives");
var levelEl = document.getElementById("level");
var gunLevelEl = document.getElementById("gunLevel");

Game.prototype.updateStats = function () {
  scoreEl.innerHTML = "Score: " + this.score;
  livesEl.innerHTML = "Lives: " + this.ship.lives;
  levelEl.innerHTML = "Level: " + this.level;
  gunLevelEl.innerHTML = "Gun Level: " + this.ship.gunLevel;
};

Game.prototype.addBirds = function () {
  var birds = [];
  var max;
  var birdLevel;

  max = this.level > 15 ? 15 : this.level;

  if (this.text.length === 0) {
    for (var i = 0; i < (this.MAX_NUM_BIRDS * max); i++) {
      birdLevel = (Math.random() <= (0.10 + (0.05 * this.level))) ? 2 : 1;

      birds.push(
        new DrunkenBird({
          pos: this.randomPosition(),
          game: this,
          vel: Util.randomVel(1, 5 + (0.1 * this.level)),
          level: birdLevel
        })
      );
    }
  }

  return birds;
};

Game.prototype.randomPosition = function () {
  var posX = (Math.floor(Math.random() * this.DIM_X)) - 50;
  var posY = -(Math.floor(Math.random() * this.DIM_Y));
  if (posX <= 0) { posX = 50; }
  return [posX, posY];
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

Game.prototype.togglePause = function () {
  if (this.togglePause._lastPause + 300 < Date.now()) {
    this.paused = !this.paused;
    this.togglePause._lastPause = Date.now();

    if (this.paused) {
      this.text = [new Text({
        color: "white",
        pos: [(this.DIM_X / 2) - 50, (this.DIM_Y / 2) + 16],
        text: "PAUSED"
      })];
    } else {
      this.text = [];
    }
  }
};

Game.prototype.togglePause._lastPause = Date.now();

Game.prototype.removeAllObjects = function () {
  this.removeBullets();
  this.removeBirds();
  this.removePowers();
};

Game.prototype.allObjects = function () {
  return [this.background].concat(this.birds, [this.ship], this.bullets, this.text, this.powers);
};

Game.prototype.outOfBounds = function (object) {
  return (
    (object.pos[0] < -(object.radius)) ||
    (object.pos[0] > (this.DIM_X + object.radius)) ||
    (object.pos[1] > (this.DIM_Y + object.radius)) ||
    (object.pos[1] < -(object.radius))
  );
};

Game.prototype.handleCollisions = function () {
  for (var i = 0; i < this.bullets.length; i++) {
    for (var j = 0; j < this.birds.length; j++) {
      this.bullets[i].handleCollision(this.birds[j]);
    }
  }
  for (var k = 0; k < this.birds.length; k++) {
    this.ship.handleCollision(this.birds[k]);
  }
  for (var l = 0; l < this.powers.length; l++) {
    this.ship.handleCollision(this.powers[l]);
  }
};

Game.prototype.removePowers = function () {
  this.powers.forEach(function (power, i) {
    if (power.pos[0] < -15 || power.pos[0] > (this.DIM_X + 15)) {
      this.powers.splice(i, 1);
    } else if (power.pos[1] > (this.DIM_Y + 15) || power.pos[1] < -15) {
      this.powers.splice(i, 1);
    }
  }.bind(this));
};

Game.prototype.removeBullets = function () {
  this.bullets.forEach(function (bullet, i) {
    if (bullet.pos[0] < -5 || bullet.pos[0] > (this.DIM_X + 5)) {
      this.bullets.splice(i, 1);
    }
    else if (bullet.pos[1] >= (this.DIM_Y + 5) || bullet.pos[1] <= -5) {
      this.bullets.splice(i, 1);
    }
  }.bind(this));
};

Game.prototype.removeBirds = function () {
  this.birds.forEach(function (bird, i) {
    if (bird.pos[0] <= -100 || bird.pos[0] > (this.DIM_X + 100)) {
      this.birds.splice(i, 1);
    }
    else if (bird.pos[1] >= (this.DIM_Y + 100)) {
      this.birds.splice(i, 1);
    }
  }.bind(this));
};

Game.prototype.step = function (timeDelta) {
  if (!this.paused) {
    this.moveObjects(timeDelta);
    this.handleCollisions();
    this.updateStats();
    this.removeAllObjects();
  }
};

Game.prototype.restartGame = function () {
  this.DIM_X = 700;
  this.DIM_Y = 700;
  this.MAX_NUM_BIRDS = 4;
  this.bullets = [];
  this.powers = [];
  this.text = [];
  this.ship = new Ship({game: this, pos: [(this.DIM_X / 2), (this.DIM_Y - 75)]});
  this.level = 1;
  this.score = 0;
  this.pointsUntilLevel = 5000;
  this.over = false;
  this.paused = false;
  this.tick = 0;
  this.birds = this.addBirds();
};

Game.prototype.updateScore = function () {
  this.score += (100 * this.level);
  this.pointsUntilLevel -= (100 * this.level);
};

Game.prototype.hasLeveledUp = function () {
  return (this.pointsUntilLevel <= 0);
};

Game.prototype.handleLevelUp = function () {
  this.level += 1;
  this.pointsUntilLevel += (this.score * 1.2);

  if (!this.paused) {
    this.text = [
      new Text({
        color: "white",
        pos: [(this.DIM_X / 2) - 50, (this.DIM_Y / 2) + 16],
        text: "LEVEL " + this.level
      })
    ];

    setTimeout(function () {
      if (!this.paused) {
        this.text = [];
      }
    }.bind(this), 3000);
  }
};

Game.prototype.handlePressedKeys = function () {
  if (!this.over) {
    if (window.isKeyPressed(80)) { // 'p'
      this.togglePause();
    }
  }
  if (!this.paused && !this.over) {
    if (window.isKeyPressed(37) && (this.ship.vel[0] > -(this.ship.maxSpeed))) {
      this.ship.vel[0] -= 0.5;
      this.ship.srcY = 0;
    }
    if (window.isKeyPressed(38) && (this.ship.vel[1] > -(this.ship.maxSpeed))) {
      this.ship.vel[1] -= 0.5;
      this.ship.srcY = 3;
    }
    if (window.isKeyPressed(39) && (this.ship.vel[0] < this.ship.maxSpeed)) {
      this.ship.vel[0] += 0.5;
      this.ship.srcY = 1;
    }
    if (window.isKeyPressed(40) && (this.ship.vel[1] < this.ship.maxSpeed)) {
      this.ship.vel[1] += 0.5;
    }
    if (window.isKeyPressed(32)) {
      this.ship.fireBullet(this);
    }
  }
  if (!window.isKeyPressed(37) && !window.isKeyPressed(39)) {
    this.ship.vel[0] = 0;
    this.ship.srcY = 3;
  }
  if (!window.isKeyPressed(38) && !window.isKeyPressed(40)) {
    this.ship.vel[1] = 0;
  }
  if (this.over && window.isKeyPressed(13)) { this.restartGame(); }
};

module.exports = Game;
