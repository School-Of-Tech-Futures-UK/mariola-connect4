/* eslint-disable no-undef */
const connect4 = require('./connect4.js')

let gameState

beforeEach(() => {
  gameState = {
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
    yellowPlayerName: null,
    highScores: []
  }
})

describe('When calling the checkWinner function', () => {
  const wins = [
    [[
      [null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null],
      ['Red', 'Red', 'Red', 'Red', null, null, null]
    ], 'Red'],
    [[
      [null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null],
      ['Red', null, null, null, null, null, null],
      ['Red', null, null, null, null, null, null],
      ['Red', null, null, null, null, null, null],
      ['Red', null, null, null, null, null, null]
    ], 'Red'],
    [[
      [null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null],
      [null, null, null, 'Red', null, null, null],
      [null, null, 'Red', null, null, null, null],
      [null, 'Red', null, null, null, null, null],
      ['Red', null, null, null, null, null, null]
    ], 'Red'],
    [[
      [null, null, null, null, null, null, null],
      [null, 'Red', null, null, null, null, null],
      [null, null, 'Red', null, null, null, null],
      [null, null, null, 'Red', null, null, null],
      [null, null, null, null, 'Red', null, null],
      [null, null, null, null, null, null, null]
    ], 'Red']
  ]

  const noWins = [
    [[
      [null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null],
      [null, null, 'Red', null, null, null, null],
      [null, null, null, 'Red', null, null, null],
      [null, null, null, null, 'Red', null, null],
      [null, null, null, null, null, null, null]
    ], null],
    [[
      [null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null]
    ], null],
    [[
      [null, null, null, null, null, null, null],
      [null, 'Yellow', null, null, null, null, null],
      [null, null, 'Red', null, null, null, null],
      [null, null, null, 'Red', null, null, null],
      [null, null, null, null, 'Red', null, null],
      [null, null, null, null, null, null, null]
    ], null]
  ]

  it.each(wins)('When there are four consecutive red discs in a row/column/diagonal it returns "Red"', (input, expectedOutput) => {
    gameState.board = input
    const actualOutput = connect4.checkWinner(gameState)

    expect(actualOutput).toBe(expectedOutput)
  })

  it.each(noWins)('When there aren\'t four consecutive discs it returns null', (input, expectedOutput) => {
    gameState.board = input
    const actualOutput = connect4.checkWinner(gameState)

    expect(actualOutput).toBe(expectedOutput)
  })

  test('When the board is full and there aren\'t four consecutive discs it returns "nobody"', () => {
    gameState.board = [
      ['Yellow', 'Yellow', 'Yellow', 'Red', 'Yellow', 'Yellow', 'Yellow'],
      ['Red', 'Red', 'Red', 'Yellow', 'Red', 'Red', 'Red'],
      ['Yellow', 'Yellow', 'Yellow', 'Red', 'Yellow', 'Yellow', 'Yellow'],
      ['Red', 'Red', 'Red', 'Yellow', 'Red', 'Red', 'Red'],
      ['Yellow', 'Yellow', 'Yellow', 'Red', 'Yellow', 'Yellow', 'Yellow'],
      ['Red', 'Red', 'Red', 'Yellow', 'Red', 'Red', 'Red']
    ]
    gameState.turn = 42

    const actualOutput = connect4.checkWinner(gameState)
    const expectedOutput = 'nobody'

    expect(actualOutput).toBe(expectedOutput)
  })
})

describe('When calling takeTurn function', () => {
  // Have to test when a piece can be placed and when it can't (i.e. the column is full)

  test('When there is space in a column, the piece falls in the lowest available spot in that column', () => {
    // Arrange
    gameState.player = 'Yellow'
    gameState.turn = 4
    gameState.board = [
      [null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null],
      ['Red', 'Yellow', 'Red', 'Yellow', null, null, null]
    ]
    const e = {
      target: { id: 'row4-col2' }
    }

    // Act
    const actualOutput = connect4.takeTurn(e, gameState)

    // Assert
    const expectedOutput = {
      ...gameState
    }
    expectedOutput.board[4][2] = 'Yellow'
    expectedOutput.turn++
    expectedOutput.player = 'Red'

    expect(actualOutput).toMatchObject(expectedOutput)
  })
})
