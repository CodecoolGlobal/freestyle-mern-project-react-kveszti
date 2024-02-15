import { Link } from "react-router-dom"

export default function GameOver({ totalPoints, setIsPlaying, setIsGameOver }) {

    function handlePlayAgain() {
        setIsGameOver(false);
        setIsPlaying(false);
    }

    return (<div className="gameOverCont"> {totalPoints > 0 ?
        <>
            <h2>Congratulations! You earned: {totalPoints} XP</h2>
        </> :
        <>
            <h2>This time you havent gathered any XP. 😥 Better luck next time!</h2>
            <h2>We believe in you! GitGud</h2>
        </>
    }
        <p>(More info later)</p>
        <Link to={'/'}><button className="backToHomeBtn">Back to Homepage</button></Link>
        <button onClick={() => handlePlayAgain()} className="backToPlayMode">Play Again</button>
    </div>
    )
}