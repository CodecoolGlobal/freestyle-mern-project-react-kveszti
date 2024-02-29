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

  return { nextNumber, prevNumber, counter };
}


export default function MyStats() {
  const { userObj, setUserObj } = useContext(UserObjectContext);
  const { colorTheme } = useContext(ColorThemeContext);
  const [id, setID] = useState(userObj.userID);
  const [userStats, setUserStats] = useState(null);
  const [filteredUserStats, setFilteredUserStats] = useState(null);
  const [prevLevel, setPrevLevel] = useState(15);
  const [nextLevel, setNextLevel] = useState(22.5);
  const [currentLevel, setCurrentLevel] = useState(0)

  const [prevLevelCat, setPrevLevelCat] = useState(6);
  const [nextLevelCat, setNextLevelCat] = useState(9);
  const [currentLevelCat, setCurrentLevelCat] = useState(0);
  const [selectedCat, setSelectedCat] = useState(null);

  useEffect(() => {
    fetchData(`/api/users/id/${id}/stats`)
      .then(response => {
        // console.log(response);
        if (response.success) {
          setUserStats(response.user);
          console.log(response.user);
        }
      })
      .catch(error => {
        console.log(error);
      });
  }, [])

  useEffect(() => {
    if (userStats) {
      const { nextNumber, prevNumber, counter } = findClosestNumbers(prevLevel, userStats.stats[1].category.points);
      setPrevLevel(prevNumber);
      setNextLevel(nextNumber);
      setCurrentLevel(counter);
      const totalObj = userStats.stats.find(object => object.category.name === 'total');
      const userStatsFiltered = userStats.stats.filter(stat => stat._id != totalObj._id);
      setFilteredUserStats(userStatsFiltered);
    }
  }, [userStats])

  // useEffect(() => { console.log(userObj) }, [userObj])
  // useEffect(() => { console.log(filteredUserStats) }, [filteredUserStats])

  return (
    <>
      <div className={`StatsContMain ${colorTheme.darkContBackground}`}>

        {userStats ? (
          <>
            <div className={`generalStatsCont ${colorTheme.lightContBackground} ${colorTheme.darkText}`}>
              <div>Played games: {userStats.userRef.playedGames.length}</div>

              <div className="streakCont"><div>Longest 🔥</div>
                <div>In a single gameplay: {userStats.userRef.longestStreakOneGame}</div>
                <div>Through multiple games: {userStats.userRef.longestStreakThroughGames}</div></div>
            </div>
            <div className="progressCont">
              <h2 className="lbTitle">Overall progress</h2>
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
            <div className="XPContRemaining">
              {filteredUserStats ?
                <select name="category" className="categoryDrop" onChange={(e) => setSelectedCat(e.target.value)}>
                  {filteredUserStats
                    //.sort((a, b) => a.category.name.localeCompare(b.category.name))
                    .map(cat => (
                      <option key={cat._id} value={cat.category.name}>{cat.category.name}</option>
                    ))}
                </select> : <></>}
            </div>
          </>) : (
          <p className="gameOverInfo">Loading user stats...</p>
        )}
      </div>

    </>
  )
}