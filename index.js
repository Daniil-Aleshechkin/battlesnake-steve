const bodyParser = require('body-parser')
const express = require('express')
const aStar = require('./aStar.js')
const availableMoves = require('./availableMoves')
const twoMoveAlgorithm = require('./twoMoveAlgorithm')
const kdTree = require("./kdTree")
const { kdTreeRemoveElem, buildKDTree } = require('./kdTree')
const lastResortMove = require('./lastResortMove')
const foodRemoval = require('./foodRemoval')

const PORT = process.env.PORT || 3000

const app = express()
app.use(bodyParser.json())

app.get('/', handleIndex)
app.post('/start', handleStart)
app.post('/move', handleMove)
app.post('/end', handleEnd)

app.listen(PORT, () => console.log(`Battlesnake Server listening at http://127.0.0.1:${PORT}`))

function handleIndex(request, response) {
  var battlesnakeInfo = {
    apiversion: '1',
    author: 'Daniil Aleshechkin, Adam Metz',
    color: '#7EC0EE',
    head: 'pixel',
    tail: 'pixel'
  }
  response.status(200).json(battlesnakeInfo)
}

function handleStart(request, response) {
  var gameData = request.body

  console.log('START')
  response.status(200).send('ok')
}

function handleMove(request, response) {
  var gameData = request.body
  var move;

  console.log('Current move #: '+gameData.turn);
  var grid = generateGrid(gameData);

  //Remove a piece of food from the array of food if it is considered to be on a wall tile. 
  //This occurs when Steves health is less than an enemies health, and that enemy is beside a piece food.
  for(var x = 0; x < gameData.board.snakes.length; x++){
    if((gameData.board.snakes[x].length >= gameData.you.body.length) && (gameData.board.snakes[x].id != gameData.you.id)){
      gameData.board.food = foodRemoval.removeFood(gameData, grid);
      console.log('bruh')
    }
  }
  

  console.log(gameData.board.food)

  
  //movesArray is an array of ['move', number of moves, left(false/true), right(false/true), up(false/true), down(false/true)]
  var movesArray = availableMoves.possibleMoves(gameData, grid);
  //genarate an array of the nearest paths of food
  if (gameData.board.food.length > 1)
    var nearestFoods = generateFoods(gameData);
  else {
    var nearestFoods = null
  }

  //When Steve has two or three moves, we want to use the 'two move' algorithm. This algorithm checks all the available squares for each move, if necessary.
  //Note: Steves priority is always moving where there are more squares. Even if food is right beside him, 'two move' algorithm has the highest precedence.
  if(movesArray[1] === 2 || movesArray[1] === 3){
    //two move algorithm
    console.log('Two Move Algorithm');

    move = twoMoveAlgorithm.algorithm(gameData, grid, movesArray);
    //If the 'two move' algorithm determines that multiple moves are acceptable, A* pathfinding will be used.
    if(move == 'useAStar'){
      console.log('Two Move not necessary, use AStar');
      move = aStar.aStar(gameData, grid,nearestFoods);
      //If A* pathfinding finds no possible path to the piece of food it is checking, it will return no path and make a last resort move.
      //Last resort move simply just looks at what moves wont kill Steve on the next move, and makes a move from whatever choices it has.
      if(move == 'noPath'){
        console.log('A* Algorithm No Path');
        movesArray = lastResortMove.lastResort(gameData);
        move = movesArray[0];
      }
    }

    //On the first move, Steve has 4 possible moves. He will go directly to using A* pathfinding.
  } else if (movesArray[1] === 4){
    console.log('A* Algorithm');
    move = aStar.aStar(gameData, grid,nearestFoods);
    if(move == 'noPath'){
      console.log('A* Algorithm No Path');
      movesArray = lastResortMove.lastResort(gameData);
      move = movesArray[0];
    }

    //If Steve has 1 move, determined by availableMoves, he will use the only move determined by availableMoves.
  } else if(movesArray[1] === 1){
    console.log('One Move');
    move = movesArray[0];
    
    //If Steve has no moves according to availableMoves, he will then use whatever move lastResortMove determines.
    //Sometimes Steve might have a move even though availableMoves says he doesn't. This is because availableMoves considers walls that aren't really there (which is intended)
    //The walls 'that arent really there' are the walls created by a snake having more health than Steve, and surrounding that snakes head are walls 'that arent really there'.
  } else {
    console.log('One Move secondary');
    movesArray = lastResortMove.lastResort(gameData);
      move = movesArray[0];
  }

  console.log('MOVE: ' + move)
  response.status(200).send({
    move: move
  })
}

