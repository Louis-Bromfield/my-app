import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Profile.css';
import ProfileStats from './ProfileStats';
import ProfileDetails from './ProfileDetails';
import FakeProfilePic2 from '../../media/ProfileP.png';
import Modal from '../../components/Modal';

function Profile(props) {
    const [markets, setMarkets] = useState("");
    const [index, setIndex] = useState();
    const [brierAverage, setBrierAverage] = useState("N/A");
    const [bestForecast, setBestForecast] = useState("N/A");
    const [fantasyForecastPoints, setFantasyForecastPoints] = useState(0);
    const [brierScoresArr, setBrierScoresArr] = useState([]);
    const [userObj, setUserObj] = useState();
    const [showModal, setShowModal] = useState(false);
    const [modalContent, setModalContent] = useState("");

    useEffect(() => {
        if (props.user.markets === undefined) {
            const markets = localStorage.getItem('markets').split(",");
            formatMarketsString(markets);
        } else {
            formatMarketsString(props.user.markets);
        }
        if (props.username === undefined) {
            const username = localStorage.getItem('username');
            retrieveUserInfoFromDB(username);
            updateOnboarding(username);
        } else {
            retrieveUserInfoFromDB(props.username);
            updateOnboarding(props.username);
        };
console.log("Profile.js UE");
    }, [props.username, props.user.markets]);

    const retrieveUserInfoFromDB = async (username) => {
        try {
            const lbName = "Fantasy Forecast All-Time"
            const userData = await axios.get(`https://fantasy-forecast-politics.herokuapp.com/leaderboards/leaderboard/${lbName}`);
            const lbRankings = userData.data.rankings.sort((a, b) => b.marketPoints - a.marketPoints);
            for (let i = 0; i < lbRankings.length; i++) {
                if (lbRankings[i].username === username) {
                    let k = i+1 % 10;
                    let l = i+1 % 100;
                    if (k === 1 && l !== 11) {
                        setIndex(i+1+"st");
                    } else if (k === 2 && l !== 12) {
                        setIndex(i+1+"nd");
                    } else if (k === 3 && l !== 13) {
                        setIndex(i+1+"rd");
                    } else {
                        setIndex(i+1+"th");
                    };      
                };
            };
            const userDocument = await axios.get(`https://fantasy-forecast-politics.herokuapp.com/users/profileData/${username}`);
            setUserObj(userDocument.data.userObj);
            setFantasyForecastPoints(userDocument.data.userObj.fantasyForecastPoints);
            setBrierAverage(Number(userDocument.data.averageBrier).toFixed(0));
            setBestForecast(`${userDocument.data.bestBrier} / 100 - ${userDocument.data.bestForecastProblem}`);
            setBrierScoresArr(userDocument.data.userObj.brierScoresArr);
        } catch (error) {
            console.error("Error in Profile.js > retrieveUserInfoFromDB");
            console.error(error);
        };
    };

    const formatMarketsString = (markets) => {
        let string = "";
        for (let i = 0; i < markets.length; i++) {
            if (markets[i] !== '"Fantasy Forecast All-Time"') {
                string += `${markets[i]}, `;
            };
        };
        // Remove the last comma from the final market in the list
        string = string.slice(0, string.length-2);
        setMarkets(string);
    };

    const updateOnboarding = async (username) => {
        try {
            // Try to redo this so that we don't need to do the GET first 
            const userDocument = await axios.get(`https://fantasy-forecast-politics.herokuapp.com/users/${username}`);
            if (userDocument.data[0].onboarding.visitProfilePage === true) {
                return;
            } else {
                userDocument.data[0].onboarding.visitProfilePage = true;
                userDocument.data[0].fantasyForecastPoints = userDocument.data[0].fantasyForecastPoints + 100
                await axios.patch(`https://fantasy-forecast-politics.herokuapp.com/users/${username}`, 
                    { 
                        onboarding: userDocument.data[0].onboarding,
                        fantasyForecastPoints: userDocument.data[0].fantasyForecastPoints 
                    }
                );
                setShowModal(true);
                setModalContent("You just got 100 Fantasy Forecast Points for visiting your profile for the first time!");
            };
        } catch (error) {
            console.error(error);
        };
    };
    
    return (
        <div className="profile">
            <h1>My Profile</h1>
            <Modal show={showModal} handleClose={() => setShowModal(false)}>
                <p>{modalContent}</p>
            </Modal>
            {/* <button type="button" onClick={() => setShowModal(true)}>
                Open
            </button> */}
            <div className="main-profile-grid">
                <div className="profile-grid">
                    <h1 className="profile-header">{props.username}</h1>
                    <div className="profile-main-info">
                        <img className="profile-profile-pic" src={props.profilePicture || localStorage.getItem("profilePicture")} alt="Temporary profile pic"/>
                        <div className="profile-summary">
                            <ul className="profile-summary-list">
                                <li key={0} className="profile-summary-list-item">
                                    <h3>Name:</h3>
                                    <h4>{props.user.name !== undefined ? props.username : localStorage.getItem('name')}</h4>
                                </li>
                                <li key={1} className="profile-summary-list-item">
                                    <h3>Fantasy Forecast Points:</h3>
                                    <h4>{fantasyForecastPoints === undefined ? props.user.fantasyForecastPoints.toFixed(0): fantasyForecastPoints.toFixed(0)}</h4>
                                </li>
                                <li key={2} className="profile-summary-list-item">
                                    <h3>Brier Score Average:</h3>
                                    <h4>{isNaN(brierAverage) ? "N/A" : brierAverage }</h4>
                                </li>
                                <li key={3} className="profile-summary-list-item">
                                    <h3>Best Forecast:</h3>
                                    <h4>{bestForecast}</h4>
                                </li>
                                <li key={4} className="profile-summary-list-item">
                                    <h3>Fantasy Forecast All-Time Rank:</h3>
                                    <h4>{index}</h4>
                                </li>
                                <li key={5} className="profile-summary-list-item">
                                    <h3>Markets</h3>
                                    <h4>{markets}</h4>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <br/>
                    <hr/>
                    <ProfileStats 
                        username={props.username} 
                        brierScores={brierScoresArr} 
                        userObj={userObj} 
                    />
                    <hr />
                    <ProfileDetails 
                        username={props.username} 
                        updateUsername={props.updateUsername} 
                        setShowModal={setShowModal}
                        setModalContent={setModalContent}
                    />
                    {/* <hr /> */}
                    {/* <Settings /> */}
                </div>
            </div>
        </div>
    )
}

export default Profile;
