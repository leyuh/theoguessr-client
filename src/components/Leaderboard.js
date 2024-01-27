import "../styles/Leaderboard.css";
import { useState, useEffect } from "react";
import axios from "axios";

const Leaderboard = (props) => {

    const {
        setShowLeaderboard,
        cookies
    } = props;

    const [userData, setUserData] = useState([]);

    useEffect(() => {
        const fetchUsers = async () => {
            let res = await axios.get("https://theoguessr-api.onrender.com/user/get-users/");
            console.log(res.data);
            setUserData(res.data);
        }

        fetchUsers();
    }, [])
    
    const getTotal = (points) => {
        let total = 0;
        points.map(val => total += val);
        return total;
    }

    const getAvg = (points) => {
        return (getTotal(points)/points.length).toFixed(0);
    }

    return <div id="leaderboard" className="bg-2 border-0">

        <button className="close-btn" onClick={() => {
            setShowLeaderboard(false);
        }}>X</button>

        {cookies["access_token"] ? 
            <>
                <h1>Leaderboard</h1>
                
                <div id="leaderboard-labels">
                    <h3 className="username-label">username</h3>
                    <h5 className="avg-score-label">avg. score</h5>
                    <h5 className="total-points-label">total points</h5>
                </div>

                <ol>
                    {userData.sort((a, b) => {
                        let aAvg = getAvg(a.points);
                        let bAvg = getAvg(b.points);
                        if (aAvg > bAvg) return -1;
                        return 0;
                    }).map((val, i) => {
                        return <li className="leaderboard-item bg-3" key={i}>
                            <h3 className="username-label">{val.username}</h3>
                            <h5 className="avg-score-label">{getAvg(val.points)}</h5>
                            <h5 className="total-points-label">{getTotal(val.points)}</h5>
                        </li>
                    })}
                </ol>
            </> 
        : 
            <h1 id="leaderboard-disclaimer">
                Sign up or log in to view the leaderboard.
            </h1>
        }
    </div>
}

export default Leaderboard;