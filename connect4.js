// JS file for the Connect 4 game

// TODO:
// Make functions pure
// Show who's turn it is
// Get player names
// Send winning score + name
// Improve UI
// Record high scores
// Display high scores

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
  winningPlayer: 'Alex',
  redPlayer: prompt('Please enter the Red Player\'s name:'),
  yellowPlayer: prompt('Please enter the Yellow Player\'s name:')
}

// eslint-disable-next-line no-unused-vars
function takeTurn (e) {
  const id = e.target.id
  //   const row = id[3] // don't think I need this
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
    gameState.finalScore = 42 - gameState.turn
    document.getElementById('winnerMessage').innerText = `The winner is ${gameState.winner}`
    console.log('final score: ', gameState.finalScore)
    const data = { player: gameState.winningPlayer, score: gameState.finalScore }
    fetch('http://localhost:3000/scores', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    }).then(console.log('response received from POST request, score is: ', gameState.finalScore))
  } else if (gameState.winner === null && gameState.turn === 42) {
    document.getElementById('winnerMessage').innerText = 'The winner is nobody'
  } else {
    if (gameState.player === 'Red') {
      document.getElementById('currentTurn').innerText = gameState.redPlayer + '\'s Turn'
    } else {
      document.getElementById('currentTurn').innerText = gameState.yellowPlayer + '\'s Turn'
    }
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
    columns[i].style.backgroundColor = 'transparent'
    // columns[i].removeProperty("backgroundColor")
  }

  document.getElementById('winnerMessage').innerText = ''
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

function submitNames() {
  const player1 = document.getElementById('player1').value
  const player2 = document.getElementById('player2').value
  document.getElementById('player1').style.visibility = 'hidden'
  document.getElementById('player1').style.visibility = 'hidden'
  document.getElementById('name1').innerText = player1
  document.getElementById('name2').innerText = player2
}
