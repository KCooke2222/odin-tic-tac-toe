const Gameboard = (() => {
  const board = Array.from({ length: 3 }, () => Array(3).fill(null));

  const placeMark = (row, col, mark) => {
    if (board[row][col]) return false;
    board[row][col] = mark;
    return true;
  };

  const getBoard = () => board;

  const checkGameState = () => {
    let state = null;

    const score = (mark) => (mark === "x" ? 1 : mark === "o" ? -1 : 0);

    // full = tie
    if (!board.flat().includes(null)) {
      state = "tie";
    }

    // vert / horiz / diag (see if 3 in row for all at once)
    let diagL = 0;
    let diagR = 0;
    for (let i = 0; i < 3; i++) {
      let vert = 0;
      let horiz = 0;
      for (let j = 0; j < 3; j++) {
        vert += score(board[j][i]); // col i
        horiz += score(board[i][j]); // row i
      }
      if (Math.abs(vert) === 3 || Math.abs(horiz) === 3) {
        state = "win";
      }

      diagL += score(board[i][i]);
      diagR += score(board[2 - i][i]);
    }
    if (Math.abs(diagL) === 3 || Math.abs(diagR) === 3) {
      state = "win";
    }

    return state;
  };

  const reset = () => {
    for (let i = 0; i < board.length; i++) {
      for (let j = 0; j < board[i].length; j++) {
        board[i][j] = null;
      }
    }
  };

  return { placeMark, getBoard, checkGameState, reset };
})();

const Player = (name, mark) => ({ name, mark });

const GameController = (() => {
  const p1 = Player("p1", "x");
  const p2 = Player("p2", "o");
  let currentP = p1;
  let gameState = null;

  const playTurn = (row, col) => {
    // mark
    if (!gameState && Gameboard.placeMark(row, col, currentP.mark)) {
      // check win or tie
      const mark = currentP.mark;
      gameState = Gameboard.checkGameState();
      if (gameState) {
      } else {
        // next turn
        currentP === p1 ? (currentP = p2) : (currentP = p1);
      }
      return true;
    }
    return false;
  };

  const resetGame = () => {
    currentP = p1;
    gameState = null;
    Gameboard.reset();
  };

  const getState = () => {
    return { gameState, currentP };
  };

  return { playTurn, resetGame, getState };
})();

const DomController = (() => {
  const boardDiv = document.querySelector(".board");
  const resetBtn = document.querySelector("#reset");
  const statusDiv = document.querySelector("#status");

  const displayBoard = () => {
    boardDiv.textContent = "";
    board = Gameboard.getBoard();

    for (let i = 0; i < board.length; i++) {
      for (let j = 0; j < board[0].length; j++) {
        let pos = document.createElement("div");
        pos.className = "pos";
        pos.dataset.row = i;
        pos.dataset.col = j;
        pos.textContent = board[i][j];

        boardDiv.appendChild(pos);
        pos.addEventListener("click", (e) => {
          const pos = e.target;
          const row = pos.dataset.row;
          const col = pos.dataset.col;

          if (GameController.playTurn(row, col)) {
            const gameState = GameController.getState();
            if (gameState.gameState) {
              statusDiv.textContent =
                gameState.gameState + " " + gameState.currentP.name;
            } else {
              statusDiv.textContent = "";
            }
            DomController.displayBoard();
          }
        });
      }
    }

    resetBtn.addEventListener("click", (e) => {
      statusDiv.textContent = "";
      GameController.resetGame();
      DomController.displayBoard();
    });
  };

  return { displayBoard };
})();

DomController.displayBoard();
// Next add player and game controler
// reset game
// then add dom
