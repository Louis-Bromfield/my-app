import React from 'react';
import './Questions.css';
import { FakeCalibrationQuestions } from './FakeCalibrationQuestions.js';
import HistoricForecast from './HistoricForecast';

function Questions(props) {
    return (
        <div>
            {/* Begin - if Cali is complete add a page*/}
            {props.toRender === 0 &&
            <div>
                <button className="begin-calibration-btn" onClick={() => props.toIncreaseRender(1)}><h1>Begin Calibration</h1></button>
            </div>
            }
            {props.toRender === 1 &&
            <div className="calibration-intro">
                <h1 className="section-title">Calibration Intro</h1>
                <p>Welcome to the calibration page. Think of this as an introduction to forecasting and learning
                more about your own ability. The tabs in the menu above this text correspond to either a forecasting
                problem, of which there will be three, or a questionnaire.</p>                 
                <br />
                <h4>Forecast Process</h4>
                <p>In each forecast, you will be presented with an outcome that you need to predict. Your prediction will 
                take the form of a 0-100% certainty of the given outcome occurring. You will be shown relevant 
                information in phases. Firstly, you will be provided with some general contextual information, before 
                submitting your first prediction. You will then be provided with some data, and you can submit your next 
                prediction, before finally being presented with a news story, and you can submit your final prediction. 
                With three phases per forecast, you will submit 9 forecasts in total. Each forecast you submit is entirely
                your choice; if you feel the new information completely changes what you think will happen, feel free to
                update your prediction accordingly. If you feel the new information changes nothing, feel free to submit
                the same prediction again - the choice of what you submit from 0-100% is entirely up to you.</p>
                <br />
                <h4>Questionnaire</h4>
                <p>Following the final forecast, you will be asked 17 questions to help Fantasy Forecast learn more about
                your forecasting technique and style. It's completely normal if you don't think of yourself as having
                a forecasting style, the point of the questionnaire and the calibration in general is to teach you about
                yourself, what you do well and what you might want to improve!</p>
                <br />
                <h4>Results</h4> 
                <p>Following the submission of the questionnaire, you will be given a breakdown of your responses to both 
                the forecasts and the questionnaire. You will be shown a chart that compares your attributes to the 
                global player base, a full breakdown of what all these scores mean and visualisations of how well you 
                did with your forecasts!</p>
                <br />
                <p>Don't worry, this is all private. Nobody will be able to see how you did in the calibration, or any of 
                your responses to any of the questions. The calibration is here to help you learn about forecasting and
                yourself.
                </p>
                <button className="begin-calibration-btn" onClick={() => props.toIncreaseRender(1)}>Begin Calibration</button>
            </div>
            }
            {/* Pass in forecast specific info to each component as props */}
            {/* Forecast 1 */}
            {props.toRender === 2 &&
            <div>
                <HistoricForecast forecastNum={props.toRender} />
            </div>
            }
            {/* Forecast 2 */}
            {props.toRender === 3 &&
            <div>
                <HistoricForecast forecastNum={props.toRender} />
            </div>
            }
            {/* Forecast 3 */}
            {props.toRender === 4 &&
            <div>
            <HistoricForecast forecastNum={props.toRender} />
        </div>
        }
            {/* Questions 1-5 */}
            {props.toRender === 5 &&
            <div>
                <h1 className="section-title">Questions 1-10</h1>
                <div className="panel-div">
                    <div className="question-div">
                        <h3 className="introductory-statement">For each statement, select whether you agree or disagree.</h3>
                        {FakeCalibrationQuestions[0].map((item, index) => {
                            return (
                            <div className="calibration-question">
                                <h4>{item}</h4>
                                <div className="radio-responses">
                                    <input type="radio" id={index} name={index} value={index} className="agree-btn" />
                                    <label htmlFor="agree1">Agree</label>
                                    <br />
                                    <input type="radio" id={index} name={index} value={index} className="disagree-btn" />
                                    <label htmlFor="disagree1">Disagree</label>
                                    <br />
                                </div>
                            </div>
                            )
                        })}
                    </div>
                    <button type="submit" value="Next >" className="submit-btn" onClick={() => props.toIncreaseRender(1)}>Next</button>
                </div>
            </div>
            }
            {/* Questions 6-10 */}
            {props.toRender === 6 &&
            <div>
            <h1 className="section-title">Questions 11-17</h1>
                <div className="panel-div">
                    <div className="question-div">
                        <h3 className="introductory-statement">For each statement, select whether you agree or disagree.</h3>
                        {FakeCalibrationQuestions[1].map((item, index) => {
                            return (
                            <div className="calibration-question">
                                <h4>{item}</h4>
                                <div className="radio-responses">
                                    <input type="radio" id={index} name={index} value={index} className="agree-btn" />
                                    <label htmlFor="agree1">Agree</label>
                                    <br />
                                    <input type="radio" id={index} name={index} value={index} className="disagree-btn" />
                                    <label htmlFor="disagree1">Disagree</label>
                                    <br />
                                </div>
                            </div>
                            )
                        })}
                </div>
                {/* Should onClick act as a checkpoint? Save progress to DB so far? */}
                <button type="submit" className="submit-btn" onClick={() => props.toIncreaseRender(1)}>Next</button>
            </div>
        </div>
        }
    </div>
    )
}

export default Questions;
