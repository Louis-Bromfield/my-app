const mongoose = require('mongoose');

const leaderboardSchema = mongoose.Schema({
    leaderboardName: {
        type: String
    },
    rankings: {
        type: Array
    },
    isPublic: {
        type: Boolean
    },
    isFFLeaderboard: {
        type: Boolean
    }
});

module.exports = mongoose.model("Leaderboards", leaderboardSchema);