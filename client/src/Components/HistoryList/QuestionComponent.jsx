import { useState, useEffect, useContext } from "react";
import { ColorThemeContext } from "../../App";
import he from "he";

export default function QuestionComponent({ questionObject, num }) {
  const incorrectAnswers = questionObject["incorrect_answers"];
  const chosenAnswer = questionObject.choosenAnswer;
  const { colorTheme } = useContext(ColorThemeContext);

  return (
    <>
      <div className={`singleQuestionCont ${colorTheme.darkContBackground}`}>
        <div id="question" className="historyQuestion"><strong>{num + "." + " " + he.decode(questionObject.question)}</strong></div>
        <div key={"correct" + questionObject._id} className="correctAnswer">{he.decode(questionObject["correct_answer"])}</div>
        {incorrectAnswers.map((answer, index) => {
          if (he.decode(answer) === chosenAnswer) {
            return <div key={`chosen-${index}`} className="choosenIncorrectAnswer">{he.decode(answer)}</div>
          } else {
            return <div key={`incorrect-${index}`} className={`simpleIncorrectAnswer`}>{he.decode(answer)}</div>
          }
        })}
      </div>
    </>
  )
}