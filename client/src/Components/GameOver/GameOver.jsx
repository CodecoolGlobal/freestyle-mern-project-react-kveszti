import { Link } from "react-router-dom";
import { useContext } from "react";
import { ColorThemeContext } from "../../App";

export default function GameOver({ totalPoints, setIsPlaying, setIsGameOver }) {
    const { colorTheme } = useContext(ColorThemeContext);

    function handlePlayAgain() {
        setIsGameOver(false);
        setIsPlaying(false);
    }

    return (<div className={`gameOverCont ${colorTheme.darkContBackground}`}> {totalPoints > 0 ?
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