const express = require('express');
const router = express.Router();
const HomePageNewsFeedPost = require('../models/HomePageNewsFeedPosts');
const { extract } = require('article-parser');

// Get all posts
router.get("/", async (req, res) => {
    const allHomeNewsFeedPosts = await HomePageNewsFeedPost.find();
    res.json(allHomeNewsFeedPosts);
});

// Get one post
router.get("/:id", async (req, res) => {
    try {
        const singleHomeNewsFeedPost = await HomePageNewsFeedPost.findById(req.params.id);
        res.json(singleHomeNewsFeedPost);
    } catch (error) {
        res.json({ message: error.message });
    }
});

const getArticleHeadline = async (url) => {
    try {
        const article = await extract(url);
        return [ article.title, article.image ];
    } catch (error) {
        console.error(error);
        return [null, null];
    };
};

// Create a new post
router.post("/", async (req, res) => {
    let [ articleTitle, articleImage ] = await getArticleHeadline(req.body.articleURL);
console.log("====================");
console.log("articleTitle = ");
console.log(articleTitle);
console.log("articleImage = ");
console.log(articleTitle);
console.log("====================");
    const newHomePageNewsFeedPost = new HomePageNewsFeedPost({
        articleURL: req.body.articleURL,
        postDescription: req.body.postDescription,
        articleTitle: articleTitle,
        articleImage: articleImage,
        author: req.body.author,
        likes: req.body.likes,
        dislikes: req.body.dislikes,
        postDate: req.body.postDate,
        markets: req.body.markets,
        authorProfilePicture: req.body.authorProfilePicture
    });
    try {
        const newPostSavedToDB = await newHomePageNewsFeedPost.save();
        res.status(200).json(newPostSavedToDB);
    } catch (error) {
        res.json({ message: error.message });
    }
});

// Update a post
router.patch("/:id", async (req, res) => {
    try {
        const updatedPost = await HomePageNewsFeedPost.findByIdAndUpdate(req.params.id,
            {
                articleURL: req.body.articleURL,
                postDescription: req.body.postDescription,
                articleTitle: req.body.articleTitle,
                author: req.body.author,
                likes: req.body.likes,
                dislikes: req.body.dislikes,
                postDate: req.body.postDate,
                markets: req.body.markets,
                authorProfilePicture: req.body.authorProfilePicture
            },
            { new: true }
        );
        res.json(updatedPost);
    } catch (error) {
        res.json({ error: error.message });
    }
});

// Update a post
router.patch("/postComment/:id", async (req, res) => {
    console.log("here");
    try {
        // New comment, not a reply
        if (req.body.isNewComment === true) {
            const newPostObj = { comment: req.body.newComment, author: req.body.author }
            const updatedPost = await HomePageNewsFeedPost.findByIdAndUpdate(req.body.postID,
                {
                    $push: { comments: newPostObj }
                },
                { new: true }
            );
            res.json({ newPost: updatedPost });
        // A reply
        } else if (req.body.isNewComment === false) {
            
        };
    } catch (error) {
        res.json({ error: error.message });
    }
});

// Update all posts when a user changes their username
router.patch("/changeUsernameOrProfilePic/:currentUsername", async (req, res) => {
    try {
        const allPosts = await HomePageNewsFeedPost.find();
        for (let i = 0; i < allPosts.length; i++) {
            if (allPosts[i].author === req.params.currentUsername) {
                if (req.body.changeUsername === true) {
                    await HomePageNewsFeedPost.findByIdAndUpdate(allPosts[i]._id, { author: req.body.username });
                } else if (req.body.changeUsername === false) {
                    await HomePageNewsFeedPost.findByIdAndUpdate(allPosts[i]._id, { authorProfilePicture: req.body.authorProfilePicture });
                };
            };
        };
        res.json(await HomePageNewsFeedPost.find());
    } catch (error) {
        console.error("Error in change username > currentUsername");
        console.error(error);
    };
});

