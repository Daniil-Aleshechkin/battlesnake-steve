const bodyParser = require('body-parser')
const express = require('express')

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
  
  //This logs the closest food (in terms of manhatten distance, not euclidian)
  console.log(shortestManhattenDistance(gameData.board.food, gameData.you.body[0].x, gameData.you.body[0].y));
  var possibleMoves = ['up', 'down', 'left', 'right']
  var move = possibleMoves[3]

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

//This function calculates the shortest manhatten distance between the snakes head and all pieces of food on the board.
//NOTE:This function currently does not take into account that there may be walls(enemy snakes) between the snake and the pieces of food.
function shortestManhattenDistance(foodArray, yourHeadX, yourHeadY){
  var shortestMHD;
  for(var i = 0; i < foodArray.length; i++){
      var MHD;
      MHD = Math.abs(foodArray[i].x - yourHeadX) + Math.abs(foodArray[i].y - yourHeadY);
      if(i === 0){
          shortestMHDIndex = i;
          shortestMHD = MHD;
      } else {
          if(MHD < shortestMHD){
              shortestMHD = MHD;
          }
      }
  }
  return shortestMHD;
}