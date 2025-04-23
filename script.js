const game = gameController();

function gameBoard() {
    const rows = 3;
    const columns = 3;
    const board = [];

    //Loop to create a 3x3 board
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

    const resetBoard = () =>{
      for(let i = 0; i < rows; i++){
        for(let j = 0; j < columns; j++){
          board[i][j] = Cell();
        }
      }
    }

    return {
        getBoard, makeMove, printBoard, resetBoard
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

function showInterface(row, col){

  const boardContainer = document.getElementById('grid');
  boardContainer.innerHTML = ''

  
  const handleClick = (e) =>{
    
    const clickedCell = e.target;
    const row = parseInt(clickedCell.getAttribute('data-row'));
    const col = parseInt(clickedCell.getAttribute('data-col'));
    
    const result = game.playRound(row, col);
    updateUI();

    const resultsText = document.getElementById('resultsText');
    
    if (result === "invalid"){
      resultsText.textContent = "Invalid move! Cell already taken.";
    }
  
    else if (result === "win"){
      resultsText.textContent = `The winner is ${game.getActivePlayer().name}`;
      
    }
    else if (result === "draw"){
      resultsText.textContent = "It is a draw.";
    }
    else if (result === "continue"){
      resultsText.textContent = `${game.getActivePlayer().name}'s turn`;
    }
  }

  for(let row = 0; row < 3; row++){
    const rows = document.createElement('div');
    rows.classList.add('row');

    for(let col = 0; col <3; col++){
      const block = document.createElement('div');
      block.classList.add('block');

      block.setAttribute('data-row', row);
      block.setAttribute('data-col', col);
      
      block.addEventListener('click', handleClick);

      rows.appendChild(block);
    }

    boardContainer.appendChild(rows)
  }


  const updateUI = () =>{
    const blocks = document.querySelectorAll('.block');
    const boardState = game.getBoard();

    blocks.forEach((block) =>{
      const row = parseInt(block.getAttribute('data-row'));
      const col = parseInt(block.getAttribute('data-col'));
      const value = boardState[row][col].getValue(); 

      block.textContent = value || '';
    })
    
  }

  return{
    handleClick, updateUI
  }
  
}

function gameController(
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

  
  // Validation for checking the winner
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

    for (let col = 0; col < 3; col++) {
      if (
        boardState[0][col].getValue() === playerSign &&
        boardState[1][col].getValue() === playerSign &&
        boardState[2][col].getValue() === playerSign
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

  const checkForDraws = () =>{
    const boardState = board.getBoard();

    for (let i = 0; i < 3; i++){
      for (let j = 0; j < 3; j++){
        if(boardState[i][j].getValue() === null){
          return;
        }
      }
    }
  alert("It is a DRAW!");
  board.resetBoard();
  }
  
  const playRound = (row, column) => {
  const moveSuccessful = board.makeMove(row, column, getActivePlayer().sign);

  if (!moveSuccessful) 
  {
    alert("The cell is already taken!!")
    return "invalid"; // Don't switch turns or check for winner
  }

  if (checkWinner(getActivePlayer().sign)) 
  {
    alert(`The winner is: ${getActivePlayer().name}`)
    board.printBoard();
    board.resetBoard();
    printNewRound();
  
    return "win";
  }

  if (checkForDraws()) 
  {
    
    board.printBoard();
    board.resetBoard();
    printNewRound();
    
    return "draw";
  }

  switchPlayerTurn();

  setTimeout(() => {
    printNewRound();
  }, 1000);
  
  return "continue";
};

  // Initial play game message
  printNewRound();

  return {
    playRound,
    getActivePlayer,
    checkForDraws,
    getBoard: board.getBoard,
  };
}

showInterface();