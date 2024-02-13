import { useNavigate } from "react-router-dom"

export default function GameModeCont({ title, summary, validUser, path }) {
  const navigate = useNavigate();

  return (
    validUser ?
      <div id={title + "ModeCont"} className="gameModeCont">
        <h2 className="gameModeTitle">{title}</h2>
        <p className="gameModeSummary">{summary}</p>
        <button onClick={() => navigate(path)}>Start game</button>
      </div> : <div id={title + "ModeCont"} className="gameModeCont">
        <h2 className="gameModeTitle">{title}</h2>
        <p className="gameModeSummary">{summary}</p>
      </div>
  )
}