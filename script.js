const boardElement = document.getElementById("board");
const boardSizeInput = document.getElementById("board-size");
const generateBoardButton = document.getElementById("generate-board");
const scoreDisplay = document.getElementById("score-display");
const currentPlayerDisplay = document.getElementById("current-player");

let player1Symbol = "X";
let player2Symbol = "O";
let currentPlayer = null;
let player1Score = 0;
let player2Score = 0;
let board = [];
let isXTurn = true;

function initializeGame() {
    /* Người chơi đầu tiên sẽ được chỉ định X khi game bắt đầu, người chơi còn lại sẽ là O */
    player2Symbol = player1Symbol === "X" ? "O" : "X";
    currentPlayer = player1Symbol;

    /* Hiển thị người chơi hiện tại */
    currentPlayerDisplay.textContent = `${currentPlayer} turn`;
    updateScoreDisplay();
}

function generateBoard(size) {
    /* Tạo một bàn chơi với các ô trống */
    board = Array.from({ length: size }, () => Array.from({ length: size }, () => null));
    boardElement.innerHTML = "";
    /* Số hàng và cột của bàn chơi phụ thuộc vào input của người chơi */
    boardElement.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
    boardElement.style.gridTemplateRows = `repeat(${size}, 1fr)`;

    /* Bắt đầu tạo các ô trên bàn chơi */
    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            const cell = document.createElement("div");
            cell.className = "cell";
            cell.dataset.row = i;
            cell.dataset.col = j;

            /* Khi người chơi click vào mỗi ô, xử lý dữ kiện */
            cell.addEventListener("click", () => handleCellClick(i, j, cell));

            /* Các ô sẽ được thêm vào bàn chơi */
            boardElement.appendChild(cell);
        }
    }
}

function handleCellClick(row, col, cell) {
    // Nếu ô đã được người chơi lựa chọn thì không thể chọn lại hoặc thay đổi
    if (board[row][col] !== null || cell.classList.contains("taken")) return;

    // Cập nhật bàn chơi theo thứ tự lượt chơi 
    board[row][col] = currentPlayer;
    cell.textContent = currentPlayer;
    cell.classList.add(currentPlayer === "X" ? "x" : "o", "taken");

    // Kiểm tra điều kiện thắng hoặc hòa
    if (checkWin(row, col)) {
        setTimeout(() => {
            // Thông báo người chiến thắng
            alert(`${currentPlayer === player1Symbol ? "Player 1" : "Player 2"} wins!`);
            // Khi người chơi thắng, điểm của họ sẽ tăng
            if (currentPlayer === player1Symbol) {
                player1Score++;
            } else {
                player2Score++;
            }
            // Cập nhật điểm số
            updateScoreDisplay();
            // Khi game kết thúc, bàn chơi sẽ tự động tạo mới
            generateBoard(board.length);
        }, 200);
        return;
    }

    // Kiểm tra trường hợp hòa
    if (checkDraw()) {
        setTimeout(() => {
            // Hiện thông báo hòa và tạo lại bàn chơi
            alert(`It's a draw!`);
            generateBoard(board.length);
        }, 200);
        return;
    }

    // Chuyển lượt chơi cho người tiếp theo
    currentPlayer = currentPlayer === player1Symbol ? player2Symbol : player1Symbol;
    // Hiện người chơi hiện tại
    currentPlayerDisplay.textContent = `${currentPlayer} turn`;
}

// Kiểm tra điều kiện thắng
function checkWin(row, col) {
    const size = board.length;
    // Ô người chơi chọn
    const player = board[row][col];

    // Kiểm tra từng hàng để
    if (board[row].every(cell => cell === player)) return true;

    // Kiểm tra từng cột
    if (board.every(row => row[col] === player)) return true;

    // Kiểm tra đường chéo từ trái qua phải
    if (row === col && board.every((row, index) => row[index] === player)) return true;

    // Kiểm tra đường chéo hướng ngược lại
    if (row + col === size - 1 && board.every((row, index) => row[size - 1 - index] === player)) return true;

    return false;
}

// Bàn chơi hòa khi đã đầy tất cả các ô mà không đáp ứng đủ điều kiện thắng
function checkDraw() {
    return board.every(row => row.every(cell => cell !== null));
}

// Cập nhật điểm số
function updateScoreDisplay() {
    document.querySelector("#player1 .score").textContent = player1Score;
    document.querySelector("#player2 .score").textContent = player2Score;
}

// Tạo bàn chơi dựa trên input của người chơi
generateBoardButton.addEventListener("click", () => {
    const newSize = parseInt(boardSizeInput.value, 10);
    if (newSize >= 3 && newSize <= 10) {
        generateBoard(newSize);
    } else {
        alert(`Please enter a valid number`);
    }
});

initializeGame();
// Tạo bàn chơi với kích thước mặc định là 3x3, người chơi có thể thay đổi kích thước này
generateBoard(3);
