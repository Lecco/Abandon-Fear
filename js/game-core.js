/* Game variables */
var playground,      // object representing playing area
    hero,            // main character
    enemies,         // array of all enemies
    barriers,        // array of all barriers
    gameConsole;     // game console object (game info)

const DIRECTION_UP = 0;
const DIRECTION_LEFT = 1;
const DIRECTION_RIGHT = 2;
const DIRECTION_DOWN = 3;
const COUNT_DIRECTIONS = 4;

/**
 * Class for playground variables and functions
 *
 * @param int sizeX horizontal size
 * @param int sizeY vertical size
 * @param int fieldSize size of one field of playground (it is square) [px]
 */
var Playground = function(sizeX, sizeY, fieldSize)
{
    this.sizeX = sizeX;
    this.sizeY = sizeY;
    this.fieldSize = fieldSize;
    this.finishX = null;
    this.finishY = null;
    this.board = null;

    /**
    * Initialize playground - add playground to document and resize it
    */
    this.init = function()
    {
        this.board = new Array();
        for (var i = 0; i < this.sizeY; i++)
        {
            this.board[i] = new Array();
            for (var j = 0; j < this.sizeX; j++)
                this.board[i][j] = 2;
        }

        document.body.innerHTML = document.body.innerHTML + "<div id='playground'></div>";
        document.getElementById("playground").style.width = (this.sizeX * this.fieldSize) + "px";
        document.getElementById("playground").style.height = (this.sizeY * this.fieldSize) + "px";
    }

    /**
    * Adds a new content to the playground
    *
    * @param string content HTML code to add to the playground
    */
    this.add = function(content)
    {
        document.getElementById("playground").innerHTML = document.getElementById("playground").innerHTML + content;
    }

    /**
    * Adds object to array representing playground (for easier detection of collisions etc)
    *
    * @param int x coordinate x of the element we want to add
    * @param int y coordinate y of the element we want to add
    * @param int sizeX the horizontal size of the element
    * @param int sizeY the vertical size of the element
    */
    this.addToBoard = function(x, y, sizeX, sizeY)
    {
        for (var i = 0; i < sizeY; i++)
            for (var j = 0; j < sizeX; j++)
                this.board[y + i - 1][x + j - 1] = 1;
    }

    /**
    * Returns adjacency matrix for current playground
    *
    * @return adjacency matrix representing playground (where player can or can 
    * not go)
    */
    this.getAdjacencyMatrix = function()
    {
        var adjacencyMatrix;
        var countNodes = this.sizeX * this.sizeY;

        for (var i = 0; i < countNodes; i++)
        {
            for (var j = 0; j < COUNT_DIRECTIONS; j++)
                if (adjacencyMatrix[i][j] != 1)
                    adjacencyMatrix[i][j] = 0;
            
            // check way up
            if (adjacencyMatrix[i][DIRECTION_UP] != 1 && 
                Math.floor(i / this.sizeX) >= 1 && 
                this.getCollision(i % this.sizeX + 1, Math.floor(i / this.sizeX)) == false)
            {
                adjacencyMatrix[i][DIRECTION_UP] = 1;
                adjacencyMatrix[i - this.sizeX][DIRECTION_DOWN] = 1;
            }
            
            //check way to left
            if (adjacencyMatrix[i][DIRECTION_LEFT] != 1 &&
                i % this.sizeX != 0 && 
                this.getCollision(i % this.sizeX, Math.floor(i / this.sizeX) + 1) == false)
            {
                adjacencyMatrix[i][DIRECTION_LEFT] = 1;
                adjacencyMatrix[i - 1][DIRECTION_RIGHT] = 1;
            }

            //check way to right
            if (adjacencyMatrix[i][DIRECTION_RIGHT] != 1 &&
                i % this.sizeX == (this.sizeX - 1) && 
                this.getCollision(i % this.sizeX + 2, Math.floor(i / this.sizeX) + 1) == false)
            {
                adjacencyMatrix[i][DIRECTION_RIGHT] = 1;
                adjacencyMatrix[i + 1][DIRECTION_LEFT] = 1;
            }

            //check way down
            if (adjacencyMatrix[i][DIRECTION_DOWN] != 1 &&
                Math.floor(i / this.sizeX) < this.sizeX && 
                this.getCollision(i % this.sizeX + 1, Math.floor(i / this.sizeX) + 1) == false)
            {
                adjacencyMatrix[i][DIRECTION_DOWN] = 1;
                adjacencyMatrix[i + this.sizeX][DIRECTION_UP] = 1;
            }
        }
        return adjacencyMatrix;
    }

    /**
    * Finds best direction to move if want to get from start coordiniates to 
    * end coordinates
    *
    * @param int startX players starting x position
    * @param int startY players starting y position
    * @param int endX x position of field on which we want to go
    * @param int endY y position of field on which we want to go
    *
    * @return number representing the direction to go to get to the ending 
    * coordinates by the easiest way
    */
    this.getDirection = function(startX, startY, endX, endY)
    {
        var adjacencyMatrix = this.getAdjacencyMatrix();
        var found           = false;
        var stack           = new Array();
        var fieldIndex      = startY * this.sizeX + startX;
    
        // TODO - Dijkstra?

        // 3.Return best direction
    }

    /**
    * Clears whole game console and prints array representing board
    */
    this.print = function()
    {
        gameConsole.clear();
        var stringBoard = "";
        for (var i = 0; i < this.sizeY; i++)
        {
            for (var j = 0; j <this.sizeX; j++)
                stringBoard += "" + this.board[i][j];
            stringBoard += "<br>";
        }

        gameConsole.write(stringBoard);
    }

    /**
    * Sets position of finish and adds it to playground
    *
    * @param int x the x coordinates of the finish in this level
    * @param int y the y coordinates of the finish in this level
    */
    this.addFinish = function(x, y)
    {
        this.finishX = x;
        this.finishY = y;
        playground.add("<div id='finish'><img src='images/portal.gif' style='width:" + playground.fieldSize + "px;height:" + playground.fieldSize + "px; top:" + (this.fieldSize * (y - 1)) + "px; left: " + (this.fieldSize * (x - 1)) + "px'></div>");
        // TODO
        //playground.addToBoard(x, y, 1, 1);
    }

    /**
    * Returns true if there is any not movable barrier on given coordinates
    *
    * @param int x the x coordinates of the field to check
    * @param int x the y coordinates of the field to check
    * @return boolean
    */
    this.getCollision = function(x, y)
    {
        if (barriers == undefined) 
            return false;

        if (this.board[y - 1][x - 1] == 1)
        {
            /*
            // if there is a barrier, find it
            for (var i = 0; i < barriers.length; i++)
            {
                if (barriers[i].coordinateX == x &&
                    barriers[i].coordinateY == y &&
                    barriers[i].movable)
                {
                    // I like to move it move it
                    return barriers[i];
                }
            }
            */
            return true;
        }
        else 
            return false;
    }

    /**
    * Prints the victory message to console and into the playground
    *
    * @param int steps
    */
    this.victory = function(steps)
    {
        document.getElementById("playground").innerHTML = "<div id='victory'><a href=''>YOU ESCAPED<br>You made " + steps + " steps.<br><br>TRY AGAIN</a></div>";
        gameConsole.write("VICTORY!!!<br>");
    }

    /**
    * Prints the game over message to console and to the playground
    *
    * @param int steps
    */
    this.gameOver = function(steps)
    {
        document.getElementById("playground").innerHTML = "<div id='game_over'><a href=''>YOU HAVE LOST!<br><br>TRY AGAIN</a></div>";
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
        //document.getElementById("game_console").style.top = (playground.sizeY * playground.fieldSize) + 20 + "px";
        document.getElementById("game_console").style.float = "right";
    }

    /**
    * Writes giver text to the console
    *
    * @param string text
    */
    this.write = function(text)
    {
        document.getElementById("game_console").innerHTML = text + document.getElementById("game_console").innerHTML;
    }

    /**
    * Clears game console - deletes everything in it
    */
    this.clear = function()
    {
        document.getElementById("game_console").innerHTML = "";
    }
}

