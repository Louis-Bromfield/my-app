import React, { useState, useEffect } from 'react';
import './Home.css';
import axios from 'axios';
import HomeHeader from './HomeSectionButtons/HomeHeader';
import HomeNewsFeed from './HomeSectionButtons/HomeNewsFeed';
import HomeButtonSmall from './HomeSectionButtons/HomeButtonSmall';
import HomeButtonLarge from './HomeSectionButtons/HomeButtonLarge';
import NewForecastsCallToAction from './HomeSectionButtons/NewForecastsCallToAction';
import Onboarding from './HomeSectionButtons/Onboarding';
import Modal from '../../components/Modal';
import ClosedProblemModal from '../../components/ClosedProblemModal';

function Home(props) {
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

    const onboardingButtonClick = (showOnboarding, buttonText) => {
        setShowOnboarding(!showOnboarding);
        buttonText === "Hide" ? setButtonText("Show") : setButtonText("Hide");
    };

    useEffect(() => {
        if (localStorage.getItem("firstVisit") === "true") {
            setShowModal(true);
            const welcomeString = "Welcome to Fantasy Forecast! Your home page might look a bit empty, so we recommend heading over to the Leaderboards page and joining the markets that look interesting to you! The Onboarding menu on the right will give you ideas as to how to get acquainted with the site - have fun!";
            setModalContent(welcomeString);
            localStorage.setItem("firstVisit", false);
        };
        if (props.user.numberOfClosedForecasts === undefined) {
            console.log("yes");
            getClosedForecastCount(localStorage.getItem("username") || props.username);
        };
    }, [props.user.numberOfClosedForecasts, props.username]);

    const getClosedForecastCount = async (username) => {
        try {
            const userDocument = await axios.get(`https://fantasy-forecast-politics.herokuapp.com/users/${username}`);
            console.log(userDocument.data[0]);
            console.log(userDocument.data[0].numberOfClosedForecasts > 0 ? true : false)
            if (userDocument.data[0].numberOfClosedForecasts > 0) {
                setShowClosedProblemModal(true);
            };
            setUserObj(userDocument.data[0]);
        } catch (error) {
            console.log("Error in getClosedForecastCount");
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
            <HomeHeader username={props.username} width={width} height={height}/>
            <Modal show={showModal} handleClose={() => setShowModal(false)}>
                <p>{modalContent}</p>
            </Modal>
            {(props.user.numberOfClosedForecasts > 0 || userObj.numberOfClosedForecasts > 0) &&
                <ClosedProblemModal 
                    show={showClosedProblemModal}
                    setShowClosedProblemModal={setShowClosedProblemModal}
                    userObj={userObj === undefined ? props.user : userObj}>
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
                            handleFirstPost={setShowModal} 
                            handleFirstPostModalContent={setModalContent}
                        />
                    </div>
                    <div className="home-page-stats-div">
                        <NewForecastsCallToAction username={props.username} /> 
                        <div className={onboardingClassName}>
                            <Onboarding 
                                username={props.username}
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
                        />
                        <HomeButtonLarge 
                            title="Your Recent Stats"
                            user={props.user} 
                        /> 
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Home;
