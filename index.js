const bodyParser = require('body-parser')
const express = require('express')
const aStar = require('./aStar.js')
const noPathMove = require('./noPathMove')

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
    author: 'Daniil',
    color: '#888888',
    head: 'default',
    tail: 'default'
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

  // var possibleMoves = ['up', 'down', 'left', 'right']
  // var move = possibleMoves[3]
  var grid = generateGrid(gameData);
  var move = aStar.aStar(gameData, grid);

  //If there is no possible path between the snake and the food, then just move right. Eventually will add a 
  //function to handle a move here. Likely just move wherever there is no snake(if applicable).
  if(move == 'noPath'){
    move = noPathMove.noPath(gameData);
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
  var cols = gameState.board.width;
    var rows = gameState.board.height;
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
      this.previous = undefined;
      this.wall = false;
  
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
  return grid;
}
