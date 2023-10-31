// Inicializar el tablero
const BOARD_WIDTH = 10;
const BOARD_HEIGHT = 20;
const board = [];
let rotatedShape;
let gameOver = false;
let currentTetromino;

// iniciar tablero
for (let row = 0; row < BOARD_HEIGHT; row++) {
  board[row] = [];
  for (let col = 0; col < BOARD_WIDTH; col++) {
    board[row][col] = 0;
  }
}

// Tetrominos
const Tetrominos = [
  {
    shape: [
      [1, 1],
      [1, 1],
    ],
    color: "#ffd800",
  },
  {
    shape: [
      [0, 2, 0],
      [2, 2, 2],
    ],
    color: "#7925DD",
  },
  {
    shape: [
      [0, 3, 3],
      [3, 3, 0],
    ],
    color: "orange",
  },
  {
    shape: [
      [4, 4, 0],
      [0, 4, 4],
    ],
    color: "red",
  },
  {
    shape: [
      [5, 0, 0],
      [5, 5, 5],
    ],
    color: "green",
  },
  {
    shape: [
      [0, 0, 6],
      [6, 6, 6],
    ],
    color: "#ff6400 ",
  },
  { shape: [[7, 7, 7, 7]], color: "#00b5ff" },
];

// Randomizador de tetrominos
function randomTetromino() {
  const index = Math.floor(Math.random() * Tetrominos.length);
  const tetromino = Tetrominos[index];
  return {
    shape: tetromino.shape,
    color: tetromino.color,
    row: 0,
    col: Math.floor(Math.random() * (BOARD_WIDTH - tetromino.shape[0].length + 1)),
  };
}
// Tetromino actual
currentTetromino = randomTetromino();
let currentGhostTetromino;

// Dibujar tetromino
function drawTetromino() {
  if (gameOver) {
    return;
  }
  const shape = currentTetromino.shape;
  const color = currentTetromino.color;
  const row = currentTetromino.row;
  const col = currentTetromino.col;

  for (let r = 0; r < shape.length; r++) {
    for (let c = 0; c < shape[r].length; c++) {
      if (shape[r][c]) {
        const block = document.createElement("div");
        block.classList.add("block");
        block.style.backgroundColor = color;
        block.style.top = (row + r) * 32 + "px";
        block.style.left = (col + c) * 32 + "px";
        block.setAttribute("id", `block-${row + r}-${col + c}`);
        document.getElementById("game_board").appendChild(block);
      }
    }
  }
}

// Borrar tetromino del tablero
function eraseTetromino() {
  for (let i = 0; i < currentTetromino.shape.length; i++) {
    for (let j = 0; j < currentTetromino.shape[i].length; j++) {
      if (currentTetromino.shape[i][j] !== 0) {
        let row = currentTetromino.row + i;
        let col = currentTetromino.col + j;
        let block = document.getElementById(`block-${row}-${col}`);

        if (block) {
          document.getElementById("game_board").removeChild(block);
        }
      }
    }
  }
}




// Verificar si el tetromino se puede mover en la dirección especificada
function canTetrominoMove(rowOffset, colOffset) {
  for (let i = 0; i < currentTetromino.shape.length; i++) {
    for (let j = 0; j < currentTetromino.shape[i].length; j++) {
      if (currentTetromino.shape[i][j] !== 0) {
        let row = currentTetromino.row + i + rowOffset;
        let col = currentTetromino.col + j + colOffset;

        if (row >= BOARD_HEIGHT || col < 0 || col >= BOARD_WIDTH || (row >= 0 && board[row][col] !== 0)) {
          return false;
        }
      }
    }
  }
  return true;
}

// Verificar si el tetromino puede rotar en la dirección especificada
function canTetrominoRotate() {
  for (let i = 0; i < rotatedShape.length; i++) {
    for (let j = 0; j < rotatedShape[i].length; j++) {
      if (rotatedShape[i][j] !== 0) {
        let row = currentTetromino.row + i;
        let col = currentTetromino.col + j;

        if (row >= BOARD_HEIGHT || col < 0 || col >= BOARD_WIDTH || (row >= 0 && board[row][col] !== 0)) {
          return false;
        }
      }
    }
  }
  return true;
}

// Bloquear el tetromino en el lugar
function lockTetromino() {
  // Agregar el tetromino al tablero
  for (let i = 0; i < currentTetromino.shape.length; i++) {
    for (let j = 0; j < currentTetromino.shape[i].length; j++) {
      if (currentTetromino.shape[i][j] !== 0) {
        let row = currentTetromino.row + i;
        let col = currentTetromino.col + j;
        board[row][col] = currentTetromino.color;
      }
    }
  }

  // Verificar si se completaron filas
  let rowsCleared = clearRows();

  // Tetromino actual
  currentTetromino = randomTetromino();
}

