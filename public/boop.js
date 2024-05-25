const gameboard = document.getElementById('gameboard');
const message = document.getElementById('message');
const newGameBtn = document.getElementById('new-game-btn');
const turnIndicator = document.getElementById('turn-indicator');
let currentPlayer = 'X';
let boardState = [
    ['', '', '', '', '', ''],
    ['', '', '', '', '', ''],
    ['', '', '', '', '', ''],
    ['', '', '', '', '', ''],
    ['', '', '', '', '', ''],
    ['', '', '', '', '', '']
];
let gameEnded = false;

// Function to render the gameboard
function renderGameboard() {
    gameboard.innerHTML = '';
    for (let i = 0; i < 6; i++) {
        for (let j = 0; j < 6; j++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.dataset.row = i;
            cell.dataset.col = j;
            cell.innerText = boardState[i][j];
            cell.addEventListener('click', handleCellClick);
            gameboard.appendChild(cell);
        }
    }
}

// Function to handle cell click event
function handleCellClick(event) {
    if (!gameEnded) {
        const row = parseInt(event.target.dataset.row);
        const col = parseInt(event.target.dataset.col);
        if (boardState[row][col] === '') {
            boardState[row][col] = currentPlayer;
            boopTokens(row, col);
            renderGameboard();
            if (checkWin('X')) {
                message.innerText = `Player X wins!`;
                gameEnded = true;
            } else if (checkWin('O')) {
                message.innerText = `Player O wins!`;
                gameEnded = true;
            } else {
                currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
                updateTurnIndicator();

                AI_move(difficulty) // Determines the type of AI
            }
        }
    }
}

//Difficulty Selection
let difficulty = AI_Baby
function dropdown() {
    var selector = document.getElementById("difficulty");
    if(selector.value == "baby"){
        difficulty = AI_Baby
    }
    if(selector.value == "normal"){
        difficulty = AI_Normal
    }
    if(selector.value == "terminator"){
        difficulty = AI_Terminator
    }
}

// AI move
function AI_move(difficulty) {
    let coord = difficulty()
    if (!gameEnded) {
        let row = coord[0];
        let col = coord[1];
        if (boardState[row][col] === '') {
            boardState[row][col] = currentPlayer;
            boopTokens(row, col);
            renderGameboard();
            if (checkWin('X')) {
                message.innerText = `Player X wins!`;
                gameEnded = true;
            } else if (checkWin('O')) {
                message.innerText = `Player O wins!`;
                gameEnded = true;
            } else {
                currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
                updateTurnIndicator();
            }
        }
    }
}


// Math random helper
function rand(min, max) {
    return Math.floor(Math.random() * (max - min + 1) ) + min;
    }

// AI Heuristic - Baby (random moves)
function AI_Baby() {
    const row = rand(0,5)
    const col = rand(0,5)
    while (boardState[row][col] !== "") {
        const [row,col] = AI_Baby() //catches AI trying to place on occupied cell
        return [row,col]
    }
    // console.log("Muahhhhhh")
    return [row,col]
}

// Updating boardstate to calculate utility
function Calc_Utility(board) {
    let AI = "O"
    let player = "X"
    let utility = 0
    for (let i = 0; i < 6; i++) {
        for (let j = 0; j < 6; j++) {
            // CheckWin and utility
            if (board[i][j] === AI) {
                // Check horizontal win
                if (j + 2 < 6 && board[i][j + 1] === AI && board[i][j + 2] === AI) {
                    utility += 9999;
                }
                // Check vertical win
                if (i + 2 < 6 && board[i + 1][j] === AI && board[i + 2][j] === AI) {
                    utility += 9999;
                }
                // Check diagonal win (top-left to bottom-right)
                if (i + 2 < 6 && j + 2 < 6 && board[i + 1][j + 1] === AI && board[i + 2][j + 2] === AI) {
                    utility += 9999;
                }
                // Check diagonal win (top-right to bottom-left)
                if (i + 2 < 6 && j - 2 >= 0 && board[i + 1][j - 1] === AI && board[i + 2][j - 2] === AI) {
                    utility += 9999;
                }
                // Check 2 horizontal 
                if (j + 1 < 6 && board[i][j + 1] === AI) {
                    utility += 999;
                }
                // Check 2 vertical 
                if (i + 1 < 6 && board[i + 1][j] === AI) {
                    utility += 999;
                }
                // Check 2 diagonal (top-left to bottom-right)
                if (i + 1 < 6 && j + 1 < 6 && board[i + 1][j + 1] === AI) {
                    utility += 999;
                }
                // Check 2 diagonal (top-right to bottom-left)
                if (i + 1 < 6 && j - 1 >= 0 && board[i + 1][j - 1] === AI) {
                    utility += 999;
                }

                utility += 10 // more pieces on the board is marginally better

                if (i > 1 && i < 4 && j > 1 && j < 4) { // arbitrary tie breaker preferring centre cells
                    utility += rand(1,6)
                }

            }
            // console.log(utility)
            //CheckLose
            if (board[i][j] === player) {
                // Check horizontal lose
                if (j + 2 < 6 && board[i][j + 1] === player && board[i][j + 2] === player) {
                    utility -= 9999;
                }
                // Check vertical lose
                if (i + 2 < 6 && board[i + 1][j] === player && board[i + 2][j] === player) {
                    utility -= 9999;
                }
                // Check diagonal lose (top-left to bottom-right)
                if (i + 2 < 6 && j + 2 < 6 && board[i + 1][j + 1] === player && board[i + 2][j + 2] === player) {
                    utility -= 9999;
                }
                // Check diagonal lose (top-right to bottom-left)
                if (i + 2 < 6 && j - 2 >= 0 && board[i + 1][j - 1] === player && board[i + 2][j - 2] === player) {
                    utility -= 9999;
                }
                // Check 2 horizontal 
                if (j + 1 < 6 && board[i][j + 1] === player) {
                    utility -= 9999; // equal utility (lose) cos lose on next move
                }
                // Check 2 vertical 
                if (i + 1 < 6 && board[i + 1][j] === player) {
                    utility -= 9999;
                }
                // Check 2 diagonal (top-left or bottom-right)
                if (i + 1 < 6 && j + 1 < 6 && board[i + 1][j + 1] === player) {
                    utility -= 9999;
                }
                // Check 2 diagonal (top-right or bottom-left)
                if (i + 1 < 6 && j - 1 >= 0 && board[i + 1][j - 1] === player) {
                    utility -= 9999;
                }

                utility -= 30 // try to push human pieces off; no human pieces best

                // gradient of disutility from centre to edge (high to low)
                // meaning AI would prefer outcome where player pieces are towards the edge
                if ((i === 0 || i === 5) && (j === 0 || j === 5)) {
                    utility -= 12
                }

                if ((i === 1 || i === 4) && (j === 1 || j === 4)) {
                    utility -= 14
                }

                if ((i === 2 || i === 3) && (j === 2 || j === 3)) {
                    utility -= 16
                }
            }
            // console.log(utility)
        }
    }
    // board_util[i][j] = utility
    // console.log(utility)
    return utility

}

