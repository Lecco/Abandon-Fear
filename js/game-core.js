/* Game variables */
var playground,      // object representing playing area
    hero,            // main character
    enemies,         // array of all enemies
    barriers,        // array of all barriers
    gameConsole;     // game console object (game info)

/**
 * Constructor for playground variables and functions
 */
var Playground = function(sizeX, sizeY, fieldSize)
{
  this.sizeX = sizeX;
  this.sizeY = sizeY;
  this.fieldSize = fieldSize;
  this.finishX = null;
  this.finishY = null;

  /**
   * Initialize playground - add playground to document and resize it
   */
  this.init = function()
  {
    document.body.innerHTML = document.body.innerHTML + "<div id='playground'></div>";
    document.getElementById("playground").style.width = (this.sizeX * this.fieldSize) + "px";
    document.getElementById("playground").style.height = (this.sizeY * this.fieldSize) + "px";
  }
  /**
   * Adds a new content to the playground
   */
  this.add = function(content)
  {
    document.getElementById("playground").innerHTML = document.getElementById("playground").innerHTML + content;
  }

  /**
   * Sets position of finish and adds it to playground
   */
  this.addFinish = function(x, y)
  {
    this.finishX = x;
    this.finishY = y;
    playground.add("<div id='finish'><img src='images/finish.jpg' style='width:" + playground.fieldSize + "px;height:" + playground.fieldSize + "px; top:" + (this.fieldSize * (y - 1)) + "px; left: " + (this.fieldSize * (x - 1)) + "px'></div>");
  }

  /**
   * Returns true if there is any not movable barrier on given coordinates
   */
  this.getCollision = function(x,y)
  {
    if (barriers == undefined) return false;
    for (var i = 0; i < barriers.length; i++)
    {
      if (barriers[i].movable == false)
      {
        for (var hor = 0; hor < barriers[i].sizeX; hor++)
          for (var ver = 0; ver < barriers[i].sizeY; ver++)
            if (x == barriers[i].coordinateX + hor && y == barriers[i].coordinateY + ver)
              return true;
      }
    }
    return false;
  }

  /**
   * Prints the victory message to console and into the playgropund
   */
  this.victory = function(steps)
  {
    document.getElementById("playground").innerHTML = "YOU HAVE WON<br>You made " + steps + " steps.";
    gameConsole.write("VICTORY!!!<br>");
  }

  /**
   * Prints the game over message to console and to the playground
   */
  this.gameOver = function(steps)
  {
    document.getElementById("playground").innerHTML = "<a href=''>TRY AGAIN</a>";
    gameConsole.write("Game over!<br>");
  }

}

/**
 * Game console (there will be (moves of enemies, of main character etc)
 */
