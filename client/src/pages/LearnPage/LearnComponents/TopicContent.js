import './TopicContent.css';
import Brier_Certainty_Chart_Full from '../../../media/Brier_Certainty_Chart_Full.JPG';
import Zero_To_Twenty_Chart from '../../../media/Brier_Certainty_Zero_To_Twenty.JPG';
import Eighty_To_Hundred_Chart from '../../../media/Brier_Certainty_Eighty_To_Hundred.JPG';

// Each sub-array = one topic, this file will be messy but at least it's contained
export const TopicContent = [
    // FF Points
    <div className="topic-text-paragraph">
        <p>Across Fantasy Forecast, you will have numerous opportunities to earn points. On the home page, you'll find the Onboarding menu, which will provide you with a handful of ways to both get started on earning points, as well as giving you some pointers as to what you can do on the site.</p>
        <p>Points are awarded for submitting forecasts posting to the news feed, voting on other people's posts, completing the quizzes at the end of each section on this Learn page, and much more.</p>
        <p>Points will then be used to determine your rank in the global leaderboard. To see how you're doing, go to the Leaderboards section and select the <strong>Fantasy Forecast All-Time</strong> leaderboard.</p>
        <p>Progress in all of the other leaderboards will be determined by <strong>Market Points</strong>. These are points that you earn solely from forecasts in that particular market (i.e. a forecast in the US Politics market won't give you any points in the UK Politics leaderboard). However, 1 market point = 1 Fantasy Forecast point, so all the points you earn across every market will count towards your overall Fantasy Forecast point total!</p>
        <p>On this page, you have the opportunity to learn about various aspects of forecasting. From Brier Scores - the metric by which forecast accuracy is assessed - to Superforecasters - the very best forecasters identified across real-world research projects and what makes them so good - there's plenty to take from this section alone.</p>
        <p className="middle-align">Happy Forecasting!</p>
    </div>,
    // Brier Scores
    <div className="topic-text-paragraph">
        <p>The Brier Score is the metric by which we can assess the accuracy of a forecast. The formula for calculating said score looks like this:</p>
        <p className="middle-align"><strong>(Outcome - Outcome Forecast)&sup2; + (Opposite Outcome - Opposite Outcome Forecast)&sup2;</strong></p>
        <p>To make better sense of this formula, let’s use a real world example.</p>
        <p>Say the forecasting question - or “problem” as they’re sometimes referred to - poses the following scenario: “The Conservatives will win a majority in the next General Election”. Your job is to gauge the relevant factors and determine a prediction. You do this by predicting an outcome with probability, the certainty you have behind your forecast.</p>
        <p>Let’s say in this example, I’m incredibly certain that the Conservatives will win a majority. So I estimate a 85% certainty. Within the context of that formula above, that also means that I have a 15% certainty that the Conservatives will NOT win a majority.</p>
        <p>If I was right and the Conservatives DID win a majority, when we plug this into the formula, it looks like this:</p>
        <p className="middle-align"><strong>(1 - 0.85)&sup2; + (0 - 0.15)&sup2; = 0.04</strong></p>
        <p className="middle-align"><strong>or</strong></p>
        <p className="middle-align"><strong>(Cons win majority - My 85% certainty of occurrence)&sup2; + (Cons don’t win majority - My 15% certainty of occurrence)&sup2; = 0.04</strong></p>
        <p>If I was wrong and the Conservatives did NOT win a majority, the formula would look like this:</p>
        <p className="middle-align"><strong>(1 - 0.15)&sup2; + (0 - 0.85)&sup2; = 1.44</strong></p>
        <p className="middle-align"><strong>or</strong></p>
        <p className="middle-align"><strong>(Cons don’t win majority - My 15% certainty of occurrence)&sup2; + (Cons win majority - My 85% certainty of occurrence)&sup2; =1.44</strong></p>
        <p><strong><u>The best you can score on a problem is 0, and the worst you can score is 2.</u></strong> However, a notion to bear in mind is the non-linearity of the relationship between certainty and Brier scores.</p>
        <p>In other words, a correct forecast with a certainty of 60% will not return a Brier score that is exactly twice as good as a correct forecast with a certainty of 30%. Take the chart below for instance:</p>
        <div className="single-chart-div">
            <img src={Brier_Certainty_Chart_Full} alt="" className="chart"/>
        </div>
        <p>As we can see, the line is not perfectly straight, instead depicting a relationship where the gains of increasing certainty get smaller and smaller. To better explain this, the following two charts show the improvement in Brier Score between certainties of 0-20% and 80-100% respectively:</p>
        <div className="multiple-chart-div">
            <img src={Zero_To_Twenty_Chart} alt="" className="chart" />
            <img src={Eighty_To_Hundred_Chart} alt="" className="chart" />
        </div>
        <p>The first chart shows how a certainty of 20% provides an approximate 0.7 point improvement over a certainty of 0%. The second chart shows an equivalent 20% increase, however this time it is going from 80% to 100% certainty, and it shows that the improvement in Brier score is much smaller, only a roughly 0.08 improvement.</p>
        <p><b>But we do things differently here...</b></p>
        <p>Fantasy Forecast is using a unique and improved Brier Score formula. Instead of settling for the 0-2, golf-like scale of lower is better, we flip that score and multiply it by 50 to give us a 0-100 score, where bigger is now better.</p>
        <p>This 0-100 score is then weighted by the amount of time that it was your latest prediction (either the time it took for you to update it or until the problem deadline if it was your final prediction). So if you only made one prediction halfway through a forecast window, that would then be multiplied by 0.5 (as it was up for the second half of the window).</p>
        <p><b>Time Score</b></p>
        <p>The Time Score is determined entirely by when you made your <b>FIRST</b> prediction. The later you make your first prediction, the smaller the bonus you will get. This ranges from 10 to 0 and is not affected by the accuracy of that first prediction, just how far away from the deadline it was made. It's an extra incentive to begin forecasting as soon as possible.</p>
        <p><b>An Example</b></p>
        <p>Let's imagine a problem that is live for 10 days, where I have to submit my certainty as to whether or not <b>Candidate X will win the upcoming election</b> - and I, being a big Candidate X supporter, submit a prediction almost immediately on the opening day with a certainty of 80%. Halfway through the window - 5 days - I hear in the news that Candidate X messed up, so I downgrade my certainty to 60%. Then, two days out, my opinion changes back after hearing some new polling data, and I push my certainty up to 90%.</p>
        <p>My Time Score will be near to 10, as I submitted my first forecast incredibly quickly. Had I submitted my first prediction on say, Day 3, my Time Score would be around 7, however I was quick, so I get a nice boost.</p>
        <p>Let's say that Candidate X did win. My Weighted Brier Scores for my certainties would be: </p>
        <p><b>Prediction 1:</b> 80% Certainty = Brier Score of 0.08, inversed to 1.92 and multiplied by 50 = 96/100. This is then multiplied by how long the prediction was up. In this case, I waited 5 days, or <b>50% of the forecast window</b>, before updating. So 96 * 0.5 = 48.</p>
        <p><b>Prediction 2:</b> 60% Certainty = Brier Score of 0.32, inversed to 1.68, * 50 = 84/100. Prediction was up for 3 days, or 30% of the forecast window, so 84 * 0.3 = 25.2.</p>
        <p><b>Prediction 3:</b> 90% Certainty = Brier Score of 0.02, inversed to 1.98, * 50 = 99/100. This was my last prediction, up for the final 2 days, or 20% of the window, so 99 * 0.2 = 19.8.</p>
        <p>My Final Score is then a sum of these results + the time score. So (48 + 25.2 + 19.8) + 9.9 = 102.9/110.</p>
        <p><b>Why did we make this new version?</b></p>
        <p>Firstly, the Brier Score formula that returns a score from 0-2, as shown above, makes it quite difficult to sufficiently distinguish between scores. Secondly, duration weighting provides two main incentives:</p>
        <p><b>1. It encourages you to forecast sooner</b></p>
        <p>By weighting forecasts by their duration (from forecast submission to update or from forecast submission to problem deadline), the main way to get any sufficiently high score is to submit as early as possible, a normatively fundamental aspect of good forecasting. Rewarding forecasts <b>solely</b> on accuracy is all well and good, but it means that a forecast submitted right before the deadline would be receive an equal score as the same certainty submitted on day one, which isn't fair to the forecaster who submitted much earlier and had less information to work with. Weighting them by duration solves this issue.</p>
        <p><b>2. It encourages you to update sooner</b></p>
        <p>This uses the same logic as point 1, but duration weighting means that you have to update your forecast as soon as possible in order to get the biggest weighting possible for that forecast. In the above example, had I submitted Prediction 3 sooner, I would've received a bigger weighting for that 99/100. Similarly, by updating earlier, Prediction 2 would've had a smaller impact on my final score as it would've been weighted by less time. While these differences might seem negligible, it makes the difference in forecasting tournaments, and those differences become even larger the longer you wait to update.</p>
    </div>,
    // The GJP
    <div className="topic-text-paragraph">
        <p>The Good Judgement Project, or the GJP, serves as one of the most famous instances of forecasting research. The Project was founded to participate in the Intelligence Advanced Research Projects Activity (or IARPA)’s forecasting tournament. The winner would be whoever could produce the most accurate forecasters. The main drive was to dramatically enhance the “accuracy, precision, and timeliness of intelligence forecasts”, with all teams having complete freedom over the methods they employed. They were all set the same goal of exceeding the accuracy of the Wisdom of the Crowd (untrained forecasters) by 50% after four years. The GJP bested their competition to such an extent, that the other teams dropped out after just two, with the Project’s best forecasters being almost 80% more accurate than the WOTC.</p>
        <p>So how did they do it? Participants were randomly assigned into a permutation of training and information-sharing groups.</p>
        <p><strong>Training groups:</strong></p>
        <ol className="topic-ordered-list">
            <li>No training</li>
            <li>Probability training (Mean Regression, Bayesian Revisionism)</li>
            <li>Scenario  Training (produce forecasts in the best, middle, and worst case scenarios)</li>
        </ol>
        <p><strong>Information-sharing groups:</strong></p>
        <ol className="topic-ordered-list">
            <li>Isolated forecasts</li>
            <li>Isolated forecasts with awareness of other submissions</li>
            <li>Making forecasts as bets (prediction markets)</li>
            <li>Forecasting in teams</li>
        </ol>
        <p>All training conditions performed best when in the team dynamic. Reasons could include more people benefitting from training, or members acting as checks and balances on each other. Data-tweaking was also employed, as forecasts were infused with simulated certainty (e.g. an 80% certainty was upped to 90%). The reasoning for this was that it would be impossible to provide forecasters with all of the relevant knowledge to make a prediction, but, if they could, the forecasts would be much closer to the extremes of 100% or 0%.</p>
    </div>,
    // Superforecasters
    <div className="topic-text-paragraph">
        <p>One of the main goals of Fantasy Forecast is to help you become a better forecaster; to become better at parsing information and using it to make reasonable and informed predictions about the future. One of the previous sections on this Learn page explores the Good Judgement Project, or GJP, and how they exceeded the goals of 50% improvements over the WOTC by hitting almost 80%. It’s worth our while to consider who were the ones achieving such impressive feats, and how did they do it?</p>
        <p>Philip Tetlock, the main man behind the GJP, called these individuals “Superforecasters” - the best of the best, and they comprised roughly 2% of the Project’s participants. He defined them as “ordinary people”, who were incredibly consistent and accurate.</p>
        <p>They were able to make more accurate forecasts 300 days out from a problem’s end date than non-Superforecasters could when 100 days out. They adjusted their forecasts in light of new information much more often, and would frequently make much smaller changes to their certainties, showing a lesser susceptibility to making extreme alterations and being heavily swayed by the latest news (unless they deemed it necessary to dramatically alter their prediction).</p>
        <p>The most surprising thing about Superforecasters is that becoming one is much easier than it sounds. There are a list of characteristics than can expedite the process to becoming a great predictor. Tetlock described them as open-minded, willing to treat their beliefs as testable hypotheses, and treat forecasting as a cultivatable skill rather than some innate genealogical gift that some people just “have”. They were better at just saying “I got that wrong” and learning from it, rather than succumbing to an endless cycle of defeatism and fatalism. They were also more willing to question their own personal biases, like whether your predictions of a score in a football match is being influenced by what you want to happen (perhaps due to support for a team in the match or for a team who would benefit from a certain result).</p>
        <p>The list of traits is much longer and can be split into 4 categories:</p>
        <ol className="topic-ordered-list">
            <li><strong>Philosophic outlook</strong></li>
            <ol className="topic-ordered-sub-list">
                <li>Cautious (nothing is certain)</li>
                <li>Humble (reality is complex)</li>
                <li>Nondeterministic (whatever happens is not meant to be and does not have to happen)</li>
            </ol>
            <br />
            <li><strong>Abilities and thinking skills</strong></li>
            <ol className="topic-ordered-sub-list">
                <li>Curious, enjoy challenges</li>
                <li>Reflective, self-critical</li>
                <li>Comfortable with numbers, actively open-minded</li>
            </ol>
            <br />
            <li><strong>Forecasting methods</strong></li>
            <ol className="topic-ordered-sub-list">
                <li>Not stuck to one idea</li>
                <li>Can step back and consider other views</li>
                <li>Dragonfly-eyed - can see the value in diverse views</li>
                <li>Can judge grades of “maybe”</li>
                <li>When facts change, they acknowledge and shift accordingly, not entrenched</li>
                <li>Check their own cognitive and emotional biases</li>
            </ol>
            <br />
            <li><strong>Work ethic</strong></li>
            <ol className="topic-ordered-sub-list">
                <li>It’s always possible to get better</li>
                <li>Determined</li>
            </ol>
        </ol>
        <p>If all of this seems like too much to change about yourself or too much to take in, that’s understandable. It is a LOT, but it helps to see a fairly complete list of what traits you may find in a Superforecaster, as this may help you in your predictions. Any effort to cultivate any of these traits will benefit you and improve your skill.</p>
        <p>One final distinction to make between good and bad forecasters is that of the Hedgehog and the Fox. This was one of Tetlock’s earlier contributions to the field, where he created this classification of how people make predictions. The Hedgehog is guided by their belief systems and typically knows “one big thing”, usually a large-scale worldview like their religion. This then permeates into how they perceive and judge and explain things. For example, an improbable event is attributed to a divine origin, rather than looking a little deeper and uncovering the facts behind a situation that could provide a plausible non-divine source. Foxes know many things, and are pragmatic, objective and observational. They gather facts, weigh up possible outcomes and options, and make calm and informed judgements. If the list of Superforecaster traits above is perhaps too much, engaging in Fox-like behaviour might be the way to start.</p>
    </div>,
    <div className="topic-text-paragraph">
        <p>On your profile page, there is a tab called "My Team". Here, you will be able to create a forecasting team of your own.</p>
        <p><strong>What do I do with my team?</strong></p>
        <p>The only major change to forecasting individually is that when you receive your Brier Score for forecasting a particular problem, that score will be added together with the scores earned by your teammates on that same problem. This new total is then divided by the number of teammates who attempted it. This new average is the Brier Score for the team, and will be used to move it up or down the leaderboards. Your individual score will remain unchanged! </p>
        <p>For example, let's say a problem asks you to forecast if Boris Johnson is to publicly announce a run for the Conservative Party leadership before the end of June 2023. In this scenario, you're in a team with two other players. You score 100/110, Teammate B scores 75/110, and Teammate C scores 25/110. Each individual player will receive their Brier Score, and then their leaderboard position will be affected accordingly. However, the team will also receive a score of (100+75+25)/3, which = 66.6.</p>
        <p>Being a part of a forecasting team will give you another chance to climb up the leaderboards.</p>
        <p><strong>How do I create a team?</strong></p>
        <p>Head to your profile page and select the "My Team" tab. You will see a field to enter a team name. It's that simple!</p>
        <p><strong>How do I invite other players to my team?</strong></p>
        <p>Use the search page to search for the player you want to invite. Select the "Team" tab on their page, and if you are in a team, you'll see a button be a button that says "Invite to Team". Click this and the invite will send. You can also go to player profiles by clicking their username on their posts to your Feed on the Home page or their username in any leaderboard. You must be in a team to send invites.</p>
        <p><strong>How do I join a team?</strong></p>
        <p>You will receive a notification upon receiving an invite. Clicking on it either from the notification dropdown menu at the top of the screen or from the notification page (which can also be accessed through the dropdown) will open up a popup that lets you "Accept" or "Close" the invite. Closing it will simply close the popup, and you'll be able to go back and accept the invite again if you want to.</p>
        <p><strong>Can I be in multiple teams?</strong></p>
        <p>No, you may only be in one team at a time. Accepting an invite from another team will automatically remove you from your current one and add you to the new team.</p>
        <p><strong>How can I see how my team has performed?</strong></p>
        <p>There are two ways to review team performance. Firstly, you can use the leaderboards - the Fantasy Forecast All-Time leaderboard will show how your team is performing when it comes to accruing Fantasy Forecast Points, and our UK Politics leaderboard will show how well your team is doing when forecasting in that market and earning Market Points, which is the real competition here. The second way is to go onto your profile page and select the "My Team" tab, where you will be able to see FF Points, all team members, and a breakdown of each Brier Score your team has recieved, including the scores of individual forecasters. This will let you see how each team member is impacting the team's score, for better or worse!</p>
    </div>
]