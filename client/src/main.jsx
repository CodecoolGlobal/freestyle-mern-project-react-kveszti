import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'


import App from './App.jsx'
import {AuthProvider} from "./Authentication/AuthProvider.jsx";

ReactDOM.createRoot(document.getElementById('root')).render(
    <AuthProvider>  
        <App />
    </AuthProvider>

)
