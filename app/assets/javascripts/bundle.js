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
	    Game = __webpack_require__(2),
	    KeyHandler = __webpack_require__(10);

	var el = document.getElementsByTagName("body")[0],
	    canvas = document.getElementById("myCanvas"),
	    ctx = canvas.getContext("2d"),
	    scoreEl = document.getElementById("score-container"),
	    startEl = document.getElementById("start"),
	    newGame = true;

	var token = setInterval(function () {
	  if (isKeyPressed(83) && newGame) {
	    scoreEl.className = "visible";
	    startEl.className = "hidden";
	    canvas.className = "visible";
	    canvas.height = new Game().DIM_Y;
	    canvas.width = new Game().DIM_X;
	    setTimeout(function () {
	      new GameView(new Game(), ctx).start();
	    }, 2000);
	    newGame = false;
	    clearInterval(token);
	  }
	}, 30);

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	var Game = __webpack_require__(2),
	    Text = __webpack_require__(8),
	    KeyHandler = __webpack_require__(10);

	var GameView = function (game, ctx) {
	  var self = this instanceof Power ? this : Object.create(GameView.prototype);

	  game.gameView = self;
	  self.game = game;
	  self.ctx = ctx;
	  self.lastTime = self.lastTime || 0;

	  return self;
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
	      color: "#7CE7FB",
	      pos: [20, this.game.DIM_Y / 2 + 16],
	      text: "Press Enter To Play Again"
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
	    Text = __webpack_require__(8),
	    Util = __webpack_require__(4),
	    Power = __webpack_require__(9);

	var Game = function () {
	  var self = this instanceof Power ? this : Object.create(Game.prototype);

	  self.DIM_X = 700;
	  self.DIM_Y = 700;
	  self.MAX_NUM_BIRDS = 6;
	  self.bullets = [];
	  self.powers = [];
	  self.text = [];
	  self.ship = new Ship({ game: self, pos: [self.DIM_X / 2, self.DIM_Y - 75] });
	  self.level = 1;
	  self.score = 0;
	  self.pointsUntilLevel = 5000;
	  self.over = false;
	  self.paused = false;
	  self.tick = 0;
	  self.birds = this.addBirds();
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
	    for (var i = 0; i < this.MAX_NUM_BIRDS * max; i++) {
	      birdLevel = Math.random() <= 0.10 + 0.05 * this.level ? 2 : 1;

	      birds.push(new DrunkenBird({
	        pos: this.randomPosition(),
	        game: this,
	        vel: Util.randomVel(1, 5 + 0.1 * this.level),
	        level: birdLevel
	      }));
	    }
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
	    if (bird.pos[0] <= -100 || bird.pos[0] > this.DIM_X + 100) {
	      this.birds.splice(i, 1);
	    } else if (bird.pos[1] >= this.DIM_Y + 100) {
	      this.birds.splice(i, 1);
	    }
	  }.bind(this));

	  this.bullets.forEach(function (bullet, i) {
	    if (bullet.pos[0] < -5 || bullet.pos[0] > this.DIM_X + 5) {
	      this.bullets.splice(i, 1);
	    } else if (bullet.pos[1] >= this.DIM_Y + 5 || bullet.pos[1] <= -5) {
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
	      this.bullets[i].collideWith(this.birds[j]);
	    }
	  }
	  for (var k = 0; k < this.birds.length; k++) {
	    this.ship.collideWith(this.birds[k]);
	  }
	  for (var l = 0; l < this.powers.length; l++) {
	    this.ship.collideWith(this.powers[l]);
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
	  this.birds = this.addBirds();
	};

	Game.prototype.handlePressedKeys = function () {
	  if (!this.over) {
	    if (window.isKeyPressed(80)) {
	      // 'p'
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
	  var self = this instanceof Power ? this : Object.create(DrunkenBird.prototype);

	  self.img = new Image();
	  self.img.src = "images/bird_sheet.png";
	  self.srcX = 0;
	  self.srcY = 0;
	  self.level = options.level || 1;
	  self.durability = self.level;
	  self.pos = options.pos;
	  self.radius = options.radius || DrunkenBird.RADIUS;
	  self.game = options.game;
	  self.vel = options.vel || Util.randomVel(1, 3);
	};

	DrunkenBird.RADIUS = 48;

	Util.inherits(DrunkenBird, MovingObject);
	var frame;
	DrunkenBird.prototype.draw = function (ctx) {
	  if (this.level === 1) {
	    frame = Math.floor(this.game.tick / 10) % 3;
	    this.srcY = frame * 100;

	    ctx.drawImage(this.img, this.srcX, this.srcY, 100, 100, this.pos[0] - 50, this.pos[1] - 50, 100, 100);
	  } else if (this.level === 2) {
	    frame = Math.floor(this.game.tick / 10) % 5;
	    this.srcY = frame * 108;
	    this.img.src = "images/bird_sheet2.png";

	    ctx.drawImage(this.img, this.srcX, this.srcY, 90, 108, this.pos[0] - 50, this.pos[1] - 50, 100, 100);
	  }
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
	  var self = this instanceof MovingObject ? this : Object.create(MovingObject.prototype);

	  self.pos = options.pos;
	  self.vel = options.vel;
	  self.radius = options.radius;
	  self.color = options.color;

	  return self;
	};

	MovingObject.prototype.draw = function (ctx) {
	  ctx.fillStyle = this.color;
	  ctx.beginPath();
	  ctx.arc(this.pos[0], this.pos[1], this.radius, 0, 2 * Math.PI);
	  ctx.fill();
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
	  this.pos = [-5000, 5000];
	};

	module.exports = MovingObject;

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	var Util = __webpack_require__(4),
	    Bullet = __webpack_require__(7),
	    DrunkenBird = __webpack_require__(3),
	    MovingObject = __webpack_require__(5),
	    Power = __webpack_require__(9),
	    Game = __webpack_require__(2);

	var Ship = function (options) {
	  var self = this instanceof Power ? this : Object.create(Ship.prototype);

	  self.img = new Image();
	  self.tick = 0;
	  self.img.src = "images/bird.png";
	  self.srcX;
	  self.srcY = 3;
	  self.pos = options.pos;
	  self.vel = [0, 0];
	  self.color = options.color || Ship.COLOR;
	  self.radius = options.radius || Ship.RADIUS;
	  self.game = options.game;
	  self.lives = 3;
	  self.maxSpeed = 6;
	  self.invulnerable = false;
	  self.gunLevel = 1;

	  return self;
	};

	Ship.COLOR = "#8BDAFC";
	Ship.RADIUS = 30;

	Util.inherits(Ship, MovingObject);

	Ship.prototype.fireBullet = function (game) {
	  var max = this.gunLevel * 10;
	  if (this.gunLevel === 20) {
	    max += 50;
	  }

	  if (this.fireBullet._lastFire + (350 - max) < Date.now()) {
	    if (this.gunLevel <= 2) {
	      game.bullets.push(new Bullet({
	        pos: [game.ship.pos[0], game.ship.pos[1] - 30],
	        vel: [0, -8],
	        game: game
	      }));
	    } else if (this.gunLevel >= 3 && this.gunLevel < 20) {
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
	    } else if (this.gunLevel >= 20) {
	      game.bullets.push(new Bullet({
	        pos: [game.ship.pos[0], game.ship.pos[1] - 30],
	        vel: [0, -8],
	        game: game,
	        color: "#FFD394",
	        radius: 10
	      }));
	      game.bullets.push(new Bullet({
	        pos: [game.ship.pos[0], game.ship.pos[1] - 30],
	        vel: [-4, -8],
	        game: game,
	        color: "#FFD394",
	        radius: 10
	      }));
	      game.bullets.push(new Bullet({
	        pos: [game.ship.pos[0], game.ship.pos[1] - 30],
	        vel: [4, -8],
	        game: game,
	        color: "#FFD394",
	        radius: 10
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
	        this.img.src = "images/redbird.png";
	        if (this.lives <= 0) {
	          this.game.over = true;
	        }

	        setTimeout(function () {
	          this.invulnerable = false;
	          this.img.src = "images/bird.png";
	        }.bind(this), 3000);
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
	    Text = __webpack_require__(8),
	    Power = __webpack_require__(9),
	    MovingObject = __webpack_require__(5);

	var Bullet = function (options) {
	  var self = this instanceof Power ? this : Object.create(Bullet.prototype);

	  self.pos = options.pos;
	  self.vel = options.vel;
	  self.color = options.color || Bullet.COLOR;
	  self.radius = options.radius || Bullet.RADIUS;
	  self.game = options.game;

	  return self;
	};

	Bullet.COLOR = "#A5FCF2";
	Bullet.RADIUS = 5;

	Util.inherits(Bullet, MovingObject);

	Bullet.prototype.collideWith = function (bird) {
	  if (this.hasCollision(bird)) {
	    var pos = bird.pos;
	    this.relocate();
	    bird.durability -= 1;

	    if (bird.durability <= 0) {
	      bird.relocate();

	      if (Math.random() <= 0.05) {
	        this.game.powers.push(new Power({
	          pos: pos,
	          game: this.game
	        }));
	      }
	    }

	    this.game.score += 100 * this.game.level;
	    this.game.pointsUntilLevel -= 100 * this.game.level;

	    if (this.game.pointsUntilLevel <= 0) {
	      this.game.level += 1;
	      this.game.pointsUntilLevel += this.game.score * 1.2;

	      if (!this.game.paused) {
	        this.game.text = [new Text({
	          color: "white",
	          pos: [this.game.DIM_X / 2 - 50, this.game.DIM_Y / 2 + 16],
	          text: "LEVEL " + this.game.level
	        })];

	        setTimeout(function () {
	          if (!this.game.paused) {
	            this.game.text = [];
	          }
	        }.bind(this), 3000);
	      }
	    }
	  }
	};

	module.exports = Bullet;

/***/ },
/* 8 */
/***/ function(module, exports) {

	var Text = function (options) {
	  var self = this instanceof Power ? this : Object.create(Text.prototype);

	  self.color = options.color;
	  self.font = options.font || 32 + "px Arial";
	  self.pos = options.pos;
	  self.text = options.text;

	  return self;
	};

	Text.prototype.draw = function (ctx) {
	  ctx.fillStyle = this.color;
	  ctx.font = this.font;
	  ctx.fillText(this.text, this.pos[0], this.pos[1]);
	};

	Text.prototype.move = function () {};

	module.exports = Text;

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	var Util = __webpack_require__(4),
	    MovingObject = __webpack_require__(5);

	var Power = function (options) {
	  var self = this instanceof Power ? this : Object.create(Power.prototype);

	  self.img = new Image();
	  self.img.src = "images/power1.png";
	  self.srcX = 0;
	  self.srcY = 0;
	  self.pos = options.pos;
	  self.game = options.game;
	  self.vel = [0, 1];
	  self.radius = options.radius || Power.RADIUS;

	  return self;
	};

	Power.RADIUS = 20;

	Util.inherits(Power, MovingObject);

	Power.prototype.draw = function (ctx) {
	  var frame = Math.floor(this.game.tick / 10) % 4;
	  this.img.src = "images/power" + (frame + 1) + ".png";

	  ctx.drawImage(this.img, this.srcX, this.srcY, 30, 30, this.pos[0] - 20, this.pos[1] - 20, 40, 40);
	};

	module.exports = Power;

/***/ },
/* 10 */
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

/***/ }
/******/ ]);
