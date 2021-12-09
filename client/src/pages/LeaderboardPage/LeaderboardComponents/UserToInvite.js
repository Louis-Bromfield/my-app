import React, { useState } from 'react';
import './UserToInvite.css';

function UserToInvite(props) {
    const [selected, setSelected] = useState(false);

    const handleClick = () => {
        props.toggleInviteUserToLeague(props.username)
        setSelected(!selected);
    };
    return (
        <> 
        {selected === true &&
        <div
            className="selected-friend-to-invite" 
            key={props.username}
            onClick={handleClick}
        >
            <img className="invite-user-profile-picture" src={props.ProfileP} alt="User profile pic" />
            <h4>{props.username}</h4>
        </div>
        }
        {selected === false &&
        <div
            className="deselected-friend-to-invite" 
            key={props.username}
            onClick={handleClick}
        >
            <img className="invite-user-profile-picture"src={props.ProfileP} alt="User profile pic" />
            <h4>{props.username}</h4>
        </div>
        }
        </>
    )
}

export default UserToInvite;
