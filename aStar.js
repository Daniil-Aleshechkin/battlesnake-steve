//This function calculates the shortest manhatten distance between the snakes head and all pieces of food on the board.
function shortestManhattenDistance(gameState,nearestFoods){
    var shortestMHD;
    var shortestMHDIndex;
    for(var i = 0; i < gameState.board.food.length; i++){
        var MHD;
        MHD = Math.abs(gameState.board.food[i].x - gameState.you.body[0].x) + Math.abs(gameState.board.food[i].y - gameState.you.body[0].y);
        if (nearestFoods.length >1) {
          MHD += Math.abs(nearestFoods[i][0].x-nearestFoods[i][1].x) + Math.abs(nearestFoods[i][0].y-nearestFoods[i][1].y);
        }
        if(i === 0){
            shortestMHDIndex = i;
            shortestMHD = MHD;
        } else {
            if(MHD < shortestMHD){
                shortestMHD = MHD;
                shortestMHDIndex = i;
            }
        }
    }
    return shortestMHDIndex;
  }

//This function uses A* pathfinding to find the best possible path to the closest piece of food.
function foodPathing(gameState, grid, nearestFoods){
    var foodIndex = shortestManhattenDistance(gameState,nearestFoods);
    var openSet = [];
    var closedSet = [];
    var path;
  
    var start = grid[gameState.you.body[0].x][gameState.you.body[0].y];
    var end = grid[gameState.board.food[foodIndex].x][gameState.board.food[foodIndex].y];
  
    openSet.push(start);
  
    function heuristic(a,b){
      var d = Math.abs(b.i - a.i) + Math.abs(b.j - a.j);
      return d;
    }
  
    //Simple function to remove an element from an array.
    function removeFromArray(arr, element){
      for(var i = arr.length - 1; i >= 0; i--){
        if(arr[i] == element){
          arr.splice(i, 1);
        }
      }
    }
  
    while(openSet.length > 0) {
  
      var lowestIndex = 0;
      for(var i = 0; i < openSet.length; i++){
        if (openSet[i].f < openSet[lowestIndex].f){
          lowestIndex = i;
        }
      }
      var current = openSet[lowestIndex];
  
      if(openSet[lowestIndex] === end){
        path = [];
        var temp = current;
        path.push(temp);
        while(temp.previous){
          path.push(temp.previous);
          temp = temp.previous;
        }
        if(path[path.length-1].i - path[path.length-2].i == -1){
          return 'right';
        }
        if(path[path.length-1].i - path[path.length-2].i == 1){
          return 'left';
        }
        if(path[path.length-1].j - path[path.length-2].j == -1){
          return 'up';
        }
        if(path[path.length-1].j - path[path.length-2].j == 1){
          return 'down';          
        }
      }
  
      removeFromArray(openSet, current);
      closedSet.push(current);
  
      var neighbours = current.neighbours;
      for(var i = 0; i < neighbours.length; i++){
        var neighbour = neighbours[i];
        if(!closedSet.includes(neighbour) && !neighbour.wall){
          var tempG = current.g + 1;
  
          if(openSet.includes(neighbour)){
            if(tempG < neighbour.g){
              neighbour.g = tempG;
            }
          }else{
            neighbour.g = tempG;
            openSet.push(neighbour);
          }
  
          neighbour.h = heuristic(neighbour, end);
          neighbour.f = neighbour.g + neighbour.h;
          neighbour.previous = current;
  
        }
      }
    }
    return "noPath";
  }

module.exports = {"aStar": foodPathing};
 