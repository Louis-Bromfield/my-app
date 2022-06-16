import React, { useState, useEffect } from 'react';
// import axios from 'axios';
import './LoginSuccess.css';
import FFLogo from '../../media/sd2.png';
import { Link } from 'react-router-dom';
// import { useSearchParams } from 'react-router-dom';


function LoginSuccess(props) {
    localStorage.setItem("loggedInFromGoogle", true)
    const [usernameForHomePage, setUsernameForHomePage] = useState("");
    const [loggedIn, setLoggedIn] = useState(false);

    useEffect(() => {
        // const queryParams = new URLSearchParams(window.location.search);
        setLoggedIn(true);
        // const userPAID = queryParams.get('pAID');
        setUsernameForHomePage(localStorage.getItem("username"));
        props.login(usernameForHomePage)
        console.log("LoginSuccess UE");
    }, []);
 
    return (
        <div className="login-main-div">
            <img className="login-logo" src={FFLogo} alt="" />
            {loggedIn === true && <Link to="/home" onClick={() => props.login(usernameForHomePage)}><button>You've Logged In, Enter Fantasy Forecast Here</button></Link>}
        </div>
    )
}

export default LoginSuccess;
