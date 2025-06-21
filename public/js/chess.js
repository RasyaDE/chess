const socket = io();
const chess = new Chess();
const boardElement = document.querySelector('.chessboard');

let draggedPiece = null;
let sourceSquare = null;
let playerRole = null;

const getPieceImage = (piece) => {
  return `https://chessboardjs.com/img/chesspieces/wikipedia/${piece}.png`;
};

const renderBoard = () => {
  const board = chess.board();
  boardElement.innerHTML = "";

  const rows = [...board.keys()];
  const cols = [...Array(8).keys()];
  if (playerRole === 'b') {
    rows.reverse();
    cols.reverse();
  }

  rows.forEach((rowIndex) => {
    cols.forEach((colIndex) => {
      const colElement = document.createElement('div');
      colElement.classList.add(
        'square',
        (rowIndex + colIndex) % 2 === 0 ? 'light' : 'dark'
      );
      colElement.dataset.row = rowIndex;
      colElement.dataset.col = colIndex;

      const col = board[rowIndex][colIndex];
      if (col) {
        const pieceElement = document.createElement('div');
        pieceElement.classList.add('piece');

        const pieceCode = col.color + col.type.toUpperCase();
        const img = document.createElement('img');
        img.src = getPieceImage(pieceCode);
        img.draggable = false;

        const isMyPiece = playerRole === col.color;
        pieceElement.setAttribute('draggable', isMyPiece);

        pieceElement.appendChild(img);

        pieceElement.addEventListener('dragstart', (e) => {
          if (isMyPiece) {
            draggedPiece = pieceElement;
            sourceSquare = { row: rowIndex, col: colIndex };
            e.dataTransfer.setData('text/plain', '');
          }
        });

        pieceElement.addEventListener('dragend', () => {
          draggedPiece = null;
          sourceSquare = null;
        });

        colElement.appendChild(pieceElement);
      }

      colElement.addEventListener('dragover', (e) => e.preventDefault());
      colElement.addEventListener('drop', (e) => {
        e.preventDefault();
        if (draggedPiece) {
          const targetSource = {
            row: parseInt(colElement.dataset.row),
            col: parseInt(colElement.dataset.col)
          };
          handleMove(sourceSquare, targetSource);
        }
      });

      boardElement.append(colElement);
    });
  });
};

const handleMove = (source, target) => {
  const move = {
    from: `${String.fromCharCode(97 + source.col)}${8 - source.row}`,
    to: `${String.fromCharCode(97 + target.col)}${8 - target.row}`,
    promotion: 'q'
  };
  socket.emit('move', move);
};

// socket.io events
socket.on('playerRole', (role) => {
  playerRole = role;
  renderBoard();
});

socket.on('spectatorRole', () => {
  playerRole = null;
  renderBoard();
});

socket.on('boardState', (fen) => {
  chess.load(fen);
  renderBoard();
});

socket.on('move', (fen) => {
  chess.load(fen);
  renderBoard();
});

renderBoard();
