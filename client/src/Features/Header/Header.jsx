import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { ColorThemeContext } from "../../App";
import { useContext } from "react";

export default function Header({ validUser, setValidUser }) {
    const navigate = useNavigate();
    const [activeItem, setActiveItem] = useState(null);
    const { colorTheme } = useContext(ColorThemeContext);

    function handleClick(itemName, whereTo) {
        setActiveItem(itemName);
        navigate(whereTo);
    }
    function handleLogOut() {
        setActiveItem(null);
        setValidUser(false);
        navigate("/")
    }
    return (
        <header>
            <nav className={`navCont ${colorTheme.darkContBackground}`}>
                <img src="/QQLogo_noBG.png" className="logo" onClick={() => handleClick(null, "/")}></img>
                <h2 onClick={() => handleClick(null, "/")} className="navTitle">QuizQuest</h2>
                <p className={`navLeaderboard ${activeItem === "leaderboard" ? "active" : ""}`} onClick={() => handleClick("leaderboard", "/leaderboard")}>Leaderboard</p>
                {validUser ? <>

                    <p className={`navHistory ${activeItem === "history" ? "active" : ""}`} onClick={() => handleClick("history", "/history")}>History</p>
                    <p className={`navMyStats ${activeItem === "my-stats" ? "active" : ""}`} onClick={() => handleClick("my-stats", "/mystats")}>My stats</p>
                    <p className={`navSettings ${activeItem === "settings" ? "active" : ""}`} onClick={() => handleClick("settings", "/settings")}>Settings</p>
                    <p className={`navProfile ${activeItem === "profile" ? "active" : ""}`} onClick={() => handleClick("profile", "/profile")}>Profile</p>
                    <button className="navLoginLogout" onClick={() => handleLogOut()}>Log out</button>

                </> : <button className="navLoginLogout" onClick={() => navigate("/login")}>Log in</button>}

            </nav>

        </header>
    )
}