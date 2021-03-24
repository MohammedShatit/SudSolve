//Solving and Checking Algorithms file

//checking if a number repeats in a row from a passed grid
function notInRow(board, row) {
    let set = {} //a set to keep track of the numbers that appear in the row

    for(let i=0; i < 9; i++){ //looping through every box of a row
        if(board[row][i] in set){
            return false;
        }
        if(board[row][i] !== 0 ){
            set[(board[row][i])] = board[row][i]; //add number to set if not zero (blank)
        }
    }
    return true; //return true if there is no number repeating
}

//checking if a number repeats in a column from a passed grid
function notInCol(board, col) {
    let set = {}

    for(let i=0; i < 9; i++){ //looping through every box of a column
        if(board[i][col] in set){
            return false;
        }
        if(board[i][col] !== 0 ){
            set[board[i][col]] = board[i][col]; //add number to set if not zero (blank)
        }
    }
    return true; //return true if there is no number repeating
}

//checking if a number repeats in a 3*3 block from a passed grid
function notInBox(board, row, col){
    let set = {}
    for(let i=0; i<3; i++){ //looping through every box of a block
        for(let j=0; j<3; j++){
            let curr = board[i + row][j + col];

            if(curr in set){
                return false;
            }
            if(curr !== 0 ){
                set[curr] = curr;
            }
        }
    }
    return true; //return true if there is no number repeating
}

function isValid(board, row, col) {
    let valid = notInRow(board, row) && notInCol(board, col) && notInBox(board, row - row % 3, col - col % 3); //calling 3 separate functions and return true if no number is repeating
                                                                                                            //in a row, column, or a 3*3 block of the grid
    return valid;
}

//a function to check if a provided grid is valid (o numbers repeating in the original grid)
function valid_board(board) {
    for(let i=0; i < 9; i++){ //looping through 9 rows
        for(let j=0; j < 9; j++){ //looping through 9 columns
            if(!(isValid(board, i, j))){ //pass the board and number of row and column to check
                return false;
            }
        }
    }
    return true;
}

//a function to check if a number can be inputed to solve the grid
function possible(board, y , x, n) {
    for(let i = 0; i < 9; i++){ //looping through the 9 boxes of a column
        if(board[y][i] == n){
            return false;
        }
    }
    for(let i = 0; i < 9; i++){
        if(board[i][x] == n){ //looping through the 9 boxes of a row
            return false;
        }
    }
    //making the 3*3 blocks
    const xs = Math.floor(x/3) * 3; 
    const ys = Math.floor(y/3) * 3;
    
    for(let i = 0; i < 3; i++){ //looping through the 9 3*3 boxes of the grid
        for(let j = 0; j < 3;j++){
            if(board[ys + i][xs + j] == n){
                return false;
            }
        }
    }
    return true;
}

//solving algorithm
function solve(data) {
    for(let y = 0; y < 9; y++){ 
        for(let x = 0; x < 9; x++){ //loop through the whole grid
            if(data[y][x] == 0){ //if a value in the grid is zero (blank)
                for(let n = 1; n < 10; n++){ //loop through 1 to 9
                    if(possible(data, y, x, n)){ //check if each number is possible to be inserted
                        data[y][x] = n; //set value to correct number
                        if(solve(data)){ //recurssion: call the function again and pass the so far solved grid
                            return true;
                        } else {
                            data[y][x] = 0; //backtrack if the algorithm is stuck and cannot solve
                        }
                    }
                }
                return false;
            }
        }
    }
    return true;
}