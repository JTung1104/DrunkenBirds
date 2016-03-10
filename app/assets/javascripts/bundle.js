/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	var GameView = __webpack_require__(1),
	    Game = __webpack_require__(2);

	var canvas = document.getElementById("myCanvas");
	var ctx = canvas.getContext("2d");

	canvas.height = new Game().DIM_Y;
	canvas.width = new Game().DIM_X;

	new GameView(new Game(), ctx).start();

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	var Game = __webpack_require__(2),
	    Text = __webpack_require__(9),
	    KeyHandler = __webpack_require__(8);

	var GameView = function (game, ctx) {
	  this.game = game;
	  game.gameView = this;
	  this.ctx = ctx;
	  this.lastTime = this.lastTime || 0;
	};

	GameView.prototype.start = function () {
	  this.lastTime = 0;

	  setInterval(function () {
	    if (!this.game.paused) {
	      this.game.birds = this.game.birds.concat(this.game.addBirds());
	    }
	  }.bind(this), 1000);

	  this.animationToken = requestAnimationFrame(this.animate.bind(this));
	};

	GameView.prototype.animate = function (currentTime) {
	  var timeDelta = currentTime - this.lastTime;

	  this.game.step(timeDelta);
	  this.game.handlePressedKeys();
	  this.game.draw(this.ctx);
	  this.lastTime = currentTime;

	  requestAnimationFrame(this.animate.bind(this));

	  if (this.game.over) {
	    this.game.text = [new Text({
	      color: "#CF4B2A",
	      pos: [20, this.game.DIM_Y / 2 + 16],
	      text: "Wow! Good Game! Press Enter To Play Again"
	    })];

	    this.game.paused = true;
	  }
	  if (!this.game.paused) {
	    this.game.tick++;
	  }
	};
	module.exports = GameView;

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	var DrunkenBird = __webpack_require__(3),
	    Ship = __webpack_require__(6),
	    Text = __webpack_require__(9),
	    Util = __webpack_require__(4),
	    Power = __webpack_require__(10);

	var Game = function () {
	  this.DIM_X = 700;
	  this.DIM_Y = 700;
	  this.MAX_NUM_BIRDS = 6;
	  this.birds = this.addBirds();
	  this.bullets = [];
	  this.powers = [];
	  this.text = [];
	  this.ship = new Ship({ game: this, pos: [this.DIM_X / 2, this.DIM_Y - 75] });
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

	  for (var i = 0; i < this.MAX_NUM_BIRDS * max; i++) {
	    birds.push(new DrunkenBird({
	      pos: this.randomPosition(),
	      game: this,
	      vel: Util.randomVel(1, 5 + 0.1 * this.level)
	    }));
	  }

	  return birds;
	};

	Game.prototype.randomPosition = function () {
	  var posX = Math.floor(Math.random() * this.DIM_X) - 50;
	  var posY = -Math.floor(Math.random() * this.DIM_Y);
	  if (posX <= 0) {
	    posX = 50;
	  }
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
	        pos: [this.DIM_X / 2 - 50, this.DIM_Y / 2 + 16],
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
	    if (bird.pos[0] < -50 || bird.pos[0] > this.DIM_X + 50) {
	      this.birds.splice(i, 1);
	    } else if (bird.pos[1] > this.DIM_Y + 50) {
	      this.birds.splice(i, 1);
	    }
	  }.bind(this));

	  this.bullets.forEach(function (bullet, i) {
	    if (bullet.pos[0] < -3 || bullet.pos[0] > this.DIM_X + 3) {
	      this.bullets.splice(i, 1);
	    } else if (bullet.pos[1] > this.DIM_Y + 50 || bullet.pos[1] < -3) {
	      this.bullets.splice(i, 1);
	    }
	  }.bind(this));

	  this.powers.forEach(function (power, i) {
	    if (power.pos[0] < -15 || power.pos[0] > this.DIM_X + 15) {
	      this.powers.splice(i, 1);
	    } else if (power.pos[1] > this.DIM_Y + 15 || power.pos[1] < -15) {
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
	        this.score += 100 * this.level;
	        this.pointsUntilLevel -= 100 * this.level;

	        if (this.pointsUntilLevel <= 0) {
	          this.level += 1;
	          this.pointsUntilLevel += this.score * 1.2;

	          var intervalToken = setInterval(function () {
	            this.birds = [];
	            this.text = [new Text({
	              color: "white",
	              pos: [this.DIM_X / 2 - 50, this.DIM_Y / 2 + 16],
	              text: "LEVEL " + this.level
	            })];
	          }.bind(this), 20);

	          setTimeout(function () {
	            clearInterval(intervalToken);
	            this.text = [];
	          }.bind(this), 3000);
	        }

	        if (Math.random() <= 0.05) {
	          this.powers.push(new Power({ pos: pos }));
	        }
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
	  this.ship = new Ship({ game: this, pos: [this.DIM_X / 2, this.DIM_Y - 75] });
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
	    if (window.isKeyPressed(37) && this.ship.vel[0] > -this.ship.maxSpeed) {
	      this.ship.vel[0] -= 0.5;
	      this.ship.srcY = 0;
	    }
	    if (window.isKeyPressed(38) && this.ship.vel[1] > -this.ship.maxSpeed) {
	      this.ship.vel[1] -= 0.5;
	      this.ship.srcY = 3;
	    }
	    if (window.isKeyPressed(39) && this.ship.vel[0] < this.ship.maxSpeed) {
	      this.ship.vel[0] += 0.5;
	      this.ship.srcY = 1;
	    }
	    if (window.isKeyPressed(40) && this.ship.vel[1] < this.ship.maxSpeed) {
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
	  if (this.over && window.isKeyPressed(13)) {
	    this.restartGame();
	  }
	};

	module.exports = Game;

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	var Util = __webpack_require__(4),
	    MovingObject = __webpack_require__(5);

	var DrunkenBird = function (options) {
	  this.img = new Image();
	  this.img.src = "images/bird_sheet.png";
	  this.srcX = 0;
	  this.srcY = 0;
	  this.pos = options.pos;
	  this.color = options.color || DrunkenBird.COLOR;
	  this.strokeColor = options.strokeColor || DrunkenBird.STROKE_COLOR;
	  this.radius = options.radius || DrunkenBird.RADIUS;
	  this.game = options.game;
	  this.vel = options.vel || Util.randomVel(1, 3);
	};

	DrunkenBird.COLOR = "#125688";
	DrunkenBird.STROKE_COLOR = "#EDEEEE";
	DrunkenBird.RADIUS = 50;

	Util.inherits(DrunkenBird, MovingObject);

	DrunkenBird.prototype.draw = function (ctx) {
	  var frame = Math.floor(this.game.tick / 10) % 3;
	  this.srcY = frame * 100;

	  ctx.drawImage(this.img, this.srcX, this.srcY, 100, 100, this.pos[0] - 50, this.pos[1] - 50, 100, 100);
	};

	module.exports = DrunkenBird;

/***/ },
/* 4 */
/***/ function(module, exports) {

	var Util = function () {};

	Util.inherits = function (ChildClass, ParentClass) {
	  function Surrogate() {
	    this.constructor = ChildClass;
	  };
	  Surrogate.prototype = ParentClass.prototype;
	  ChildClass.prototype = new Surrogate();
	};

	Util.randomVel = function (min, max) {
	  var velY = Math.random() * max;
	  var velX = Math.random() * (max / 4);

	  velY = velY < min ? min : velY;
	  velX = (velX < min ? min : velX) * (Math.random() <= 0.5 ? -1 : 1);

	  return [velX, velY];
	};

	module.exports = Util;

/***/ },
/* 5 */
/***/ function(module, exports) {

	var MovingObject = function (options) {
	  this.pos = options.pos;
	  this.vel = options.vel;
	  this.radius = options.radius;
	  this.color = options.color;
	  this.strokeColor = options.strokeColor || options.color;
	};

	MovingObject.prototype.draw = function (ctx) {
	  ctx.fillStyle = this.color;
	  ctx.beginPath();
	  ctx.arc(this.pos[0], this.pos[1], this.radius, 0, 2 * Math.PI);
	  ctx.fill();
	  ctx.strokeStyle = this.strokeColor;
	  ctx.lineWidth = 2;
	  ctx.stroke();
	};

	MovingObject.prototype.move = function (timeDelta) {
	  timeDelta = timeDelta || 1;
	  this.pos[0] += this.vel[0] * (timeDelta / 10);
	  this.pos[1] += this.vel[1] * (timeDelta / 10);
	};

	MovingObject.prototype.hasCollision = function (object) {
	  var deltaX = this.pos[0] - object.pos[0];
	  var deltaY = this.pos[1] - object.pos[1];
	  var sumRadii = this.radius + object.radius;
	  var distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
	  return distance <= sumRadii;
	};

	MovingObject.prototype.relocate = function () {
	  this.pos = [-500, -500];
	};

	module.exports = MovingObject;

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	var Util = __webpack_require__(4),
	    Bullet = __webpack_require__(7),
	    DrunkenBird = __webpack_require__(3),
	    MovingObject = __webpack_require__(5),
	    Power = __webpack_require__(10),
	    Game = __webpack_require__(2);

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
	  var max = this.gunLevel * 10 > 200 ? 200 : this.gunLevel * 10;

	  if (this.fireBullet._lastFire + (350 - max) < Date.now()) {
	    if (this.gunLevel <= 2) {
	      game.bullets.push(new Bullet({
	        pos: [game.ship.pos[0], game.ship.pos[1] - 30],
	        vel: [0, -8],
	        game: game
	      }));
	    } else if (this.gunLevel >= 3) {
	      game.bullets.push(new Bullet({
	        pos: [game.ship.pos[0], game.ship.pos[1] - 30],
	        vel: [0, -8],
	        game: game,
	        color: "#FFD394",
	        radius: 5
	      }));
	      game.bullets.push(new Bullet({
	        pos: [game.ship.pos[0], game.ship.pos[1] - 30],
	        vel: [-4, -8],
	        game: game,
	        color: "#FFD394",
	        radius: 5
	      }));
	      game.bullets.push(new Bullet({
	        pos: [game.ship.pos[0], game.ship.pos[1] - 30],
	        vel: [4, -8],
	        game: game,
	        color: "#FFD394",
	        radius: 5
	      }));
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
	        this.img.src = "images/redbird.png";

	        setTimeout(function () {
	          this.color = "#8BDAFC";
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
	  var velX = this.vel[0] * (timeDelta / 10),
	      velY = this.vel[1] * (timeDelta / 10),
	      newX = this.pos[0] + velX,
	      newY = this.pos[1] + velY;

	  if (newX < this.game.DIM_X - this.radius && newX >= this.radius) {
	    this.pos[0] = newX;
	  }
	  if (newY < this.game.DIM_Y - this.radius && newY >= this.radius) {
	    this.pos[1] = newY;
	  }
	};

	Ship.prototype.draw = function (ctx) {
	  var frame = Math.floor(this.game.tick / 10) % 4;
	  this.srcX = frame * 64;

	  ctx.drawImage(this.img, this.srcX, this.srcY * 64, 64, 64, this.pos[0] - 32, this.pos[1] - 32, 64, 64);
	};

	module.exports = Ship;

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	var Util = __webpack_require__(4),
	    MovingObject = __webpack_require__(5);

	var Bullet = function (options) {
	  this.pos = options.pos;
	  this.vel = options.vel;
	  this.color = options.color || Bullet.COLOR;
	  this.radius = options.radius || Bullet.RADIUS;
	  this.game = options.game;
	};

	Bullet.COLOR = "#A5FCF2";
	Bullet.RADIUS = 5;

	Util.inherits(Bullet, MovingObject);

	Bullet.prototype.collideWith = function (bird) {
	  if (this.hasCollision(bird)) {
	    this.relocate();
	    bird.relocate();
	  }
	};

	module.exports = Bullet;

/***/ },
/* 8 */
/***/ function(module, exports) {

	var keys = {};

	window.addEventListener("keydown", function (e) {
	  keys[e.keyCode] = true;
	});

	window.addEventListener("keyup", function (e) {
	  keys[e.keyCode] = false;
	});

	window.isKeyPressed = function (key) {
	  return keys[key];
	};

/***/ },
/* 9 */
/***/ function(module, exports) {

	var Text = function (options) {
	  this.color = options.color;
	  this.font = options.font || 32 + "px Arial";
	  this.pos = options.pos;
	  this.text = options.text;
	};

	Text.prototype.draw = function (ctx) {
	  ctx.fillStyle = this.color;
	  ctx.font = this.font;
	  ctx.fillText(this.text, this.pos[0], this.pos[1]);
	};

	Text.prototype.move = function () {};

	module.exports = Text;

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	var Util = __webpack_require__(4),
	    MovingObject = __webpack_require__(5);

	var Power = function (options) {
	  this.pos = options.pos;
	  this.vel = [0, 1];
	  this.color = options.color || Power.COLOR;
	  this.radius = options.radius || Power.RADIUS;
	};

	Power.COLOR = "#D280F0";
	Power.RADIUS = 15;

	Util.inherits(Power, MovingObject);

	module.exports = Power;

/***/ }
/******/ ]);