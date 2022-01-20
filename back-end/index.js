const fs = require('fs').promises
const express = require('express')
const cors = require('cors')

const app = express()

app.use(express.json())
app.use(cors())

let scores

async function loadScores () {
  const contents = await fs.readFile('./highscores.json', 'utf-8')
  const data = JSON.parse(contents)
  scores = data
}

async function saveScores (scores) {
  const contents = JSON.stringify(scores)
  await fs.writeFile('./highscores.json', contents)
}

loadScores()

app.post('/scores', (req, res) => {
  const data = req.body
  scores.push(data)
  scores.sort((a, b) => {
    return b.score - a.score
  })
  saveScores(scores)
  res.send('')
})

app.get('/scores', (req, res) => {
  res.json(scores.slice(0, 10))
})

app.listen(3000)
