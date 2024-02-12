import { useState, useEffect, createContext } from 'react';
import "./App.css";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Register from './Components/Register/Register.jsx';
import Login from './Components/Login/Login';
import UserSite from './Components/UserSite/UserSite';

import { Layout } from './Pages/Layout/Layout.jsx'

export const ValidUserContext = createContext(false);

function App() {
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [login, setLogin] = useState(false);
  const [loginBtn, setLoginBtn] = useState('Log in');
  const [signUpSignIn, setSignUpSignIn] = useState("Already registered");
  const [validUser, setValidUser] = useState(false); //🔰 needs to be false once done


  async function handleSubmit(e) {
    e.preventDefault();
    console.log('clickk');
  }

  async function handleLogIn() {
    if (loginBtn === 'Log in') {
      setLogin(true);
      setLoginBtn('Register');
      setSignUpSignIn("Haven't registered yet");

    }

    if (loginBtn === 'Register') {
      setLogin(false);
      setLoginBtn('Log in');
      setSignUpSignIn("Already registered");
    }
  }
  async function userLogin() {
    console.log('click')
    //fetch users from Mongo and cross check
  }

  return (
    <ValidUserContext.Provider value={{ validUser, setValidUser }}>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Layout />}>
            <Route path='/register' element={<Register />}></Route>
            <Route path='/login' element={<Login />}></Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </ValidUserContext.Provider>
  )
}

export default App
