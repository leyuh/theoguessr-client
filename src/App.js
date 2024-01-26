import "./styles/App.css";

import { Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import { BrowserRouter as Router } from 'react-router-dom';
import { useCookies } from "react-cookie";

import Navbar from "./components/NavBar.js";
import Home from "./pages/Home.js";
import Auth from "./pages/Auth.js";

import Logo from "./logo.png";

function App() {

  

  return (
    <div id="app">

      <Router>
        <Navbar />


        <img id="logo" src={Logo}/>

        <Routes>
          <Route path="/" element={<Home />}/>
          <Route path="/auth" element={<Auth />}/>
        </Routes>
      </Router>

      
    <h5 id="watermark">leyuh</h5>
    </div>
  );
}

export default App;
