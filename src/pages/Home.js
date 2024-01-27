import { useState, useEffect, useRef } from "react";

import { Routes, Route, useRevalidator } from "react-router-dom";
import { BrowserRouter as Router } from 'react-router-dom';
import { useCookies } from "react-cookie";
import axios from "axios";

import { OT, NT } from "../modules/Books.js";
import BooksGrid from "../components/BooksGrid.js";

const Home = (props) => {
    const {
        cookies,
        setCookies
    } = props;

    const [verseData, setVerseData] = useState(null);
    const [showGuessDiv, setShowGuessDiv] = useState(true);
    const [bookGuess, setBookGuess] = useState(null);

    const chapterContextRef = useRef(null);



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
        localStorage.getItem("bookGuess") && setBookGuess(localStorage.getItem("bookGuess"));
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
        if (chapterContextRef.current) {
            chapterContextRef.current.scrollTop = 0;
        }

    }, [showGuessDiv])

    useEffect(() => {
        if (localStorage.getItem("bookGuess") !== "null") {
            setVerseData(null);
            fetchVerseData();
        }

        if (!cookies["access_token"]) {
          localStorage.setItem("userId", "");
        }

    }, [])


    // show results on guess
    useEffect(() => {
        localStorage.setItem("bookGuess", bookGuess);
        if (bookGuess) {

            setShowGuessDiv(false);

            // update db
            if (cookies["access_token"]) {
                axios.put("http://localhost:3001/user/post-points/", {
                    _id: localStorage.getItem("userId"),
                    newPoints: calcPoints(bookGuess, verseData.book.name)
                }, {
                    headers: {
                        "authorization": cookies.access_token
                    }
                })
            }
        }
    }, [bookGuess])
    
    return <div id="home-page">
        {showGuessDiv ? 
        // GUESSING
        <div id="guess-div">

            <div id="verse-div">
                <h1>{verseData ? `"${verseData?.verseContextNoNumbers.replaceAll("¶", ``)}"` : "..."}</h1>
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
                    cookies={cookies}
                />

            </div>
        </div> 
        : 
        // RESULTS
        <div id="results-div">

            <div id="continue-div">
                <h1 id="points-label">{calcPoints(bookGuess, verseData.book.name)}</h1>
                <h3 id="you-guessed-label">You guessed: {bookGuess}</h3>
            </div>

            

            <div id="chapter-context-div" ref={chapterContextRef}>
                <h1>{verseData.chapter.reference}</h1>
                <p>
                    <span>{(verseData.chapter.content.substr(0, verseData.chapter.content.indexOf(verseData.verseContext))).replaceAll("¶", "\n\t")}</span>
                    <span><mark>{verseData.verseContext.replaceAll("¶", `\n\t`)}</mark></span>
                    <span>{(verseData.chapter.content.substr((verseData.chapter.content.indexOf(verseData.verseContext)) + verseData.verseContext.length)).replaceAll("¶", "\n\t")}</span>
                </p>
            
            </div>

            <button id="continue-btn" onClick={() => {
                setVerseData(null);
                fetchVerseData();
                setShowGuessDiv(true);
                setBookGuess(null);
            }}>
                Continue
            </button>
        

        </div>
    }
    </div>

    
}


export default Home;