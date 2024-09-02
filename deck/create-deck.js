import fs from 'fs'

const deck = []

const ranks = ["K", "Q", "J", "A", 10, 9, 8, 7, 6, 5, 4, 3, 2, 1]
const suits = ["hearts", "spades", "diamonds", "clubs"]

ranks.forEach(rank => {
    suits.forEach(suit => {
        deck.push({
            rank,
            suit,
            value: (typeof rank === 'number') ? rank : (rank === "A") ? 11 : 10
        })
    })
})

fs.writeFileSync("./deck.json", JSON.stringify(deck, null, 2))