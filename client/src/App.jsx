import { useState, useEffect, createContext } from 'react';
import "./App.css";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Register from './Components/Register/Register.jsx';
import Login from './Components/Login/Login';
import UserProfile from './Components/UserProfile/UserProfile.jsx';
import MainPage from './Pages/MainPage/MainPage.jsx';

import { Layout } from './Pages/Layout/Layout.jsx'

export const ValidUserContext = createContext(false);
export const UserNameContext = createContext("")

function App() {
  const [validUser, setValidUser] = useState(false); //🔰 needs to be false once done
  const [userName, setUserName] = useState("");



  return (
    <UserNameContext.Provider value={{ userName, setUserName }}>
      <ValidUserContext.Provider value={{ validUser, setValidUser }}>
        <BrowserRouter>
          <Routes>
            <Route path='/' element={<Layout />}>
              <Route path='/register' element={<Register />}></Route>
              <Route path='/login' element={<Login />}></Route>
              <Route path='/' element={<MainPage />}></Route>
              <Route path='/profile' element={<UserProfile />}></Route>
            </Route>
          </Routes>
        </BrowserRouter >
      </ValidUserContext.Provider >
    </UserNameContext.Provider>
  )
}

export default App
