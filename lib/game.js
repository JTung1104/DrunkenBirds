var DrunkenBird = require('./drunkenBird'),
    Ship = require('./ship'),
    Text = require('./text'),
    Util = require('./util'),
    Power = require('./power');

var Game = function () {
  this.DIM_X = 700;
  this.DIM_Y = 700;
  this.MAX_NUM_BIRDS = 6;
  this.birds = this.addBirds();
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

  max = this.level > 10 ? 10 : this.level;

  for (var i = 0; i < (this.MAX_NUM_BIRDS * max); i++) {
    birds.push(
      new DrunkenBird({
        pos: this.randomPosition(),
        game: this,
        vel: Util.randomVel(1, 5 + (0.1 * this.level))
      })
    );
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
    if (bullet.pos[0] < -3 || bullet.pos[0] > (this.DIM_X + 3)) {
      this.bullets.splice(i, 1);
    }
    else if (bullet.pos[1] > (this.DIM_Y + 50) || bullet.pos[1] < -3) {
      this.bullets.splice(i, 1);
    }
  }.bind(this));

  this.powers.forEach(function (power, i) {
    if (power.pos[0] < -15 || power.pos[0] > (this.DIM_X + 15)) {
      this.powers.splice(i, 1);
    } else if (power.pos[1] > (this.DIM_Y + 15) || power.pos[1] < -15) {
      this.powers.splice(i, 1);
    }
  }.bind(this));
};

Game.prototype.allObjects = function () {
  return this.birds.concat([this.ship], this.bullets, this.text, this.powers);
};

Game.prototype.checkCollisions = function () {
  for (var i = 0; i < this.bullets.length; i++) {
    for (var j = 0; j < this.birds.length; j++) {
      if (this.bullets[i].hasCollision(this.birds[j])) {
        var pos = this.birds[j].pos;

        this.bullets[i].collideWith(this.birds[j]);
        this.score += (100 * this.level);
        this.pointsUntilLevel -= (100 * this.level);

        if (this.pointsUntilLevel <= 0) {
          this.level += 1;
          this.pointsUntilLevel += (this.score * 1.2);

          var intervalToken = setInterval(function () {
            this.birds = [];
            this.text = [new Text({
              color: "white",
              pos: [(this.DIM_X / 2) - 50, (this.DIM_Y / 2) + 16],
              text: "LEVEL " + this.level
            })];
          }.bind(this), 20)

          setTimeout(function () {
            clearInterval(intervalToken);
            this.text = [];
          }.bind(this), 3000);
        }

        if (Math.random() <= 0.05) {this.powers.push(new Power({pos: pos}));}
      }
    }
  }

  for (var k = 0; k < this.birds.length; k++) {
    if (this.ship.hasCollision(this.birds[k])) {
      this.ship.collideWith(this.birds[k]);
    }
  }

  for (var l = 0; l < this.powers.length; l++) {
    if (this.ship.hasCollision(this.powers[l])) {
      this.ship.collideWith(this.powers[l]);
    }
  }
};

Game.prototype.step = function (timeDelta) {
  if (!this.paused) {
    this.moveObjects(timeDelta);
    this.checkCollisions();
    this.updateStats();
    this.removeObjects();
  }
};

Game.prototype.restartGame = function () {
  this.DIM_X = 700;
  this.DIM_Y = 700;
  this.MAX_NUM_BIRDS = 4;
  this.birds = this.addBirds();
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
};

Game.prototype.handlePressedKeys = function () {
  if (!this.over) {
    if (window.isKeyPressed(80)) {
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
