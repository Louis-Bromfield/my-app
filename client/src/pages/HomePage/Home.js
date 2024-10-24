import React, { useState, useEffect } from 'react';
import './Home.css';
import axios from 'axios';
import HomeNewsFeed from './HomeSectionButtons/HomeNewsFeed';
import HomeButtonSmall from './HomeSectionButtons/HomeButtonSmall';
import HomeButtonLarge from './HomeSectionButtons/HomeButtonLarge';
import NewForecastsCallToAction from './HomeSectionButtons/NewForecastsCallToAction';
import Onboarding from './HomeSectionButtons/Onboarding';
import Modal from '../../components/Modal';
import ClosedProblemModal from '../../components/ClosedProblemModal';
import HomeChangeLogPreview from './HomeSectionButtons/HomeChangeLogPreview';
import HomeProfilePreview from './HomeSectionButtons/HomeProfilePreview';
import HomeProblemPreview from './HomeSectionButtons/HomeProblemPreview';
import { FaInfoCircle } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useCookies } from 'react-cookie';

const bcrypt = require("bcryptjs");

function Home(props) {
    const [width, setWidth] = useState(window.innerWidth);
    const [height, setHeight] = useState(window.innerHeight);
    const [showOnboarding, setShowOnboarding] = useState(false);
    const [buttonText, setButtonText] = useState("Hide");
    const [homeStats, setHomeStats] = useState("Your Average Brier Score");
    const [subtitle, setSubtitle] = useState("0 = Highest, 2 = Lowest");
    const [showModal, setShowModal] = useState(false);
    const [showClosedProblemModal, setShowClosedProblemModal] = useState(props.userClosedForecastCount > 0 ? true : false);
    const [modalContent, setModalContent] = useState("");
    const [userObj, setUserObj] = useState(props.user);
    const [onboardingClassName, setOnboardingClassName] = useState("onboarding-div-closed");
    const [currentAvgBrier, setCurrentAvgBrier] = useState(0);
    const [userMarkets, setUserMarkets] = useState([]);
    const [userOnboarding, setUserOnboarding] = useState({});
    const [userClosedForecastCount, setUserClosedForecastCount] = useState(0);
    const [userLearnQuizzes, setUserLearnQuizzes] = useState({ brierComplete: false, gjpComplete: false, superforecastersComplete: false });

    const onboardingButtonClick = (showOnboarding, buttonText) => {
        setShowOnboarding(!showOnboarding);
        buttonText === "Hide" ? setButtonText("Show") : setButtonText("Hide");
    };

    useEffect(() => {
        if (localStorage.getItem("firstVisit") === "true") {
            const welcomeString = "Welcome to Horse Race Politics! If this is your first time here, we recommend checking out the Onboarding menu on the right (or down below if you're on mobile) for ideas on how to get started with the site - have fun!";
            setModalContent(welcomeString);
            setShowModal(true);
            localStorage.setItem("firstVisit", false);
        };
            getUserInfo(props.username);
    }, [props.username]);

    const getUserInfo = async (username) => {
        try {
            // const userDocument = await axios.get(`${process.env.REACT_APP_API_CALL_U}/${username}`);
            const userDocument = await axios.get(`http://localhost:8000/users/${username}`);
            if (userDocument.data[0].numberOfClosedForecasts > 0) {
                setShowClosedProblemModal(true);
            };
            let avgBrier = 0;
            for (let i = 0; i < userDocument.data[0].brierScores.length; i++) {
                avgBrier += userDocument.data[0].brierScores[i].brierScore;
            };
            avgBrier = avgBrier / userDocument.data[0].brierScores.length;
            setCurrentAvgBrier(isNaN(avgBrier.toFixed(2)) ? 0 : avgBrier.toFixed(2));
            setUserObj(userDocument.data[0]);
            setUserMarkets(userDocument.data[0].markets);
            setUserOnboarding(userDocument.data[0].onboarding);
            setUserClosedForecastCount(userDocument.data[0].numberOfClosedForecasts);
            setUserLearnQuizzes(userDocument.data[0].learnQuizzes);
            props.setUserObject(userDocument.data[0]);
            props.setUserFFPoints(userDocument.data[0].fantasyForecastPoints);
            props.setProfilePicture(userDocument.data[0].profilePicture);
        } catch (error) {
            console.error("Error in getUserInfo");
            console.error(error);
        };
    };

    const scrollHomeStats = (currentStatsShowing) => {
        switch(currentStatsShowing) {
            case("Your Average Brier Score"):
                setHomeStats("Your Learn Progress");
                setSubtitle("Sections Completed");
                break;
            case("Your Learn Progress"):
                setHomeStats("Leaderboards");
                setSubtitle("Global Rank");
                break;
            case("Leaderboards"):
                setHomeStats("Your Average Brier Score");
                setSubtitle("100 = Highest, 0 = Lowest");
                break;
            default:
                setHomeStats("Your Average Brier Score");
                setSubtitle("100 = Highest, 0 = Lowest");
                break;
        };
    };

    return (
        <div className="home">
            <Modal show={showModal} handleClose={() => setShowModal(false)}>
                <p>{modalContent}</p>
            </Modal>
            {userClosedForecastCount > 0 &&
                <ClosedProblemModal 
                    show={showClosedProblemModal}
                    setShowClosedProblemModal={setShowClosedProblemModal}
                    userClosedForecastCount={userClosedForecastCount}
                    user={props.user === undefined ? userObj : props.user}
                    username={props.username}
                    userBrierScores={props.userBrierScores === undefined ? userObj.brierScores : props.userBrierScores}
                    setUserClosedForecastCount={setUserClosedForecastCount}>
                </ClosedProblemModal>
            } 
            {width >= 1100 && <div className="home-page-div">
                {/* <HomeProblemPreview username={props.username} /> */}
                <div className="home-page-grid">
                    <div className="home-page-grid-left-col">
                        <HomeProblemPreview username={props.username} isTop={true} />
                        <HomeProblemPreview username={props.username} isTop={false} />
                        {/* Temp solution */}
                        {/* <div className="report-any-issues-container">
                            <h3 className="home-button-large-title">The 2024 US Presidential Election Summary</h3>
                            <Link to="/race-summary" className="home-button-nav-button">According to our Jockeys</Link>
                        </div> */}
                        {/* Temp solution */}
                        <HomeChangeLogPreview isMobile={false} />
                        <div className="report-any-issues-container">
                            <h3 className="home-button-large-title">Got any site issues, feedback, or praise?</h3>
                            <Link to="/report-any-issues" className="home-button-nav-button">Submit Your Views Anonymously Here</Link>
                        </div>
                    </div>
                    <div className="home-page-news-feed">
                        <HomeNewsFeed 
                            username={props.username} 
                            userProfilePicture={props.profilePicture}
                            userObj={userObj}
                            userMarkets={userMarkets}
                            handleFirstPost={setShowModal} 
                            handleFirstPostModalContent={setModalContent}
                        />
                    </div>
                    <div className="home-page-stats-div">
                        <HomeProfilePreview 
                            userObj={userObj}
                            username={props.username}
                            userLearnQuizzes={userLearnQuizzes}
                        />
                        {/* <NewForecastsCallToAction username={props.username} />  */}
                        <div className={onboardingClassName}>
                            <Onboarding 
                                userOnboarding={userOnboarding}
                                handleClick={() => onboardingButtonClick(showOnboarding, buttonText)} 
                                buttonText={buttonText} 
                                isHidden={showOnboarding}
                                setShowModal={setShowModal}
                                setModalContent={setModalContent}
                                setOnboardingClassName={setOnboardingClassName}
                            />
                        </div>
                        <HomeButtonLarge 
                            title="My Recent Forecasts"
                            user={userObj} 
                        /> 
                        { /* <HomeChangeLogPreview />
                        <div className="report-any-issues-container">
                            <h3 className="home-button-large-title">Got any site issues, feedback, or praise?</h3>
                            <Link to="/report-any-issues" className="home-button-nav-button">Submit Your Views Anonymously Here</Link>
                        </div> */}
                    </div>
                </div>
            </div>}
            {(width < 1100 && width >= 800) && 
                <div className="home-page-grid-middle-CSS">
                    <div className="home-page-news-feed">
                        <HomeNewsFeed 
                            username={props.username} 
                            userProfilePicture={props.profilePicture}
                            userObj={userObj}
                            userMarkets={userMarkets}
                            handleFirstPost={setShowModal} 
                            handleFirstPostModalContent={setModalContent}
                        />
                    </div>
                    <div className="home-page-stats-div">
                        <HomeProblemPreview username={props.username} isTop={true} />
                        <HomeProblemPreview username={props.username} isTop={false} />
                        <HomeProfilePreview 
                            userObj={userObj}
                            username={props.username}
                            userLearnQuizzes={userLearnQuizzes}
                        />
                        {/* <NewForecastsCallToAction username={props.username} />  */}
                        <div className={onboardingClassName}>
                            <Onboarding 
                                userOnboarding={userOnboarding}
                                handleClick={() => onboardingButtonClick(showOnboarding, buttonText)} 
                                buttonText={buttonText} 
                                isHidden={showOnboarding}
                                setShowModal={setShowModal}
                                setModalContent={setModalContent}
                                setOnboardingClassName={setOnboardingClassName}
                            />
                        </div>
                        <HomeButtonLarge 
                            title="My Recent Forecasts"
                            user={userObj} 
                        /> 
                        <HomeChangeLogPreview isMobile={false} />
                        <div className="report-any-issues-container">
                            <h3 className="home-button-large-title">Got any site issues, feedback, or praise?</h3>
                            <Link to="/report-any-issues" className="home-button-nav-button">Submit Your Views Anonymously Here</Link>
                        </div>
                    </div>
                </div>
            }
            {width <= 650 && 
                <div className="home-page-grid-small-CSS">
                    <div className="home-page-news-feed">
                        <HomeNewsFeed 
                            username={props.username} 
                            userProfilePicture={props.profilePicture}
                            userObj={userObj}
                            userMarkets={userMarkets}
                            handleFirstPost={setShowModal} 
                            handleFirstPostModalContent={setModalContent}
                        />
                    </div>
                    <div className="home-page-stats-div">
                        <HomeProblemPreview username={props.username} isTop={true} />
                        <HomeProblemPreview username={props.username} isTop={false} />
                        {/* <NewForecastsCallToAction username={props.username} />  */}
                        <div className={onboardingClassName}>
                            <Onboarding 
                                userOnboarding={userOnboarding}
                                handleClick={() => onboardingButtonClick(showOnboarding, buttonText)} 
                                buttonText={buttonText} 
                                isHidden={showOnboarding}
                                setShowModal={setShowModal}
                                setModalContent={setModalContent}
                                setOnboardingClassName={setOnboardingClassName}
                            />
                        </div>
                        <HomeChangeLogPreview isMobile={true} />
                        <div className="report-any-issues-container">
                            <h3 className="home-button-large-title">Got any site issues, feedback, or praise?</h3>
                            <Link to="/report-any-issues" className="home-button-nav-button">Submit Your Views Anonymously Here</Link>
                        </div>
                    </div>
                </div>
            }
        </div>
    )
}

export default Home;
