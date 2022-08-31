import React, { useState } from 'react';
import axios from 'axios';
import './TopicQuiz.css';
import Modal from '../../../components/Modal';

function TopicQuiz(props) {
    const [quizMessage, setQuizMessage] = useState("");
    // const [selectedAnswers, setSelectedAnswers] = useState([]);
    const [showSubmit, setShowSubmit] = useState(false);
    const [selectedAnswersForMarking, setSelectedAnswersForMarking] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [modalContent, setModalContent] = useState("");
    let selectedAnswers = [];

    const verifyAndSubmit = async (username) => {
        if (username === "Guest") {
            setShowModal(true);
            setModalContent("You must be logged into your own account to submit a quiz response.");
            return;
        } else {
            // persistQuizCompletionToDBAndUpdateOnboarding(username, props.topic);
            const correctAnswers = checkAnswers();
            props.updateQuizResults(correctAnswers);
            if (correctAnswers !== "FAIL") {
                await persistQuizCompletionToDBAndUpdateOnboarding(username, props.topic);
                props.changeLearnPage("loading", props.topic)
                setTimeout(() => {
                    props.changeLearnPage("results", props.topic);
                }, 2500);
            };
        };
    };

    // const persistQuizCompletionToDB = async (username, topic) => {
    //     try {
    //         if (topic === "Brier Scores") {
    //             await axios.patch(`https://fantasy-forecast-politics.herokuapp.com/learnQuizzes/${username}`, {
    //                 brierComplete: true
    //             });
                
    //         } else if (topic === "The Good Judgment Project") {
    //             await axios.patch(`https://fantasy-forecast-politics.herokuapp.com/learnQuizzes/${username}`, {
    //                 gjpComplete: true
    //             });
    //         } else if (topic === "Superforecasters") {
    //             await axios.patch(`https://fantasy-forecast-politics.herokuapp.com/learnQuizzes/${username}`, {
    //                 superforecastersComplete: true
    //             });
    //         };
    //         updateOnboarding(username);
    //     } catch (error) {
    //         console.error(error);
    //     };
    // };

    const persistQuizCompletionToDBAndUpdateOnboarding = async (username, topic) => {
        try {
            // Try to redo this so that we don't need to do the GET first 
            const userDocument = await axios.get(`https://fantasy-forecast-politics.herokuapp.com/users/${username}`);
            if (userDocument.data[0].onboarding.completeALearnQuiz === true) {
                userDocument.data[0].fantasyForecastPoints = userDocument.data[0].fantasyForecastPoints + 5;
                if (topic === "Brier Scores") {
                    userDocument.data[0].learnQuizzes.brierComplete = true;
                } else if (topic === "The Good Judgment Project") {
                    userDocument.data[0].learnQuizzes.gjpComplete = true;
                } else if (topic === "Superforecasters") {
                    userDocument.data[0].learnQuizzes.superforecastersComplete = true;
                };
                const updatedLQS = userDocument.data[0].learnQuizzes;
                await axios.patch(`https://fantasy-forecast-politics.herokuapp.com/users/${username}`, 
                    { 
                        onboarding: userDocument.data[0].onboarding,
                        learnQuizzes: updatedLQS,
                        fantasyForecastPoints: userDocument.data[0].fantasyForecastPoints 
                    }
                );
                props.handleQuizCompletion(true);
                props.handleQuizCompletionModalContent("You just got 5 points for completing a quiz!");
            } else {
                userDocument.data[0].onboarding.completeALearnQuiz = true;
                userDocument.data[0].fantasyForecastPoints = userDocument.data[0].fantasyForecastPoints + 250;
                if (topic === "Brier Scores") {
                    userDocument.data[0].learnQuizzes.brierComplete = true;
                } else if (topic === "The Good Judgment Project") {
                    userDocument.data[0].learnQuizzes.gjpComplete = true;
                } else if (topic === "Superforecasters") {
                    userDocument.data[0].learnQuizzes.superforecastersComplete = true;
                };
                await axios.patch(`https://fantasy-forecast-politics.herokuapp.com/users/${username}`, 
                    { 
                        onboarding: userDocument.data[0].onboarding,
                        learnQuizzes: userDocument.data[0].learnQuizzes,
                        fantasyForecastPoints: userDocument.data[0].fantasyForecastPoints 
                    }
                );
                props.handleQuizCompletion(true);
                props.handleQuizCompletionModalContent("You just got 250 Fantasy Forecast Points for completing your first quiz! Completing quizzes will now return 5 points per quiz.");
            };
        } catch (error) {
            console.error(error);
        };
    };

    const checkAnswers = () => {
        // Calculate how many they got right and check they have selected enough answers
        console.log("////////////////");
        console.log(selectedAnswers);
        console.log("////////////////");
        console.log(selectedAnswersForMarking);
        let correctAnswers = [];
        let answers = [];
        let numberOfAnswers = 0;
        let numberOfExpectedAnswers = 0;
        for (let i = 0; i < selectedAnswersForMarking.length; i++) {
            for (let j = 0; j < selectedAnswersForMarking[i].length; j++) {
                answers.push(selectedAnswersForMarking[i][j][0]);
                // if (selectedAnswers[i][j][0][2] === true) {
                //     numberOfAnswers++;
                // };
            };
        };
        // for (let i = 0; i < props.quizAnswers.length; i++) {
        //     if (props.quizAnswers[i] === true) {
        //         numberOfExpectedAnswers++;
        //     }
        // }
        // // Check if the user has submitted enough answers
        // if (numberOfAnswers < numberOfExpectedAnswers) {
        //     setQuizMessage("You have not selected enough answers.");
        //     setTimeout(() => {
        //         setQuizMessage("");
        //     }, 3000);
        //     return "FAIL";
        // };
        // Check if their answers are correct
        for (let i = 0; i < answers.length; i++) {
            if (answers[i][2] === true && props.quizAnswers[i] === true) {
                correctAnswers.push([answers[i], "correctly-selected"]);
            }
            else if (answers[i][2] === false && props.quizAnswers[i] === false) {
                correctAnswers.push([answers[i], "correctly-not-selected"]);
            } 
            else if (answers[i][2] === true && props.quizAnswers[i] === false){
                correctAnswers.push([answers[i], "incorrectly-selected"]);
            }
            else if (answers[i][2] === false && props.quizAnswers[i] === true){
                correctAnswers.push([answers[i], "incorrectly-not-selected"]);
            };
        };
        return correctAnswers;
    };

    // There's surely a cleaner way of doing all this XD
    const toggleSelected = (selectedAnswer, index) => {
        const indexOfAnswer = selectedAnswers[index].indexOf(selectedAnswers[index].find(element => element[0][0] === selectedAnswer));

        // Add a check for when you click on a button you have already selected (stop it)
        if (selectedAnswers[index][indexOfAnswer][0][2] === true) return;

        // Switch the others in that radio group to false (prevent multiple answers for 1 question)
        for (let i = 0; i < selectedAnswers[index].length; i++) {
            if (selectedAnswers[index][i][0][2] === true) {
                selectedAnswers[index][i][0][2] = false;
            };
        };

        // Switch boolean to true:
        selectedAnswers[index][indexOfAnswer][0][2] = true;
        // setSelectedAnswersForMarking(selectedAnswers);
        console.log(selectedAnswers);
        
        // if (showSubmit === false) {
            let numOfAnswers = 0;
            for (let i = 0; i < selectedAnswers.length; i++) {
                for (let j = 0; j < selectedAnswers[i].length; j++) {
                    if (selectedAnswers[i][j][0][2] === true) {
                        numOfAnswers++;
                    };
                };
            };
            console.log(numOfAnswers);
            // setSelectedAnswersForMarking(selectedAnswers);
            if (numOfAnswers === props.quizQuestions.length) {
                setShowSubmit(true);
                setSelectedAnswersForMarking(selectedAnswers);
            };
        // };
    };

    return (
        <div className="topic-quiz">
            <Modal show={showModal} handleClose={() => setShowModal(false)}>
                <p>{modalContent}</p>
            </Modal>
            <h1 className="topic-title">{props.topic}</h1>
            {props.quizQuestions.map((item, index) => {
                selectedAnswers[index] = [];
                return (
                    <div className="question-answer-div" key={index}>
                        <h3 className="question">{item[1]}</h3>
                            {props.quizQuestions[index].map((newItem, newIndex) => {
                                newIndex = newIndex + 2;
                                if (newIndex < props.quizQuestions[index].length) {
                                    let radioName = index;
                                    // selectedAnswers = [...selectedAnswers, [props.quizQuestions[index][newIndex], radioName, false]];
                                    selectedAnswers[index].push([[props.quizQuestions[index][newIndex], radioName, false]]);
                                    return (
                                        <div className="answer-selection">
                                            {/* Add id/name */}
                                            <input 
                                                type="radio" 
                                                name={radioName}
                                                className="answer-checkbox"
                                                key={newIndex}
                                                onClick={() => toggleSelected(props.quizQuestions[index][newIndex], index)}
                                            />
                                            {/* Add label */}
                                            <h4>{props.quizQuestions[index][newIndex]}</h4>
                                        </div>
                                    )
                                } else {
                                    return null;
                                }
                            })}
                        <br />
                    </div>
                )
            })}
            {quizMessage !== "" && <h3 style={{ color: "red" }}>{quizMessage}</h3>}
            {showSubmit === true && <button className="submit-answers-btn" onClick={() => verifyAndSubmit(props.username)}>Submit Answers</button>}
        </div>
    )
}

export default TopicQuiz;