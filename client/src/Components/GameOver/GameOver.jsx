import { Link } from "react-router-dom"

export default function GameOver({ totalPoints }) {

    return (<div className="gameOverCont"> {totalPoints > 0 ?
        <>
            <h2>Congratulations! You gathered: {totalPoints} XP</h2>
        </> :
        <>
            <h2>This time you havent gathered any XP. 😥 Better luck next time!</h2>
            <h2>We believe in you! GitGud</h2>
        </>
    }
        <p>more info later</p>
        <Link to={'/'}><button className="backToHomeBtn">Back to Home page</button></Link>
    </div>
    )
}