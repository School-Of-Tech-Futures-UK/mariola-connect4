// Functions used by game-state.js to implement connect4

// TODO:
// Make functions pure
//    Break down code into smaller functions
//    Look for parts of the code that are repeated (those could be a separate function)
// Separate UI logic (make a drawBoard function, display high scores, hide high scores)
// Improve UI
// Merge send and get scores

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
  yellowPlayerName: null
}

// eslint-disable-next-line no-unused-vars
function takeTurn (e) {
  gameState = makeMove(e, gameState)
}

// eslint-disable-next-line no-unused-vars
function resetGame () {
  gameState = reset(gameState)
}

// Change this to return a new state
function makeMove (e, state) {
  const newState = JSON.parse(JSON.stringify(state))

  const id = e.target.id
  const column = id[8]
  const lowestFreeRow = getLowestFreeRowInColumn(column, newState.board)

  if (lowestFreeRow !== null && newState.winner == null && newState.turn < 43) {
    newState.turn++

    if (newState.player === 'Red') {
      newState.board[lowestFreeRow][column] = 'Red'
      document.getElementById(`row${lowestFreeRow}-col${column}`).style.backgroundColor = 'Red'
      newState.player = 'Yellow'
    } else {
      newState.board[lowestFreeRow][column] = 'Yellow'
      document.getElementById(`row${lowestFreeRow}-col${column}`).style.backgroundColor = 'Yellow'
      newState.player = 'Red'
    }
  }

  newState.winner = checkWinner(newState)
  console.log(newState.winner)
  if (newState.winner != null) {
    document.getElementById('currentTurn').style.display = 'none'
    newState.finalScore = 42 - newState.turn
    if (newState.winner === 'Red') {
      newState.redPlayerName = document.getElementById('red-input').value
      newState.winningPlayer = newState.redPlayerName
      document.getElementById('winner-display').style.backgroundColor = 'red'
    } else {
      newState.yellowPlayerName = document.getElementById('yellow-input').value
      newState.winningPlayer = newState.yellowPlayerName
      document.getElementById('winner-display').style.backgroundColor = 'yellow'
    }
    document.getElementById('winner-name').innerText = newState.winningPlayer
    document.getElementById('winner-display').style.display = 'block'
    console.log('final score: ', newState.finalScore)
    sendScore().then(getHighScores)
  } else if (newState.winner === null && newState.turn === 42) {
    document.getElementById('winner-name').innerText = 'nobody'
    document.getElementById('winner-display').style.display = 'block'
    document.getElementById('winner-display').style.backgroundColor = 'blue'
  } else {
    document.getElementById('currentTurn').innerText = `${newState.player}'s turn`
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

async function sendScore () {
  const data = { player: state.winningPlayer, score: state.finalScore }
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
  const scores = await req.json()
  console.log(scores) // This is an array of {player: name, score: score} objects
  // Show high scores
  document.getElementById('scoreboard').classList.remove('invisible')
  document.getElementById('scoreboard').classList.add('visible')
  for (let i = 0; i < scores.length; i++) {
    document.getElementById(`score${i + 1}`).innerText = scores[i].player + ': ' + scores[i].score
  }
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

  const columns = document.getElementsByClassName('col')
  for (let i = 0; i < columns.length; i++) {
    columns[i].style.backgroundColor = 'white'
    // columns[i].removeProperty("backgroundColor")
  }

  document.getElementById('winner-display').style.display = 'none'
  document.getElementById('scoreboard').classList.remove('visible')
  document.getElementById('scoreboard').classList.add('invisible')
  document.getElementById('currentTurn').style.display = 'block'

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