function clearRows() {
  let rowsCleared = 0;

  // Escanear el tablero de abajo hacia arriba para verificar si se completaron filas
  for (let y = BOARD_HEIGHT - 1; y >= 0; y--) {
    let rowFilled = true;

    for (let x = 0; x < BOARD_WIDTH; x++) {
      if (board[y][x] === 0) {
        rowFilled = false;
        break;
      }
    }

    if (rowFilled) {
      rowsCleared++;

      for (let yy = y; yy > 0; yy--) {
        for (let x = 0; x < BOARD_WIDTH; x++) {
          board[yy][x] = board[yy - 1][x];
        }
      }

      for (let x = 0; x < BOARD_WIDTH; x++) {
        board[0][x] = 0;
      }
      document.getElementById("game_board").innerHTML = "";
      for (let row = 0; row < BOARD_HEIGHT; row++) {
        for (let col = 0; col < BOARD_WIDTH; col++) {
          if (board[row][col]) {
            const block = document.createElement("div");
            block.classList.add("block");
            block.style.backgroundColor = board[row][col];
            block.style.top = row * 32 + "px";
            block.style.left = col * 32 + "px";
            block.setAttribute("id", `block-${row}-${col}`);
            document.getElementById("game_board").appendChild(block);
          }
        }
      }

      y++;
    }
  }

  return rowsCleared;
}

$(document).ready(function () {
  $("#gameboard").hide();
  $("#boton").click(function (e) {
    e.preventDefault();
    $("#boton").animate({ opacity: "0" }, 1000);
    $(".logo").delay(1000).animate({ marginTop: "-100px" }, 1000);
    $("#game_board").delay(2000).show(1000);




    // Rotar tetromino
    function rotateTetromino() {
      if (gameOver) {
        return;
      }
      rotatedShape = [];
      for (let i = 0; i < currentTetromino.shape[0].length; i++) {
        let row = [];
        for (let j = currentTetromino.shape.length - 1; j >= 0; j--) {
          row.push(currentTetromino.shape[j][i]);
        }
        rotatedShape.push(row);
      }

      // Verificar si el tetromino rotado se puede mover
      if (canTetrominoRotate()) {
        eraseTetromino();
        currentTetromino.shape = rotatedShape;
        drawTetromino();
      }

      moveGhostTetromino();
    }

    // Mover tetromino
    function moveTetromino(direction) {
      if (gameOver) {
        return;
      }
      let row = currentTetromino.row;
      let col = currentTetromino.col;
      if (direction === "left") {
        if (canTetrominoMove(0, -1)) {
          eraseTetromino();
          col -= 1;
          currentTetromino.col = col;
          currentTetromino.row = row;
          drawTetromino();
        }
      } else if (direction === "right") {
        if (canTetrominoMove(0, 1)) {
          eraseTetromino();
          col += 1;

          currentTetromino.col = col;
          currentTetromino.row = row;
          drawTetromino();
        }
      } else {
        if (canTetrominoMove(1, 0)) {
          eraseTetromino();
          row++;
          currentTetromino.col = col;
          currentTetromino.row = row;
          drawTetromino();
        } else if (row <= 0) {

          gameOver = true;
        } else {

          lockTetromino();
        }
      }

      moveGhostTetromino();
    }

    drawTetromino();
    setInterval(moveTetromino, 1000);

    document.addEventListener("keydown", handleKeyPress);

    function handleKeyPress(event) {
      console.log(event.keyCode)
      switch (event.keyCode) {
        case 37: // flecha izquierda
          moveTetromino("left");
          break;
        case 39: // flecha derecha
          moveTetromino("right");
          break;
        case 40: // flecha abajo
          moveTetromino("down");
          break;
        case 38: // flecha arriba
          rotateTetromino();
          break;
        case 32: // espacio
          dropTetromino();
          break;
        default:
          break;
      }
    }

    function dropTetromino() {
      let row = currentTetromino.row;
      let col = currentTetromino.col;

      while (canTetrominoMove(1, 0)) {
        eraseTetromino();
        row++;
        currentTetromino.col = col;
        currentTetromino.row = row;
        drawTetromino();
      }
      lockTetromino();
    }

    // Draw Ghost tetromino
    function drawGhostTetromino() {
      if (gameOver) {
        return;
      }
      const shape = currentGhostTetromino.shape;
      const color = "rgba(255,255,255,0.5)";
      const row = currentGhostTetromino.row;
      const col = currentGhostTetromino.col;

      for (let r = 0; r < shape.length; r++) {
        for (let c = 0; c < shape[r].length; c++) {
          if (shape[r][c]) {
            const block = document.createElement("div");
            block.classList.add("ghost");
            block.style.backgroundColor = color;
            block.style.top = (row + r) * 32 + "px";
            block.style.left = (col + c) * 32 + "px";
            block.setAttribute("id", `ghost-${row + r}-${col + c}`);
            document.getElementById("game_board").appendChild(block);
          }
        }
      }
    }

    function eraseGhostTetromino() {
      const ghost = document.querySelectorAll(".ghost");
      for (let i = 0; i < ghost.length; i++) {
        ghost[i].remove();
      }
    }

    // Check if tetromino can move in the specified direction
    function canGhostTetrominoMove(rowOffset, colOffset) {
      for (let i = 0; i < currentGhostTetromino.shape.length; i++) {
        for (let j = 0; j < currentGhostTetromino.shape[i].length; j++) {
          if (currentGhostTetromino.shape[i][j] !== 0) {
            let row = currentGhostTetromino.row + i + rowOffset;
            let col = currentGhostTetromino.col + j + colOffset;

            if (row >= BOARD_HEIGHT || col < 0 || col >= BOARD_WIDTH || (row >= 0 && board[row][col] !== 0)) {
              return false;
            }
          }
        }
      }
      return true;
    }

    function moveGhostTetromino() {
      eraseGhostTetromino();

      currentGhostTetromino = { ...currentTetromino };
      while (canGhostTetrominoMove(1, 0)) {
        currentGhostTetromino.row++;
      }

      function lostGame() {

      }

      drawGhostTetromino();
    }
  })
});
