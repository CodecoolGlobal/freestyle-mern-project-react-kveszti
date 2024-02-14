import { useNavigate } from "react-router-dom";

export default function Header({ validUser, setValidUser }) {
    const navigate = useNavigate();

    return (
        <header>
            <nav className="navCont">
                <img src="/QQLogo_noBG.png" className="logo" onClick={() => navigate("/")}></img>
                <h2 onClick={() => navigate("/")} className="navTitle">QuizQuest</h2>
                {validUser ? <>
                    <p className="navHistory" onClick={() => navigate("/underconstruction")}>History</p>
                    <p className="navMyStats" onClick={() => navigate("/underconstruction")}>My stats</p>
                    <p className="navSettings" onClick={() => navigate("/underconstruction")}>Settings</p>
                    <p className="navProfile" onClick={() => navigate("/profile")}>Profile</p>
                    <button className="navLoginLogout" onClick={() => { setValidUser(false); navigate("/") }}>Log out</button>
                </> : <button className="navLoginLogout" onClick={() => navigate("/login")}>Log in</button>}

            </nav>

        </header>
    )
}