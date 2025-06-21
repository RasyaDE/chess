const express = require('express')
const socket = require('socket.io')
const http = require('http')
const { Chess } = require('chess.js')
const path = require('path')

//express and socket
const app = express()
const port = 3000

const server = http.createServer(app)
const io = socket(server)

// chess
const chess = new Chess()
let players = {}
let currentPlayer = "W"

// set ejs
app.set('view engine', 'ejs')
app.use(express.static(path.join(__dirname, 'public')))

app.get('/', (req,res) => {
  res.render('index', {title: 'Toschess'})
})

io.on('connection', (uniqueSocket) => {
  console.log('connected')


  // handle player
  if(!players.white) {
    players.white = uniqueSocket.id
    uniqueSocket.emit('playerRole', 'w')
  } else if(!players.black) {
    players.black = uniqueSocket.id
    uniqueSocket.emit('playerRole', 'b')
  } else {
    uniqueSocket.emit('spectatorRole')
  }

  //handle player disconnect
  uniqueSocket.on('disconnect', () => {
    console.log('disconnect');
    if(uniqueSocket.id === players.black) {
      delete players.white
    } else if(uniqueSocket.id === players.white) {
      delete players.black
    }
  })

  uniqueSocket.on('move', (move) => {
    try {
      if(chess.turn() === 'w' && uniqueSocket.id !== players.white) return
      if(chess.turn() === 'b' && uniqueSocket.id !== players.black) return

      const result = chess.move(move)
      if(result) {
        currentPlayer = chess.turn()
        io.emit('move', move)
        io.emit('boardState', chess.fen())
      } else {
        console.log('invalid move:', move);
        uniqueSocket.emit('invalidMove', move)
      }
    } catch (error) {
      console.log(error);
      console.log('invalid move:', move)
    }
  })
})

server.listen(port, () => {
  console.log('listening on port 3000')
})
