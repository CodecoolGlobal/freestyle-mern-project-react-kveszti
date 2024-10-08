import { useState, useEffect, useContext } from "react";
import { ColorThemeContext } from "../../App";
import QuestionComponent from "./QuestionComponent";
import { Link } from "react-router-dom";

async function fetchData(url, method = "GET", body = {}) {
  try {
    const response = await fetch(url, method === "GET" ? { method, credentials: 'include' } : { method, credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    return await response.json();
  } catch (err) {
    console.error("Error while fetching:", err);
  }
}

export default function HistoryDetailed({ gameObject, setView }) {
  const { colorTheme } = useContext(ColorThemeContext);
  const id = gameObject._id;
  const [gameHistory, setGameHistory] = useState(null);

  const date = new Date(gameObject.createdAt);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  let gameMode = "";

  if (gameObject.gameMode === "sprint") {
    gameMode = "Sprint"
  } else if (gameObject.gameMode === "allIn") {
    gameMode = "All in"
  } else if (gameObject.gameMode === "5050") {
    gameMode = "50:50"
  } else if (gameObject.gameMode === "zen") {
    gameMode = "Zen"
  }

  const formattedDate = `${year}.${month}.${day}.`;

  useEffect(() => {
    fetchData(`/api/gameHistory/id/${id}`, "GET").then(res => setGameHistory(res.gameHistory))
      ;
  }, [])

  useEffect(() => {
    if (gameHistory)
      console.log(gameHistory.questionsAndAnswers)
  }, [gameHistory])

  return (
    <>
      {gameHistory ? (
        <>
          <button className="backToHomeBtn" onClick={() => setView("all")}>Back to history list</button>
          <Link to={'/'}><button className="backToHomeBtn">Back to Homepage</button></Link>
          <div id="HListElementCont" className={`HListElementCont ${colorTheme.lightContBackground} ${colorTheme.darkText}`}>
            <div><strong>{formattedDate}</strong></div>
            <hr className={`${colorTheme.hrBorderColor}`} />
            <div><strong>{gameMode}</strong></div>
            <div><strong>{gameObject.category ? gameObject.category : "N/A"}</strong></div>
            <div>Difficulty: {gameObject.difficulty ? gameObject.difficulty.charAt(0).toUpperCase() + gameObject.difficulty.slice(1) : "N/A"}</div>
            <div>XP earned: <strong>{gameObject.gainedPoints}</strong></div>
            <div><strong>{gameObject.correctAnswers}</strong> correct answer(s) out of <strong>{gameObject.allAnswers}</strong> answered question(s)</div>
            <div>Longest streak of correct answers: <strong>{gameObject.longestGoodAnswerStreak}</strong></div>
            <hr className={`${colorTheme.hrBorderColor}`} />
            {gameHistory.questionsAndAnswers.map((question, index) => <QuestionComponent key={question._id} questionObject={question} num={index + 1} />)}
            <div id="questionsCont"></div>
          </div>
        </>
      ) : (
        <div>Loading...</div>
      )}

    </>
  )
}