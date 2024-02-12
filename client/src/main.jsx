import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from "react-router-dom"
import './index.css'

import { Layout } from './Pages/Layout/Layout.jsx'

import App from './App.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Routes>
      <Route path='/' element={<Layout />}>
        <Route path='/' element={<App />} />
      </Route>
    </Routes>
  </BrowserRouter>
)
