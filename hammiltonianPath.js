function generateBasePath(grid,gameState,avaibleMoves) {
    for(let i = 0; i < avaibleMoves.length; i++) {
        path = aStarToPoint(grid,[gameState.you.body[0].x,gameState.you.body[0].y],[avaibleMoves[i].x,avaibleMoves[i].y])
        if (path != []) {
            return path
        }
    }
    return path
}

function followPath (path,gameState) {
    for (let i = 0; i < path.length; i++) {
        if (i==path.length-1) { //quick and dirty sol to looping the path
            i=-1   
        }
        if (path[i][0]==gameState.you.body[0].x&&path[i][1]==gameState.you.body[0].y) { //find the location on the path
            //make a move based on a genarated path
            if (path[i+1][0]-gameState.you.body[0].x==-1) {
                return "left"
            }
            if (path[i+1][0]-gameState.you.body[0].x==1) {
                return "right"
            }
            if (path[i+1][1]-gameState.you.body[0].y==1) {
                return "up"
            }
            if (path[i+1][1]-gameState.you.body[0].y==-1) {
                return "down"
            }
        }
    }
}

function generatePath(grid,gameState,avaibleMoves) {
    var path = generateBasePath(grid,gameState) //makes the first base of the path maybe not needed and the logic would be the same if we just push the your location to the path
    if (path === []) {
        return path
    }

    while (path.length < gameState.you.body.length) { // builds the path to the derised length
        for (let i = 0; i < path.length-1; i++) {
            let neighboors = grid[path[i][0]][path[i][1]].neighboors
            let addedPath = []
            for (let j = 0; i < neighboors.length; j++) {
                if (neighboors[j].age < hCost([gameState.you.body[0].x,gameState.you.body[1].y],[neighboors[j].x,neighboors[j].y])) {
                    addedPath = aStarToPoint(grid,[neighboors[j].x],neighboors[j].y,path[i+1]) // Get a possible move and pathfind back to the path
                }
                if (addedPath != []) {
                    break //If a path is found stop looking
                }
            }
            if (addedPath != []) {
                for (let j = 0; j < addedPath.length; j++) {
                    path.splice(i, 0, addedPath[j])//insert the new path might be a bug if the path is backwards
                    grid[addedPath[j][0]][addedPath[j][1]].wall = true//treat the path as an uncrossable wall
                    grid[addedPath[j][0]][addedPath[j][1]].age = Infinity
                }
                break //Restart with the new path
            }
        }

    }
    return path
}

//implementation of A star but accounting for the ages of the paths
function aStarToPoint(grid,pointA,pointB) {
    var open = []
    var closed = []

    open.push(grid[pointA[0][pointA[1]]])
    
    var lowestFCost = 0
    for (let i = 0; i < open.length; i++) {
        if (open[lowestFCost] > open[i]) {
            lowestFCost = i
        }
    }
    var current = open[lowestFCost]
    
    open.splice(lowestFCost,1)
    closed.push(current)
    
    while (open.length > 0) {
        if (current.x===pointB[0] && current.y === pointB[1]) {
            var path = []
            var pathPoint = current
            
            path.push(pathPoint)
            while (pathPoint.previous) {
                pathPoint = pathPoint.previous
                path.push(pathPoint)
            }

            return path
        }

        var neighboors = current.neighboors

        for (let i = 0; i < neighboors.length; i++) {
            if (!closed.includes(neighboors[i]) && !(neighboors[i].wall && neighboors[i].age > hCost([neighboors[i].x,neighboors[i].y],pointA))) { //accounting for the ages
                var neighboorG = current.g + 1

                if (open.includes(neighboors[i])) {
                    if (neighboorG < neighboors[i].g) {
                        neighboors[i].g = neighboorG
                    }
                } else {
                    neighboors[i].g = neighboorG
                    open.push(neighboors[i])
                }
                
                neighboors[i].h = hCost([neighboors[i].x,neighboors[i].y],pointB)
                neighboors[i].f = neighboors[i].h + neighboors[i].g
                neighboors[i].previous = current
            }

        }
    }
    return []
}

function hCost(pointA,pointB) {
    return Math.abs(pointA[0]-pointB[0])+Math.abs(pointA[1]-pointB[1])
}

function updatePath(path,grid) {
    //Hide the path from path finding
    for (let i = 0; i <path.length;i++) {
        grid[path[i][0]][path[i][1]].wall = true
        grid[path[i][0]][path[i][1]].age = Infinity
    }

    for(let i = 0;i < path.length; i++) {
        if (i == path.length-1) {
            i = -1
        }
        if (grid[path[i][0]][path[i][1]].wall == true) {//find walls
            for (let j = i+1; j < path.length+i;j++) {
                if (j>=path.length) {
                    j -= path.length
                }
                if (grid[path[j][0]][path[j][1]].wall == false) {
                    appendPath = aStarToPoint(grid,path[i],path[j]) // find a path around the walls
                    if (appendPath.length+path.length>=path.length*2) { //Path is too long to be worth it/ generate a new one
                        return "path too long"
                    }
                    if (appendPath.length == 0) { //Path cannot be fixed/ generate a new one
                        return "path not found"
                    }
                    for (let k = 0; k < appendPath.length; k++) {
                        path.splice(i,0,appendPath[k])
                    }
                }
            }
        }
    }
}

module.exports = {generatePath : generatePath,followPath :followPath, updatePath :updatePath}