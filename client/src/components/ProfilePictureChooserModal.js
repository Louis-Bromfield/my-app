import React, { useState } from 'react';
import axios from 'axios';
import './ClosedProblemModal.css';
import FFLogo from '../media/Icon.png';
import Avatar1 from '../media/Avatar1.png'
import Avatar2 from '../media/Avatar2.png';
import Avatar3 from '../media/Avatar3.png';
import Avatar4 from '../media/Avatar4.png';
import Avatar5 from '../media/Avatar5.png';
import Avatar6 from '../media/Avatar6.png';
import Avatar7 from '../media/Avatar7.png';
import Avatar8 from '../media/Avatar8.png';
import Avatar9 from '../media/Avatar9.png';
import Avatar10 from '../media/Avatar10.png';
import Avatar11 from '../media/Avatar11.png';
import Avatar12 from '../media/Avatar12.png';
import Avatar13 from '../media/Avatar13.png';
import Avatar14 from '../media/Avatar14.png';
import Avatar15 from '../media/Avatar15.png';
import Avatar16 from '../media/Avatar16.png';

const ProfilePictureChooserModal = ({ show, justClose, username }) => {
    const showHideClassName = show ? "modal display-block" : "modal display-none";
    const [newPic, setNewPic] = useState("");

    const changePicture = async (picChoice) => {
        if (picChoice === "") {
            return;
        } else {
            await axios.patch(`${process.env.REACT_APP_API_CALL_U}/${username}`, { profilePicture: picChoice });
        };
    };

    return (
        <div className={showHideClassName}>
        <section className="modal-main">
            <img src={FFLogo} alt="" />
            <p>Choose a picture from the dropdown below:</p>
            {/* drop down here */}
            <select name="picChoiceSelector" id="picChoiceSelector">
                <option value="Avatar1" onClick={() => setNewPic("Avatar1")}>Avatar1</option>
                <option value="Avatar2" onClick={() => setNewPic("Avatar2")}>Avatar2</option>
                <option value="Avatar3" onClick={() => setNewPic("Avatar3")}>Avatar3</option>
                <option value="Avatar4" onClick={() => setNewPic("Avatar4")}>Avatar4</option>
                <option value="Avatar5" onClick={() => setNewPic("Avatar5")}>Avatar5</option>
                <option value="Avatar6" onClick={() => setNewPic("Avatar6")}>Avatar6</option>
                <option value="Avatar7" onClick={() => setNewPic("Avatar7")}>Avatar7</option>
                <option value="Avatar8" onClick={() => setNewPic("Avatar8")}>Avatar8</option>
                <option value="Avatar9" onClick={() => setNewPic("Avatar9")}>Avatar9</option>
                <option value="Avatar10" onClick={() => setNewPic("Avatar10")}>Avatar10</option>
                <option value="Avatar11" onClick={() => setNewPic("Avatar11")}>Avatar11</option>
                <option value="Avatar12" onClick={() => setNewPic("Avatar12")}>Avatar12</option>
                <option value="Avatar9" onClick={() => setNewPic("Avatar13")}>Avatar9</option>
                <option value="Avatar10" onClick={() => setNewPic("Avatar14")}>Avatar10</option>
                <option value="Avatar11" onClick={() => setNewPic("Avatar15")}>Avatar11</option>
                <option value="Avatar12" onClick={() => setNewPic("Avatar16")}>Avatar12</option>
            </select>
            <p>Preview:</p>
            <img src={newPic === "Avatar1" ? {Avatar1} : 
                      newPic === "Avatar2" ? {Avatar2} :
                      newPic === "Avatar3" ? {Avatar3} :
                      newPic === "Avatar4" ? {Avatar4} :
                      newPic === "Avatar5" ? {Avatar5} :
                      newPic === "Avatar6" ? {Avatar6} :
                      newPic === "Avatar7" ? {Avatar7} :
                      newPic === "Avatar8" ? {Avatar8} :
                      newPic === "Avatar9" ? {Avatar9} :
                      newPic === "Avatar10" ? {Avatar10} :
                      newPic === "Avatar11" ? {Avatar11} :
                      newPic === "Avatar12" ? {Avatar12} :
                      newPic === "Avatar13" ? {Avatar13} :
                      newPic === "Avatar14" ? {Avatar14} :
                      newPic === "Avatar15" ? {Avatar15} :
                      {Avatar16}
                      } alt="Profile avatar preview" />
            <button type="button" onClick={() => changePicture(newPic)} className="close-modal2-btn">
                Confirm Choice
            </button>
            <button type="button" onClick={justClose} className="close-modal2-btn">
                Close
            </button>
        </section>
        </div>
    );
};

export default ProfilePictureChooserModal;
