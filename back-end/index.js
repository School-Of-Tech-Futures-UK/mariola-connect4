const express = require('express')
const cors = require('cors')

const app = express()

app.use(express.json())
app.use(cors())

let scores = []

app.post('/scores', (req, res) => {
  const data = req.body
  scores.push(data)
  scores.sort((a, b) => {
    return b.score - a.score
  })
  console.log('The current high scores: ', scores.slice(0, 5))
  res.send('')
})

app.get('/scores', (req, res) => {
  res.json(scores.slice(0, 5))
})

app.listen(3000)
