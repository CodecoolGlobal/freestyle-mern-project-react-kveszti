import { useState, useEffect, useContext } from "react";
import { ColorThemeContext } from "../../App";
import GameHistory from "../../../../server/model/GameHistory";

export default function HistoryListElement({ gameObject, handleDetailedView }) {
  const { colorTheme } = useContext(ColorThemeContext);
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
  return (
    <>
      <div id="HListElementCont" className={`HListElementCont ${colorTheme.lightContBackground} ${colorTheme.darkText}`} onClick={() => handleDetailedView(gameObject)}>
        <div><strong>{formattedDate}</strong></div>
        <hr className={`${colorTheme.hrBorderColor}`} />
        <div><strong>{gameMode}</strong></div>
        <div>XP earned: <strong>{gameObject.gainedPoints}</strong></div>
        <div><strong>{gameObject.correctAnswers}</strong> correct answer(s) out of <strong>{gameObject.allAnswers}</strong> answered question(s)</div>
        <div>Longest streak of correct answers: <strong>{gameObject.longestGoodAnswerStreak}</strong></div>
        {gameObject.finished ? "" : <div id="unfinishedGame" className="unfinishedGame">This game was abandoned while playing.</div>}

      </div>
    </>
  )
}