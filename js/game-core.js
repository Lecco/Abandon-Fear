/**
 * Constructor for characters (hero, NPC)
 */
var Character = function(x, y, picture)
{
  this.coordinatesX = x;
  this.coordinatesY = y;
  this.picture = picture;
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
var hero = new Character(1, 2, 'images/hero.png');
var enemy = new Character(5, 7, 'images/zombie1.png');
var table = new Barrier(3, 3, 1, 2, 'images/table.png', true);




/**
 * Function to handle pressed keys
 */
function handleKey(e)
{
  switch (e.keyCode)
  {
    case '37':
      hero.moveLeft();
      break;
    case '38':
      hero.moveUp();
      break;
    case '39':
      hero.moveRight();
      break;
    case '40':
      hero.moveDown();
      break;
    default:
      window.alert('Co to? ' + e.keyCode);
      break;
  }
}
document.onkeydown = handleKey;

