import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "./HomeButtonSmall.css";
import PropTypes from 'prop-types';
import * as AiIcons from 'react-icons/ai';
import { FaInfoCircle } from 'react-icons/fa';
import { HomeButtonNavButton } from './HomeButtonNavButton';
import Modal from '../../../components/Modal';


function HomeButtonSmall(props) {
    const [brierScore, setBrierScore] = useState(0);
    const [learnProgress, setLearnProgress] = useState(0);
    const [totalQuizCount, setTotalQuizCount] = useState(0);
    const [leaderboardRank, setLeaderboardRank] = useState(0);
    const [showModal, setShowModal] = useState(false);
    const [modalContent, setModalContent] = useState("");
    let mainData, subtitle, path;
    
    const getBrierScore = (userObj) => {
        if (userObj.length === 15) {
            setBrierScore(props.currentAvgBrier);
            localStorage.setItem("brierScore", props.currentAvgBrier);
            return;
        } else {
            let brierTotal = 0;
            for (let i = 0; i < userObj.brierScores.length; i++) {
                brierTotal += userObj.brierScores[i].brierScore;
            };
            const brierForState = (brierTotal / userObj.brierScores.length).toFixed(0);
            setBrierScore(isNaN(brierForState) ? "N/A" : brierForState);
            localStorage.setItem("brierScore", isNaN(brierForState) ? "N/A" : brierForState);
        };
    };

    // We could make this serverless if we stored learnQuiz progress inside user documents...
    const getLearnProgress = async (userLearn) => {
        try {
            // const userLearn = await axios.get(`https://fantasy-forecast-politics.herokuapp.com/learnQuizzes/${username}`);
            if (userLearn === null || userLearn === undefined) {
                setLearnProgress(0);
                setTotalQuizCount(0);
                return;
            } else {
                let totalQuizzes = 0;
                let completeQuizzes = 0;
                for (let i = 0; i < Object.values(userLearn).length; i++) {
                    if (Object.values(userLearn)[i] === true || Object.values(userLearn)[i] === false) {
                        totalQuizzes++;
                        if (Object.values(userLearn)[i] === true) {
                            completeQuizzes++;
                        };
                    };
                };
                setLearnProgress(completeQuizzes);
                setTotalQuizCount(totalQuizzes);
            }
        } catch (error) {
            console.error("Error in getLearnProgress > HomeButtonSmall");
            console.error(error);
        };
    };

    const getLeaderboardRank = async (username) => {
        try {
            const lbName = "Fantasy Forecast All-Time";
            const leaderboard = await axios.get(`https://fantasy-forecast-politics.herokuapp.com/leaderboards/leaderboard/${lbName}`);
            // let lbRankings = leaderboard.data.rankings.sort((a, b) => b.marketPoints - a.marketPoints);
            for (let i = 0; i < leaderboard.data.length; i++) {
                if (leaderboard.data[i].username === username) {
                    let j = i + 1;
                    let k = j % 10;
                    let l = j % 100;
                    if (k === 1 && l !== 11) {
                        setLeaderboardRank(j+"st");
                    } else if (k === 2 && l !== 12) {
                        setLeaderboardRank(j+"nd");
                    } else if (k === 3 && l !== 13) {
                        setLeaderboardRank(j+"rd");
                    } else {
                        setLeaderboardRank(j+"th");
                    };                 
                };
            };
        } catch (error) {
            console.error("Error in getLeaderboardRank > HomeButtonSmall");
            console.error(error);
        };
    };

    useEffect(() => {
        // if (props.userLearnQuizzes !== undefined && props.userLearnQuizzes !== null) {
        //     console.log(props.userLearnQuizzes);
        // };
        getBrierScore(props.user);
        getLearnProgress(props.userLearnQuizzes);
        getLeaderboardRank(props.username);
    }, [props.userLearnQuizzes, props.username, props.currentAvgBrier]);

    switch(props.title) {
        case("Your Average Brier Score"):
            mainData = brierScore;
            subtitle = "110 = Highest, 0 = Lowest";
            path = "forecast"
            break;
        case("Your Learn Progress"):
            mainData = `${learnProgress} / ${totalQuizCount}`;
            subtitle = "Sections Completed";
            path = "learn"
            break;
        case("Leaderboards"):
            mainData = leaderboardRank;
            subtitle = "Fantasy Forecast All-Time Rank"
            path ="leaderboard-select"
            break;
        default:
            mainData = brierScore;
            subtitle = "110 = Highest, 0 = Lowest";
            path = "forecast"
            break;
    }
    return (
        <div className="home-button-small">
            <Modal show={showModal} handleClose={() => setShowModal(false)}>
                <p>{modalContent}</p>
            </Modal>
            <div className="home-button-small-title">
                {props.title === "Your Average Brier Score" ?
                <h2>
                    {props.title}
                    <FaInfoCircle 
                        color={"orange"} 
                        className="modal-i-btn"
                        onClick={() => { setShowModal(true); setModalContent(`This score is made up of every score you've achieved for every problem you've submitted a forecast for. For more info, go to the Brier Scores tab on the Learn page.`)}}
                    />
                </h2>
                :
                <h2 className="home-button-small-title">{props.title}</h2>
                }
                <div className="home-button-scroll">
                    <AiIcons.AiOutlineCaretRight 
                        className="home-button-nav-right" 
                        size={20} 
                        onClick={() => props.handleClick(props.title)}
                    />
                </div>
            </div>
            <h1 className="home-button-small-data">{mainData}</h1>
            <h3 className="home-button-small-subtitle">{subtitle}</h3>
            <HomeButtonNavButton path={path} />
        </div>
    )
}

export default HomeButtonSmall;

HomeButtonSmall.propTypes = {
    title: PropTypes.string.isRequired
};