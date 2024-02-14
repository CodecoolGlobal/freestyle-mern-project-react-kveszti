import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import he from "he";
import { UserObjectContext } from "../../App";
export default function QuestionsAndAnswers({ questionsArray }) {
  const { userObj, setUserObj } = useContext(UserObjectContext);
  const [id, setID] = useState(userObj.userID);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [allAnswersArray, setAllAnswersArray] = useState([]);
  const [objectifiedArrayIncorrect, setObjectifiedArrayIncorrect] = useState([])
  const [correctAnswerObject, setCorrectAnswerObject] = useState({})
  const [allAnswers, setAllAnswers] = useState([])
  const [totalPoints, setTotalPoints] = useState(0);
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

  function handleAnswerSelect(isCorrect) {
    if (questionIndex < questionsArray.length - 1) {
      //Eszti
      //
      //Zsani
      if (isCorrect) {
        const difficulty = questionsArray[questionIndex].difficulty;
        const category = he.decode(questionsArray[questionIndex].category);
        let points = difficulty === 'easy' ? 1 : difficulty === 'medium' ? 2 : 3;
        setTotalPoints((prevPoints) => prevPoints + points);
        console.log(totalPoints, category);
        const data = { name: category, points: points }
        fetchData(`/api/users/id/${id}/stats`, '', 'PATCH', data)
          .then(response => {
            console.log(response);
          })
          .catch(error => {
            console.log(error);
          });
      }
      //
      setQuestionIndex((previndex) => previndex + 1);
    } else {
      //Eszti
      //
      //Zsani
      if (isCorrect) {
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
      }
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