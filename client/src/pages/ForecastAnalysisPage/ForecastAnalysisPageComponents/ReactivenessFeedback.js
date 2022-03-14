import React, { useState, useEffect } from 'react';

function ReactivenessFeedback(props) {
    const [feedback, setFeedback] = useState("");

    const feedbackArr = [
        // High Accuracy + High Reactiveness
        `Reactiveness measures how much you shift or move from forecast to forecast. You scored very highly on reactiveness. While your final overall score for this particular problem (${props.finalScore} / 110) was very impressive, this may not always be the case. Extreme fluctuation in predictions could be a sign of susceptibility to new information. It's worth thinking hard about how each major piece of news could really play out before committing to a new prediction. Research on System 1 and System 2 thinking may be of interest to you!`,
        // High Accuracy + Medium Reactiveness
        `Reactiveness measures how much you shift or move from forecast to forecast. You scored in the medium range for reactiveness, which suggests a notable, but perhaps not overly significant, degree of volatility to your predictions. While this may have yielded you with a very impressive final score (${props.finalScore / 110}), this is not guaranteed if you fluctuate a lot with your scores. It's entirely possible that real-world events necessitate fluctutation, however be wary of overthinking the impact of new information.`,
        // High Accuracy + Low Reactiveness
        `Reactiveness measures how much you shift or move from forecast to forecast. You scored very well overall (${props.finalScore} / 110), and you did so with low reactiveness. While this could be a sign of either a great deal of confidence in your forecasts or a rather stable problem that you were predicting, be careful that it's not a sign of arrogance. Having low reactiveness can deliver you the best scores if you're right, but if you're wrong, low reactiveness can suggest an inability to sufficently estimate the effect of new information or be a sign of close-mindedness.`,
        // Medium Accuracy + High Reactiveness
        `Reactiveness measures how much you shift or move from forecast to forecast. You performed decently in terms of your overall final score for the problem (${props.finalScore} / 110), however it's worth being cautious about high reactiveness. High reactiveness can be a sign of insecurity around your predictions or a tendency to over-estimate the significance of new information, and can push you away from the correct answer. Sometimes it can be worth thinking more about the new information before rushing to update your forecast.`,
        // Medium Accuracy + Medium Reactiveness
        `Reactiveness measures how much you shift or move from forecast to forecast. You performed decently in terms of your overall final score for the problem (${props.finalScore} / 110), and your reactiveness wasn't too high or too low. As you move on from this problem, it's worth thinking about how you can push your predictive ability to the higher scores. A lower degree of reactiveness may provide you with more consistency and demonstrate a greater ability to weigh new information, but it could also be a sign of arrogance if you're wrong. On the flip side, a high degree of reactiveness could be a sign of greater open-mindedness, as new information is influencing you, but it could also be a sign that you're rushing to process new information and update your forecasts accordingly. While you're currently not in major danger of either of those, they're very easy behaviours to take up when forecasting, so be careful!`,
        // Medium Accuracy + Low Reactiveness
        `Reactiveness measures how much you shift or move from forecast to forecast. You performed decently in terms of your overall final score for the problem (${props.finalScore} / 110), however it's worth being cautious about low reactiveness. While your forecasts have placed you in a decent scoring territory, it might be that low reactiveness was holding you back from an even better performance. Being introspective about your rationalisations for your forecasts may help you identify if you're perhaps being too arrogant, but in your case specifically given that you scored well it could be a sign of a lack of confidence in your predictions. Pushing yourself closer to 100 or 0 sooner with a consistent level of reactiveness could be the secret to better performance.`,
        // Low Accuracy + High Reactiveness
        `Reactiveness measures how much you shift or move from forecast to forecast. Unfortunately, you didn't score too well in this problem (${props.finalScore} / 110), and this could be partially attributed to your high reactiveness. High reactiveness can suggest many things, from a lack of confidence in your predictions to a tendency of over-estimating the impact of new information. Perhaps spending more time around the opening of the problem to taking in more information and giving you more confidence in your predictions could be wise. It's entirely possible that the real-world events surrounding this problem were volatile and therefore harder to predict, however if you find yourself falling into this camp it might be worth considering if your forecasting is starting to sound like anything described here.`,
        // Low Accuracy + Medium Reactiveness
        `Reactiveness measures how much you shift or move from forecast to forecast. Unfortunately, you didn't score too well in this problem (${props.finalScore} / 110), and your reactiveness wasn't too high or too low. As you move on from this problem, it's worth thinking about how you can push your predictive ability to the higher scores. A lower degree of reactiveness may provide you with more consistency and demonstrate a greater ability to weigh new information, but it could also be a sign of arrogance if you're wrong. On the flip side, a high degree of reactiveness could be a sign of greater open-mindedness, as new information is influencing you, but it could also be a sign that you're rushing to process new information and update your forecasts accordingly. While you're currently not in major danger of either of those, they're very easy behaviours to take up when forecasting, so be careful!`,
        // Low Accuracy + Low Reactiveness
        `Reactiveness measures how much you shift or move from forecast to forecast. Unfortunately, you didn't score too well in this problem (${props.finalScore} / 110), so it's worth being cautious about low reactiveness. Your forecasts have placed you in a difficult scoring territory, so it might be that low reactiveness was holding you back from a better performance by prohibiting you from approach the problem with more open-mindedness about the potential of your predictions to be wrong. Being introspective about your rationalisations for your forecasts may help you identify if you're perhaps being too arrogant, and with low scoring in this problem this is a threat. Allowing your forecasts to fluctuate a little bit more might be a good thing to consider, as even if you're still predicting the incorrect outcome, it could do some damage control and provide you with a better score.`,
    ];

    useEffect(() => {
        if (props.finalScore >= 90) {
            if (props.reactivenessScore >= 70) {
                // High Accuracy + High Reactiveness
                setFeedback(feedbackArr[0]);
            } else if (props.reactivenessScore < 70 && props.reactivenessScore > 30) {
                // High Accuracy + Medium Reactiveness
                setFeedback(feedbackArr[1]);
            } else {
                // High Accuracy + Low Reactiveness
                setFeedback(feedbackArr[2]);
            };
        } else if (props.finalScore < 90 && props.finalScore >= 70) {
            if (props.reactivenessScore >= 70) {
                // Medium Accuracy + High Reactiveness
                setFeedback(feedbackArr[3]);
            } else if (props.reactivenessScore < 70 && props.reactivenessScore > 30) {
                // Medium Accuracy + Medium Reactiveness
                setFeedback(feedbackArr[4]);
            } else {
                // Medium Accuracy + Low Reactiveness
                setFeedback(feedbackArr[5]);
            };
        } else {
            if (props.reactivenessScore >= 70) {
                // Low Accuracy + High Reactiveness
                setFeedback(feedbackArr[6]);
            } else if (props.reactivenessScore < 70 && props.reactivenessScore > 30) {
                // Low Accuracy + Medium Reactiveness
                setFeedback(feedbackArr[7]);
            } else {
                // Low Accuracy + Low Reactiveness
                setFeedback(feedbackArr[8]);
            };
        };
    }, [props.reactivenessScore]);

    return (
        <p className="explanatory-paragraph">{feedback}</p>
    )
}

export default ReactivenessFeedback;