import React, { useState } from 'react';
import axios from 'axios';
import './ProfileDetails.css';

function ProfileDetails(props) {
    const [newUsername, setNewUsername] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [fileData, setFileData] = useState();
    const [file, setFile] = useState("");

    const handleUsernameChange = (e) => {
        setNewUsername(e.target.value);
    }

    const handlePasswordChange = (e) => {
        setNewPassword(e.target.value);
    }

    const persistNewUsernameToDB = async (currentUsername, newUsernameToPersist) => {
        console.log(`currentUsername is ${currentUsername}`);
        console.log(`newUsernameToPersist = ${newUsernameToPersist}`);
        try {
            props.updateUsername(newUsernameToPersist);
            console.log("done0");
            // forecasts
            await axios.patch(`https://fantasy-forecast-politics.herokuapp.com/forecasts/changeUsername/${currentUsername}`, { username: newUsernameToPersist });
            console.log("done1");
            // homepagenewsfeedposts (all posts where user = author)
            await axios.patch(`https://fantasy-forecast-politics.herokuapp.com/homePageNewsFeedPosts/changeUsernameOrProfilePic/${currentUsername}`, { changeUsername: true, username: newUsernameToPersist });
            console.log("done2");
            // all leaderboards/markets the user is in
            await axios.patch(`https://fantasy-forecast-politics.herokuapp.com/leaderboards/changeUsername/${currentUsername}`, { username: newUsernameToPersist });

            // learn quizzes - still need to write backend code for this
            await axios.patch(`https://fantasy-forecast-politics.herokuapp.com/learnquizzes/${currentUsername}`, { username: newUsernameToPersist });
            console.log("done3");

            props.setShowModal(true);
            props.setModalContent(`Username changed to ${newUsernameToPersist}!`);
        } catch (error) {
            console.error("Error in ProfileDetails > persistNewUsernameToDB");
            console.error(error);
        };
    };

    const persistNewPasswordToDB = async (currentUsername, newPasswordToPersist) => {
        try {
            await axios.patch(`https://fantasy-forecast-politics.herokuapp.com/users/${currentUsername}`, { password: newPasswordToPersist });
            props.setShowModal(true);
            props.setModalContent(`Password changed to ${newPasswordToPersist}!`);
        } catch (error) {
            console.error("Error in ProfileDetails > persistNewPasswordToDB");
            console.error(error);
        };
    };

    const handlePictureChange = ({ target }) => {
        setFileData(target.files[0]);
        setFile(target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            console.log("1");
            const formData = new FormData();
            console.log("2");
            formData.append("image", fileData);
            console.log("3");
            // formData.append("username", props.username);
            console.log("4");
            const res = await axios.patch(`https://fantasy-forecast-politics.herokuapp.com/users/imageAPI/${localStorage.getItem("username") || props.username}`, formData);
            console.log("5");
            localStorage.setItem("profilePicture", res.data.profilePicture);
            console.log("6");
            props.setShowModal(true);
            console.log("7");
            props.setModalContent(`Your profile picture has been updated. Refresh the page to see!`);
            console.log("8");
        } catch (error) {
            console.log("error in handleSubmit");
            console.log(error);
        }
    }

    return (
        <div className="profile-details">
            <h1 className="profile-header">Profile Details</h1>
            <div className="profile-details-grid">
                <div className="edit-profile-field">
                    <h4>Change Username:</h4>
                    <div className="submit-field">
                        <input 
                            type="text" 
                            className="new-profile-info-field" 
                            maxLength="15" 
                            onChange={(e) => handleUsernameChange(e)}/>
                        <button 
                            className="submit-profile-change" 
                            onClick={() => persistNewUsernameToDB(props.username, newUsername)}>
                                Submit
                        </button>
                    </div>
                </div>
                <div className="edit-profile-field">
                    <h4>Change Password:</h4>
                    <div className="submit-field">
                    <input 
                        type="text" 
                        className="new-profile-info-field" 
                        onChange={(e) => handlePasswordChange(e)}/>
                        <button 
                            className="submit-profile-change" 
                            onClick={() => persistNewPasswordToDB(props.username, newPassword)}>
                                Submit
                        </button>
                    </div>
                </div>
                <div className="edit-profile-field">
                    <h4>Change Profile Picture:</h4>
                    <div className="submit-field">
                        <input 
                            type="file" 
                            name="file"
                            value={file}
                            className="new-profile-info-field" 
                            accept=".png, .jpeg, .jpg" 
                            onChange={(e) => handlePictureChange(e)}/>
                        <button 
                            className="submit-profile-change" 
                            onClick={(e) => handleSubmit(e)}>
                                Submit
                        </button>
                    </div>
                </div>
            </div>
            <div className="edit-profile-field">
                <button className="delete-account-btn">Delete My Account</button>
            </div>
        </div>
    )
}

export default ProfileDetails
