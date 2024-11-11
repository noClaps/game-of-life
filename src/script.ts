const WIDTH = Math.floor(innerWidth / 8);
const HEIGHT = Math.floor(innerHeight / 8);
const THRESHOLD = 0.9;

console.log(HEIGHT, WIDTH);

let board = new Array(HEIGHT)
  .fill(0)
  .map(() =>
    new Array<0 | 1>(WIDTH)
      .fill(0)
      .map(() => (Math.random() > THRESHOLD ? 1 : 0)),
  );

function drawBoard(board: (0 | 1)[][]) {
  let boardHtml = "<table>";
  for (let row = 0; row < board.length; row++) {
    boardHtml += "<tr>";
    for (let column = 0; column < board[row].length; column++) {
      if (board[row][column] === 1) {
        boardHtml += `<td class="alive" />`;
      } else {
        boardHtml += `<td class="dead" />`;
      }
    }
    boardHtml += "</tr>";
  }

  boardHtml += "</table>";
  document.body.innerHTML = boardHtml;
}

drawBoard(board);

function advanceStep(board: (0 | 1)[][]) {
  const newBoard = board;
  for (let row = 0; row < board.length; row++) {
    for (let col = 0; col < board[row].length; col++) {
      let neighbors = 0;
      // Check north
      if (row - 1 >= 0 && board[row - 1][col] === 1) neighbors++;

      // Check northeast
      if (row - 1 >= 0 && col + 1 < WIDTH && board[row - 1][col + 1] === 1)
        neighbors++;

      // Check east
      if (col + 1 < WIDTH && board[row][col + 1] === 1) neighbors++;

      // Check southeast
      if (row + 1 < HEIGHT && col + 1 < WIDTH && board[row + 1][col + 1] === 1)
        neighbors++;

      // Check south
      if (row + 1 < HEIGHT && board[row + 1][col] === 1) neighbors++;

      // Check southwest
      if (row + 1 < HEIGHT && col - 1 >= 0 && board[row + 1][+col - 1] === 1)
        neighbors++;

      // Check west
      if (col - 1 >= 0 && board[row][col - 1] === 1) neighbors++;

      // Check northwest
      if (row - 1 >= 0 && col - 1 >= 0 && board[row - 1][col - 1] === 1)
        neighbors++;

      // Fewer than 2 neighbors, dies
      if (neighbors < 2) newBoard[row][col] = 0;
      // More than 3 neighbors, dies
      if (neighbors > 3) newBoard[row][col] = 0;
      // Exactly 3 neighbors, dead cell becomes alive
      if (neighbors === 3) newBoard[row][col] = 1;
    }
  }

  return newBoard;
}

let timer = setInterval(() => {
  board = advanceStep(board);
  drawBoard(board);
}, 100);

addEventListener("keyup", (e: KeyboardEvent) => {
  if (e.ctrlKey && e.key === "c") {
    clearInterval(timer);
  }
});
