import React, { useState, useEffect } from 'react';

function ConfidenceFeedback(props) {
    const [feedback, setFeedback] = useState("");
    console.log(props.confidenceScore);

    const feedbackArr = [
        // High Accuracy + High Confidence
        `Confidence measures how close your predictions were, on average, to 0% or 100%. High confidence has definitely helped you in achieving a high score for the problem overall. Be cautious in future forecasts, however, as a similarly high level of confidence when you're actually wrong can be quite costly and high confidence can be a sign of arrogance. In the case of this specific problem, however, you did really well and being accurate and confident in your predictions is a sign of a strong forecaster.`,
        // High Accuracy + Medium Confidence
        `Confidence measures how close your predictions were, on average, to 0% or 100%. Your great score for this particular problem can be in part attributed to your confidence in your predictions. This performance is a very positive reflection on your ability, although the confidence score might suggest that next time it could be worth pushing your predictions closer to 0% or 100%. There's a fine line between pushing your predictions to try and get the highest scores possible and damage control in case you're wrong, so it's worth thinking about as you move forward.`,
        // High Accuracy + Low Confidence
        `Confidence measures how close your predictions were, on average, to 0% or 100%. Quite paradoxically, you scored very well for the problem with low confidence. `,
        // Medium Accuracy + High Confidence
        `Confidence measures how close your predictions were, on average, to 0% or 100%. You performed well on this problem, and your confidence is very high. In terms of improving, it's possible that your performance (accuracy-wise) was hindered by some incorrect forecasts. If not, it's worth looking to the Reactiveness and Timeliness feedback sections above and below this one for more information.`,
        // Medium Accuracy + Medium Confidence
        `Confidence measures how close your predictions were, on average, to 0% or 100%. You performed well on this problem, but one way of improving your final score for this problem is by being more assertive with your predictions. There is a risk that by going closer to 0% or 100% you will have a worse final score if you're wrong, but there is also equal gains to be made if you're right.`,
        // Medium Accuracy + Low Confidence
        `Confidence measures how close your predictions were, on average, to 0% or 100%. While you performed well on this problem, your confidence was very low. Pushing your forecasts towards the extremes of 0% or 100% and taking a chance on your own forecasting ability may be fruitful for you, especially as you have performed well accuracy-wise.`,
        // Low Accuracy + High Confidence
        `Confidence measures how close your predictions were, on average, to 0% or 100%. Low accuracy combined with high confidence is a deadly combination in forecasting. This relationship is dangerous in that it can be a sign of arrogance - you forecasted the incorrect outcome and did so with a strong degree of certainty. While it's possible that you may have just been wrong on this one occasion, be careful with future forecasts and try to keep an open mind to the possibility that you're wrong. It's also possible that your forecasts were accurate but just submitted late on when you were nearing the closing of the problem. Given how forecasts are weighted by duration, late forecasts can score poorly even if they're accurate.`,
        // Low Accuracy + Medium Confidence
        `Confidence measures how close your predictions were, on average, to 0% or 100%. Your confidence score is not as low as it could be, but it's not as high either. If you want to improve your overall score for the problem, pushing your score further to the extremes of 0% or 100% may be a good choice. There's risk and reward that comes with this, but being closer to the right extreme will yield significant gains. It's also possible that your forecasts were accurate but just submitted late on when you were nearing the closing of the problem. Given how forecasts are weighted by duration, late forecasts can score poorly even if they're accurate.`,
        // Low Accuracy + Low Confidence
        `Confidence measures how close your predictions were, on average, to 0% or 100%. Having a low performance accuracy-wise and low confidence is an interesting mix-up. In terms of moving forward and trying to improve your scores from a confidence perspective, it's worth pushing yourself a bit more and forecasting closer to the extremes. There is risk and reward that comes with this in terms of being right or wrong respectively, but it could be a good starting place for improving your performance. It's also possible that your forecasts were accurate but just submitted late on when you were nearing the closing of the problem. Given how forecasts are weighted by duration, late forecasts can score poorly even if they're accurate.`,
    ];

    useEffect(() => {
        if (props.finalScore >= 90) {
            if (props.confidenceScore >= 70) {
                // High Accuracy + High Reactiveness
                setFeedback(feedbackArr[0]);
            } else if (props.confidenceScore < 70 && props.confidenceScore >= 30) {
                // High Accuracy + Medium Reactiveness
                setFeedback(feedbackArr[1]);
            } else {
                // High Accuracy + Low Reactiveness
                setFeedback(feedbackArr[2]);
            };
        } else if (props.finalScore < 90 && props.finalScore >= 70) {
            if (props.confidenceScore >= 70) {
                // Medium Accuracy + High Reactiveness
                setFeedback(feedbackArr[3]);
            } else if (props.confidenceScore < 70 && props.confidenceScore >= 30) {
                // Medium Accuracy + Medium Reactiveness
                setFeedback(feedbackArr[4]);
            } else {
                // Medium Accuracy + Low Reactiveness
                setFeedback(feedbackArr[5]);
            };
        } else {
            if (props.confidenceScore >= 70) {
                // Low Accuracy + High Reactiveness
                setFeedback(feedbackArr[6]);
            } else if (props.confidenceScore < 70 && props.confidenceScore >= 30) {
                // Low Accuracy + Medium Reactiveness
                setFeedback(feedbackArr[7]);
            } else {
                // Low Accuracy + Low Reactiveness
                setFeedback(feedbackArr[8]);
            };
        };
    }, [props.confidenceScore]);

    return (
        <p className="explanatory-paragraph">{feedback}</p>
    )
}

export default ConfidenceFeedback;