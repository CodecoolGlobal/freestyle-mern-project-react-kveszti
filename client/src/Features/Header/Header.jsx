import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Header({ validUser, setValidUser }) {
    const navigate = useNavigate();
    const [activeItem, setActiveItem] = useState(null);

    function handleClick(itemName, whereTo) {
        setActiveItem(itemName);
        navigate(whereTo);
    }
    function handleLogOut() {
        setActiveItem(null);
        setValidUser(false);
    }
    return (
        <header>
            <nav className="navCont">
                <img src="/QQLogo_noBG.png" className="logo" onClick={() => handleClick(null, "/")}></img>
                <h2 onClick={() => handleClick(null, "/")} className="navTitle">QuizQuest</h2>
                {validUser ? <>
                    <p className={`navHistory ${activeItem === "history" ? "active" : ""}`} onClick={() => handleClick("history", "/underconstruction")}>History</p>
                    <p className={`navMyStats ${activeItem === "my-stats" ? "active" : ""}`} onClick={() => handleClick("my-stats", "/underconstruction")}>My stats</p>
                    <p className={`navSettings ${activeItem === "settings" ? "active" : ""}`} onClick={() => handleClick("settings", "/underconstruction")}>Settings</p>
                    <p className={`navProfile ${activeItem === "profile" ? "active" : ""}`} onClick={() => handleClick("profile", "/underconstruction")}>Profile</p>
                    <button className="navLoginLogout" onClick={() => handleLogOut()}>Log out</button>
                </> : <button className="navLoginLogout" onClick={() => navigate("/login")}>Log in</button>}

            </nav>

        </header>
    )
}