import React, { useState, useEffect } from 'react';
// import axios from 'axios';
import './LoginSuccess.css';
import FFLogo from '../../media/sd2.png';
import { Link, useSearchParams } from 'react-router-dom';


function LoginSuccess(props) {
    localStorage.setItem("loggedInFromGoogle", true)
    const [username, setUsername] = useState("");
    const [prolificID, setProlificID] = useState("");
    const [loggedIn, setLoggedIn] = useState(false);
    const [searchParams, setSearchParams] = useSearchParams();

    useEffect(() => {
        setLoggedIn(localStorage.getItem("loggedInFromGoogle"));
        const userGID = searchParams.get("userGID");
        console.log(userGID);
    }, []);
 
    return (
        <div className="login-main-div">
            <img className="login-logo" src={FFLogo} alt="" />
            <div className="google-login-container">
                <label htmlFor="username">Enter Your Username:</label>
                <input type="text" name="username" id="username" onChange={(e) => { localStorage.setItem("loggedInFromGoogle", false); console.log(e.target.value); setUsername(e.target.value); props.setUserForLogin(e.targetValue)}}/>
                <label htmlFor="prolificID">Enter Your ProlificID:</label>
                <input type="text" name="prolificID" id="prolificID" onChange={(e) => { localStorage.setItem("loggedInFromGoogle", false); console.log(e.target.value); setProlificID(e.target.value)}}/>
                {/* <form action={`https://fantasy-forecast-politics.herokuapp.com/auth/google/${username}`} onSubmit={() => { props.login(username); history.push("/home");}}> */}
                <form action={`https://fantasy-forecast-politics.herokuapp.com/auth/google/not_callback/${username}/${prolificID}`}>
                    <button type="submit" className="google-button">
                        <span className="google-button__text">Sign in with Google</span>
                    </button>
                </form>
            </div>
            {/* Change loggedIn to localstorage variable and check that, it'll persist across page redirects */}
            {loggedIn === "true" && <Link to="/home" onClick={() => props.login(username)}><button>You've Logged In, Enter Fantasy Forecast Here</button></Link>}
        </div>
    )
}

export default LoginSuccess;
