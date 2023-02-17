import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './ProfileTeam.css';
import ConfirmationModal from '../../components/ConfirmationModal';
import Modal from '../../components/Modal';
import { FaInfoCircle } from 'react-icons/fa';

function ProfileTeam(props) {
    const [teamMembers, setTeamMembers] = useState([]);
    const [createdTeamName, setCreatedTeamName] = useState("");
    const [teamLeft, setTeamLeft] = useState(false);
    const [showConfirmationModal, setShowConfirmationModal] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [modalContent, setModalContent] = useState("");
    const [userNowInTeam, setUserNowInTeam] = useState(false);
    const [teamName, setTeamName] = useState("");
    const [showInviteBtn, setShowInviteBtn] = useState(false);
    const [inviteToTeamText, setInviteToTeamText] = useState(`Invite ${props.searchPage === true ? props.searchName : ""} to ${props.searchPage === true ? props.searchingUser.inTeam === true ? props.searchingUser.teamName : "Team" : "Team"}`);


    useEffect(() => {
        console.log("ProfileTeam UE");
        console.log(props);
        // console.log(props.teamData.userObj);
        if (props.userObj.inTeam === true || userNowInTeam === true) {
            console.log("yes");
            retrieveMemberInfo(props.teamData.length !== 0 ? props.teamData.userObj.members : props.userObj.members);
        };
    }, [props.userObj.inTeam]);

    const retrieveMemberInfo = async (members) => {
        try {
            let membersData = [];
            for (let i = 0; i < members.length; i++) {
                const userDocument = await axios.get(`${process.env.REACT_APP_API_CALL_U}/profileData/${members[i]}`);
                
                membersData.push({
                    username: userDocument.data.userObj.username,
                    profilePic: userDocument.data.userObj.profilePicture,
                    ffPoints: userDocument.data.userObj.fantasyForecastPoints,
                    brierScores: userDocument.data.userObj.brierScores
                });
            };
            setTeamMembers(membersData);
        } catch (err) {
            console.error("Error in retrieveMemberInfo");
            console.error(err);
        };
    };

    const createNewTeam = async () => {
        if (props.userObj.username === "Guest") {
            setModalContent("Guests cannot create teams. To make a team, log out and create an account, then head back here!");
            return;
        } else {
            try {
                console.log("createNewTeam function");
                console.log(createdTeamName)
                const res = await axios.patch(`${process.env.REACT_APP_API_CALL_U}/createJoinLeaveTeam/${props.userObj.username}`, {
                    action: "create",
                    oldTeam: "",
                    inTeam: true,
                    teamName: createdTeamName
                });
                console.log(res);
                setTeamLeft(false);
                // call retreivememberino function?
                retrieveMemberInfo([props.userObj.username])
                setUserNowInTeam(true);
                setTeamName(createdTeamName);
            } catch (err) {
                console.error("Error in createNewTeam");
                console.error(err);
            };
        };
    };

    const leaveTeam = async () => {
        console.log("clicked!");
        try {
            const res = await axios.patch(`${process.env.REACT_APP_API_CALL_U}/createJoinLeaveTeam/${props.userObj.username}`, {
                action: "leave",
                oldTeam: props.teamData.userObj.username,
                inTeam: false,
                teamName: ""
            });
            console.log(res);
            setTeamLeft(true);
        } catch (err) {
            console.error("Error in leaveTeam");
            console.error(err);
        };
    };

    const inviteToTeam = async () => {
        try {
            console.log("here in invite to team");
            // send notification to user, when they click on it it has a check and if it's a team invite it opens a modal and then 
            // asks the user to decide if they want to accept/reject it or close the modal?
            // if they click "accept" but are already in a team, inform them they have to leave their current team first
            await axios.patch(`${process.env.REACT_APP_API_CALL_U}/newNotification/${props.searchName}`, {
            
                notificationMessage: `You have been invited to join ${props.searchingUser.teamName}! Here you can accept or reject the request. Being part of a team means that any score you receive will also contribute to a score for your team (If three players score 10, 40 and 100, the team will receive the average of these which is 50). Your individual score is unaffected by being in a team, but this is another way for you to climb the leaderboards! For more info, go to the Learn page and select Forecasting Teams.`,
                notificationSourcePath: "/team-invite",
                notificationSourceObjectID: props.searchingUser.teamName
            });
            setInviteToTeamText("Invite sent");
        } catch (err) {
            console.error("Error in inviteToTeam");
            console.error(err);
            setInviteToTeamText("Error. Please try again later");
        };
    };

  return (
    <div className="profile-team">
        <Modal show={showModal} handleClose={() => setShowModal(false)}>
            <p>{modalContent}</p>
        </Modal>
        <ConfirmationModal 
            show={showConfirmationModal} 
            handleClose={() => {
                leaveTeam(); 
                setShowConfirmationModal(false)
                setShowModal(true);
                setModalContent("You have left your team");
            }} 
            justClose={() => setShowConfirmationModal(false)}
        />
        <h2 className="profile-header" style={{ color: "#404d72" }}>
            {props.userObj.isTeam === true ? props.userObj.username : `My Team ${(props.userObj.inTeam === true || teamLeft === false) ? `- ${teamName !== "" ? teamName: props.userObj.teamName}` : ""}`}
        </h2>
        {((props.userObj.inTeam === true && teamLeft === false) || (userNowInTeam === true && teamLeft === false)) ? 
            <div className="profile-team-container">
                {console.log(props)}
                <div className="profile-team-top-row">
                    <div className="profile-team-stats">
                        <div className="profile-team-picture-container">
                            <img className="profile-team-picture" src={props.teamData.length === 0 ? props.userObj.profilePicture : props.teamData !== undefined ? props.teamData.userObj.profilePicture : ""} alt="A circle with a single F"></img>
                        </div>
                        <div className="profile-team-stats-text">
                            <h3>Team FF Points: {props.teamData.length === 0 ? props.userObj.fantasyForecastPoints.toFixed(0) : props.teamData !== undefined ? props.teamData.userObj.fantasyForecastPoints.toFixed(0) : 0}</h3>
                            <h3># of Members: {props.teamData.length === 0 ? props.userObj.members.length : props.teamData !== undefined ? props.teamData.userObj.members.length : teamMembers.length}</h3>
                            <p>To invite players to join your team, visit their profile (either by using the Search page or clicking their username on their posts in your Feed) and click "Invite To Team"!</p>
                        </div>
                        {(props.searchPage === false && props.userObj.isTeam === false) && <button 
                            className="profile-team-leave-btn"
                            onClick={() => setShowConfirmationModal(true)}>
                                Leave Team
                        </button>}
                    </div>
                    <div className="profile-team-members-list">
                        <h3 style={{ color: "#404d72" }}>{props.userObj.teamName} Members</h3>
                        {teamMembers.map((item, index) => {
                            return (
                                <Link
                                    to={{pathname: "/search", clickedUsername: item.username}}
                                    className="profile-team-member-link"
                                    onClick={() => localStorage.setItem("selectedPage", "Search")}>
                                        <div className="profile-team-bottom-row-individual-member">
                                            <img className="profile-team-bottom-row-individual-member-photo" src={item.profilePic} alt="Team member profile pic" />
                                            {/* <Link  */}
                                                {/*  to={{pathname: "/search", clickedUsername: item.username}} */}
                                                {/*  onClick={() => localStorage.setItem("selectedPage", "Search")}> */}
                                                    <h4>{item.username}</h4>
                                            {/* </Link> */}
                                            <h4>{item.ffPoints.toFixed(0)} FF Points</h4>
                                        </div>
                                </Link>
                            )
                        })}
                    </div>
                    {(props.searchPage === true && props.searchingUser.inTeam === true) && <div className="profile-team-invite-container">
                        <button
                            className="profile-team-invite-btn"
                            onClick={() => { console.log("hello"); inviteToTeam()}}
                            >
                                <h3>{inviteToTeamText}</h3>
                        </button>
                    </div>}
                </div>
                <div className="profile-team-results">
                    <br />
                    <h2 className="profile-header" style={{ color: "#404d72" }}>Team Forecast Results</h2>
                    {/* loop through team document to get all problems at least one member has attempted */}
                    {props.teamData.length !== 0 ? (props.teamData !== undefined && props.teamData.userObj.brierScores.length !== 0 ? props.teamData.userObj.brierScores.map((item, index) => {
                        console.log(item);
                        return (
                            <div className="profile-team-individual-result">
                                <h3 style={{ color: "#404d72" }}>{index+1}. {item.problemName} ({item.brierScore.toFixed(2)} / 110)</h3>
                                {/* then map through membersData to get their scores for each problem - triple loop tho :( */}
                                {teamMembers.map((newItem, newIndex) => {
                                    return (
                                        newItem.brierScores.map((individualItem, individualIndex) => {
                                            if (individualItem.problemName === item.problemName) {
                                                return (
                                                    <p key={newItem}>{newItem.username}: {individualItem.brierScore.toFixed(2)} / 110</p>
                                                )
                                            }
                                        }) 
                                    )
                                })}
                            </div>
                        )
                    }) : <p>This team does not yet have any scores to show.</p>) : props.userObj.brierScores.length !== 0 ? props.userObj.brierScores.map((item, index) => {
                        console.log(item);
                        return (
                            <div className="profile-team-individual-result">
                                <h3>{index+1}. {item.problemName} ({item.brierScore} / 110)</h3>
                                {/* then map through membersData to get their scores for each problem - triple loop tho :( */}
                                {teamMembers.map((newItem, newIndex) => {
                                    return (
                                        newItem.brierScores.map((individualItem, individualIndex) => {
                                            if (individualItem.problemName === item.problemName) {
                                                return (
                                                    <p key={newItem}>{newItem.username}: {individualItem.brierScore} / 110</p>
                                                )
                                            }
                                        }) 
                                    )
                                })}
                            </div>
                        )
                    }) : <p>This team does not yet have any scores to show.</p>}
                </div>
            </div>
        : 
            <div className="profile-team-container">
                {props.searchPage === false ? <div className="profile-team-creation-container">
                    <h3>Want to create a team?</h3>
                    <label htmlFor="team-name-input">Team Name:</label>
                    <input className="team-name-input" type="text" onChange={(e) => setCreatedTeamName(e.target.value)}/>
                    <button className="create-new-team-btn" onClick={() => createNewTeam()}><h3>Create New Team</h3></button>
                </div>
                :
                <div className="profile-team-creation-container">
                    <h3>This player is not currently in a team. Want to invite them to yours? Click the "Invite to Team" button below!</h3>
                        {(props.searchingUser.inTeam === true && props.showInviteBtn === true) && <div className="profile-team-invite-container">
                            <button
                                className="profile-team-invite-btn"
                                onClick={() => inviteToTeam}
                                >
                                    <h3>{inviteToTeamText}</h3>
                            </button>
                        </div>}
                </div>}
            </div>
        }
    </div>
  )
}

export default ProfileTeam;