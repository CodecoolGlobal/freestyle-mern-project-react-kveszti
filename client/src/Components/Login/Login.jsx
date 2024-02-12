import { Link } from "react-router-dom";

export default function Login() {

    return (
        <><h2>Log in</h2>
            <form className="logInForm" >
                <label htmlFor="email" className='logInLabel'>
                    Email address:
                    <input type="email" name="email" className="logInTextInput" required />
                </label>
                <label htmlFor="pwd" className='logInLabel'>
                    Password:
                    <input type="password" name="pwd" className="logInTextInput" />
                </label>
                <button className='logInBtn' key="logIn" type="submit">Log in</button>
            </form>
            <h2>Create account</h2>
            <Link to="/register" className="siteNavBtn"><button>Register</button></Link>
        </>
    )
}