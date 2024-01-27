import { Link } from "react-router-dom";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";

import "../styles/NavBar.css";

const Navbar = (props) => {
    const {

    } = props;

    const [cookies, setCookies] = useCookies(["access_token"]);
    const navigate = useNavigate();
    
    const logout = () => {
        setCookies("access_token", "");
        window.localStorage.removeItem("userId");
    }

    return <div id="nav-div">
        {!cookies.access_token ? 
            <Link to={"/auth"} className="nav-btn"> Login </Link>
         : 
            <>
                <button onClick={logout} className="nav-btn">Logout</button>
            </>
        }
        
        <Link to={"/"} className="nav-btn"> Home </Link>
    </div>
}

export default Navbar;