import { useNavigate } from "react-router-dom";

export default function Header({ validUser }) {
    const navigate = useNavigate();

    return (
        <header>
            <nav className="navCont">
                <img src="/QQLogo_noBG.png" className="logo" onClick={() => navigate("/")}></img>
                <h2 onClick={() => navigate("/")}>QuizQuest</h2>
                {validUser ? <>
                    <p className="navHistory" onClick={() => navigate("/underconstruction")}>History</p>
                    <p className="navMyStats" onClick={() => navigate("/underconstruction")}>My stats</p>
                    <p className="navSettings" onClick={() => navigate("/underconstruction")}>Settings</p>
                </> : ""}
                <p className="navLogin" onClick={() => navigate("/login")}>Log in</p>
            </nav>

        </header>
    )
}