// JS file for the Connect 4 game

// TODO:
// Make functions pure
// Show players' names with their colour
// Improve UI
// First click after reset is blank
// Merge send and get scores

// gameState object
const gameState = {
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
  // redPlayer: prompt('Please enter the Red Player\'s name:'),
  // yellowPlayer: prompt('Please enter the Yellow Player\'s name:')
  redPlayer: null,
  yellowPlayer: null
}

// eslint-disable-next-line no-unused-vars
function takeTurn (e) {
  const id = e.target.id
  const column = id[8]
  const lowestFreeRow = getLowestFreeRowInColumn(column, gameState.board)

  if (lowestFreeRow !== null && gameState.winner == null && gameState.turn < 43) {
    gameState.turn++

    if (gameState.player === 'Red') {
      gameState.board[lowestFreeRow][column] = 'Red'
      document.getElementById(`row${lowestFreeRow}-col${column}`).style.backgroundColor = 'Red'
      gameState.player = 'Yellow'
    } else {
      gameState.board[lowestFreeRow][column] = 'Yellow'
      document.getElementById(`row${lowestFreeRow}-col${column}`).style.backgroundColor = 'Yellow'
      gameState.player = 'Red'
    }
  }

  gameState.winner = checkWinner()
  console.log(gameState.winner)
  if (gameState.winner != null) {
    document.getElementById('currentTurn').style.display = 'none'
    gameState.finalScore = 42 - gameState.turn
    if (gameState.winner === 'Red') {
      gameState.redPlayer = document.getElementById('red-input').value
      gameState.winningPlayer = gameState.redPlayer
      document.getElementById('winner-display').style.backgroundColor = 'red'
    } else {
      gameState.yellowPlayer = document.getElementById('yellow-input').value
      gameState.winningPlayer = gameState.yellowPlayer
      document.getElementById('winner-display').style.backgroundColor = 'yellow'
    }
    document.getElementById('winner-name').innerText = gameState.winningPlayer
    document.getElementById('winner-display').style.display = 'block'
    console.log('final score: ', gameState.finalScore)
    sendScore().then(getHighScores)
  } else if (gameState.winner === null && gameState.turn === 42) {
    document.getElementById('winner-name').innerText = 'nobody'
    document.getElementById('winner-display').style.display = 'block'
    document.getElementById('winner-display').style.backgroundColor = 'blue'
  } else {
    document.getElementById('currentTurn').innerText = `${gameState.player}\'s turn`
  }
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
  const data = { player: gameState.winningPlayer, score: gameState.finalScore }
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
function reset () {
  gameState.turn = 0
  gameState.player = 'Red'
  gameState.board = [
    [null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null]
  ]

  const columns = document.getElementsByClassName('col')
  for (let i = 0; i < columns.length; i++) {
    columns[i].style.backgroundColor = 'white'
    // columns[i].removeProperty("backgroundColor")
  }

  document.getElementById('winner-display').style.display = 'none'
  document.getElementById('scoreboard').classList.remove('visible')
  document.getElementById('scoreboard').classList.add('invisible')
  document.getElementById('currentTurn').style.display = 'block'
}

function checkWinner () {
  const rowWin = checkRows()
  const columnWin = checkColumns()
  const diagWin = checkDiagonals()
  const counterDiagWin = checkCounterDiagonals()
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

function checkRows () {
  for (let i = 0; i < 6; i++) {
    for (let j = 0; j < 7; j++) {
      if (gameState.board[i][j] != null) {
        if (gameState.board[i][j] === gameState.board[i][j + 1] &&
                    gameState.board[i][j] === gameState.board[i][j + 2] &&
                    gameState.board[i][j] === gameState.board[i][j + 3]) {
          return gameState.board[i][j]
        }
      }
    }
  }
  return null
}

function checkColumns () {
  for (let i = 0; i < 7; i++) {
    for (let j = 0; j < 6; j++) {
      if (gameState.board[j][i] != null) {
        if (gameState.board[j][i] === gameState.board[j - 1][i] &&
                    gameState.board[j][i] === gameState.board[j - 2][i] &&
                    gameState.board[j][i] === gameState.board[j - 3][i]) {
          return gameState.board[j][i]
        }
      }
    }
  }
  return null
}

function checkDiagonals () {
  for (let i = 0; i < 6; i++) {
    for (let j = 0; j < 7; j++) {
      if (gameState.board[i][j] != null) {
        if (gameState.board[i][j] === gameState.board[i - 1][j + 1] &&
                      gameState.board[i][j] === gameState.board[i - 2][j + 2] &&
                      gameState.board[i][j] === gameState.board[i - 3][j + 3]) {
          return gameState.board[i][j]
        }
      }
    }
  }
  return null
}

function checkCounterDiagonals () {
  for (let i = 0; i < 6; i++) {
    for (let j = 0; j < 7; j++) {
      if (gameState.board[i][j] != null) {
        if (gameState.board[i][j] === gameState.board[i - 1][j - 1] &&
                        gameState.board[i][j] === gameState.board[i - 2][j - 2] &&
                        gameState.board[i][j] === gameState.board[i - 3][j - 3]) {
          return gameState.board[i][j]
        }
      }
    }
  }
  return null
}
