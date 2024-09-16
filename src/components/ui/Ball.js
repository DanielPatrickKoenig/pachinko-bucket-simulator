import './Ball.css';
const Ball = ({ x, y }) => {
    return <div className="pachinko-ball" style={{ left: `${x}%`, top: `${y}%` }}>
        <img src="https://eprize-content.s3.amazonaws.com/five-bicket-simulator/images/coin.png" />
    </div>
}

export default Ball;