var GameConsole = function()
{
  /**
   * Initialize object of game console - add it to document and move it to its position
   */
  this.init = function()
  {
    document.body.innerHTML = document.body.innerHTML + "<div id='game_console'></div>";
    document.getElementById("game_console").style.top = (playground.sizeY * playground.fieldSize) + 20 + "px";
  }

  /**
   * Writes giver text to the console
   */
  this.write = function(text)
  {
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
  this.hadMoved = true;

  /**
   * Initialize main character - add it top playground and move it to its position
   */
  this.init = function()
  {
    playground.add("<div id='character_" + this.name + "'><img src='" + this.picture + "' style='width:" + playground.fieldSize + "px;height:" + playground.fieldSize + "px'></div>");
    this.move(this.coordinateX, this.coordinateY);
  }

  /**
   * Moves left (if there isn't any non-movable barrier)
   */
  this.moveLeft = function()
  {
    if (this.coordinateX > 1)
      this.coordinateX--;
    if (this.move(this.coordinateX, this.coordinateY))
      gameConsole.write("You moved left.<br>");
    else
      this.coordinateX++;
  }

  /**
   * Moves up (if there isn't any non-movable barrier)
   */
  this.moveUp = function()
  {
    if (this.coordinateY > 1)
      this.coordinateY--;
    if (this.move(this.coordinateX, this.coordinateY))
      gameConsole.write("You moved up.<br>");
    else
      this.coordinateY++;
  }

  /**
   * Moves right (if there isn't any non-movable barrier)
   */
  this.moveRight = function()
  {
    if (this.coordinateX < playground.sizeX)
      this.coordinateX++;
    if (this.move(this.coordinateX, this.coordinateY))
      gameConsole.write("You moved right.<br>");
    else
      this.coordinateX--;
  }

  /**
   * Moves down (if there isn't any non-movable barrier)
   */
  this.moveDown = function()
  {
    if (this.coordinateY < playground.sizeY)
      this.coordinateY++;
    if (this.move(this.coordinateX, this.coordinateY))
      gameConsole.write("You moved down.<br>");
    else
      this.coordinateY--;
  }

  /**
   * Moves to given coordinates
   */
  this.move = function(x, y)
  {
    if (playground.getCollision(x, y)) 
    {
      // if there is some barrier, we can't move here
      this.hadMoved = false;
      return false;
    }
    document.getElementById("character_" + this.name).style.left = ((this.coordinateX - 1) * playground.fieldSize) + "px";
    document.getElementById("character_" + this.name).style.top = ((this.coordinateY - 1) * playground.fieldSize) + "px";
    this.steps++;
    this.hadMoved = true;
    return true;
    //gameConsole.write("This was your " + this.steps + ". move.<br>");
  }
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

  /**
   * Initialize enemy - add it to playground and move it to its location
   */
  this.init = function()
  {
    playground.add("<div id='enemy_" + this.name + "'><img src='" + this.picture + "' style='width:" + playground.fieldSize + "px;height:" + playground.fieldSize + "px'></div>");
    this.move(this.coordinateX, this.coordinateY);
  }
  /**
   * Moves left
   */
  this.moveLeft = function()
  {
    if (this.coordinateX > 1)
      this.coordinateX--;
    if (this.move(this.coordinateX, this.coordinateY))
      gameConsole.write("Enemy " + this.name + " moved left.<br>");
    else
      this.coordinateX++;
  }

  /**
   * Moves up
   */
  this.moveUp = function()
  {
    if (this.coordinateY > 1)
      this.coordinateY--;
    if (this.move(this.coordinateX, this.coordinateY))
      gameConsole.write("Enemy " + this.name + " moved up.<br>");
    else
      this.coordinateY++;
  }

  /**
   * Moves right
   */
  this.moveRight = function()
  {
    if (this.coordinateX < playground.sizeX)
      this.coordinateX++;
    if (this.move(this.coordinateX, this.coordinateY))
      gameConsole.write("Enemy " + this.name + " moved right.<br>");
    else
      this.coordinateX--;
  }

  /**
   * Moves down
   */
  this.moveDown = function()
  {
    if (this.coordinateY < playground.sizeY)
      this.coordinateY++;
    if (this.move(this.coordinateX, this.coordinateY))
      gameConsole.write("Enemy " + this.name + " moved down.<br>");
    else
      this.coordinateY--;
  }

  /**
   * Making the decision which direction to choose when chasing main character
   */
  this.chaseHero = function()
  {
    /*
      * The vector [coefficientX, coefficientY] = [heros coordinates - enemys coordinates]
      * It's the direction from enemy to main character
      */
    var coefficientX = hero.coordinateX - this.coordinateX;
    var coefficientY = hero.coordinateY - this.coordinateY;

    if (coefficientX == 0)
      // if coefficientX == 0 it means that both (main character and this enemy) are on the same row
      if (coefficientY > 0)
        this.moveDown();
      else this.moveUp();
    else if (coefficientY == 0)
      // if coefficientY == 0 that mans that they are on the same line
      if (coefficientX > 0)
        this.moveRight();
      else this.moveLeft();
    else if (coefficientY < 0 && coefficientY < coefficientX)
      /*
        * Hero is more "up" than on side
        *
        *  H..
        *  ...
        *  .E.
        */
      this.moveUp();
    else if (coefficientY < 0 && coefficientY >= coefficientX)
      /*
        * Hero is more left than up
        * 
        * H..
        * ..E
        * ...
        */
      this.moveLeft();
    else if (coefficientY > 0 && coefficientY < coefficientX)
      /*
        * Hero is more down than right
        * 
        * E..
        * ...
        * .H.
        */
      this.moveRight();
    else if (coefficientY > 0 && coefficientX <= coefficientY)
      /*
        * Hero is more right than down
        *
        * E..
        * ..H
        * ...
        */
      this.moveDown();
  }

  /*
   * If there isn't any collision on given coordinates, then moves enemy to these coordinates
   */
  this.move = function(x, y)
  {
    if (playground.getCollision(x, y)) 
      return false;
    document.getElementById("enemy_" + this.name).style.left = ((x - 1) * playground.fieldSize) + "px";
    document.getElementById("enemy_" + this.name).style.top = ((y - 1) * playground.fieldSize) + "px";
    return true;
  }

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

  /**
   * Initialize barrier - move it to its location and add it to playground
   */
  this.init = function()
  {
    playground.add("<div id='barrier_" + this.name + "'><img src='" + this.picture + "' style='width:" + playground.fieldSize + "px;height:" + playground.fieldSize + "px'></div>");
    document.getElementById("barrier_" + this.name).style.left = ((this.coordinateX - 1) * playground.fieldSize) + "px";
    document.getElementById("barrier_" + this.name).style.top = ((this.coordinateY - 1) * playground.fieldSize) + "px";
  }
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
      //window.alert(e.keyCode);
      break;
  }

  // if hero hadn't moved (key was pressed but there might be a barrier) then neither will enemies
  if (hero.hadMoved == false) return;

  for (var i = 0; i < enemies.length; i++)
  {
    if (hero.coordinateX == enemies[i].coordinateX && hero.coordinateY == enemies[i].coordinateY)
    {
      // if any of enemies is on the same coordinates as main character then he lost
      playground.gameOver(hero.steps);
    }

    enemies[i].chaseHero();
    
    if (hero.coordinateX == enemies[i].coordinateX && hero.coordinateY == enemies[i].coordinateY)
    {
      // if any of enemies is on the same coordinates as main character then he lost
      playground.gameOver(hero.steps);
    }
  }

  // if hero is on coordinates of finish then he won
  if (hero.coordinateX == playground.finishX && hero.coordinateY == playground.finishY)
  {
    playground.victory(hero.steps);
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
  playground.init();
  playground.addFinish(3, 8);
  gameConsole = new GameConsole();
  gameConsole.init();
  hero = new Character("main", 3, 1, "images/hero.jpg");
  hero.init();
  enemies = new Array(new Enemy("zombie_pepa", 1, 2, "images/zombie.gif"), 
                      new Enemy("zombie_ferda", 8, 1, "images/zombie.gif"),
                      new Enemy("zombie_neznabohumil", 8, 7, "images/zombie.gif"),
                      new Enemy("zombie_michael_jackson", 2, 5, "images/zombie.gif"));
  for (var i = 0; i < enemies.length; i++)
    enemies[i].init();

  barriers = new Array(new Barrier("table", 3, 3, 1, 1, "images/table.gif", false));
  for (var i = 0; i < barriers.length; i++)
    barriers[i].init();
}

window.onload = initGame;
