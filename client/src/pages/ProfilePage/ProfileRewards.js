import React, { useState, useEffect } from 'react';
import './ProfileRewards.css';
import Trophy from '../../media/Trophy.png';
import TrophyModified from '../../media/TrophyModified.png';
import Modal from '../../components/Modal';

function ProfileRewards(props) {
    // const [rewards, setRewards] = useState([
    //     { levelRequired: 0, rewards: ["Rank Title: Guesser"] },
    //     { levelRequired: 5, rewards: ["Rank Title: Predictor"] },
    //     { levelRequired: 10, rewards: ["Rank Title: Forecaster", "Unlock My Stats section on My Profile"] },
    //     { levelRequired: 15, rewards: ["Rank Title: Seer", "Create your own league"] },
    //     { levelRequired: 20, rewards: ["Rank Title: Soothsayer"] },
    //     { levelRequired: 25, rewards: ["Rank Title: Oracle"] },
    //     { levelRequired: 30, rewards: ["Rank Title: Prophet"] },
    //     { levelRequired: 35, rewards: ["Rank Title: Clairvoyant"] },
    //     { levelRequired: 40, rewards: ["Rank Title: Augur"] },
    //     { levelRequired: 45, rewards: ["Rank Title: Omniscient"] },
    //     { levelRequired: 50, rewards: ["Rank Title: Diviner"] },
    // ]);
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
                        <div className="individual-trophy-container" onClick={() => { setShowModal(true); setModalContent(item.trophyModalText)}}>
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