/**
 * Class for characters like heroes and NPC
 *
 * @param string name
 * @param int x
 * @param int y
 * @param string picture
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
        if (this.coordinateX > 1 &&
            playground.getCollision(this.coordinateX - 1, this.coordinateY) == false)
        {
            this.coordinateX--;
        }
        else
            this.hadMoved = false;

        if (this.hadMoved)
        {
            this.move(this.coordinateX, this.coordinateY);
            gameConsole.write("You moved left.<br>");
        }
    }

    /**
    * Moves up (if there isn't any non-movable barrier)
    */
    this.moveUp = function()
    {
        if (this.coordinateY > 1 &&
            playground.getCollision(this.coordinateX, this.coordinateY - 1) == false)
        {
            this.coordinateY--;
        }
        else
            this.hadMoved = false;

        if (this.hadMoved)
        {
            this.move(this.coordinateX, this.coordinateY);
            gameConsole.write("You moved up.<br>");
        }
    }

    /**
    * Moves right (if there isn't any non-movable barrier)
    */
    this.moveRight = function()
    {
        if (this.coordinateX < playground.sizeX &&
            playground.getCollision(this.coordinateX + 1, this.coordinateY) == false)
        {
            this.coordinateX++;
        }
        else
            this.hadMoved = false;

        if (this.hadMoved)
        {
            this.move(this.coordinateX, this.coordinateY);
            gameConsole.write("You moved right.<br>");
        }
    }

    /**
    * Moves down (if there isn't any non-movable barrier)
    */
    this.moveDown = function()
    {
        if (this.coordinateY < playground.sizeY &&
            playground.getCollision(this.coordinateX, this.coordinateY + 1) == false)
        {
            this.coordinateY++;
        }
        else
            this.hadMoved = false;

        if (this.hadMoved)
        {
            this.move(this.coordinateX, this.coordinateY);
            gameConsole.write("You moved down.<br>");
        }
    }

    /**
    * Moves to given coordinates
    *
    * @param int x coordinate x
    * @param int y coordinate y
    */
    this.move = function(x, y)
    {
        document.getElementById("character_" + this.name).style.left = ((this.coordinateX - 1) * playground.fieldSize) + "px";
        document.getElementById("character_" + this.name).style.top = ((this.coordinateY - 1) * playground.fieldSize) + "px";
        this.steps++;
        this.hadMoved = true;
    }
}

