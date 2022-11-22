import React, { useState, useEffect } from 'react';
import './Top3Users.css';
import TopUser1 from '../../../../media/ProfileP.png';
import TopUser2 from '../../../../media/ProfileP.png';
import TopUser3 from '../../../../media/ProfileP.png';

function Top3Users(props) {
    const [topThreeUsers, setTopThreeUsers] = useState([]);

    useEffect(() => {
        if (props.rankingsForTop3.length === 0) {
            setTopThreeUsers([
                {
                    profilePicture: TopUser1,
                    username: "Top3User1"
                },
                {
                    profilePicture: TopUser2,
                    username: "Top3User2"
                },
                {
                    profilePicture: TopUser3,
                    username: "Top3User3"
                },
            ]);
        } else {
            setTopThreeUsers(props.rankingsForTop3);
        };
    }, [props.rankingsForTop3]);

    return (
        <div className="top-three-users-highlight">
            {topThreeUsers[0] !== undefined &&
                <div className="top-three-individual-user">
                    <img src={topThreeUsers[0].profilePicture || TopUser1} alt="First-placed user pic" className="rank-one-profile-pic" />
                    <h2>{topThreeUsers[0].username}</h2>
                    <h3>1st</h3>
                </div>
            }
            {topThreeUsers[1] !== undefined &&
                <div className="top-three-individual-user">
                    <img src={topThreeUsers[1].profilePicture || TopUser2} alt="Second-placed user pic" className="rank-two-profile-pic"/>
                    <h2>{topThreeUsers[1].username}</h2>
                    <h3>2nd</h3>
                </div>
            }
            {topThreeUsers[2] !== undefined &&
                <div className="top-three-individual-user">
                    <img src={topThreeUsers[2].profilePicture || TopUser3} alt="Third-placed user pic" className="rank-three-profile-pic"/>
                    <h2>{topThreeUsers[2].username}</h2>
                    <h3>3rd</h3>
                </div>
            }
        </div>
    )
}

export default Top3Users;
