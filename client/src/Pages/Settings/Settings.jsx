import { useState, useEffect, useContext } from "react";
import { ValidUserContext } from "../../App";
import { UserObjectContext } from "../../App";
import { ColorThemeContext } from "../../App";

export default function Settings() {
  const { colorTheme, setColorTheme } = useContext(ColorThemeContext);
  const allColorThemes = {
    blue: {
      "darkContBackground": "darkBlueBackground",
      "lightContBackground": "lightBlueBackground",
      "lightText": "lightBlueText",
      "darkText": "darkBlueText",
      "lightOpacBackground": "lightBlueOpacBackground",
      "bodyBackground": "linear-gradient(to bottom right, #033495, #AEE4FF)",
      "progressDonutPath": "#033495",
      "progressDonutTrail": "#AEE4FF",
    },
    green: {
      "darkContBackground": "darkGreenBackground",
      "lightContBackground": "lightGreenBackground",
      "lightText": "lightGreenText",
      "darkText": "darkGreenText",
      "lightOpacBackground": "lightGreenOpacBackground",
      "bodyBackground": "linear-gradient(to bottom right, #18A5A7, #BFFFC7)",
      "progressDonutPath": "#18A5A7",
      "progressDonutTrail": "#BFFFC7",
    },
    pink: {
      "darkContBackground": "darkPinkBackground",
      "lightContBackground": "lightPinkBackground",
      "lightText": "lightPinkText",
      "darkText": "darkPinkText",
      "lightOpacBackground": "lightPinkOpacBackground",
      "bodyBackground": "linear-gradient(to bottom right, #D74177, #FFE98A)",
      "progressDonutPath": "#D74177",
      "progressDonutTrail": "#FFE98A",
    }
  }

  function handleThemeChange(eventTarget) {
    const key = eventTarget.id;
    setColorTheme(allColorThemes[key]);
    document.body.style.backgroundImage = allColorThemes[key].bodyBackground
  }
  return (<>
    <div className="profileEditLabel">Color theme</div>
    <div className="colorPickerCont"><div className="blueColorPicker" id="blue" onClick={(e) => handleThemeChange(e.target)}></div>
      <div className="pinkColorPicker" id="pink" onClick={(e) => handleThemeChange(e.target)}></div>
      <div className="greenColorPicker" id="green" onClick={(e) => handleThemeChange(e.target)}></div></div>
  </>)
}