/**
 * Class for enemies
 *
 * @param string name
 * @param int x
 * @param int y
 * @param string picture
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
        playground.addToBoard(this.coordinateX, this.coordinateY, 1, 1);
        this.move(this.coordinateX, this.coordinateY);
    }

    /**
    * Moves left
    */
    this.moveLeft = function()
    {
        if (this.coordinateX > 1 &&
            playground.getCollision(this.coordinateX - 1, this.coordinateY) == false)
        {
            gameConsole.write("Enemy " + this.name + " moved left.<br>");
            this.coordinateX--;
        }
        this.move(this.coordinateX, this.coordinateY);
    }

    /**
    * Moves up
    */
    this.moveUp = function()
    {
        if (this.coordinateY > 1 &&
            playground.getCollision(this.coordinateX, this.coordinateY - 1) == false)
        {
            gameConsole.write("Enemy " + this.name + " moved up.<br>");
            this.coordinateY--;
        }
        this.move(this.coordinateX, this.coordinateY);
    }

    /**
    * Moves right
    */
    this.moveRight = function()
    {
        if (this.coordinateX < playground.sizeX &&
            playground.getCollision(this.coordinateX + 1, this.coordinateY) == false)
        {
            gameConsole.write("Enemy " + this.name + " moved right.<br>");
            this.coordinateX++;
        }
        this.move(this.coordinateX, this.coordinateY);
    }

    /**
    * Moves down
    */
    this.moveDown = function()
    {
        if (this.coordinateY < playground.sizeY &&
            playground.getCollision(this.coordinateX, this.coordinateY + 1) == false)
        {
            gameConsole.write("Enemy " + this.name + " moved down.<br>");
            this.coordinateY++;
        }
        this.move(this.coordinateX, this.coordinateY);
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
            else 
                this.moveUp();
        else if (coefficientY == 0)
            // if coefficientY == 0 that mans that they are on the same line
            if (coefficientX > 0)
                this.moveRight();
            else 
                this.moveLeft();
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
    * If there isn't any collision on given coordinates, then move enemy to these coordinates
    *
    * @param int x coordinate x
    * @param int y coordinate y
    */
    this.move = function(x, y)
    {
        document.getElementById("enemy_" + this.name).style.left = ((x - 1) * playground.fieldSize) + "px";
        document.getElementById("enemy_" + this.name).style.top = ((y - 1) * playground.fieldSize) + "px";
    }

}

