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
    },
    purple: {
      "darkContBackground": "darkPurpleBackground",
      "lightContBackground": "lightPurpleBackground",
      "lightText": "lightPurpleText",
      "darkText": "darkPurpleText",
      "lightOpacBackground": "lightPurpleOpacBackground",
      "bodyBackground": "linear-gradient(to bottom right, #7C3FCB, #E593FA)",
      "progressDonutPath": "#7C3FCB",
      "progressDonutTrail": "#E593FA",
    },
    yellow: {
      "darkContBackground": "darkYellowBackground",
      "lightContBackground": "lightYellowBackground",
      "lightText": "lightYellowText",
      "darkText": "darkYellowText",
      "lightOpacBackground": "lightYellowOpacBackground",
      "bodyBackground": "linear-gradient(to bottom right, #F1A45D, #FAE7B8)",
      "progressDonutPath": "#F1A45D",
      "progressDonutTrail": "#FAE7B8",
    },
    codeCool: {
      "darkContBackground": "darkCodeCoolBackground",
      "lightContBackground": "lightCodeCoolBackground",
      "lightText": "lightCodeCoolText",
      "darkText": "darkCodeCoolText",
      "lightOpacBackground": "lightCodeCoolOpacBackground",
      "bodyBackground": "linear-gradient(to bottom right, #3A7B98, #C8F9FF)",
      "progressDonutPath": "#3A7B98",
      "progressDonutTrail": "#C8F9FF",
    },
    kveszti: {
      "darkContBackground": "darkKvesztiBackground",
      "lightContBackground": "lightKvesztiBackground",
      "lightText": "lightKvesztiText",
      "darkText": "darkKvesztiText",
      "lightOpacBackground": "lightKvesztiOpacBackground",
      "bodyBackground": "linear-gradient(to bottom right, #E9528F, #76D9EE)",
      "progressDonutPath": "#E9528F",
      "progressDonutTrail": "#76D9EE",
    },
    zsani: {
      "darkContBackground": "darkZsaniBackground",
      "lightContBackground": "lightZsaniBackground",
      "lightText": "lightZsaniText",
      "darkText": "darkZsaniText",
      "lightOpacBackground": "lightZsaniOpacBackground",
      "bodyBackground": "linear-gradient(to bottom right, #008EAC, #09BEAD)",
      "progressDonutPath": "#008EAC",
      "progressDonutTrail": "#09BEAD",
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
      <div className="greenColorPicker" id="green" onClick={(e) => handleThemeChange(e.target)}></div>
      <div className="purpleColorPicker" id="purple" onClick={(e) => handleThemeChange(e.target)}></div>
      <div className="yellowColorPicker" id="yellow" onClick={(e) => handleThemeChange(e.target)}></div>
      <div className="codeCoolColorPicker" id="codeCool" onClick={(e) => handleThemeChange(e.target)}></div>
      <div className="kvesztiColorPicker" id="kveszti" onClick={(e) => handleThemeChange(e.target)}></div>
      <div className="zsaniColorPicker" id="zsani" onClick={(e) => handleThemeChange(e.target)}></div>
    </div>
  </>)
}