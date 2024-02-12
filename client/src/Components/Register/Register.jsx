import { Link } from "react-router-dom";
import { useState } from "react";


export default function Register() {
    const [name, setName] = useState()
    const [email, setEmail] = useState()
    const [password, setPassword] = useState()

    const validPattern = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[A-Za-z\\d]{6,}$"; //Asd4sd

    const handleSubmit = (e) => {
        e.preventDefault()
        //post data akarunk-e axiost is használni vagy vanilla fetch
    }

    return (
        <>
            <h2>Register</h2>
            <form className="signUpForm" onSubmit={handleSubmit}>
                <label htmlFor="user" className='signUpLabel'>
                    Username:
                    <input
                        type="text"
                        name="user"
                        className="signUpTextInput"
                        maxLength={20}
                        required
                        onChange={(e) => setName(e.target.value)}
                    />
                </label>
                <label htmlFor="email" className='signUpLabel'>
                    Email address:
                    <input
                        type="email"
                        name="email"
                        className="signUpTextInput"
                        required
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </label>
                <label htmlFor="pwd" className='signUpLabel'>
                    Password:
                    <input type="password"
                        name="pwd"
                        className="signUpTextInput"
                        minLength={6}
                        maxLength={12}
                        required
                        pattern={validPattern}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </label>
                <button className='signUpBtn' key="signUp" type="submit">Sign up</button>
            </form>
            <h2>Already a member</h2>
            <Link to="/login" className="siteNavBtn"><button>Login</button></Link>
        </>
    )
}