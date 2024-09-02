type Rank =  2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | "K" | "Q" | "J" | "A";
type Suit = "hearts" | "spades" | "diamonds" | "clubs";
type CardValue = 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11;

type CardType = {
    rank: Rank;
    suit: Suit;
    value: CardValue;
}

type DrawThenCallback = (cards: CardType[]) => void;

type GameResult = "You won!" | "You lost." | "Tie" | "";