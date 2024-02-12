

export default function Register({ handleSubmit, userName, setUserName, email, setEmail, password, setPassword }) {
    const validPattern = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[A-Za-z\\d]{6,}$"; //Asd4sd
    return (
        <>
            <h2>Register</h2>
            <form className="signUpForm" onSubmit={handleSubmit}>
                <label htmlFor="user" className='signUpLabel'>
                    Username:
                    <input type="text" name="user" className="signUpTextInput" value={userName} onChange={e => setUserName(e.target.value)} maxLength={20} required />
                </label>
                <label htmlFor="email" className='signUpLabel'>
                    Email address:
                    <input type="email" name="email" className="signUpTextInput" value={email} onChange={e => setEmail(e.target.value)} required />
                </label>
                <label htmlFor="pwd" className='signUpLabel'>
                    Password:
                    <input type="password" name="pwd" className="signUpTextInput" value={password} onChange={e => setPassword(e.target.value)} minLength={6} maxLength={12} required pattern={validPattern} />
                </label>
                <button className='signUpBtn' key="signUp" type="submit">Sign up</button>
            </form>
        </>
    )
}