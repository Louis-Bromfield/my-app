import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Login.css';
import FFLogo from '../../media/sd2.png';
import { useHistory } from 'react-router-dom';


function Login(props) {
    localStorage.setItem("loggedInFromGoogle", true)
    const [usernameForCreate, setUsernameForCreate] = useState("");
    const [passwordForCreate, setPasswordForCreate] = useState("");
    const [usernameForLogin, setUsernameForLogin] = useState("");
    const [passwordForLogin, setPasswordForLogin] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [errorMessageForAccountCreation, setErrorMessageForAccountCreation] = useState("");
    // const [prolificID, setProlificID] = useState("");
    // const [loggedIn, setLoggedIn] = useState(false);
    const [problematicInfo, setProblematicInfo] = useState("_");
    const [credentialsSuccessfullyChecked, setCredentialsSuccessfullyChecked] = useState();

    // useEffect(() => {
    //     setLoggedIn(localStorage.getItem("loggedInFromGoogle"));
    // }, []);

    const checkCredentials = async (uName, pWord) => {
        console.log("in checkCredentials");
        if (uName.length < 4 || pWord.length < 4) {
            setErrorMessageForAccountCreation("Your username and password must be at least 5 characters and contain no spaces.");
            return;
        } else if (/\s/.test(uName) || (/\s/.test(uName))) {
            setErrorMessageForAccountCreation("Your username and password must be at least 5 characters and contain no spaces.");
            return;
        } else {
            try {
                const userCheckedByUsername = await axios.get(`https://fantasy-forecast-politics.herokuapp.com/users/${uName}`);
                console.log(userCheckedByUsername);
                if (userCheckedByUsername.data.length === 1) {
                    setProblematicInfo("username");
                    setCredentialsSuccessfullyChecked(false);
                    return;
                } else {
                    // New
                    setProblematicInfo("");
                    setCredentialsSuccessfullyChecked(true);
                    localStorage.setItem("username", uName);
                };
            } catch (error) {
                console.error("Error in Login > checkCredentials");
                console.error(error);
            };
        };
    };

    const loginFromLogin = async (username, password) => {
        try {
            const userObj = await axios.get(`https://fantasy-forecast-politics.herokuapp.com/users/${username}/${password}`);
            if (userObj.data.length === 0) {
                setErrorMessage("These details do not match, please try again.");
                return;
            } else {
                console.log(userObj);
                props.setUserObject(userObj.data[0]);
                props.setUsername(userObj.data[0].username);
                props.setUserFFPoints(userObj.data[0].fantasyForecastPoints);
                props.setName(userObj.data[0].username);
                props.setMarkets(userObj.data[0].markets);
                props.setProfilePicture(userObj.data[0].profilePicture);
                localStorage.setItem('isLoggedIn', true);
                localStorage.setItem('username', userObj.data[0].username);
                localStorage.setItem('name', "XXXXXXXXXX");
                localStorage.setItem('markets', userObj.data[0].markets);
                localStorage.setItem('userObj', userObj);
                localStorage.setItem('profilePicture', userObj.data[0].profilePicture);
                localStorage.setItem('selectedPage', "Home");
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
                            setCredentialsSuccessfullyChecked();
                            setUsernameForCreate(e.target.value);
                        }} 
                    />
                    <label htmlFor="password">Password:</label>
                    <input 
                        type="password" 
                        name="password" 
                        id="password" 
                        maxLength={15}
                        onChange={(e) => { 
                            setCredentialsSuccessfullyChecked();
                            setPasswordForCreate(e.target.value);
                        }}
                    />
                    <button onClick={() => checkCredentials(usernameForCreate, passwordForCreate)}>Click Here: Check Your Details</button>
                    {credentialsSuccessfullyChecked === true && 
                        <div className="credentials-passed-login">
                            <h2>Your details are perfect!</h2>
                            <form action={`https://fantasy-forecast-politics.herokuapp.com/auth/google/not_callback/${usernameForCreate}/${passwordForCreate}`}>
                                <button type="submit" className="login-button">Sign in with Google</button>
                            </form>
                        </div>
                    }
                    {credentialsSuccessfullyChecked === false &&
                        <h2>An account with this {problematicInfo} already exists. Please try again.</h2>
                    }
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
                    <p>Anyone can enter, however to be eligible for the prizes you <strong><u>must</u></strong> complete a survey before you begin forecasting. This survey will be available after you login from the "Survey" tab at the top of the screen (or the dropdown menu if you're on a mobile device).</p>
                    <br />
                    <p>You can still fully participate in the tournament without completing the survey, but only those who complete the survey will be eligible for prices (so if someone who hasn't completed the survey finishes 1st, the prizes will be allocated to 2nd, 3rd, and 4th, etc.)</p>
                </div>
            </div>
            <div className="login-div">
                <h2>Already have an account? Login here:</h2>
                <label htmlFor="login-username">Username:</label>
                    <input 
                        type="text" 
                        name="login-username" 
                        id="login-username" 
                        maxLength={15}
                        onChange={(e) => { 
                            setCredentialsSuccessfullyChecked();
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
                            setCredentialsSuccessfullyChecked();
                            setErrorMessage("");
                            setPasswordForLogin(e.target.value);
                        }}
                    />
                <button className="login-button" onClick={() => loginFromLogin(usernameForLogin, passwordForLogin)}>Login to Fantasy Forecast</button>
            </div>
        </div>
    )
}

export default Login;
