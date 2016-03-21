#DrunkenBirds
*Javascript, HTML5 Canvas*

[DrunkenBirds](http://www.justintung.rocks/DrunkenBirds)

DrunkenBirds is a 2D browser based shooter featuring smooth omnidirectional movement.

## How to play

###Controls

Use the arrow keys to move around.
Hold Spacebar to shoot.
Press 'p' to pause.

###Tips
- Get the power-ups that the birds drop to level up your gun.
- Each power-up reduces delay between shots.
- At Gun level 3 your gun shoots 3 bullets instead of one.
- At Gun Level 20, your bullets increase in size and get a significant speed boost.

- The red birds have one hitpoint. They require only one hit to kill.
- The white birds have two hitpoints. They require two hits to kill.

###Good luck!


##Implementation Details

###Collision Detection system
Everything in the game is a circle. This function checks to see if two circles overlap, resulting in a collision.
```Javascript
MovingObject.prototype.hasCollision = function (object) {
  var deltaX = this.pos[0] - object.pos[0];
  var deltaY = this.pos[1] - object.pos[1];
  var sumRadii = this.radius + object.radius;
  var distance = Math.sqrt((deltaX * deltaX) + (deltaY * deltaY));
  return (distance <= sumRadii);
};
```

##Photos

###Game Play
![Game](/images/game.png)

### Bonus Features (To do)
- Add different power-ups
- Add bosses
