import "./styles/App.css";

import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { BrowserRouter as Router } from 'react-router-dom';
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";

import Navbar from "./components/NavBar.js";
import Home from "./pages/Home.js";
import Auth from "./pages/Auth.js";


function App() {

  const [cookies, setCookies] = useCookies(["access_token"]);
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div id="app">

      <Router>
        <Navbar 
          isPlaying={isPlaying}
          setIsPlaying={setIsPlaying}
        />
        <Routes>
          <Route path="/" element={<Home 
            cookies={cookies}
            setCookies={setCookies}
            isPlaying={isPlaying}
            setIsPlaying={setIsPlaying}
          />}/>
          <Route path="/auth" element={<Auth />}/>
        </Routes>
      </Router>

      
    <h5 id="watermark" className="text-2">leyuh</h5>
    </div>
  );
}

export default App;
