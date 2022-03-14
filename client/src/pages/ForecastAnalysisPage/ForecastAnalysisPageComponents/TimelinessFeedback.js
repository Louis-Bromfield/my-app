import React, { useState, useEffect } from 'react';

function TimelinessFeedback(props) {
    const [feedback, setFeedback] = useState("");

    const feedbackArr = [
        // High Accuracy + High Timeliness
        `Timeliness measures how early you started submitting forecasts for this problem. Well done on achieving a high score for this problem and for getting such a high score on timeliness. Our only advice is to keep this up! A core part of scoring well is submitting your forecasts early. Every prediction you submit is weighted by the duration it was your most recent prediction - the longer your forecast has been live the more it will score you - so submitting a prediction earlier means it will be live for more time! You've obviously got the hang of this judging by your score, so keep it up!`,
        // High Accuracy + Medium Timeliness
        `Timeliness measures how early you started submitting forecasts for this problem. Well done on getting a high score for the problem overall. It's worth noting, however, that you could've done even better by forecasting earlier than you did. Your Time Score is determined by your first prediction, but given that every forecast is weighted by how long it was your most recent prediction, submitting earlier also means that your predictions will be weighted by a larger amount. For example, say you only submitted one prediction on day 3 of a problem that's live for 10 days, that will be assessed for accuracy and then multiplied by 0.7 (representing 70% of the entire forecast window). If you submitted that same prediction on day 2 instead, it would've been weighted by 0.8 (representing 80% of the window). These timings can have a big difference on your final score!`,
        // High Accuracy + Low Timeliness
        `Timeliness measures how early you started submitting forecasts for this problem. Well done on getting a high score for the problem overall, but a clear area of improvement is your timeliness. By forecasting earlier, you not only score higher in this dimension, but you get a bigger boost to your overall score because every forecast will be weighted more generously. For example, say you only submitted one prediction on day 3 of a problem that's live for 10 days, that will be assessed for accuracy and then multiplied by 0.7 (representing 70% of the entire forecast window). If you submitted that same prediction on day 2 instead, it would've been weighted by 0.8 (representing 80% of the window). These timings can have a big difference on your final score!`,
        // Medium Accuracy + High Timeliness
        `Timeliness measures how early you started submitting forecasts for this problem. You scored well overall, and you did very well in terms of forecasting early. If you're looking to improve, consult the other two measures instead, as there's not a whole lot more you could've done here!`,
        // Medium Accuracy + Medium Timeliness
        `Timeliness measures how early you started submitting forecasts for this problem. You scored well overall, but your timeliness could be improved. To achieve a higher score in this dimension, and more significantly, a higher overall score for the problem (out of 110), submitting your first prediction sooner will make a big difference. Every forecast you submit is weighted by the duration it was your newest prediction for, so forecasting earlier will automatically make your predictions perform better, and could even help make up for less accurate forecasts.`,
        // Medium Accuracy + Low Timeliness
        `Timeliness measures how early you started submitting forecasts for this problem. You scored well overall, but timeliness is definitely an area to look at improving. Given how you scored in this dimension, it's worth trying to submit your first prediction as early as you can. Every forecast you submit is weighted by the duration it was your most recent prediction for, so by forecasting earlier, that leaves more time to weight your score by. Forecasting sooner should see an improvement in your overall score very quickly.`,
        // Low Accuracy + High Timeliness
        `Timeliness measures how early you started submitting forecasts for this problem. While you didn't score too well overall, your timeliness performance was great. Even though you haven't been the most accurate with your forecasting, at the very least you were early to it. Perhaps this might be an explanation of your performance, and that next time it may be worth spending a little bit more time thinking about your predictions.`,
        // Low Accuracy + Medium Timeliness
        `Timeliness measures how early you started submitting forecasts for this problem. You didn't score too well overall, but timeliness could help you do better next time. Next time, maybe it's worth submitting forecasts even earlier than you did for this one, and that'll result in some easy improvements. Look to the other two dimensions of Reactiveness and Confidence for further advice.`,
        // Low Accuracy + Low Timeliness
        `Timeliness measures how early you started submitting forecasts for this problem. You didn't score too well, and your timeliness score was also very low. If you want to improve, submitting your first prediction earlier will result in a solid gain in points for that problem. The Reactiveness and Confidence sections above may provide further insight as to how you can improve your scores for next time.`,
    ];

    useEffect(() => {
        console.log(props);
        if (props.finalScore >= 90) {
            if (props.timelinessScore >= 70) {
                // High Accuracy + High Timeliness
                setFeedback(feedbackArr[0]);
            } else if (props.timelinessScore < 70 && props.timelinessScore > 30) {
                // High Accuracy + Medium Timeliness
                setFeedback(feedbackArr[1]);
            } else {
                // High Accuracy + Low Timeliness
                setFeedback(feedbackArr[2]);
            };
        } else if (props.finalScore < 90 && props.finalScore >= 70) {
            if (props.timelinessScore >= 70) {
                // Medium Accuracy + High Timeliness
                setFeedback(feedbackArr[3]);
            } else if (props.timelinessScore < 70 && props.timelinessScore > 30) {
                // Medium Accuracy + Medium Timeliness
                setFeedback(feedbackArr[4]);
            } else {
                // Medium Accuracy + Low Timeliness
                setFeedback(feedbackArr[5]);
            };
        } else {
            if (props.timelinessScore >= 70) {
                // Low Accuracy + High Timeliness
                setFeedback(feedbackArr[6]);
            } else if (props.timelinessScore < 70 && props.timelinessScore > 30) {
                // Low Accuracy + Medium Timeliness
                setFeedback(feedbackArr[7]);
            } else {
                // Low Accuracy + Low Timeliness
                setFeedback(feedbackArr[8]);
            };
        };
    }, [props.timelinessScore]);


    return (
        <p className="explanatory-paragraph">{feedback}</p>
    )
}

export default TimelinessFeedback;