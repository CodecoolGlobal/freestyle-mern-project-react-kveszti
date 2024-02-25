import { useState, useEffect, createContext } from 'react';
import "./App.css";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Register from './Pages/Register/Register.jsx';
import Login from './Pages/Login/Login.jsx';
import UserProfile from './Components/UserProfile/UserProfile.jsx';
import MainPage from './Pages/MainPage/MainPage.jsx';
import UnderConstruction from './Pages/UnderConstruction/UnderConstruction.jsx';
import PlayMode from './Pages/PlayMode/PlayMode.jsx';

import { Layout } from './Pages/Layout/Layout.jsx'

export const ValidUserContext = createContext(false);
export const UserObjectContext = createContext("");
export const ColorThemeContext = createContext({
  "darkContBackground": "darkGreenBackground",
  "lightContBackground": "lightGreenBackground",
  "lightText": "lightGreenText",
  "darkText": "darkGreenText",
  "lightOpacBackground": "lightGreenOpacBackground"
})

function App() {
  const [validUser, setValidUser] = useState(false); //🔰 needs to be false once done
  const [userObj, setUserObj] = useState("");
  const [colorTheme, setColorTheme] = useState({
    "darkContBackground": "darkGreenBackground",
    "lightContBackground": "lightGreenBackground",
    "lightText": "lightGreenText",
    "darkText": "darkGreenText",
    "lightOpacBackground": "lightGreenOpacBackground"
  })

  return (
    <ColorThemeContext.Provider value={{ colorTheme, setColorTheme }}>
      <UserObjectContext.Provider value={{ userObj: userObj, setUserObj: setUserObj }}>
        <ValidUserContext.Provider value={{ validUser, setValidUser }}>
          <BrowserRouter>
            <Routes>
              <Route path='/' element={<Layout />}>
                <Route path='/register' element={<Register />}></Route>
                <Route path='/login' element={<Login />}></Route>
                <Route path='/' element={<MainPage />}></Route>
                <Route path='/profile' element={<UserProfile />}></Route>
                <Route path='/underconstruction' element={<UnderConstruction />}></Route>
                <Route path='/play' element={<PlayMode />}></Route>
              </Route>
            </Routes>
          </BrowserRouter >
        </ValidUserContext.Provider >
      </UserObjectContext.Provider>
    </ColorThemeContext.Provider>
  )
}

export default App
