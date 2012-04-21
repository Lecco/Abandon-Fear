/* Global variables */
var playgroundSizeX = 8;
var playgroundSizeY = 8;
var fieldSize = 20;       // size of playfield in pixels

/**
 * Constructor for characters (hero, NPC)
 */
var Character = function(x, y, picture)
{
  this.coordinateX = x;
  this.coordinateY = y;
  this.picture = picture;
  this.moveLeft = function(){
      if (this.coordinateX > 1)
        this.coordinateX--;
    }
  this.moveUp = function(){
      if (this.coordinateY > 1)
        this.coordinateY--;
    }
  this.moveRight = function(){
      if (this.coordinateX < playgroundSizeX)
        this.coordinateX++;
    }
  this.moveDown = function(){
      if (this.coordinateY < playgroundSizeY)
        this.coordinateY++;
    }
}
/**
 * Constructor for any obsatcles in the way like tables, barrels
 */
var Barrier = function(x, y, sizeX, sizeY, picture, movable)
{
  this.coordinateX = x;
  this.coordinateY = y;
  this.sizeX = sizeX;
  this.sizeY = sizeY;
  this.movable = movable;
}

/* game elements */
var hero = new Character(1, 2, "images/hero.png");
var enemy = new Character(5, 7, "images/zombie1.png");
var table = new Barrier(3, 3, 1, 2, "images/table.png", true);




/**
 * Function to handle pressed keys
 */
function handleKey(e)
{
  switch (e.keyCode)
  {
    case 37:
      hero.moveLeft();
      break;
    case 38:
      hero.moveUp();
      break;
    case 39:
      hero.moveRight();
      break;
    case 40:
      hero.moveDown();
      break;
    default:
      window.alert("Co to? " + e.keyCode);
      break;
  }
  window.alert("Hrdina: x = " + hero.coordinateX + "; y = " + hero.coordinateY);
}
document.onkeydown = handleKey;

