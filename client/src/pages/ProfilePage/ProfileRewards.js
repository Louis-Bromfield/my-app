import React, { useState, useEffect } from 'react';
import './ProfileRewards.css';

function ProfileRewards(props) {
    const [rewards, setRewards] = useState([
        { levelRequired: 0, rewards: ["Rank Title: Guesser"] },
        { levelRequired: 5, rewards: ["Rank Title: Predictor"] },
        { levelRequired: 10, rewards: ["Rank Title: Forecaster", "Unlock My Stats section on My Profile"] },
        { levelRequired: 15, rewards: ["Rank Title: Seer", "Create your own league"] },
        { levelRequired: 20, rewards: ["Rank Title: Soothsayer"] },
        { levelRequired: 25, rewards: ["Rank Title: Oracle"] },
        { levelRequired: 30, rewards: ["Rank Title: Prophet", "Push your post to the top of the news feed"] },
        { levelRequired: 35, rewards: ["Rank Title: Clairvoyant"] },
        { levelRequired: 40, rewards: ["Rank Title: Augur"] },
        { levelRequired: 45, rewards: ["Rank Title: Omniscient"] },
        { levelRequired: 50, rewards: ["Rank Title: Diviner"] },
    ]);
    return (
        <div className="profile-rewards">
            <h1 className="profile-header">This section is currently under construction, come back soon!</h1>
        </div>
    )
}

export default ProfileRewards;