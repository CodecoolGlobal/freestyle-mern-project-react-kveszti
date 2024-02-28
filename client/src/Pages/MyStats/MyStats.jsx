import { useState, useEffect, useContext } from "react";
import { UserObjectContext } from "../../App";
import { ColorThemeContext } from "../../App";

export default function MyStats() {
  const { userObj, setUserObj } = useContext(UserObjectContext);
  const { colorTheme } = useContext(ColorThemeContext);
  const [id, setID] = useState(userObj.userID);

  useEffect(() => { console.log(userObj) }, [userObj])
}