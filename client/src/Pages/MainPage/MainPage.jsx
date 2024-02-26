import { useNavigate } from "react-router-dom";
import { ValidUserContext } from "../../App";
import GameModeCont from "../../Components/GameModeCont/GameModeCont";
import { useContext } from "react";

export default function MainPage() {
    const { validUser } = useContext(ValidUserContext);
    const navigate = useNavigate()

    const gameModeArray = [
        {
            title: "Sprint",
            summary: "10 questions, 10 seconds each - and your tempo counts!",
            path: "/play/sprint"
        },
        {
            title: "50:50",
            summary: "10 true or false questions to test your wit... And your luck!",
            path: "/play/5050"
        },
        {
            title: "Zen",
            summary: "15 questions, no timer! Keep calm and quiz on!",
            path: "/play/zen"
        },
        {
            title: "All in",
            summary: "10 questions with new rules - good answers are worth double points, but wrong answers make you lose points!",
            path: "/play/allIn"
        }
    ]
    return (validUser ?
        <main className="mainPageCont">
            {gameModeArray.map((mode, index) => <GameModeCont key={index + mode.title.charCodeAt(0)} title={mode.title} summary={mode.summary} validUser={validUser} path={mode.path} cls={"gridItem" + index} />)}
        </main> :
        <>
            <main className="mainPageCont">
                {gameModeArray.map((mode, index) => <GameModeCont key={index + mode.title.charCodeAt(0)} title={mode.title} summary={mode.summary} validUser={validUser} path={mode.path} />)}

            </main>
            <button id="goToRegister" onClick={() => navigate("/register")}>I would like to create an account</button>
        </>
    )
}