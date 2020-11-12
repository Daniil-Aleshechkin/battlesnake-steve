//Returns the manhatten distance between two spots
//spot1 -> List[Int] : The first spot to calculate the distance
//spot2 -> List[Int] : The second spot to calculate the distance
function manhattenDistance(point1,point2) {
    return Math.abs(point1[0]-point2[0])+Math.abs(point1[0]-point2[0])
}


//Returns the axis of the food
//food -> Spot : The food point to search
//axis -> Int : The axis to return with 0 being x and 1 being y
function getAxis(food,axis) {
    if (axis === 0) {
        return food.x
    } else {
        return food.y
    }
}

//Returns a KD-Tree of the food
//food -> List[Spot] : An array of all the food to be built
//depth -> Int : The depth of the layer of the KD-Tree
function buildKDTree(food,depth=0) {
    let len = food.length
    if (len <=0) {
        return null
    }

    let axis = depth % 2
    let sortedFood = food.sort((a,b)=>getAxis(a,axis)-getAxis(b,axis))

    return  {
                left : buildKDTree(sortedFood.slice(0,Math.floor(len/2)),depth),
                spot : sortedFood[Math.floor(len/2)],
                right : buildKDTree(sortedFood.slice(Math.floor(len/2)+1),depth)
            }

}

function distance(p1,p2) {
    var dx = p1[0]-p2[0]
    var dy = p1[1]-p2[1]

    return Math.abs(dx)+Math.abs(dy)
}


//Returns the nearest point of from a given KD-Tree
//root -> KD-Tree[Spot] : The KD-Tree to search the food
//point -> List[Int] : The point to search the tree
//depth -> Int : The depth of the KD-Tree 
function kdTreeClostestPoint(root,point,depth=0) {
    if (root == null) {
        return null
    }
    let axis = depth % 2

    let nextBranch = null
    let oppositeBranch = null

    //Binary search the first candidate
    if (point[axis] < getAxis(root.spot,axis)) {
        nextBranch = root.left
        oppositeBranch = root.right
    } else {
        nextBranch = root.right
        oppositeBranch = root.left
    }

    let best = closerToPivot(point,kdTreeClostestPoint(nextBranch,point,depth+1),root.spot)
    if (distance(point,[best.i,best.j])> Math.abs(point[axis]-getAxis(root.spot,axis))) {
        best = closerToPivot(point,kdTreeClostestPoint(oppositeBranch,point,depth+1),best)
    }
    
    return best
}

//Returns the distance closest to a pivot
//pivot -> List[Int] : The pivot to compare the food
//spot1 -> {x:,y:} : The first spot to compare
//spot2 -> {x:,y:} : The second spot to compare
function closerToPivot(pivot,spot1,spot2) {
    if (spot1 == null) {
        return spot2
    }
    if (spot2 == null) {
        return spot1
    }
    let md1 = manhattenDistance(pivot,[spot1.x,spot1.y])
    let md2 = manhattenDistance(pivot,[spot2.x,spot2.y])

    if (md1 < md2) {
        return spot1
    } else {
        return spot2
    }
}

//Return the minimun of 3 points according to an axis
//p1 -> {x:,y:} : First point to compare
//p2 -> {x:,y:} : Second point to compare
//p3 -> {x:,y:} : Third point to compare
//axis -> Int : Axis to comapare the points
function minimun (p1,p2,p3,axis) {
    if (p1 == null) {
        var d1 = Infinity
    } else {
        var d1 = getAxis(p1,axis)
    }
    if (p2 == null) {
        var d2 = Infinity
    } else {
        var d2 = getAxis(p2,axis)
    }

    let d3 = getAxis(p3,axis)

    if (d1>d2) {
        if (d2 > d3) {
            return p3
        } else {
            return p2
        }
    } else {
        if (d1 > d3) {
            return p3
        } else {
            return p1
        }
    }
}


//Find the smallest elem from an axis in a KD-tree
//root -> KD-Tree[axis] : KD-Tree to search
//axis -> Int : axis to compare
//depth -> Int : depth of the KD-Tree
function findMin(root,axis,depth=0) {
    if(root == null) {
        return null
    }
    if (axis == depth%2) {
        //Check one branch
        if (root.left == null) {
            return root.spot
        } else {
            return findMin(root.left,axis,depth+1)
        }
    } else {
        //Check both branches
        return minimun(findMin(root.left,axis,depth+1),findMin(root.left,axis,depth+1),root.spot,axis)
    }
}

//Removes a spot from a KD-tree
//root -> KD-Tree[Spot] : Base KD-Tree
//spot -> {x:,y:} : Food to remove
//depth -> Int : Depth of the Kd-Tree
function kdTreeRemoveElem(root,spot,depth=0) {
    if (root == null) {
        return null
    }

    let axis = depth%2
    if (root.spot == spot) {
        //Spot is found
        if (root.right != null) { // Replace the spot with the min from the tree
            root.spot = findMin(root,axis,depth)
            root.right = kdTreeRemoveElem(root.right,spot,depth+1)
        } else if (root.left != null) {
            root.spot = findMin(root,axis,depth)
            root.right = kdTreeRemoveElem(root.left,spot,depth+1)
        } else {
            root = null //At a leaf so replace with null
        }
    } else if (getAxis(root.spot,axis)>getAxis(spot,axis)) {
        root.left = kdTreeRemoveElem(root.left,spot,depth+1) // Continue searching if spot not found
    } else {
        root.right = kdTreeRemoveElem(root.right,spot,depth+1)
    }
    return root
}


module.exports = {buildKDTree : buildKDTree, kdTreeClostestPoint : kdTreeClostestPoint, kdTreeRemoveElem : kdTreeRemoveElem}
