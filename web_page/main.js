//setting variables for necessary elements of the HTML
var solveBtn = document.getElementById("solve-btn");
var resetBtn = document.getElementById("reset-btn");
var generateBtn = document.getElementById("generate-btn");
var checkBtn = document.getElementById("check-btn");
var checkPlayBtn = document.getElementById("checkPlay-btn");
var box1 = document.getElementById("1");
var boxes = document.querySelectorAll('.input-box');
var easy = document.getElementById("easy");
var medium = document.getElementById("medium");
var hard = document.getElementById("hard");
var countdown = document.getElementById("countdown");
var status = document.getElementById("status");

//declare intevalid to zero
var intervalID = 0;
var grid = [[0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0]]; //default grid (empty)

/*generate button functions on click*/
generateBtn.addEventListener('click', ()=> {

    //resetting all box values and attributes to zero
    boxes.forEach(box => {
        box.value = "";
        box.removeAttribute("disabled");
        box.classList.remove("generated");
        box.classList.remove("solved");
    })

    //easy grid
    let easy = [[0,3,0,0,1,0,0,6,0],
    [7,5,0,0,3,0,0,4,8],
    [0,0,6,9,8,4,3,0,0],
    [0,0,3,0,0,0,8,0,0],
    [9,1,2,0,0,0,6,7,4],
    [0,0,4,0,0,0,5,0,0],
    [0,0,1,6,7,5,2,0,0],
    [6,8,0,0,9,0,0,1,5],
    [0,9,0,0,4,0,0,3,0]];

    //medium grid
    let medium = [[0,4,0,0,0,2,0,1,9],
    [0,0,0,3,5,1,0,8,6],
    [3,1,0,0,9,4,7,0,0],
    [0,9,4,0,0,0,0,0,7],
    [0,0,0,0,0,0,0,0,0],
    [2,0,0,0,0,0,8,9,0],
    [0,0,9,5,2,0,0,4,1],
    [4,2,0,1,6,9,0,0,0],
    [1,6,0,8,0,0,0,7,0]];

    //hard grid
    let hard = [[8,0,0,0,0,0,0,0,0],
    [0,0,3,6,0,0,0,0,0],
    [0,7,0,0,9,0,2,0,0],
    [0,5,0,0,0,7,0,0,0],
    [0,0,0,0,4,5,7,0,0],
    [0,0,0,1,0,0,0,3,0],
    [0,0,1,0,0,0,0,6,8],
    [0,0,8,5,0,0,0,1,0],
    [0,9,0,0,0,0,4,0,0]];

    //declare duration to zero
    let duration = 0;
    //checking which radio button is checked
    if(document.getElementById("easy").checked){
        grid = easy; //set grid to the corresponded one
        clearInterval(intervalID); //clear the interval if there is one before
        duration = 10; //set duration to 10 minutes
    }
    else if(document.getElementById("medium").checked) {
        grid = medium;
        clearInterval(intervalID);
        duration = 7;
    }
    else {
        grid = hard;
        clearInterval(intervalID);
        duration = 3;
    }

    startTimer(duration); //start counting down

    //declaring variables to keep track of boxes numbers
    let count = 0;
    let inner = 0;
    let outer = 0;
    boxes.forEach(box => {
        inner = count % 9;
        outer = Math.floor(count / 9);
        if(grid[outer][inner] !== 0){
            box.value = grid[outer][inner]; //set the box value to the corresponding value from the grid
            box.setAttribute("disabled", "disabled"); //disable the input box so the user cannot change the value
            box.classList.add("generated"); //add genearted classes for the boxes with the generated numbers
        }
        count++; //increment count to go to the next box
    })
})

/*solve button functions on click*/
solveBtn.addEventListener('click', ()=> {
    
    //declaring variables to keep track of boxes numbers
    let count = 0;
    let inner = 0;
    let outer = 0;
    boxes.forEach(box => { //copying the values from the input bboxes to a 2-dimensional array
        inner = count % 9;
        outer = Math.floor(count / 9);
        if(box.value === ""){
            grid[outer][inner] = 0; //set value to zero if the input box is empty
        } else {
            grid[outer][inner] = parseInt(box.value);
        }
        count++; //increment count to go to the next box
    })

    var t0 = performance.now() //setting a start timer for the solving algorithm
    if(valid_board(grid)){ //check if the grid provided by the user is solvable
        boxes.forEach(box=> {
            if(box.value === ""){ //check if the input box is empty
                box.setAttribute("disabled", "disabled"); //disable it
                box.classList.add("solved"); //add a solved class because it is going to get solved
            }
        })

        document.getElementById("status").innerHTML = "Solving..."; //let the user now the algorithm is solving
        solve(grid); //solve the grid
        document.getElementById("status").innerHTML = "Solved!"; //let the user now the algorithm is solved

        var t1 = performance.now() //setting the end of the solving timer
        let exeTime = Math.round((t1 - t0) * 1000)/1000; //calculating the time the algorithm took to solve in milliseconds
        document.getElementById("timer").innerHTML = "Time to solve: " + exeTime + " ms"; //display the time

        count = 0;
        inner = 0;
        outer = 0;
        boxes.forEach(box => {
            inner = count % 9;
            outer = Math.floor(count / 9);
            box.value = grid[outer][inner]; //display the solved values by setting the input boxes values to the grid
            count++;
        })
    } else {
        document.getElementById("status").innerHTML = "GRID IS NOT SOLVABLE! Check your entered numbers."; //let the user know if the grid cannot be solved
    }
})

