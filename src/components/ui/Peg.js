import './Peg.css';
const Peg = ({ x, y }) => {
    return <div className="pachinko-peg" style={{ left: `${x}%`, top: `${y}%` }}>
        <img src="https://eprize-content.s3.amazonaws.com/five-bicket-simulator/images/peg.png" />
    </div>
}

export default Peg;