const router = require('express').Router();
const bcrypt = require('bcrypt');
const User = require('../models/User');

router.get('/', (req, res) => {
    res.send('its user route')
})

//Update User
router.put('/:id', async (req, res) => {
    if(req.body.userId === req.params.id || req.body.isAdmin) {
         if(req.body.password) {
             try {
                 const salt = await bcrypt.genSalt(10);
                 req.body.password = await bcrypt.hash(req.body.password, salt)
             } catch (err) {
                 return res.status(500).json(err)
             }
         }
         try {
             const user = await User.findByIdAndUpdate(req.params.id, {
                 $set:req.body,
             });
             res.status(200).json("account is updated")
         } catch (err) {
             return res.status(500).json(err)
         } 
    } else {
        return res.status(403).json("You can only Update your account")
    }
})
//delete User

router.delete('/:id', async (req, res) => {
    if(req.body.userId === req.params.id || req.body.isAdmin) {
        try {
            const user = await User.findByIdAndDelete(req.params.id);
            res.status(200).json("account deleted successfully")
        } catch (err) {
            return res.status(500).json(err)
        } 
   } else {
       return res.status(403).json("You can only delete your account")
   }
})
//get User

router.get('/:id', async (req, res) => {
    try {
        const getUser = await User.findById(req.params.id);
        res.status(200).json(getUser);
    }catch (err) {
        return res.status(500).json(err)
    }
})

//follow user

router.put('/:id/follow', async (req, res) => {
    if (req.body.userId !== req.params.id) {
        try {
            const user = await User.findById(req.params.id);
            const currentUser = await User.findById(req.body.userId);
            if (!user.followers.includes(req.body.userId)) {
                await user.updateOne({ $push: { followers: req.body.userId }})
                await currentUser.updateOne({ $push : { following: req.params.id}})
                res.status(200).json('User is followed')
            } else {
                res.status(403).json("you already follow this user")
            }
        } catch (err) {
            res.status(500).json(err)
        }
    } else {
        return res.status(500).json("you can't follow yourself")
    }
})
//unfollow user

router.delete('/:id/unfollow', async (req, res) => {
    if (req.body.userId !== req.params.id) {
        try {
            const user = await User.findById(req.params.id);
            const currentUser = await User.findById(req.body.userId);
            if (user.followers.includes(req.body.userId)) {
                await user.updateOne({ $pull: { followers: req.body.userId }})
                await currentUser.updateOne({ $pull : { following: req.params.id}})
                res.status(200).json('User is unfollowed')
            } else {
                res.status(403).json("you don't follow this user")
            }
        } catch (err) {
            res.status(500).json(err)
        }
    } else {
        return res.status(500).json("you can't follow yourself")
    }
})

module.exports = router;