// Vote on a post
router.patch("/vote/:id", async (req, res) => {
    try {
        const postDoc = await HomePageNewsFeedPost.findById(req.params.id);
        let newHomePagePostSavedToDB;
        let increaseOrDecrease = [];
        // If they've clicked "Like"
        if (req.body.vote === "upvote") {
            // They have liked the post before (haven't disliked)
            if (postDoc.likes.includes(req.body.username)) {
                postDoc.likes.splice(postDoc.likes.indexOf(req.body.username), 1);
                increaseOrDecrease = ["decrease", "nochange"];
                newHomePagePostSavedToDB = await HomePageNewsFeedPost.findByIdAndUpdate(req.params.id,
                    {
                        likes: postDoc.likes 
                    },
                    { new: true }
                );
                res.json(increaseOrDecrease);
            // They haven't liked or disliked the post before
            } else if (!postDoc.likes.includes(req.body.username) && !postDoc.dislikes.includes(req.body.username)) {
                increaseOrDecrease = ["increase", "nochange"];
                newHomePagePostSavedToDB = await HomePageNewsFeedPost.findByIdAndUpdate(req.params.id, 
                    {
                        $push: { likes: req.body.username }
                    },
                    { new: true }
                );
                res.json(increaseOrDecrease);
            // They have disliked the post before (haven't liked)
            } else if (!postDoc.likes.includes(req.body.username) && postDoc.dislikes.includes(req.body.username)) {
                increaseOrDecrease = ["increase", "decrease"];
                postDoc.dislikes.splice(postDoc.dislikes.indexOf(req.body.username), 1);
                newHomePagePostSavedToDB = await HomePageNewsFeedPost.findByIdAndUpdate(req.params.id,
                    {
                        dislikes: postDoc.dislikes,
                        $push: { likes: req.body.username }
                    },
                    { new: true }
                );
                res.json(increaseOrDecrease);
            };
        // If they've clicked "Disike"
        } else if (req.body.vote === "downvote") {
            // They have disliked the post before (haven't liked)
            if (postDoc.dislikes.includes(req.body.username)) {
                increaseOrDecrease = ["nochange", "decrease"];
                postDoc.dislikes.splice(postDoc.dislikes.indexOf(req.body.username), 1);
                newHomePagePostSavedToDB = await HomePageNewsFeedPost.findByIdAndUpdate(req.params.id,
                    {
                        dislikes: postDoc.dislikes 
                    },
                    { new: true }
                );
                res.json(increaseOrDecrease);
            // They haven't liked or disliked the post before
            } else if (!postDoc.likes.includes(req.body.username) && !postDoc.dislikes.includes(req.body.username)) {
                increaseOrDecrease = ["nochange", "increase"];
                newHomePagePostSavedToDB = await HomePageNewsFeedPost.findByIdAndUpdate(req.params.id, 
                    {
                        $push: { dislikes: req.body.username }
                    },
                    { new: true }
                );
                res.json(increaseOrDecrease);
            // They have liked the post before (haven't disliked)
            } else if (postDoc.likes.includes(req.body.username) && !postDoc.dislikes.includes(req.body.username)) {
                increaseOrDecrease = ["decrease", "increase"];
                postDoc.likes.splice(postDoc.likes.indexOf(req.body.username), 1);
                newHomePagePostSavedToDB = await HomePageNewsFeedPost.findByIdAndUpdate(req.params.id,
                    {
                        likes: postDoc.likes,
                        $push: { dislikes: req.body.username }
                    },
                    { new: true }
                );
                res.json(increaseOrDecrease);
            };
        };
    } catch (error) {
        console.error("Error in HomePageNewsFeedPosts > patch vote");
        console.error(error);
    }
});

// Delete a post
router.delete("/:id", async (req, res) => {
    try {
        const deletedPost = await HomePageNewsFeedPost.findByIdAndDelete(req.params.id);
        res.json(deletedPost);
    } catch (error) {
        console.error(error);
    }
})

module.exports = router;