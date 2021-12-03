import React, { useState } from 'react';
import axios from 'axios';
import './Login.css';
import FFLogo from '../../media/sd2.png';

function Login(props) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loginError, setLoginError] = useState("");

    const [newUsername, setNewUsername] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [newFullName, setNewFullName] = useState("");
    const [newEmailAddress, setNewEmailAddress] = useState("");
    const [createAccountError, setCreateAccountError] = useState("");
    const [createAccountText, setCreateAccountText] = useState("");
    const [newProfilePicture, setNewProfilePicture] = useState("");
    const [file, setFile] = useState();

    const handleUsernameChange = (e) => {
        setLoginError("");
        setUsername(e.target.value);
    };

    const handlePasswordChange = (e) => {
        setLoginError("");
        setPassword(e.target.value);
    };

    const handleNewUsernameChange = (e) => {
        setCreateAccountError("");
        setNewUsername(e.target.value);
    };

    const handleNewPasswordChange = (e) => {
        setCreateAccountError("");
        setNewPassword(e.target.value);
    };

    const handleNewFullNameChange = (e) => {
        setCreateAccountError("");
        setNewFullName(e.target.value);
    };

    const handleNewEmailAddressChange = (e) => {
        setCreateAccountError("");
        setNewEmailAddress(e.target.value);
    };

    const handleNewProfilePictureChange = ({ target }) => {
        setCreateAccountError("");
        setNewProfilePicture(target.files[0]);
        console.log(target);
        setFile(target.value);
    }

    const login = async (username, password) => {
        if ((username === "" || password === "") || (/^\s*$/.test(username) || /^\s*$/.test(password))) {
            setLoginError("One or more empty fields. Please enter your username and password, then press Login.");
            return;
        }
        try {
            const user = await axios.get(`https://fantasy-forecast-politics.herokuapp.com/users/${username}/${password}`);
            if (user.data.length === 0) {
                setLoginError("Incorrect login details. Please try again, or sign up if you don't have an account.");
            }
            else if (user.data[0].username === username && user.data[0].password === password) {
                // add error checking for forbidden symbols/characters in name field
                const name = user.data[0].name.split(" ");
                props.login(username, name[0], user.data[0].markets, user.data[0], user.data[0].profilePicture);
            }
        } catch (error) {
            console.error("Error in Login.js > login method");
            console.error(error);
            setLoginError("There was an error. Please try again.");
        }
    };

    const createAccount = async (newUsername, newPassword, newFullName, newEmailAddress, newProfilePicture) => {
        console.log(newProfilePicture);
        // Check for empty fields
        if (newUsername === "" || newPassword === "" || newFullName === "" || newEmailAddress === "" || /^\s*$/.test(newUsername) || /^\s*$/.test(newPassword) || /^\s*$/.test(newFullName) || /^\s*$/.test(newEmailAddress)) {
            setCreateAccountError("One or more empty fields. Please enter your username and password, then press Create Account.");
            return;
        } else if (newProfilePicture === "") {
            setCreateAccountError("Please upload a profile picture.");
            return;
        }
        try {
            // Get to see if username has already been taken
            const user = await axios.get(`https://fantasy-forecast-politics.herokuapp.com/users/${newUsername}`);
            // If no users with that name exist:
            if (user.data.length === 0) {
                // Create Account
                const newUser = await axios.post(`https://fantasy-forecast-politics.herokuapp.com/users`, {
                    username: newUsername,
                    password: newPassword,
                    name: newFullName,
                    email: newEmailAddress
                });
                if (newUser) {
                    console.log(newUser);
                    const formData = new FormData();
                    formData.append("image", newProfilePicture);
                    await axios.patch(`https://fantasy-forecast-politics.herokuapp.com/users/imageAPI/${newUsername}`, formData);
                    setCreateAccountText("Account successfully created.");
                    localStorage.setItem("firstVisit", true);
                };
                // Add user to Global Leaderboard
                const lbName = "Fantasy Forecast All-Time"
                await axios.patch(`https://fantasy-forecast-politics.herokuapp.com/leaderboards/${lbName}`, { username: newUsername });
                // Add user to Learn Quizzes
                await axios.post(`https://fantasy-forecast-politics.herokuapp.com/learnquizzes/`, { username: newUsername });
            } else if (user.data[0].username === newUsername) {
                setCreateAccountError("This username has been taken. Please try another username.");
            };
        } catch (error) {
            console.error("Error in Login.js > createAccount");
            console.error(error);
        }
    }

    return (
        <div className="login-main-div">
            <img className="login-logo" src={FFLogo} alt="" />
            <div className="login-signup-container">
                <div className="login-div">
                    <h1 className="form-title">Login</h1>
                    <input type="text" className="input-field" placeholder="Enter Username" onChange={(e) => handleUsernameChange(e)}/>
                    <input type="password" className="input-field" placeholder="Enter Password" onChange={(e) => handlePasswordChange(e)}/>
                    <button className="login-btn" onClick={() => login(username, password)}>Login</button>
                    {loginError !== "" && <h3 className="error-message">{loginError}</h3>}
                </div>
                <div className="signup-div">
                    <h1 className="form-title">Sign Up</h1>
                    <h3 className="form-title"> Username:</h3>
                    <input type="text" className="input-field" placeholder="Enter Username" maxLength="15" onChange={(e) => handleNewUsernameChange(e)} />
                    <h3 className="form-title">Password:</h3>
                    <input type="text" className="input-field" placeholder="Enter Password" onChange={(e) => handleNewPasswordChange(e)} />
                    <h3 className="form-title">Full Name:</h3>
                    <input type="text" className="input-field" placeholder="Enter Your Name" onChange={(e) => handleNewFullNameChange(e)} />
                    <h3 className="form-title">Email Address:</h3>
                    <input type="email" className="input-field" placeholder="Enter Your Email Address" onChange={(e) => handleNewEmailAddressChange(e)} />
                    <h3 className="form-title">Profile Picture:</h3>
                    <input type="file" className="input-field-photo" onChange={(e) => handleNewProfilePictureChange(e)} />
                    <button className="signup-btn" onClick={() => createAccount(newUsername, newPassword, newFullName, newEmailAddress, newProfilePicture)}>Create Account</button>
                    {createAccountError !== "" && <h3 className="error-message">{createAccountError}</h3>}
                    {createAccountText !== "" && <h3 className="text-message">{createAccountText}</h3>}
                </div> 
            </div>
        </div>
    )
}

export default Login;
