import { advanceStep, createBoard, createBoardHTML } from "./scripts/board";
import { HEIGHT, STEP_TIME, WIDTH, diff } from "./scripts/utils";

// Create board
createBoardHTML();
let board = createBoard("random");
diff(board, new Uint8Array(WIDTH * HEIGHT));

// Start game paused to allow player to edit
let paused = true;

document.querySelectorAll("td").forEach((td) =>
  td.addEventListener("click", () => {
    if (!paused) return;

    const index = Number.parseInt(td.dataset.index!)!;
    const alive = td.classList.toggle("alive");
    board[index] = alive ? 1 : 0;
  }),
);

// Timer for setInterval() and clearInterval()
let timer: number;

// Clear board
const clearButton = document.querySelector<HTMLButtonElement>("#clear")!;
clearButton.addEventListener("click", () => {
  if (!paused) return;

  const newBoard = createBoard("empty");
  diff(board, newBoard);
  board = newBoard;
});

// Go to next step
const stepButton = document.querySelector<HTMLButtonElement>("#step")!;
stepButton.addEventListener("click", () => {
  if (!paused) return;

  const newBoard = advanceStep(board);
  diff(board, newBoard);
  board = newBoard;
});

// Generate random board
const randomButton = document.querySelector<HTMLButtonElement>("#random")!;
randomButton.addEventListener("click", () => {
  if (!paused) return;

  const newBoard = createBoard("random");
  diff(board, newBoard);
  board = newBoard;
});

// Play pause button
const playPause = document.querySelector<HTMLInputElement>("#play-pause")!;
playPause.addEventListener("click", () => {
  if (!paused) {
    paused = true;
    clearInterval(timer);
    return;
  }
  paused = false;
  timer = setInterval(() => {
    const newBoard = advanceStep(board);
    diff(board, newBoard);
    board = newBoard;
  }, STEP_TIME);
});

// Setting keybinds
document.addEventListener("keydown", (ev) => {
  // Play/pause keybind <space>
  if (ev.key === " ") {
    if (!paused) {
      playPause.checked = false;
      paused = true;
      clearInterval(timer);
      return;
    }
    playPause.checked = true;
    paused = false;
    timer = setInterval(() => {
      const newBoard = advanceStep(board);
      diff(board, newBoard);
      board = newBoard;
    }, STEP_TIME);
    return;
  }

  // Step (when paused) keybind <rightarrow>
  if (ev.key === "ArrowRight" && paused) {
    const newBoard = advanceStep(board);
    diff(board, newBoard);
    board = newBoard;
  }

  // Clear screen keybind <ctrl-C>
  if (ev.key === "c" && ev.ctrlKey && paused) {
    const newBoard = createBoard("empty");
    diff(board, newBoard);
    board = newBoard;
  }

  // Random board keybind <ctrl-R>
  if (ev.key === "r" && ev.ctrlKey && paused) {
    const newBoard = createBoard("random");
    diff(board, newBoard);
    board = newBoard;
  }
});
