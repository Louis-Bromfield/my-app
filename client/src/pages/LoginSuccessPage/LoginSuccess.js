import React, { useState, useEffect } from 'react';
// import axios from 'axios';
import './LoginSuccess.css';
import FFLogo from '../../media/sd2.png';
import { Link } from 'react-router-dom';
// import { useSearchParams } from 'react-router-dom';


function LoginSuccess(props) {
    localStorage.setItem("loggedInFromGoogle", true)
    const [prolificIDForHomePage, setProlificIDForHomePage] = useState("");
    const [loggedIn, setLoggedIn] = useState(false);

    useEffect(() => {
        // const queryParams = new URLSearchParams(window.location.search);
        // setLoggedIn(localStorage.getItem("loggedInFromGoogle"));
        // const userPAID = queryParams.get('pAID');
        setProlificIDForHomePage(localStorage.getItem("pAID"));
        console.log("LoginSuccess UE");
    }, []);
 
    return (
        <div className="login-main-div">
            <img className="login-logo" src={FFLogo} alt="" />
            {loggedIn === "true" && <Link to="/home" onClick={() => props.login(prolificIDForHomePage)}><button>You've Logged In, Enter Fantasy Forecast Here</button></Link>}
        </div>
    )
}

export default LoginSuccess;
