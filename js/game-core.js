/* Game variables */
var playground,
    hero,
    enemy,
    table;

/**
 * Function to add content to game screen
 */
function addToPlayground(content)
{
  document.getElementById("playground").innerHTML = document.getElementById("playground").innerHTML + content;
}

/**
 * Constructor for playground variables and functions
 */
var Playground = function(sizeX, sizeY, fieldSize)
{
  this.sizeX = sizeX;
  this.sizeY = sizeY;
  this.fieldSize = fieldSize;

  document.body.innerHTML = "<div id='playground'></div>";
  document.getElementById("playground").style.width = (this.sizeX * fieldSize) + "px";
  document.getElementById("playground").style.height = (this.sizeY * fieldSize) + "px";
}

/**
 * Constructor for characters (hero, NPC)
 */
var Character = function(name, x, y, picture)
{
  this.name = name;
  this.coordinateX = x;
  this.coordinateY = y;
  this.picture = picture;

  this.moveLeft = function(){
      if (this.coordinateX > 1)
        this.coordinateX--;
      this.move(this.coordinateX, this.coordinateY);
    }
  this.moveUp = function(){
      if (this.coordinateY > 1)
        this.coordinateY--;
      this.move(this.coordinateX, this.coordinateY);
    }
  this.moveRight = function(){
      if (this.coordinateX < playground.sizeX)
        this.coordinateX++;
      this.move(this.coordinateX, this.coordinateY);
    }
  this.moveDown = function(){
      if (this.coordinateY < playground.sizeY)
        this.coordinateY++;
      this.move(this.coordinateX, this.coordinateY);
    }
  this.move = function(x, y){
      document.getElementById("character_" + this.name).style.left = ((this.coordinateX - 1) * playground.fieldSize) + "px";
      document.getElementById("character_" + this.name).style.top = ((this.coordinateY - 1) * playground.fieldSize) + "px";
    }
  addToPlayground("<div id='character_" + this.name + "'><img src='" + this.picture + "' style='width:" + playground.fieldSize + "px;height:" + playground.fieldSize + "px'></div>");
  this.move(this.coordinateX, this.coordinateY);
}

/**
 * Constructor for any obsatcles in the way like tables, barrels
 */
var Barrier = function(name, x, y, sizeX, sizeY, picture, movable)
{
  this.name = name;
  this.coordinateX = x;
  this.coordinateY = y;
  this.sizeX = sizeX;
  this.sizeY = sizeY;
  this.picture = picture;
  this.movable = movable;

  addToPlayground("<div id='barrier_" + this.name + "'><img src='" + this.picture + "' style='width:" + playground.fieldSize + "px;height:" + playground.fieldSize + "px'></div>");
  document.getElementById("barrier_" + this.name).style.left = ((this.coordinateX - 1) * playground.fieldSize) + "px";
  document.getElementById("barrier_" + this.name).style.top = ((this.coordinateY - 1) * playground.fieldSize) + "px";
}

/**
 * Function to handle pressed keys
 */
function handleKey(e)
{
  //window.alert("Hrdina " + hero.name + ": x = " + hero.coordinateX + "; y = " + hero.coordinateY);
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
      //window.alert("Co to? " + e.keyCode);
      break;
  }
}

/**
 * Initialize game variables and start the game
 */
function initGame()
{
  document.onkeydown = handleKey;
  /* game elements */
  playground = new Playground(8, 8, 30);
  hero = new Character("main", 1, 2, "images/hero.jpg");
  enemy = new Character("zombie", 5, 7, "images/zombie.gif");
  table = new Barrier("table", 3, 3, 1, 1, "images/table.gif", true);

  
}

window.onload = initGame;
