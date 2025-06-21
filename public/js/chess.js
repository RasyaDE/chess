const socket = io();
const chess = new Chess()
const boardElement = document.querySelector('.chessboard')

let draggedPiece = null
let sourceSquare = null
let playerRole = null

const renderBoard = () => {
  const board = chess.board()
  boardElement.innerHTML = ""
  board.forEach((row, rowIndex) => {
    row.forEach((col, colIndex ) => {
      const colElement = document.createElement('div')
      colElement.classList.add('square',
        (rowIndex + colIndex) % 2 === 0 ? 'light' : 'dark'
      )
      colElement.dataset.row = rowIndex
      colElement.dataset.col = colIndex

      if(col) {
        const pieceElement = document.createElement('div')
        pieceElement.classList.add('piece', col.color === 'w' ? 'white' : 'black')
        pieceElement.innerText = ''
        pieceElement.dragged = playerRole === col.square

        pieceElement.addEventListener('dragstart', (e) => {
          if(pieceElement.draggable) {
            draggedPiece = pieceElement
            sourceSquare = {row: rowIndex, col: colIndex}
            e.dataTransfer.setData('text/plain', '')
          }
        })

        pieceElement.addEventListener('dragend', (e) => {
          draggedPiece = null
          sourceSquare = null
        })

        colElement.appendChild(pieceElement)
      }

      colElement.addEventListener('dragover', (e) => {
        e.preventDefault()
      })

      colElement.addEventListener('drop', (e) => {
        e.preventDefault()
        if(draggedPiece) {
          const targetSource = {
            row: parseInt(colElement.dataset.row),
            col: parseInt(colElement.dataset.col)
          }
          handleMove(sourceSquare, targetSource)
        }
      })
      boardElement.append(colElement)
    });
  });
}
const handleMove = () => {}
const getPieceUnicode = () => {}

renderBoard()
