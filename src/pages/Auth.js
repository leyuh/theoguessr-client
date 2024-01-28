import axios from "axios";
import { useState } from "react";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";

import "../styles/Auth.css";


const Auth = (props) => {

    const {
        
    } = props;

    const [cookies, setCookies] = useCookies(["access_token"]);

    const [currAuthDiv, setCurrAuthDiv] = useState("register");

    const [status, setStatus] = useState("");

    const navigate = useNavigate();

    return <div id="auth" className="page default">
        {currAuthDiv === "register" ? <Register 
            currAuthDiv={currAuthDiv}
            setCurrAuthDiv={setCurrAuthDiv}
            cookies={cookies}
            setCookies={setCookies}
            navigate={navigate}
            status={status}
            setStatus={setStatus}
        /> : <Login
            currAuthDiv={currAuthDiv}
            setCurrAuthDiv={setCurrAuthDiv} 
            cookies={cookies}
            setCookies={setCookies}
            navigate={navigate}
            status={status}
            setStatus={setStatus}
        />}
    </div>
}

const Login = (props) => {
    const {
        currAuthDiv,
        setCurrAuthDiv,
        cookies,
        setCookies,
        navigate,
        resetRound,
        status,
        setStatus,
        setCurrTheme
    } = props;

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");


    const onSubmit = async (e) => {
        console.log("!");
        e.preventDefault();

        try {
            const res = await axios.post("https://theoguessr-api.onrender.com/auth/login", {
                username,
                password
            });

            if (res.data.token) {
                setCookies("access_token", res.data.token);
                window.localStorage.setItem("userId", res.data.userId);

                navigate("/");
            }  else {
                setStatus("Wrong username/password.")
            }

        } catch (err) {
            console.error(err);
        }
    }

    return <Form 
        username={username}
        setUsername={setUsername}
        password={password}
        setPassword={setPassword}
        label={"Login"}
        onSubmit={onSubmit}
        currAuthDiv={currAuthDiv}
        setCurrAuthDiv={setCurrAuthDiv}
        status={status}
        setStatus={setStatus}
    />
}

const Register = (props) => {
    const {
        currAuthDiv,
        setCurrAuthDiv,
        cookies,
        setCookies,
        navigate,
        resetRound,
        status,
        setStatus
    } = props;

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const onSubmit = async (e) => {
        e.preventDefault();

        let passed = true;

        if (username.length < 3) {
            setStatus("Username is too short");
            passed = false;
        }
        if (username.length > 16) {
            setStatus("Username is too long");
            passed = false;
        }
        if (password.length < 5) {
            setStatus("Password is too short");
            passed = false;
        }
        if (password.length > 20) {
            setStatus("Password is too long");
            passed = false;
        }

        if (!passed) return;

        setStatus("");

        try {
            const reg = await axios.post("https://theoguessr-api.onrender.com/auth/register", {
                username,
                password
            });

            if (reg.data.message === "User already exists.") {
                setStatus("User already exists");
                return;
            }

            const res = await axios.post("https://theoguessr-api.onrender.com/auth/login", {
                username,
                password
            });
            
            setCookies("access_token", res.data.token);
            window.localStorage.setItem("userId", res.data.userId);
            navigate("/");
        } catch (err) {
            console.error(err);
        }
    }

    return <Form 
        username={username}
        setUsername={setUsername}
        password={password}
        setPassword={setPassword}
        label="Register"
        onSubmit={onSubmit}
        currAuthDiv={currAuthDiv}
        setCurrAuthDiv={setCurrAuthDiv}
        status={status}
        setStatus={setStatus}
    />
}

const Form = ({
    username,
    setUsername,
    password,
    setPassword,
    label,
    onSubmit,
    currAuthDiv,
    setCurrAuthDiv,
    status,
    setStatus
}) => {
    return <div className="auth-container bg-1 border-0">
        <form onSubmit={onSubmit}>
            <h2>{label}</h2>

            <div className="form-group">
                <label htmlFor={`${label}-username`}> Username: </label>
                <input type="text" id={`${label}-username`} className="username form-input" value={username} onChange={(e) => {
                    setUsername(e.target.value);
                }}/>
            </div>

            <div className="form-group">
                <label htmlFor={`${label}-password`}> Password: </label>
                <input type="password" id={`${label}-password`} className="password form-input" value={password} onChange={(e) => {
                    setPassword(e.target.value);
                }}/>
            </div>

            <h5 id="auth-status-label">{status}</h5>

            <button type="submit" className="form-submit-btn auth-btn bg-2 border-0">{label}</button>

        </form>
        
        <h3>{label === "Register" ? "Already have an account?" : "Don't have an account?"}</h3>
        <button className="auth-btn bg-2 border-0" id="switch-forms-btn" onClick={() => {
            setStatus("");
            if (currAuthDiv === "register") {
                setCurrAuthDiv("login");
            } else {
                setCurrAuthDiv("register");
            }
        }}>{label === "Register" ? "Sign in" : "Register"}</button>
    </div>
}

export default Auth;