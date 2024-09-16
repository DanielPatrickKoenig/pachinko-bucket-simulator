import './Bumper.css';
const Bumper = ({ x, y }) => {
    return <div className="pachinko-bumper" style={{ left: `${x}%`, top: `${y}%` }}>
        <img src="https://eprize-content.s3.amazonaws.com/five-bicket-simulator/images/bumper.png" />
    </div>
}

export default Bumper;