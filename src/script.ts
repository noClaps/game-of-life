const WIDTH = Math.floor(innerWidth / 16);
const HEIGHT = Math.floor(innerHeight / 16);
const THRESHOLD = 0.75;

function createBoard(type: "random" | "blank"): (0 | 1)[][] {
  switch (type) {
    case "random":
      return new Array(HEIGHT)
        .fill(0)
        .map(() =>
          new Array<0 | 1>(WIDTH)
            .fill(0)
            .map(() => (Math.random() > THRESHOLD ? 1 : 0)),
        );
    case "blank":
      return new Array(HEIGHT)
        .fill(0)
        .map(() => new Array<0 | 1>(WIDTH).fill(0));
  }
}

function readBoard(): (0 | 1)[][] {
  const trows = document.querySelectorAll("tr")!;
  const board: (0 | 1)[][] = [];

  for (const tr of Array.from(trows)) {
    const boardRow: (0 | 1)[] = Array.from(tr.cells).map((td) =>
      td.classList.contains("alive") ? 1 : 0,
    );
    board.push(boardRow);
  }

  return board;
}

function drawBoard(board: (0 | 1)[][], initial: boolean = false) {
  const main = document.querySelector("main")!;

  let boardHtml = "<table>";
  for (let row = 0; row < board.length; row++) {
    boardHtml += "<tr>";
    for (let column = 0; column < board[row].length; column++) {
      if (board[row][column] === 1) {
        boardHtml += `<td class="alive"></td>`;
      } else {
        boardHtml += `<td></td>`;
      }
    }
    boardHtml += "</tr>";
  }

  boardHtml += "</table>";
  main.innerHTML = boardHtml;

  if (initial) {
    const cells = document.querySelectorAll("td");
    cells.forEach((cell) =>
      cell.addEventListener("click", () => {
        cell.classList.toggle("alive");
      }),
    );
  }
}

function advanceStep(board: (0 | 1)[][]) {
  const newBoard = structuredClone(board);
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

function main() {
  // Start game paused to allow player to edit
  let paused = true;

  // Initially create random board (sets board to edit mode)
  let board = createBoard("random");
  drawBoard(board, true);

  // Timer for setInterval() and clearInterval()
  let timer: Timer;

  // Clear board (sets board to edit mode)
  const clearButton = document.querySelector<HTMLButtonElement>("#clear")!;
  clearButton.addEventListener("click", () => {
    if (!paused) return;

    board = createBoard("blank");
    drawBoard(board, true);
  });

  // Go to next step (sets board to edit mode)
  const stepButton = document.querySelector<HTMLButtonElement>("#step")!;
  stepButton.addEventListener("click", () => {
    if (!paused) return;

    board = readBoard();
    board = advanceStep(board);
    drawBoard(board, true); // Allow modifying the board after each step
  });

  // Generate random board (sets board to edit mode)
  const randomButton = document.querySelector<HTMLButtonElement>("#random")!;
  randomButton.addEventListener("click", () => {
    if (!paused) return;

    board = createBoard("random");
    drawBoard(board, true);
  });

  // Play pause button
  const playPause = document.querySelector<HTMLInputElement>("#play-pause")!;
  playPause.addEventListener("click", () => {
    if (!paused) {
      paused = true;
      clearInterval(timer);
      drawBoard(board, true); // Set event listeners again
      return;
    }
    paused = false;
    board = readBoard();
    timer = setInterval(() => {
      board = advanceStep(board);
      drawBoard(board);
    }, 100);
  });

  // Setting keybinds
  document.addEventListener("keydown", (ev) => {
    // Play/pause keybind <space>
    if (ev.key === " ") {
      if (!paused) {
        paused = true;
        clearInterval(timer);
        drawBoard(board, true); // Set event listeners again
        return;
      }
      paused = false;
      board = readBoard();
      timer = setInterval(() => {
        board = advanceStep(board);
        drawBoard(board);
      }, 100);
      return;
    }

    // Step (when paused) keybind <rightarrow>
    if (ev.key === "ArrowRight" && paused) {
      board = readBoard();
      board = advanceStep(board);
      drawBoard(board, true); // Allow modifying the board after each step
    }

    // Clear screen keybind <ctrl-C>
    if (ev.key === "c" && ev.ctrlKey && paused) {
      board = createBoard("blank");
      drawBoard(board, true);
    }

    // Random board keybind <ctrl-R>
    if (ev.key === "r" && ev.ctrlKey && paused) {
      board = createBoard("random");
      drawBoard(board, true);
    }
  });
}

main();
