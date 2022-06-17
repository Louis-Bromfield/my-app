import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Login.css';
import FFLogo from '../../media/sd2.png';
// import { useHistory } from 'react-router-dom';
import { useCookies } from 'react-cookie';


function Login(props) {
    // localStorage.setItem("loggedInFromGoogle", true)
    const [usernameForCreate, setUsernameForCreate] = useState("");
    const [passwordForCreate, setPasswordForCreate] = useState("");
    const [passwordResetCodeForCreate, setPasswordResetCodeForCreate] = useState("");
    const [usernameForLogin, setUsernameForLogin] = useState("");
    const [passwordForLogin, setPasswordForLogin] = useState("");
    const [passwordResetCodeForLogin, setPasswordResetCodeForLogin] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [errorMessageForAccountCreation, setErrorMessageForAccountCreation] = useState("");
    // const [prolificID, setProlificID] = useState("");
    // const [loggedIn, setLoggedIn] = useState(false);
    const [problematicInfo, setProblematicInfo] = useState("_");
    const [credentialsSuccessfullyChecked, setCredentialsSuccessfullyChecked] = useState(null);

    const [cookie, setCookie] = useCookies(['username']);

    // useEffect(() => {
    //     setLoggedIn(localStorage.getItem("loggedInFromGoogle"));
    // }, []);

    const checkCredentials = async (uName, pWord) => {
        if (uName.length < 4 || pWord.length < 4) {
            setErrorMessageForAccountCreation("Your username and password must be at least 5 characters and contain no spaces.");
            return;
        } else if (/\s/.test(uName) || (/\s/.test(uName))) {
            setErrorMessageForAccountCreation("Your username and password must be at least 5 characters and contain no spaces.");
            return;
        } else {
            try {
                const userCheckedByUsername = await axios.get(`https://fantasy-forecast-politics.herokuapp.com/users/${uName}`);
                if (userCheckedByUsername.data.length === 1) {
                    setProblematicInfo("username");
                    setCredentialsSuccessfullyChecked(false);
                    return;
                } else {
                    // New
                    setProblematicInfo("");
                    setCredentialsSuccessfullyChecked(true);
                    // CHARMANDER - possibly allow this but delete it from localstorage when you get to home
                    localStorage.setItem("username", uName);
                    setCookie('username', uName, { path: "/", secure: true });
                };
            } catch (error) {
                console.error("Error in Login > checkCredentials");
                console.error(error);
            };
        };
    };

    const loginFromLogin = async (username, passwordOrResetCode, isPassword) => {
        try {
            let userObj;
            console.log(username);
            console.log(passwordOrResetCode);
            console.log(isPassword);

            if (isPassword === true) {
                userObj = await axios.get(`https://fantasy-forecast-politics.herokuapp.com/users/${username}/${passwordOrResetCode}/${true}`);
            } else if (isPassword === false) {
                userObj = await axios.get(`https://fantasy-forecast-politics.herokuapp.com/users/${username}/${passwordOrResetCode}/${false}`);
            };
            console.log(userObj);
            if (userObj.data.loginSuccess === false) {
                setErrorMessage(userObj.data.message);
                return;
            } else {
                props.setUserObject(userObj.data);
                props.setUsername(userObj.data.username);
                setCookie('username', userObj.data.username, { path: "/", secure: true });
                // document.cookie = `usernameD=${userObj.data.username};path=/;secure:true`;
                props.setUserFFPoints(userObj.data.fantasyForecastPoints);
                props.setName(userObj.data.username);
                props.setMarkets(userObj.data.markets);
                props.setProfilePicture(userObj.data.profilePicture);
                localStorage.setItem('isLoggedIn', true);
                localStorage.setItem('username', userObj.data.username);
                // localStorage.setItem('name', "XXXXXXXXXX");
                // localStorage.setItem('markets', userObj.data.markets);
                // localStorage.setItem('userObj', userObj);
                // localStorage.setItem('profilePicture', userObj.data.profilePicture);
                localStorage.setItem('selectedPage', "Home");
                // if (isPassword === false) {
                //     localStorage.setItem("loggedInWithResetCode", true);
                // };
                props.setIsLoggedIn(true);
            }
        } catch(error) {
            console.error("Error in Login > loginFromLogin");
            console.error(error);
        };
    };

    return (
        <div className="login-main-div">
            <img className="login-logo" src={FFLogo} alt="" />
            <div className="signup-container">
                <div className="signup-div">
                    <h2>Create an Account:</h2>
                    <label htmlFor="username">Create Your Username:</label>
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
                    <label htmlFor="password">Password:</label>
                    <input 
                        type="password" 
                        name="password" 
                        id="password" 
                        maxLength={15}
                        onChange={(e) => { 
                            setCredentialsSuccessfullyChecked(null);
                            setPasswordForCreate(e.target.value);
                            setErrorMessageForAccountCreation("");
                        }}
                    />
                    <br />
                    <label htmlFor="pw-reset-code">Password Reset Code:</label>
                    <p>Type in a secret code to use if you ever forget your password.</p>
                    <input 
                        type="pw-reset-code" 
                        name="pw-reset-code" 
                        id="pw-reset-code" 
                        maxLength={15}
                        onChange={(e) => { 
                            setCredentialsSuccessfullyChecked(null);
                            setPasswordResetCodeForCreate(e.target.value);
                            setErrorMessageForAccountCreation("");
                        }}
                    />
                    {credentialsSuccessfullyChecked === null &&
                        <button className="check-your-details-btn" onClick={() => checkCredentials(usernameForCreate, passwordForCreate)}>Click Here: Check Your Details</button>
                    }
                    {credentialsSuccessfullyChecked === true && 
                        <div className="credentials-passed-login">
                            {/* <h2>Your details are perfect!</h2> */}
                            <form action={`https://fantasy-forecast-politics.herokuapp.com/auth/google/not_callback/${usernameForCreate}/${passwordForCreate}/${passwordResetCodeForCreate}`}>
                                <button type="submit" className="sign-in-with-google-btn">Your details are perfect. Now click here to sign in with Google</button>
                                <div className="google-explainer">
                                    <p><u>Why do I need to sign in with Google?</u> 1) So your Fantasy Forecast account has a profile picture, and 2) so we can email the winners of the tournament!</p>
                                    <br />
                                    <p>Email addresses obtained from those who do not complete the survey and become eligible for the tournament will be deleted on Monday 27th June, and all others will be deleted as soon as the tournament ends.</p>
                                </div>
                            </form>
                        </div>
                    }
                    {credentialsSuccessfullyChecked === false &&
                        <h2>An account with this {problematicInfo} already exists. Please try again.</h2>
                    }
                    {errorMessageForAccountCreation}
                </div>
                <div className="survey-explanation-div">
                    <h2><u>Want to play for $$$?</u></h2>
                    <p>Over the next 6 weeks, Fantasy Forecast is running its inaugural forecasting tournament on UK Politics. The top three forecasters will win:</p>
                    <br />
                    <div className="prize-container">
                        <p>1st: £250 Amazon Gift Certificate</p>
                        <p>2nd: £150 Amazon Gift Certificate</p>
                        <p>3rd: £100 Amazon Gift Certificate</p>
                    </div>
                    <br />
                    <p>Anyone can enter, however to be eligible for the prizes you <strong><u style={{ color: "orange" }}>must</u></strong> complete a survey before <u style={{ color: "orange" }}>11:59pm (BST) on Sunday 26th June</u>. This survey will be available after you login from the "Survey" tab at the top of the screen (or the dropdown menu if you're on a mobile device).</p>
                    <br />
                    <p>You can still fully participate in the tournament without completing the survey, <u style={{ color: "orange" }}>but only those who complete the survey will be eligible for prizes</u> (so if someone who hasn't completed the survey finishes 1st, the prizes will be allocated to 2nd, 3rd, and 4th, etc.)</p>
                </div>
            </div>
            <div className="login-div">
                <h2>Already have an account? Login here:</h2>
                <label htmlFor="username-login">Username:</label>
                    <input 
                        type="text" 
                        name="login-username" 
                        id="login-username" 
                        maxLength={15}
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
                        id="login-password" 
                        maxLength={15}
                        onChange={(e) => { 
                            setCredentialsSuccessfullyChecked(null);
                            setErrorMessage("");
                            setPasswordForLogin(e.target.value);
                        }}
                    />
                <button className="login-btn" onClick={() => loginFromLogin(usernameForLogin, passwordForLogin, true)}>Login to Fantasy Forecast</button>
                {errorMessage}
            </div>
            <div className="login-div">
                <h2>Forgot your password?</h2>
                <label htmlFor="username-reset-code">Username:</label>
                    <input 
                        type="text" 
                        name="username-reset-code" 
                        id="username-reset-code" 
                        maxLength={15}
                        onChange={(e) => { 
                            setCredentialsSuccessfullyChecked(null);
                            setErrorMessage("");
                            setUsernameForLogin(e.target.value);
                        }}
                    />
                <label htmlFor="password-reset-code">Password Reset Code:</label>
                    <input 
                        type="password" 
                        name="password-reset-code" 
                        id="password-reset-code" 
                        maxLength={15}
                        onChange={(e) => { 
                            setCredentialsSuccessfullyChecked(null);
                            setErrorMessage("");
                            setPasswordResetCodeForLogin(e.target.value);
                        }}
                    />
                <button className="login-btn" onClick={() => loginFromLogin(usernameForLogin, passwordResetCodeForLogin, false)}>Login to Fantasy Forecast</button>
                {errorMessage}
            </div>
        </div>
    )
}

export default Login;
