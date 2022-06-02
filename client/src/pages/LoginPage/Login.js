import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Login.css';
import FFLogo from '../../media/sd2.png';
import { useHistory } from 'react-router-dom';


function Login(props) {
    localStorage.setItem("loggedInFromGoogle", true)
    const [username, setUsername] = useState("");
    const [prolificID, setProlificID] = useState("");
    const [loggedIn, setLoggedIn] = useState(false);
    const [problematicInfo, setProblematicInfo] = useState("_");
    const [credentialsSuccessfullyChecked, setCredentialsSuccessfullyChecked] = useState(false);

    useEffect(() => {
        setLoggedIn(localStorage.getItem("loggedInFromGoogle"));
    }, []);

    const checkCredentials = async (uName, proID) => {
        try {
            const userCheckedByUsername = await axios.get(`https://fantasy-forecast-politics.herokuapp.com/users/${uName}`);
            if (userCheckedByUsername.data.length === 1) {
                setProblematicInfo("username");
                setCredentialsSuccessfullyChecked(false);
                return;
            } else {
                const userCheckedByProlificID = await axios.get(`https://fantasy-forecast-politics.herokuapp.com/users/findByProlificID/${proID}`);
                if (userCheckedByProlificID.data.length === 1) {
                    setProblematicInfo("ProlificID");
                    setCredentialsSuccessfullyChecked(false)
                    return;
                } else if (userCheckedByProlificID.data.length === 0) {
                    setProblematicInfo("");
                    setCredentialsSuccessfullyChecked(true);
                };
            };
        } catch (error) {
            console.error("Error in Login > checkCredentials");
            console.error(error);
        };
    };

    return (
        <div className="login-main-div">
            <img className="login-logo" src={FFLogo} alt="" />
            <div className="google-login-container">
                <label htmlFor="username">Enter Your Username:</label>
                <input 
                    type="text" 
                    name="username" 
                    id="username" 
                    onChange={(e) => { 
                        localStorage.setItem("loggedInFromGoogle", false); 
                        setUsername(e.target.value); 
                        props.setUserForLogin(e.targetValue)}}
                />
                <label htmlFor="prolificID">Enter Your ProlificID:</label>
                <input 
                    type="text" 
                    name="prolificID" 
                    id="prolificID" 
                    onChange={(e) => { 
                        localStorage.setItem("loggedInFromGoogle", false); 
                        setProlificID(e.target.value)}}
                />
                <button onClick={() => checkCredentials(username, prolificID)}>Click Here: Check Your Details</button>
                {credentialsSuccessfullyChecked === true && 
                    <div className="credentials-passed-login">
                        <h2>Your details are perfect!</h2>
                        <form action={`https://fantasy-forecast-politics.herokuapp.com/auth/google/not_callback/${username}/${prolificID}`}>
                            <button type="submit" className="google-button">
                                <span className="google-button__text">Sign in with Google</span>
                            </button>
                        </form>
                    </div>
                }
                {credentialsSuccessfullyChecked === false &&
                    <h2>An account with this {problematicInfo} already exists. Please try again.</h2>
                }
            </div>
        </div>
    )
}

export default Login;
