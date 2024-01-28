import { useState, useEffect, useRef } from "react";

import { Routes, Route, useRevalidator } from "react-router-dom";
import { BrowserRouter as Router } from 'react-router-dom';
import { useCookies } from "react-cookie";
import axios from "axios";

import LeaderboardIcon from "../images/leaderboard-icon.png";

import { OT, NT } from "../modules/Books.js";
import BooksGrid from "../components/BooksGrid.js";
import Leaderboard from "../components/Leaderboard.js";

import { useLocalStickyState, useSessionStickyState } from "../hooks/useStickyState.js";

const Home = (props) => {
    const {
        cookies,
        setCookies
    } = props;

    const [nextVerseData, setNextVerseData] = useLocalStickyState(null, "nextVerseData");
    const [verseData, setVerseData] = useLocalStickyState(null, "verseData");
    const [showGuessDiv, setShowGuessDiv] = useLocalStickyState(true);
    const [bookGuess, setBookGuess] = useLocalStickyState(null, "bookGuess");
    const [showLeaderboard, setShowLeaderboard] = useState(false);

    const [testamantSelected, setTestamentSelected] = useState("Old Testament");
    

    const chapterContextRef = useRef(null);

    const MAX_POINTS = 1000;
    const POINTS_PER_BOOK_OFF = 50;


    const calcPoints = (bookGuessed, correctBook) => {
        let books = [...OT, ...NT];

        let indexGuessed = books.indexOf(bookGuessed);
        let indexCorrect = books.indexOf(correctBook);

        // wrong testament, no points
        if (indexCorrect <= 38 && indexGuessed > 38) return 0;
        if (indexCorrect > 38 && indexGuessed <= 38) return 0;

        let booksOff = Math.abs(indexGuessed - indexCorrect);

        let points = Math.max(MAX_POINTS - (booksOff*POINTS_PER_BOOK_OFF), 0);

        return points;
    }

    const fetchNextVerseData = async () => {
        try {
            let res = await axios.get("https://theoguessr-api.onrender.com/random-verse/");

            if (!bookGuess) {
                console.log("?");
                setVerseData(res.data);
            } else {
                setNextVerseData(res.data);
            }
            return res.data;
        } catch (err) {
            console.log(err);
        }
    }


    // reset guessing
    useEffect(() => {
        if (showGuessDiv) {
            console.log("!!");
            setBookGuess(null);
        }
        if (chapterContextRef.current) {
            chapterContextRef.current.scrollTop = 0;
        }

    }, [showGuessDiv])

    useEffect(() => {

        const setVerse = async () => {
            let data = await fetchNextVerseData();
            setVerseData(data);
        }

        if (showGuessDiv) {
            if (!verseData || !verseData.verseContext) {
                if (nextVerseData) {
                    setVerseData(nextVerseData);
                } else {
                    setVerse();
                }
            }
        }


        if (!cookies["access_token"]) {
          localStorage.setItem("userId", "");
        }

    }, [])

    const guessBook = (guess) => {
        setBookGuess(guess);
        setShowGuessDiv(false);
        console.log("!");
        fetchNextVerseData();

        // update db
        if (cookies["access_token"]) {
            axios.put("https://theoguessr-api.onrender.com/user/post-points/", {
                _id: localStorage.getItem("userId"),
                newPoints: calcPoints(guess, verseData.book.name)
            }, {
                headers: {
                    "authorization": cookies.access_token
                }
            })
        }
    }

    return <div id="home-page">
        <button id="leaderboard-btn" onClick={() => {
          setShowLeaderboard(prev => !prev);
        }}>
          <img src={LeaderboardIcon} />
        </button>

        {showGuessDiv ? 
        // GUESSING
        <div id="guess-div">

            <div id="verse-div">
                <h1 className="text-0">{verseData ? `"${verseData?.verseContextNoNumbers.replaceAll("¶", ``)}"` : "..."}</h1>
            </div>
            <div id="chapter-selection-wrapper">

                <div id="testaments-wrapper">
                    <button className="testament-btn bg-3 border-0" id="ot" onClick={() => {
                        setTestamentSelected("Old Testament");
                    }}>Old Testament</button>

                    <button className="testament-btn bg-3 border-0" id="nt" onClick={() => {
                        setTestamentSelected("New Testament");
                    }}>New Testament</button>
                </div>
                

                <div id="chapter-selection-div" className="border-3">
                    <BooksGrid 
                        booksNames={testamantSelected === "Old Testament" ? OT : NT}
                        setBookGuess={setBookGuess}
                        verseData={verseData}
                        guessBook={guessBook}
                    />
                </div>
            </div>
        </div> 
        : 
        // RESULTS
        <div id="results-div">

            <div id="continue-div">
                <h1 id="points-label" className="text-0">{calcPoints(bookGuess, verseData.book.name)}</h1>
                <h3 id="you-guessed-label" className="text-3">You guessed: {bookGuess}</h3>
            </div>

            

            <div id="chapter-context-div" className="bg-3 border-0" ref={chapterContextRef}>
                <h1 className="text-0">{verseData.chapter.reference}</h1>
                <p>
                    <span>{(verseData.chapter.content.substr(0, verseData.chapter.content.indexOf(verseData.verseContext))).replaceAll("¶", "\n\t")}</span>
                    <span><mark className="bg-4">{verseData.verseContext.replaceAll("¶", `\n\t`)}</mark></span>
                    <span>{(verseData.chapter.content.substr((verseData.chapter.content.indexOf(verseData.verseContext)) + verseData.verseContext.length)).replaceAll("¶", "\n\t")}</span>
                </p>
            
            </div>

            <button id="continue-btn" className="bg-1" onClick={() => {
                if (nextVerseData) {
                    setVerseData(nextVerseData);
                }
                setNextVerseData(null);
                setShowGuessDiv(true);
                setBookGuess(null);
            }}>
                Continue
            </button>
        

        </div>
    }

    {showLeaderboard && <Leaderboard 
        setShowLeaderboard={setShowLeaderboard}
        cookies={cookies}
    />}
    </div>

    
}


export default Home;