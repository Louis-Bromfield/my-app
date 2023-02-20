import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Login.css';
import FFLogo from '../../media/sd2.png';
// import { useHistory } from 'react-router-dom';
import { useCookies } from 'react-cookie';


function Login(props) {
    // localStorage.setItem("loggedInFromGoogle", true)
    const [usernameForCreate, setUsernameForCreate] = useState("");
    const [prolificIDForCreate, setProlificIDForCreate] = useState("");
    const [passwordForCreate, setPasswordForCreate] = useState("");
    const [confirmPasswordForCreate, setConfirmPasswordForCreate] = useState("");
    // const [passwordResetCodeForCreate, setPasswordResetCodeForCreate] = useState("");
    const [usernameForLogin, setUsernameForLogin] = useState("");
    const [passwordForLogin, setPasswordForLogin] = useState("");
    // const [passwordResetCodeForLogin, setPasswordResetCodeForLogin] = useState("");
    const [prolificIDForLogin, setProlificIDForLogin] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [errorMessageForAccountCreation, setErrorMessageForAccountCreation] = useState("");
    // const [prolificID, setProlificID] = useState("");
    // const [loggedIn, setLoggedIn] = useState(false);
    const [problematicInfo, setProblematicInfo] = useState("_");
    const [credentialsSuccessfullyChecked, setCredentialsSuccessfullyChecked] = useState(null);
    // const [emailForPasswordReset, setEmailForPasswordReset] = useState("");
    // const [usernameForPasswordReset, setUsernameForPasswordReset] = useState("");
    const [resetMessage, setResetMessage] = useState("");

    const [cookie, setCookie] = useCookies(['username']);

    // useEffect(() => {
    //     setLoggedIn(localStorage.getItem("loggedInFromGoogle"));
    // }, []);

    // const checkCredentials = async (uName, pWord, pID) => {
    const checkCredentials = async (uName, pID, pWord, cpWord) => {
        if (/\s/.test(uName) || uName === "") {
            setErrorMessageForAccountCreation("Your username should contain no spaces.");
            return;
        } else if (pID.length < 4 || /\s/.test(pID) || pID === "") {
            setErrorMessageForAccountCreation("Your ProlificID should be 24 characters long and contain no spaces.");
            return;
        } else if (pWord.length < 4|| (/\s/.test(pWord)) || pWord === "") {
            setErrorMessageForAccountCreation("Your password must contain no spaces.");
            return;
        } else if (pWord !== cpWord) {
            setErrorMessageForAccountCreation("Your passwords do not match.");
            return;
        // } else if (pID.length < 4 || /\s/.test(pID) || pID === "") {
        //     setErrorMessageForAccountCreation("Your ProlificID is too short and cannot contain spaces.");
        //     return;
        } else {
            try {
                // CHARMANDER - ADD CODE FOR CREATING USER, THEN LOGIN WITH RETURNED OBJECT
                const user = await axios.post(`${process.env.REACT_APP_API_CALL_U}/`, {
                    username: uName,
                    pID: pID,
                    password: pWord
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
                    localStorage.setItem("username", pID);
                    setCookie('username', uName, { path: "/", sameSite: "Lax" });
                    loginFromLogin(uName, pID, pWord, true, false);
                };
            } catch (error) {
                console.error("Error in Login > checkCredentials");
                console.error(error);
            };
        };
    };

    const loginFromLogin = async (username, passwordOrResetCode, isPassword, isGuest) => {
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
            let userObj;
            console.log("4");
            if (isGuest === true) {
                console.log("5");
                userObj = await axios.get(`${process.env.REACT_APP_API_CALL_MAIN}/${username}/${passwordOrResetCode}/${true}`);
                
            } else if (isGuest === false) {
                console.log("5");
                if (isPassword === true) {
                    console.log("6");
                    userObj = await axios.get(`${process.env.REACT_APP_API_CALL_MAIN}/${username}/${passwordOrResetCode}/${true}`);
                
                    console.log("7");
                    if (!userObj) return;
                } else if (isPassword === false) {
                    console.log("8");
                    userObj = await axios.get(`${process.env.REACT_APP_API_CALL_MAIN}/${username}/${passwordOrResetCode}/${false}`);
                
                    if (!userObj) return;
                };
            };
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
                setCookie('username', userObj.data.username, { path: "/", sameSite: "Lax" });
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
            console.log(`${process.env.REACT_APP_API_CALL_MAIN}/${username}/${passwordOrResetCode}/${true}`);
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
            <img className="login-logo" src={FFLogo} alt="" />
            {/* <div className="login-div">
                <h2>Login here:</h2>
                <label htmlFor="login-password">Prolific ID:</label>
                <input 
                    type="prolificID" 
                    name="login-prolificID" 
                    id="login-prolificID" 
                    // maxLength={15}
                    onChange={(e) => { 
                        setCredentialsSuccessfullyChecked(null);
                        setErrorMessage("");
                        setProlificIDForLogin(e.target.value);
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
                <button className="login-btn" onClick={() => loginFromLogin(prolificIDForLogin, passwordForLogin, true, false)}>Login to Fantasy Forecast</button>
                {errorMessage}
            </div> */}
            {/* <div className="login-div">
                <h2>Forgot your password?</h2>
                <h2>Email fantasyforecastcontact@gmail.com with your username and Prolific ID and we'll reset it for you.</h2>
            </div> */}
            <div className="login-main-div">
                {/* <img className="login-logo" src={FFLogo} alt="" /> */}
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
                            <label htmlFor="prolificID">Enter Your ProlificID:</label>
                            <input 
                                type="text" 
                                name="prolificID" 
                                id="prolificID" 
                                onChange={(e) => { 
                                    setCredentialsSuccessfullyChecked(null);
                                    setProlificIDForCreate(e.target.value);
                                    setErrorMessageForAccountCreation("");
                                }} 
                            />
                            <label htmlFor="password">Password:</label>
                            <input 
                                type="password" 
                                name="password" 
                                id="password" 
                                // maxLength={15}
                                onChange={(e) => { 
                                    setCredentialsSuccessfullyChecked(null);
                                    setPasswordForCreate(e.target.value);
                                    setErrorMessageForAccountCreation("");
                                }}
                            />
                            <label htmlFor="password">Confirm Password:</label>
                            <input 
                                type="password" 
                                name="confirm-password" 
                                id="confirm-password" 
                                // maxLength={15}
                                onChange={(e) => { 
                                    setCredentialsSuccessfullyChecked(null);
                                    setConfirmPasswordForCreate(e.target.value);
                                    setErrorMessageForAccountCreation("");
                                }}
                            />
                            <br />
                            {credentialsSuccessfullyChecked === null &&
                                // <button className="check-your-details-btn" onClick={() => checkCredentials(usernameForCreate, passwordForCreate, prolificIDForCreate)}>Click Here: Check Your Details</button>
                                <button className="check-your-details-btn" onClick={() => checkCredentials(usernameForCreate, prolificIDForCreate, passwordForCreate, confirmPasswordForCreate)}>Login</button>
                            }
                            {/* {credentialsSuccessfullyChecked === true &&  */}
                                {/* <div className="credentials-passed-login"> */}
                                    {/* <h2>Your details are perfect!</h2> */}
                                    {/* <form action={`${process.env.REACT_APP_API_NACB}/${usernameForCreate}/${passwordForCreate}/${prolificIDForCreate}`}> */}
                                    {/* use this line below for Prolific, we removed the last one for PO-119 students */}
                                    {/* <form action={`${process.env.REACT_APP_API_CALL_MAIN}/auth/google/not_callback/${usernameForCreate}/${passwordForCreate}/${prolificIDForCreate}`}> */}
                                    {/* <form action={`${process.env.REACT_APP_API_CALL_MAIN}/auth/google/not_callback/${usernameForCreate}/${passwordForCreate}`}> */}
                                        {/* <button type="submit" className="sign-in-with-google-btn">Your details are perfect. Now click here to sign in with Google</button> */}
                                        {/* <div className="google-explainer"> */}
                                            {/* <p><u>Why do I need to sign in with Google?</u> 1) So your Fantasy Forecast account has a profile picture, and 2) so we can email the winners of the tournament!</p> */}
                                            {/* <br />
                                            <p>Email addresses obtained from those who do not complete the survey and become eligible for the tournament will be deleted on Monday 4th July, and all others will be deleted as soon as the tournament ends.</p> */}
                                        {/* </div> */}
                                    {/* </form> */}
                                {/* </div> */}
                            {/* } */}
                            {credentialsSuccessfullyChecked === false &&
                                <h2>An account with this {problematicInfo} already exists. Please try again.</h2>
                            }
                            {errorMessageForAccountCreation}
                        </div>
                        <div className="signup-div">
                            <h2>Preview the site as a Guest</h2>
                            <button className="login-btn" onClick={() => loginFromLogin("Guest", "guestAccount123", true, true)}>
                                Enter Without Logging In
                            </button>
                        </div>
                    </div>
                    <div className="login-div">
                        <h2>Already have an account? Login here:</h2>
                        <label htmlFor="username-login">Username:</label>
                        <input 
                            type="text" 
                            name="login-username" 
                            id="login-username" 
                            onChange={(e) => { 
                                setCredentialsSuccessfullyChecked(null);
                                setErrorMessage("");
                                setUsernameForLogin(e.target.value);
                                // setProlificIDForLogin(e.target.value);
                            }}
                        />
                        {/* <label htmlFor="username-login">Prolific ID:</label>
                        <input 
                            type="text" 
                            name="login-prolificID" 
                            id="login-prolificID" 
                            onChange={(e) => { 
                                setCredentialsSuccessfullyChecked(null);
                                setErrorMessage("");
                                // setUsernameForLogin(e.target.value);
                                setProlificIDForLogin(e.target.value);
                            }}
                        /> */}
                        <label htmlFor="login-password">Password:</label>
                        <input 
                            type="password" 
                            name="login-password" 
                            id="login-password" 
                            // maxLength={15}
                            onChange={(e) => { 
                                setCredentialsSuccessfullyChecked(null);
                                setErrorMessage("");
                                setPasswordForLogin(e.target.value);
                            }}
                        />
                        <button className="login-btn" onClick={() => loginFromLogin(usernameForLogin, passwordForLogin, true, false)}>Login to Fantasy Forecast</button>
                        {errorMessage}
                    </div> 
                    <div className="login-div">
                        <h2>Forgot your password?</h2>
                        <h2>Email fantasyforecastcontact@gmail.com with your username and Prolific ID and we'll reset it for you.</h2>
                    </div>
            </div>
        </div>  
    )
}

export default Login;
