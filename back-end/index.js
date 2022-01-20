const express = require('express')
const cors = require('cors')

const app = express()

app.use(express.json())
app.use(cors())

app.post('/scores', (req, res) => {
  console.log(req.body)
  res.send('')
})

app.listen(3000)
