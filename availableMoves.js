//If there is no possible path for the snake to go to a piece of food, this function will return it a safe move to make if possible.
//Changed availableMoves to make its judgement based on walls from the grid, instead of open squares beside it.
//The reason for this change is
//  1. More efficient
//  2. There are now walls that aren't really walls. What I'm referring to is the artificial walls created by avoiding head collision. 
//     So now we want to base Steve's available moves off of the walls determined in the grid.s 
function availableMoves(gameState, grid){
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
  
    if(right == true){
      if(grid[gameState.you.body[0].x + 1][gameState.you.body[0].y].wall === true){
        right = false;
      }
    }
    if(left == true){
      if(grid[gameState.you.body[0].x - 1][gameState.you.body[0].y].wall === true){
        left = false;
      }
    }
    if(up == true){
      if(grid[gameState.you.body[0].x][gameState.you.body[0].y + 1].wall === true){
        up = false;
        // console.log(grid[gameState.you.body[0].x][gameState.you.body[0].y + 1].i)
        // console.log(grid[gameState.you.body[0].x][gameState.you.body[0].y + 1].i)
      }
    }
    if(down == true){
      if(grid[gameState.you.body[0].x][gameState.you.body[0].y - 1].wall === true){
        down = false;
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