import { useEffect, useState } from "react";
import QuestionsAndAnswers from "../../Components/QuestionsAndAnswers/QuestionsAndAnswers";

export default function PlayMode() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [questionsArray, setQuestionsArray] = useState(null);
  const [selectedDiff, setSelectedDiff] = useState('easy');
  const [selectedCat, setSelectedCat] = useState('Any');

  const categoryObj = [
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
  const difficultyArray = ['Easy', 'Medium', 'Hard', 'Any'];

  function generateLink(category, difficulty) {

    const APILinkStart = `https://opentdb.com/api.php?amount=15`;
    const APILinkCategory = `&category=${category}`;
    const APILinkDifficulty = `&difficulty=${difficulty}`;
    const APILinkType = `&type=multiple`;

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
    console.log(generateLink(selectedCat, selectedDiff))
    await fetchQuestions(generateLink(selectedCat, selectedDiff));
    setIsPlaying(true);
    //Eszti
    //
    //Zsani
    //

  }
  useEffect(() => { console.log(selectedCat); console.log(selectedDiff) }, [selectedCat, selectedDiff])

  return (<>
    {isPlaying ? <QuestionsAndAnswers questionsArray={questionsArray} /> :
      <div className="optionsContainer">
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