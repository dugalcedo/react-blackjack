type CardProps = {
    card: CardType;
    hidden: boolean;
}

function Card({ card, hidden }: CardProps) {
    return (
        <div className={`card ${hidden?"hidden":""}`} style={{
            color: (["diamonds", "hearts"]).includes(card.suit) ? "red" : "black"
        }}>
            <div className="row">
                <img src={`/suits/${card.suit}.svg`} alt={`${card.suit} suit`} />
                <div className="rank">{card.rank}</div>
            </div>
            <div className="row">
                <div className="rank">{card.rank}</div>
                <img src={`/suits/${card.suit}.svg`} alt={`${card.suit} suit`} />
            </div>
        </div>
    )
}

export default Card