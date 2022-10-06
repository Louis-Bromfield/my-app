import axios from 'axios';
import React, { useState, useEffect } from 'react';
import './QuizResults.css';
import Modal from '../../../components/Modal';

function QuizResults(props) {
    const [formattedArray, setFormattedArray] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [modalContent, setModalContent] = useState("");
    const [trophyAwarded, setTrophyAwarded] = useState(false);
    let youSelected = "";
    let correctAnswer = "";
    let numberOfCorrectAnswers = 0;
    let numberOfQuestions = 0;
    let nextTopic = props.nextTopic(props.topic);

    useEffect(() => {
        let questionsAndAnswers = [];
        for (let i = 0; i < props.quizQuestions.length; i++) {
            questionsAndAnswers.push(props.quizQuestions[i][1]);
            for (let j = 0; j < props.quizResults.length; j++) {
                if (props.quizResults[j][0][1] === i) {
                    questionsAndAnswers.push(props.quizResults[j]);
                };
            };
        };

        for (let i = 0; i < questionsAndAnswers.length; i++) {
            if (!Array.isArray(questionsAndAnswers[i])) {
                setFormattedArray(formattedArray => ([...formattedArray, questionsAndAnswers[i]]));
            } else if (Array.isArray(questionsAndAnswers[i])) {
                setFormattedArray(formattedArray => ([...formattedArray, [questionsAndAnswers[i][0][0], questionsAndAnswers[i][1]]]));
            };
        };
        console.log(formattedArray);
    }, [props.quizQuestions, props.quizResults]);

    // useEffect(() => {
    //     console.log("2nd QR UE");
    //     if (numberOfCorrectAnswers > 0 && numberOfQuestions > 0 && numberOfCorrectAnswers === numberOfQuestions) {
    //         console.log("yes here");
    //         awardTrophy(props.username);
    //     }
    // }, [numberOfCorrectAnswers, numberOfQuestions]);

    const awardTrophy = async (numberOfQuestions, numberOfCorrectAnswers, username) => {
        console.log("in awardTrophy");
        if ((trophyAwarded === false) && (numberOfCorrectAnswers > 0 && numberOfQuestions > 0 && numberOfCorrectAnswers === numberOfQuestions)) {
            console.log("in awardTrophy passed condition");
            try {
                const user = await axios.get(`https://fantasy-forecast-politics.herokuapp.com/users/${username}`);
                console.log("+++++++++++++++++++++++++++++++++++++++");
                console.log(user);
                for (let i = 0; i < user.data[0].trophies.length; i++) {
                    if (user.data[0].trophies[i].trophyText === "Perfection" && user.data[0].trophies[i].obtained === false) {
                        setTrophyAwarded(true);
                        user.data[0].trophies[i].obtained = true;
                        setShowModal(true);
                        setModalContent("You just unlocked the Perfection trophy! Trophies can be found on your profile page in the My Trophies section.")
                        await axios.patch(`https://fantasy-forecast-politics.herokuapp.com/users/${username}`, {
                            trophies: user.data[0].trophies
                        });
                        break;
                    };
                }; 
                setTrophyAwarded(true);
            } catch (err) {
                console.error("Error in QuizResults > awardTrophy");
                console.err(err);
            };
        };
    };

    return (
        <div className="quiz-results-container">
            <Modal show={showModal} handleClose={() => setShowModal(false)}>
                <p>{modalContent}</p>
            </Modal>
            <h2>Quiz Results</h2>
            <hr />
            {formattedArray.map((item, index) => {
                if (Array.isArray(item) && (item[1] === "correctly-selected" || item[1] === "incorrectly-selected")) {
                    youSelected = item[0];
                };
                if (Array.isArray(item) && (item[1] === "correctly-selected" || item[1] === "incorrectly-not-selected")) {
                    correctAnswer = item[0];
                };
                if (!Array.isArray(formattedArray[index+1])) {
                    numberOfQuestions++;
                    if (youSelected === correctAnswer) {
                        numberOfCorrectAnswers++;
                        if (index+1 === formattedArray.length) {
                            awardTrophy(numberOfQuestions, numberOfCorrectAnswers, props.username);
                        };
                    };
                    let color;
                    switch(item[1]) {
                        case("correctly-selected"):
                            color = "green";
                            break;
                        case("incorrectly-selected"):
                            color = "red";
                            break;
                        case("incorrectly-not-selected"):
                            color = "green";
                            break;
                        case("correctly-not-selected"):
                            color = "black";
                            break;
                        default:
                            color = "black";
                            break;
                    }
                    return (
                        <div key={item} className="">
                            <h4 className="answer" style={{ color: color }}>- {item[0]}</h4>
                            <br />
                            <h3 key={item}>You answered: {youSelected}</h3>
                            {youSelected === correctAnswer && <h3 style={{ color: "green" }}>This was correct!</h3>}
                            {youSelected !== correctAnswer && <h3 style={{ color: "red" }}>This was incorrect, the correct answer was: {correctAnswer}</h3>}
                            <br />
                            <hr />
                            <br />
                        </div>
                    )
                }
                if (!Array.isArray(formattedArray[index+1])) {
                    numberOfQuestions++;
                    if (youSelected === correctAnswer) {
                        numberOfCorrectAnswers++;
                        if (index+1 === formattedArray.length) {
                            awardTrophy(numberOfQuestions, numberOfCorrectAnswers, props.username);
                        };
                    };
                    return (
                        <div key={item} className="">
                            <h4 className="answer">- {item[0]}</h4>
                            <br />
                            <h3>You answered: {youSelected}</h3>
                            {youSelected === correctAnswer && <h3 style={{ color: "green" }}>This was correct!</h3>}
                            {youSelected !== correctAnswer && <h3 style={{ color: "red" }}>This was incorrect, the correct answer was: {correctAnswer}</h3>}
                            <br />
                            <hr />
                            <br />
                        </div>
                    )
                }
                else if (!Array.isArray(item)) {
                    return (
                        <h3 key={item}>{item}</h3>
                    )
                } else if (Array.isArray(item) && (item[1] === "correctly-selected" || item[1] === "incorrectly-not-selected")) {
                    return (
                        <h4 key={item} className="answer" style={{ color: "green" }}>- {item[0]}</h4>
                    )
                } else if (Array.isArray(item) && item[1] === "incorrectly-selected") {
                    return (
                        <h4 key={item} className="answer" style={{ color: "red" }}>-- {item[0]}</h4>
                    )
                } else if (Array.isArray(item) && item[1] === "correctly-not-selected") {
                    return (
                        <h4 key={item} className="answer">- {item[0]}</h4>
                    )
                } else {
                    return <div key={item}></div>
                }
            })}
            <div className="quiz-results-total">
                <h1>Total: {numberOfCorrectAnswers} / {numberOfQuestions}</h1>
                {/* <h2>You scored {numberOfCorrectAnswers} / {numberOfQuestions}</h2> */}
                {numberOfQuestions - numberOfCorrectAnswers === 0 && <h3>Congratulations, you got them all correct! If this is the first time this has happened, you'll have unlocked the Perfection trophy!</h3>}
                {numberOfQuestions - numberOfCorrectAnswers === 1 && <h4>An impressive score, but not quite all correct. Feel free to check out the topic content by either re-selecting it from the left-hand menu or the button below, and you always have unlimited attempts at the quiz to test yourself!</h4>}
                {numberOfQuestions - numberOfCorrectAnswers > 1 && <h4>Don't worry if you didn't get all the answers, you have unlimited access to and unlimited attempts at this quiz!</h4>}
            </div>
            <br />
            <div className="quiz-resultsbutton-container">
                <div className="button-container-title">
                    <h3>Ready for more?</h3>
                </div>
                <div className="quiz-results-button-container-buttons">
                    <button className="quiz-to-topic-btn" onClick={() => props.changeLearnPage("info", props.topic)}>Back to Topic Content</button>
                    {/* replace props.topic with props.nextTopic --> make array in Topic.js and use indexes */}
                    <button className="quiz-to-topic-btn" onClick={() => props.changeLearnPage("info", nextTopic)}>New Topic: {nextTopic}</button>
                </div>
            </div>
        </div>
    )
}

export default QuizResults;