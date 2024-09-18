// Player factory function
function Player(name) {
    let score = 0;
    return { 
        name, 
        score,
        incrementScore: function() {
            this.score++;
        },
        getScore: function() {
            return this.score;
        }
    };
}

const gameBoard = function() {
    const rows = 3;
    const columns = 3;
    
    let arr = [];

    const getBoard = () => arr;

    const createBoard = () => {
        for (let i = 0; i < rows; i++) {
            arr[i] = [];
            for (let j = 0; j < columns; j++) {
                arr[i].push(Cell());
            }
        }
    }

    function Cell() {
        let userWhoPlayed = "";
        let isOccupied = false;
        return { 
            getUserWhoPlayed: () => userWhoPlayed,
            setUserWhoPlayed: (user) => { userWhoPlayed = user; },
            isOccupied: () => isOccupied,
            setOccupied: (occupied) => { isOccupied = occupied; }
        };
    }

    return { getBoard, createBoard };
}

const gameUI = function() {
    const createBoardUI = () => {
        const gameBoard = document.querySelector(".board");
        gameBoard.innerHTML = ''; // Clear existing content
        
        for (let i = 0; i < 9; i++) {
            const cell = document.createElement("div");
            cell.setAttribute("id", `${Math.floor(i / 3)}-${i % 3}`);
            cell.classList.add("cell");
            cell.addEventListener('click', handleCellClick);
            gameBoard.appendChild(cell);
        }
        const container = document.querySelector(".container");
        const resetButton = document.createElement("button");
        const nameChange = document.createElement("button");
        nameChange.textContent = "Change Names Of Players";
        nameChange.id = "nameChange";
        resetButton.textContent = "Reset";
        resetButton.id = "reset";
        container.appendChild(resetButton); 
        resetButton.addEventListener('click', handleReset);
    }

    const handleReset = () => {     
        const container = document.querySelector(".container");
        container.removeChild(container.lastChild);
        game.playGame();
    }
    
    const handleCellClick = (event) => {
        const [row, column] = event.target.id.split('-').map(Number);
        game.makeMove(row, column);
    }

    const updateBoard = (board) => {
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                const cell = document.getElementById(`${i}-${j}`);
                cell.textContent = board[i][j].getUserWhoPlayed() === 'player1' ? 'X' : 
                                   board[i][j].getUserWhoPlayed() === 'player2' ? 'O' : '';
            }
        }
    }

    const showMessage = (message) => {
        const messageElement = document.querySelector('.message');
        if (messageElement) {
            messageElement.textContent = message;
        } else {
            console.log(message); // Fallback if message element doesn't exist
        }
    }

    const updateScores = (player1, player2) => {
        const scoreOne = document.querySelector("#scoreOne");
        const scoreTwo = document.querySelector("#scoreTwo");
        scoreOne.textContent = `${player1.getScore()}`;
        scoreTwo.textContent = `${player2.getScore()}`;
    }

    return { createBoardUI, updateBoard, showMessage, updateScores };
}

const gameFlow = function(ui) {
    const gameState = {
        player1: Player("player1"),
        player2: Player("player2"),
        currentPlayer: null,
        board: null,
        moveCounter: 0,
        isGameOver: false
    };

    const initGame = () => {
        gameState.currentPlayer = gameState.player1;
        gameState.board = gameBoard();
        gameState.board.createBoard();
        gameState.moveCounter = 0;
        gameState.isGameOver = false;
        ui.updateScores(gameState.player1, gameState.player2);
    }

    const changePlayer = () => {
        gameState.currentPlayer = gameState.currentPlayer === gameState.player1 ? gameState.player2 : gameState.player1;
    }

    const ResolveMove = (row, column) => {
        if (row < 0 || row >= 3 || column < 0 || column >= 3) {
            console.error("Invalid move: Out of bounds");
            return false;
        }
        
        let board = gameState.board.getBoard();
        if (board[row][column].isOccupied()) {
            console.error("Invalid move: Cell already occupied");
            return false;
        }
        
        board[row][column].setOccupied(true);
        board[row][column].setUserWhoPlayed(gameState.currentPlayer.name);
        gameState.moveCounter++;
        return true;
    }

    const checkWinner = () => {
        let board = gameState.board.getBoard();
        // Check rows and columns
        for (let i = 0; i < 3; i++) {
            if (board[i][0].getUserWhoPlayed() !== "" &&
               board[i][0].getUserWhoPlayed() === board[i][1].getUserWhoPlayed() && 
               board[i][1].getUserWhoPlayed() === board[i][2].getUserWhoPlayed()) {
                return { result: 'win', winner: gameState.currentPlayer };
            }
            if (board[0][i].getUserWhoPlayed() !== "" &&
               board[0][i].getUserWhoPlayed() === board[1][i].getUserWhoPlayed() && 
               board[1][i].getUserWhoPlayed() === board[2][i].getUserWhoPlayed()) {
                return { result: 'win', winner: gameState.currentPlayer };
            }
        }
        // Check diagonals
        if (board[0][0].getUserWhoPlayed() !== "" &&
           board[0][0].getUserWhoPlayed() === board[1][1].getUserWhoPlayed() && 
           board[1][1].getUserWhoPlayed() === board[2][2].getUserWhoPlayed()) {
            return { result: 'win', winner: gameState.currentPlayer };
        }
        if (board[0][2].getUserWhoPlayed() !== "" &&
           board[0][2].getUserWhoPlayed() === board[1][1].getUserWhoPlayed() && 
           board[1][1].getUserWhoPlayed() === board[2][0].getUserWhoPlayed()) {
            return { result: 'win', winner: gameState.currentPlayer };
        }
        if (gameState.moveCounter === 9) {
            return { result: 'draw' };
        }
        return { result: 'ongoing' };
    }

    const makeMove = (row, column) => {
        if (gameState.isGameOver) return;
        
        if (ResolveMove(row, column)) {
            const result = checkWinner();
            if (result.result === 'win') {
                gameState.isGameOver = true;
                result.winner.incrementScore();
                ui.updateScores(gameState.player1, gameState.player2);
                ui.showMessage(`${result.winner.name} wins!`);
            } else if (result.result === 'draw') {
                gameState.isGameOver = true;
                ui.showMessage("It's a draw!");
            } else {
                changePlayer();
            }
            ui.updateBoard(gameState.board.getBoard());
        }
    }

    const playGame = () => {
        ui.createBoardUI();
        initGame();
        
    }

    return { playGame, makeMove };
}

const ui = gameUI();
const game = gameFlow(ui);
const Start = document.querySelector(".btnStart");
Start.addEventListener('click', () => {
    game.playGame();
    Start.remove();
});