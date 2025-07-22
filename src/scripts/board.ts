import { CELL_SIZE, HEIGHT, THRESHOLD, WIDTH, index, mod } from "./utils";

export function createBoardHTML() {
  const main = document.querySelector("main")!;
  const table = document.createElement("table");

  for (let r = 0; r < HEIGHT; r++) {
    const tr = document.createElement("tr");
    for (let c = 0; c < WIDTH; c++) {
      const td = document.createElement("td");
      td.style.width = `${CELL_SIZE}px`;
      td.style.height = `${CELL_SIZE}px`;
      td.dataset.index = `${index(r, c)}`;
      tr.appendChild(td);
    }
    table.appendChild(tr);
  }

  main.replaceChildren(table);
}

export function createBoard(type: "empty" | "random"): Uint8Array {
  if (type === "empty") return new Uint8Array(HEIGHT * WIDTH);

  const board = new Uint8Array(HEIGHT * WIDTH);
  for (let i = 0; i < board.length; i++) {
    board[i] = Math.random() > THRESHOLD ? 1 : 0;
  }
  return board;
}

export function advanceStep(board: Uint8Array): Uint8Array {
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
