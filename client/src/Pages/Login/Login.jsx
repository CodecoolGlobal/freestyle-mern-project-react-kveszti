import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import { ValidUserContext } from "../../App";
import { UserNameContext } from "../../App";

export default function Login() {
    const Navigate = useNavigate();
    const { validUser, setValidUser } = useContext(ValidUserContext);
    const { userName, setUserName } = useContext(UserNameContext);
    const [email, setEmail] = useState()
    const [password, setPassword] = useState()

    async function fetchData(url, id, method = "GET", body = {}) {
        try {
            const response = await fetch(id !== undefined ? `${url}/${id}` : url, method === "GET" ? { method } : { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
            return await response.json();
        } catch (err) {
            console.error("Error while fetching:", err);
        }
    }

    async function handleSubmitLogin(e) {
        e.preventDefault();
        const data = { email: email, password: password };
        fetchData('/api/users/login', '', 'PATCH', data)
            .then(response => {
                console.log(response);
                if (response.success) {
                    setValidUser(true);
                    setUserName(response.data);
                    Navigate('/');
                }
            })
            .catch(error => {
                // console.log(error);
            });

    }

    return (<>
        <div className="formContainerLogin">
            <form className="logInForm" onSubmit={handleSubmitLogin}>
                <label htmlFor="email" className='logInLabel'>
                    E-mail:
                    <input
                        type="email"
                        name="email"
                        className="logInTextInput"
                        required
                        onChange={(e) => setEmail(e.target.value)} />
                </label>
                <label htmlFor="pwd" className='logInLabel'>
                    Password:
                    <input
                        type="password"
                        name="pwd"
                        className="logInTextInput"
                        required
                        onChange={(e) => setPassword(e.target.value)} />
                </label>
                <button className='logInBtn' key="logIn" type="submit">Log in</button>
            </form>
        </div>
        <div><p className="needAccount">Need an account?</p>
            <Link to="/register" className="fromLoginToRegister"><button>Register</button></Link></div>
    </>
    )
}