import React, { useState } from 'react';
import './Topic.css';
import ReactLoading from 'react-loading';
import PropTypes from 'prop-types';
import { TopicContent } from './TopicContent';
import TopicQuiz from './TopicQuiz';
import { QuizQuestions } from './QuizQuestions';
import { QuizAnswers } from './QuizAnswers';
import QuizResults from './QuizResults';

function Topic(props) {
    const [quizResults, setQuizResults] = useState();
    let youtubeLink;
    let text;

    switch(props.title) {
        case("Fantasy Forecast Points"):
            text = TopicContent[0];
        break;
        case("2024 US Presidential Election"):
            youtubeLink = <iframe 
                className="youtube-iframe" 
                src="https://www.youtube.com/watch?v=cRa07hTrfII" 
                title="YouTube video player" 
                frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen>
            </iframe>
            text = TopicContent[1];
        break;
        case("How Are Forecasts Scored?"):
            youtubeLink = <iframe 
                className="youtube-iframe" 
                src="https://www.youtube.com/embed/9W7rnmEWVmQ" 
                title="YouTube video player" 
                frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen>
            </iframe>
            text = TopicContent[2];
        break;
        case("The Good Judgment Project"):
            youtubeLink = <iframe 
                className="youtube-iframe" 
                src="https://www.youtube.com/embed/uJb63rMNrbE" 
                title="YouTube video player" 
                frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen>
            </iframe>
            text = TopicContent[3];
        break;
        case("Superforecasters"):
            youtubeLink = <iframe 
                className="youtube-iframe" 
                src="https://www.youtube.com/embed/wgybyx5cxEc" 
                title="YouTube video player" 
                frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen>
            </iframe>
            text = TopicContent[4];
        break;
        default:
            youtubeLink = <iframe 
                className="youtube-iframe" 
                src="https://www.youtube.com/embed/0XaBygN-FZ8" 
                title="YouTube video player" 
                frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen>
            </iframe>
            text = [];
            break;
    };

    let quizQuestions;
    let quizAnswers;

    switch(props.title) {
        case("Fantasy Forecast Points"):
            quizQuestions = QuizQuestions[0];
            quizAnswers = QuizAnswers[0].correctAnswers;
        break;
        case("Brier Scores"):
            quizQuestions = QuizQuestions[1];
            quizAnswers = QuizAnswers[1].correctAnswers;
        break;
        case("The Good Judgment Project"):
            quizQuestions = QuizQuestions[2];
            quizAnswers = QuizAnswers[2].correctAnswers;
        break;
        case("Superforecasters"):
            quizQuestions = QuizQuestions[3];
            quizAnswers = QuizAnswers[3].correctAnswers;
        break;
        default:
            quizQuestions = QuizQuestions[0];
            quizAnswers = QuizAnswers[0].correctAnswers;
    };

    const updateQuizResults = (newResults) => {
        setQuizResults(newResults);
    };

    return (
        <div className="topic-container">
            {props.paneContent === "loading" &&
                <div className="topic-loading">
                    <h2>Calculating your results...</h2>
                    <ReactLoading type="bars" color="#404d72" height="15%" width="15%"/>
                </div>
            }
            {props.paneContent === "info" && 
            <div className="topic">
                <h1 className="topic-title">{props.title}</h1>
                {(props.title !== "Fantasy Forecast Points" && props.title !== "Forecasting Teams") && <div className="topic-youtube-video">{youtubeLink}</div>}
                <div className="topic-text">{text}</div>
            </div>
            }
            {props.paneContent === "quiz" && 
                <div className="topic">
                    <TopicQuiz 
                        topic={props.title} 
                        quizQuestions={quizQuestions} 
                        quizAnswers={quizAnswers} 
                        changeLearnPage={props.changeLearnPage} 
                        updateQuizResults={updateQuizResults} 
                        username={props.username}
                        handleQuizCompletion={props.handleQuizCompletion}
                        handleQuizCompletionModalContent={props.handleQuizCompletionModalContent}
                    />
                </div>
            }
            {(props.title !== "Fantasy Forecast Points" && props.title !== "Forecasting Teams") && <div className="btn-div">
                {props.paneContent === "quiz" &&
                    <button className="quiz-to-topic-btn" onClick={() => props.changeLearnPage("info", props.title)}>Return to Topic</button>
                }
                {props.paneContent === "info" && 
                    <button className="topic-to-quiz-btn" onClick={() => props.changeLearnPage("quiz", props.title)}>Go to the Quiz</button>
                }
            </div>}
            {props.paneContent === "results" &&
                <div className="topic">
                    <QuizResults 
                        username={props.username}
                        topic={props.title} 
                        quizResults={quizResults} 
                        quizQuestions={quizQuestions} 
                        changeLearnPage={props.changeLearnPage} 
                        nextTopic={() => props.nextTopic(props.title)} />
                </div>
            }
        </div>
    )
}

export default Topic;

Topic.propTypes = {
    title: PropTypes.string.isRequired
};