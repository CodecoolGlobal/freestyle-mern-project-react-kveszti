import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import he from "he";
import { UserObjectContext } from "../../App";
import { ColorThemeContext } from "../../App";
import GameOver from "../GameOver/GameOver";

export default function QuestionsAndAnswers({ questionsArray, setIsPlaying }) {
  const { userObj, setUserObj } = useContext(UserObjectContext);
  const { colorTheme } = useContext(ColorThemeContext);
  let correctAnswerSound = new Audio('correctChime.mp3');
  let incorrectAnswerSound = new Audio('incorrectChime.mp3');
  const [id, setID] = useState(userObj.userID);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [allAnswersArray, setAllAnswersArray] = useState([]);
  const [objectifiedArrayIncorrect, setObjectifiedArrayIncorrect] = useState([])
  const [correctAnswerObject, setCorrectAnswerObject] = useState({})

  const [allAnswers, setAllAnswers] = useState([])
  const [totalPoints, setTotalPoints] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false)

  const navigate = useNavigate();
  const abc = ["A", "B", "C", "D"];
  const seconds = 1;

  console.log(questionsArray);

  useEffect(() => { console.log(allAnswersArray) }, [allAnswersArray])
  async function fetchData(url, id, method = "GET", body = {}) {
    try {
      const response = await fetch(id !== undefined ? `${url}/${id}` : url, method === "GET" ? { method } : { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      return await response.json();
    } catch (err) {
      console.error("Error while fetching:", err);
    }
  }

  useEffect(() => {
    try {
      console.log("I'm running")

      //console.log('in try: ', questionsArray);
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
      correctAnswerSound.play();
      const difficulty = questionsArray[questionIndex].difficulty;
      const category = he.decode(questionsArray[questionIndex].category);
      let points = difficulty === 'easy' ? 1 : difficulty === 'medium' ? 2 : 3;
      setTotalPoints((prevPoints) => prevPoints + points);
      const data = { name: category, points: points }
      fetchData(`/api/users/id/${id}/stats`, '', 'PATCH', data)
        .then(response => {
          console.log(response);
        })
        .catch(error => {
          console.log(error);
        });
      setTimeout(() => {
        answerDiv.classList.remove("correct-answer-blink");
        if (questionIndex < questionsArray.length - 1) {
          setQuestionIndex(prevIndex => prevIndex + 1);
        } else {
          setIsGameOver(true);
        }
      }, 2000);
    } else {
      incorrectAnswerSound.play();
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
          setIsGameOver(true);
        }
      }, 2000);

    }
  }

  return (!isGameOver ? <div className={`QAndACont ${colorTheme.darkContBackground}`}>
    <div id="question" className={`questionCont ${colorTheme.darkText}`}>{he.decode(questionsArray[questionIndex].question)}</div>
    <div className="answersCont">{allAnswersArray.map((obj, index) => {
      return <><div id={"answer" + index} className="answerCont" onClick={(event) => handleAnswerSelect(obj.isCorrect, event.target)}>
        <div className={`answerIndex ${colorTheme.lightText} ${colorTheme.darkContBackground}`}><div className="answerIndexText">{abc[index]}</div></div>
        <div className={`answerText ${colorTheme.darkText}`}>{obj.text}</div>
      </div></>
    })}
    </div>
  </div> : <GameOver totalPoints={totalPoints} setIsPlaying={setIsPlaying} setIsGameOver={setIsGameOver} />)

}