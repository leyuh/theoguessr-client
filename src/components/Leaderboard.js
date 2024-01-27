import "../styles/Leaderboard.css";
import { useState, useEffect } from "react";
import axios from "axios";

const Leaderboard = (props) => {
    
    const {setShowLeaderboard} = props;

    const [userData, setUserData] = useState([]);

    useEffect(() => {
        const fetchUsers = async () => {
            let res = await axios.get("http://localhost:3001/user/get-users/");
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

    return <div id="leaderboard">
        <h1>Leaderboard</h1>
        <button className="close-btn" onClick={() => {
            setShowLeaderboard(false);
        }}>X</button>

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
                return <li className="leaderboard-item" key={i}>
                    <h3 className="username-label">{val.username}</h3>
                    <h5 className="avg-score-label">{getAvg(val.points)}</h5>
                    <h5 className="total-points-label">{getTotal(val.points)}</h5>
                </li>
            })}
        </ol>
    </div>
}

export default Leaderboard;