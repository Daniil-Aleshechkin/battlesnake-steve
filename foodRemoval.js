//Remove a piece of food from the array of food if it is considered to be on a wall tile. 
//This occurs when Steves health is less than an enemies health, and that enemy is beside a piece food.
function removeFromArray(arr, element){
    for(var i = arr.length - 1; i >= 0; i--){
      if(arr[i].x == element.x && arr[i].y == element.y){
        arr.splice(i, 1);
      }
    }
  }

function removeFood(gameState, grid){
    for(var i = 0; i < gameState.board.food.length; i++){
        if(grid[gameState.board.food[i].x][gameState.board.food[i].y].wall == true){
          removeFromArray(gameState.board.food, gameState.board.food[i]);
        }
      }
      console.log(gameState.board.food)
      return gameState.board.food;
}

module.exports = {"removeFood": removeFood};
