const bodyParser = require('body-parser')
const express = require('express')
const aStar = require('./aStar.js')
const availableMoves = require('./availableMoves')
const twoMoveAlgorithm = require('./twoMoveAlgorithm')
const kdTree = require("./kdTree")
const { kdTreeRemoveElem, buildKDTree } = require('./kdTree')

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
  console.log(gameData.board.food)

  console.log('START')
  response.status(200).send('ok')
}

function handleMove(request, response) {
  var gameData = request.body
  var move;

  console.log('Current move #: '+gameData.turn);
  var grid = generateGrid(gameData);
  //Generate all the nearest food
  for (let n = 0 ; n < gameData.board.food.length ; n++) {
    grid[gameData.board.food[n].x][gameData.board.food[n].y].obtainNearestFood(grid,gameData.board.food)
  }
  
  //movesArray is an array of ['move', number of moves, left(false/true), right(false/true), up(false/true), down(false/true)]
  var movesArray = availableMoves.possibleMoves(gameData);

  if(movesArray[1] === 2){
    //two move algorithm
    console.log('Two Move Algorithm');
    move = twoMoveAlgorithm.algorithm(gameData, grid, movesArray);
    if(move == 'useAStar'){
      console.log('Two Move not necessary, use AStar');
      move = aStar.aStar(gameData, grid);
      if(move == 'noPath'){
        console.log('A* Algorithm No Path');
        move = movesArray[0];
      }
    }

  } else if (movesArray[1] === 3 || movesArray[1] === 4){
    console.log('A* Algorithm');
    move = aStar.aStar(gameData, grid);
    if(move == 'noPath'){
      console.log('A* Algorithm No Path');
      move = movesArray[0];
    }

  } else {
    console.log('One Move');
    move = movesArray[0];
  }

  //If there is no possible path between the snake and the food, then just move right. Eventually will add a 
  //function to handle a move here. Likely just move wherever there is no snake(if applicable).
  // if(move == 'noPath'){
  //   move = noPathMove.noPath(gameData);
  // }

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
  const foodTree = buildKDTree(gameState.board.food)
  const cols = gameState.board.width;
  const rows = gameState.board.height;
  var grid = new Array(cols);
  console.log(foodTree)
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
    this.food = null
    
    //If the node is either an enemy snake, or its own body, count as a wall.
    for(var x = 0; x < gameState.you.body.length; x++){
      if(this.i === gameState.you.body[x].x && this.j ===  gameState.you.body[x].y){
        this.wall = true;
      }
    }
    for(var x = 0; x < gameState.board.snakes.length; x++){
      for(var y = 0; y < gameState.board.snakes[x].body.length; y++){
        if(this.i === gameState.board.snakes[x].body[y].x && this.j === gameState.board.snakes[x].body[y].y){
          this.wall = true;
        }
      }
    }
    this.obtainNearestFood  = function (foodTree) {
      console.log(this.food,"FOOD")
      let tree = kdTreeRemoveElem(foodTree,this.food)
      if (gameState.turn <3) {
        console.log(JSON.stringify(tree,null,4),"REMOVED")
      
      }
      this.nearestFood = kdTree.kdTreeClostestPoint(tree,[this.food.x,this.food.y])
      if (this.nearestFood != null) {
        console.log(`The nearest food of (${this.i}, ${this.j}) is (${this.nearestFood.x},${this.nearestFood.y})`)
      } else {
        console.log("Null")
      }
    }
    
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

  //Create the nearest food data for all food
  for(let i = 0; i < gameState.board.food.length; i++) {
    grid[gameState.board.food[i].x][gameState.board.food[i].y].food = gameState.board.food[i]
    grid[gameState.board.food[i].x][gameState.board.food[i].y].obtainNearestFood(foodTree)
  }

  //Surrounding nodes are collected for each node.
  for(var i = 0; i < cols; i++){
    for(var j = 0; j < rows; j++){
      grid[i][j].addNeighbours(grid);
    }
  }
  return grid;
}
