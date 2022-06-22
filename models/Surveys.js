const mongoose = require('mongoose');

// Just user submission, add the commented out one for when I add a new forecast to DB through an app
const SurveysSchema = mongoose.Schema({
    username: {
        type: String,
    },
    selfAssessedPolKnowledge: {
        type: String
    },
    currentHomeSecretary: {
        type: String
    },
    currentDeputyPM: {
        type: String
    },
    currentSOSHSC: {
        type: String
    },
    currentSOSLUHC: {
        type: String
    },
    currentSOSScotland: {
        type: String
    },
    currentLibDemLeader: {
        type: String
    },
    currentSNPHOCLeader: {
        type: String
    },
    currentShadowChanc: {
        type: String
    },
    currentShadowSOST: {
        type: String
    },
    currentSpeaker: {
        type: String
    },
    pollStationCloseTime: {
        type: String
    },
    dayOfPMQs: {
        type: String
    },
    constituencyCount: {
        type: String
    },
    depositPay: {
        type: String
    },
    electoralSystemName: {
        type: String
    },
    ethicsAdvisorNames: {
        type: String
    },
    inflationPercentage: {
        type: String
    },
    unemploymentPercentage: {
        type: String
    },
    noConfidenceVoteCount: {
        type: String
    },
    publicBillsName: {
        type: String
    },
    opposingArgumentConvince: {
        type: String
    },
    evidenceAgainstBeliefs: {
        type: String
    },
    reviseBeliefs: {
        type: String
    },
    changingYourMind: {
        type: String
    },
    intuitionIsBest: {
        type: String
    },
    perservereBeliefs: {
        type: String
    },
    disregardEvidence: {
        type: String
    },
    foxHedgehogRating: {
        type: String
    },
    politicalInterest: {
        type: String
    },
    politicalSpectrumPosition: {
        type: String
    },
    ukPartySupporter: {
        type: String
    },
    currentAge: {
        type: String
    },
    identification: {
        type: String
    },
    highestQual: {
        type: String
    },
    householdIncome: {
        type: String
    },
    ukBased: {
        type: String
    },
});

module.exports = mongoose.model("Surveys", SurveysSchema);