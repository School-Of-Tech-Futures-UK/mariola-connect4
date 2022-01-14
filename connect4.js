// JS file for the Connect 4 game

// gameState object
let gameState = {
    turn: 0,
    player: "red",
    board: [
        [null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null]
    ]
}


// TODO: 
// check max turn hasn't been reached
// winner message cleared after reset


function takeTurn(e) {
    const id = e.target.id
    const row = id[3]
    const column = id[8]

    const lowestFreeRow = getLowestFreeRowInColumn(column, gameState.board)
    console.log(`LowestFree row: ${lowestFreeRow}`)

    if (lowestFreeRow !== null) {
        gameState.turn++

        if (gameState.player === "red") {
            gameState.board[lowestFreeRow][column] = "red"
            document.getElementById(`row${lowestFreeRow}-col${column}`).style.backgroundColor = 'red';
            gameState.player = "yellow"
        } else {
            gameState.board[lowestFreeRow][column] = "yellow"
            document.getElementById(`row${lowestFreeRow}-col${column}`).style.backgroundColor = 'yellow';
            gameState.player = "red"
        }
    }

    console.log(`You clicked column ${column}`)
    console.log(`Turn number ${gameState.turn}`)
    console.log(gameState.board)
}


function getElement(r,c) {
    const element = document.querySelector(`.row#${r} > .column#${c}`)

}


function getLowestFreeRowInColumn(colNumber, grid) {
    for (let i = 5; i >= 0; i--) {
        if (grid[i][colNumber] === null) {
            return i
        }
    }

    return null;
}


function reset() {
    gameState.turn = 0
    gameState.player = "red"
    gameState.board = [
        [null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null]
    ]

    let columns = document.getElementsByClassName("col")
    for (let i = 0; i < columns.length; i++) {
        columns[i].style.backgroundColor = "transparent"
        // columns[i].removeProperty("backgroundColor")
    }
}


function checkWinner() {

}