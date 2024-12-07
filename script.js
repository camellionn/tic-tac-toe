const boardElement = document.getElementById("board");
const boardSizeInput = document.getElementById("board-size");
const generateBoardButton = document.getElementById("generate-board");
const scoreDisplay = document.getElementById("score-display");
const currentPlayerDisplay = document.getElementById("current-player");

let player1Symbol = "X";
let player2Symbol = "O";
let currentPlayer = null
let player1Score = 0;
let player2Score = 0;
let board = [];

function initializeGame() {
    const player1Symbol = Math.random() > 0.5 ? "X" : "O";
    player2Symbol = player1Symbol === "X" ? "O" : "X";
    currentPlayer = player1Symbol;

    updateScoreDisplay();
    currentPlayerDisplay.textContent = `Current Player: ${currentPlayer}`;
}
function generateBoard(size) {
    board = Array.from({ length: size }, () => Array.from({ length: size }, () => null));
    boardElement.innerHTML = "";
    boardElement.style.gridTemplateColumns = `repeat(${size},1fr)`;
    boardElement.style.gridTemplateRows = `repeat(${size},1fr)`;

    for(let i=0; i < size; i++){
        for(let j=0; j < size; j++){
            const cell = document.createElement("div");
            cell.className = "cell";
            cell.classList.add("cell");
            cell.dataset.row = i;
            cell.dataset.col = j;

            cell.addEventListener("click", () => handleCellClick(i, j, cell));

            boardElement.appendChild(cell);
        }
    }
    currentPlayerDisplay.textContent = `Current Player: ${currentPlayer}`;
}

function handleCellClick(row, col, cell) {
    // Prevent overwriting a cell
    if (board[row][col] !== null || cell.classList.contains("taken")) return;

    // Update the board and the UI
    board[row][col] = currentPlayer;
    cell.textContent = currentPlayer;
    cell.classList.add("taken");

    // Check if the current player wins
    if (checkWin(row, col)) {
        // Show the winning player's symbol, then display the alert
        setTimeout(() => {
            alert(`${currentPlayer === player1Symbol ? "Player 1" : "Player 2"} wins!`);
            if (currentPlayer === player1Symbol) {
                player1Score++;
            } else {
                player2Score++;
            }
            updateScoreDisplay();
            generateBoard(board.length);
        }, 200); // Slight delay ensures the last symbol is visible
        return;
    }

    // Switch player immediately
    currentPlayer = currentPlayer === player1Symbol ? player2Symbol : player1Symbol;
    currentPlayerDisplay.textContent = `Current Player: ${currentPlayer}`;
}

function checkWin(row, col) {
    const size = board.length;
    const player = board[row][col];

    //Check row
    if(board[row].every(cell => cell === player)) return true;

    //Check column
    if(board.every(row => row[col] === player)) return true;

    //Check diagonal (top-left to bottom right)
    if(row === col && board.every((row, index)=> row[index] === player)) return true;

    //Check anti-diagonal (top-right to bottom-left)
    if(row + col === size - 1 && board.every((row, index) => row[size - 1 - index] === player)) return true;

    return false;
}
function updateScoreDisplay() {
    scoreDisplay.textContent = `Player 1: (${player1Symbol}) : ${player1Score} | Player 2: ( ${player2Symbol} ): ${player2Score}`;
}

//Listen for board size changes
generateBoardButton.addEventListener("click", () => {
    const newSize = parseInt(boardSizeInput.value, 10);
    if(newSize >= 3 && newSize <= 10) {
        generateBoard(newSize);
    } else {
        alert(`Please enter a valid number`)
    }
});

initializeGame();
generateBoard(3);
