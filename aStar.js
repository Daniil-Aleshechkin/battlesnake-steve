//This function calculates the shortest manhatten distance between the snakes head and all pieces of food on the board.
function shortestManhattenDistance(gameState){
    var shortestMHD;
    var shortestMHDIndex;
    for(var i = 0; i < gameState.board.food.length; i++){
        var MHD;
        MHD = Math.abs(gameState.board.food[i].x - gameState.you.body[0].x) + Math.abs(gameState.board.food[i].y - gameState.you.body[0].y);
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
function foodPathing(gameState){
    var foodIndex = shortestManhattenDistance(gameState);
    var openSet = [];
    var closedSet = [];
    var path;
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
 