import { useState, useEffect } from "react";
import axios from "axios";

import { OT, NT } from "./Books.js";
import BooksGrid from "./components/BooksGrid.js";

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


  // reset guessing
  useEffect(() => {
    if (showGuessDiv) {
      setBookGuess(null);

      const fetchData = async () => {
        try {
          let res = await axios.get("http://localhost:3001/random-verse/");

          setVerseData(res.data);
        } catch (err) {
          console.log(err);
        }
      }
  
      fetchData();
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

      {showGuessDiv ? 
        // GUESSING
        <div id="guess-div">

          <div id="verse-div">
            {verseData?.verse.content}
          </div>

          <div id="chapter-selection-div">
            <BooksGrid 
              title="Old Testament"
              booksNames={OT}
              setBookGuess={setBookGuess}
            />
            <BooksGrid 
              title="New Testament"
              booksNames={NT}
              setBookGuess={setBookGuess}
            />

          </div>
        </div> 
      : 
        // RESULTS
        <div id="results-div">
          <h1 id="accuracy-label">{calcAccuracy(bookGuess, verseData.book.name)}%</h1>
          <h1 id="reference-label">{verseData?.verse.reference}</h1>
          <h3 id="you-guessed-label">You guessed: {bookGuess}</h3>

        </div>
      }

      
    </div>
  );
}

export default App;
