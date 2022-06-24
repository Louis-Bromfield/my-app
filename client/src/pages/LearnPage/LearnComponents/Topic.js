import React, { useState, useEffect } from 'react';
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
    const [youtubeLink, setYoutubeLink] = useState("");
    const [text, setText] = useState("");
    const [quizQuestions, setQuizQuestions] = useState([]);
    const [quizAnswers, setQuizAnswers] = useState([]);
    // let youtubeLink;
    // let text;

    useEffect(() => {
        console.log("Topic UE");
        switch(props.title) {
            case("Fantasy Forecast Points"):
                //setYoutubeLink(
                setText(TopicContent[0]);
                break;
            case("Brier Scores"):
                setYoutubeLink(<iframe 
                    className="youtube-iframe" 
                    src="https://www.youtube.com/embed/9W7rnmEWVmQ" 
                    title="YouTube video player" 
                    frameBorder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowFullScreen>
                </iframe>);
                setText(TopicContent[1]);
                break;
            case("The Good Judgment Project"):
                setYoutubeLink(<iframe 
                    className="youtube-iframe" 
                    src="https://www.youtube.com/embed/uJb63rMNrbE" 
                    title="YouTube video player" 
                    frameBorder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowFullScreen>
                </iframe>);
                setText(TopicContent[2]);
                break;
            case("Superforecasters"):
                setYoutubeLink(<iframe 
                    className="youtube-iframe" 
                    src="https://www.youtube.com/embed/wgybyx5cxEc" 
                    title="YouTube video player" 
                    frameBorder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowFullScreen>
                </iframe>);
                setText(TopicContent[3]);
                break;
            default:
                setYoutubeLink(<iframe 
                    className="youtube-iframe" 
                    src="https://www.youtube.com/embed/0XaBygN-FZ8" 
                    title="YouTube video player" 
                    frameBorder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowFullScreen>
                </iframe>);
                setText([]);
                break;
        };

        // let quizQuestions;
        // let quizAnswers;

        switch(props.title) {
            case("Fantasy Forecast Points"):
                setQuizQuestions(QuizQuestions[0]);
                setQuizAnswers(QuizAnswers[0].correctAnswers);
            break;
            case("Brier Scores"):
                setQuizQuestions(QuizQuestions[1]);
                setQuizAnswers(QuizAnswers[1].correctAnswers);
            break;
            case("The Good Judgment Project"):
                setQuizQuestions(QuizQuestions[2]);
                setQuizAnswers(QuizAnswers[2].correctAnswers);
            break;
            case("Superforecasters"):
                setQuizQuestions(QuizQuestions[3]);
                setQuizAnswers(QuizAnswers[3].correctAnswers);
            break;
            default:
                setQuizQuestions(QuizQuestions[0]);
                setQuizAnswers(QuizAnswers[0].correctAnswers);
        };
    }, [props.title]);

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
                {props.title !== "Fantasy Forecast Points" && <div className="topic-youtube-video">{youtubeLink}</div>}
                <div className="topic-text">{text}</div>
            </div>
            }
            {props.paneContent === "quiz" && 
            <div className="topic">
                <TopicQuiz 
                    topic={props.title} 
                    quizQuestions={quizQuestions} 
                    quizAnswers={quizAnswers} 
                    setQuizAnswers={setQuizAnswers}
                    changeLearnPage={props.changeLearnPage} 
                    updateQuizResults={updateQuizResults} 
                    username={props.username}
                    handleQuizCompletion={props.handleQuizCompletion}
                    handleQuizCompletionModalContent={props.handleQuizCompletionModalContent}
                />
            </div>}
            {props.title !== "Fantasy Forecast Points" && <div className="btn-div">
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