/**
 * Class for any obsatcles in the way like tables, barrels
 *
 * @param string name
 * @param int x
 * @param int y
 * @param int sizeX
 * @param int sizeY
 * @param string picture
 * @param boolean movable
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
        playground.addToBoard(this.coordinateX, this.coordinateY, this.sizeX, this.sizeY);
        document.getElementById("barrier_" + this.name).style.left = ((this.coordinateX - 1) * playground.fieldSize) + "px";
        document.getElementById("barrier_" + this.name).style.top = ((this.coordinateY - 1) * playground.fieldSize) + "px";
    }
}

/**
 * Function to handle pressed keys
 */
function handleKey(e)
{
    hero.hadMoved = true;
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
            hero.hadMoved = false;
            break;
    }

    // if hero didn't move (key was pressed but there might be a barrier) then neither will enemies
    if (hero.hadMoved == false) 
    {
        return;
    }

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
    var playgroundX = 19,
        playgroundY = 13,
        playgroundField = 50,
        barrierSize = 1,
        finishX = 1,
        finishY = playgroundY,
        heroX = playgroundX,
        heroY = 1,
        heroImage = "images/hero.png",
        enemyImages = Array("images/zombie.gif", 
                            "images/pikachu.png",
                            "images/weasel.png",
                            "images/weasel2.png",
                            "images/blue_monster.png"),
        enemyNames = Array("zombie_",
                           "pikachu_",
                           "green_monster_",
                           "purple_monster_",
                           "blue_monster_"),
        enemyCount = 8,
        barrierCount = 50;

    document.onkeydown = handleKey;
    /* game elements */
    playground = new Playground(playgroundX, playgroundY, playgroundField);
    playground.init();
    playground.addFinish(finishX, finishY);

    gameConsole = new GameConsole();
    gameConsole.init();
    
    hero = new Character("main", heroX, heroY, heroImage);
    hero.init();


    enemies = new Array();
    for (var i = 0; i < enemyCount; i++)
    {
        var newX = Math.round((Math.random() * 1000) % (playgroundX - 1)) + 1;
        var newY = Math.round((Math.random() * 1000) % (playgroundY - 1)) + 1;
        var randomImage = Math.round((Math.random() * 1000)) % enemyImages.length;
        enemies.push(new Enemy(enemyNames[randomImage] + i, newX, newY, enemyImages[randomImage]));
    }
    
    for (var i = 0; i < enemies.length; i++)
        enemies[i].init();

    barriers = new Array();
    for (var i = 0; i < barrierCount; i++)
    {
        var newX  = Math.round((Math.random() * 1000) % (playgroundX - 1)) + 1;
        var newY  = Math.round((Math.random() * 1000) % (playgroundY - 1)) + 1;
        barriers.push(new Barrier("table_" + i, newX, newY, barrierSize, barrierSize, "images/table.gif", true));
    }

    for (var i = 0; i < barriers.length; i++)
        barriers[i].init();

    //playground.print();
}

window.onload = initGame;
