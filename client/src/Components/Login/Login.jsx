
export default function Login({ userLogin, email, setEmail, password, setPassword }) {

    return (
        <><h2>Log in</h2>
            <form className="logInForm" onSubmit={userLogin}>
                <label htmlFor="email" className='logInLabel'>
                    Email address:
                    <input type="email" name="email" className="logInTextInput" value={email} onChange={e => setEmail(e.target.value)} required />
                </label>
                <label htmlFor="pwd" className='logInLabel'>
                    Password:
                    <input type="password" name="pwd" className="logInTextInput" value={password} onChange={e => setPassword(e.target.value)} />
                </label>
                <button className='logInBtn' key="logIn" type="submit">Log in</button>
            </form>
        </>
    )
}