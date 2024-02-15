import { useContext, useState, useEffect } from "react";
import { UserObjectContext } from "../../App";
import { ValidUserContext } from "../../App";
import { Link, useNavigate } from "react-router-dom";

export default function UserProfile() {
    const { userObj, setUserObj } = useContext(UserObjectContext);
    const { validUser, setValidUser } = useContext(ValidUserContext);
    const [birthday, setBirthday] = useState(userObj.birthday);
    const [gender, setGender] = useState(userObj.gender);
    const [editor, setEditor] = useState();
    const [name, setName] = useState(userObj.username);
    const [email, setEmail] = useState(userObj.email);
    const [passwordOld, setPasswordOld] = useState(userObj.password);
    const [password, setPassword] = useState();
    const [validPwd, setValidPwd] = useState(false)
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();

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

        const data = { username: name, email: email, birthday: birthday, gender: gender };
        fetchData('/api/users/edit/id', userObj.userID, 'PATCH', data)
            .then(response => {
                console.log(response);
                if (response.success) {
                    setSuccess(true);
                    setUserObj(response.data);
                }
            })
            .catch(error => {
                console.log(error);
            });
    }

    async function handlePWSubmit(e) {
        e.preventDefault();
        const data = { password: password };
        if (validPwd) {
            fetchData('/api/users/edit/id', userObj.userID, 'PATCH', data)
                .then(response => {
                    console.log(response);
                    console.log(editor);
                    if (response) {
                        setSuccess(true);
                    }
                })
                .catch(error => {
                    console.log(error);
                });
        } else {
            console.error('invalid old password')
        }
    }


    async function handleDelete(e) {
        e.preventDefault();
        fetchData('/api/users/edit/id', userObj.userID, 'DELETE')
            .then(response => {
                console.log(response);
                console.log(editor);
                if (response) {
                    setValidUser(false);
                    navigate("/");
                }
            })
            .catch(error => {
                console.log(error);
            });
    }
    useEffect(() => {
        if (success === true) {
            setEditor('');
        }
    }, [success])

    return (
        <div>
            {editor === 'profile' ?
                <div className="formContainer">
                    <form className="profieEditForm" onSubmit={handleSubmit}>
                        <label htmlFor="user" className='profileEditLabel'>
                            Change username:
                            <input
                                type="text"
                                name="user"
                                className="editTextInput"
                                maxLength={20}
                                value={userObj.username}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </label>
                        <label htmlFor="email" className='profileEditLabel'>
                            Change email address:
                            <input
                                type="email"
                                name="email"
                                className="editTextInput"
                                value={userObj.email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </label>
                        <label htmlFor="date" className='profileEditLabel'>
                            Change birthday:
                            <input
                                type="date"
                                name="birthday"
                                className="editDateInput"
                                value={birthday}
                                onChange={(e) => setBirthday(e.target.value)}
                            />
                        </label>
                        <label htmlFor="date" className='profileEditLabel'>
                            Change gender:
                            <input
                                type="text"
                                name="gender"
                                className="editTextInput"
                                value={gender}
                                onChange={(e) => setGender(e.target.value)}
                            />
                        </label>
                        <button className='signUpBtn' key="editUser" type="submit">Save changes</button>
                    </form>
                    <button className='menuBtn' onClick={() => setEditor("")}>Cancel</button>
                </div> : editor === 'password' ?
                    <div className="formContainer">
                        <form className="pwdEditForm" onSubmit={handlePWSubmit}>
                            <label htmlFor="pwdOld" className='profileEditLabel'>
                                Old password:
                                <input type="password"
                                    name="pwdOld"
                                    className="editTextInput"
                                    required
                                    onChange={(e) => (e.target.value === passwordOld ? setValidPwd(true) : setValidPwd(false))}
                                />
                            </label>
                            <label htmlFor="pwdNew" className='profileEditLabel'>
                                New password:
                                <input type="password"
                                    name="pwdNew"
                                    className="editTextInput"
                                    minLength={6}
                                    maxLength={12}
                                    required
                                    pattern={validPattern}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </label>
                            <p className="pwInst">Password must have: one uppercase, one lowercase, one number, 6-12 characters.</p>
                            <button className='signUpBtn' key="changePwd" type="submit">Save changes</button>
                        </form>
                        <button className='menuBtn' onClick={() => setEditor("")}>Cancel</button>
                    </div> : editor === 'delete' ?
                        <div>{<div className="dangerZone">
                            <h2>The changes you are about to make are irreversible. Are you sure you want to delete your profile?</h2>
                            <p>All your data and XP will be lost.</p>
                            <button className="menuBtn" onClick={handleDelete}>Yes</button>
                            <button className="menuBtn" onClick={() => setEditor('')}>No</button>
                        </div>}</div> :
                        <div className="profileCont">
                            <div className="profileDataCont">
                                <h4 className="profileTitle">Name:</h4>
                                <h2 className="profileData">{name}</h2>
                            </div>
                            <div className="profileDataCont">
                                <h4 className="profileTitle">Birthday:</h4>
                                <h2 className="profileData">{birthday.split('T')[0]}</h2>
                            </div>
                            <div className="profileDataCont">
                                <h4 className="profileTitle">Gender:</h4>
                                <h2 className="profileData">{gender}</h2>
                            </div>
                            <div className="btnContProfile">
                                <button className='menuBtn' onClick={() => setEditor("profile")}>Edit Profile</button>
                                <button className='menuBtn' onClick={() => setEditor("password")}>Change password</button>
                                <button className="dangerBtn" onClick={() => setEditor("delete")}>Delete profile</button>
                            </div>
                            <h2>stats under construction</h2>
                        </div>}
        </div>
    )
}