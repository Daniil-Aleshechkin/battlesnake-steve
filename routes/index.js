var express = require('express');
var router = express.Router();

/* BattleSnake code goes here */
router.get('/', function(req, res, next) {
  var battlesnakeInfo = {
    apiversion: '1',
    author: '',
    color: '#888888',
    head: 'default',
    tail: 'default'
  }
  response.status(200).json(battlesnakeInfo)

});

router.get('/', function(req, res, next) {
  var gameData = request.body

  console.log('START')
  response.status(200).send('ok')
});

router.get('/', function(req, res, next) {
  var gameData = request.body

  var possibleMoves = ['up', 'down', 'left', 'right']
  var move = possibleMoves[Math.floor(Math.random() * possibleMoves.length)]

  console.log('MOVE: ' + move)
  response.status(200).send({
    move: move
  })
});

router.get('/', function(req, res, next) {
  var gameData = request.body

  console.log('END')
  response.status(200).send('ok')
});

module.exports = router;
