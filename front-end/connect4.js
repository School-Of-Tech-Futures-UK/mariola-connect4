// TODO:
// Improve UI (gradient colour board? place elements horizontally)

// AI TODO:
// New branch for AI player
// Keep track of human moves

const { Connect4AI } = require('connect4-ai')

// ------------------------ DIRTY LAYER ------------------------

// let game = new Connect4AI()

// gameState object
let gameState = {
  turn: 0,
  player: 'Red',
  winner: null,
  board: [
    [null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null]
  ],
  finalScore: 0,
  winningPlayer: 'nobody',
  redPlayerName: null,
  highScores: [],
  game: new Connect4AI(),
  humanMoves: []
}

// gridClick is called every time a user clicks on the board
// eslint-disable-next-line no-unused-vars
async function gridClick (e) {
  const id = e.target.id
  const column = id[8]

  console.log(gameState)
  const returnedTurn = takeTurn(gameState, column)

  gameState = returnedTurn[0]

  const move = returnedTurn[1]

  if (move) {
    gameState.humanMoves.push(move)
  }

  if (gameState.winner != null) { // i.e. someone has won
    if (gameState.winner === 'Red') {
      gameState.redPlayerName = document.getElementById('red-input').value
      gameState.winningPlayer = gameState.redPlayerName
    } else if (gameState.winner === 'Yellow') {
      gameState.yellowPlayerName = document.getElementById('yellow-input').value
      gameState.winningPlayer = 'Robot'
    }
    await sendScore(gameState)
    gameState.highScores = await getHighScores()
  }
  drawBoard(gameState)

  gameState.humanMoves.forEach(humanPlay => {
    handlePlay(() => gameState.game.play(humanPlay))
    handlePlay(() => gameState.game.playAI('hard')) // or 'easy' or 'medium'
  })
}

function handlePlay (playFunction) {
  if (gameState.winner != null) return
  playFunction()
}

// async function winnerChecks(state) {
//   if (state.winner != null) { // i.e. someone has won
//     if (state.winner === 'Red') {
//       state.redPlayerName = document.getElementById('red-input').value
//       state.winningPlayer = state.redPlayerName
//     } else if (state.winner === 'Yellow') {
//       state.yellowPlayerName = document.getElementById('yellow-input').value
//       state.winningPlayer = state.yellowPlayerName
//     }
//     await sendScore(state)
//     state.highScores = await getHighScores()
//   }
// }

// resetGame is called when a user clicks on the reset button
// eslint-disable-next-line no-unused-vars
function resetGame () {
  gameState = reset(gameState)
  clearBoard()
}

async function sendScore (state) {
  if (state.winner === 'nobody') {
    return
  }
  const data = { player: state.winningPlayer, score: state.finalScore, colour: state.winner }
  await fetch('http://localhost:3000/scores', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
}

async function getHighScores () {
  const req = await fetch('http://localhost:3000/scores')
  const scores = await req.json() // This is an array of {player: name, score: , colour: } objects
  return scores
}

// ------------------------ PURE FUNCTIONS ------------------------

function takeTurn (state, col) {
  const newState = JSON.parse(JSON.stringify(state))

  const lowestFreeRow = getLowestFreeRowInColumn(col, newState.board)

  let moveMade = false

  if (lowestFreeRow !== null && newState.winner == null && newState.turn < 43) {
    newState.turn++
    moveMade = col + 1

    if (newState.player === 'Red') {
      newState.board[lowestFreeRow][col] = 'Red'
      newState.player = 'Yellow'
    } else {
      newState.board[lowestFreeRow][col] = 'Yellow'
      newState.player = 'Red'
    }
  }

  newState.winner = checkWinner(newState)
  if (newState.winner != null) {
    newState.finalScore = 42 - newState.turn
  }
  return [newState, moveMade]
}

// Try findIndex
function getLowestFreeRowInColumn (colNumber, grid) {
  for (let i = 5; i >= 0; i--) {
    if (grid[i][colNumber] === null) {
      return i
    }
  }
  return null
}

// eslint-disable-next-line no-unused-vars
function reset (state) {
  const newState = JSON.parse(JSON.stringify(state))

  newState.turn = 0
  newState.player = 'Red'
  newState.board = [
    [null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null]
  ]
  newState.winner = null
  newState.finalScore = 0
  newState.winningPlayer = 'nobody'
  newState.winningColour = null
  // newState.game = new Connect4AI()
  newState.humanMoves = []

  return newState
}

function checkWinner (state) {
  const rowWin = checkRows(state)
  const columnWin = checkColumns(state)
  const diagWin = checkDiagonals(state)
  const counterDiagWin = checkCounterDiagonals(state)
  if (rowWin != null) {
    return rowWin
  } else if (columnWin != null) {
    return columnWin
  } else if (diagWin != null) {
    return diagWin
  } else if (counterDiagWin != null) {
    return counterDiagWin
  } else if (state.turn === 42) {
    return 'nobody'
  } else {
    return null
  }
}

function checkRows (state) {
  for (let i = 0; i < 6; i++) {
    for (let j = 0; j < 4; j++) {
      if (state.board[i][j] != null) {
        if (state.board[i][j] === state.board[i][j + 1] &&
                    state.board[i][j] === state.board[i][j + 2] &&
                    state.board[i][j] === state.board[i][j + 3]) {
          return state.board[i][j]
        }
      }
    }
  }
  return null
}

function checkColumns (state) {
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 6; j++) {
      if (state.board[i][j] != null) {
        if (state.board[i][j] === state.board[i + 1][j] &&
                    state.board[i][j] === state.board[i + 2][j] &&
                    state.board[i][j] === state.board[i + 3][j]) {
          return state.board[i][j]
        }
      }
    }
  }
  return null
}

