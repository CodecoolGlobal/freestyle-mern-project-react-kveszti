import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import he from "he";
export default function QuestionsAndAnswers({ questionsArray }) {
  const [questionIndex, setQuestionIndex] = useState(0);
  const [allAnswersArray, setAllAnswersArray] = useState([]);
  const [objectifiedArrayIncorrect, setObjectifiedArrayIncorrect] = useState([])
  const [correctAnswerObject, setCorrectAnswerObject] = useState({})
  const [allAnswers, setAllAnswers] = useState([])
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

  function handleAnswerSelect(isCorrect) {
    if (questionIndex < questionsArray.length - 1) {
      //Eszti
      //
      //Zsani
      //
      setQuestionIndex((previndex) => previndex + 1);
    } else {
      //Eszti
      //
      //Zsani
      //
      navigate("/");
    }
  }


  return (<div className="QAndACont">
    <div id="question" className="questionCont">{he.decode(questionsArray[questionIndex].question)}</div>
    <div className="answersCont">{allAnswers.map((obj, index) => {
      return <><div className="answerCont" onClick={() => setTimeout(() => handleAnswerSelect(obj.isCorrect), 1000 * seconds)}>
        <div className="answerIndex">{abc[index]}</div>
        <div className="answerText">{obj.text}</div>
      </div></>
    })}

    </div>
  </div>)

}