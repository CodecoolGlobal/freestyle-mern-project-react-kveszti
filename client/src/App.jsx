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
import ProtectedRoute from "./Authentication/ProtectedRoute.jsx";


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
          <BrowserRouter>
            <Routes>
              <Route path='/' element={<Layout />}>
                <Route path='/register' element={<Register />}></Route>
                <Route path='/login' element={<Login />}></Route>
                <Route path='/' element={<MainPage />}></Route>
                <Route path='/profile' element={<ProtectedRoute><UserProfile /></ProtectedRoute>}></Route>
                <Route path='/settings' element={<ProtectedRoute><Settings /></ProtectedRoute>}></Route >
                <Route path='/underconstruction' element={<ProtectedRoute><UnderConstruction /></ProtectedRoute>}></Route>
                <Route path='/play/:gameMode' element={<ProtectedRoute><PlayMode /></ProtectedRoute>}></Route>
                <Route path='/leaderboard' element={<Leaderboard />}></Route >
                <Route path='/mystats' element={<ProtectedRoute><MyStats /></ProtectedRoute>}></Route >
                <Route path='/history' element={<ProtectedRoute><History /></ProtectedRoute>}></Route >
              </Route>
            </Routes>
          </BrowserRouter >
    </ColorThemeContext.Provider>
  )
}

export default App
