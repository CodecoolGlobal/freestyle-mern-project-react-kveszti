import { useNavigate } from "react-router-dom";;
import GameModeCont from "../../Components/GameModeCont/GameModeCont";
import {useContext, useEffect} from "react";
import {useAuth} from "../../Authentication/AuthProvider.jsx";

export default function MainPage() {
    const { validUser, setValidUser } = useAuth();
    const navigate = useNavigate()

    useEffect(() => {
        async function fetchLoginStatus(){
            try {
                const response = await fetch("api/auth/isLoggedIn",{
                    method: 'GET',
                    credentials: 'include',
                });
                
                if(response.ok){
                   setValidUser(true);
                } else {
                    setValidUser(false);
                }
            } catch (err){
                console.log("Error occured while fetching login status", err);
            }
        }
        fetchLoginStatus();
    }, []);

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
    return (
        <>
            <main className="mainPageCont">
                {gameModeArray.map((mode, index) => <GameModeCont key={index + mode.title.charCodeAt(0)} title={mode.title} summary={mode.summary} validUser={validUser} path={mode.path} />)}
            </main>
            {validUser ? '' : <button id="goToRegister" onClick={() => navigate("/register")}>I would like to create an account</button>}
        </>
    )
}