import { useState, useEffect, useContext } from "react";
import { ColorThemeContext } from "../../App";

export default function HistoryListElement({ gameObject }) {
  const { colorTheme } = useContext(ColorThemeContext);
  const date = new Date(gameObject.createdAt);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  const formattedDate = `${year}.${month}.${day}.`;
  return (
    <>
      <div id="HListElementCont" className={`HListElementCont ${colorTheme.lightContBackground} ${colorTheme.darkText}`} >
        <div><strong>{formattedDate}</strong></div>
        <hr className={`${colorTheme.hrBorderColor}`} />
        <div>XP earned: <strong>{gameObject.gainedPoints}</strong></div>
        <div><strong>{gameObject.correctAnswers}</strong> correct answer(s) out of <strong>{gameObject.allAnswers}</strong> answered question(s)</div>
        <div>Longest streak of correct answers: <strong>{gameObject.longestGoodAnswerStreak}</strong></div>
      </div>
    </>
  )
}