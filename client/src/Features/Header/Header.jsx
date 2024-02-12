
export default function Header({ validUser }) {
    let clsName = validUser ? "headerUser" : "headerDefault"

    return (
        <header className={clsName}>
            {validUser ? <h2>Welcome!</h2> : <h2>Welcome to QuizQuest/QuizMasters!</h2>}
            <p>logo homepage profile login/logout button</p>
        </header>
    )
}