import { useState, useEffect, useContext, useRef } from "react";
import he from "he";
import { UserObjectContext } from "../../App";
import { ColorThemeContext } from "../../App";
import GameOver from "../GameOver/GameOver";

export default function QuestionsAndAnswers({ questionsArray, setIsPlaying, gameMode, category, difficulty }) {
  const { userObj, setUserObj } = useContext(UserObjectContext);
  const { colorTheme } = useContext(ColorThemeContext);
  let correctAnswerSound = new Audio('/correctChime.mp3');
  let incorrectAnswerSound = new Audio('/incorrectChime.mp3');
  const [id, setID] = useState(userObj.userID);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [allAnswersArray, setAllAnswersArray] = useState([]);
  const [objectifiedArrayIncorrect, setObjectifiedArrayIncorrect] = useState([])
  const [correctAnswerObject, setCorrectAnswerObject] = useState({})

  const [allAnswers, setAllAnswers] = useState([])
  const [totalPoints, setTotalPoints] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [correctAnswersNr, setCorrectAnswersNr] = useState(0);

  const [barWidth, setBarWidth] = useState(100);
  const [answerSelected, setAnswerSelected] = useState(false);

  const [currentStreak, setCurrentStreak] = useState(0);

  const [gameId, setGameId] = useState(null);

  const [firstAnswerCss, setFirstAnswerCss] = useState("");
  const [secondAnswerCss, setSecondAnswerCss] = useState("");
  const [thirdAnswerCss, setThirdAnswerCss] = useState("");
  const [fourthAnswerCss, setFourthAnswerCss] = useState("");

  const abc = ["A", "B", "C", "D"];
  const interval = useRef(null);
  const intervalBar = useRef(null)

  // // //console.log(questionsArray);

  // // //useEffect(() => { console.log(allAnswersArray) }, [allAnswersArray])

  async function fetchData(url, id, method = "GET", body = {}) {
    try {
      const response = await fetch(id !== undefined ? `${url}/${id}` : url, method === "GET" ? { method } : { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      return await response.json();
    } catch (err) {
      console.error("Error while fetching:", err);
    }
  }

  function setCss(index, rightOrWrong) {
    switch (index) {
      case 0:
        setFirstAnswerCss(rightOrWrong);
        return;
      case 1:
        setSecondAnswerCss(rightOrWrong);
        return;
      case 2:
        setThirdAnswerCss(rightOrWrong);
        return;
      case 3:
        setFourthAnswerCss(rightOrWrong);
        return;
    }
  }

  useEffect(() => {
    try {
      setObjectifiedArrayIncorrect(questionsArray[questionIndex].incorrect_answers.map(answer => {
        return { text: answer, isCorrect: false }
      }))
      setCorrectAnswerObject({ text: questionsArray[questionIndex].correct_answer, isCorrect: true });
      fetchData("/api/gamehistory", "", "POST", { user: id, gameMode: gameMode, category: category.category, difficulty: difficulty }).then(response => setGameId(response.gameHistory._id));
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

  useEffect(() => {

    if (gameMode !== "zen" && gameId) {
      interval.current = setInterval(() => {
        setCurrentStreak(0);
        const correctAnswerIndex = allAnswersArray.findIndex(answer => answer.isCorrect === true);
        setCss(correctAnswerIndex, "wrong-answer")

        const difficulty = questionsArray[questionIndex].difficulty;
        const category = he.decode(questionsArray[questionIndex].category);
        let points = 0;

        const currentQuestion = questionsArray[questionIndex];
        currentQuestion.game = gameId;
        currentQuestion.choosenAnswer = "none";
        currentQuestion.isCorrect = false;
        currentQuestion.points = points;

        if (gameMode === 'allIn') {
          points = difficulty === 'easy' ? -2 : difficulty === 'medium' ? -4 : -6;
          setTotalPoints((prevPoints) => prevPoints >= Math.abs(points) ? prevPoints + points : 0);
          currentQuestion.points = points;
          const data = { name: category, points: points, question: currentQuestion }

          fetchData(`/api/users/id/${id}/stats`, '', 'PATCH', data)
            .then(response => {
              console.log(response);
            })
            .catch(error => {
              console.log(error);
            });
        } else {
          fetchData(`/api/users/id/${id}/stats`, '', 'PATCH', { question: currentQuestion, points: 0 })
            .then(response => {
              console.log(response);
            })
            .catch(error => {
              console.log(error);
            });
        }
        setTimeout(() => {
          setCss(correctAnswerIndex, "")
          if (questionIndex < questionsArray.length - 1) {
            setQuestionIndex(prevIndex => prevIndex + 1);
            setBarWidth(100);
          } else {
            fetchData(`/api/gameover/gameID/${gameId}`, '', "PATCH", {}).then(data => setIsGameOver(true));
          }
        }, 2000);
      }, 1000 * 10);
    }
    return () => clearInterval(interval.current);

  }, [allAnswersArray, gameId])

  useEffect(() => {
    if (gameMode !== "zen") {
      intervalBar.current = setInterval(() => {
        if (!answerSelected) {
          setBarWidth(prev => Math.max(prev - 1, 0));
        }
      }, 100);
    }
    return () => clearInterval(intervalBar.current);
  }, [questionIndex, allAnswersArray, gameMode]);

  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  // useEffect(() => { console.log(currentStreak) }, [currentStreak])

  function handleAnswerSelect(isCorrect, eventTarget, index) {
    clearInterval(interval.current);
    clearInterval(intervalBar.current)
    setAnswerSelected(true);

    while (eventTarget && !eventTarget.classList.contains("answerCont")) {
      eventTarget = eventTarget.parentElement;
    }

    isCorrect ? setCss(index, "correct-answer-blink") : setCss(index, "wrong-answer");

    const difficulty = questionsArray[questionIndex].difficulty;
    const category = he.decode(questionsArray[questionIndex].category);
    let points = 0;

    const currentQuestion = questionsArray[questionIndex];
    currentQuestion.game = gameId;
    currentQuestion.choosenAnswer = eventTarget.textContent.slice(1);
    currentQuestion.isCorrect = isCorrect;


    if (isCorrect) {
      setCurrentStreak((prevNum) => prevNum + 1);
      correctAnswerSound.play();
      setCorrectAnswersNr(prev => prev += 1)

      if (gameMode === 'sprint' || gameMode === "zen") {
        points = difficulty === 'easy' ? 2 : difficulty === 'medium' ? 4 : 6;
      } else if (gameMode !== 'allIn') {
        points = difficulty === 'easy' ? 4 : difficulty === 'medium' ? 8 : 12;
      } else if (gameMode !== '5050') {
        points = difficulty === 'easy' ? 1 : difficulty === 'medium' ? 2 : 3;
      }
      currentQuestion.points = points;
      setTotalPoints((prevPoints) => prevPoints + points);
      const data = { name: category, points: points, question: currentQuestion }
      fetchData(`/api/users/id/${id}/stats`, '', 'PATCH', data)
        .then(response => {
          console.log(response);
        })
        .catch(error => {
          console.log(error);
        });
      setTimeout(() => {
        setCss(index, "");
        if (questionIndex < questionsArray.length - 1) {
          setQuestionIndex(prevIndex => prevIndex + 1);
          setBarWidth(100);
          setAnswerSelected(false);
        } else {
          fetchData(`/api/gameover/gameID/${gameId}`, '', "PATCH", {}).then(data => setIsGameOver(true));
        }
      }, 2000);
    } else {
      setCurrentStreak(0);
      incorrectAnswerSound.play();
      const correctAnswerIndex = allAnswersArray.findIndex(answer => answer.isCorrect === true);
      setCss(correctAnswerIndex, "correct-answer")

      if (gameMode === 'allIn') {
        points = difficulty === 'easy' ? -2 : difficulty === 'medium' ? -4 : -6;
        setTotalPoints((prevPoints) => prevPoints >= Math.abs(points) ? prevPoints + points : 0);
      }

      currentQuestion.points = points;

      const data = { name: category, points: points, question: currentQuestion }
      fetchData(`/api/users/id/${id}/stats`, '', 'PATCH', data)
        .then(response => {
          console.log(response);
        })
        .catch(error => {
          console.log(error);
        });
      setTimeout(() => {
        setCss(index, "");
        setCss(correctAnswerIndex, "");
        if (questionIndex < questionsArray.length - 1) {
          setQuestionIndex(prevIndex => prevIndex + 1);
          setBarWidth(100);
          setAnswerSelected(false);
        } else {
          fetchData(`/api/gameover/gameID/${gameId}`, '', "PATCH", {}).then(data => setIsGameOver(true));
        }
      }, 2000);
    }
  }

  return (!isGameOver ? <div className="topMargin"> <div className="questionDetails">
    <div className="whichQuestion">{questionIndex + 1 + '/' + questionsArray.length}</div>
    {currentStreak > 0 ? <div className="currentStreak">{currentStreak} 🔥</div> : ""}
  </div>{gameMode === "zen" ? <></> : isGameOver === false ? <div className="timeBarCont"><div className="timeBar" style={{ width: `${barWidth}%` }}></div></div> : <></>}
    <div className={`QAndACont ${colorTheme.darkContBackground}`}>
      <div id="question" className={`questionCont ${colorTheme.darkText}`}>{he.decode(questionsArray[questionIndex].question)}</div>
      <div className="answersCont">{allAnswersArray.map((obj, index) => {
        return <><div id={"answer" + index} className={`answerCont ${index === 0 ? firstAnswerCss : index === 1 ? secondAnswerCss : index === 2 ? thirdAnswerCss : index === 3 ? fourthAnswerCss : ""}`} onClick={(event) => handleAnswerSelect(obj.isCorrect, event.target, index)}>
          <div className={`answerIndex ${colorTheme.lightText} ${colorTheme.darkContBackground}`}><div className="answerIndexText">{abc[index]}</div></div>
          <div className={`answerText ${colorTheme.darkText}`}>{obj.text}</div>
        </div></>
      })}
      </div>
    </div></div> : <GameOver totalPoints={totalPoints} setIsPlaying={setIsPlaying} setIsGameOver={setIsGameOver} correctAnswersNr={correctAnswersNr} questionsArrayLength={questionsArray.length} userId={id} />)

}