function handleEnd(request, response) {
  var gameData = request.body
  console.log('END')
  response.status(200).send('ok')
}

function generateGrid(gameState){
  const cols = gameState.board.width;
  const rows = gameState.board.height;
  var grid = new Array(cols);

  //Creating the grid.
  for(var i = 0; i < cols; i++){
    grid[i] = new Array(rows);
  }

  //Data for each node.
  function Spot(i, j){
    this.f = 0;
    this.g = 0;
    this.h = 0;
    this.i = i;
    this.j = j;
    this.neighbours = [];
    this.nearestFood = null;
    this.previous = undefined;
    this.wall = false;
    this.counted = false;

    //Is this.food ever used?
    this.food = null

    this.foodPiece = false;
    
    //If the node is either an enemy snake, or its own body, count as a wall.
    
    this.addNeighbours = function(grid){
      if(i < cols - 1) {
        this.neighbours.push(grid[this.i+1][j])
      }
      if(i > 0) {
        this.neighbours.push(grid[this.i-1][j])
      }
      if(j < rows - 1) {
        this.neighbours.push(grid[this.i][j+1])
      }
      if(j > 0) {
        this.neighbours.push(grid[this.i][j-1])
      }
    }
  }

  //Each node is created in a grid.
  for(var i = 0; i < cols; i++){
    for(var j = 0; j < rows; j++){
      grid[i][j] = new Spot(i, j);
    }
  }


  //Surrounding nodes are collected for each node.
  for(var i = 0; i < cols; i++){
    for(var j = 0; j < rows; j++){
      grid[i][j].addNeighbours(grid);
    }
  }

  //Grid spots which are occupied by Steve, are set as walls
  for(var x = 0; x < gameState.you.body.length; x++){
    grid[gameState.you.body[x].x][gameState.you.body[x].y].wall = true
  }

  //Grid spots which are occupied by enemy snakes, are set as walls
  for(var x = 0; x < gameState.board.snakes.length; x++){
    for(var y = 0; y < gameState.board.snakes[x].body.length; y++){
        grid[gameState.board.snakes[x].body[y].x][gameState.board.snakes[x].body[y].y].wall = true;
        //If.... 1. The head is being checked. 
        //       2. The snakes health is greater than or equal to yours. 
        //       3. The snake being checked is not steve himself.
        if (y === 0 && (gameState.board.snakes[x].length >= gameState.you.body.length) && (gameState.board.snakes[x].id != gameState.you.id)) {
          //Changed below for statement from i < 4, because if the enemy snake is at the border, they do not have 4 neighbours. 
          for (var i = 0; i < grid[gameState.board.snakes[x].body[0].x][gameState.board.snakes[x].body[0].y].neighbours.length; i++) {
            grid[gameState.board.snakes[x].body[0].x][gameState.board.snakes[x].body[0].y].neighbours[i].wall = true;
         }
      }     
    }
  }

  return grid;
}

function generateFoods(gameData) {
  var nearestFoods = []
  for(let i = 0; i < gameData.board.food.length; i++) {
    let tree = kdTree.buildKDTree(gameData.board.food)
    kdTreeRemoveElem(tree,gameData.board.food[i])
    let nearestFood = kdTree.kdTreeClostestPoint(tree,[gameData.board.food[i].x,gameData.board.food[i].y])
    //console.log(`NEAREST ${gameData.board.food[i].x}, ${gameData.board.food[i].y} IS ${nearestFood.x}, ${nearestFood.y}`)
    nearestFoods.push([nearestFood,gameData.board.food[i]])
  }

  return nearestFoods
}