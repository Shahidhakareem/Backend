import React from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom';

createRoot(document.getElementById('root')).render(
<React.StrictMode>
    {/* Ensure the router wraps the entire app */}
    <BrowserRouter>
    <App />
    </BrowserRouter>
  </React.StrictMode>
)
