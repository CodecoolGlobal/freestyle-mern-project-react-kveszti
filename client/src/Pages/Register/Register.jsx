import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";



export default function Register() {
    const [name, setName] = useState();
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [success, setSuccess] = useState(false);
    const Navigate = useNavigate();
    let seconds = 4;

    const validPattern = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[A-Za-z\\d]{6,}$"; //Asd4sd

    async function fetchData(url, id, method = "GET", body = {}) {
        try {
            const response = await fetch(id !== undefined ? `${url}/${id}` : url, method === "GET" ? { method } : { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
            return await response.json();
        } catch (err) {
            console.error("Error while fetching:", err);
        }
    }

    async function handleSubmit(e) {
        e.preventDefault();
        const data = { username: name, email: email, password: password };
        fetchData('/api/users/all', '', 'POST', data)
            .then(response => {
                console.log(response);
                if (response) {
                    setSuccess(true);
                }
            })
            .catch(error => {
                console.log(error);
            });
    }

    useEffect(() => {
        if (success === true) {
            setTimeout(() => {
                Navigate('/login');
            }, 1000 * seconds);
        }
    }, [success])



    return (
        <>
            {success === false ?
                <div className="formContainerRegister">< h2 > Register</h2 >
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
                </div > :
                <div className="formContainerRegister">
                    <h2>Registration was successful, please log in.</h2>
                    <p>If you are not redirected in {seconds} seconds, please click on the button.</p>
                    <Link to="/login" className="siteNavBtn"><button>Login</button></Link>
                </div>
            }
        </>
    )
}