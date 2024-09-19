import { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ColorThemeContext } from "../../App";
import {useAuth} from "../../Authentication/AuthProvider.jsx";

export default function UserProfile() {
    const { setValidUser } = useAuth();
    const { colorTheme } = useContext(ColorThemeContext);
    const [birthday, setBirthday] = useState(null);
    const [gender, setGender] = useState(null);
    const [editor, setEditor] = useState();
    const [name, setName] = useState(null);
    const [email, setEmail] = useState(null);
    const [passwordOld, setPasswordOld] = useState(null);
    const [password, setPassword] = useState();
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();
    const [isLoaded, setIsLoaded] = useState(false);

    const validPattern = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[A-Za-z\\d]{6,}$"; //Asd4sd

    async function fetchData(url,  method = "GET", body = {}) {
        try {
            const response = await fetch( url, method === "GET" ? { method, credentials: 'include' } : { method, credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
            return await response.json();
        } catch (err) {
            console.error("Error while fetching:", err);
        }
    }
    
    async function initialUserDataFetch(){
        try {
            const userProfileData = await fetchData("/api/auth/getUserProfileData");
            const userData = userProfileData.user;
            
            setBirthday(userData.birthday);
            setName(userData.username);
            setGender(userData.gender);
            setEmail(userData.email);
            setIsLoaded(true);
        } catch (err){
            console.error("Error while fetching:", err);
        }
    }

    useEffect(() => {
        initialUserDataFetch();
    }, []);
    
    async function handleSubmit(e) {
        e.preventDefault();

        const data = { username: name, email: email, birthday: birthday, gender: gender };
        fetchData('/api/users/edit', 'PATCH', data)
            .then(response => {
                console.log(response);
                if (response.success) {
                    setSuccess(true);
                }
            })
            .catch(error => {
                console.log(error);
            });
    }

    async function handlePWSubmit(e) {
        e.preventDefault();
        const data = { password: password, oldPassword: passwordOld };
        try {
            fetchData('/api/users/edit', 'PATCH', data)
                .then(response => {
                    console.log(response);
                    console.log(editor);
                    if (response.success) {
                        setSuccess(true);
                    }
                })
                .catch(error => {
                    console.log(error);
                });
        } catch (err){
            console.error('Error while changing password', err);
        }
    }


    async function handleDelete(e) {
        e.preventDefault();
        fetchData('/api/users/edit', 'DELETE')
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
    
    if(!isLoaded){
        return <div>Loading...</div>
    }

    return (
        <div>
            {editor === 'profile' ?
                <div className={`profileFormContainer ${colorTheme.darkContBackground}`}>
                    <form className="profileEditForm" onSubmit={handleSubmit}>
                        <label htmlFor="user" className='profileEditLabel'>
                            Username:
                            <input
                                type="text"
                                name="user"
                                className="editTextInput"
                                maxLength={20}
                                defaultValue={name} 
                                onChange={(e) => setName(e.target.value)}
                            />
                        </label>
                        <label htmlFor="email" className='profileEditLabel'>
                            E-mail:
                            <input
                                type="email"
                                name="email"
                                className="editTextInput"
                                defaultValue={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </label>
                        <label htmlFor="date" className='profileEditLabel'>
                            Birthday:
                            <input
                                type="date"
                                name="birthday"
                                className="editDateInput"
                                defaultValue={birthday}
                                required
                                onChange={(e) => setBirthday(e.target.value)}
                            />
                        </label>
                        <label htmlFor="date" className='profileEditLabel'>
                            Gender:
                            <input
                                type="text"
                                name="gender"
                                className="editTextInput"
                                defaultValue={gender}
                                onChange={(e) => setGender(e.target.value)}
                            />
                        </label>
                        <button className='signUpBtn' key="editUser" type="submit">Save changes</button>
                    </form>
                    <button className='menuBtn' onClick={() => setEditor("")}>Cancel</button>
                </div> : editor === 'password' ?
                    <div className={`pwdFormContainer ${colorTheme.darkContBackground}`}>
                        <form className="pwdEditForm" onSubmit={handlePWSubmit}>
                            <label htmlFor="pwdOld" className='profileEditLabel'>
                                Old password:
                                <input type="password"
                                    name="pwdOld"
                                    className="editTextInput"
                                    required
                                    onChange={(e) => (setPasswordOld(e.target.value))}
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
                        <div className={`profileCont ${colorTheme.darkContBackground}`}>
                            <div className={`profileImgCont ${colorTheme.lightContBackground}`}>
                                <p className={`profileInitials ${colorTheme.darkText}`}>{name.charAt(0)}</p>
                            </div>
                            <div className="profileDataCont">
                                <h2 className="profileData">{name}</h2>
                            </div>
                            <div className="profileDataCont">
                                <p className="profileData">{email}</p>
                            </div>
                            <div className={`profileThemeDivider ${colorTheme.lightOpacBackground} ${colorTheme.darkText}`}>Personal info</div>
                            <div className="profileDataCont">
                                <h4 className="profileTitle">Birthday:</h4>
                                <h4 className="profileData">{birthday.split('T')[0]}</h4>
                            </div>
                            <div className="profileDataCont">
                                <h4 className="profileTitle">Gender:</h4>
                                <h4 className="profileData">{gender}</h4>
                            </div>
                            <div className={`profileThemeDivider ${colorTheme.lightOpacBackground} ${colorTheme.darkText}`}>Control panel</div>
                            <div className="btnContProfile">
                                <button className='menuBtn' onClick={() => setEditor("profile")}>Edit Profile</button>
                                <button className='menuBtn' onClick={() => setEditor("password")}>Change password</button>
                                <button className="dangerBtn" onClick={() => setEditor("delete")}>Delete profile</button>
                            </div>
                        </div>}
        </div>
    )
}