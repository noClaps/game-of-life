const WIDTH = Math.floor(innerWidth / 16);
const HEIGHT = Math.floor(innerHeight / 16);
const THRESHOLD = 0.75;

function mod(a: number, b: number) {
  return ((a % b) + b) % b;
}

function index(r: number, c: number) {
  return r * WIDTH + c;
}

function readBoard(): Uint8Array {
  const trows = document.querySelectorAll("tr");
  const board = new Uint8Array(HEIGHT * WIDTH);

  for (let r = 0; r < trows.length; r++) {
    for (let c = 0; c < trows[r].cells.length; c++) {
      board[index(r, c)] = trows[r].cells[c].className === "alive" ? 1 : 0;
    }
  }

  return board;
}

function createBoard(type: "random" | "blank"): Uint8Array {
  switch (type) {
    case "random": {
      const arr = new Uint8Array(HEIGHT * WIDTH);
      for (const i in arr) {
        arr[i] = Math.random() > THRESHOLD ? 1 : 0;
      }
      return arr;
    }
    case "blank": {
      return new Uint8Array(HEIGHT * WIDTH);
    }
  }
}

function drawBoard(board: Uint8Array, initial = false) {
  const main = document.querySelector("main")!;

  let boardHtml = "<table>";
  for (let r = 0; r < HEIGHT; r++) {
    boardHtml += "<tr>";
    for (let c = 0; c < WIDTH; c++) {
      if (board[index(r, c)] === 1) {
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

function advanceStep(board: Uint8Array) {
  const newBoard = structuredClone(board);
  for (let r = 0; r < HEIGHT; r++) {
    for (let c = 0; c < WIDTH; c++) {
      let neighbors = 0;
      // Check north
      if (board[index(mod(r - 1, HEIGHT), c)]) neighbors++;
      // Check northeast
      if (board[index(mod(r - 1, HEIGHT), mod(c + 1, WIDTH))]) neighbors++;
      // Check east
      if (board[index(r, mod(c + 1, WIDTH))]) neighbors++;
      // Check southeast
      if (board[index(mod(r + 1, HEIGHT), mod(c + 1, WIDTH))]) neighbors++;
      // Check south
      if (board[index(mod(r + 1, HEIGHT), c)]) neighbors++;
      // Check southwest
      if (board[index(mod(r + 1, HEIGHT), mod(c - 1, WIDTH))]) neighbors++;
      // Check west
      if (board[index(r, mod(c - 1, WIDTH))]) neighbors++;
      // Check northwest
      if (board[index(mod(r - 1, HEIGHT), mod(c - 1, WIDTH))]) neighbors++;

      // Fewer than 2 neighbors, dies
      if (neighbors < 2) newBoard[index(r, c)] = 0;
      // More than 3 neighbors, dies
      if (neighbors > 3) newBoard[index(r, c)] = 0;
      // Exactly 3 neighbors, dead cell becomes alive
      if (neighbors === 3) newBoard[index(r, c)] = 1;
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
  let timer: number;

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
        playPause.checked = false;
        paused = true;
        clearInterval(timer);
        drawBoard(board, true); // Set event listeners again
        return;
      }
      playPause.checked = true;
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