/*check button functions on click to check if the grid is solvable without solving it*/
checkBtn.addEventListener('click', ()=> {
    document.getElementById("timer").innerHTML = "";
    
    let count = 0;
    let inner = 0;
    let outer = 0;
    boxes.forEach(box => { //loop through the input boxes and get the inputs
        inner = count % 9;
        outer = Math.floor(count / 9);
        if(box.value === ""){
            grid[outer][inner] = 0;
        } else {
            grid[outer][inner] = parseInt(box.value);
        }
        count++;
    })

    if(valid_board(grid)){ //check if th grid is valid (solvable)
        document.getElementById("status").innerHTML = "Valid grid!"; //display the reuslt to the user
    }
    else {
        document.getElementById("status").innerHTML = "Invalid grid, cannot solve!"; //display the reuslt to the user
    }
})

/*check button of the play tab functions on click*/
checkPlayBtn.addEventListener('click', ()=> {
    document.getElementById("timer").innerHTML = "";
    
    let count = 0;
    let inner = 0;
    let outer = 0;
    boxes.forEach(box => { //loop through the input boxes and get the inputs
        inner = count % 9;
        outer = Math.floor(count / 9);
        if(box.value === ""){
            grid[outer][inner] = 0;
        } else {
            grid[outer][inner] = parseInt(box.value);
        }
        count++;
    })

    if(valid_board(grid)){
        document.getElementById("validity").innerHTML = "Keep Going!"; //display the reuslt to the user
    }
    else {
        document.getElementById("validity").innerHTML = "There is a mistake in your solution!"; //display the reuslt to the user
    }
})

/*reset button functions on click*/
resetBtn.addEventListener('click', () => {
    document.getElementById("timer").innerHTML = "";
    boxes.forEach(box => { //reset the values and attributes of the input boxes to default
        box.value = "";
        box.removeAttribute("disabled");
        box.classList.remove("solved");
        box.classList.remove("generated");
    })
    document.getElementById("status").innerHTML = "Enter a sudoku grid to solve!";
    startingMins = 0;
    countdown.innerHTML = "";
    clearInterval(intervalID);
})

/*timer function*/
function startTimer(startingMins) {
    let time = startingMins * 60; //time in seconds

    intervalID = setInterval(updateCountdown, 1000);

    function updateCountdown() {
        let min = Math.floor(time / 60);
        let sec = time % 60;

        sec = sec < 10 ? '0' + sec : sec;

        countdown.innerHTML = `${min}:${sec}`; //display the timer in minutes and seconds (digital clock format)
        if(time > 0){
            time--; //decrement time
        }else {
            endGame(); //end the game when the countdown timer is done
        }
    }
}

/*function to end the game when the timer is done for the play tab*/
function endGame() {
    document.getElementById("countdown-label").innerHTML = "Time ended";
    boxes.forEach(box => {
        box.setAttribute("disabled", "disabled"); //disble all boxes and prevent the user from entering new values
        box.classList.add("solved");
    })
}

/*tabs animation and displaying*/
//setting variables for necessary elements of the HTML
const tabs = document.querySelectorAll('[data-tab-target]');
const tabContents = document.querySelectorAll('[data-tab-content]')
tabs.forEach(tab => {
    tab.addEventListener('click', ()=> { //on click function for the tabs
        const target = document.querySelector(tab.dataset.tabTarget);
        tabContents.forEach(tabContent => {
            tabContent.classList.remove('active-tab'); //removing the active tab class for the tab content
            boxes.forEach(box => {
                box.value = ""; //defaulting the values and attributes of the input boxes
                box.removeAttribute("disabled");
                box.classList.remove("generated");
                box.classList.remove("solved");
            })
        })
        tabs.forEach(tab => {
            tab.classList.remove('active-tab'); //removing the active tab class
        })
        tab.classList.add('active-tab'); //setting the active tab class for the tab
        target.classList.add('active-tab'); //setting the active tab class for the target (content of the tab)
    })
})
