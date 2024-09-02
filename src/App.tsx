import { useState, useEffect } from "react"
import initialDeck from "./lib/deck"
import Card from "./lib/Card"

function App() {
  const [deck, setDeck] = useState<CardType[]>([...initialDeck])
  const [playerHand, setPlayerHand] = useState<CardType[]>([])
  const [dealerHand, setDealerHand] = useState<CardType[]>([])
  const [dealerHandShown, setDealerHandShown] = useState<boolean>(false)
  const [gameResult, setGameResult] = useState<GameResult>("")

  // Function for drawing any number of cards, then executing a callback before updating the deck.
  const drawThen = (deck: CardType[], amt: number, callback: DrawThenCallback): void => {
    const newDeck: CardType[] = [...deck]
    const cards: CardType[] = []
    for (let i = 0; i < amt; i++) {
      cards.push(...newDeck.splice(Math.round(Math.random()*newDeck.length-1), 1))
    }
    callback(cards)
    setDeck(newDeck)
  }

  // Function for "shuffling" (resetting) the deck.
  const shuffle = (): CardType[] => {
    const newDeck = [...initialDeck]
    setDeck(newDeck)
    return newDeck
  }

  // Funciton for starting a new game.
  const newGame = () => {
    hide();
    const newDeck = shuffle();
    drawThen(newDeck, 4, (cards) => {
      const [p1, p2, d1, d2] = cards;
      setPlayerHand([p1, p2])
      setDealerHand([d1, d2])
    })
  }

  // Function for getting points of a player
  const getPoints = (name: "player" | "dealer", countAll: boolean = false): number => {
    const hand: CardType[] = name === 'dealer' ? dealerHand : playerHand;
    if (name === 'dealer' && !dealerHandShown && !countAll) {
      return hand[0]?.value || 0
    } else {
      return hand.reduce((acc, cv) => {
        return acc + getTrueValue(cv, acc)
      }, 0)
    }
  }

  // Function for getting the "true value" of a card, since Aces can be 1 or 11
  const getTrueValue = (card: CardType, accumulator: number): number => {
    if (card.rank !== "A") {
      return card.value
    } else {
      if ((accumulator + card.value) >= 21) {
        return 1
      } else {
        return 11
      }
    }
  }

  // add card to player's deck
  const drawCardForPlayer = (): void => {
    drawThen(deck, 1, cards => {
      const [card] = cards;
      setPlayerHand([...playerHand, card])
    })
  }

  const handleHitMe = (): void => {
    drawCardForPlayer()
  }

  const reveal = (): void => {
    setDealerHandShown(true)
  }

  const hide = (): void => {
    setDealerHandShown(false)
    setGameResult("")
  }

  const endGame = (result: GameResult) => {
    reveal()
    setGameResult(result)
  }

  // to be called on update of playerHand
  const checkGameStatus = (): void => {
    const playerPoints = getPoints("player")
    const dealerPoints = getPoints("dealer")
    if (playerPoints > 21) {
      // LOSE
      endGame("You lost.")
    } else if (playerPoints === 21) {
      if (playerPoints === dealerPoints) {
        // TIE
        endGame("Tie")
      }
      // WIN
      endGame("You won!")
    }
  }

  // handle stay
  const handleStay = (): void => {
    reveal()
    const playerPoints = getPoints("player")
    const dealerPoints = getPoints("dealer", true)

    if (playerPoints > dealerPoints) {
      endGame("You won!")
    } else if (playerPoints < dealerPoints) {
      endGame("You lost.")
    } else {
      endGame("Tie")
    }
  }

  // on mount
  useEffect(()=>{
    newGame()
  },[])

  // on update of playerHand, check game status
  useEffect(checkGameStatus, [playerHand])

  return (
    <>
      <h1>React blackjack</h1>
      
      <h2 id="result">
        {gameResult}
      </h2>

      <div id="table">

        <div id="player-area">
          <div id="player-heading">
            <h3>Your hand</h3>
            {dealerHandShown ? (
              <>
                <button onClick={newGame}>Play again</button>
              </>
            ):(
              <>
                <button onClick={handleHitMe}>Hit me</button>
                <button onClick={handleStay}>Stay</button>
              </>
            )}
          </div>
          <div id="player" className="hand">
            {playerHand.map(card => {
              return (
                <Card key={`${card.suit}-${card.rank}`} card={card} hidden={false} />
              )
            })}
          </div>
          <div className="points">
            {getPoints("player")}
          </div>
        </div>
        {/* END of player area */}

        <div id="dealer-area">
          <h3>Dealer's hand</h3>
          <div id="dealer" className="hand">
            {dealerHand.map((card, i) => {
              return (!dealerHandShown && (i > 0)) ? (
                <div key={`${card.suit}-${card.rank}`} className="card hidden"></div>
              ) : (
                <Card key={`${card.suit}-${card.rank}`} card={card} hidden={false} />
              )
            })}
          </div>
          <div className="points">
            {dealerHandShown ? (
              <>
                {getPoints("dealer")}
              </>
            ): (
              <>
                {getPoints("dealer")} + ?
              </>
            )}
          </div>
        </div>
        {/* END of dealer area */}

      </div>
      {/* END of table */}
    </>
  )
}

export default App
