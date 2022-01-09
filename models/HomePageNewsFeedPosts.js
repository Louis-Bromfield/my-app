const mongoose = require('mongoose');

const HomePageNewsFeedPostsSchema = mongoose.Schema({
    articleURL: {
        type: String,
        required: false
    },
    articleTitle: {
        type: String,
        required: false
    },
    articleImage: {
        type: String,
        required: false
    },
    postDescription: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true,
        default: "Placeholder Author"
    },
    likes: {
        type: Array,
    },
    dislikes: {
        type: Array,
    },
    postDate: {
        type: Date,
        default: new Date()
    },
    markets: {
        type: Array,
        default: []
    },
    authorProfilePicture: {
        type: String,
        default: ""
    },
    comments: {
        type: Array,
        default: []
    }
});

module.exports = mongoose.model("HomePageNewsFeedPosts", HomePageNewsFeedPostsSchema);