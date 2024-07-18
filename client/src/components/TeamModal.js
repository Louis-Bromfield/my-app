import React, { useState } from 'react';
import './ClosedProblemModal.css';
import FFLogo from '../media/Icon.png';
import axios from 'axios';

const TeamModal = ({ show, notificationObject, username, justClose, oldTeam, calledFromNav }) => {
    const [teamResponse, setTeamResponse] = useState(-1);
    const showHideClassName = show ? "modal display-block" : "modal display-none";

    const acceptInvite = async () => {
        try {
            const res = await axios.patch(`${process.env.REACT_APP_API_CALL_U}/createJoinLeaveTeam/${username}`, {
                action: "join",
                teamName: notificationObject.notificationSourceObjectID,
                oldTeam: oldTeam
            });
            setTeamResponse(`You have successfully joined ${notificationObject.notificationSourceObjectID}! Go to your profile page and select "My Team" to see more info!`)
        } catch (err) {
            console.error("Error in acceptInvite");
            console.error(err);
        };
    };

    return (
        <div className={showHideClassName}>
            <section className="modal-main">
                <img src={FFLogo} alt="Small drawing of a domed building with four columns." />
                <p>{teamResponse === -1 ? notificationObject.notificationMessage : teamResponse}</p>
                {teamResponse === -1 && <button type="button" onClick={acceptInvite} className="close-modal2-btn">
                    Join Team
                </button>}
                <button type="button" onClick={justClose} className="close-modal2-btn-close">
                    Close
                </button>
            </section>
        </div>
    );
}

export default TeamModal;