function checkDiagonals (state) {
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 4; j++) {
      if (state.board[i][j] != null) {
        if (state.board[i][j] === state.board[i + 1][j + 1] &&
                      state.board[i][j] === state.board[i + 2][j + 2] &&
                      state.board[i][j] === state.board[i + 3][j + 3]) {
          return state.board[i][j]
        }
      }
    }
  }
  return null
}

function checkCounterDiagonals (state) {
  for (let i = 0; i < 3; i++) {
    for (let j = 6; j > 2; j--) {
      if (state.board[i][j] != null) {
        if (state.board[i][j] === state.board[i + 1][j - 1] &&
                        state.board[i][j] === state.board[i + 2][j - 2] &&
                        state.board[i][j] === state.board[i + 3][j - 3]) {
          return state.board[i][j]
        }
      }
    }
  }
  return null
}

// ------------------------ UI FUNCTIONS (PRETTY DIRTY) ------------------------

// Could use getElementsByClass('col').forEach()
function drawBoard (state) {
  for (let rowIndex = 0; rowIndex < 6; rowIndex++) {
    for (let columnIndex = 0; columnIndex < 7; columnIndex++) {
      if (!state.board[rowIndex][columnIndex]) {
        continue
      }
      const cellColour = state.board[rowIndex][columnIndex] === 'Red' ? 'red' : 'yellow'
      document.getElementById(`row${rowIndex}-col${columnIndex}`).style.backgroundColor = cellColour
    }
  }
  if (gameState.winner === null) {
    displayTurn(gameState.player)
  } else {
    displayWinner(gameState)
    displayScores(gameState)
  }
}

function clearBoard () {
  for (let rowIndex = 0; rowIndex < 6; rowIndex++) {
    for (let columnIndex = 0; columnIndex < 7; columnIndex++) {
      document.getElementById(`row${rowIndex}-col${columnIndex}`).style.backgroundColor = 'white'
    }
  }
  document.getElementById('winner-display').style.display = 'none'
  document.getElementById('scoreboard').classList.remove('visible')
  document.getElementById('scoreboard').classList.add('invisible')
  document.getElementById('currentTurn').style.display = 'block'
}

function displayWinner (state) {
  document.getElementById('currentTurn').style.display = 'none'
  document.getElementById('winner-name').innerText = state.winningPlayer
  document.getElementById('winner-display').style.display = 'block'
  if (state.winner === 'Red') {
    document.getElementById('winner-display').style.backgroundColor = 'rgba(255, 0, 0, 0.3)'
  } else {
    document.getElementById('winner-display').style.backgroundColor = 'rgba(255, 204, 0, 0.3)'
  }
}

function displayScores (state) {
  document.getElementById('scoreboard').classList.remove('invisible')
  document.getElementById('scoreboard').classList.add('visible')
  for (let i = 0; i < state.highScores.length; i++) {
    document.getElementById(`score${i + 1}`).innerText = state.highScores[i].player + ' (' + state.highScores[i].colour + '): ' + state.highScores[i].score
  }
}

function displayTurn (player) {
  document.getElementById('currentTurn').innerText = `${player}'s turn`
}

module.exports = { takeTurn, checkWinner }
