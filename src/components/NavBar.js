import { Link } from "react-router-dom";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";

import "../styles/NavBar.css";
import Logo from "../images/logo.png";

const Navbar = (props) => {
    const {
        isPlaying,
        setIsPlaying
    } = props;

    const [cookies, setCookies] = useCookies(["access_token"]);
    const navigate = useNavigate();
    
    const logout = () => {
        setCookies("access_token", "");
        window.localStorage.removeItem("userId");
    }

    return <div id="nav-div">
        {!cookies.access_token ? 
            <Link to={"/auth"} className="nav-btn text-0"> Login </Link>
         : 
            <>
                <button onClick={logout} className="nav-btn text-0">Logout</button>
            </>
        }
        
        <Link to={"/"}>
            <img id="logo" src={Logo} onClick={() => {
                setIsPlaying(false);
            }}/>
        </Link>
    </div>
}

export default Navbar;