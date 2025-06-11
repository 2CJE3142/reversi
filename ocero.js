const SIZE = 8;
const EMPTY = 0, BLACK = 1, WHITE = 2;
let board, currentPlayer;

const directions = [
  [-1, -1], [-1, 0], [-1, 1],
  [0, -1],          [0, 1],
  [1, -1], [1, 0], [1, 1]
];

const boardElem = document.getElementById("board");
const statusElem = document.getElementById("status");
const resetBtn = document.getElementById("reset");

resetBtn.addEventListener("click", () => startGame());

function startGame() {
  board = Array.from({ length: SIZE }, () => Array(SIZE).fill(EMPTY));
  currentPlayer = BLACK;
  initBoard();
  drawBoard();
  updateStatus();
}

function initBoard() {
  board[3][3] = WHITE;
  board[3][4] = BLACK;
  board[4][3] = BLACK;
  board[4][4] = WHITE;
}

function drawBoard() {
  boardElem.innerHTML = "";
  for (let y = 0; y < SIZE; y++) {
    const row = document.createElement("tr");
    for (let x = 0; x < SIZE; x++) {
      const cell = document.createElement("td");
      if (board[y][x] === BLACK) {
        const disc = document.createElement("div");
        disc.className = "black";
        cell.appendChild(disc);
      } else if (board[y][x] === WHITE) {
        const disc = document.createElement("div");
        disc.className = "white";
        cell.appendChild(disc);
      }
      cell.addEventListener("click", () => handleMove(x, y));
      row.appendChild(cell);
    }
    boardElem.appendChild(row);
  }
}

function isOnBoard(x, y) {
  return x >= 0 && y >= 0 && x < SIZE && y < SIZE;
}

function getFlippableDiscs(x, y, player) {
  if (board[y][x] !== EMPTY) return [];
  let opponent = player === BLACK ? WHITE : BLACK;
  let result = [];

  for (let [dx, dy] of directions) {
    let i = 1;
    let flips = [];
    while (true) {
      let nx = x + dx * i;
      let ny = y + dy * i;
      if (!isOnBoard(nx, ny) || board[ny][nx] === EMPTY) break;
      if (board[ny][nx] === opponent) {
        flips.push([nx, ny]);
      } else if (board[ny][nx] === player) {
        if (flips.length) result.push(...flips);
        break;
      } else {
        break;
      }
      i++;
    }
  }

  return result;
}

function handleMove(x, y) {
  let flips = getFlippableDiscs(x, y, currentPlayer);
  if (!flips.length) return;

  board[y][x] = currentPlayer;
  for (let [fx, fy] of flips) {
    board[fy][fx] = currentPlayer;
  }

  currentPlayer = currentPlayer === BLACK ? WHITE : BLACK;

  if (!hasAnyValidMove(currentPlayer)) {
    currentPlayer = currentPlayer === BLACK ? WHITE : BLACK;
    if (!hasAnyValidMove(currentPlayer)) {
      endGame();
      return;
    } else {
      alert("パスされました");
    }
  }

  updateStatus();
  drawBoard();
}

function hasAnyValidMove(player) {
  for (let y = 0; y < SIZE; y++) {
    for (let x = 0; x < SIZE; x++) {
      if (getFlippableDiscs(x, y, player).length) return true;
    }
  }
  return false;
}

function countDiscs() {
  let black = 0, white = 0;
  for (let y = 0; y < SIZE; y++) {
    for (let x = 0; x < SIZE; x++) {
      if (board[y][x] === BLACK) black++;
      if (board[y][x] === WHITE) white++;
    }
  }
  return { black, white };
}

function updateStatus() {
  const { black, white } = countDiscs();
  statusElem.textContent = `黒: ${black} 白: ${white} 現在の手番: ${currentPlayer === BLACK ? "黒" : "白"}`;
}

function endGame() {
  const { black, white } = countDiscs();
  let result = "引き分け";
  if (black > white) result = "黒の勝ち！";
  if (white > black) result = "白の勝ち！";
  alert(`ゲーム終了\n黒: ${black} 白: ${white}\n${result}`);
  statusElem.textContent = `ゲーム終了 - ${result}`;
}

startGame();
