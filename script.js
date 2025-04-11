

function gameBoard() {
    const rows = 3;
    const columns = 3;
    const board = [];

    for (let i = 0; i < rows; i++) {
        board[i] = [];
        for (let j = 0; j < columns; j++) {
          board[i].push(Cell());
        }
    }
    const getBoard = () => board;

    const makeMove = (row, column, player) => {
      const cell = board[row][column];
    
      // If the cell is already taken, ignore the move
      if (cell.getValue() !== null) return false;
    
      // Otherwise, place the player's sign
      cell.addSign(player);
      return true;

    };
    

    const printBoard = () => {
        const boardWithCellValues = board.map((row) => row.map((cell) => cell.getValue()))
        console.log(boardWithCellValues);
    };

    return {
        getBoard, makeMove, printBoard
    };
}

function Cell() {
    let value = null;
  
    // Accept a player's token to change the value of the cell
    const addSign = (player) => {
      value = player;
    };
  
    // How we will retrieve the current value of this cell through closure
    const getValue = () => value;
  
    return {
      addSign,
      getValue
    };
}


function GameController(
  playerOneName = "Player One",
  playerTwoName = "Player Two"
) {
  const board = gameBoard();

  const players = [
    {
      name: playerOneName,
      sign: 'X'
    },
    {
      name: playerTwoName,
      sign: 'O'
    }
  ];

  let activePlayer = players[0];

  const switchPlayerTurn = () => {
    activePlayer = activePlayer === players[0] ? players[1] : players[0];
  };
  const getActivePlayer = () => activePlayer;

  const printNewRound = () => {
    board.printBoard();
    console.log(`${getActivePlayer().name}'s turn.`);
  };

  const checkWinner = (playerSign) => {
    const boardState = board.getBoard();
  
    // Check rows
    for (let row = 0; row < 3; row++) {
      if (
        boardState[row][0].getValue() === playerSign &&
        boardState[row][1].getValue() === playerSign &&
        boardState[row][2].getValue() === playerSign
      ) return true;
    }

    for (let column = 0; column < 3; column++) {
      if (
        boardState[column][0].getValue() === playerSign &&
        boardState[column][1].getValue() === playerSign &&
        boardState[column][2].getValue() === playerSign
      ) return true;
    }

      // Check diagonals
    if (
    boardState[0][0].getValue() === playerSign &&
    boardState[1][1].getValue() === playerSign &&
    boardState[2][2].getValue() === playerSign
    ) return true;

    if (
    boardState[0][2].getValue() === playerSign &&
    boardState[1][1].getValue() === playerSign &&
    boardState[2][0].getValue() === playerSign
    ) return true;

    return false;
  }

  const playRound = (row, column) => {
  const moveSuccessful = board.makeMove(row, column, getActivePlayer().sign);

  if (!moveSuccessful) {
    console.log("Invalid move! Cell already taken.");
    return; // Don't switch turns or check for winner
  }

  if (checkWinner(getActivePlayer().sign)) {
    console.log(`${getActivePlayer().name} wins!`);
    board.printBoard();
    return;
  }

  switchPlayerTurn();
  printNewRound();
};


  // Initial play game message
  printNewRound();

  // For the console version, we will only use playRound, but we will need
  // getActivePlayer for the UI version, so I'm revealing it now
  return {
    playRound,
    getActivePlayer
  };
}

const game = GameController();