//AI Heuristic - Normal (utility maximising; 1-step; local maxima)
function AI_Normal() {
    let best_move = [10,10]
    let max_utility = -9999
    for (let i = 0; i < 6; i++) {
        for (let j = 0; j < 6; j++) {
            if (boardState[i][j] !== "") {continue} // skips occupied
            // console.log(max_utility)
            // makes a new move and returns new boardstate
            let new_board = AIboopTokens(i,j,JSON.parse(JSON.stringify(boardState)))
            // console.log("coord: " + i + "," + j)
            // console.log(new_board)
            let new_utility = Calc_Utility(new_board)
            if (new_utility > max_utility) {
                best_move = [i,j]
                max_utility = new_utility
            }

        }
    }
    // console.log(best_move)
    return best_move
}

//AI Heuristic - Terminator (min-max; alpha-beta pruning; 5-step but might crash)
function AI_Terminator() {

    return [row,col]
}
// Function to update turn indicator
function updateTurnIndicator() {
    turnIndicator.innerText = `Current Turn: Player ${currentPlayer}`;
}

function AIboopTokens(row, col,board) {
    const directions = [[-1, 0], [1, 0], [0, -1], [0, 1], [-1, -1], [-1, 1], [1, -1], [1, 1]];
    board[row][col] = "O";
    for (const [dx, dy] of directions) {
        let x = row + dx;
        let y = col + dy;
        if (x >= 0 && x < 6 && y >= 0 && y < 6 && board[x][y] !== '') {
            let nx = x + dx;
            let ny = y + dy;
            if (nx >= 0 && nx < 6 && ny >= 0 && ny < 6) {
                if (board[nx][ny] === '') {
                    board[nx][ny] = board[x][y];
                    board[x][y] = '';
                }
            } else {
                // Token to be booped is adjacent to the edge of the board
                board[x][y] = '';
            }
        }
    }
    return board
}

// Function to boop tokens
function boopTokens(row, col) {
    const directions = [[-1, 0], [1, 0], [0, -1], [0, 1], [-1, -1], [-1, 1], [1, -1], [1, 1]];
    for (const [dx, dy] of directions) {
        let x = row + dx;
        let y = col + dy;
        if (x >= 0 && x < 6 && y >= 0 && y < 6 && boardState[x][y] !== '') {
            let nx = x + dx;
            let ny = y + dy;
            if (nx >= 0 && nx < 6 && ny >= 0 && ny < 6) {
                if (boardState[nx][ny] === '') {
                    boardState[nx][ny] = boardState[x][y];
                    boardState[x][y] = '';
                }
            } else {
                // Token to be booped is adjacent to the edge of the board
                boardState[x][y] = '';
            }
        }
    }
}

// Function to check for a win
function checkWin(player) {
    // Check horizontal, vertical, and diagonal wins
    for (let i = 0; i < 6; i++) {
        for (let j = 0; j < 6; j++) {
            if (boardState[i][j] === player) {
                // Check horizontal win
                if (j + 2 < 6 && boardState[i][j + 1] === player && boardState[i][j + 2] === player) {
                    return true;
                }
                // Check vertical win
                if (i + 2 < 6 && boardState[i + 1][j] === player && boardState[i + 2][j] === player) {
                    return true;
                }
                // Check diagonal win (top-left to bottom-right)
                if (i + 2 < 6 && j + 2 < 6 && boardState[i + 1][j + 1] === player && boardState[i + 2][j + 2] === player) {
                    return true;
                }
                // Check diagonal win (top-right to bottom-left)
                if (i + 2 < 6 && j - 2 >= 0 && boardState[i + 1][j - 1] === player && boardState[i + 2][j - 2] === player) {
                    return true;
                }
            }
        }
    }
    return false;
}

// Event listener for new game button
newGameBtn.addEventListener('click', () => {
    currentPlayer = 'X';
    boardState = [
        ['', '', '', '', '', ''],
        ['', '', '', '', '', ''],
        ['', '', '', '', '', ''],
        ['', '', '', '', '', ''],
        ['', '', '', '', '', ''],
        ['', '', '', '', '', '']
    ];
    gameEnded = false;
    message.innerText = '';
    turnIndicator.innerText = '';
    renderGameboard();
    updateTurnIndicator();
});


renderGameboard();
updateTurnIndicator();