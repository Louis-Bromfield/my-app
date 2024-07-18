import React, { useState, useEffect } from 'react';
import './ProfileRewards.css';
import Trophy from '../../media/Trophy.png';
import TrophyModified from '../../media/TrophyModified.png';
import Modal from '../../components/Modal';

function ProfileRewards(props) {
    const [showModal, setShowModal] = useState(false);
    const [modalContent, setModalContent] = useState("");
    const [completeTrophyCount, setCompleteTrophyCount] = useState(0);

    useEffect(() => {
        let trophyCount = 0;
        if (props.userObj.trophies !== undefined) {
            for (let i = 0; i < props.userObj.trophies.length; i++) {
                if (props.userObj.trophies[i].obtained === true) {
                    trophyCount++;
                };
            };
            setCompleteTrophyCount(trophyCount);
        }
    }, [props.userObj.trophies]);

    return (
        <div className="profile-rewards">
            <Modal show={showModal} handleClose={() => setShowModal(false)}>
                <p>{modalContent}</p>
            </Modal>
            <h2 className="profile-header">My Trophies ({completeTrophyCount}/12)</h2>
            <p>Here you can find all possible trophies that you can obtain through Fantasy Forecast. Trophies you have obtained are in colour, and those that are not are in
                grey. Each trophy can be clicked on to tell you how it has been or can be obtained.
            </p>
            <div className="trophy-grid-container">
                {props.userObj.trophies !== undefined ? props.userObj.trophies.map((item, index) => {
                    return (
                        <div className="individual-trophy-container" onClick={() => { setShowModal(true); setModalContent(item.trophyText === "Seer" ? "This trophy is earned by reaching Level 15, or 1500 Fantasy Forecast Points. You will be given a Level-exclusive profile border (bronze) to let other forecasters know of your rank." : item.trophyModalText)}}>
                            <img src={item.obtained === true ? Trophy : TrophyModified} alt="" className="trophy-img" />
                            <h4>{item.trophyText}</h4>
                        </div>
                    )
                }) : null}
            </div>
        </div>
    )
}

export default ProfileRewards;