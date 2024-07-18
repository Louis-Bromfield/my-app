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

function Home(props) {
    let width, height;
    width = window.innerWidth;
    height = window.innerHeight;
    
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
            const welcomeString = "Welcome to Fantasy Forecast! If this is your first time here, we recommend checking out the Onboarding menu on the right (or down below if you're on mobile) for ideas on how to get started with the site - have fun!";
            setModalContent(welcomeString);
            setShowModal(true);
            localStorage.setItem("firstVisit", false);
        };
            getUserInfo(props.username);
    }, [props.username]);

    const getUserInfo = async (username) => {
        try {
            const userDocument = await axios.get(`${process.env.API_CALL_U}/${username}`);
console.log("HERE LOUIS++++++++++++++");
console.log(userDocument);
console.log("HERE LOUIS++++++++++++++");
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
            <div className="home-header-intro">
                <h1>Welcome back, {props.username}!</h1>
                <FaInfoCircle 
                    onClick={() => {
                        setShowModal(true);
                        setModalContent(`This is the home page for Fantasy Forecast. Use this as a central hub for 
                        navigating the site! Check out the news feed to see the latest stories that
                        your fellow forecasters have shared, or use any of the shortcuts to visit the 
                        forecasting, learn, and profile pages or the leaderboards!`)
                    }}
                    style={{ "color": "orange", "cursor": "pointer" }}
                />
            </div>
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
            <div className="home-page-div">
                <div className="home-page-grid">
                    <HomeProblemPreview username={props.username} />
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
                        {/* Commented out as it's all in Profile Preview */}
                        {/* <HomeButtonSmall 
                            title={homeStats} 
                            subtitle={subtitle} 
                            handleClick={scrollHomeStats} 
                            username={props.username} 
                            user={userObj} 
                            userLearnQuizzes={userLearnQuizzes}
                            forecasts={props.forecasts}
                            currentAvgBrier={currentAvgBrier}
                        /> */}
                        <HomeButtonLarge 
                            title="Your Recent Forecasts"
                            user={userObj} 
                        /> 
                        <HomeChangeLogPreview />
                        <div className="report-any-issues-container">
                            <p className="home-button-small-title" style={{ fontSize: "1.2em" }}>Got any site issues, feedback, or praise?</p>
                            <Link to="/report-any-issues" className="home-button-nav-button">Submit Your Views Anonymously Here</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Home;
