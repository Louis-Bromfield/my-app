import './TopicContent.css';
// import Brier_Certainty_Chart_Full from '../../../media/Brier_Certainty_Chart_Full.JPG';
// import Zero_To_Twenty_Chart from '../../../media/Brier_Certainty_Zero_To_Twenty.JPG';
// import Eighty_To_Hundred_Chart from '../../../media/Brier_Certainty_Eighty_To_Hundred.JPG';

// Each sub-array = one topic, this file will be messy but at least it's contained
export const TopicContent = [
    // FF Points
    <div className="topic-text-paragraph">
        <p>Across Horse Race Politics, you will have numerous opportunities to earn points. On the home page, you'll find the Onboarding menu, which will provide you with a handful of ways to both get started on earning points, as well as giving you some pointers as to what you can do on the site.</p>
        <p>Points are awarded for submitting forecasts, posting to the news feed, voting on other people's posts, completing the quizzes at the end of each section on this Learn page, and more.</p>
        <p>Horse Race Points will determine your rank in the <strong>Horse Race Politics All-Time</strong> leaderboard. With every 100 points you earn, you level up. Levels bring with them rewards, such as different titles ("Forecaster", "Diviner", "Oracle", etc.) as well as profile picture border colours and the ability to rate other user's posts as truthful and/or relevant.</p>
        <p>For the US Presidential Election Tournament, placement here is determined EXCLUSIVELY by your forecasting performance. You can score up to 110 points per forecast question, and these will determine where you rank on the 2024 US Presidential Election Leaderboard.</p>
        <p>This page has been made to help get you up to speed on the 2024 Presidential Election itself, how forecasts are scored on this website, and some forecasting research that may provide tips on how to improve your own performance.</p>
        <p className="middle-align">Happy Forecasting!</p>
    </div>,
    // US Presidential Election
    <div className="topic-text-paragraph">
        <p><i>If the above video does not load, click <a href="https://www.youtube.com/watch?v=9sTK9zOuZwg" target="_blank" rel="noopener noreferrer">here</a> to watch it (Sky News: "US election 2024: How does it work?").</i></p>
        <p><strong>When is the Election?</strong></p>
        <p>The election campaign is hot underway, but the actual day for voting is November 4th, 2024.</p>
        <p><strong>Who is competing?</strong></p>
        <p>The US has what is referred to as a "two-party system". This means that elections are almost exclusively contested by the two biggest parties in the country, the Democrats and the Republicans. Each party has a candidate for the presidency, this is the current Vice President Kamala Harris for the Democrats and former president Donald Trump for the Republicans. The Democratic candidate was Joe Biden until fairly recently, but he was replaced after long-standing concerns about his age came to a boil in a disastrous debate performance against Trump.</p>
        <p><strong>How does the election work?</strong></p>
        <p>On November 4th, Americans will cast their vote for president - but they also cast votes for more local representatives, such as their Senators and Congressmen/women. When the votes are tallied, the presidential candidate with the most votes doesn't simply "win" a given state, they win the state's Electoral College votes.</p>
        <p><strong>What does that mean?</strong></p>
        <p>It gets wierd, but bear with us. Each state has a certain number of Electoral College votes, and this is determined by the state's population. States like California and Texas have 54 and 40 respectively, while smaller ones like Vermont have 3. This measn that there are 538 votes up for grabs in each election. To win the election, a candidate must win at least 270 EC votes. Once crossed, a candidate has won the election. This is why most discussions around the US election revolves around which individual states are candidates focussing their efforts on.</p>
        <p><strong>Does this mean some states are more important than others?</strong></p>
        <p>Yes. A lot of states are considered "safe" by both parties, states that they, and most others, assume are already in the bag - for example, California is effectively unlosable for Democrats. However, there are a handful of states that could go either way, and these are called "swing states".</p>
        <p>In this election, we ask players to try and predict the outcomes of these states individually. These are: Arizona, Georgia, Michigan, Nevada, North Carolina, Pennsylvania, and Wisconsin. It is widely held that these states are the route to the White House.</p>
    </div>,
    // Brier Scores
    <div className="topic-text-paragraph">
        <p>The Brier Score is the metric by which we can assess the accuracy of a forecast. The formula for calculating said score looks like this:</p>
        <p className="middle-align"><strong>(Outcome - Outcome Forecast)&sup2; + (Opposite Outcome - Opposite Outcome Forecast)&sup2;</strong></p>
        <p>To make better sense of this formula, let’s use a real world example.</p>
        <p>Say the forecast question that you have to tackle is predicting who will win the Presidential election, Donald Trump or Kamala Harris. Your job is to gauge the relevant factors and determine a prediction. You do this by assigning each outcome with a "certainty" or "confidence" that it will occur.</p>
        <p>Let’s say in this example, I’m incredibly certain that Harris will win. So I give her an 85% chance. Within the context of that formula above, that also means that I have a 15% certainty that Trump will win instead.</p>
        <p>If I was right and Harris DID win, then the Brier formula would look like this:</p>
        <p className="middle-align"><strong>(1 - 0.85)&sup2; + (0 - 0.15)&sup2; = 0.04</strong></p>
        <p className="middle-align"><strong>or</strong></p>
        <p className="middle-align"><strong>(Harris wins - My 85% certainty)&sup2; + (Harris loses - My 15% certainty)&sup2; = 0.04</strong></p>
        <p>If Trump wins, however, the outcomes in the formula flip:</p>
        <p className="middle-align"><strong>(1 - 0.15)&sup2; + (0 - 0.85)&sup2; = 1.44</strong></p>
        <p className="middle-align"><strong>or</strong></p>
        <p className="middle-align"><strong>(Harris loses - My 15% certainty)&sup2; + (Harris wins - My 85% certainty)&sup2; = 1.44</strong></p>
        <p><strong><u>With Briers, the best you can score is 0, and the worst you can score is 2.</u></strong></p>
        {/* <p>However, a notion to bear in mind is that, if Kamala Harris did win, predicting her to do so with a 60% certainty will <u>not</u> return a Brier score that is exactly twice as good as a correct forecast with a certainty of 30%. Take the chart below for instance:</p> */}
        {/* <div className="single-chart-div">
            <img src={Brier_Certainty_Chart_Full} alt="" className="chart"/>
        </div>
        <p>As we can see, the line is not perfectly straight, instead depicting a relationship where the gains of increasing certainty get smaller and smaller. Put simply, this means that the largest gains come from upping your certainty from say, 20% to 30%, than they do from upping it from 90% to 95%. Brier scores PUNISH wrong forecasts quite heavily.</p> */}
        {/* <div className="multiple-chart-div">
            <img src={Zero_To_Twenty_Chart} alt="" className="chart" />
            <img src={Eighty_To_Hundred_Chart} alt="" className="chart" />
        </div>
        <p>The first chart shows how a certainty of 20% provides an approximate 0.7 point improvement over a certainty of 0%. The second chart shows an equivalent 20% increase, however this time it is going from 80% to 100% certainty, and it shows that the improvement in Brier score is much smaller, only a roughly 0.08 improvement.</p> */}
        <p><b>So is this how Horse Race Politics calculates scores? Just one formula?</b></p>
        <p>Not quite. There are a couple of core issues with the Brier score as is. Firstly, the range of possible scores (0-2) is a VERY small range. It's hard to easily see who the best forecasters are! Secondly, the Brier score is calculated in such a way that smaller is better, whereas we want players to feel rewarded for their efforts, giving them MORE points for better and earlier predictions. So, instead of settling for the 0-2 score, we spice things up.</p>
        <p>Firstly, we flip it. So a 0 now becomes 2, a 0.25 becomes 1.75, a 0.9 becomes a 1.1, and so on. But we're still in the 0-2 ballpark, so we simply multiply this new number by 50, giving us a score from 0-100.</p>
        <p><i>That's more like it.</i></p>
        <p>But we're not done there, we have one final thing to do. The 0-2 original Brier score doesn't take into account WHEN the forecast was made. We want to incentivise players to forecast as EARLY as possible, as you should be rewarded for forecasting the correct outcome earlier than others. So, we weight this new 0-100 number by its duration. Put simply, imagine there are two players. They're both forecasting the winner of the 2024 US Presidential election. The question that they're submitting forecasts went live 10 days before Election Day. Player 1 submits their forecast on day 1. Player 2 submits their forecast on day 9, 1 day before the election. They both submit the same forecast, both thinking Trump is 60% likely to win. If they're right, Player 1 should be rewarded with a bigger score than Player 2 as they submitted their forecast way earlier, right?</p>
        <p><i>This is what we think too!</i></p>
        <p>To do this, we multiply your 0-100 score by the amount of time this prediction was your most recent forecast. Using our example, Player 1 submitted their forecast on day 1 of a 10 day forecast window, meaning this forecast was their most recent prediction for close to 100% of the entire window (let's say 95%). Player 2 submitted theirs on day 9, meaning this forecast was their most recent for only 1 day, so let's say 10% of the 10 day window. Player 1's prediction will then get multiplied by 0.95 (95%) and Player 2's will get multiplied by 0.1 (10%).</p>
        <p>This has a dramatic effect on their scores. As both players submitted the same 60% forecasts, they would score the same on the 0-100 scale, let's say they both score 80. Player 1's forecast is multiplied by 0.95, scoring them 76. Player 2's forecast is multiplied by 0.1, scoring them 8. Look at that difference! This time-based weighting means you should start forecasting AS SOON AS POSSIBLE!</p>
        <p className="middle-align"><b>BUT DON'T FORGET: You can UPDATE your forecast AS MANY TIMES AS YOU LIKE! All forecasts will be scored and weighted using this process above, and ALL of them contribute to your final score!</b></p>
        <p><b>Time Score</b></p>
        <p>As an added bonus, we added a boost worth up to 10 points which is determined entirely by when you made your <b>FIRST</b> prediction, regardless of accuracy. The later you make your first prediction, the smaller the bonus you will get. It's an extra incentive to begin forecasting as soon as possible. This means that the highest can possibly score is 110 (0-100 from your forecasts and 0-10 from your Time Score boost)</p>
        {/* <p><b>An Full Example</b></p>
        <p>Let's imagine a problem that is live for 10 days, where I have to submit my certainty as to whether or not <b>Candidate X will win the upcoming election</b> - and I, being a big Candidate X supporter, submit a prediction almost immediately on the opening day with a certainty of 80%. Halfway through the window - 5 days - I hear in the news that Candidate X messed up, so I downgrade my certainty to 60%. Then, two days out, my opinion changes back after hearing some new polling data, and I push my certainty up to 90%.</p>
        <p>My Time Score will be near to 10, as I submitted my first forecast incredibly quickly. Had I submitted my first prediction on say, Day 3, my Time Score would be around 7, however I was quick, so I get a nice boost.</p>
        <p>Let's say that Candidate X did win. My Weighted Brier Scores for my certainties would be: </p>
        <p><b>Prediction 1:</b> 80% Certainty = Brier Score of 0.08, inversed to 1.92 and multiplied by 50 = 96/100. This is then multiplied by how long the prediction was up. In this case, I waited 5 days, or <b>50% of the forecast window</b>, before updating. So 96 * 0.5 = 48.</p>
        <p><b>Prediction 2:</b> 60% Certainty = Brier Score of 0.32, inversed to 1.68, * 50 = 84/100. Prediction was up for 3 days, or 30% of the forecast window, so 84 * 0.3 = 25.2.</p>
        <p><b>Prediction 3:</b> 90% Certainty = Brier Score of 0.02, inversed to 1.98, * 50 = 99/100. This was my last prediction, up for the final 2 days, or 20% of the window, so 99 * 0.2 = 19.8.</p>
        <p>My Final Score is then a sum of these results + the time score. So (48 + 25.2 + 19.8) + 9.9 = 102.9/110.</p> */}
        {/* <p><b>Why did we make this new version?</b></p>
        <p>Firstly, the Brier Score formula that returns a score from 0-2, as shown above, makes it quite difficult to sufficiently distinguish between scores. Secondly, duration weighting provides two main incentives:</p>
        <p><b>1. It encourages you to forecast sooner</b></p>
        <p>By weighting forecasts by their duration (from forecast submission to update or from forecast submission to problem deadline), the main way to get any sufficiently high score is to submit as early as possible, a normatively fundamental aspect of good forecasting. Rewarding forecasts <b>solely</b> on accuracy is all well and good, but it means that a forecast submitted right before the deadline would be receive an equal score as the same certainty submitted on day one, which isn't fair to the forecaster who submitted much earlier and had less information to work with. Weighting them by duration solves this issue.</p>
        <p><b>2. It encourages you to update sooner</b></p>
        <p>This uses the same logic as point 1, but duration weighting means that you have to update your forecast as soon as possible in order to get the biggest weighting possible for that forecast. In the above example, had I submitted Prediction 3 sooner, I would've received a bigger weighting for that 99/100. Similarly, by updating earlier, Prediction 2 would've had a smaller impact on my final score as it would've been weighted by less time. While these differences might seem negligible, it makes the difference in forecasting tournaments, and those differences become even larger the longer you wait to update.</p> */}
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
        <p>One of the main goals of Horse Race Politics is to help you become a better forecaster; to become better at parsing information and using it to make reasonable and informed predictions about the future. One of the previous sections on this Learn page explores the Good Judgement Project, or GJP, and how they exceeded the goals of 50% improvements over the WOTC by hitting almost 80%. It’s worth our while to consider who were the ones achieving such impressive feats, and how did they do it?</p>
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
    </div>
]