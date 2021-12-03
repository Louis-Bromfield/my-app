import React, { useState, useEffect } from 'react';
import './QuizResults.css';

function QuizResults(props) {
    const [formattedArray, setFormattedArray] = useState([]);
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
    }, [props.quizQuestions, props.quizResults]);

    return (
        <div className="quiz-results-container">
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
                        <div className="">
                            <h4 className="answer" style={{ color: color }}>- {item[0]}</h4>
                            <br />
                            <h3>You answered: {youSelected}</h3>
                            {youSelected === correctAnswer && <h3 style={{ color: "green" }}>This was correct!</h3>}
                            {youSelected !== correctAnswer && <h3>This was <span style={{ color: "red" }}>incorrect</span>, the correct answer was: {correctAnswer}</h3>}
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
                    };
                    return (
                        <div className="">
                        <h4 className="answer">- {item[0]}</h4>
                        <br />
                        <h3>You answered: {youSelected}</h3>
                        {youSelected === correctAnswer && <h3 style={{ color: "green" }}>This was correct!</h3>}
                        {youSelected !== correctAnswer && <h3>This was <span style={{ color: "red" }}>incorrect</span>, the correct answer was: {correctAnswer}</h3>}
                        <br />
                        <hr />
                        <br />
                        </div>
                    )
                }
                else if (!Array.isArray(item)) {
                    return (
                        <h3>{item}</h3>
                    )
                } else if (Array.isArray(item) && (item[1] === "correctly-selected" || item[1] === "incorrectly-not-selected")) {
                    return (
                        <h4 className="answer" style={{ color: "green" }}>- {item[0]}</h4>
                    )
                } else if (Array.isArray(item) && item[1] === "incorrectly-selected") {
                    return (
                        <h4 className="answer" style={{ color: "red" }}>-- {item[0]}</h4>
                    )
                } else if (Array.isArray(item) && item[1] === "correctly-not-selected") {
                    return (
                        <h4 className="answer">- {item[0]}</h4>
                    )
                } else {
                    return <div></div>
                }
            })}
            <div className="quiz-results-total">
                <h1>Total:</h1>
                <h2>You scored {numberOfCorrectAnswers} / {numberOfQuestions}</h2>
                {numberOfQuestions - numberOfCorrectAnswers === 0 && <h3>Congratulations, you got them all correct!</h3>}
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