const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: {
        type: 'string',
        required: true,
        unique: true
    },
    email: { 
        type: 'string', 
        required:true,
        min:50,
        unique: true
    },
    password: {
        type: 'string',
        required: true,
        min:6
    },
    profilePic: {
        type: 'string',
        default: ''
    },
    coverPic: {
        type: 'string',
        default: ''
    },
    followers: {
        type: 'array',
        default: []
    },
    following: {
        type: 'array',
        default: []
    },
    postsLiked: {
        type: 'array',
        default: []
    },
    isAdmin: {
        type: 'boolean',
        default: false
    },
    desc: {
        type: 'string',
        max: 50
    },
    city: {
        type: 'string',
        max:50
    },
    from: {
        type: 'string',
        max:50
    },
    relationship: {
        type: Number,
        enum:[1,2,3]
    }
},
{timestamps: true}
)

module.exports = mongoose.model("User", UserSchema);