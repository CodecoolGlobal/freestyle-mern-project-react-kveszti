import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import he from "he";
export default function QuestionsAndAnswers({ questionsArray }) {
  const [questionIndex, setQuestionIndex] = useState(0);
  const [allAnswersArray, setAllAnswersArray] = useState([]);
  const [objectifiedArrayIncorrect, setObjectifiedArrayIncorrect] = useState([])
  const [correctAnswerObject, setCorrectAnswerObject] = useState({})
  const [allAnswers, setAllAnswers] = useState([]);

  const navigate = useNavigate();
  const abc = ["A", "B", "C", "D"];
  const seconds = 1;

  console.log(questionsArray);

  useEffect(() => { console.log(allAnswersArray) }, [allAnswersArray])


  useEffect(() => {
    try {
      console.log("I'm running")

      console.log('in try: ', questionsArray);
      setObjectifiedArrayIncorrect(questionsArray[questionIndex].incorrect_answers.map(answer => {
        return { text: answer, isCorrect: false }
      }))
      setCorrectAnswerObject({ text: questionsArray[questionIndex].correct_answer, isCorrect: true })

    } catch (err) {
      console.error(err)
    }
  }, []);

  useEffect(() => { setAllAnswers([...objectifiedArrayIncorrect, correctAnswerObject]) }, [objectifiedArrayIncorrect, correctAnswerObject]);

  useEffect(() => { setAllAnswersArray(shuffleArray(allAnswers)); }, [allAnswers]);

  useEffect(() => {
    setObjectifiedArrayIncorrect(questionsArray[questionIndex].incorrect_answers.map(answer => {
      return { text: he.decode(answer), isCorrect: false }
    }))
    setCorrectAnswerObject({ text: he.decode(questionsArray[questionIndex].correct_answer), isCorrect: true })

    setAllAnswers([...objectifiedArrayIncorrect, correctAnswerObject]);

    setAllAnswersArray(shuffleArray(allAnswers))
  }, [questionIndex])


  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  function handleAnswerSelect(isCorrect, eventTarget) {
    //Eszti
    //
    while (eventTarget && !eventTarget.classList.contains("answerCont")) {
      eventTarget = eventTarget.parentElement;
    }
    const answerDiv = document.getElementById(eventTarget.id);
    answerDiv.classList.add(isCorrect ? "correct-answer-blink" : "wrong-answer");

    if (isCorrect) {
      setTimeout(() => {
        answerDiv.classList.remove("correct-answer-blink");
        if (questionIndex < questionsArray.length - 1) {
          setQuestionIndex(prevIndex => prevIndex + 1);
        } else {
          navigate("/");
        }
      }, 2000);
    } else {
      const correctAnswerIndex = allAnswersArray.findIndex(answer => answer.isCorrect === true);
      console.log(correctAnswerIndex)
      const correctAnswerDiv = document.getElementById(`answer${correctAnswerIndex}`);
      console.log(correctAnswerDiv)
      correctAnswerDiv.classList.add("correct-answer");

      setTimeout(() => {
        answerDiv.classList.remove("wrong-answer");
        correctAnswerDiv.classList.remove("correct-answer");
        if (questionIndex < questionsArray.length - 1) {
          setQuestionIndex(prevIndex => prevIndex + 1);
        } else {
          navigate("/");
        }
      }, 2000);
    }
  }

  return (<div className="QAndACont">
    <div id="question" className="questionCont">{he.decode(questionsArray[questionIndex].question)}</div>
    <div className="answersCont">{allAnswersArray.map((obj, index) => {
      return <><div id={"answer" + index} className="answerCont" onClick={(event) => handleAnswerSelect(obj.isCorrect, event.target)}>
        <div className="answerIndex"><div className="answerIndexText">{abc[index]}</div></div>
        <div className="answerText">{obj.text}</div>
      </div></>
    })}

    </div>
  </div>)

}