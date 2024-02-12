import { Link } from "react-router-dom";


export default function Register() {
    const validPattern = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[A-Za-z\\d]{6,}$"; //Asd4sd
    return (
        <>
            <h2>Register</h2>
            <form className="signUpForm">
                <label htmlFor="user" className='signUpLabel'>
                    Username:
                    <input type="text" name="user" className="signUpTextInput" maxLength={20} required />
                </label>
                <label htmlFor="email" className='signUpLabel'>
                    Email address:
                    <input type="email" name="email" className="signUpTextInput" required />
                </label>
                <label htmlFor="pwd" className='signUpLabel'>
                    Password:
                    <input type="password" name="pwd" className="signUpTextInput" minLength={6} maxLength={12} required pattern={validPattern} />
                </label>
                <button className='signUpBtn' key="signUp" type="submit">Sign up</button>
            </form>
            <h2>Already a member</h2>
            <Link to="/login" className="siteNavBtn"><button>Login</button></Link>
        </>
    )
}