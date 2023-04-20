import React, { useState } from 'react'
import './Learn.css';
import TopicsMenu from './LearnComponents/TopicsMenu';
import Topic from './LearnComponents/Topic';
import Modal from '../../components/Modal';


function Learn(props) {
    const [topic, setTopic] = useState("Fantasy Forecast Points");
    const [content, setContent] = useState("info");
    const topicsArray = ["Fantasy Forecast Points", "Brier Scores", "The Good Judgment Project", "Superforecasters"];
    const [showModal, setShowModal] = useState(false);
    const [modalContent, setModalContent] = useState("");

    const changeTopic = (selectedTopic) => {
        setTopic(selectedTopic);
        window.scrollTo(0, 0);
        setContent("info");
    };

    const changeLearnPage = (content, topic) => {
        setContent(content);
        setTopic(topic);
        window.scrollTo(0, 0);
    };

    const getNextTopic = (topic) => {
        if (topicsArray.indexOf(topic) + 1 === topicsArray.length) {
            return topicsArray[0];
        } else {
            return topicsArray[topicsArray.indexOf(topic)+1];
        };
    };

    return (
        <div className="learn">
            <Modal show={showModal} handleClose={() => setShowModal(false)}>
                <p>{modalContent}</p>
            </Modal>
            <h1>Learn</h1>
            <p>Welcome to the Learn page. Here you'll find a selection of topics that relate to political forecasting. 
                Brier Scores will tell you about how we assess forecast accuracy; The Good Judgment Project is a 
                pioneering research endeavour that provides a profound understanding of forecasting in action, as 
                well as tips on how to improve, and Superforecasters imparts lessons on the very best in the business. 
                Each topic also has a quiz, which you can attempt <b>an unlimited number of times.</b>
            </p>
            <div className="learn-grid">
                <div className="topic-list">
                    <TopicsMenu 
                        topicsArray={topicsArray} 
                        handleClick={changeTopic} 
                        topic={topic} 
                    />
                </div>
                <div className="topic-pane">
                    <Topic 
                        title={topic} 
                        paneContent={content} 
                        topic={topic} 
                        changeLearnPage={changeLearnPage} 
                        nextTopic={() => getNextTopic(topic)}
                        username={props.username} 
                        handleQuizCompletion={setShowModal}
                        handleQuizCompletionModalContent={setModalContent}
                    />
                </div>
            </div>
        </div>
    )
}

export default Learn;