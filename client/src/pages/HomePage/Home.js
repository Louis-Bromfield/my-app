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
import { Link } from 'react-router-dom';

function Home(props) {
    // console.log("here in home");
    let width, height;
    width = window.innerWidth;
    height = window.innerHeight;
    
    const [showOnboarding, setShowOnboarding] = useState(false);
    const [buttonText, setButtonText] = useState("Hide");
    const [homeStats, setHomeStats] = useState("Your Average Brier Score");
    const [subtitle, setSubtitle] = useState("0 = Highest, 2 = Lowest");
    const [showModal, setShowModal] = useState(false);
    const [showClosedProblemModal, setShowClosedProblemModal] = useState(props.user.numberOfClosedForecasts > 0 ? true : false);
    const [modalContent, setModalContent] = useState("");
    const [userObj, setUserObj] = useState(props.user);
    const [onboardingClassName, setOnboardingClassName] = useState("onboarding-div-closed");
    const [currentAvgBrier, setCurrentAvgBrier] = useState(0);
    // const [userMarkets, setUserMarkets] = useState([]);
    // const [userOnboarding, setUserOnboarding] = useState({});

    const onboardingButtonClick = (showOnboarding, buttonText) => {
        setShowOnboarding(!showOnboarding);
        buttonText === "Hide" ? setButtonText("Show") : setButtonText("Hide");
    };

    useEffect(() => {
        if (localStorage.getItem("firstVisit") === "true") {
            setShowModal(true);
            const welcomeString = "Welcome to Fantasy Forecast! The survey can be found by clicking on the 'Survey' tab at the top of the screen (or from the dropdown menu in the top-left if you're on a mobile device). If this is your first time here, we recommend checking out the Onboarding menu on the right (or down below if you're on mobile) for ideas on how to get started with the site - have fun!";
            setModalContent(welcomeString);
            localStorage.setItem("firstVisit", false);
        };
        // if (props.user.numberOfClosedForecasts === undefined) {
            // getClosedForecastCount(localStorage.getItem("username") || props.username);
            // Version without contacting server (use props instead) - was having issues, defined props.user as [object Object], maybe as it 
            // was from page load (like refreshing) rather than from login, where App.js sets the value?
            // So for now, keep previous version but update App.js userObj again to be sure
            getClosedForecastCount(props.userBrierScores, props.userClosedForecastCount);
        // };
    // }, [props.user.numberOfClosedForecasts, props.username]);
    }, [props.user, props.userClosedForecastCount]);

    const getClosedForecastCount = async (userBrierScores, cfc) => {
        try {
            // const userDocument = await axios.get(`https://fantasy-forecast-politics.herokuapp.com/users/${username}`);
            // if (userDocument.data[0].numberOfClosedForecasts > 0) {
            //     setShowClosedProblemModal(true);
            // };
            // let avgBrier = 0;
            // for (let i = 0; i < userDocument.data[0].brierScores.length; i++) {
            //     avgBrier += userDocument.data[0].brierScores[i].brierScore;
            // };
            // avgBrier = avgBrier / userDocument.data[0].brierScores.length;
            // setCurrentAvgBrier(isNaN(avgBrier.toFixed(2)) ? 0 : avgBrier.toFixed(2));
            // setUserObj(userDocument.data[0]);
            // setUserMarkets(userDocument.data[0].markets);
            // setUserOnboarding(userDocument.data[0].onboarding);
            // props.setUserObject(userDocument.data[0]);

            // Serverless version
console.log("DEBUGGING");
console.log(userBrierScores);
            if (cfc > 0) {
                setShowClosedProblemModal(true);
            };
            let avgBrier = 0;
            for (let i = 0; i < userBrierScores.length; i++) {
                avgBrier += userBrierScores[i].brierScore;
            };
            avgBrier = avgBrier / userBrierScores.length;
            setCurrentAvgBrier(isNaN(avgBrier.toFixed(2)) ? 0 : avgBrier.toFixed(2));
            setUserObj(props.user);
        } catch (error) {
            console.error("Error in getClosedForecastCount");
            console.error(error);
        }
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
                <p>This is the home page for Fantasy Forecast. Use this as a central hub for 
                    navigating the site! Check out the news feed to see the latest stories that
                    your fellow forecasters have shared, or use any of the shortcuts to visit the 
                    forecasting, learn, and profile pages or the leaderboards! (W:{width} H:{height})
                </p>
            </div>
            <Modal show={showModal} handleClose={() => setShowModal(false)}>
                <p>{modalContent}</p>
            </Modal>
            {props.userClosedForecastCount > 0 &&
                <ClosedProblemModal 
                    show={showClosedProblemModal}
                    setShowClosedProblemModal={setShowClosedProblemModal}
                    // userObj={userObj === undefined ? props.user : userObj}>
                    userClosedForecastCount={props.userClosedForecastCount}
                    username={props.username}
                    userBrierScores={props.userBrierScores}>
                </ClosedProblemModal>
            } 
            {/* <button type="button" onClick={() => setShowModal(true)}>
                Open
            </button> */}
            <div className="home-page-div">
                <div className="home-page-grid">
                    <div className="home-page-news-feed">
                        <HomeNewsFeed 
                            username={props.username} 
                            // user={props.user}
                            // Trying this one as the getClosed function in UE updates the userObj state variable
                            userObj={props.userObj}
                            userMarkets={props.userMarkets}
                            handleFirstPost={setShowModal} 
                            handleFirstPostModalContent={setModalContent}
                        />
                    </div>
                    <div className="home-page-stats-div">
                        <HomeProfilePreview 
                            user={userObj}
                        />
                        <NewForecastsCallToAction username={props.username} /> 
                        <div className={onboardingClassName}>
                            <Onboarding 
                                // username={props.username}
                                // user={props.user}
                                // userObj={userObj}
                                userOnboarding={props.userOnboarding}
                                handleClick={() => onboardingButtonClick(showOnboarding, buttonText)} 
                                buttonText={buttonText} 
                                isHidden={showOnboarding}
                                setShowModal={setShowModal}
                                setModalContent={setModalContent}
                                setOnboardingClassName={setOnboardingClassName}
                            />
                        </div>
                        <HomeButtonSmall 
                            title={homeStats} 
                            subtitle={subtitle} 
                            handleClick={scrollHomeStats} 
                            username={props.username} 
                            user={props.user} 
                            forecasts={props.forecasts}
                            currentAvgBrier={currentAvgBrier}
                        />
                        <HomeButtonLarge 
                            title="Your Recent Stats"
                            user={props.user} 
                        /> 
                        <HomeChangeLogPreview />
                        <div className="report-any-issues-container">
                            <h2 className="home-button-small-title">Got any site issues, feedback, or praise?</h2>
                            <Link to="/report-any-issues" className="home-button-nav-button">Anonymously Submit Your Views Here</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Home;
