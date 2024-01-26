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

  const calcAccuracy = (bookGuessed, correctBook) => {
    let books = [...OT, ...NT];

    let indexGuessed = books.indexOf(bookGuessed); // 40
    let indexCorrect = books.indexOf(correctBook); // 40

    let booksOff = Math.abs(indexGuessed - indexCorrect); // 0
    let mostPossibleBooksOff = Math.max(indexCorrect, (65 - indexCorrect)); // 40

    let accuracy = (mostPossibleBooksOff - booksOff) / mostPossibleBooksOff; // 1

    return (accuracy*100).toFixed(0);
  }

  const fetchVerseData = async () => {
    try {
      let res = await axios.get("http://localhost:3001/random-verse/");
      
      setVerseData(res.data);
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
            <h1>"{verseData?.verse.content}"</h1>
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
          <h1 id="accuracy-label">{calcAccuracy(bookGuess, verseData.book.name)}%</h1>
          <h1 id="reference-label">{verseData.verse.reference}</h1>
          <h3 id="you-guessed-label">You guessed: {bookGuess}</h3>

          <h3>{verseData.chapter.reference}</h3>
          <p>{verseData.chapter.content}</p>

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
