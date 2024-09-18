import { useState, useEffect, useContext } from "react";
import { ColorThemeContext } from "../../App";
import HistoryListElement from "../../Components/HistoryList/HistoryElement";
import HistoryDetailed from "../../Components/HistoryList/HistoryDetailed";

async function fetchData(url, id, method = "GET", body = {}) {
  try {
    const response = await fetch( url, method === "GET" ? { method } : { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    return await response.json();
  } catch (err) {
    console.error("Error while fetching:", err);
  }
}

export default function History() {
  const { colorTheme } = useContext(ColorThemeContext);
  const [view, setView] = useState("all");
  const [allGamesArray, setAllGamesArray] = useState([]);
  const [inspectedGame, setInspectedGame] = useState(null);



  useEffect(() => { fetchData("/api/userHistory", "GET").then(response => setAllGamesArray(response.user.playedGames.reverse())) }, []);


  function handleDetailedView(gameObject) {
    setInspectedGame(gameObject)
    setView("detailed");
  }

  return (
    <>{view === "all" ?
      <><div id="allHistoryListElements" className="historyListCont">
        {allGamesArray.map(game => <HistoryListElement key={game._id} gameObject={game} handleDetailedView={handleDetailedView} />)}
      </div>
      </> :
      <div id="singleDetailedGameHistory"><HistoryDetailed gameObject={inspectedGame} setView={setView} /></div>}</>
  )
}