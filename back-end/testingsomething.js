let scores = []

const data1 = {
    player: "Mary",
    score: 20
}

const data2 = {
    player: "James",
    score: 30
}

scores.push(data1)
scores.push(data2)

scores.sort((a, b) => {
  return b.score - a.score
})

console.log(scores.slice(0, 1))
