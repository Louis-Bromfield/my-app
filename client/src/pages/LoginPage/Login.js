import React, { useState } from 'react';
import axios from 'axios';
import './Login.css';
import HRPLogo from '../../media/HRP.png';
import Avatar1 from '../../media/Avatar1.png'

function Login(props) {
    const [usernameForCreate, setUsernameForCreate] = useState("");
    const [passwordForCreate, setPasswordForCreate] = useState("");
    const [confirmPasswordForCreate, setConfirmPasswordForCreate] = useState("");
    const [emailforCreate, setEmailForCreate] = useState("");
    const [countryForCreate, setCountryForCreate] = useState("");
    const [emailCheckStatus, setEmailCheckStatus] = useState(false);
    const [usernameForLogin, setUsernameForLogin] = useState("");
    const [passwordForLogin, setPasswordForLogin] = useState("");
    const [prolificIDForLogin, setProlificIDForLogin] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [errorMessageForAccountCreation, setErrorMessageForAccountCreation] = useState("");
    const [problematicInfo, setProblematicInfo] = useState("_");
    const [credentialsSuccessfullyChecked, setCredentialsSuccessfullyChecked] = useState(null);
    // const [cookie, setCookie] = useCookies(['username']);

    const checkCredentials = async (username, pWord, confirmPWord, email, country, emailConsent) => {
        // Data checking
        if (/\s/.test(username) || username === "") {
            setErrorMessageForAccountCreation("Your username should contain no spaces.");
            return;
        } else if (username.length < 4 || /\s/.test(username) || username === "") {
            setErrorMessageForAccountCreation("Your username should be at least 5 characters long and contain no spaces.");
            return;
        } else if (pWord.length < 4 || (/\s/.test(pWord)) || pWord === "") {
            setErrorMessageForAccountCreation("Your password must be at least 5 characters and contain no spaces.");
            return;
        } else if (pWord !== confirmPWord) {
            setErrorMessageForAccountCreation("Your passwords do not match.");
            return;
        // Was going to add a check on the email but not sure what to include, and don't want to be too strict
        // as some people won't consent to being contacted so they might not want to give us their email?
        } else {
            try {
                console.log(username);
                console.log(pWord);
                console.log(email);
                console.log(country);
                console.log(emailConsent);
                // const user = await axios.post(`${process.env.REACT_APP_API_CALL_U}/`, {
                const user = await axios.post(`http://localhost:8000/users/`, {
                    username: username,
                    password: pWord,
                    email: email,
                    country: country,
                    emailConsent: emailConsent,
                    profilePicture: Avatar1
                });
                if (user.data.err === true) {
                    setProblematicInfo("Prolific ID");
                    setCredentialsSuccessfullyChecked(false);
                    console.log(user.data.message === undefined ? null : user.data.message);
                    return;
                } else {
                    // login
                    setProblematicInfo("");
                    setCredentialsSuccessfullyChecked(true);
                    localStorage.setItem("username", username);
                    loginFromLogin(username, pWord, true, false);
                };
            } catch (error) {
                console.error("Error in Login > checkCredentials");
                console.error(error);
            };
        };
    };

    const loginFromLogin = async (username, passwordOrResetCode, isPassword, isGuest) => {
        console.log(username);
        console.log(passwordOrResetCode);
console.log("1");
        if (/\s/.test(username) || /\s/.test(passwordOrResetCode)) {
console.log("2");
            setErrorMessage("Your username and password should contain no spaces.");
            return;
        } else if (username === "" || passwordOrResetCode === "") {
console.log("3");
            setErrorMessage("The username or password field is empty.");
            return;
        };
        try {
            // let userObj = await axios.get(`https://fantasyforecast-ec48a35e6c66.herokuapp.com/${username}/${passwordOrResetCode}/${true}`);
            // let userObj = await axios.get(`${process.env.REACT_APP_API_CALL_MAIN}/${username}/${passwordOrResetCode}/${true}`);
            let userObj = await axios.get(`http://localhost:8000/${username}/${passwordOrResetCode}/${true}`);
console.log("4");
console.log("9");
console.log(userObj);
            if (userObj.data.loginSuccess === false)  {
    console.log("10");
                setErrorMessage(userObj.data.message);
                return;
            } else if (typeof userObj.data === "string") {
console.log("11");
                setErrorMessage("This user does not exist in the database");
                return;
            } else {
console.log("12");
                props.setUserObject(userObj.data);
                props.setUsername(userObj.data.username);
                // setCookie('username', userObj.data.username, { path: "/", sameSite: "Lax" });
                props.setUserFFPoints(userObj.data.fantasyForecastPoints);
                props.setName(userObj.data.username);
                props.setMarkets(userObj.data.markets);
                props.setProfilePicture(userObj.data.profilePicture);
                localStorage.setItem('isLoggedIn', true);
                localStorage.setItem('username', userObj.data.username);
                localStorage.setItem('selectedPage', "Home");
                props.setIsLoggedIn(true);
            }
        } catch(error) {
            console.error("Error in Login > loginFromLogin");
            console.error(error);
        };
    };

    // const requestPasswordResetThroughEmail = async (username, email) => {
    //     try {
    //         console.log(username);
    //         console.log(email);
    //         const resetUser = await axios.patch(`${process.env.REACT_APP_API_CALL_U}/reset/resetUserAccFromLogin/fireEmail/resetPW/r`, {
    //             username: username,
    //             email: email
    //         });
    //         console.log(resetUser);
    //         if (resetUser.data.resetSuccess === true) {
    //             setResetMessage("Your password has been reset. Check your email address.")
    //         } else {
    //             setResetMessage("There is no user with this username and email. Please try again.");
    //         };
    //     } catch (err) {
    //         console.error("Error in requestPasswordResetThroughEmail");
    //         console.error(err);
    //         setResetMessage("There was an error. Please try again later.");
    //     };
    // };

    return (
        <div className="login-main-div">
            <img className="login-logo" src={HRPLogo} alt="" />
            <div className="login-main-div">
                <div className="signup-container">
                    <div className="login-div">
                        <h2>Login here:</h2>
                        <label htmlFor="username-login">Username</label>
                        <input 
                            type="text" 
                            name="login-username" 
                            className="login-username" 
                            id="login-username" 
                            onChange={(e) => { 
                                setCredentialsSuccessfullyChecked(null);
                                setErrorMessage("");
                                setUsernameForLogin(e.target.value);
                            }}
                        />
                        <label htmlFor="login-password">Password:</label>
                        <input 
                            type="password" 
                            name="login-password" 
                            className="login-password" 
                            id="login-password" 
                            onChange={(e) => { 
                                setCredentialsSuccessfullyChecked(null);
                                setErrorMessage("");
                                setPasswordForLogin(e.target.value);
                            }}
                        />
                        <button 
                            className="login-btn" 
                            onClick={() => loginFromLogin(usernameForLogin, passwordForLogin, true, false)}>
                                Login to Horse Race Politics
                            </button>
                        {errorMessage}
                    </div>
                    {/* <div className="signup-div">
                        <h2>Preview the site as a Guest</h2>
                        <button className="login-btn" onClick={() => loginFromLogin("Guest", "guestAccount123", true, true)}>
                            Enter Without Logging In
                        </button>
                    </div> */}
                    <div className="signup-div">
                        <h2>Create an Account:</h2>
                        <p>Fields marked by a * must be completed</p>
                        <label htmlFor="username">Username: *</label>
                        <input 
                            type="text" 
                            name="username" 
                            id="username" 
                            maxLength={15}
                            onChange={(e) => { 
                                setCredentialsSuccessfullyChecked(null);
                                setUsernameForCreate(e.target.value);
                                setErrorMessageForAccountCreation("");
                            }} 
                        />
                        <label htmlFor="password">Password: *</label>
                        <input 
                            type="password" 
                            name="password" 
                            className="password" 
                            id="password" 
                            // maxLength={15}
                            onChange={(e) => { 
                                setCredentialsSuccessfullyChecked(null);
                                setPasswordForCreate(e.target.value);
                                setErrorMessageForAccountCreation("");
                            }}
                        />
                        <label htmlFor="password">Confirm Password: *</label>
                        <input 
                            type="password" 
                            name="confirm-password" 
                            className="confirm-password" 
                            id="confirm-password" 
                            // maxLength={15}
                            onChange={(e) => { 
                                setCredentialsSuccessfullyChecked(null);
                                setConfirmPasswordForCreate(e.target.value);
                                setErrorMessageForAccountCreation("");
                            }}
                        />
                        <label htmlFor="country">Country: *</label>
                        <input 
                            type="text" 
                            name="country" 
                            id="country" 
                            onChange={(e) => { 
                                setCredentialsSuccessfullyChecked(null);
                                setCountryForCreate(e.target.value);
                                setErrorMessageForAccountCreation("");
                            }} 
                        />
                        <label htmlFor="email">Email:</label>
                        <input 
                            type="text" 
                            name="email" 
                            id="email" 
                            onChange={(e) => { 
                                setCredentialsSuccessfullyChecked(null);
                                setEmailForCreate(e.target.value);
                                setErrorMessageForAccountCreation("");
                            }} 
                        />
                        <label>Do you consent to being contacted via email?</label>
                            <input 
                                type="checkbox" 
                                checked={emailCheckStatus} 
                                onChange={() => setEmailCheckStatus(!emailCheckStatus)}
                            />
                        <br />
                        {credentialsSuccessfullyChecked === null &&
                            <button 
                                className="check-your-details-btn" 
                                onClick={() => checkCredentials(usernameForCreate, passwordForCreate, confirmPasswordForCreate, emailforCreate, countryForCreate, emailCheckStatus)}>
                                    Login
                            </button>
                        }
                        {credentialsSuccessfullyChecked === false &&
                            <h2>An account with this {problematicInfo} already exists. Please try again.</h2>
                        }
                        {errorMessageForAccountCreation}
                    </div>
                </div> 
                <div className="login-div">
                    <h2>Login not working or Forgot your password?</h2>
                    <p>Email fantasyforecastcontact@gmail.com and we'll reset it for you.</p>
                </div>
            </div>
        </div>  
    )
}

export default Login;
