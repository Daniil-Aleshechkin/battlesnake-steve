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

  // var possibleMoves = ['up', 'down', 'left', 'right']
  // var move = possibleMoves[3]

  var move = aStar.aStar(gameData);

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

