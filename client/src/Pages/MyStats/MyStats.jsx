import { useState, useEffect, useContext } from "react";
import { UserObjectContext } from "../../App";
import { ColorThemeContext } from "../../App";
import { CircularProgressbar, CircularProgressbarWithChildren, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

async function fetchData(url, id, method = "GET", body = {}) {
  try {
    const response = await fetch(id !== undefined ? `${url}/${id}` : url, method === "GET" ? { method } : { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    return await response.json();
  } catch (err) {
    console.error("Error while fetching:", err);
  }
}

function findClosestNumbers(starterNumber, currentNumber) {
  let nextNumber = starterNumber;
  let prevNumber = starterNumber;
  let counter = 0;

  while (nextNumber < currentNumber) {
    prevNumber = nextNumber
    nextNumber *= 1.5;
    counter++
  }
  if (currentNumber === nextNumber) {
    counter++
  }

  return { nextNumber, prevNumber, counter };
}


export default function MyStats() {
  const { userObj, setUserObj } = useContext(UserObjectContext);
  const { colorTheme } = useContext(ColorThemeContext);
  const [id, setID] = useState(userObj.userID);
  const [userStats, setUserStats] = useState(null);
  const [userGames, setUserGames] = useState(null);
  const [allQuestions, setAllQuestions] = useState(null);
  const [filteredUserStats, setFilteredUserStats] = useState(null);
  const [prevLevel, setPrevLevel] = useState(15);
  const [nextLevel, setNextLevel] = useState(22.5);
  const [currentLevel, setCurrentLevel] = useState(0)

  const [prevLevelCat, setPrevLevelCat] = useState(6);
  const [nextLevelCat, setNextLevelCat] = useState(9);
  const [currentLevelCat, setCurrentLevelCat] = useState(0);
  const [selectedCat, setSelectedCat] = useState(null);
  const [selectedCatPoints, setSelectedCatPoints] = useState(null);
  const [highestCat, setHighestCat] = useState(null);
  const [highestCatLevel, setHighestCatLevel] = useState(null);
  const [prevLevelHighestCat, setPrevLevelHighestCat] = useState(6);

  const [mostPlayedMode, setMostPlayedMode] = useState(null);
  const [mostQuestionsCat, setMostQuestionsCat] = useState(null);

  useEffect(() => {
    fetchData(`/api/users/id/${id}/stats`)
      .then(response => {
        console.log(response);
        if (response.success) {
          setUserStats(response.user);
          setAllQuestions(response.allQuestions);
          setUserGames(response.games);
          // // // //console.log(response.user);
        }
      })
      .catch(error => {
        console.log(error);
      });
  }, [])

  /* if (gameObject.gameMode === "sprint") {
    gameMode = "Sprint"
  } else if (gameObject.gameMode === "allIn") {
    gameMode = "All in"
  } else if (gameObject.gameMode === "5050") {
    gameMode = "50:50"
  } else if (gameObject.gameMode === "zen") {
    gameMode = "Zen"
  } */

  useEffect(() => {
    if (allQuestions) {
      const questionPcsObject = {}
      allQuestions.forEach(question => {
        if (!Object.keys(questionPcsObject).includes(question.category)) {
          questionPcsObject[question.category] = [question];
        } else {
          questionPcsObject[question.category].push(question);
        }
      })
      const arr = Object.entries(questionPcsObject).reduce((acc, [key, value]) => {
        return value.length > acc[1].length ? [key, value] : acc;
      }, ['', []])
      // //console.log(obj);
      setMostQuestionsCat(arr)
    }

  }, [allQuestions])

  useEffect(() => {
    if (userGames) {
      const gameModePcsObject = {}
      userGames.forEach(game => {
        if (!Object.keys(gameModePcsObject).includes(game.gameMode)) {
          gameModePcsObject[game.gameMode] = [game];
        } else {
          gameModePcsObject[game.gameMode].push(game);
        }
      })
      const arr = Object.entries(gameModePcsObject).reduce((acc, [key, value]) => {
        return value.length > acc[1].length ? [key, value] : acc;
      }, ['', []])
      console.log(gameModePcsObject);
      setMostPlayedMode(arr);
    }
  }, [userGames])

  useEffect(() => {
    if (userStats) {
      const { nextNumber, prevNumber, counter } = findClosestNumbers(prevLevel, userStats.stats[1].category.points);
      setPrevLevel(prevNumber);
      setNextLevel(nextNumber);
      setCurrentLevel(counter);
      const totalObj = userStats.stats.find(object => object.category.name === 'total');
      const userStatsFiltered = userStats.stats.filter(stat => stat._id != totalObj._id);
      setFilteredUserStats(userStatsFiltered);
      setSelectedCat(userStatsFiltered.sort((a, b) => a.category.name.localeCompare(b.category.name))[0].category.name)
      setHighestCat(userStatsFiltered.sort((a, b) => b.category.points - a.category.points)[0].category)
    }
  }, [userStats])

  useEffect(() => {
    if (filteredUserStats) {
      console.log(selectedCat)
      const categoryObj = userStats.stats.find(object => object.category.name === selectedCat);
      console.log("catObj", categoryObj)
      const { nextNumber, prevNumber, counter } = findClosestNumbers(prevLevelCat, categoryObj.category.points);
      setPrevLevelCat(prevNumber);
      setNextLevelCat(nextNumber);
      setCurrentLevelCat(counter);
      setSelectedCatPoints(categoryObj.category.points)
    }
  }, [filteredUserStats, selectedCat])

  useEffect(() => {

    if (highestCat) {
      const { nextNumber, prevNumber, counter } = findClosestNumbers(prevLevelHighestCat, highestCat.points);
      console.log("c", counter)

      setHighestCatLevel(counter);
    }
  }, [highestCat])


  // // // // useEffect(() => { console.log(userObj) }, [userObj])
  // // // // useEffect(() => { console.log(filteredUserStats) }, [filteredUserStats])

  return (
    <>
      <div className={`StatsContMain ${colorTheme.darkContBackground}`}>

        {userStats ? (
          <>
            <div className={`generalStatsCont statsGrid1 ${colorTheme.lightContBackground} ${colorTheme.darkText}`}>
              <div>Played games: {userStats.userRef.playedGames.length}</div>
              <div>Most played game mode:</div>
              {mostPlayedMode ? <div>{mostPlayedMode[0]} ({mostPlayedMode[1].length})</div> : <></>}
              <div className="streakCont"><div>Longest 🔥</div>
                <div>In a single gameplay: {userStats.userRef.longestStreakOneGame}</div>
                <div>Through multiple games: {userStats.userRef.longestStreakThroughGames}</div></div>
            </div>
            <div className="statsGrid2">
              <h2 className="lbTitle">Overall progress</h2>
              <div className="progressCont">
                <CircularProgressbarWithChildren
                  value={Math.floor((userStats.stats[1].category.points - prevLevel) / (nextLevel - prevLevel) * 100)}
                  maxValue={100}
                  styles={buildStyles({
                    strokeLinecap: "butt",
                    textColor: "white",
                    pathColor: `${colorTheme.progressDonutPath}`,
                    trailColor: `${colorTheme.progressDonutTrail}`,
                  })}>
                  {<div><p className="donutTxt">{`${userStats.stats[1].category.name}:`} <br /> {`${userStats.stats[1].category.points}`}</p></div>}
                </CircularProgressbarWithChildren>
              </div>
              <h3>CURRENT LEVEL: {currentLevel}</h3>
            </div>

            <div className="XPContRemaining statsGrid1">
              {filteredUserStats ?
                <>
                  <select name="category" className="categoryDropStats" onChange={(e) => { setSelectedCat(e.target.value); setSelectedCatPoints(e.target.id) }}> {filteredUserStats
                    .sort((a, b) => a.category.name.localeCompare(b.category.name))[0].name}
                    {filteredUserStats
                      .sort((a, b) => a.category.name.localeCompare(b.category.name))
                      .map(cat => (
                        <option key={cat._id} id={cat.category.points} value={cat.category.name}>{cat.category.name}</option>
                      ))}
                  </select>

                  <div className="progressCont">
                    <CircularProgressbarWithChildren
                      value={Math.floor((selectedCatPoints - prevLevelCat) / (nextLevelCat - prevLevelCat) * 100)}
                      maxValue={100}
                      styles={buildStyles({
                        strokeLinecap: "butt",
                        textColor: "white",
                        pathColor: `${colorTheme.progressDonutPath}`,
                        trailColor: `${colorTheme.progressDonutTrail}`,
                      })}>
                      {<div><p className="donutTxt"> {`${selectedCatPoints}`}</p></div>}
                    </CircularProgressbarWithChildren>
                  </div>
                  <h2 className="lbTitle">{selectedCat}</h2>
                  <h3>CURRENT LEVEL: {currentLevelCat}</h3>
                </>
                : <></>}
            </div>
            {mostQuestionsCat ? <div className={`generalStatsCont statsGrid2 ${colorTheme.lightContBackground} ${colorTheme.darkText}`}>
              <div>
                <h3>Highest category:</h3>
                {highestCat.name} (LVL {highestCatLevel})
              </div>
              <div>
                <h3>Most questions answered:</h3>
                {mostQuestionsCat[0]} ({mostQuestionsCat[1].length})</div>
            </div> : <></>}
          </>) : (
          <p className="gameOverInfo">Loading user stats...</p>
        )}
      </div>

    </>
  )
}