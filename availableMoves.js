//If there is no possible path for the snake to go to a piece of food, this function will return it a safe move to make if possible.
function availableMoves(gameState){
    var left = true;
    var right = true;
    var up = true;
    var down = true;
    var numMoves = 0;
    var returnArr = ['up', numMoves, left, right, up, down];


    //If moving in any direction is off the board, make those directions false.
    if(gameState.you.body[0].x + 1 == gameState.board.width){
      right = false;
    } 
    if(gameState.you.body[0].x - 1 < 0){
      left = false;
    } 
    if(gameState.you.body[0].y + 1 == gameState.board.height){
      up = false;
    }
    if(gameState.you.body[0].y - 1 < 0){
      down = false;
    } 
  
    //If moving in any direction is onto yourself, make those directions false.
    if(right == true){
      for(var a = 0; a < gameState.you.body.length; a++){
        if((gameState.you.body[0].x + 1 === gameState.you.body[a].x) && (gameState.you.body[0].y === gameState.you.body[a].y)){
          right = false;
          break;
        }
      }
    }
    if(left == true){
      for(var a = 0; a < gameState.you.body.length; a++){
        if((gameState.you.body[0].x - 1 === gameState.you.body[a].x) && (gameState.you.body[0].y === gameState.you.body[a].y)){
          left = false;
          break;
        }
      }
    }
    if(up == true){
      for(var a = 0; a < gameState.you.body.length; a++){
        if((gameState.you.body[0].x === gameState.you.body[a].x) && (gameState.you.body[0].y + 1 === gameState.you.body[a].y)){
          up = false;
          break;
        }
      }
    }
    if(down == true){
      for(var a = 0; a < gameState.you.body.length; a++){
        if((gameState.you.body[0].x === gameState.you.body[a].x) && (gameState.you.body[0].y - 1 === gameState.you.body[a].y)){
          down = false;
          break;
        }
      }
    }
  
    //If moving in any direction is onto another snake, make those directions false.
    if(right == true){
      for(var a = 0; a < gameState.board.snakes.length; a++){
        for(var b = 0; b < gameState.board.snakes[a].body.length; b++){
          if((gameState.you.body[0].x + 1 === gameState.board.snakes[a].body[b].x) && (gameState.you.body[0].y === gameState.board.snakes[a].body[b].y)){
            right = false;
            break;
          }
        }
      }
    }
    if(left == true){
      for(var a = 0; a < gameState.board.snakes.length; a++){
        for(var b = 0; b < gameState.board.snakes[a].body.length; b++){
          if((gameState.you.body[0].x - 1 === gameState.board.snakes[a].body[b].x) && (gameState.you.body[0].y === gameState.board.snakes[a].body[b].y)){
            left = false;
            break;
          }
        }
      }
    }
    if(up == true){
      for(var a = 0; a < gameState.board.snakes.length; a++){
        for(var b = 0; b < gameState.board.snakes[a].body.length; b++){
          if((gameState.you.body[0].x === gameState.board.snakes[a].body[b].x) && (gameState.you.body[0].y + 1 === gameState.board.snakes[a].body[b].y)){
            up = false;
            break;
          }
        }
      }
    }
    if(down == true){
      for(var a = 0; a < gameState.board.snakes.length; a++){
        for(var b = 0; b < gameState.board.snakes[a].body.length; b++){
          if((gameState.you.body[0].x === gameState.board.snakes[a].body[b].x) && (gameState.you.body[0].y - 1 === gameState.board.snakes[a].body[b].y)){
            down = false;
            break;
          }
        }
      }
    }

    if(right == true){numMoves++}
    if(left == true){numMoves++}
    if(up == true){numMoves++}
    if(down == true){numMoves++}
    
    if(right == true){returnArr = ['right', numMoves, left, right, up, down]; return returnArr}
    if(left == true){returnArr = ['left', numMoves, left, right, up, down]; return returnArr}
    if(up == true){returnArr = ['up', numMoves, left, right, up, down]; return returnArr}
    if(down == true){returnArr = ['down', numMoves, left, right, up, down]; return returnArr}
    return returnArr;
  }
  
module.exports = {"possibleMoves": availableMoves};  