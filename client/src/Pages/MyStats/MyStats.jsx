import { useState, useEffect, useContext } from "react";
import { UserObjectContext } from "../../App";
import { ColorThemeContext } from "../../App";
import { CircularProgressbar, CircularProgressbarWithChildren, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import he from "he";

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
  let prevNumber = 0;
  let counter = 0;

  while (nextNumber < currentNumber) {
    prevNumber = nextNumber
    nextNumber *= 1.5;
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
  const [prevLevel, setPrevLevel] = useState(0);
  const [nextLevel, setNextLevel] = useState(15);
  const [currentLevel, setCurrentLevel] = useState(0)

  const [prevLevelCat, setPrevLevelCat] = useState(0);
  const [nextLevelCat, setNextLevelCat] = useState(6);
  const [currentLevelCat, setCurrentLevelCat] = useState(0);
  const [selectedCat, setSelectedCat] = useState(null);
  const [selectedCatPoints, setSelectedCatPoints] = useState(null);
  const [highestCat, setHighestCat] = useState(null);
  const [highestCatLevel, setHighestCatLevel] = useState(null);
  const [prevLevelHighestCat, setPrevLevelHighestCat] = useState(6);

  const [mostPlayedMode, setMostPlayedMode] = useState(null);
  const [mostQuestionsCat, setMostQuestionsCat] = useState(null);
  const [gameMode, setGameMode] = useState(null);

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
    if (mostPlayedMode) {
      console.log(mostPlayedMode)
      if (mostPlayedMode[0] === "sprint") {
        setGameMode("Sprint");
      } else if (mostPlayedMode[0] === "allIn") {
        setGameMode("All in");
      } else if (mostPlayedMode[0] === "5050") {
        setGameMode("50:50");
      } else if (mostPlayedMode[0] === "zen") {
        setGameMode("Zen");
      }
    }
  }, [mostPlayedMode])


  useEffect(() => {
    if (userStats) {
      const { nextNumber, prevNumber, counter } = findClosestNumbers(nextLevel, userStats.stats[1].category.points);
      setPrevLevel(prevNumber);
      setNextLevel(nextNumber);
      setCurrentLevel(counter);
      const totalObj = userStats.stats.find(object => object.category.name === 'total');
      const userStatsFiltered = userStats.stats.filter(stat => stat._id != totalObj._id);
      setFilteredUserStats(userStatsFiltered);
      setSelectedCat(userStatsFiltered[0].category.name)
      setHighestCat(userStatsFiltered.sort((a, b) => b.category.points - a.category.points)[0].category)
    }
  }, [userStats])

  useEffect(() => {
    if (filteredUserStats) {
      console.log(selectedCat)
      const categoryObj = userStats.stats.find(object => object.category.name === selectedCat);
      console.log("catObj", categoryObj)
      const { nextNumber, prevNumber, counter } = findClosestNumbers(nextLevelCat, categoryObj.category.points);
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


  useEffect(() => { console.log(userObj) }, [userObj])
  // // // // useEffect(() => { console.log(filteredUserStats) }, [filteredUserStats])

  return (
    <>
      <div className={`StatsContMain ${colorTheme.darkContBackground}`}>

        {userStats ? (
          <>
            <div className={`generalStatsCont statsGrid1 ${colorTheme.lightContBackground} ${colorTheme.darkText}`}>
              <div>
                <h2>Played games: {userStats.userRef.playedGames.length}</h2>
              </div>
              <div>
                <h2>Most played game mode:</h2>
                {gameMode ? <h2>{gameMode} ({mostPlayedMode[1].length})</h2> : <></>}
              </div>
              <div>
                <div className="streakCont"><h2>Longest 🔥</h2>
                  <h3>In a single gameplay: {userStats.userRef.longestStreakOneGame}</h3>
                  <h3>Through multiple games: {userStats.userRef.longestStreakThroughGames}</h3></div>
              </div>
            </div>
            <div className="statsGrid2"> <div>
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
              <h3 className="LVLTitleSpacer">CURRENT LEVEL: {currentLevel}</h3>
            </div></div>

            <div className="XPContRemaining statsGrid1">
              {filteredUserStats ?
                <div>
                  <select name="category" className="categoryDropStats" onChange={(e) => { setSelectedCat(e.target.value); setSelectedCatPoints(e.target.id) }}> {filteredUserStats[0].name
                  }
                    {filteredUserStats
                      //.sort((a, b) => a.category.name.localeCompare(b.category.name))
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
                      {<div><h3 className="donutTxt"> {`${selectedCatPoints}`}</h3></div>}
                    </CircularProgressbarWithChildren>
                  </div>
                  <h2 className="lbTitle">{selectedCat}</h2>
                  <h3>CURRENT LEVEL: {currentLevelCat}</h3>
                </div>
                : <></>}
            </div>
            {mostQuestionsCat ? <div className={`generalStatsCont statsGrid2 ${colorTheme.lightContBackground} ${colorTheme.darkText}`}>
              <div className="row1">
                <h2>Highest category:</h2>
                <h3>{he.decode(highestCat.name)} (LVL {highestCatLevel})</h3>
              </div>
              <div className="row2"></div>
              <div className="row3">
                <h2>Most questions answered:</h2>
                <h3>{he.decode(mostQuestionsCat[0])} ({mostQuestionsCat[1].length})</h3>
              </div>
            </div> : <></>}
          </>) : (
          <p className="gameOverInfo">Loading user stats...</p>
        )}
      </div>

    </>
  )
}