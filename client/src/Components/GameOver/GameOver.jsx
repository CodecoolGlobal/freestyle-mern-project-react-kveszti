import { Link } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { ColorThemeContext } from "../../App";
import { CircularProgressbar, CircularProgressbarWithChildren, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import ChangingProgressProvider from "../ChangingProgressProvider";

async function fetchData(url, id, method = "GET", body = {}) {
    try {
        const response = await fetch(id !== undefined ? `${url}/${id}` : url, method === "GET" ? { method } : { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
        return await response.json();
    } catch (err) {
        console.error("Error while fetching:", err);
    }
}

function findClosestNumbers(starterNumber, currentNumber) {
    let nextNumber = starterNumber;
    let prevNumber = starterNumber;
    let counter = 0;

    while (nextNumber < currentNumber) {
        prevNumber = nextNumber
        nextNumber *= 1.5;
        counter++
    }

    return { nextNumber, prevNumber, counter };
}

export default function GameOver({ totalPoints, setIsPlaying, setIsGameOver, correctAnswersNr, questionsArrayLength, userId }) {
    const { colorTheme } = useContext(ColorThemeContext);
    const [userStats, setUserStats] = useState(null);
    const [prevLevel, setPrevLevel] = useState(15);
    const [nextLevel, setNextLevel] = useState(22.5);
    const [currentLevel, setCurrentLevel] = useState(0)

    useEffect(() => {
        fetchData(`/api/users/id/${userId}/stats`)
            .then(response => {
                console.log(response);
                if (response.success) {
                    setUserStats(response.user)
                    console.log(response.user)
                }
            })
            .catch(error => {
                console.log(error);
            });
    }, [])

    useEffect(() => {
        if (userStats) {
            const { nextNumber, prevNumber, counter } = findClosestNumbers(prevLevel, userStats.stats[1].category.points);
            setPrevLevel(prevNumber);
            setNextLevel(nextNumber);
            setCurrentLevel(counter);
        }
    }, [userStats])


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
        {userStats ? (<>
            <div className="progressCont">
                <ChangingProgressProvider values={[(userStats.stats[1].category.points - prevLevel - totalPoints) <= 0 ? 0 : Math.floor((userStats.stats[1].category.points - prevLevel - totalPoints) / (nextLevel - prevLevel) * 100), Math.floor((userStats.stats[1].category.points - prevLevel) / (nextLevel - prevLevel) * 100)]}>
                    {percentage => (
                        <CircularProgressbarWithChildren
                            value={percentage}
                            styles={buildStyles({
                                strokeLinecap: "butt",
                                textColor: "white",
                                pathColor: `${colorTheme.progressDonutPath}`,
                                trailColor: `${colorTheme.progressDonutTrail}`,
                                pathTransitionDuration: 3
                            })}>
                            {<div><p className="donutTxt">{`${userStats.stats[1].category.name}:`} <br /> {`${userStats.stats[1].category.points}`}</p></div>}
                        </CircularProgressbarWithChildren>
                    )}
                </ChangingProgressProvider>
            </div>
            {(userStats.stats[1].category.points - prevLevel - totalPoints) <= 0 ? <h3>✨LEVEL UP!✨</h3> : <></>}
            <h3>CURRENT LEVEL: {currentLevel}</h3>
            <p className="gameOverInfo">You have answered <strong>{correctAnswersNr}</strong> questions correctly out of <strong>{questionsArrayLength}</strong>.</p>
            <p className="gameOverInfo">You need <strong>{`${Math.trunc(nextLevel - userStats.stats[1].category.points)}`} XP</strong> to level up.</p>
        </>
        ) : (
            <p className="gameOverInfo">Loading user stats...</p>
        )}
        <Link to={'/'}><button className="backToHomeBtn">Back to Homepage</button></Link>
        <button onClick={() => handlePlayAgain()} className="backToPlayMode">Play Again</button>
    </div>
    )
}