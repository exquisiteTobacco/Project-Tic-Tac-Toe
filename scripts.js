const gameBoard = function(){
    const rows = 3;
    const columns = 3;
    
    let arr = [];

    //method for getting the gameBoard
    const getBoard = () => arr;
    //method for setting the gameBoard
    const createBoard = () => {
        for (let i = 0; i < rows; i++) {
            arr[i] = [];
            for (let j = 0; j < columns; j++) {
                arr[i].push(Cell());
            }
        }
    }
    function Cell(){
        
        let userWhoPlayed = "";
        let isOccupied = false;
        return {userWhoPlayed, isOccupied}; 
    }
    return { getBoard, createBoard };

    
}
//factory function for creating a cell



const gameFlow = function(){
    let player1 = Player("player1");
    let player2 = Player("player2");
    let currentPlayer = player1;
    let winner = null;
    let moveCounter = 0;
    const board = gameBoard();
    board.createBoard();
    
    const changePlayer = () => {
        currentPlayer = currentPlayer === player1 ? player2 : player1;
    }

    const playMove = (row, column) => {
        let gameBoard = board.getBoard();
        if(gameBoard[row][column].isOccupied){
            return false;
        }
        gameBoard[row][column].isOccupied = true;
        gameBoard[row][column].userWhoPlayed = currentPlayer.name;
        
        moveCounter++;
        return true;
    }
    function Player(name){
        let score = 0;
        return {name, score};
    }
    const checkWinner = () => {
        let gameBoard = board.getBoard();
        for(let i = 0; i < 3; i++){
            if(gameBoard[i][0].userWhoPlayed !== "" &&
               gameBoard[i][0].userWhoPlayed === gameBoard[i][1].userWhoPlayed && 
               gameBoard[i][1].userWhoPlayed === gameBoard[i][2].userWhoPlayed){
                winner = currentPlayer;
                currentPlayer.score++;
                return true;
            }
            if(gameBoard[0][i].userWhoPlayed !== "" &&
               gameBoard[0][i].userWhoPlayed === gameBoard[1][i].userWhoPlayed && 
               gameBoard[1][i].userWhoPlayed === gameBoard[2][i].userWhoPlayed){
                winner = currentPlayer;
                currentPlayer.score++;
                return true;
            }
        }
        if(gameBoard[0][0].userWhoPlayed !== "" &&
           gameBoard[0][0].userWhoPlayed === gameBoard[1][1].userWhoPlayed && 
           gameBoard[1][1].userWhoPlayed === gameBoard[2][2].userWhoPlayed){
            winner = currentPlayer;
            currentPlayer.score++;
            return true;
        }
        if(gameBoard[0][2].userWhoPlayed !== "" &&
           gameBoard[0][2].userWhoPlayed === gameBoard[1][1].userWhoPlayed && 
           gameBoard[1][1].userWhoPlayed === gameBoard[2][0].userWhoPlayed){
            winner = currentPlayer;
            currentPlayer.score++;
            return true;
        }
        if(moveCounter === 9){
            return "draw";
        }
        return false;
    }
    const playGame = () => {
        while(true){
            let row = prompt("Enter row");
            let column = prompt("Enter column");
            playMove(row, column);
             if(checkWinner())
                {
                    break;
                }
            changePlayer();
        }
        console.log("Winner is: ", winner);
        console.log("Game Over");
    }
    return { playGame };
}
const game = gameFlow();
game.playGame();