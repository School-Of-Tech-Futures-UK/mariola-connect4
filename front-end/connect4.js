// Functions used by game-state.js to implement connect4

// TODO:
// Improve UI (gradient colour board? place elements horizontally)
// Merge send and get scores
// Have to add scores by same players?

module.exports = { takeTurn, checkWinner }

// ------------------------ DIRTY LAYER ------------------------

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
  winningColour: null,
  redPlayerName: null,
  yellowPlayerName: null,
  highScores: []
}

// gridClick is called every time a user clicks on the board
// eslint-disable-next-line no-unused-vars
async function gridClick (e) {
  gameState = await takeTurn(e, gameState)

  if (gameState.winner != null) { // i.e. someone has won
    if (gameState.winner === 'Red') {
      gameState.redPlayerName = document.getElementById('red-input').value
      gameState.winningPlayer = gameState.redPlayerName
      gameState.winningColour = 'Red'
    } else if (gameState.winner === 'Yellow') {
      gameState.yellowPlayerName = document.getElementById('yellow-input').value
      gameState.winningPlayer = gameState.yellowPlayerName
      gameState.winningColour = 'Yellow'
    }
    await sendScore(gameState)
    gameState.highScores = await getHighScores()
  }
  drawBoard(gameState)
}

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
  const data = { player: state.winningPlayer, score: state.finalScore, colour: state.winningColour }
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

async function takeTurn (e, state) {
  const newState = JSON.parse(JSON.stringify(state))

  const id = e.target.id
  const column = id[8]
  const lowestFreeRow = getLowestFreeRowInColumn(column, newState.board)

  if (lowestFreeRow !== null && newState.winner == null && newState.turn < 43) {
    newState.turn++

    if (newState.player === 'Red') {
      newState.board[lowestFreeRow][column] = 'Red'
      newState.player = 'Yellow'
    } else {
      newState.board[lowestFreeRow][column] = 'Yellow'
      newState.player = 'Red'
    }
  }

  newState.winner = checkWinner(newState)
  if (newState.winner != null) {
    newState.finalScore = 42 - newState.turn
  }
  return newState
}

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
    for (let j = 0; j < 7; j++) {
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
  for (let i = 0; i < 7; i++) {
    for (let j = 0; j < 6; j++) {
      if (state.board[j][i] != null) {
        if (state.board[j][i] === state.board[j - 1][i] &&
                    state.board[j][i] === state.board[j - 2][i] &&
                    state.board[j][i] === state.board[j - 3][i]) {
          return state.board[j][i]
        }
      }
    }
  }
  return null
}

function checkDiagonals (state) {
  for (let i = 0; i < 6; i++) {
    for (let j = 0; j < 7; j++) {
      if (state.board[i][j] != null) {
        if (state.board[i][j] === state.board[i - 1][j + 1] &&
                      state.board[i][j] === state.board[i - 2][j + 2] &&
                      state.board[i][j] === state.board[i - 3][j + 3]) {
          return state.board[i][j]
        }
      }
    }
  }
  return null
}

function checkCounterDiagonals (state) {
  for (let i = 0; i < 6; i++) {
    for (let j = 0; j < 7; j++) {
      if (state.board[i][j] != null) {
        if (state.board[i][j] === state.board[i - 1][j - 1] &&
                        state.board[i][j] === state.board[i - 2][j - 2] &&
                        state.board[i][j] === state.board[i - 3][j - 3]) {
          return state.board[i][j]
        }
      }
    }
  }
  return null
}

// ------------------------ UI FUNCTIONS ------------------------

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

  if (state.winner === null) {
    displayTurn(state.player)
  } else {
    displayWinner(state)
    displayScores(state)
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
  if (state.winningColour === 'Red') {
    document.getElementById('winner-display').style.backgroundColor = 'rgba(255, 0, 0, 0.3)'
  } else {
    document.getElementById('winner-display').style.backgroundColor = 'rgba(255, 204, 0, 0.3)'
  }
}

function displayScores (state) {
  document.getElementById('scoreboard').classList.remove('invisible')
  document.getElementById('scoreboard').classList.add('visible')
  for (let i = 0; i < state.highScores.length; i++) {
    console.log('in scoreboard for loop')
    document.getElementById(`score${i + 1}`).innerText = state.highScores[i].player + ' (' + state.highScores[i].colour + '): ' + state.highScores[i].score
  }
}

function displayTurn (player) {
  document.getElementById('currentTurn').innerText = `${player}'s turn`
}
