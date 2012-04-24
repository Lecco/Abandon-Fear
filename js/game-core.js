/* Game variables */
var playground,
    hero,
    enemies,
    table,
    gameConsole;

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
      document.getElementById("playground").innerHTML = "<a href=''>TRY AGAIN</a>";
      gameConsole.write("Game over!<br>");
    }

  document.body.innerHTML = document.body.innerHTML + "<div id='playground'></div>";
  document.getElementById("playground").style.width = (this.sizeX * this.fieldSize) + "px";
  document.getElementById("playground").style.height = (this.sizeY * this.fieldSize) + "px";
}

/**
 * Game console (there will be (moves of enemies, of main character etc)
 */
var GameConsole = function()
{
  document.body.innerHTML = document.body.innerHTML + "<div id='game_console'></div>";
  document.getElementById("game_console").style.top = (playground.sizeY * playground.fieldSize) + 20 + "px";

  this.write = function(text){
      document.getElementById("game_console").innerHTML = text + document.getElementById("game_console").innerHTML;
    }
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
      gameConsole.write("You moved left.<br>");
    }
  this.moveUp = function(){
      if (this.coordinateY > 1)
        this.coordinateY--;
      this.move(this.coordinateX, this.coordinateY);
      gameConsole.write("You moved up.<br>");
    }
  this.moveRight = function(){
      if (this.coordinateX < playground.sizeX)
        this.coordinateX++;
      this.move(this.coordinateX, this.coordinateY);
      gameConsole.write("You moved right.<br>");
    }
  this.moveDown = function(){
      if (this.coordinateY < playground.sizeY)
        this.coordinateY++;
      this.move(this.coordinateX, this.coordinateY);
      gameConsole.write("You moved down.<br>");
    }
  this.move = function(x, y){
      document.getElementById("character_" + this.name).style.left = ((this.coordinateX - 1) * playground.fieldSize) + "px";
      document.getElementById("character_" + this.name).style.top = ((this.coordinateY - 1) * playground.fieldSize) + "px";
      this.steps++;
      //gameConsole.write("This was your " + this.steps + ". move.<br>");
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
      gameConsole.write("Enemy " + this.name + " moved left.<br>");
    }
  this.moveUp = function(){
      if (this.coordinateY > 1)
        this.coordinateY--;
      this.move(this.coordinateX, this.coordinateY);
      gameConsole.write("Enemy " + this.name + " moved up.<br>");
    }
  this.moveRight = function(){
      if (this.coordinateX < playground.sizeX)
        this.coordinateX++;
      this.move(this.coordinateX, this.coordinateY);
      gameConsole.write("Enemy " + this.name + " moved right.<br>");
    }
  this.moveDown = function(){
      if (this.coordinateY < playground.sizeY)
        this.coordinateY++;
      this.move(this.coordinateX, this.coordinateY);
      gameConsole.write("Enemy " + this.name + " moved down.<br>");
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
  for (var i = 0; i < enemies.length; i++)
  {
    enemies[i].chaseHero();
    if (hero.coordinateX == enemies[i].coordinateX && hero.coordinateY == enemies[i].coordinateY)
    {
      playground.gameOver(hero.steps);
    }
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
  gameConsole = new GameConsole();
  hero = new Character("main", 3, 1, "images/hero.jpg");
  enemies = new Array(new Enemy("zombie", 1, 1, "images/zombie.gif"), 
                      new Enemy("zombie2", 6, 1, "images/zombie.gif"),
                      new Enemy("zombie3", 5, 2, "images/zombie.gif"));
  table = new Barrier("table", 3, 3, 1, 1, "images/table.gif", true);
}

window.onload = initGame;
