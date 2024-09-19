import { useState, useEffect, createContext } from 'react';
import "./App.css";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Register from './Pages/Register/Register.jsx';
import Login from './Pages/Login/Login.jsx';
import UserProfile from './Components/UserProfile/UserProfile.jsx';
import MainPage from './Pages/MainPage/MainPage.jsx';
import UnderConstruction from './Pages/UnderConstruction/UnderConstruction.jsx';
import PlayMode from './Pages/PlayMode/PlayMode.jsx';
import Settings from './Pages/Settings/Settings.jsx';
import Leaderboard from './Pages/Leaderboard/Leaderboard.jsx';
import MyStats from './Pages/MyStats/MyStats.jsx';
import History from './Pages/History/History.jsx';

import { Layout } from './Pages/Layout/Layout.jsx'

export const ValidUserContext = createContext(false);

export const ColorThemeContext = createContext({
  "darkContBackground": "darkBlueBackground",
  "lightContBackground": "lightBlueBackground",
  "lightText": "lightBlueText",
  "darkText": "darkBlueText",
  "lightOpacBackground": "lightBlueOpacBackground",
  "bodyBackground": "linear-gradient(to bottom right, #033495, #AEE4FF)",
  "progressDonutPath": "#033495",
  "progressDonutTrail": "#AEE4FF",
  "hrBorderColor": "darkBlueHrBorder"
})

function App() {
  const [validUser, setValidUser] = useState(false); //🔰 needs to be false once done
  const [colorTheme, setColorTheme] = useState({
    "darkContBackground": "darkBlueBackground",
    "lightContBackground": "lightBlueBackground",
    "lightText": "lightBlueText",
    "darkText": "darkBlueText",
    "lightOpacBackground": "lightBlueOpacBackground",
    "bodyBackground": "linear-gradient(to bottom right, #033495, #AEE4FF)",
    "progressDonutPath": "#033495",
    "progressDonutTrail": "#AEE4FF",
    "hrBorderColor": "darkBlueHrBorder"
  })

  return (
    <ColorThemeContext.Provider value={{ colorTheme, setColorTheme }}>
        <ValidUserContext.Provider value={{ validUser, setValidUser }}>
          <BrowserRouter>
            <Routes>
              <Route path='/' element={<Layout />}>
                <Route path='/register' element={<Register />}></Route>
                <Route path='/login' element={<Login />}></Route>
                <Route path='/' element={<MainPage />}></Route>
                <Route path='/profile' element={<UserProfile />}></Route>
                <Route path='/settings' element={<Settings />}></Route >
                <Route path='/underconstruction' element={<UnderConstruction />}></Route>
                <Route path='/play/:gameMode' element={<PlayMode />}></Route>
                <Route path='/leaderboard' element={<Leaderboard />}></Route >
                <Route path='/mystats' element={<MyStats />}></Route >
                <Route path='/history' element={<History />}></Route >
              </Route>
            </Routes>
          </BrowserRouter >
        </ValidUserContext.Provider >
    </ColorThemeContext.Provider>
  )
}

export default App
