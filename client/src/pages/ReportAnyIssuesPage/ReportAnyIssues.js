import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import './ReportAnyIssues.css';
import axios from 'axios';

function ReportAnyIssues() {
    const history = useHistory();
    const [reportType, setReportType] = useState("General Feedback");
    const [reportComments, setReportComments] = useState("");
    const [reportResponse, setReportResponse] = useState("");
    const [reportResponseColour, setReportResponseColour] = useState("");
    const [feedbackArr, setFeedbackArr] = useState([]);
    const [feedbackMessage, setFeedbackMessage] = useState("");
    const [newFeedback, setNewFeedback] = useState({ reportType: "", reportDate: "", reportComments: "", reportResponse: ""});

    const submitComments = async (type, comments) => {
        if (reportComments === "" || /^\s*$/.test(reportComments)) {
            setReportResponseColour("red");
            setReportResponse("Please enter a comment in the field above.");
            return;
        };
        try {
            setReportResponse("");
            // const res = await axios.post('https://fantasy-forecast-politics.herokuapp.com/helpers/submitFeedback', {
            const res = await axios.post(`${process.env.REACT_APP_API_CALL_HELP}/submitFeedback`, {
                reportType: type,
                reportComments: comments,
                reportReponse: ""
            });
            if (res.status === 200) {
                setReportResponseColour("green");
                setReportResponse("Your feedback has been submitted! Thank you for your input :)")
                setNewFeedback({
                    reportType: type,
                    reportDate: new Date().toString(),
                    reportComments: comments,
                    reportResponse: ""
                });
            } else {
                setReportResponseColour("red");
                setReportResponse("There was an error (not your fault!). Please try again later");
            };
        } catch (error) {
            console.error("Error in ReportAnyIssues > submitComments");
            console.error(error);
        };
    };

    const getAllFeedback = async () => {
        try {
            // const allFeedback = await axios.get('https://fantasy-forecast-politics.herokuapp.com/helpers/getAllFeedback/responses');
            const allFeedback = await axios.get(`${process.env.REACT_APP_API_CALL_HELP}/getAllFeedback/responses`);
            console.log(allFeedback);
            if (allFeedback.data.retrieveSuccess === false) {
                setFeedbackMessage("The feedback submissions are not available at the moment. Please try again later.");
            } else if (allFeedback.data.retrieveSuccess === true) {
                setFeedbackMessage("Retrieval success");
                console.log(allFeedback.data.allPosts);
                setFeedbackArr(allFeedback.data.allPosts.reverse());
            };
        } catch (err) {
            console.error("Error in getting all feedback");
            console.error(err);
            setFeedbackMessage("The feedback submissions are not available at the moment. Please try again later.");
        };
    };

    useEffect(() => {
        getAllFeedback();
        console.log("ReportAnyIssues UE");
    }, []);

    return (
        <div className="report-any-issues">
            <button 
                className="return-to-home-btn" 
                onClick={() => history.push("/home")}>
                    Return to Home
            </button>
            <h1>Fantasy Forecast Feedback Page</h1>
            <p>While a lot of time and care has gone into Fantasy Forecast, we're aware that it's never going to be perfect. That's why we created this page; to allow you to submit any feedback you have, positive or negative, constructive criticism, or to help make us aware of any bugs or errors you've encountered through your use of the site. All feedback is anonymous, so speak your mind and hopefully we can improve Fantasy Forecast for everyone, together!</p>
                <form className="report-form">
                    <fieldset className="report-fieldset">
                        <h2 style={{ color: "#404d72" }}>Submit Your Feedback Anonymously Here:</h2>
                        <label htmlFor="feedback-type">Feedback Type:</label>
                        <select 
                            name="feedback-type" 
                            id="feedback-type" 
                            className="report-select-field"
                            onChange={(e) => { setReportType(e.target.value); setReportResponse("")}}>
                                <option value="General Feedback">General Feedback</option>
                                <option value="Suggestion">Suggestion</option>
                                <option value="Report a bug/error">Report a bug/error</option>
                        </select>
                        <label htmlFor="report-comments-field">Comments</label>
                        <input type="textarea" onChange={(e) => { setReportComments(e.target.value); setReportResponse("") }} className="report-comments-field" />
                        <input 
                            type="submit" 
                            className="report-submit-btn" 
                            onClick={(e) => {
                                e.preventDefault(); 
                                submitComments(reportType, reportComments)
                            }}/>
                    </fieldset>
                </form>
            <br />
            <h2 style={{ color: "#404d72" }}>All Feedback So Far</h2>
            <h3 style={{ color: reportResponseColour}}>{reportResponse}</h3>
            <div className="feedback-collection-container">
                {(feedbackMessage !== "" && feedbackMessage !== "Retrieval success") && <h4>feedbackMessage</h4>}
                {(feedbackMessage === "" || feedbackMessage === "Retrieval success") && 
                    <ul className="feedback-ul">
                        {(newFeedback !== {} && newFeedback.reportType !== "") && 
                            <li className="feedback-li">
                                <h3 style={{ color: "#404d72" }}>{newFeedback.reportComments}</h3>
                                <p><i>{newFeedback.reportType}</i> - {newFeedback.reportDate.slice(0, 15)} </p>
                                <br />
                                <p><b>Louis' Response:</b> {newFeedback.reportResponse}</p>
                            </li>
                        }
                        {feedbackArr.map((item, index) => {
                            return (
                                <li className="feedback-li">
                                    <h3 style={{ color: "#404d72" }}>{item.reportComments}</h3>
                                    <p><i>{item.reportType}</i> - {item.reportDate.slice(0, 15)} </p>
                                    <br />
                                    <p><b>Louis' Response:</b> {item.reportResponse}</p>
                                </li>
                            )
                        })}
                    </ul>
                }
            </div>
        </div>
    )
}

export default ReportAnyIssues;