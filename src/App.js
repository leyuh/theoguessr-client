import "./styles/App.css";

import { useState, useEffect } from "react";
import axios from "axios";

import { OT, NT } from "./Books.js";
import BooksGrid from "./components/BooksGrid.js";

import Logo from "./logo.png";

function App() {

  const [verseData, setVerseData] = useState(null);
  const [showGuessDiv, setShowGuessDiv] = useState(true);
  const [bookGuess, setBookGuess] = useState(null);

  const calcPoints = (bookGuessed, correctBook) => {
    let books = [...OT, ...NT];

    let indexGuessed = books.indexOf(bookGuessed);
    let indexCorrect = books.indexOf(correctBook);

    // wrong testament, no points
    if (indexCorrect <= 38 && indexGuessed > 38) return 0;
    if (indexCorrect > 38 && indexGuessed <= 38) return 0;

    let booksOff = Math.abs(indexGuessed - indexCorrect);

    let points = 1000 - (booksOff*25);

    return points;
  }

  const fetchVerseData = async () => {
    try {
      let res = await axios.get("http://localhost:3001/random-verse/");

      setVerseData(res.data);
      console.log(res.data);
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    localStorage.getItem("verseData") && setVerseData(JSON.parse(localStorage.getItem("verseData")));
  }, [])

  useEffect(() => {
    if (verseData) {
      localStorage.setItem("verseData", JSON.stringify(verseData));
    }
  }, [verseData])

  // reset guessing
  useEffect(() => {
    if (showGuessDiv) {
      setBookGuess(null);
    }
  }, [showGuessDiv])

  // show results on guess
  useEffect(() => {
    if (bookGuess) {
      setShowGuessDiv(false);
    }
  }, [bookGuess])

  return (
    <div id="app">

      <img id="logo" src={Logo}/>

      {showGuessDiv ? 
        // GUESSING
        <div id="guess-div">

          <div id="verse-div">
            <h1>"{verseData?.verseContext}"</h1>
          </div>

          <div id="chapter-selection-div">
            <BooksGrid 
              title="Old Testament"
              booksNames={OT}
              setBookGuess={setBookGuess}
              verseData={verseData}
              fetchVerseData={fetchVerseData}
            />
            <BooksGrid 
              title="New Testament"
              booksNames={NT}
              setBookGuess={setBookGuess}
              verseData={verseData}
              fetchVerseData={fetchVerseData}
            />

          </div>
        </div> 
      : 
        // RESULTS
        <div id="results-div">

          <h3>{verseData.chapter.reference}</h3>
          <div id="chapter-context-div">
            <p>{verseData.chapter.content}</p>
          </div>

          <h1 id="points-label">{calcPoints(bookGuess, verseData.book.name)}</h1>
          <h3 id="you-guessed-label">You guessed: {bookGuess}</h3>

          <button onClick={() => {
            setVerseData(null);
            fetchVerseData();
            setShowGuessDiv(true);
          }}>
            Continue
          </button>

        </div>
      }

      
    <h5 id="watermark">leyuh</h5>
    </div>
  );
}

export default App;
