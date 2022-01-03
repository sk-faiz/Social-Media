const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
    userId: {
        type: 'string',
        required: true
    },
    Postdesc: {
        type: 'string',
        max:500
    },
    img: {
        type: 'string',
    },
    likes: {
        type: 'array',
        default: []
    }
},
{timestamps: true}
)

module.exports = mongoose.model("Post", PostSchema);