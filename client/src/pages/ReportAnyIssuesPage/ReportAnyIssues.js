import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import './ReportAnyIssues.css';
import axios from 'axios';

function ReportAnyIssues() {
    const history = useHistory();
    const [reportType, setReportType] = useState("General Feedback");
    const [reportComments, setReportComments] = useState("");
    const [reportResponse, setReportResponse] = useState("");
    const [reportResponseColour, setReportResponseColour] = useState("");

    const submitComments = async (type, comments) => {
        if (reportComments === "") {
            setReportResponseColour("red");
            setReportResponse("Please enter a comment in the field above.");
            return;
        } else if (/^\s*$/.test(reportComments)) {
            setReportResponseColour("red");
            setReportResponse("Please enter text into the comment field above");
            return;
        };
        try {
            setReportResponse("");
            const res = await axios.post('https://fantasy-forecast-politics.herokuapp.com/helpers/submitFeedback', {
                reportType: type,
                reportComments: comments
            });
            if (res.status === 200) {
                setReportResponseColour("green");
                setReportResponse("Your feedback has been submitted! Thank you for your input :)")
            } else {
                setReportResponseColour("red");
                setReportResponse("There was an error (not your fault!). Please try again later");
            };
        } catch (error) {
            console.error("Error in ReportAnyIssues > submitComments");
            console.error(error);
        };
    }

    return (
        <div className="report-any-issues">
            <button 
                className="return-to-home-btn" 
                onClick={() => history.push("/")}>
                    Return to Home
            </button>
            <h1>Fantasy Forecast Feedback Page</h1>
            <p>While a lot of time and care has gone into Fantasy Forecast, we're aware that it's never going to be perfect. That's why we created this page; to allow you to submit any feedback you have, positive or negative, constructive criticism, or to help make us aware of any bugs or errors you've encountered through your use of the site. All feedback is anonymous so there is no way of tracing it back to you, so speak your mind and hopefully we can improve Fantasy Forecast for everyone, together!</p>
                <form className="report-form">
                    <fieldset className="report-fieldset">
                        <h2>Submit Your Feedback Anonymously Here:</h2>
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
                <h2 style={{ color: reportResponseColour}}>{reportResponse}</h2>
        </div>
    )
}

export default ReportAnyIssues;