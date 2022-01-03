const router = require('express').Router();
const Post = require('../models/Post');
const User = require('../models/User');

//create a post 
router.post('/', async (req, res) => {
    const newPost = await Post(req.body)
    try {
        const savedPost = await newPost.save();
        res.status(200).json(savedPost)
    }catch (err) {
        res.status(500).json(err)
    }
});

//update a post

router.put('/update/:id', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (post.userId === req.body.userId) {
            await post.updateOne({ $set:req.body});
            res.status(200).json("the post is updated")
        } else {
            res.status(403).json("You can only update your post")
        } 
        } catch (err) {
            res.status(500).json(err)
    }
})

//delete a post 
router.delete('/delete/:id', async (req, res) => {
    try {
       const delPost = await Post.findById(req.params.id);
       if (req.body.userID === delPost.userID) {
           delPost.deleteOne();
           res.status(200).json("Post Deleted Successfully");
       } else {
           res.status(500).json("You can only delete your post")
       }

    } catch (err) {
        res.status(500).json(err)
    }
    
})
//like a post
router.put('/react/:id', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        const PersonLiking = await User.findById(req.body.userId)
        if (!post.likes.includes(req.body.userId)) {
            await post.updateOne({$push: {likes: req.body.userId}})
            await PersonLiking.updateOne({$push: {postsLiked: req.params.id}})
            res.status(200).json("You liked this Post")
        } else {
            await post.updateOne({$pull: {likes: req.body.userId}});
            await PersonLiking.updateOne({$pull: {postsLiked: req.params.id}})
            res.status(200).json("You have disliked this post")
        }
    } catch (err) {
        res.status(500).json(err)
    }
})


//get a post

router.get('/:id', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        res.status(200).json(post)
    } catch (err) {
        res.status(500).json(err)
    }
})

//get all post

router.get('/timeline/all', async (req, res) => {
    try {
        const currentUser = await User.findById(req.body.userId);
        const userPost = await Post.find({userId: currentUser._id});
        const friendsPost = await Promise.all(
            currentUser.following.map((friendsId) => {
                return Post.find({userId: friendsId })
            })
        )
        res.json(userPost.concat(...friendsPost))
    } catch (err) {
        res.status(500).json(err)
    }
})
module.exports = router;
