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

const ProfilePictureChooserModal = ({ show, justClose, username, changeProfilePic }) => {
    const showHideClassName = show ? "modal display-block" : "modal display-none";
    const [newPic, setNewPic] = useState({Avatar1});

    const changePicture = async (picChoice) => {
        if (username === undefined || username === "Guest") {
            return;
        };
        console.log("in change picture");
        console.log("picChoice = " + picChoice);
        if (picChoice === "") {
            return;
        } else {
            // if you use this you would need to change the setNewPic to be "AvatarX" rather than {AvatarX}
            // let avatarString = "";
            // switch (picChoice) {
            //     case ({Avatar1}):
            //         avatarString = "Avatar1";
            //     break;
            //     case ({Avatar2}):
            //         avatarString = "Avatar2";
            //     break;
            //     case ({Avatar3}):
            //         avatarString = "Avatar3";
            //     break;
            //     case ({Avatar4}):
            //         avatarString = "Avatar4";
            //     break;
            //     case ({Avatar5}):
            //         avatarString = "Avatar5";
            //     break;
            //     case ({Avatar6}):
            //         avatarString = "Avatar6";
            //     break;
            //     case ({Avatar7}):
            //         avatarString = "Avatar7";
            //     break;
            //     case ({Avatar8}):
            //         avatarString = "Avatar8";
            //     break;
            //     case ({Avatar9}):
            //         avatarString = "Avatar9";
            //     break;
            //     case ({Avatar10}):
            //         avatarString = "Avatar10";
            //     break;
            //     case ({Avatar11}):
            //         avatarString = "Avatar11";
            //     break;
            //     case ({Avatar12}):
            //         avatarString = "Avatar12";
            //     break;
            //     case ({Avatar13}):
            //         avatarString = "Avatar13";
            //     break;
            //     case ({Avatar14}):
            //         avatarString = "Avatar14";
            //     break;
            //     case ({Avatar15}):
            //         avatarString = "Avatar15";
            //     break;
            //     case ({Avatar16}):
            //         avatarString = "Avatar16";
            //     break;
            // default:
            //     avatarString = "https://lh3.googleusercontent.com/a-/AOh14GjV2ps962tYS-OQXR21ojsfIz9JRguOC4T353so=s96-c"
            //     return;
            // }
            // await axios.patch(`${process.env.REACT_APP_API_CALL_U}/${username}`, { profilePicture: avatarString });
            await axios.patch(`${process.env.REACT_APP_API_CALL_U}/${username}`, { profilePicture: picChoice });
            changeProfilePic(picChoice);
        };
    };

    return (
        <div className={showHideClassName}>
        <section className="modal-main">
            <img src={FFLogo} alt="" />
            <p>Choose a picture from the dropdown below:</p>
            {/* drop down here */}
            <select name="picChoiceSelector" id="picChoiceSelector" onChange={(e) => setNewPic(e.target.value)}>
                <option value={Avatar1}>Avatar1</option>
                <option value={Avatar2}>Avatar2</option>
                <option value={Avatar3}>Avatar3</option>
                <option value={Avatar4}>Avatar4</option>
                <option value={Avatar5}>Avatar5</option>
                <option value={Avatar6}>Avatar6</option>
                <option value={Avatar7}>Avatar7</option>
                <option value={Avatar8}>Avatar8</option>
                <option value={Avatar9}>Avatar9</option>
                <option value={Avatar10}>Avatar10</option>
                <option value={Avatar11}>Avatar11</option>
                <option value={Avatar12}>Avatar12</option>
                <option value={Avatar13}>Avatar13</option>
                <option value={Avatar14}>Avatar14</option>
                <option value={Avatar15}>Avatar15</option>
                <option value={Avatar16}>Avatar16</option>
            </select>
            <p>Preview:</p>
            <img 
                src={newPic}
                alt="Profile avatar preview" 
            />
            <button type="button" onClick={() => changePicture(newPic, changeProfilePic)} className="close-modal2-btn">
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
