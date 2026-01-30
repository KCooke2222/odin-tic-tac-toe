const Gameboard = (() => {
  const board = Array.from({ length: 3 }, () => Array(3).fill(null));

  const placeMark = (row, col, mark) => {
    if (board[row][col]) return false;
    board[row][col] = mark;
    return true;
  };

  const getBoard = () => board;

  const checkWin = () => {
    let win = false;

    const score = (mark) => (mark === "x" ? 1 : mark === "o" ? -1 : 0);

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
        win = true;
      }

      diagL += score(board[i][i]);
      diagR += score(board[2 - i][i]);
    }
    if (Math.abs(diagL) === 3 || Math.abs(diagR) === 3) {
      win = true;
    }
    return win;
  };

  return { placeMark, getBoard, checkWin };
})();

const Player;
