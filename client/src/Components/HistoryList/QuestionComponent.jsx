import { useState, useEffect, useContext } from "react";
import { ColorThemeContext } from "../../App";
import he from "he";

export default function QuestionComponent({ questionObject, num }) {
  const incorrectAnswers = questionObject["incorrect_answers"];
  const choosenAnswer = questionObject.choosenAnswer;
  const { colorTheme } = useContext(ColorThemeContext);

  return (
    <>
      <div className={`singleQuestionCont ${colorTheme.darkContBackground}`}>
        <div id="question" className="historyQuestion"><strong>{num + "." + " " + he.decode(questionObject.question)}</strong></div>
        <div className="correctAnswer">{he.decode(questionObject["correct_answer"])}</div>
        {incorrectAnswers.map(answer => {
          if (he.decode(answer) === choosenAnswer) {
            return <div className="choosenIncorrectAnswer">{he.decode(answer)}</div>
          } else {
            return <div className={`simpleIncorrectAnswer`}>{he.decode(answer)}</div>
          }
        })}
      </div>
    </>
  )
}