import { useNavigate } from "react-router-dom";
import { ColorThemeContext } from "../../App";
import { useContext } from "react";

export default function GameModeCont({ title, summary, validUser, path }) {
  const navigate = useNavigate();
  const { colorTheme } = useContext(ColorThemeContext)

  return (
    validUser ?
      <div id={title + "ModeCont"} className={"gameModeCont" + " " + colorTheme.darkContBackground}>
        <h2 className="gameModeTitle">{title}</h2>
        <p className="gameModeSummary">{summary}</p>
        <button className="startGameHomePage" onClick={() => navigate(path)}>Start game</button>
      </div> : <div id={title + "ModeCont"} className={"gameModeCont" + " " + colorTheme.darkContBackground}>
        <h2 className="gameModeTitle">{title}</h2>
        <p className="gameModeSummary">{summary}</p>
      </div>
  )
}