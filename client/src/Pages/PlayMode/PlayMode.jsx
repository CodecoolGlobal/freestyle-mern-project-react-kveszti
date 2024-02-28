import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import QuestionsAndAnswers from "../../Components/QuestionsAndAnswers/QuestionsAndAnswers";
import { ColorThemeContext } from "../../App";

export default function PlayMode() {
  const { colorTheme } = useContext(ColorThemeContext);
  const [isPlaying, setIsPlaying] = useState(false);
  const [questionsArray, setQuestionsArray] = useState(null);
  const [selectedDiff, setSelectedDiff] = useState('easy');
  const [selectedCat, setSelectedCat] = useState('Any');


  const { gameMode } = useParams()

  let difficultyArray = ['Easy', 'Medium', 'Hard', 'Any'];

  let categoryObj = [
    { id: 'Any', category: 'Any Category' },
    { id: 9, category: 'General Knowledge' },
    { id: 10, category: 'Entertainment: Books' },
    { id: 11, category: 'Entertainment: Film' },
    { id: 12, category: 'Entertainment: Music' },
    { id: 14, category: 'Entertainment: Television' },
    { id: 15, category: 'Entertainment: Video Games' },
    { id: 17, category: 'Science & Nature' },
    { id: 18, category: 'Science: Computers' },
    { id: 21, category: 'Sports' },
    { id: 22, category: 'Geography' },
    { id: 23, category: 'History' },
    { id: 28, category: 'Vehicles' },
    { id: 31, category: 'Entertainment: Japanese Anime & Manga' },
    { id: 32, category: 'Entertainment: Cartoon & Animations' }
  ]

  if (gameMode === "sprint" || gameMode === "allIn") {
    categoryObj.push({ id: 16, category: 'Entertainment: Board Games' });
    categoryObj.push({ id: 20, category: 'Mythology' });
    categoryObj.push({ id: 27, category: 'Animals' });
    categoryObj.push({ id: 29, category: 'Entertainment: Comics' });
  }
  else if (gameMode === "5050") {
    categoryObj = [
      { id: 'Any', category: 'Any Category' }
    ];
    difficultyArray = ["Any"]
  }



  function generateLink(category, difficulty, quantity, type) {
    //type can be "boolean" or "multiple"
    const APILinkStart = `https://opentdb.com/api.php?amount=${quantity}`;
    const APILinkCategory = `&category=${category}`;
    const APILinkDifficulty = `&difficulty=${difficulty}`;
    const APILinkType = `&type=${type}`;

    if (category === "Any" && difficulty === "Any") {
      return APILinkStart + APILinkType;
    }
    if (category === "Any" && difficulty !== "Any") {
      return APILinkStart + APILinkDifficulty + APILinkType;
    }

    if (category !== "Any" && difficulty === "Any") {
      return APILinkStart + APILinkCategory + APILinkType;
    }

    if (category !== "Any" && difficulty !== "Any") {
      return APILinkStart + APILinkCategory + APILinkDifficulty + APILinkType;
    }
  }

  async function fetchQuestions(url) {
    const response = await fetch(url);
    const questionsObject = await response.json();

    const questionsArrayToSet = questionsObject.results;

    setQuestionsArray(questionsArrayToSet);
  }

  async function handleSelectedCategory() {
    //console.log(generateLink(selectedCat, selectedDiff))
    if (gameMode === "sprint" || gameMode === "allIn") {
      await fetchQuestions(generateLink(selectedCat, selectedDiff, "10", "multiple"));
    }
    if (gameMode === "zen") {
      await fetchQuestions(generateLink(selectedCat, selectedDiff, "15", "multiple"));
    }
    if (gameMode === "5050") {
      await fetchQuestions(generateLink(selectedCat, selectedDiff, "10", "boolean"));
    }
    setIsPlaying(true);
  }
  //useEffect(() => { console.log(selectedCat); console.log(selectedDiff) }, [selectedCat, selectedDiff]);
  useEffect(() => { console.log(gameMode) }, [gameMode]);

  return (<>
    {isPlaying ? <QuestionsAndAnswers questionsArray={questionsArray} setIsPlaying={setIsPlaying} gameMode={gameMode} /> :
      <div className={`optionsContainer ${colorTheme.darkContBackground}`}>
        <h2 className="diffLabel">Difficulty</h2>
        <select name="difficulty" className="difficultyDrop" onChange={(e) => setSelectedDiff(e.target.value)}>
          {difficultyArray.map(str => { return <option key={str} className="difficultyOption" value={str !== 'Any' ? str.toLowerCase() : str} >{str}</option> })}
        </select>
        <h2 className="catLabel">Category</h2>
        <select name="category" className="categoryDrop" onChange={(e) => setSelectedCat(e.target.value)}>
          {categoryObj.map(obj => { return <option key={obj.id} className="categoryOption" value={obj.id}>{obj.category}</option> })}
        </select>
        <button className="startGameBtn" onClick={() => handleSelectedCategory()}>Start game</button>
      </div>}
  </>)
} 