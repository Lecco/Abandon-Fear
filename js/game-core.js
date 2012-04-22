/* Game variables */
var playground,
    hero,
    enemy,
    table;

/**
 * Constructor for playground variables and functions
 */
var Playground = function(sizeX, sizeY, fieldSize)
{
  this.sizeX = sizeX;
  this.sizeY = sizeY;
  this.fieldSize = fieldSize;

  this.add = function(content){
      document.getElementById("playground").innerHTML = document.getElementById("playground").innerHTML + content;
    }

  this.gameOver = function(steps){
      document.body.innerHTML = "Thanks for playing! You survived " + steps + " steps. <br><a href=''>TRY AGAIN</a>";
    }

  document.body.innerHTML = "<div id='playground'></div>";
  document.getElementById("playground").style.width = (this.sizeX * fieldSize) + "px";
  document.getElementById("playground").style.height = (this.sizeY * fieldSize) + "px";
}

/**
 * Constructor for characters like heroes and NPC
 */
var Character = function(name, x, y, picture)
{
  this.name = name;
  this.coordinateX = x;
  this.coordinateY = y;
  this.picture = picture;
  this.steps = 0;

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
      this.steps++;
    }
  playground.add("<div id='character_" + this.name + "'><img src='" + this.picture + "' style='width:" + playground.fieldSize + "px;height:" + playground.fieldSize + "px'></div>");
  this.move(this.coordinateX, this.coordinateY);
}

/**
 * Constructor for enemies
 */
var Enemy = function(name, x, y, picture)
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
  this.chaseHero = function(){
      var coefficientX = hero.coordinateX - this.coordinateX;
      var coefficientY = hero.coordinateY - this.coordinateY;
      if (coefficientX == 0)
        if (coefficientY > 0)
          this.moveDown();
        else this.moveUp();
      else if (coefficientY == 0)
        if (coefficientX > 0)
          this.moveRight();
        else this.moveLeft();
      else if (coefficientY < 0 && coefficientY < coefficientX)
        this.moveUp();
      else if (coefficientY < 0 && coefficientY >= coefficientX)
        this.moveLeft();
      else if (coefficientY > 0 && coefficientY < coefficientX)
        this.moveRight();
      else if (coefficientY > 0 && coefficientX < coefficientY)
        this.moveDown();
    }
  this.move = function(x, y){
      document.getElementById("enemy_" + this.name).style.left = ((x - 1) * playground.fieldSize) + "px";
      document.getElementById("enemy_" + this.name).style.top = ((y - 1) * playground.fieldSize) + "px";
    }
  playground.add("<div id='enemy_" + this.name + "'><img src='" + this.picture + "' style='width:" + playground.fieldSize + "px;height:" + playground.fieldSize + "px'></div>");
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

  playground.add("<div id='barrier_" + this.name + "'><img src='" + this.picture + "' style='width:" + playground.fieldSize + "px;height:" + playground.fieldSize + "px'></div>");
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
  enemy.chaseHero();
  if (hero.coordinateX == enemy.coordinateX && hero.coordinateY == enemy.coordinateY)
  {
    playground.gameOver(hero.steps);
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
  enemy = new Enemy("zombie", 5, 7, "images/zombie.gif");
  table = new Barrier("table", 3, 3, 1, 1, "images/table.gif", true);
}

window.onload = initGame;
