import React, { useState, useEffect } from 'react';
import './Home.css';
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
    }, []);

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
            <HomeHeader name={props.name} width={width} height={height}/>
            <Modal show={showModal} handleClose={() => setShowModal(false)}>
                <p>{modalContent}</p>
            </Modal>
            {props.user.numberOfClosedForecasts > 0 &&
                <ClosedProblemModal 
                    show={showClosedProblemModal}
                    setShowClosedProblemModal={setShowClosedProblemModal}
                    userObj={props.user}>
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
                        <div className="onboarding-div">
                            <Onboarding 
                                username={props.username}
                                handleClick={() => onboardingButtonClick(showOnboarding, buttonText)} 
                                buttonText={buttonText} 
                                isHidden={showOnboarding} 
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
