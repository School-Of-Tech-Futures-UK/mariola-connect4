const fs = require('fs').promises

let scores = []

const data1 = {
  player: 'Mary',
  score: 20
}

const data2 = {
  player: 'James',
  score: 30
}

scores.push(data1)
scores.push(data2)

scores.sort((a, b) => {
  return b.score - a.score
})

// console.log(scores.slice(0, 1))
// console.log(scores)

async function trysave (scores) {
  const contents = JSON.stringify(scores)
  await fs.writeFile('./highscores.json', contents)
}

async function tryload () {
  const contents = await fs.readFile('./highscores.json', 'utf-8')
  const data = await JSON.parse(contents)
  console.log(data)
  return data
}

const x = tryload()

// console.log(x)
