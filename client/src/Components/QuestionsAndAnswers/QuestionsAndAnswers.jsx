import { useState, useEffect } from "react";
export default function QuestionsAndAnswers({ questionsArray }) {
  const [questionIndex, setQuestionIndex] = useState(0);
  const [allAnswersArray, setAllAnswersArray] = useState([]);
  const [objectifiedArrayIncorrect, setObjectifiedArrayIncorrect] = useState([])
  const [correctAnswerObject, setCorrectAnswerObject] = useState({})
  const [allAnswers, setAllAnswers] = useState([])
  const abc = ["A", "B", "C", "D"];

  console.log(questionsArray);

  useEffect(() => { console.log(allAnswersArray) }, [allAnswersArray])


  useEffect(() => {
    try {
      console.log("I'm running")
      setObjectifiedArrayIncorrect(questionsArray[questionIndex].incorrect_answers.map(answer => {
        return { text: answer, isCorrect: false }
      }))
      setCorrectAnswerObject({ text: questionsArray[questionIndex].correct_answer, isCorrect: true })

      setAllAnswers([...objectifiedArrayIncorrect, correctAnswerObject]);

      setAllAnswersArray(shuffleArray(allAnswers));
    } catch (err) {
      console.error(err)
    }

  }, []);


  useEffect(() => {
    setObjectifiedArrayIncorrect(questionsArray[questionIndex].incorrect_answers.map(answer => {
      return { text: answer, isCorrect: false }
    }))
    setCorrectAnswerObject({ text: questionsArray[questionIndex].correct_answer, isCorrect: true })

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



  return (<>
    <div id="question" className="questionCont">{questionsArray[questionIndex].question}</div>
    <div className="answersCont">{allAnswers.map((obj, index) => {
      return <><div className={"answer" + index + "Cont"} onClick={() => setQuestionIndex((previndex) => { return previndex + 1 })}>
        <div className={"answer" + index + "Index"}>{abc[index]}</div>
        <div className={"answer" + index + "Text"}>{obj.text}</div>
      </div></>
    })}

    </div>
  </>)

}