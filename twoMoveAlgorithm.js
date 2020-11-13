
//movesArray is an array of ['move', number of moves, left(false/true), right(false/true), up(false/true), down(false/true)]

function twoMoveAlgoritm(gameState, grid, moveArray){
    //Open squares in each direction.
    var openSquaresLeft = 0;
    var openSquaresRight = 0;
    var openSquaresUp = 0;
    var openSquaresDown = 0;
    var openSquaresArr = [];

    var move = 'error';

    var headX = gameState.you.body[0].x;
    var headY = gameState.you.body[0].y;

    //If the snake moving left is an option, calculate the squares in that direction.
    if(moveArray[2]){
        if(grid[headX-1][headY].counted == false){openSquaresLeft++; grid[headX-1][headY].counted = true};
        let maxSquares = gameState.you.body.length
        
        openSquaresLeft += countSquares(headX-1, headY, grid, maxSquares);
        console.log('Two Move: Left Checked, and squares found = '+openSquaresLeft);
        if(openSquaresLeft === 0 && moveArray[1] === 2){
            return 'useAStar';
        }
    }

    //If the snake moving right is an option, calculate the squares in that direction.
    if(moveArray[3]){
        if(grid[headX+1][headY].counted == false){openSquaresRight++; grid[headX+1][headY].counted = true};
        let maxSquares = gameState.you.body.length
        openSquaresRight += countSquares(headX+1, headY, grid, maxSquares);
        console.log('Two Move: Right Checked , and squares found = '+openSquaresRight);
        if(openSquaresRight === 0 && moveArray[1] === 2){
            return 'useAStar';
        }
    }

    //If the snake moving up is an option, calculate the squares in that direction.
    if(moveArray[4]){
        if(grid[headX][headY+1].counted == false){openSquaresUp++; grid[headX][headY+1].counted = true};
        let maxSquares = gameState.you.body.length
        openSquaresUp += countSquares(headX, headY+1, grid, maxSquares);
        console.log('Two Move: Up Checked, and squares found = '+openSquaresUp);
        if(openSquaresUp === 0 && moveArray[1] === 2){
            return 'useAStar';
        }
    }

        //If the snake moving down is an option, calculate the squares in that direction.
    if(moveArray[5]){     
        if(grid[headX][headY-1].counted == false){openSquaresDown++; grid[headX][headY-1].counted = true};
        let maxSquares = gameState.you.body.length
        openSquaresDown += countSquares(headX, headY-1, grid,maxSquares);
        console.log('Two Move: Down Checked, and squares found = '+openSquaresDown);
        if(openSquaresDown === 0 && moveArray[1] === 2){
            return 'useAStar';
        }
    }

    openSquaresArr = [openSquaresLeft, openSquaresRight, openSquaresUp, openSquaresDown];

    if(openSquaresLeft != 0 && openSquaresRight === 0 && openSquaresUp === 0 && openSquaresDown === 0){
        return 'useAStar';
    }
    if(openSquaresLeft === 0 && openSquaresRight != 0 && openSquaresUp === 0 && openSquaresDown === 0){
        return 'useAStar';
    }
    if(openSquaresLeft === 0 && openSquaresRight === 0 && openSquaresUp != 0 && openSquaresDown === 0){
        return 'useAStar';
    }
    if(openSquaresLeft === 0 && openSquaresRight === 0 && openSquaresUp === 0 && openSquaresDown != 0){
        return 'useAStar';
    }

    var mostSquares = openSquaresArr[0];
    var needsAStar = true
    console.log('Most Squares: '+mostSquares);
    for(var z = 0; z < openSquaresArr.length - 1; z++){
        if((openSquaresArr[z] < openSquaresArr[z+1]) && (openSquaresArr[z+1] > mostSquares)){
            mostSquares = openSquaresArr[z+1];
        }
    }
    //Additional check to see if it does not matter what open is chosen
    for (var z = 0; z < openSquaresArr.length; z++) {
        if (openSquaresArr[z] != mostSquares && openSquaresArr[z] != 0) {
            needsAStar = false
        }
    }
    if (needsAStar) {
        return 'useAStar'
    }
    
    console.log('Most Squares: '+mostSquares);
    if(mostSquares === openSquaresLeft){
        return 'left';
    }
    if(mostSquares === openSquaresRight){
        return 'right';
    }
    if(mostSquares === openSquaresUp){
        return 'up';
    }
    if(mostSquares === openSquaresDown){
        return 'down';
    }

    return move;

}

function countSquares(x, y, grid, maxSquares){
    var squareCount = 0;
    for(var a = 0; a < grid[x][y].neighbours.length; a++){
        if((grid[x][y].neighbours[a].wall === false) && (grid[x][y].neighbours[a].counted === false)){
            squareCount++;
            grid[x][y].neighbours[a].counted = true;
            squareCount += countSquares(grid[x][y].neighbours[a].i, grid[x][y].neighbours[a].j, grid);
            if (squareCount>=(2*maxSquares)) {return maxSquares}
        }
    }
    return squareCount;
}

module.exports = {"algorithm": twoMoveAlgoritm};